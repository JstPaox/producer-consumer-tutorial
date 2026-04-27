import Link from 'next/link';
import { useEffect, useState } from 'react';

const sections = [
  { id: 'base', label: 'Concetti Base', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { id: 'semaphore', label: 'Semafori', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'queue', label: 'BlockingCollection', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { id: 'busywait', label: 'Busy Waiting', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'pipe', label: 'Named Pipe', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { id: 'sharedmem', label: 'Shared Memory', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
  { id: 'socket', label: 'Socket TCP', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
  { id: 'summary', label: 'Riepilogo', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-6M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
];

export default function Sidebar({ currentSection, onSectionComplete }) {
  const [progress, setProgress] = useState([]);
  
  useEffect(() => {
    const p = JSON.parse(localStorage.getItem('progress') || '[]');
    setProgress(p);
  }, []);
  
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 shadow-lg p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-[#1E1B4B] dark:text-white mb-6">Argomenti</h2>
      <nav className="space-y-2">
        {sections.map(sec => {
          const done = progress.includes(sec.id);
          return (
            <Link key={sec.id} href={`/guided#${sec.id}`}>
              <div className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${currentSection === sec.id ? 'bg-[#4F46E5] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sec.icon} />
                </svg>
                <span className="text-sm">{sec.label}</span>
                {done && <svg className="w-4 h-4 ml-auto text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
