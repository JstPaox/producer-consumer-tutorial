import { useState, useEffect, useRef, forwardRef } from 'react';

const Simulator = forwardRef(function Simulator({ model = 'semaphore' }, ref) {
  const [buffer, setBuffer] = useState(Array(10).fill(null));
  const [producerPos, setProducerPos] = useState(0);
  const [consumerPos, setConsumerPos] = useState(0);
  const [semc, setSemc] = useState(0);
  const [semp, setSemp] = useState(1);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [logs, setLogs] = useState([]);
  const [produced, setProduced] = useState(0);
  const [consumed, setConsumed] = useState(0);
  const [selectedModel, setSelectedModel] = useState(model);
  const intervalRef = useRef(null);
  const logRef = useRef(null);

  const models = [
    { id: 'semaphore', name: 'Semafori', desc: 'Sincronizzazione con semafori' },
    { id: 'queue', name: 'BlockingCollection', desc: 'Queue thread-safe' },
    { id: 'socket', name: 'Socket TCP', desc: 'Comunicazione via rete' },
    { id: 'sharedmem', name: 'Shared Memory', desc: 'Memoria condivisa' },
  ];

  useEffect(() => {
    if (running) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(simulateStep, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, speed, selectedModel]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  function simulateStep() {
    if (selectedModel === 'semaphore' || selectedModel === 'queue') {
      if (semp > 0 && buffer[producerPos] === null) {
        const newVal = `D${produced + 1}`;
        setBuffer(buf => {
          const newBuf = [...buf];
          newBuf[producerPos] = newVal;
          return newBuf;
        });
        setProduced(p => p + 1);
        setSemp(0);
        setSemc(1);
        addLog(`Prodotto: ${newVal}`, 'producer');
        setProducerPos(p => (p + 1) % 10);
      }
      
      setTimeout(() => {
        if (semc > 0 && buffer[consumerPos] !== null) {
          const val = buffer[consumerPos];
          setBuffer(buf => {
            const newBuf = [...buf];
            newBuf[consumerPos] = null;
            return newBuf;
          });
          setConsumed(c => c + 1);
          setSemc(0);
          setSemp(1);
          addLog(`Consumato: ${val}`, 'consumer');
          setConsumerPos(c => (c + 1) % 10);
        }
      }, speed / 2);
    }
  }

  function addLog(message, type) {
    setLogs(logs => [...logs.slice(-20), { message, type, time: new Date().toLocaleTimeString() }]);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setBuffer(Array(10).fill(null));
    setProducerPos(0);
    setConsumerPos(0);
    setSemc(0);
    setSemp(model === 'semaphore' ? 1 : 0);
    setLogs([]);
    setProduced(0);
    setConsumed(0);
  }

  function toggleRun() {
    setRunning(!running);
    if (!running && selectedModel === 'semaphore' && buffer.every(b => b === null)) {
      setSemp(1);
      setSemc(0);
    }
  }

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div className="flex flex-wrap gap-2">
        {models.map(m => (
          <button
            key={m.id}
            onClick={() => { setSelectedModel(m.id); reset(); }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedModel === m.id 
                ? 'bg-indigo-500 text-white' 
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={toggleRun}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            running 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {running ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Pausa
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Avvia
            </>
          )}
        </button>
        
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>

        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg">
          <span className="text-sm text-slate-400">Velocità:</span>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-24 accent-indigo-500"
          />
          <span className="text-sm text-white w-12">{speed}ms</span>
        </div>

        <div className="flex items-center gap-4 ml-auto text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-slate-400">Prodotti: {produced}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-400">Consumati: {consumed}</span>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Buffer */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Buffer Circolare (10 slot)</h3>
          
          <div className="grid grid-cols-5 gap-2 mb-4">
            {buffer.map((item, idx) => (
              <div
                key={idx}
                className={`h-20 rounded-xl border-2 flex items-center justify-center font-mono text-sm transition-all ${
                  item 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500 text-white' 
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                } ${
                  idx === producerPos && running 
                    ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-slate-900 animate-pulse' 
                    : ''
                } ${
                  idx === consumerPos && running 
                    ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-slate-900 animate-pulse' 
                    : ''
                }`}
              >
                {item ? (
                  <span className="text-lg font-bold">{item}</span>
                ) : (
                  <span className="text-2xl opacity-20">∅</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-orange-500"></div>
              <span className="text-slate-400">Produttore → Scrivi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-green-500"></div>
              <span className="text-slate-400">Consumatore → Leggi</span>
            </div>
          </div>
        </div>

        {/* Semaphores */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h4 className="text-sm font-medium text-slate-400 mb-3">Semafori</h4>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border-2 transition-all ${
                selectedModel === 'semaphore'
                  ? semc > 0 ? 'bg-green-500/20 border-green-500' : 'bg-red-500/10 border-red-500/50'
                  : 'bg-slate-700/50 border-slate-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Consumatore (semc)</span>
                  <span className={`text-2xl font-bold ${semc > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {semc}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {semc > 0 ? '✓ Può consumare' : '✗ In attesa'}
                </p>
              </div>
              
              <div className={`p-4 rounded-xl border-2 transition-all ${
                selectedModel === 'semaphore'
                  ? sempit > 0 ? 'bg- green-500/20 border-green-500' : 'bg-red-500/10 border-red-500/50'
                  : 'bg-slate-700/50 border-slate-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Produttore (semp)</span>
                  <span className={`text-2xl font-bold ${semp > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {semp}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {semp > 0 ? '✓ Può produrre' : '✗ In attesa'}
                </p>
              </div>
            </div>
          </div>

          {/* Log */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <h4 className="text-sm font-medium text-slate-400 mb-3">Log Attività</h4>
            <div 
              ref={logRef}
              className="h-40 overflow-y-auto space-y-1 font-mono text-xs"
            >
              {logs.length === 0 && (
                <p className="text-slate-500">Avvia il simulatore...</p>
              )}
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${
                    log.type === 'producer' ? 'text-orange-400' : 'text-green-400'
                  }`}
                >
                  <span className="text-slate-600">{log.time}</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/30">
        <h4 className="font-semibold text-indigo-400 mb-2">Come funziona</h4>
        <p className="text-slate-400 text-sm">
          {selectedModel === 'semaphore' && (
            'Il semaforo del produttore (semp) inizia a 1, permettendo la produzione. Il semaforo del consumatore (semc) inizia a 0, bloccando il consumo. Quando il produttore scrive, imposta semc=1 e semp=0. Quando il consumatore legge, imposta semp=1 e semc=0.'
          )}
          {selectedModel === 'queue' && (
            'BlockingCollection gestisce automaticamente la sincronizzazione. Take() blocca se la coda è vuota, Add() blocca se la coda è piena.'
          )}
          {selectedModel === 'socket' && (
            'Socket TCP: il produttore è server in ascolto, il consumatore è client che si connette.'
          )}
          {selectedModel === 'sharedmem' && (
            'Shared Memory: lettura/scrittura diretta in memoria condivisa con semafori per sincronizzazione.'
          )}
        </p>
      </div>
    </div>
  );
});

export default Simulator;