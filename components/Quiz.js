import { useState, useEffect, useRef } from 'react';

let quizDataCache = null;

async function loadQuizData() {
  if (quizDataCache) return quizDataCache;
  try {
    const res = await fetch('/data/quizdata.json');
    quizDataCache = await res.json();
    return quizDataCache;
  } catch (e) {
    console.error('Failed to load quiz data:', e);
    return null;
  }
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function normalizeQuestion(q) {
  if (q.t === 'bool') {
    return { q: q.q, options: ['Vero', 'Falso'], correct: q.c, type: 'bool' };
  }
  return { q: q.q, options: q.o, correct: q.c };
}

export default function Quiz({ topic, onComplete, showAllTopics = false }) {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [optionOrder, setOptionOrder] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [quizDataLocal, setQuizDataLocal] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showWrong, setShowWrong] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    loadQuizData().then(data => {
      if (data) {
        setQuizDataLocal(data);
        setLoaded(true);
      }
    });
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (loaded && topic) {
      loadQuiz(topic);
    }
  }, [topic, loaded]);

  function loadQuiz(topicName) {
    if (!quizDataLocal) return;
    
    let questionsList = [];
    const section = quizDataLocal.sections.find(s => s.id === topicName);
    
    if (section && section.quizzes && section.quizzes.length > 0) {
      const randomIndex = Math.floor(Math.random() * section.quizzes.length);
      questionsList = section.quizzes[randomIndex].questions || [];
    }
    
    const limited = questionsList.slice(0, 10);
    const normalized = limited.map(q => normalizeQuestion(q));
    const shuffled = shuffleArray([...normalized]);
    
    setQuestions(shuffled);
    setCurrentQ(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setShowExplanation(false);
    setUserAnswers([]);
    setShowWrong(false);
    
    if (shuffled.length > 0) {
      initOptions(shuffled[0]);
    }
  }

  function initOptions(q) {
    if (q.type === 'bool' || !q.options) {
      setOptionOrder([0, 1]);
    } else {
      const indices = q.options.map((_, i) => i);
      setOptionOrder(shuffleArray(indices));
    }
  }

  function getCorrectIndex() {
    const q = questions[currentQ];
    if (!q) return 0;
    if (q.type === 'bool') return q.correct;
    return q.correct;
  }

  function getOptionLabel(idx) {
    const q = questions[currentQ];
    if (q.type === 'bool' || !q.options) {
      return idx === 0 ? 'Vero' : 'Falso';
    }
    return q.options[idx] || `Opzione ${idx}`;
  }

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    
    const correctIdx = getCorrectIndex();
    const isCorrect = idx === correctIdx;
    
    if (isCorrect) {
      setScore(s => s + 1);
    }
    
    setUserAnswers(prev => [...prev, {
      question: questions[currentQ],
      userAnswer: idx,
      correctAnswer: correctIdx,
      isCorrect
    }]);
    
    timeoutRef.current = setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ(c => c + 1);
        setSelected(null);
        setShowExplanation(false);
        initOptions(questions[currentQ + 1]);
      } else {
        setFinished(true);
        if (onComplete) {
          onComplete(score + (isCorrect ? 1 : 0));
        }
      }
    }, 2500);
  };

  const goBack = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (currentQ > 0) {
      const prevAnswer = userAnswers[userAnswers.length - 1];
      setCurrentQ(c => c - 1);
      setSelected(null);
      setShowExplanation(false);
      initOptions(questions[currentQ - 1]);
      if (prevAnswer) {
        if (prevAnswer.isCorrect) {
          setScore(s => s - 1);
        }
        setUserAnswers(prev => prev.slice(0, -1));
      }
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400">
        Caricamento quiz...
      </div>
    );
  }

  if (finished) {
    const wrongAnswers = userAnswers.filter(a => !a.isCorrect);
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify- center ${percent >= 70 ? 'bg-green-500' : percent >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
            <span className="text-4xl font-bold text-white">{percent}%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Quiz Completato!</h3>
          <p className="text-lg text-slate-400 mb-2">
            Punteggio: <span className="font-bold text-green-400">{score}/{questions.length}</span>
          </p>
          
          {wrongAnswers.length > 0 && (
            <button onClick={() => setShowWrong(!showWrong)} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-500 cursor-pointer mb-4">
              {showWrong ? 'Nascondi errori' : 'Vedi dove hai sbagliato'}
            </button>
          )}
          
          <button onClick={() => loadQuiz(topic)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 cursor-pointer block mx-auto">
            Ripeti Quiz
          </button>
        </div>
        
        {showWrong && wrongAnswers.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Errori:</h4>
            {wrongAnswers.map((answer, idx) => (
              <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-white font-medium mb-2">{answer.question.q}</p>
                <p className="text-red-400 text-sm">La tua risposta: {getOptionLabel(answer.userAnswer)}</p>
                <p className="text-green-400 text-sm">Risposta corretta: {getOptionLabel(answer.correctAnswer)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <button onClick={goBack} disabled={currentQ === 0} className={`px-3 py-1 rounded-lg text-sm cursor-pointer ${currentQ === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
            Indietro
          </button>
          <span className="text-slate-400">Domanda {currentQ + 1} di {questions.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Punteggio:</span>
          <span className="font-semibold text-white">{score}</span>
        </div>
      </div>
      
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
      </div>
      
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-6">{q.q}</h3>
        
        <div className="space-y-3">
          {optionOrder.map((idx) => {
            const isCorrect = getCorrectIndex() === idx;
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={selected !== null} className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                selected === null ? 'border-slate-600 hover:border-indigo-500 hover:bg-indigo-500/10' : isCorrect ? 'border-green-500 bg-green-500/20' : selected === idx ? 'border-red-500 bg-red-500/20' : 'border-slate-600 opacity-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold ${
                    selected === null ? 'bg-slate-700 text-slate-300' : isCorrect ? 'bg-green-500 text-white' : selected === idx ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-slate-200">{getOptionLabel(idx)}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {showExplanation && (
          <div className={`mt-6 p-4 rounded-xl ${selected === getCorrectIndex() ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <div className="flex items-center gap-2">
              {selected === getCorrectIndex() ? (
                <span className="font-semibold text-green-400">Corretto!</span>
              ) : (
                <span className="font-semibold text-red-400">Sbagliato</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}