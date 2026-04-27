import { useEffect, useState } from 'react';

export default function CodeViewer({ code, title, showCommented = false }) {
  const [commented, setCommented] = useState('');
  
  useEffect(() => {
    if (showCommented) {
      setCommented(generateCommented(code));
    }
  }, [code, showCommented]);
  
  return (
    <div className="bg-[#1E1B4B] rounded-xl overflow-hidden shadow-lg border-2 border-[#4F46E5]/30">
      <div className="bg-[#4F46E5] px-4 py-2 flex justify-between items-center">
        <span className="text-white text-sm font-semibold">{title || 'Listato C#'}</span>
        {showCommented && (
          <button onClick={() => setCommented(commented ? '' : generateCommented(code))} className="cursor-pointer text-white text-xs hover:underline">
            {commented ? 'Nascondi' : 'Mostra'} commenti
          </button>
        )}
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono leading-relaxed">
        <code>{commented || code}</code>
      </pre>
    </div>
  );
}

function generateCommented(code) {
  const lines = code.split('\n');
  const commented = [];
  let inBlock = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('using ')) {
      commented.push(line + '  // Importa namespace necessari');
    } else if (trimmed.startsWith('namespace ')) {
      commented.push(line + '  // Definisce lo spazio dei nomi');
    } else if (trimmed.match(/static\s+(int|Semaphore)\s+\w+/)) {
      commented.push(line + '  // Variabile globale condivisa tra thread');
    } else if (trimmed.match(/static\s+void\s+(prod|cons|Prod|Cons)/)) {
      commented.push(line);
      commented.push('  // Metodo del ' + (trimmed.includes('prod') ? 'produttore' : 'consumatore'));
    } else if (trimmed.includes('WaitOne()')) {
      commented.push(line + '  // Attende che il semaforo sia disponibile (bloccante)');
    } else if (trimmed.includes('Release()')) {
      commented.push(line + '  // Rilascia il semaforo per l\'altro thread');
    } else if (trimmed.includes('Thread.Sleep')) {
      commented.push(line + '  // Simula tempo di elaborazione');
    } else if (trimmed.includes('new Thread(')) {
      commented.push(line + '  // Crea nuovo thread passando il metodo');
    } else if (trimmed.includes('Start()')) {
      commented.push(line + '  // Avvia il thread');
    } else if (trimmed.includes('new Semaphore(')) {
      commented.push(line + '  // Inizializza semaforo: (iniziale, massimo)');
    } else if (trimmed.match(/n\+\+|n--/)) {
      commented.push(line + '  // Incrementa/decrementa il dato prodotto');
    } else if (trimmed.includes('Console.WriteLine')) {
      commented.push(line + '  // Stampa il valore prodotto/consumato');
    } else {
      commented.push(line);
    }
  }
  
  return commented.join('\n');
}
