import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Quiz = dynamic(() => import('../components/Quiz'), { ssr: false });

const sectionsList = [
  { id: 'base', title: 'Concetti Base' },
  { id: 'semaphore', title: 'Semafori' },
  { id: 'queue', title: 'BlockingCollection' },
  { id: 'busywait', title: 'Busy Waiting' },
  { id: 'thread', title: 'Thread in C#' },
  { id: 'pipe', title: 'Named Pipe' },
  { id: 'socket', title: 'Socket TCP' },
  { id: 'memory', title: 'Memoria Condivisa' },
  { id: 'comparison', title: 'Confronto Pattern' },
  { id: 'advanced', title: 'Approfondimenti' },
];

export default function QuizPage() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('sections');
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    fetch('/data/quizdata.json')
      .then(r => r.json())
      .then(data => setQuizData(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedSection && quizData && currentView === 'quizzes') {
      const section = quizData.sections.find(s => s.id === selectedSection);
      if (section) {
        console.log('Loading quizzes for section:', selectedSection, 'count:', section.quizzes.length);
        setQuizList(section.quizzes.map((q, i) => ({ id: q.id, title: q.title, index: i + 1 })));
      }
    }
  }, [selectedSection, quizData, currentView]);

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    setSelectedQuiz(null);
    setCurrentView('quizzes');
  };

  const handleQuizClick = (quizId, title) => {
    setSelectedQuiz({ id: quizId, title: title });
    setCurrentView('quiz');
  };

  const handleBack = () => {
    if (currentView === 'quiz') {
      setSelectedQuiz(null);
      setCurrentView('quizzes');
    } else if (currentView === 'quizzes') {
      setSelectedSection(null);
      setCurrentView('sections');
      setQuizList([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800/50 border-b border-slate-700/50 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Liberi</h1>
            <p className="text-slate-400">
              {currentView === 'sections' && '1. Scegli una sezione'}
              {currentView === 'quizzes' && !selectedQuiz && '2. Scegli un quiz'}
              {currentView === 'quiz' && selectedQuiz?.title}
            </p>
          </div>
          <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors">
            ← Indietro
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {currentView === 'sections' && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-3">
              {sectionsList.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className="p-4 rounded-xl text-left transition-all cursor-pointer bg-slate-800/50 border-2 border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/10"
                >
                  <div>
                    <span className="text-xs text-indigo-400 uppercase">Sezione {idx + 1}</span>
                    <h3 className="font-semibold text-white">{section.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'quizzes' && !selectedQuiz && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-3">
              {quizList.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => handleQuizClick(`${selectedSection}.${quiz.id}`, quiz.title)}
                  className="p-4 rounded-xl text-left transition-all cursor-pointer bg-slate-800/50 border-2 border-slate-700 hover:border-indigo-500 hover:bg-indigo-500/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-indigo-400 uppercase">Quiz {quiz.index}</span>
                      <h3 className="font-semibold text-white">{quiz.title}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <span className="text-indigo-400 font-bold">10</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentView === 'quiz' && selectedQuiz && (
          <div className="card bg-slate-800/50 border border-slate-700/50">
            <Quiz topic={selectedQuiz.id} showAllTopics={false} />
          </div>
        )}

        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="font-bold text-amber-400 mb-4">Come funziona</h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>- 10 sezioni con 10 quiz ciascuna</li>
            <li>- Scegli una sezione</li>
            <li>- Scegli un quiz da 10 domande</li>
            <li>- Ogni quiz ha domande in ordine casuale</li>
          </ul>
        </div>
      </main>
    </div>
  );
}