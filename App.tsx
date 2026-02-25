import React, { useState } from 'react';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import { ParseMode } from './types';
import { parseWebContent } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async (content: string, mode: ParseMode) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const parsedText = await parseWebContent(content, mode);
      setResult(parsedText);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while parsing content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px]" />
        </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-white rounded-full shadow-sm border border-slate-200">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mr-2">New</span>
            <span className="text-slate-600 text-xs font-medium pr-2">Images, Videos & Deep Structure Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Web Content <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Parser</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform any website URL or raw HTML code into a structured format. Now detects sub-headers, images, videos, and all slider items.
          </p>
        </header>

        <main className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 order-2 lg:order-1">
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                        <h3 className="font-semibold text-slate-900 mb-3">How it works</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">1</span>
                                Choose to parse by URL Link or Paste Raw Text.
                            </li>
                            <li className="flex gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">2</span>
                                Gemini deeply analyzes the content structure, finding Headers, Sub-headers, Images/Videos, and Carousel Items.
                            </li>
                            <li className="flex gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">3</span>
                                Copy the formatted text result for your documentation or analysis.
                            </li>
                        </ul>
                     </div>
                </div>
                
                <div className="lg:col-span-2 order-1 lg:order-2 space-y-8">
                    <InputSection onParse={handleParse} isLoading={loading} />
                    <OutputSection result={result} error={error} />
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;
