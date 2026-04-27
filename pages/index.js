import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState({ chapters: {}, badges: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/data/docdata.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ codeBlocks: [], posts: [] }));
    
    const saved = localStorage.getItem('pc_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  const chapters = [
    { id: 'base', title: '1. Concetti Fondamentali', desc: 'Cos\'è il pattern P-C', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'blue' },
    { id: 'semaphore', title: '2. Semafori (Semaphore)', desc: 'Sincronizzazione con semafori', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'indigo' },
    { id: 'queue', title: '3. BlockingCollection', desc: 'Queue thread-safe .NET', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'purple' },
    { id: 'busywait', title: '4. Busy Waiting', desc: 'Problemi del polling', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'red' },
    { id: 'pipe', title: '5. Named Pipe', desc: 'IPC tra processi', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'cyan' },
    { id: 'socket', title: '6. Socket TCP', desc: 'Comunicazione di rete', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0', color: 'orange' },
    { id: 'summary', title: '7. Riepilogo', desc: 'Confronto finale', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-6M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'emerald' },
  ];

  const completedCount = Object.keys(progress.chapters || {}).length;
  const totalChapters = chapters.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-orange-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl">P-C Academy</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/free"><span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Tutti i Listati</span></Link>
          <button onClick={() => localStorage.clear() || window.location.reload()} className="text-slate-500 hover:text-red-400 text-sm cursor-pointer">Reset Progresso</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-300 text-sm font-medium">Guida di Studio Completa</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Produttore-<span className="text-orange-400">Consumatore</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4">
            Impara <strong className="text-white">tutti i pattern</strong> di comunicazione tra thread e processi in C#. 
            Ogni concetto, ogni listato, ogni dettaglio.
          </p>
          <p className="text-sm text-slate-500">
            Domani hai la verifica? Studia qui. Il sito contiene tutto quello che c'è nel documento.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-slate-800/50 rounded-2xl p-6 mb-10 border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">Il tuo progresso</span>
            <span className="text-lg font-bold text-green-400">{completedCount}/{totalChapters} capitoli</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(completedCount/totalChapters)*100}%` }} />
          </div>
          {completedCount === totalChapters && (
            <p className="text-center text-green-400 font-semibold mt-3">✅ Completo! Sei pronto per la verifica!</p>
          )}
        </div>

        {/* Capitolo 1: Fondamentali - Always visible */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Inizia da qui (obbligatorio)</h2>
          <Link href="/learn/base">
            <div className="card bg-blue-600/20 border-2 border-blue-500/50 hover:border-blue-400 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">1. Concetti Fondamentali</h3>
                  <p className="text-blue-300 text-sm">Cos'è il pattern P-C, perché serve, termini chiave</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Capitoli rimanenti */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Pattern di Sincronizzazione</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {chapters.slice(1, 5).map((ch, i) => {
              const done = progress.chapters?.[ch.id];
              const unlocked = i === 0 || progress.chapters?.[chapters[i]?.id];
              const ChapterLink = ({ children }) => done ? (
                <Link key={ch.id} href={`/learn/${ch.id}`}>{children}</Link>
              ) : (
                <div key={ch.id}>{children}</div>
              );
              return (
                <ChapterLink>
                  <div className={`card ${done ? 'bg-green-600/10 border-green-500/30' : done === false ? 'bg-slate-800/50 border-slate-700/50 opacity-50' : 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500 cursor-not-allowed'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${done ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                        {done ? '✓' : i + 2}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{ch.title}</h3>
                        <p className="text-slate-400 text-sm">{ch.desc}</p>
                      </div>
                    </div>
                  </div>
                </ChapterLink>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Comunicazione tra Processi</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {chapters.slice(5, 7).map((ch, i) => {
              const done = progress.chapters?.[ch.id];
              const idx = i + 5;
              const unlocked = idx === 0 || progress.chapters?.[chapters[idx - 1]?.id];
              const ChapterLink = ({ children }) => done || unlocked ? (
                <Link key={ch.id} href={`/learn/${ch.id}`}>{children}</Link>
              ) : (
                <div key={ch.id}>{children}</div>
              );
              return (
                <ChapterLink>
                  <div className={`card ${done ? 'bg-green-600/10 border-green-500/30' : 'bg-slate-800/50 border-slate-700/50 opacity-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${done ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                        {done ? '✓' : idx + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{ch.title}</h3>
                        <p className="text-slate-400 text-sm">{ch.desc}</p>
                      </div>
                    </div>
                  </div>
                </ChapterLink>
              );
            })}
          </div>
        </div>

        {/* Consigli studio */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-amber-400 mb-3">📋 Consigli per la verifica</h3>
          <ul className="text-slate-300 space-y-2 text-sm">
            <li>• Leggi la <strong className="text-white">spiegazione</strong> di ogni capitolo</li>
            <li>• Studia il <strong className="text-white">codice</strong> riga per riga</li>
            <li>• Ripeti i <strong className="text-white">quiz</strong> finché non li fai tutti giusti</li>
            <li>• Ricorda i <strong className="text-white">valori iniziali</strong> dei semafori (0, 1)</li>
            <li>• Sappi quando usare <strong className="text-white">WaitOne()</strong> vs <strong className="text-white">Release()</strong></li>
          </ul>
        </div>

        {/* Quiz Liberi */}
        <div className="mb-8">
          <Link href="/quiz">
            <div className="card bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-2 border-purple-500/50 hover:border-purple-400 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Quiz Liberi</h3>
                  <p className="text-purple-300 text-sm">Tante domande per esercitarti! 30+ domande random</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800 mt-16 py-6 text-center">
        <p className="text-slate-500 text-sm">P-C Academy • Studia tutto, prendi 10 🎯</p>
      </footer>
    </div>
  );
}