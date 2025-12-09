import React, { useState } from 'react';
import { MediaItem } from '../types';
import { Play, Pause, ExternalLink, Mic, Calendar, Clock, Bookmark, Check } from 'lucide-react';

interface PodcastResultsViewProps {
  items: MediaItem[];
  query: string;
  onSave: (item: any) => void;
}

const PodcastResultsView: React.FC<PodcastResultsViewProps> = ({ items, query, onSave }) => {
  const [playingId, setPlayingId] = useState<string | number | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handlePlay = (item: MediaItem) => {
    if (playingId === item.id) {
        audioRef.current?.pause();
        setPlayingId(null);
    } else {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const audio = new Audio(item.contentUrl);
        audio.play();
        audio.onended = () => setPlayingId(null);
        audioRef.current = audio;
        setPlayingId(item.id);
    }
  };

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

  const formatDuration = (seconds?: number) => {
      if (!seconds) return '--:--';
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (!items.length) {
      return (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
              <Mic size={48} className="mb-4 opacity-50" />
              <p>No podcasts found for "{query}"</p>
          </div>
      );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-slideUp px-4">
      <div className="mb-8 pl-2">
         <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium mb-2">
             <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">Audio</span>
             <span>/</span>
             <span className="text-white">Podcasts</span>
         </div>
         <h1 className="text-3xl font-bold text-white">
            Episodes for "{query}"
         </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
              <div 
                key={item.id}
                className={`relative group bg-zinc-900 border border-zinc-800 rounded-[24px] p-4 transition-all duration-300 hover:border-zinc-600 hover:-translate-y-1 ${playingId === item.id ? 'ring-2 ring-red-500/50' : ''}`}
              >
                  {/* Top Section: Art & Play */}
                  <div className="flex gap-4 items-start mb-4">
                      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden shadow-lg">
                          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => handlePlay(item)}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              {playingId === item.id ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                          </button>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">
                              <span className="truncate max-w-[150px]">{item.album}</span>
                          </div>
                          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1" title={item.title}>
                              {item.title}
                          </h3>
                          <p className="text-zinc-500 text-sm truncate">{item.artist}</p>
                      </div>
                  </div>

                  {/* Metadata Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-zinc-500">
                      <div className="flex items-center gap-3">
                          {item.data?.releaseDate && (
                              <div className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  <span>{new Date(item.data.releaseDate).toLocaleDateString()}</span>
                              </div>
                          )}
                          <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{formatDuration(item.duration)}</span>
                          </div>
                      </div>

                      <div className="flex items-center gap-2">
                          <a 
                            href={item.pageUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                          >
                              <ExternalLink size={14} />
                          </a>
                          <button 
                            onClick={() => handleSave(item)}
                            className="p-1.5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                          >
                              {savedIds.has(String(item.id)) ? <Check size={14} className="text-green-500" /> : <Bookmark size={14} />}
                          </button>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default PodcastResultsView;