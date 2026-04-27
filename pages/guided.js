import { useEffect, useState } from 'react';
import Router from 'next/router';
import CodeViewer from '../components/CodeViewer';
import Quiz from '../components/Quiz';
import Simulator from '../components/Simulator';
import Sidebar from '../components/Sidebar';

const steps = [
  { id: 'base', title: 'Concetti Base', desc: 'Introduzione al pattern produttore-consumatore e sincronizzazione.' },
  { id: 'semaphore', title: 'Semafori con Thread', desc: 'Implementazione base con Semaphore in C#.' },
  { id: 'queue', title: 'BlockingCollection / Queue', desc: 'Uso di collezioni thread-safe per la sincronizzazione.' },
  { id: 'busywait', title: 'Busy Waiting', desc: 'Problemi del polling continuo e soluzioni.' },
  { id: 'pipe', title: 'Named Pipe (IPC)', desc: 'Comunicazione tra processi con pipe named.' },
  { id: 'sharedmem', title: 'Shared Memory', desc: 'Memoria condivisa con semafori IPC.' },
  { id: 'socket', title: 'Socket TCP', desc: 'Comunicazione di rete con socket TCP in C#.' },
  { id: 'summary', title: 'Riepilogo', desc: 'Confronto tra i vari modelli e quando usarli.' },
];

export default function GuidedPath() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/data/docdata.json').then(r => r.json()).then(setData);
  }, []);
  
  const step = steps[currentStep];
  const codeBlocks = data?.codeBlocks?.filter(b => b.tags.includes(step.id) || (step.id === 'base' && b.tags.includes('produttore-consumatore'))) || [];
  
  return (
    <div className="flex min-h-screen bg-[#EEF2FF] dark:bg-gray-900">
      <Sidebar currentSection={step.id} />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#1E1B4B] dark:text-white">{step.title}</h1>
            <span className="text-sm text-gray-500">Step {currentStep + 1}/{steps.length}</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">{step.desc}</p>
          
          {step.id !== 'summary' && (
            <>
              <h2 className="text-xl font-semibold text-[#1E1B4B] dark:text-white mb-4">Codice Originale</h2>
              {codeBlocks.map(block => (
                <CodeViewer key={block.id} code={block.code} title={`Listato ${block.id}`} showCommented />
              ))}
              
              <h2 className="text-xl font-semibold text-[#1E1B4B] dark:text-white mt-8 mb-4">Simulatore</h2>
              <Simulator model={step.id} />
              
              <h2 className="text-xl font-semibold text-[#1E1B4B] dark:text-white mt-8 mb-4">Quiz Obbligatorio</h2>
              {!quizDone && <Quiz topic={step.id} onComplete={() => setQuizDone(true)} />}
              {quizDone && <p className="text-green-500 font-semibold">Quiz completato! Puoi procedere.</p>}
            </>
          )}
          
          {step.id === 'summary' && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4">Riepilogo dei Modelli</h2>
              <table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left p-2">Modello</th><th className="text-left p-2">Pro</th><th className="text-left p-2">Contro</th></tr></thead>
                <tbody>
                  <tr className="border-b"><td className="p-2">Semafori</td><td className="p-2">Semplice, nativo</td><td className="p-2">Deadlock se usato male</td></tr>
                  <tr className="border-b"><td className="p-2">BlockingCollection</td><td className="p-2">Automatico, thread-safe</td><td className="p-2">Solo .NET</td></tr>
                  <tr className="border-b"><td className="p-2">Named Pipe</td><td className="p-2">IPC veloce</td><td className="p-2">Solo Windows</td></tr>
                  <tr className="border-b"><td className="p-2">Shared Memory</td><td className="p-2">Velocissimo</td><td className="p-2">Complesso, sincronizzazione manuale</td></tr>
                  <tr><td className="p-2">Socket TCP</td><td className="p-2">Cross-platform, rete</td><td className="p-2">Overhead, latenza</td></tr>
                </tbody>
              </table>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <button onClick={() => { setCurrentStep(s => Math.max(0, s - 1)); setQuizDone(false); }} className="cursor-pointer px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-[#4F46E5] transition-colors duration-200">Indietro</button>
            {currentStep < steps.length - 1 ? (
              <button onClick={() => { setCurrentStep(s => s + 1); setQuizDone(false); }} disabled={!quizDone && step.id !== 'summary'} className={`cursor-pointer px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${!quizDone && step.id !== 'summary' ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'}`}>
                Avanti
              </button>
            ) : (
              <button onClick={() => Router.push('/')} className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">Completato!</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
