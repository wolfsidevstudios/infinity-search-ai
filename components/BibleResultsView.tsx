
import React from 'react';
import { MediaItem } from '../types';
import { BookOpen, Copy, Check, Share2, Info } from 'lucide-react';

interface BibleResultsViewProps {
  items: MediaItem[];
  query: string;
}

const BibleResultsView: React.FC<BibleResultsViewProps> = ({ items, query }) => {
  const [copied, setCopied] = React.useState(false);
  
  if (!items.length) {
       return (
           <div className="w-full h-96 flex flex-col items-center justify-center text-zinc-500">
               <BookOpen size={48} className="mb-4 opacity-50" />
               <p>No verses found for "{query}". Try a different reference or keyword.</p>
           </div>
       );
  }

  const result = items[0].data; // We usually get one main passage result

  const handleCopy = () => {
      const textToCopy = `${result.reference}\n\n${result.text}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-slideUp px-4">
      
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

      {/* Scripture Card (Dark Mode Paper) */}
      <div className="bg-[#1c1917] border border-[#292524] rounded-[10px] p-8 md:p-12 shadow-sm relative">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#292524] rounded-b-full flex items-center justify-center border-b border-x border-[#44403c]">
              <span className="text-[#a8a29e]">✝</span>
          </div>

          <div className="prose prose-lg max-w-none font-serif leading-loose text-[#e7e5e4]">
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

      {/* Related/Context (Placeholder logic for future expansion) */}
      <div className="mt-12 flex gap-4 overflow-x-auto pb-4">
         <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-bold text-white hover:bg-zinc-800 whitespace-nowrap">
             Read Full Chapter
         </button>
         <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-bold text-white hover:bg-zinc-800 whitespace-nowrap">
             See Commentaries
         </button>
         <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-bold text-white hover:bg-zinc-800 whitespace-nowrap">
             Compare Versions
         </button>
      </div>

    </div>
  );
};

export default BibleResultsView;
