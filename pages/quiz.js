import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Quiz = dynamic(() => import('../components/Quiz'), { ssr: false });

const defaultSections = [
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

const sectionTitles = {
  base: 'Concetti Fondamentali',
  semaphore: 'Semafori',
  queue: 'BlockingCollection',
  busywait: 'Busy Waiting',
  thread: 'Thread in C#',
  pipe: 'Named Pipe',
  socket: 'Socket TCP',
  memory: 'Memoria Condivisa',
  comparison: 'Confronto Pattern',
  advanced: 'Approfondimenti',
};

export default function QuizLiberi() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('sections');

  useEffect(() => {
    if (selectedSection && step === 'quizzes') {
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
          setLoading(false);
        })
        .catch(() => {
          setQuizList([]);
          setLoading(false);
        });
    }
  }, [selectedSection, step]);

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    setStep('quizzes');
    setSelectedQuiz(null);
    setQuizList([]);
  };

  const handleBack = () => {
    if (selectedQuiz) {
      setSelectedQuiz(null);
    } else if (step === 'quizzes') {
      setStep('sections');
      setSelectedSection(null);
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
              {step === 'sections' && 'Scegli una sezione!'}
              {step === 'quizzes' && !selectedQuiz && 'Scegli un quiz!'}
              {selectedQuiz && selectedQuiz.title}
            </p>
          </div>
          <button 
            onClick={handleBack}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Indietro
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {!loading && step === 'sections' && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-3">
              {defaultSections.map((section, idx) => (
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

        {!loading && step === 'quizzes' && !selectedQuiz && (
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-3">
              {quizList.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => setSelectedQuiz({ id: `${selectedSection}.${quiz.id}`, title: quiz.title })}
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

        {selectedQuiz && (
          <div className="card bg-slate-800/50 border border-slate-700/50">
            <Quiz topic={selectedQuiz.id} showAllTopics={false} />
          </div>
        )}

        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="font-bold text-amber-400 mb-4">💡 Come funziona</h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• <strong className="text-white">10 sezioni</strong> da 10 quiz da 10 domande ciascuna</li>
            <li>• <strong className="text-white">1000 domande</strong> totali</li>
            <li>• Ogni quiz ha domande in ordine casuale</li>
            <li>• Ripeti per imparare!</li>
          </ul>
        </div>
      </main>
    </div>
  );
}