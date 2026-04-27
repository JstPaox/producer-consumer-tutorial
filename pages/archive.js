import { useEffect, useState } from 'react';

export default function Archive() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/data/docdata.json').then(r => r.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Archivio Sorgente</h1>
            <p className="text-slate-400">Contenuti estratti da <strong className="text-white">TPSIT - Dizionario.docx</strong></p>
          </div>
          <a href="/" className="text-slate-400 hover:text-white transition-colors">
            ← Torna alla Home
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Posts */}
        {data.posts?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Post del Documento</h2>
            <div className="space-y-4">
              {data.posts.map((post, idx) => (
                <div key={idx} className="card bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{post.title}</h3>
                      <p className="text-sm text-slate-400">Autore: {post.author}</p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-500/20 rounded-lg">
                      <span className="text-indigo-400 font-medium">{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Blocks */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Listati C# Estratti <span className="text-slate-400">({data.codeBlocks?.length})</span>
          </h2>
          <div className="space-y-6">
            {data.codeBlocks?.map(block => (
              <div key={block.id} className="card bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-lg">Listato {block.id}</h3>
                  <div className="flex gap-2">
                    {block.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl overflow-x-auto text-sm font-mono whitespace-pre-wrap">{block.code}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}