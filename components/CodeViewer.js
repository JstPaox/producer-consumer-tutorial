import { useEffect, useState, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-csharp';

export default function CodeViewer({ code, title }) {
  const [showOriginalCode, setShowOriginalCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, showOriginalCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayCode = showOriginalCode ? code : addComments(code);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          {title && <span className="text-sm text-slate-400 ml-2">{title}</span>}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOriginalCode(!showOriginalCode)}
            className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            {showOriginalCode ? 'Commentato' : 'Originale'}
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Code */}
      <div className="relative">
        <pre className="!m-0 !rounded-none bg-slate-950 p-4 overflow-x-auto">
          <code ref={codeRef} className={`language-${code.includes('namespace') ? 'cs' : 'csharp'} text-sm`}>
            {displayCode}
          </code>
        </pre>
      </div>
    </div>
  );
}

function addComments(code) {
  const comments = {
    'static int n;': '// Variabile globale condivisa tra thread',
    'static Semaphore semc;': '// Semaforo consumatore (0 = aspetta, 1 = può consumare)',
    'static Semaphore sempit;': '// Semaforo produttore (1 = può produrre, 0 = aspetta)',
    'semc = new Semaphore(0, 1);': '// Inizialmente il consumatore è bloccato',
    'semp = new Semaphore(1, 1);': '// Il produttore può iniziare a produrre',
    'semc.WaitOne();': '// Il consumatore aspetta che ci sia qualcosa da consumare',
    'semp.WaitOne();': '// Il produttore aspetta che il consumatore sia pronto',
    'semc.Release();': '// Segnala al consumatore che c\'è un dato disponibile',
    'semp.Release();': '// Segnala al produttore che può produrre di nuovo',
    'n++;': '// Produce un nuovo dato',
    'Console.WriteLine': '// Stampa output su console',
    'Thread.Sleep': '// Simula lavoro (attesa)',
    'BlockingCollection<int>': '// Queue thread-safe con capacità limitata',
    'coda.Take();': '// Estrai elemento (blocca se vuota)',
    'coda.Add(n);': '// Aggiungi elemento alla coda',
    'coda.Count': '// Numero elementi attuali nella coda',
    'Socket': '// Socket TCP per comunicazione di rete',
    'sk.Bind(ep);': '// Associa socket all\'indirizzo',
    'sk.Listen(2);': '// Metti in ascolto (max 2 connessioni in coda)',
    'sk.Accept();': '// Accetta una connessione in ingresso',
    'sk.Connect(ep);': '// Connetti a server remoto',
    'sk.Send(dati);': '// Invia dati sulla socket',
    'sk.Receive(dati);': '// Ricevi dati dalla socket',
    'IPAddress.Loopback': '// Indirizzo locale (127.0.0.1)',
    '5000': '// Porta del server',
  };

  let result = code;
  for (const [pattern, comment] of Object.entries(comments)) {
    if (code.includes(pattern)) {
      const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, `${comment}\n${pattern}`);
    }
  }
  
  return result;
}