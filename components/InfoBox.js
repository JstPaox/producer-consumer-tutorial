import { useState } from 'react';

export default function InfoBox({ children, title, content, position = 'right' }) {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 w-72 p-4 rounded-xl shadow-2xl border ${
          position === 'top' ? 'bottom-full left-0 mb-2' : 
          position === 'left' ? 'right-full top-0 mr-2' :
          'top-full left-0 mt-2'
        } bg-slate-800 border-slate-600`}>
          {title && <h4 className="font-bold text-amber-400 text-sm mb-2">{title}</h4>}
          <p className="text-slate-200 text-sm leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
}

export function InfoTrigger({ children, title, content }) {
  const [show, setShow] = useState(false);
  
  return (
    <div 
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="text-indigo-400 underline decoration-dotted underline-offset-2">
        {children}
      </span>
      {show && (
        <div className="absolute z-50 w-72 p-4 rounded-xl shadow-2xl border bg-slate-800 border-slate-600 -left-2 top-full mt-2">
          {title && <h4 className="font-bold text-amber-400 text-sm mb-2">{title}</h4>}
          <p className="text-slate-200 text-sm leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
}