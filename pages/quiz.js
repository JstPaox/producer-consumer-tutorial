import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Quiz = dynamic(() => import('../components/Quiz'), { ssr: false });

const defaultSections = [
  { id: 'base', title: 'Concetti Base', count: 100 },
  { id: 'semaphore', title: 'Semafori', count: 100 },
  { id: 'queue', title: 'BlockingCollection', count: 100 },
  { id: 'busywait', title: 'Busy Waiting', count: 100 },
  { id: 'thread', title: 'Thread in C#', count: 100 },
  { id: 'pipe', title: 'Named Pipe', count: 100 },
  { id: 'socket', title: 'Socket TCP', count: 100 },
  { id: 'memory', title: 'Memoria Condivisa', count: 100 },
  { id: 'comparison', title: 'Confronto Pattern', count: 100 },
  { id: 'advanced', title: 'Approfondimenti', count: 100 },
  { id: 'all', title: 'TUTTO il Programma', count: 1000 },
];

export default function QuizLiberi() {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [quizSections, setQuizSections] = useState(defaultSections);

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800/50 border-b border-slate-700/50 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Liberi</h1>
            <p className="text-slate-400">Scegli una sezione e mettiti alla prova!</p>
          </div>
          <a href="/" className="text-slate-400 hover:text-white transition-colors">← Torna alla Home</a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="grid md:grid-cols-2 gap-3">
            {quizSections.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => setSelectedTopic(section.id)}
                className={`p-4 rounded-xl text-left transition-all cursor-pointer ${
                  selectedTopic === section.id 
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

        <div className="card bg-slate-800/50 border border-slate-700/50">
          <Quiz topic={selectedTopic} showAllTopics={selectedTopic === 'all'} />
        </div>

        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <h3 className="font-bold text-amber-400 mb-4">💡 Come funziona</h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• <strong className="text-white">10 sezioni</strong> da 10 quiz da 10 domande ciascuna</li>
            <li>• <strong className="text-white">1000 domande</strong> totali nella sezione "TUTTO il Programma"</li>
            <li>• Ogni quiz ha domande in ordine casuale</li>
            <li>• Ripeti per imparare!</li>
            <li>• Vero/Falso e scelta multipla</li>
          </ul>
        </div>
      </main>
    </div>
  );
}