import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full group">
      {label && <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1.5 group-focus-within:text-indigo-400 transition-colors">{label}</label>}
      <input 
        className={`w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 ${className}`}
        {...props}
      />
    </div>
  );
};