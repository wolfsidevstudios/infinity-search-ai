
import React from 'react';
import { CollectionItem } from '../types';
import { Trash2, ExternalLink, Image as ImageIcon, FileText, Music, Bookmark } from 'lucide-react';

interface CollectionsViewProps {
  items: CollectionItem[];
  onRemove: (id: string) => void;
}

const CollectionsView: React.FC<CollectionsViewProps> = ({ items, onRemove }) => {
  if (items.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 animate-fadeIn pb-20">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                  <Bookmark size={32} className="opacity-50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Saved Items</h2>
              <p className="max-w-md text-center">Pin search results, images, and Spotify tracks to build your personal knowledge base.</p>
          </div>
      );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-slideUp px-4">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Bookmark className="text-blue-400" fill="currentColor" /> Collections
        </h2>
        <p className="text-zinc-500">Your personal library of pinned content.</p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item) => (
            <div key={item.id} className="break-inside-avoid bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden group hover:border-white/20 transition-all duration-300 relative">
                
                {/* Delete Button (Hover) */}
                <button 
                    onClick={() => onRemove(item.id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20"
                >
                    <Trash2 size={14} />
                </button>

                {/* Content based on Type */}
                
                {/* 1. Image Type */}
                {item.type === 'image' && (
                    <div className="relative">
                        <img src={item.content.thumbnailUrl} alt={item.content.title} className="w-full h-auto" />
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent">
                             <div className="flex items-center gap-2 text-xs text-blue-300 font-bold uppercase mb-1">
                                <ImageIcon size={12} /> Image
                            </div>
                            <p className="text-white font-medium line-clamp-1">{item.content.title}</p>
                        </div>
                    </div>
                )}

                {/* 2. Web/Text Type */}
                {item.type === 'web' && (
                    <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-purple-300 font-bold uppercase mb-3">
                            <FileText size={12} /> Web Source
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                            {item.content.title}
                        </h3>
                        <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                            {item.content.summary || item.content.hostname}
                        </p>
                        <a 
                            href={item.content.uri} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-white hover:text-blue-400 transition-colors"
                        >
                            Visit Link <ExternalLink size={14} />
                        </a>
                    </div>
                )}

                {/* 3. Audio/Spotify Type */}
                {item.type === 'audio' && (
                    <div className="p-0">
                        <div className="relative h-48">
                            <img src={item.content.thumbnailUrl} className="w-full h-full object-cover" alt="Album" />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-[#1DB954] flex items-center gap-1">
                                <Music size={12} /> Spotify
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-white">{item.content.title}</h3>
                            <p className="text-zinc-400 text-sm mb-4">{item.content.artist}</p>
                            <iframe 
                                src={`https://open.spotify.com/embed/track/${item.content.id}?utm_source=generator&theme=0`} 
                                width="100%" 
                                height="80" 
                                frameBorder="0" 
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                loading="lazy"
                                className="rounded-xl"
                            ></iframe>
                        </div>
                    </div>
                )}

                 {/* 4. Note Type (Generic) */}
                 {item.type === 'note' && (
                    <div className="p-6 bg-yellow-500/10 border-l-4 border-yellow-500">
                        <div className="flex items-center gap-2 text-xs text-yellow-500 font-bold uppercase mb-3">
                            <Bookmark size={12} /> Quick Note
                        </div>
                        <p className="text-white text-lg font-serif italic">
                            "{item.content.text}"
                        </p>
                    </div>
                )}

                <div className="px-6 pb-4 pt-0">
                    <span className="text-[10px] text-zinc-600 font-mono">
                        Saved on {new Date(item.dateAdded).toLocaleDateString()}
                    </span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsView;
