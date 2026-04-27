import Simulator from '../components/Simulator';
import { useState } from 'react';

export default function SimulatorPage() {
  const [model, setModel] = useState('semaphore');
  
  return (
    <div className="min-h-screen bg-[#EEF2FF] dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E1B4B] dark:text-white mb-6">Simulatore Visivo</h1>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          {['semaphore', 'queue', 'pipe', 'sharedmem', 'socket'].map(m => (
            <button key={m} onClick={() => setModel(m)} className={`cursor-pointer px-4 py-2 rounded-lg transition-colors duration-200 ${model === m ? 'bg-[#4F46E5] text-white' : 'bg-white dark:bg-gray-800 border-2 border-gray-300'}`}>
              {m === 'semaphore' ? 'Semafori' : m === 'queue' ? 'Queue' : m === 'pipe' ? 'Pipe' : m === 'sharedmem' ? 'Shared Memory' : 'Socket TCP'}
            </button>
          ))}
        </div>
        
        <Simulator model={model} />
        
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-[#1E1B4B] dark:text-white mb-4">Cosa osservare</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• <strong>Buffer pieno:</strong> rallenta la velocità del consumatore, vedrai il buffer riempirsi</li>
            <li>• <strong>Produttore lento:</strong> rallenta il produttore, il consumatore starà in attesa</li>
            <li>• <strong>Semafori:</strong> osserva come i valori dei semafori regolano l'accesso</li>
            <li>• <strong>SoVRASCRITTURE:</strong> senza sincronizzazione, i dati possono essere persi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
