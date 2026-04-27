import { useEffect, useState } from 'react';
import CodeViewer from '../components/CodeViewer';
import Quiz from '../components/Quiz';
import Simulator from '../components/Simulator';
import Link from 'next/link';

export default function FreePath() {
  const [data, setData] = useState(null);
  const [selectedTag, setSelectedTag] = useState('all');
  
  useEffect(() => {
    fetch('/data/docdata.json').then(r => r.json()).then(setData);
  }, []);
  
  if (!data) return <div className="p-8">Caricamento...</div>;
  
  const allTags = [...new Set(data.codeBlocks?.flatMap(b => b.tags) || [])];
  const filtered = selectedTag === 'all' ? data.codeBlocks : data.codeBlocks?.filter(b => b.tags.includes(selectedTag)) || [];
  
  return (
    <div className="min-h-screen bg-[#EEF2FF] dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="cursor-pointer text-[#4F46E5] hover:underline mb-4 inline-block">← Home</Link>
        <h1 className="text-3xl font-bold text-[#1E1B4B] dark:text-white mb-6">Percorso Libero</h1>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setSelectedTag('all')} className={`cursor-pointer px-3 py-1 rounded-full text-sm ${selectedTag === 'all' ? 'bg-[#4F46E5] text-white' : 'bg-white dark:bg-gray-800 border'}`}>Tutti</button>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setSelectedTag(tag)} className={`cursor-pointer px-3 py-1 rounded-full text-sm ${selectedTag === tag ? 'bg-[#4F46E5] text-white' : 'bg-white dark:bg-gray-800 border'}`}>{tag}</button>
          ))}
        </div>
        
        <div className="space-y-8">
          {filtered.map(block => (
            <div key={block.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex gap-2 mb-3 flex-wrap">
                {block.tags.map(t => <span key={t} className="px-2 py-1 bg-[#EEF2FF] dark:bg-gray-700 text-[#4F46E5] text-xs rounded">{t}</span>)}
              </div>
              <CodeViewer code={block.code} title={`Listato ${block.id}`} showCommented />
              <details className="mt-4">
                <summary className="cursor-pointer text-[#4F46E5] hover:underline">Quiz opzionale</summary>
                <Quiz topic={block.tags[0]} onComplete={() => {}} />
              </details>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#1E1B4B] dark:text-white mb-4">Prova il Simulatore</h2>
          <Simulator model="semaphore" />
        </div>
      </div>
    </div>
  );
}
