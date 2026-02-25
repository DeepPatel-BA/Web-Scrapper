import React, { useState } from 'react';
import { ParseMode } from '../types';

interface InputSectionProps {
  onParse: (content: string, mode: ParseMode) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onParse, isLoading }) => {
  const [mode, setMode] = useState<ParseMode>('url');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onParse(content, mode);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex">
          <button
            onClick={() => setMode('url')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              mode === 'url'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            By URL Link
          </button>
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              mode === 'text'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            By Code / Text
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {mode === 'url' ? 'Enter Website URL' : 'Paste HTML or Text Content'}
          </label>
          
          {mode === 'url' ? (
            <input
              type="url"
              placeholder="https://www.example.com"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
              required
            />
          ) : (
            <textarea
              placeholder="Paste the full <body> content or raw text here for the most accurate parsing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-mono text-sm placeholder:text-slate-400"
              required
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className={`w-full py-3.5 px-6 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 ${
            isLoading || !content.trim()
              ? 'bg-slate-400 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing Structure...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>Parse Content</span>
            </>
          )}
        </button>
        {mode === 'url' && (
          <p className="mt-3 text-xs text-slate-500 text-center">
            Uses Google Gemini with Search Grounding. Ensures carousels, sub-headers, and media links are detected.
          </p>
        )}
      </form>
    </div>
  );
};

export default InputSection;
