import { useState, useEffect, useRef } from 'react';

export default function Simulator({ model = 'semaphore' }) {
  const [buffer, setBuffer] = useState(new Array(5).fill(null));
  const [producerPos, setProducerPos] = useState(0);
  const [consumerPos, setConsumerPos] = useState(0);
  const [semc, setSemc] = useState(0);
  const [semp, setSemp] = useState(1);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(step, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, speed]);
  
  function step() {
    setProducerPos(p => {
      const newP = (p + 1) % 5;
      setBuffer(buf => {
        const newBuf = [...buf];
        newBuf[newP] = `P${Date.now().toString().slice(-4)}`;
        return newBuf;
      });
      setSemp(v => Math.max(0, v - 1));
      return newP;
    });
    
    setTimeout(() => {
      setConsumerPos(c => {
        const newC = (c + 1) % 5;
        setBuffer(buf => {
          const newBuf = [...buf];
          newBuf[newC] = null;
          return newBuf;
        });
        setSemc(v => Math.max(0, v - 1));
        return newC;
      });
    }, speed / 2);
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex gap-4 mb-6 flex-wrap">
        <button onClick={() => setRunning(!running)} className={`cursor-pointer px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-[#4F46E5] hover:bg-[#4338CA]'} text-white`}>
          {running ? 'Pausa' : 'Avvia'}
        </button>
        <button onClick={() => { setBuffer(new Array(5).fill(null)); setProducerPos(0); setConsumerPos(0); setSemc(0); setSemp(1); }} className="cursor-pointer px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-[#4F46E5] transition-colors duration-200">
          Reset
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">Velocità:</label>
          <input type="range" min="100" max="2000" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-32" />
          <span className="text-sm text-gray-500">{speed}ms</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Buffer (5 slot)</h4>
        <div className="flex gap-2">
          {buffer.map((item, idx) => (
            <div key={idx} className={`flex-1 h-16 rounded-lg border-2 flex items-center justify-center text-xs font-mono ${item ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'} ${idx === producerPos ? 'ring-2 ring-[#F97316]' : ''} ${idx === consumerPos ? 'ring-2 ring-green-500' : ''}`}>
              {item || 'vuoto'}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span className="text-[#F97316]">■ Produttore</span>
          <span className="text-green-500">■ Consumatore</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <h5 className="text-sm font-semibold mb-1">Semaforo Produttore (semp)</h5>
          <div className="text-2xl font-bold text-[#4F46E5]">{semp}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <h5 className="text-sm font-semibold mb-1">Semaforo Consumatore (semc)</h5>
          <div className="text-2xl font-bold text-green-500">{semc}</div>
        </div>
      </div>
    </div>
  );
}
