import { useState, useEffect } from 'react';

let quizData = null;

async function loadQuizData() {
  if (quizData) return quizData;
  try {
    const res = await fetch('/data/quizdata.json');
    quizData = await res.json();
    return quizData;
  } catch (e) {
    console.error('Failed to load quiz data:', e);
    return null;
  }
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
  
  useEffect(() => {
    loadQuizData().then(data => {
      if (data) {
        setQuizDataLocal(data);
        setLoaded(true);
      }
    });
  }, []);
  
  useEffect(() => {
    if (loaded && topic) {
      loadQuiz(topic);
    }
  }, [topic, loaded]);
  
  function getSections() {
    if (!quizDataLocal) return {};
    const sections = {};
    quizDataLocal.sections.forEach(section => {
      sections[section.id] = section;
    });
    return sections;
  }
  
  function loadQuiz(topicName) {
    const sections = getSections();
    let questionsList = [];
    
    if (showAllTopics) {
      questionsList = getAllQuestions();
    } else if (sections[topicName]) {
      const section = sections[topicName];
      const allQ = [];
      section.quizzes.forEach(qz => {
        allQ.push(...qz.questions);
      });
      questionsList = allQ;
    }
    
    const normalized = questionsList.map(q => normalizeQuestion(q));
    const shuffled = shuffleArray([...normalized]);
    setQuestions(shuffled);
    setCurrentQ(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setShowExplanation(false);
    
    if (shuffled.length > 0) {
      initOptions(shuffled[0]);
    }
  }
  
  function normalizeQuestion(q) {
    if (q.t === 'bool') {
      return { q: q.q, options: ['Vero', 'Falso'], correct: q.c, type: 'bool' };
    }
    return { q: q.q, options: q.o, correct: q.c };
  }
  
  function getAllQuestions() {
    if (!quizDataLocal) return [];
    const all = [];
    quizDataLocal.sections.forEach(section => {
      section.quizzes.forEach(quiz => {
        quiz.questions.forEach(q => {
          all.push(normalizeQuestion(q));
        });
      });
    });
    return all;
  }
  
  function initOptions(q) {
    if (q.type === 'bool' || !q.options) {
      setOptionOrder([0, 1]);
    } else {
      const indices = q.options.map((_, i) => i);
      setOptionOrder(shuffleArray(indices));
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
  
  function getCorrectIndex() {
    const q = questions[currentQ];
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
    if (idx === correctIdx) {
      setScore(s => s + 1);
    }
    
    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ(c => c + 1);
        setSelected(null);
        setShowExplanation(false);
        initOptions(questions[currentQ + 1]);
      } else {
        setFinished(true);
        if (onComplete) {
          onComplete(score + (idx === correctIdx ? 1 : 0));
        }
      }
    }, 1500);
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Quiz Completato!</h3>
        <p className="text-lg text-slate-400 mb-2">
          Punteggio: <span className="font-bold text-green-400">{score}/{questions.length}</span>
        </p>
        <p className="text-sm text-slate-500 mb-6">{percent}% corrette</p>
        <button 
          onClick={() => loadQuiz(topic)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 cursor-pointer"
        >
          Ripeti Quiz
        </button>
      </div>
    );
  }
  
  const q = questions[currentQ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Domanda {currentQ + 1} di {questions.length}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Punteggio:</span>
          <span className="font-semibold text-white">{score}</span>
        </div>
      </div>
      
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>
      
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-6">{q.q}</h3>
        
        <div className="space-y-3">
          {optionOrder.map((idx) => {
            const isCorrect = getCorrectIndex() === idx;
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selected !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  selected === null 
                    ? 'border-slate-600 hover:border-indigo-500 hover:bg-indigo-500/10' 
                    : isCorrect
                      ? 'border-green-500 bg-green-500/20'
                      : selected === idx
                        ? 'border-red-500 bg-red-500/20'
                        : 'border-slate-600 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold ${
                    selected === null 
                      ? 'bg-slate-700 text-slate-300'
                      : isCorrect
                        ? 'bg-green-500 text-white'
                        : selected === idx
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-700 text-slate-300'
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
          <div className={`mt-6 p-4 rounded-xl ${
            selected === getCorrectIndex() ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <div className="flex items-center gap-2">
              {selected === getCorrectIndex() ? (
                <>
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-green-400">Corretto!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-red-400">Sbagliato</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}