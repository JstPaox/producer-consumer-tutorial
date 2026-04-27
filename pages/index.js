import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data/docdata.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ codeBlocks: [], posts: [] }));
  }, []);

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#1E1B4B]">Produttore-Consumatore</h1>
        <button onClick={() => document.documentElement.classList.toggle('dark')} className="cursor-pointer px-3 py-1 rounded border border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-colors duration-200">
          Tema
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-[#1E1B4B] mb-4">Modelli Produttore/Consumatore in C#</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Corso completo sui pattern di comunicazione inter-thread e inter-processo in C#.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/guided">
              <a className="cursor-pointer bg-[#4F46E5] text-white px-6 py-3 rounded-lg hover:bg-[#4338CA] transition-colors duration-200 font-semibold">
                Percorso Guidato
              </a>
            </Link>
            <Link href="/free">
              <a className="cursor-pointer bg-[#F97316] text-white px-6 py-3 rounded-lg hover:bg-[#EA580C] transition-colors duration-200 font-semibold">
                Percorso Libero
              </a>
            </Link>
            <Link href="/simulator">
              <a className="cursor-pointer border-2 border-[#4F46E5] text-[#4F46E5] px-6 py-3 rounded-lg hover:bg-[#4F46E5] hover:text-white transition-colors duration-200 font-semibold">
                Simulatore
              </a>
            </Link>
          </div>
        </div>

        {data && (
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <StatCard title="Listati C#" value={data.codeBlocks?.length || 0} desc="Esempi dal .docx" />
            <StatCard title="Argomenti" value={new Set(data.codeBlocks?.flatMap(b => b.tags)).size} desc="Semafori, Queue, Pipe..." />
            <StatCard title="Progresso" value={typeof window !== 'undefined' ? (localStorage.getItem('progress') ? JSON.parse(localStorage.getItem('progress')).length : 0) : 0} desc="Quiz completati" />
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, desc }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border-2 border-[#4F46E5]/20">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-bold text-[#1E1B4B]">{value}</p>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
