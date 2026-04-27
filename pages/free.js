import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CodeViewer = dynamic(() => import('../components/CodeViewer'), { ssr: false });

const embeddedData = {
  codeBlocks: [
    {
      id: 1,
      title: "Semafori - Produttore/Consumatore",
      code: `using System;\nusing System.Threading;\n\nnamespace produttore_consumatore_thr\n{\n    class Program\n    {\n        static int n;\n        static Semaphore semc;\n        static Semaphore sempit;\n\n        static void cons()\n        {\n            while (true)\n            {\n                semc.WaitOne();\n                Console.WriteLine("Consumato: " + n);\n                Thread.Sleep(500);\n                sempit.Release();\n            }\n        }\n\n        static void prod()\n        {\n            while (true)\n            {\n                sempit.WaitOne();\n                n++;\n                Console.WriteLine("Prodotto: " + n);\n                Thread.Sleep(200);\n                semc.Release();\n            }\n        }\n\n        static void Main(string[] args)\n        {\n            n = 0;\n            semc = new Semaphore(0, 1);\n            sempit = new Semaphore(1, 1);\n            Thread thc = new Thread(cons);\n            Thread thp = new Thread(prod);\n            thc.Start();\n            thp.Start();\n        }\n    }\n}`,
      tags: ["semafori", "thread", "sincronizzazione"]
    },
    {
      id: 2,
      title: "BlockingCollection - Queue Thread-Safe",
      code: `using System;\nusing System.Threading;\nusing System.Collections.Concurrent;\n\nclass Program\n{\n    static BlockingCollection<int> coda = new BlockingCollection<int>(10);\n\n\n    static void cons()\n    {\n        while (true)\n        {\n            int n = coda.Take();\n            Console.WriteLine("Lunghezza coda: " + coda.Count);\n            Console.WriteLine("Consumato: " + n);\n            Thread.Sleep(500);\n        }\n    }\n\n    static void prod()\n    {\n        int n = 0;\n        while (true)\n        {\n            n++;\n            coda.Add(n);\n            Console.WriteLine("Prodotto: " + n);\n            Thread.Sleep(300);\n        }\n    }\n\n    static void Main()\n    {\n        Thread th_cons = new Thread(cons);\n        Thread th_prod = new Thread(prod);\n        th_cons.Start();\n        th_prod.Start();\n    }\n}`,
      tags: ["queue", "thread"]
    },
    {
      id: 3,
      title: "Busy Waiting - Polling",
      code: `using System;\nusing System.Threading;\n\nnamespace produttore_consumatore_thr\n{\n    class Program\n    {\n        static int n, cont;\n\n        static void cons()\n        {\n            while (true)\n            {\n                while (n == 0);\n                Console.WriteLine("Consumato: " + n);\n                n = 0;\n                Thread.Sleep(500);\n            }\n        }\n\n        static void prod()\n        {\n            while (true)\n            {\n                while (n != 0);\n                cont++;\n                n = cont;\n                Console.WriteLine("Prodotto: " + n);\n                Thread.Sleep(200);\n            }\n        }\n\n        static void Main(string[] args)\n        {\n            n = 0;\n            cont = 0;\n            Thread thc = new Thread(cons);\n            Thread thp = new Thread(prod);\n            thc.Start();\n            thp.Start();\n        }\n    }\n}`,
      tags: ["thread", "produttore-consumatore"]
    },
    {
      id: 4,
      title: "Server - Named Pipe",
      code: `using System;\nusing System.IO.Pipes;\n\nnamespace prod_proc_pipe\n{\n    class Program\n    {\n        static void Main()\n        {\n            using (var server = new NamedPipeServerStream(\n                "mypipe", PipeDirection.InOut))\n            {\n                server.WaitForConnection();\n                Console.WriteLine("Client connesso!");\n                \n                using (var writer = new StreamWriter(server))\n                using (var reader = new StreamReader(server))\n                {\n                    writer.WriteLine("Ciao dal server!");\n                    writer.Flush();\n                    string msg = reader.ReadLine();\n                    Console.WriteLine("Ricevuto: " + msg);\n                }\n            }\n        }\n    }\n}`,
      tags: ["thread", "pipe"]
    },
    {
      id: 5,
      title: "Client - Named Pipe",
      code: `using System;\nusing System.IO.Pipes;\n\nnamespace cons_proc_pipe\n{\n    class Program\n    {\n        static void Main()\n        {\n            using (var client = new NamedPipeClientStream(\n                ".", "mypipe", PipeDirection.InOut))\n            {\n                client.Connect();\n                \n                using (var writer = new StreamWriter(client))\n                using (var reader = new StreamReader(client))\n                {\n                    string msg = reader.ReadLine();\n                    Console.WriteLine("Ricevuto: " + msg);\n                    writer.WriteLine("ACK");\n                    writer.Flush();\n                }\n            }\n        }\n    }\n}`,
      tags: ["thread", "pipe"]
    },
    {
      id: 9,
      title: "Server - Socket TCP",
      code: `using System;\nusing System.Net;\nusing System.Net.Sockets;\n\nnamespace prod_socket\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Socket sk = new Socket(\n                AddressFamily.InterNetwork,\n                SocketType.Stream,\n                ProtocolType.Tcp);\n            \n            IPEndPoint ep = new IPEndPoint(IPAddress.Loopback, 5000);\n            sk.Bind(ep);\n            sk.Listen(2);\n            \n            Console.WriteLine("In attesa...");\n            Socket sk_conn = sk.Accept();\n            \n            int n = 0;\n            while (true)\n            {\n                n++;\n                byte[] dati = BitConverter.GetBytes(n);\n                sk_conn.Send(dati);\n                Console.WriteLine("Prodotto: " + n);\n            }\n        }\n    }\n}`,
      tags: ["socket"]
    },
    {
      id: 11,
      title: "Client - Socket TCP",
      code: `using System;\nusing System.Net;\nusing System.Net.Sockets;\n\nnamespace cons_socket\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            Socket sk = new Socket(\n                AddressFamily.InterNetwork,\n                SocketType.Stream,\n                ProtocolType.Tcp);\n            \n            IPEndPoint ep = new IPEndPoint(IPAddress.Loopback, 5000);\n            \n            try { sk.Connect(ep); }\n            catch { \n                Console.WriteLine("Connessione fallita!"); \n                return; \n            }\n            \n            byte[] dati = new byte[4];\n            while (true)\n            {\n                sk.Receive(dati);\n                int n = BitConverter.ToInt32(dati, 0);\n                Console.WriteLine("Consumato: " + n);\n            }\n        }\n    }\n}`,
      tags: ["socket", "thread"]
    },
    {
      id: 15,
      title: "Server Multi-Client - Socket TCP",
      code: `using System;\nusing System.Net;\nusing System.Net.Sockets;\nusing System.Threading;\n\n\nnamespace prod_socket\n{\n    class Program\n    {\n        static int n = 0;\n\n        \n        static void invio_dati(Object obj)\n        {\n            bool esci = false;\n            byte[] dati;\n            Socket sk = (Socket)obj;\n            \n            while (!esci)\n            {\n                n++;\n                dati = BitConverter.GetBytes(n);\n                try {\n                    sk.Send(dati);\n                    Console.WriteLine("Prodotto: " + n);\n                }\n                catch {\n                    Console.WriteLine("Un consumatore si è sganciato.");\n                    sk.Close();\n                    esci = true;\n                }\n            }\n        }\n\n\n        static void Main(string[] args)\n        {\n            Socket sk = new Socket(\n                AddressFamily.InterNetwork,\n                SocketType.Stream,\n                ProtocolType.Tcp);\n            \n            IPEndPoint ep = new IPEndPoint(IPAddress.Loopback, 5000);\n            sk.Bind(ep);\n            sk.Listen(2);\n            \n            while (true)\n            {\n                Console.WriteLine("In attesa...");\n                Socket sk_con = sk.Accept();\n                Thread thn = new Thread(invio_dati);\n                thn.Start(sk_con);\n            }\n        }\n    }\n}`,
      tags: ["socket", "thread", "produttore-consumatore"]
    }
  ]
};

