import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Quiz = dynamic(() => import('../components/Quiz'), { ssr: false });

const defaultSections = [
  { id: 'base', title: 'Concetti Base', count: 10 },
  { id: 'semaphore', title: 'Semafori', count: 10 },
  { id: 'queue', title: 'BlockingCollection', count: 10 },
  { id: 'busywait', title: 'Busy Waiting', count: 10 },
  { id: 'thread', title: 'Thread in C#', count: 10 },
  { id: 'pipe', title: 'Named Pipe', count: 10 },
  { id: 'socket', title: 'Socket TCP', count: 10 },
  { id: 'memory', title: 'Memoria Condivisa', count: 10 },
  { id: 'comparison', title: 'Confronto Pattern', count: 10 },
  { id: 'advanced', title: 'Approfondimenti', count: 10 },
  { id: 'all', title: 'TUTTO il Programma', count: 100 },
];

export default function QuizLiberi() {
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSection === 'all') {
      setQuizList([]);
      setSelectedQuiz(null);
      return;
    }
    setLoading(true);
    fetch('/data/quizdata.json')
      .then(res => res.json())
      .then(data => {
        const section = data.sections.find(s => s.id === selectedSection);
        if (section) {
          setQuizList(section.quizzes.map((q, i) => ({ id: q.id, title: q.title, index: i + 1 })));
        } else {
          setQuizList([]);
        }
        setSelectedQuiz(null);
        setLoading(false);
      })
      .catch(() => {
        setQuizList([]);
        setLoading(false);
      });
  }, [selectedSection]);

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    if (sectionId === 'all') {
      setSelectedQuiz(null);
      setQuizList([]);
    }
  };

  const handleBackToSections = () => {
    setSelectedSection('all');
    setSelectedQuiz(null);
    setQuizList([]);
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800/50 border-b border-slate-700/50 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Liberi</h1>
            <p className="text-slate-400">
              {selectedQuiz 
                ? selectedQuiz.title 
                : selectedSection === 'all' 
                  ? 'Scegli una sezione e poi un quiz!' 
                  : 'Scegli un quiz!'}
            </p>
          </div>
          <div className="flex gap-3">
            {selectedQuiz && (
              <button 
                onClick={handleBackToQuizzes}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Scegli altro quiz
              </button>
            )}
            {selectedSection !== 'all' && !selectedQuiz && (
              <button 
                onClick={handleBackToSections}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Altre sezioni
              </button>
            )}
            <a href="/" className="text-slate-400 hover:text-white transition-colors">← Home</a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {!selectedQuiz && selectedSection !== 'all' && quizList.length > 0 && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-3">
              {quizList.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => {
                    setSelectedQuiz({ id: `${selectedSection}.${quiz.id}`, title: quiz.title });
                  }}
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

        {!selectedQuiz && (selectedSection === 'all' || loading) && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-3">
              {defaultSections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`p-4 rounded-xl text-left transition-all cursor-pointer ${
                    selectedSection === section.id 
                      ? 'bg-indigo-600 border-2 border-indigo-400' 
                      : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-indigo-400 uppercase">Sezione {idx + 1}</span>
                      <h3 className="font-semibold text-white">{section.title}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <span className="text-indigo-400 font-bold">{section.count}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedQuiz && (
          <div className="card bg-slate-800/50 border border-slate-700/50">
            <Quiz topic={selectedQuiz.id} showAllTopics={false} />
          </div>
        )}

        {selectedSection === 'all' && !selectedQuiz && (
          <div className="card bg-slate-800/50 border border-slate-700/50">
            <Quiz topic="all" showAllTopics={true} />
          </div>
        )}

        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="font-bold text-amber-400 mb-4">💡 Come funziona</h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• <strong className="text-white">10 sezioni</strong> da 10 quiz da 10 domande ciascuna</li>
            <li>• <strong className="text-white">1000 domande</strong> totali</li>
            <li>• Ogni quiz ha domande in ordine casuale</li>
            <li>• Ripeti per imparare!</li>
            <li>• Vero/Falso e scelta multipla</li>
          </ul>
        </div>
      </main>
    </div>
  );
}