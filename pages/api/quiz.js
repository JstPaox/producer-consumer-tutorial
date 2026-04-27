export default function handler(req, res) {
  const { topic } = req.query;
  
  const quizzes = {
    'semafori': [
      { question: 'Cosa fa il metodo WaitOne() su un semaforo?', options: ['Rilascia il semaforo', 'Attende che il semaforo sia disponibile (bloccante)', 'Distrugge il semaforo', 'Crea un nuovo thread'], correct: 1, explanation: 'WaitOne() blocca il thread finché il semaforo non è disponibile.' },
      { question: 'Qual è il valore iniziale del semaforo in "new Semaphore(0, 1)"?', options: ['1', '0', '2', 'Non definito'], correct: 1, explanation: 'Il primo parametro è il conteggio iniziale, quindi il semaforo parte da 0.' },
      { question: 'Cosa succede se il produttore è più veloce del consumatore?', options: ['Il programma crasha', 'I dati vengono persi se non c\'è un buffer', 'Il semaforo si resetta', 'Il consumatore rallenta'], correct: 1, explanation: 'Senza buffer, un produttore più veloce causa perdita di dati.' },
      { question: 'Quale semaforo controlla il produttore in un tipico scenario?', options: ['semc', 'semp', 'entrambi', 'nessuno'], correct: 1, explanation: 'Il semaforo del produttore (semp) ne controlla la produzione.' },
      { question: 'Cosa fa Release() sul semaforo?', options: ['Blocca il thread', 'Rilascia il semaforo incrementando il conteggio', 'Termina il thread', 'Crea un nuovo semaforo'], correct: 1, explanation: 'Release() incrementa il conteggio del semaforo.' },
    ],
    'queue': [
      { question: 'Quale classe .NET gestisce automaticamente la sincronizzazione produttore-consumatore?', options: ['List<T>', 'BlockingCollection<T>', 'Queue<T>', 'ConcurrentBag<T>'], correct: 1, explanation: 'BlockingCollection<T> implementa automaticamente la sincronizzazione.' },
      { question: 'Cosa succede se tenti di prendere un elemento da una BlockingCollection vuota?', options: ['Ritorna null', 'Throws exception', 'Il thread si blocca finché non c\'è un elemento', 'Ritorna default(T)'], correct: 2, explanation: 'Take() blocca il thread finché non è disponibile un elemento.' },
      { question: 'Quale metodo aggiunge elementi alla BlockingCollection?', options: ['Push()', 'Add()', 'Enqueue()', 'Insert()'], correct: 1, explanation: 'Add() aggiunge un elemento alla collection.' },
      { question: 'Cosa indica IsCompleted?', options: ['La collection è piena', 'Non saranno aggiunti altri elementi', 'La collection è vuota', 'Errore di sincronizzazione'], correct: 1, explanation: 'IsCompleted indica che non verranno più aggiunti elementi.' },
      { question: 'Come si segnala che non si aggiungeranno più elementi?', options: ['Close()', 'CompleteAdding()', 'Stop()', 'Finish()'], correct: 1, explanation: 'CompleteAdding() segnala la fine della produzione.' },
    ],
  };
  
  const result = quizzes[topic] || quizzes['semafori'];
  res.status(200).json({ topic, questions: result });
}
