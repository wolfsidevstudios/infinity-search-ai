import React from 'react';
import { Source, MediaItem } from '../types';
import { ExternalLink, ImageIcon } from 'lucide-react';

interface ResultsViewProps {
  summary: string;
  sources: Source[];
  images: MediaItem[];
  onOpenImageGrid: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ summary, sources, images, onOpenImageGrid }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-20 animate-slideUp">
      
      {/* 1. Summary Card */}
      <div className="w-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-[32px] p-8 shadow-2xl text-white">
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
                <a 
                key={index}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/10 rounded-full py-3 px-5 transition-all duration-300 hover:scale-105 group text-white min-w-[200px] max-w-[300px]"
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
              onClick={onOpenImageGrid}
              className="relative aspect-square group cursor-pointer"
            >
              <div className="absolute inset-0 bg-black/20 rounded-[24px] group-hover:scale-95 transition-transform duration-500" />
              <img 
                src={img.thumbnailUrl} 
                alt={img.title} 
                className="w-full h-full object-cover rounded-[24px] border-2 border-white/20 shadow-lg group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent rounded-b-[24px] opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium capitalize truncate block">View Gallery</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsView;