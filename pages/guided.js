import { useEffect, useState } from 'react';
import Link from 'next/link';
import CodeViewer from '../components/CodeViewer';
import Quiz from '../components/Quiz';

const chapters = [
  { id: 'base', title: 'Concetti Fondamentali', tag: 'base' },
  { id: 'semaphore', title: 'Semafori', tag: 'semaphore' },
  { id: 'queue', title: 'BlockingCollection', tag: 'queue' },
  { id: 'busywait', title: 'Busy Waiting', tag: 'busywait' },
  { id: 'pipe', title: 'Named Pipe', tag: 'pipe' },
  { id: 'socket', title: 'Socket TCP', tag: 'socket' },
  { id: 'summary', title: 'Riepilogo', tag: 'summary' },
];

export default function GuidedPath() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [progress, setProgress] = useState({ chapters: {} });
  const [showBlocker, setShowBlocker] = useState(false);
  const [blockingChapter, setBlockingChapter] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pc_progress');
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      setProgress({ chapters: {} });
    }
  }, []);

  const chapter = chapters[currentChapter];
  const prevChapterId = chapters[currentChapter - 1]?.id;
  const isUnlocked = currentChapter === 0 || progress.chapters?.[prevChapterId];

  const handleChapterClick = (idx) => {
    if (idx > 0 && idx < chapters.length) {
      const prevId = chapters[idx - 1]?.id;
      if (!progress.chapters?.[prevId]) {
        setBlockingChapter(chapters[idx].title);
        setShowBlocker(true);
        return;
      }
    }
    setCurrentChapter(idx);
    setQuizComplete(false);
    setShowQuiz(false);
  };

  const saveProgress = (chapterId) => {
    try {
      const newProgress = { 
        ...progress, 
        chapters: { ...progress.chapters, [chapterId]: true }
      };
      setProgress(newProgress);
      localStorage.setItem('pc_progress', JSON.stringify(newProgress));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {showBlocker && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md border border-red-500/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Capitolo Bloccato</h3>
              <p className="text-slate-400 mb-4">
                Completa prima il capitolo <strong className="text-white">{blockingChapter}</strong>
              </p>
              <button 
                onClick={() => setShowBlocker(false)}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-500 cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="fixed left-0 top-0 w-72 h-screen bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 p-4 overflow-y-auto hidden lg:block z-40">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Torna alla Home
          </Link>
        </div>
        
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Percorso Guidato
        </h2>
        
        <nav className="space-y-2">
          {chapters.map((ch, idx) => {
            const complete = progress.chapters?.[ch.id];
            const unlocked = idx === 0 || progress.chapters?.[chapters[idx - 1]?.id];
            const active = idx === currentChapter;
            return (
              <button
                key={ch.id}
                onClick={() => handleChapterClick(idx)}
                disabled={!unlocked}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                  active 
                    ? 'bg-indigo-500/20 border border-indigo-500/50' 
                    : unlocked 
                      ? 'hover:bg-slate-700/50 border border-transparent'
                      : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    complete ? 'bg-green-500/20 text-green-400' : !unlocked ? 'bg-slate-700 text-slate-600' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {complete ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : !unlocked ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${active ? 'text-white' : unlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                      {ch.title}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progresso</span>
            <span className="text-sm font-semibold text-white">
              {Object.keys(progress.chapters || {}).length}/{chapters.length}
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(Object.keys(progress.chapters || {}).length / chapters.length) * 100}%` }}
            />
          </div>
        </div>
      </aside>

      <main className="lg:ml-72 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <span>Capitolo {currentChapter + 1}</span>
              <span>•</span>
              <span>{chapters.length} totali</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              {chapter.title}
            </h1>
            
            {!isUnlocked ? (
              <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-6 text-center">
                <p className="text-red-400">Completa il capitolo precedente per accedere.</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-8">
                  <button 
                    onClick={() => { setShowQuiz(false); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                      !showQuiz 
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    Contenuto
                  </button>
                  <button 
                    onClick={() => { setShowQuiz(true); }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                      showQuiz 
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    Quiz
                  </button>
                </div>

                {!showQuiz && (
                  <div className="card bg-slate-800/50 border border-slate-700/50">
                    <Quiz topic={chapter.tag} onComplete={() => { setQuizComplete(true); saveProgress(chapter.id); }} />
                  </div>
                )}

                {showQuiz && (
                  <div className="card bg-slate-800/50 border border-slate-700/50">
                    {!quizComplete ? (
                      <Quiz topic={chapter.tag} onComplete={(score) => { setQuizComplete(true); saveProgress(chapter.id); }} />
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Quiz Completato!</h3>
                        <p className="text-slate-400 mb-6">Capitolo segnato come completato.</p>
                        <button 
                          onClick={() => setShowQuiz(false)}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 cursor-pointer"
                        >
                          Torna al Contenuto
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between mt-8 pt-8 border-t border-slate-700/50">
              <button
                onClick={() => handleChapterClick(Math.max(0, currentChapter - 1))}
                disabled={currentChapter === 0}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Precedente
              </button>
              
              <button
                onClick={() => handleChapterClick(Math.min(chapters.length - 1, currentChapter + 1))}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer"
              >
                {currentChapter < chapters.length - 1 ? 'Successivo' : 'Fine'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}