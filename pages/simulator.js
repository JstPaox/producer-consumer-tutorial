import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Simulator = dynamic(() => import('../components/Simulator'), { ssr: false });

export default function SimulatorPage() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/data/docdata.json')
      .then(r => r.json())
      .then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Simulatore Interattivo</h1>
            <p className="text-slate-400">Visualizza e sperimenta i pattern P-C in tempo reale</p>
          </div>
          <a href="/" className="text-slate-400 hover:text-white transition-colors">
            ← Torna alla Home
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Instructions */}
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Come usare il simulatore</h2>
              <ul className="text-slate-400 space-y-2">
                <li>• Seleziona un modello dal menu a tendina</li>
                <li>• Regola la velocità di simulazione</li>
                <li>• Osserva il flusso di dati nel buffer circolare</li>
                <li>• Segui i semafori che si alternano</li>
                <li>• Prova diversi scenari: produttore veloce, consumatore lento, ecc.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Simulator */}
        <Simulator />
        
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="card bg-slate-800/50 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2">Buffer Circolare</h3>
            <p className="text-sm text-slate-400">
              Array di dimensione fissa dove la testa e la coda si muovono ciclicamente.
              Quando raggiunge la fine, torna all'inizio.
            </p>
          </div>
          <div className="card bg-slate-800/50 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2">Semafori</h3>
            <p className="text-sm text-slate-400">
              Contatori che bloccano/sbloccano thread. 
              semc=1 → consumatore può leggere, 
              semp=1 → produttore può scrivere.
            </p>
          </div>
          <div className="card bg-slate-800/50 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2">Sincronizzazione</h3>
            <p className="text-sm text-slate-400">
              Produttore scrive → sblocco consumatore.
              Consumatore legge → sblocco produttore.
              Mai simultanei!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}