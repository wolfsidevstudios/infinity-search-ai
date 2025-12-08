import React, { useEffect, useState } from 'react';
import { MediaItem } from '../types';
import { BookOpen, Copy, Check, Share2, Info, Sparkles } from 'lucide-react';
import { getBibleInsight } from '../services/geminiService';

interface BibleResultsViewProps {
  items: MediaItem[];
  query: string;
}

const BibleResultsView: React.FC<BibleResultsViewProps> = ({ items, query }) => {
  const [copied, setCopied] = useState(false);
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  const result = items[0]?.data;

  useEffect(() => {
    const fetchInsight = async () => {
      if (result) {
        setLoadingInsight(true);
        const text = await getBibleInsight(result.reference, result.text);
        setInsight(text);
        setLoadingInsight(false);
      }
    };
    fetchInsight();
  }, [result]);
  
  if (!items.length) {
       return (
           <div className="w-full h-96 flex flex-col items-center justify-center text-zinc-500">
               <BookOpen size={48} className="mb-4 opacity-50" />
               <p>No verses found for "{query}". Try a different reference or keyword.</p>
           </div>
       );
  }

  const handleCopy = () => {
      const textToCopy = `${result.reference}\n\n${result.text}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 animate-slideUp px-4">
      
      {/* Header */}
      <div className="mb-8 pl-2 flex items-center justify-between">
         <div>
             <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium mb-2">
                 <span className="bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 text-[#e7e5e4]">Scripture</span>
                 <span>/</span>
                 <span className="uppercase text-[#a8a29e]">{result.translation_id}</span>
             </div>
             <h1 className="text-4xl font-serif font-bold text-white">
                {result.reference}
             </h1>
         </div>
         
         <div className="flex gap-2">
             <button 
                onClick={handleCopy}
                className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors flex items-center gap-2"
                title="Copy Passage"
             >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
             </button>
             <button className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors">
                 <Share2 size={20} />
             </button>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* Scripture Card (Dark Mode Paper) - Spans 2 cols */}
          <div className="lg:col-span-2 bg-[#1c1917] border border-[#292524] rounded-[10px] p-8 md:p-12 shadow-sm relative flex flex-col h-full">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#292524] rounded-b-full flex items-center justify-center border-b border-x border-[#44403c]">
                  <span className="text-[#a8a29e]">✝</span>
              </div>

              <div className="prose prose-lg max-w-none font-serif leading-loose text-[#e7e5e4] flex-1">
                 {result.verses.map((verse: any) => (
                     <span key={verse.verse} className="relative group">
                         <sup className="text-[10px] text-zinc-500 font-sans mr-1 select-none">{verse.verse}</sup>
                         <span className="hover:bg-white/10 rounded transition-colors">{verse.text}</span>
                         {' '}
                     </span>
                 ))}
              </div>

              <div className="mt-8 pt-8 border-t border-[#292524] flex items-center justify-between text-sm text-[#78716c] font-medium">
                  <span>{result.translation_name}</span>
                  <div className="flex items-center gap-1">
                      <Info size={14} />
                      <span>Public Domain / Open License</span>
                  </div>
              </div>
          </div>

          {/* AI Insight Sidebar - Spans 1 col */}
          <div className="lg:col-span-1 space-y-4">
              <div className="bg-[#2a2725] rounded-[20px] p-6 border border-[#3e3a36] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 mb-4 text-orange-200">
                      <Sparkles size={18} className={loadingInsight ? 'animate-spin' : ''} />
                      <span className="text-xs font-bold uppercase tracking-widest">Divine Insight</span>
                  </div>

                  {loadingInsight ? (
                      <div className="space-y-3 animate-pulse">
                          <div className="h-4 bg-[#3e3a36] rounded w-full"></div>
                          <div className="h-4 bg-[#3e3a36] rounded w-5/6"></div>
                          <div className="h-4 bg-[#3e3a36] rounded w-full"></div>
                          <div className="h-4 bg-[#3e3a36] rounded w-4/6"></div>
                      </div>
                  ) : (
                      <p className="text-[#d6d3d1] font-light leading-relaxed text-sm">
                          {insight}
                      </p>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-[#3e3a36] text-[10px] text-[#78716c] flex justify-between items-center">
                      <span>Powered by Gemini</span>
                  </div>
              </div>

              <div className="flex flex-col gap-2">
                 <button className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-left px-4 flex justify-between group">
                     Read Full Chapter <span className="text-zinc-600 group-hover:text-white transition-colors">→</span>
                 </button>
                 <button className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-left px-4 flex justify-between group">
                     Compare Versions <span className="text-zinc-600 group-hover:text-white transition-colors">→</span>
                 </button>
              </div>
          </div>
      </div>

    </div>
  );
};

export default BibleResultsView;