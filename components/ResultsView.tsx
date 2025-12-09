import React, { useState, useEffect } from 'react';
import { Source, MediaItem } from '../types';
import { ExternalLink, ImageIcon, Bookmark, Check, Volume2, Square } from 'lucide-react';
import YoutubeResults from './YoutubeResults';

interface ResultsViewProps {
  summary: string;
  sources: Source[];
  images: MediaItem[];
  onOpenImageGrid: () => void;
  onSave: (item: any) => void;
  query?: string;
}

const ResultsView: React.FC<ResultsViewProps> = ({ summary, sources, images, onOpenImageGrid, onSave, query }) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
      // Cleanup speech on unmount
      return () => {
          if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
          }
      };
  }, []);

  const handleSave = (item: any, id: string) => {
      onSave(item);
      setSavedIds(prev => new Set(prev).add(id));
      setTimeout(() => {
          setSavedIds(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
          });
      }, 2000);
  };

  const handleSpeak = () => {
      if (!('speechSynthesis' in window)) return;

      if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      } else {
          window.speechSynthesis.cancel(); // Safety clear
          const utterance = new SpeechSynthesisUtterance(summary);
          utterance.rate = 1.1;
          utterance.pitch = 1;
          utterance.onend = () => setIsSpeaking(false);
          
          window.speechSynthesis.speak(utterance);
          setIsSpeaking(true);
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-20 animate-slideUp">
      
      {/* 1. Summary Card */}
      <div className="w-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-[32px] p-8 shadow-2xl text-white relative group">
        
        {/* Actions Row (Top Right) */}
        <div className="absolute top-6 right-6 flex gap-2">
            <button 
                onClick={handleSpeak}
                className={`p-2 rounded-full transition-all text-white ${isSpeaking ? 'bg-red-500/80 animate-pulse' : 'bg-black/20 hover:bg-black/40'}`}
                title={isSpeaking ? "Stop Speaking" : "Listen to Summary"}
            >
                {isSpeaking ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
            </button>

            <button 
                onClick={() => handleSave({ type: 'note', content: { text: summary, title: 'AI Summary' } }, 'summary')}
                className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-opacity"
                title="Save Summary"
            >
                {savedIds.has('summary') ? <Check size={16} className="text-green-400" /> : <Bookmark size={16} />}
            </button>
        </div>

        <div className="flex items-center gap-2 mb-4 opacity-70">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-semibold">AI Summary</span>
        </div>
        <div className="prose prose-invert prose-lg max-w-none leading-relaxed font-light">
          {summary.split('\n').map((paragraph, idx) => (
             paragraph.trim() && <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* 2. Sources (Floating Pill Cards) */}
      {sources.length > 0 && (
        <div className="w-full overflow-x-auto pb-4 glass-scroll">
            <div className="flex gap-4 px-2">
            {sources.map((source, index) => (
                <div key={index} className="relative group">
                    <a 
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/10 rounded-full py-3 px-5 transition-all duration-300 hover:scale-105 text-white min-w-[200px] max-w-[300px]"
                    >
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img 
                        src={`https://www.google.com/s2/favicons?domain=${source.hostname}&sz=64`} 
                        alt="icon" 
                        className="w-5 h-5 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate w-full group-hover:text-green-300 transition-colors">{source.title}</span>
                        <span className="text-[10px] opacity-60 truncate">{source.hostname}</span>
                    </div>
                    </a>
                    
                    {/* Tiny Save Button */}
                     <button 
                        onClick={() => handleSave({ type: 'web', content: source }, source.uri)}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100"
                    >
                        {savedIds.has(source.uri) ? <Check size={10} /> : <Bookmark size={10} />}
                    </button>
                </div>
            ))}
            </div>
        </div>
      )}

      {/* 3. Images/Media (Squircle Cards) */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.slice(0, 4).map((img) => (
            <div 
              key={img.id} 
              className="relative aspect-square group cursor-pointer"
            >
              <div 
                  className="absolute inset-0 bg-black/20 rounded-[24px] group-hover:scale-95 transition-transform duration-500" 
                  onClick={onOpenImageGrid}
              />
              <img 
                src={img.thumbnailUrl} 
                alt={img.title} 
                className="w-full h-full object-cover rounded-[24px] border-2 border-white/20 shadow-lg group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out"
                onClick={onOpenImageGrid}
              />
              
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleSave({ type: 'image', content: img }, String(img.id));
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
              >
                  {savedIds.has(String(img.id)) ? <Check size={14} /> : <Bookmark size={14} />}
              </button>

              <div 
                  className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent rounded-b-[24px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                <span className="text-white text-xs font-medium capitalize truncate block">View Gallery</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. YouTube Results */}
      {query && (
          <YoutubeResults query={query} />
      )}
    </div>
  );
};

export default ResultsView;