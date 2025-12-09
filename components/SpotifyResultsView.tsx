
import React, { useEffect, useState } from 'react';
import { MediaItem } from '../types';
import { Sparkles, Play, Music, ExternalLink, Bookmark, Check } from 'lucide-react';
import { getMusicInsights } from '../services/geminiService';

interface SpotifyResultsViewProps {
  items: MediaItem[];
  query: string;
  onSave: (item: any) => void;
}

const SpotifyResultsView: React.FC<SpotifyResultsViewProps> = ({ items, query, onSave }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const topResult = items[0];

  useEffect(() => {
    const fetchInsight = async () => {
      if (topResult) {
        setLoadingInsight(true);
        const text = await getMusicInsights(topResult.title, topResult.artist || '');
        setInsight(text);
        setLoadingInsight(false);
      }
    };
    fetchInsight();
  }, [topResult]);

  const handleSave = (item: MediaItem) => {
      onSave({ type: 'audio', content: item });
      setSavedIds(prev => new Set(prev).add(String(item.id)));
      setTimeout(() => {
          setSavedIds(prev => {
              const next = new Set(prev);
              next.delete(String(item.id));
              return next;
          });
      }, 2000);
  };

  if (!items.length) return null;

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-slideUp px-4">
      
      {/* Hero Section: Top Result + Embed + AI */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        
        {/* Left: Album Art & Embed (Dark Theme) */}
        <div className="flex-1 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1DB954] blur-[100px] opacity-10 pointer-events-none"></div>
            
            <button 
                onClick={() => handleSave(topResult)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/40 hover:bg-[#1DB954] rounded-full flex items-center justify-center text-white transition-colors z-20"
            >
                {savedIds.has(String(topResult.id)) ? <Check size={18} /> : <Bookmark size={18} />}
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
                {/* Album Art */}
                <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/5 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <img src={topResult.thumbnailUrl} alt={topResult.title} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 text-center md:text-left pt-2 w-full">
                    <div className="inline-flex items-center gap-1 bg-[#1DB954] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-md">
                        <Music size={12} fill="white" /> TOP RESULT
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight tracking-tight">{topResult.title}</h1>
                    <p className="text-xl text-zinc-400 font-medium mb-6">{topResult.artist}</p>
                    
                    {/* Spotify Embed */}
                    <div className="w-full rounded-2xl overflow-hidden shadow-md">
                        <iframe 
                            src={`https://open.spotify.com/embed/track/${topResult.id}?utm_source=generator&theme=0`} 
                            width="100%" 
                            height="152" 
                            frameBorder="0" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                            title="Spotify Player"
                            className="bg-transparent"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: AI Insight (Dark Theme) */}
        <div className="lg:w-1/3 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-lg flex flex-col justify-center relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 blur-[80px] opacity-10"></div>
             
             <div className="flex items-center gap-2 mb-4 text-purple-400">
                 <Sparkles size={20} className={loadingInsight ? 'animate-spin' : ''} />
                 <span className="text-xs font-bold uppercase tracking-widest">AI Insight</span>
             </div>

             {loadingInsight ? (
                 <div className="space-y-2 animate-pulse">
                     <div className="h-4 bg-white/10 rounded w-full"></div>
                     <div className="h-4 bg-white/10 rounded w-5/6"></div>
                     <div className="h-4 bg-white/10 rounded w-4/6"></div>
                 </div>
             ) : (
                 <p className="text-lg text-zinc-300 font-light leading-relaxed">
                     {insight}
                 </p>
             )}
             
             <div className="mt-auto pt-6 opacity-50 text-xs text-zinc-500">
                 Generated by Gemini for {query}
             </div>
        </div>
      </div>

      {/* List: Other Results */}
      <h2 className="text-2xl font-bold text-white mb-6 pl-2">More Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(1).map((item) => (
              <div 
                key={item.id}
                className="relative flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-[24px] p-3 transition-all duration-300 hover:-translate-y-1 group shadow-sm hover:shadow-md"
              >
                  <a 
                    href={item.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center gap-4 min-w-0"
                  >
                      <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden shadow-sm relative">
                          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play size={16} className="text-white fill-white" />
                          </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                          <h3 className="text-white font-bold truncate group-hover:text-[#1DB954] transition-colors">{item.title}</h3>
                          <p className="text-zinc-400 text-sm truncate">{item.artist}</p>
                          <p className="text-zinc-500 text-xs mt-1">{item.album}</p>
                      </div>
                  </a>

                  <div className="flex flex-col gap-2">
                      <a href={item.pageUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
                          <ExternalLink size={14} />
                      </a>
                      <button 
                        onClick={() => handleSave(item)}
                        className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-[#1DB954] hover:bg-white/10 transition-all"
                      >
                         {savedIds.has(String(item.id)) ? <Check size={14} /> : <Bookmark size={14} />}
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default SpotifyResultsView;