export default function FreePath() {
  const [selectedCode, setSelectedCode] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const data = useMemo(() => embeddedData, []);
  
  const tags = ['all', 'semafori', 'queue', 'thread', 'socket', 'pipe', 'shared-memory'];
  
  const codeBlocks = (data?.codeBlocks || []).filter(b => 
    filter === 'all' ? true : b.tags?.includes(filter)
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800/50 border-b border-slate-700/50 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Esplora Libero</h1>
            <p className="text-slate-400">Tutti i listati C# del corso ({data.codeBlocks.length})</p>
          </div>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">← Torna alla Home</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => { setFilter(tag); setSelectedCode(null); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                filter === tag 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tag === 'all' ? 'Tutti' : tag}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold text-white mb-4">
              Listati ({codeBlocks.length})
            </h2>
            {codeBlocks.map(block => (
              <button
                key={block.id}
                onClick={() => setSelectedCode(block)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedCode?.id === block.id 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Listato {block.id}</span>
                  {block.tags?.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-slate-700 text-slate-400 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-400">{block.title}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedCode ? (
              <div className="card bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedCode.title}
                  </h3>
                  <div className="flex gap-2">
                    {selectedCode.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <CodeViewer code={selectedCode.code} />
              </div>
            ) : (
              <div className="card bg-slate-800/50 border border-slate-700/50 p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <p className="text-slate-500">Seleziona un listato per visualizzarlo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}