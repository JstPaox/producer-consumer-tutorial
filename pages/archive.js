import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Archive() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/data/docdata.json').then(r => r.json()).then(setData);
  }, []);
  
  if (!data) return <div className="p-8">Caricamento archivio...</div>;
  
  return (
    <div className="min-h-screen bg-[#EEF2FF] dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="cursor-pointer text-[#4F46E5] hover:underline mb-4 inline-block">← Home</Link>
        <h1 className="text-3xl font-bold text-[#1E1B4B] dark:text-white mb-2">Archivio .docx</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Sorgente: <strong>TPSIT - Dizionario.docx</strong></p>
        
        <div className="space-y-6">
          {data.posts?.map((post, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-bold text-[#1E1B4B] dark:text-white">{post.title}</h2>
                  <p className="text-sm text-gray-500">Autore: {post.author} | Data: {post.date}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-[#1E1B4B] dark:text-white mb-4">Listati C# Estratti ({data.codeBlocks?.length})</h2>
            <div className="space-y-4">
              {data.codeBlocks?.map(block => (
                <div key={block.id} className="border-l-4 border-[#4F46E5] pl-4">
                  <h3 className="font-semibold text-[#1E1B4B] dark:text-white">Listato {block.id}</h3>
                  <p className="text-sm text-gray-500 mb-2">Tags: {block.tags.join(', ')}</p>
                  <pre className="bg-[#1E1B4B] text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">{block.code}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
