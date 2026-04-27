import { useState, useEffect } from 'react';

export default function Quiz({ topic, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  useEffect(() => {
    const q = generateQuiz(topic);
    setQuestions(q);
  }, [topic]);
  
  if (!questions.length) return <div>Caricamento quiz...</div>;
  
  const q = questions[currentQ];
  
  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ(c => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
        const progress = JSON.parse(localStorage.getItem('progress') || '[]');
        if (!progress.includes(topic)) {
          progress.push(topic);
          localStorage.setItem('progress', JSON.stringify(progress));
        }
        if (onComplete) onComplete(score + (idx === q.correct ? 1 : 0));
      }
    }, 1500);
  };
  
  if (finished) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        <h3 className="text-2xl font-bold text-[#1E1B4B] dark:text-white mb-4">Quiz Completato!</h3>
        <p className="text-lg">Punteggio: <span className="font-bold text-[#4F46E5]">{score}/{questions.length}</span></p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>Domanda {currentQ + 1}/{questions.length}</span>
        <span>Punteggio: {score}</span>
      </div>
      <h3 className="text-lg font-semibold text-[#1E1B4B] dark:text-white mb-4">{q.question}</h3>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className={`cursor-pointer w-full text-left p-3 rounded-lg border-2 transition-colors duration-200 ${
              selected === null ? 'border-gray-300 hover:border-[#4F46E5] dark:border-gray-600' :
              idx === q.correct ? 'border-green-500 bg-green-50 dark:bg-green-900' :
              idx === selected ? 'border-red-500 bg-red-50 dark:bg-red-900' : 'border-gray-300 opacity-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{q.explanation}</p>
      )}
    </div>
  );
}

function generateQuiz(topic) {
  const quizzes = {
    'semafori': [
      { question: 'Cosa fa il metodo WaitOne() su un semaforo?', options: ['Rilascia il semaforo', 'Attende che il semaforo sia disponibile (bloccante)', 'Distrugge il semaforo', 'Crea un nuovo thread'], correct: 1, explanation: 'WaitOne() blocca il thread finché il semaforo non è disponibile.' },
      { question: 'Qual è il valore iniziale del semaforo in "new Semaphore(0, 1)"?', options: ['1', '0', '2', 'Non definito'], correct: 1, explanation: 'Il primo parametro è il conteggio iniziale, quindi il semaforo parte da 0 (non disponibile).' },
      { question: 'Cosa succede se il produttore è più veloce del consumatore?', options: ['Il programma crasha', 'I dati vengono persi se non c\'è un buffer', 'Il semaforo si resetta', 'Il consumatore rallenta'], correct: 1, explanation: 'Senza buffer, un produttore più veloce causa perdita di dati.' },
      { question: 'Quale semaforo controlla il produttore in un tipico scenario?', options: ['semc (consumatore)', 'semp (produttore)', 'entrambi', 'nessuno'], correct: 1, explanation: 'Il semaforo del produttore (semp) ne controlla la produzione.' },
      { question: 'Cosa fa Release() sul semaforo?', options: ['Blocca il thread', 'Rilascia il semaforo incrementando il conteggio', 'Termina il thread', 'Crea un nuovo semaforo'], correct: 1, explanation: 'Release() incrementa il conteggio del semaforo, permettendo a un thread in attesa di procedere.' },
    ],
    'queue': [
      { question: 'Quale classe .NET gestisce automaticamente la sincronizzazione produttore-consumatore?', options: ['List<T>', 'BlockingCollection<T>', 'Queue<T>', 'ConcurrentBag<T>'], correct: 1, explanation: 'BlockingCollection<T> implementa automaticamente la sincronizzazione.' },
      { question: 'Cosa succede se tenti di prendere un elemento da una BlockingCollection vuota?', options: ['Ritorna null', 'Throws exception', 'Il thread si blocca finché non c\'è un elemento', 'Ritorna default(T)'], correct: 2, explanation: 'Take() blocca il thread finché non è disponibile un elemento.' },
      { question: 'Quale metodo aggiunge elementi alla BlockingCollection?', options: ['Push()', 'Add()', 'Enqueue()', 'Insert()'], correct: 1, explanation: 'Add() aggiunge un elemento alla collection.' },
      { question: 'Cosa indica IsCompleted?', options: ['La collection è piena', 'Non saranno aggiunti altri elementi', 'La collection è vuota', 'Errore di sincronizzazione'], correct: 1, explanation: 'IsCompleted indica che non verranno più aggiunti elementi.' },
      { question: 'Come si segnala che non si aggiungeranno più elementi?', options: ['Close()', 'CompleteAdding()', 'Stop()', 'Finish()'], correct: 1, explanation: 'CompleteAdding() segnala la fine della produzione.' },
    ],
    'default': [
      { question: 'Cos\'è il pattern produttore-consumatore?', options: ['Un pattern di design per l\'ereditarietà', 'Un pattern dove un thread produce dati e un altro li consuma', 'Un pattern per la gestione della memoria', 'Un pattern per il networking'], correct: 1, explanation: 'Il pattern coinvolge due entità che condividono un buffer di dati.' },
      { question: 'Perché serve la sincronizzazione?', options: ['Per velocizzare il codice', 'Per evitare race conditions e accessi concorrenti', 'Per risparmiare memoria', 'Per gestire le eccezioni'], correct: 1, explanation: 'La sincronizzazione previene race conditions.' },
      { question: 'Cosa è un semaforo?', options: ['Un tipo di variabile', 'Una variabile che conta le risorse disponibili', 'Un thread speciale', 'Un tipo di lock'], correct: 1, explanation: 'Il semaforo è un contatore di risorse disponibili.' },
      { question: 'Cosa succede senza sincronizzazione?', options: ['Niente', 'Possibili race conditions e dati inconsistenti', 'Il programma è più veloce', 'Il compilatore dà errore'], correct: 1, explanation: 'Senza sincronizzazione, più thread possono accedere contemporaneamente causando inconsistenza.' },
      { question: 'Quale namespace contiene le classi per i thread in C#?', options: ['System.IO', 'System.Threading', 'System.Collections', 'System.Net'], correct: 1, explanation: 'System.Threading contiene Thread, Semaphore, ecc.' },
    ]
  };
  
  return quizzes[topic] || quizzes['default'];
}
