import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const CodeViewer = dynamic(() => import('../../components/CodeViewer'), { ssr: false });
const Quiz = dynamic(() => import('../../components/Quiz'), { ssr: false });

const chapterData = {
  base: {
    title: 'Concetti Fondamentali',
    subtitle: 'Cos\'è il pattern Produttore-Consumatore',
    what: 'Il pattern produttore-consumatore è un pattern di comunicazione tra thread dove un thread (produttore) genera dati e un altro thread (consumatore) li consuma.',
    why: 'Senza sincronizzazione, il consumatore potrebbe leggere dati non completi o il produttore potrebbe sovrascrivere dati non ancora letti.',
    terms: {
      'Sincronizzazione': 'Coordinamento tra thread per accedere a risorse condivise senza conflitti',
      'Race Condition': 'Quando il risultato dipende dall\'ordine non deterministico di esecuzione dei thread',
      'Buffer': 'Zona di memoria condivisa dove il produttore scrive e il consumatore legge',
      'Thread': 'Unità di esecuzione parallela all\'interno di un processo',
      'Mutex': 'Lock mutuo esclusivo: solo un thread alla volta può accedere alla risorsa',
      'Semaforo': 'Contatore che blocca i thread',
    },
    keyPoints: [
      'Il produttore produce dati, il consumatore li legge',
      'Serve un buffer condiviso tra i due thread',
      'La sincronizzazione evita che il consumatore legga dati non pronti',
      'La sincronizzazione evita che il produttore sovrascriva dati non ancora letti',
    ],
    diagram: 'Produttore → [BUFFER] → Consumatore',
    code: null,
    quizIntro: 'Prima di procedere, rispondi a queste domande per verificare la comprensione dei concetti base.',
  },
  semaphore: {
    title: 'Semafori (Semaphore)',
    subtitle: 'Sincronizzazione con System.Threading.Semaphore',
    what: 'Un Semaphore è un contatore che blocca i thread quando raggiunge 0. Initialize con (valore_iniziale, valore_massimo).',
    how: 'semc = new Semaphore(0, 1) → parte bloccato (il consumatore aspetta)\nsemp = new Semaphore(1, 1) → parte sbloccato (il produttore può produrre)',
    important: 'I semafori hanno DUE parametri: (valore_iniziale, valore_massimo)',
    methods: {
      'WaitOne()': 'Decrementa il contatore. Se diventa < 0, il thread si blocca finché qualcuno non fa Release()',
      'Release()': 'Incrementa il contatore, sbloccando un thread in attesa',
    },
    code: `using System;
using System.Threading;

namespace produttore_consumatore_thr
{
    class Program
    {
        static int n;  // Variabile globale condivisa
        static Semaphore semc;  // Semaforo consumatore (0=aspetta, 1=può consumare)
        static Semaphore sempit;  // Semaforo produttore (1=può produrre, 0=aspetta)

        static void cons()
        {
            while (true)
            {
                semc.WaitOne();   // Aspetta che ci sia qualcosa da consumare
                Console.WriteLine("Consumato: " + n);
                Thread.Sleep(500);  // Simula lavoro
                sempit.Release();   // Sblocca il produttore
            }
        }

        static void prod()
        {
            while (true)
            {
                sempit.WaitOne();   // Aspetta che il consumatore sia pronto
                n++;     // Produce nuovo dato
                Console.WriteLine("Prodotto: " + n);
                Thread.Sleep(200);  // Simula lavoro
                semc.Release();   // Sblocca il consumatore
            }
        }

        static void Main(string[] args)
        {
            n = 0;
            semc = new Semaphore(0, 1);   // Consumatore bloccato (inizia a 0)
            sempit = new Semaphore(1, 1);  // Produttore libero (inizia a 1)

            Thread thc = new Thread(cons);
            Thread thp = new Thread(prod);
            thc.Start();
            thp.Start();
        }
    }
}`,
    keyPoints: [
      'semp inizia a 1 (il produttore può produrre)',
      'semc inizia a 0 (il consumatore aspetta)',
      'WaitOne() blocca se contatore = 0',
      'Release() incrementa e sblocca',
    ],
    quizIntro: 'Ricorda: semc è per il consumatore, sempit è per il produttore.',
  },
  queue: {
    title: 'BlockingCollection',
    subtitle: 'Queue thread-safe con .NET',
    what: 'BlockingCollection<T> è una queue thread-safe che blocca automaticamente quando è vuota (Take) o piena (Add).',
    why: 'Non serve gestire manualmente semafori - .NET gestisce tutto automaticamente.',
    code: `using System;
using System.Threading;
using System.Collections.Concurrent;

class Program
{
    static BlockingCollection<int> coda = new BlockingCollection<int>(10);  // Max 10 elementi

    static void cons()
    {
        while (true)
        {
            int n = coda.Take();  // Blocca se coda vuota!
            Console.WriteLine("Lunghezza coda: " + coda.Count);
            Console.WriteLine("Consumato: " + n);
            Thread.Sleep(500);
        }
    }

    static void prod()
    {
        int n = 0;
        while (true)
        {
            n++;
            coda.Add(n);  // Blocca se coda piena!
            Console.WriteLine("Prodotto: " + n);
            Thread.Sleep(300);
        }
    }

    static void Main()
    {
        Thread th_cons = new Thread(cons);
        Thread th_prod = new Thread(prod);
        th_cons.Start();
        th_prod.Start();
    }
}`,
    methods: {
      'Take()': 'Estrai elemento - blocca se coda vuota',
      'Add()': 'Aggiungi elemento - blocca se coda piena',
      'Count': 'Numero elementi attuali',
      'IsCompleted': 'True se non verranno più aggiunti elementi',
    },
    keyPoints: [
      'BlockingCollection<T>(10) → max 10 elementi',
      'Take() blocca automaticamente se vuota',
      'Add() blocca automaticamente se piena',
      'IsCompleted segnala fine produzione',
      'Non servono semafori manuali!',
    ],
    quizIntro: 'BlockingCollection gestisce la sincronizzazione automaticamente.',
  },
  busywait: {
    title: 'Busy Waiting',
    subtitle: 'Il problema del polling continuo',
    what: 'Busy waiting =thread che continua a controllare una variabile in loop (while n == 0).',
    whyBad: 'Spreca CPU al 100%. Usa semafori o queue invece.',
    code: `using System;
using System.Threading;

namespace produttore_consumatore_thr
{
    class Program
    {
        static int n, cont;  // Variabili globali

        static void cons()
        {
            while (true)
            {
                while (n == 0);  // ← BUSY WAIT! Continua a controllare
                Console.WriteLine("Consumato: " + n);
                n = 0;
                Thread.Sleep(500);
            }
        }

        static void prod()
        {
            while (true)
            {
                while (n != 0);  // ← BUSY WAIT!
                cont++;
                n = cont;
                Console.WriteLine("Prodotto: " + n);
                Thread.Sleep(200);
            }
        }

        static void Main(string[] args)
        {
            n = 0;
            cont = 0;
            Thread thc = new Thread(cons);
            Thread thp = new Thread(prod);
            thc.Start();
            thp.Start();
        }
    }
}`,
    problems: [
      'Spreca CPU (1 core al 100%)',
      'Inefficiente',
      'Imprevedibile (dipende dallo scheduler)',
    ],
    solution: 'Usa Semaphore o BlockingCollection invece!',
    quizIntro: 'Il busy waiting è da evitare! Usa semafori o queue.',
  },
  pipe: {
    title: 'Named Pipe',
    subtitle: 'IPC tra processi su Windows',
    what: 'Named Pipe = pipe con nome per comunicazione tra due processi. Uno scrive, l\'altro legge.',
    why: 'Per comunicazione tra processi diversi (non solo thread). Più veloce di socket.',
    codeServer: `using System;
using System.IO;
using System.IO.Pipes;

namespace prod_proc_pipe
{
    class Program
    {
        static void Main()
        {
            using (var server = new NamedPipeServerStream(
                "mypipe", 
                PipeDirection.InOut))
            {
                server.WaitForConnection();
                Console.WriteLine("Client connesso!");
                
                using (var writer = new StreamWriter(server))
                using (var reader = new StreamReader(server))
                {
                    writer.WriteLine("Ciao dal server!");
                    writer.Flush();
                    string msg = reader.ReadLine();
                    Console.WriteLine("Ricevuto: " + msg);
                }
            }
        }
    }
}`,
    codeClient: `using System;
using System.IO;
using System.IO.Pipes;

namespace cons_proc_pipe
{
    class Program
    {
        static void Main()
        {
            using (var client = new NamedPipeClientStream(
                ".", 
                "mypipe", 
                PipeDirection.InOut))
            {
                client.Connect();
                
                using (var writer = new StreamWriter(client))
                using (var reader = new StreamReader(client))
                {
                    string msg = reader.ReadLine();
                    Console.WriteLine("Ricevuto: " + msg);
                    writer.WriteLine("ACK");
                    writer.Flush();
                }
            }
        }
    }
}`,
    keyPoints: [
      'NamedPipeServerStream per il server',
      'NamedPipeClientStream per il client',
      'WaitForConnection() aspetta il client',
      'Connect() il client si connette',
      'Serve libreria System.IO.Pipes',
    ],
    quizIntro: 'Named Pipe è per IPC tra processi, non tra thread.',
  },
  socket: {
    title: 'Socket TCP',
    subtitle: 'Comunicazione via rete',
    what: 'Socket TCP = comunicazione di rete tra produttore (server) e consumatore (client).',
    why: 'Per applicazioni distribuite su macchine diverse.',
    codeServer: `using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace prod_socket
{
    class Program
    {
        static void Main(string[] args)
        {
            Socket sk = new Socket(
                AddressFamily.InterNetwork,  // IPv4
                SocketType.Stream,          // TCP
                ProtocolType.Tcp);
            
            IPEndPoint ep = new IPEndPoint(IPAddress.Loopback, 5000);
            sk.Bind(ep);
            sk.Listen(2);  // Max 2 client in coda
            
            Console.WriteLine("In attesa...");
            Socket sk_conn = sk.Accept();  // Bloccante
            
            int n = 0;
            while (true)
            {
                n++;
                byte[] dati = BitConverter.GetBytes(n);
                sk_conn.Send(dati);
                Console.WriteLine("Prodotto: " + n);
            }
        }
    }
}`,
    codeClient: `using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace cons_socket
{
    class Program
    {
        static void Main(string[] args)
        {
            Socket sk = new Socket(
                AddressFamily.InterNetwork,
                SocketType.Stream,
                ProtocolType.Tcp);
            
            IPEndPoint ep = new IPEndPoint(IPAddress.Loopback, 5000);
            
            try { sk.Connect(ep); }
            catch { 
                Console.WriteLine("Connessione fallita!"); 
                return; 
            }
            
            byte[] dati = new byte[4];
            while (true)
            {
                sk.Receive(dati);
                int n = BitConverter.ToInt32(dati, 0);
                Console.WriteLine("Consumato: " + n);
            }
        }
    }
}`,
    methods: {
      'Bind()': 'Associa indirizzo + porta',
      'Listen()': 'Mette in ascolto',
      'Accept()': 'Accetta connessione (restituisce nuovo socket)',
      'Connect()': 'Client si connette',
      'Send()': 'Invia dati',
      'Receive()': 'Riceve dati',
    },
    keyPoints: [
      'Server: Bind → Listen → Accept → Send/Receive',
      'Client: Connect → Send/Receive',
      'IPAddress.Loopback = 127.0.0.1 (macchina locale)',
      'Porta 5000 = porta del server',
      'BitConverter per convertire int ↔ byte[]',
    ],
    quizIntro: 'Socket TCP: server ascolta, client si connette.',
  },
  summary: {
    title: 'Riepilogo',
    subtitle: 'Confronto finale di tutti i pattern',
    table: [
      { pattern: 'Semaphore', pros: 'Semplice, nativo', cons: 'Gestione manuale', when: 'Thread nello stesso processo' },
      { pattern: 'BlockingCollection', pros: 'Automatico, thread-safe', cons: 'Solo .NET', when: 'Thread nello stesso processo' },
      { pattern: 'Busy Waiting', pros: 'Semplice da scrivere', cons: 'Spreca CPU 100%', when: 'MAI! Usa semafori' },
      { pattern: 'Named Pipe', pros: 'IPC veloce', cons: 'Solo Windows', when: 'Processi sulla stessa macchina' },
      { pattern: 'Socket TCP', pros: 'Cross-platform, rete', cons: 'Overhead, latenza', when: 'Processi su macchine diverse' },
    ],
    tips: [
      'Ricorda i valori iniziali: semc=0, sempit=1',
      'WaitOne() blocca, Release() sblocca',
      'BlockingCollection gestisce tutto automaticamente',
      'Never usare il busy wait - spreca CPU!',
      'Socket: Bind → Listen → Accept → Send/Receive',
      'Named Pipe: velocissimo per IPC locale',
    ],
    quizIntro: 'Sei pronto per la verifica!',
  },
};

export default function Learn() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState({ chapters: {}, badges: [] });
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    fetch('/data/docdata.json').then(r => r.json()).then(setData);
    const saved = localStorage.getItem('pc_progress');
    if (saved) setProgress(JSON.parse(saved));
  }, [id]);

  const chapter = chapterData[id] || chapterData.base;

  const markComplete = () => {
    const newProgress = {
      ...progress,
      chapters: { ...progress.chapters, [id]: true }
    };
    setProgress(newProgress);
    localStorage.setItem('pc_progress', JSON.stringify(newProgress));
    setQuizDone(true);
  };

  const isComplete = progress.chapters?.[id];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800/50 border-b border-slate-700/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white cursor-pointer flex items-center gap-2">
            ← Torna ai capitoli
          </button>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">{chapter.title}</span>
            {isComplete && <span className="text-green-400">✓ Completato</span>}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{chapter.title}</h1>
          <p className="text-lg text-slate-400">{chapter.subtitle}</p>
        </div>

        {/* Spiegazione */}
        {chapter.what && (
          <div className="card bg-blue-600/10 border border-blue-500/30 mb-6">
            <h2 className="font-bold text-blue-400 mb-2">Cos'è</h2>
            <p className="text-slate-300">{chapter.what}</p>
          </div>
        )}

        {chapter.why && (
          <div className="card bg-slate-800/50 border border-slate-700/50 mb-6">
            <h2 className="font-bold text-white mb-2">Perché</h2>
            <p className="text-slate-300">{chapter.why}</p>
          </div>
        )}

        {chapter.whyBad && (
          <div className="card bg-red-600/10 border border-red-500/30 mb-6">
            <h2 className="font-bold text-red-400 mb-2">Perché NON usare</h2>
            <p className="text-slate-300">{chapter.whyBad}</p>
          </div>
        )}

        {chapter.how && (
          <div className="card bg-slate-800/50 border border-slate-700/50 mb-6">
            <h2 className="font-bold text-white mb-2">Come funziona</h2>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap">{chapter.how}</pre>
          </div>
        )}

        {/* Termini chiave */}
        {chapter.terms && (
          <div className="card bg-slate-800/50 border border-slate-700/50 mb-6">
            <h2 className="font-bold text-white mb-4">Termini Chiave</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(chapter.terms).map(([term, def]) => (
                <div key={term} className="bg-slate-700/50 p-3 rounded-lg">
                  <strong className="text-indigo-400">{term}</strong>
                  <p className="text-slate-400 text-sm">{def}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metodi */}
        {chapter.methods && (
          <div className="card bg-slate-800/50 border border-slate-700/50 mb-6">
            <h2 className="font-bold text-white mb-4">Metodi da Ricordare</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(chapter.methods).map(([method, desc]) => (
                <div key={method} className="bg-slate-700/50 p-3 rounded-lg">
                  <code className="text-orange-400">{method}</code>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Codice */}
        {chapter.code && (
          <div className="card bg-slate-800/50 border border-slate-700/50 mb-6">
            <h2 className="font-bold text-white mb-4">Codice Completo</h2>
            <CodeViewer code={chapter.code} />
          </div>
        )}

        {chapter.codeServer && chapter.codeClient && (
          <div className="space-y-6 mb-6">
            <div className="card bg-slate-800/50 border border-slate-700/50">
              <h2 className="font-bold text-white mb-4">Codice Server (Produttore)</h2>
              <CodeViewer code={chapter.codeServer} />
            </div>
            <div className="card bg-slate-800/50 border border-slate-700/50">
              <h2 className="font-bold text-white mb-4">Codice Client (Consumatore)</h2>
              <CodeViewer code={chapter.codeClient} />
            </div>
          </div>
        )}

        {/* Problemi */}
        {chapter.problems && (
          <div className="card bg-red-600/10 border border-red-500/30 mb-6">
            <h2 className="font-bold text-red-400 mb-4">Problemi</h2>
            <ul className="space-y-2">
              {chapter.problems.map(p => (
                <li key={p} className="text-red-300">✗ {p}</li>
              ))}
            </ul>
            {chapter.solution && (
              <p className="text-green-400 mt-3">→ {chapter.solution}</p>
            )}
          </div>
        )}

        {/* Key Points */}
        {chapter.keyPoints && (
          <div className="card bg-green-600/10 border border-green-500/30 mb-6">
            <h2 className="font-bold text-green-400 mb-4">Cosa Devi Ricordare</h2>
            <ul className="space-y-2">
              {chapter.keyPoints.map((p, i) => (
                <li key={i} className="text-green-300 flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-xs">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tabella riepilogo */}
        {chapter.table && (
          <div className="card bg-slate-800/50 border border-slate-700/50 mb-6 overflow-x-auto">
            <h2 className="font-bold text-white mb-4">Confronto</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-2 text-slate-400">Pattern</th>
                  <th className="text-left p-2 text-slate-400">Pro</th>
                  <th className="text-left p-2 text-slate-400">Contro</th>
                  <th className="text-left p-2 text-slate-400">Quando</th>
                </tr>
              </thead>
              <tbody>
                {chapter.table.map(row => (
                  <tr key={row.pattern} className="border-b border-slate-700/50">
                    <td className="p-2 text-white font-medium">{row.pattern}</td>
                    <td className="p-2 text-green-400">{row.pros}</td>
                    <td className="p-2 text-red-400">{row.cons}</td>
                    <td className="p-2 text-slate-300">{row.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tips */}
        {chapter.tips && (
          <div className="card bg-amber-600/10 border border-amber-500/30 mb-6">
            <h2 className="font-bold text-amber-400 mb-4">Consigli per la Verifica</h2>
            <ul className="space-y-2">
              {chapter.tips.map((tip, i) => (
                <li key={i} className="text-amber-300">💡 {tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quiz */}
        <div className="card bg-slate-800/50 border border-slate-700/50">
          <h2 className="font-bold text-white mb-4">Quiz di Verifica</h2>
          <p className="text-slate-400 mb-4">{chapter.quizIntro}</p>
          
          {!isComplete ? (
            <Quiz topic={id} onComplete={markComplete} />
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-green-400 font-semibold">Quiz completato! Capitolo segnato come fatto.</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <div></div>
          <button onClick={() => {
            const ids = Object.keys(chapterData);
            const idx = ids.indexOf(id);
            if (idx < ids.length - 1) router.push(`/learn/${ids[idx + 1]}`);
            else router.push('/');
          }} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 cursor-pointer">
            {Object.keys(chapterData).indexOf(id) < Object.keys(chapterData).length - 1 ? 'Capitolo Successivo →' : 'Torna alla Home'}
          </button>
        </div>
      </main>
    </div>
  );
}