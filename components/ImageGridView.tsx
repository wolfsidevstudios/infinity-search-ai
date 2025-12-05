import React, { useState } from 'react';
import { MediaItem } from '../types';
import { ArrowUp, Play, Image as ImageIcon, Film, Download, ExternalLink } from 'lucide-react';

interface ImageGridViewProps {
  items: MediaItem[];
  onSearch: (query: string, type: 'image' | 'video') => void;
  loading: boolean;
  activeMediaType: 'image' | 'video';
  onMediaTypeChange: (type: 'image' | 'video') => void;
}

const ImageGridView: React.FC<ImageGridViewProps> = ({ items, onSearch, loading, activeMediaType, onMediaTypeChange }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, activeMediaType);
      // Do not clear the query so the user sees what they searched
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col">
       {/* Search Header Area */}
      <div className="w-full px-8 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 z-20 shrink-0">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">Gallery</h2>
            
            {/* Type Switcher */}
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full flex items-center border border-white/20 shadow-lg">
                <button
                    onClick={() => onMediaTypeChange('image')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                        activeMediaType === 'image' 
                        ? 'bg-white text-black shadow-md transform scale-105' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <ImageIcon size={16} /> Photos
                </button>
                <button
                    onClick={() => onMediaTypeChange('video')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                        activeMediaType === 'video' 
                        ? 'bg-white text-black shadow-md transform scale-105' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Film size={16} /> Videos
                </button>
            </div>
      </div>

      {/* Scrollable Grid Container */}
      <div className="flex-1 overflow-y-auto glass-scroll px-4 md:px-8 pb-32">
        <div className="columns-1 md:columns-3 lg:columns-4 gap-6 space-y-6 mx-auto max-w-[1600px] py-4">
          {items.map((item) => (
            <div key={item.id} className="break-inside-avoid relative group">
               <div className="relative rounded-[24px] overflow-hidden bg-gray-900 shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                   <img 
                      src={item.thumbnailUrl || 'https://via.placeholder.com/300x400?text=No+Preview'} 
                      alt={item.title} 
                      loading="lazy"
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=Error'; }}
                   />
                   
                   {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                       
                       {/* Title */}
                       <p className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                           {item.title}
                       </p>
                       
                       {/* Metadata / Source */}
                       <div className="flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                           <span className="text-xs font-medium text-white/70 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">
                               {item.source}
                           </span>
                           
                           {/* Action Buttons */}
                           <div className="flex gap-2">
                               <a href={item.contentUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors" title="View Full Size">
                                   <ExternalLink size={14} />
                               </a>
                           </div>
                       </div>
                   </div>

                   {/* Video Indicator */}
                   {item.type === 'video' && (
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform shadow-lg">
                           <Play size={32} className="text-white fill-current ml-2" />
                       </div>
                   )}
               </div>
            </div>
          ))}
          
          {loading && (
             // Loading Skeletons
             Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-6">
                    <div className="w-full h-64 bg-white/5 animate-pulse rounded-[24px] border border-white/10"></div>
                </div>
             ))
          )}
        </div>

        {items.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-white/40">
                <ImageIcon size={64} className="mb-4 opacity-50" />
                <p className="text-xl font-light">Search for visuals above to start exploring.</p>
            </div>
        )}
      </div>

      {/* Floating Search Bar (Bottom) */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none z-[100]">
        <form 
            onSubmit={handleSubmit} 
            className="pointer-events-auto w-full max-w-2xl relative group"
        >
             {/* Glow effect */}
             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
             
             <div className="relative flex items-center">
                 <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${activeMediaType}s...`}
                    className="w-full h-16 pl-8 pr-16 bg-[#1a1a1a]/90 backdrop-blur-2xl border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:bg-black focus:border-white/30 shadow-2xl transition-all text-lg"
                 />
                 <button 
                    type="submit"
                    className="absolute right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-black shadow-lg"
                 >
                    <ArrowUp size={24} />
                 </button>
             </div>
        </form>
      </div>
    </div>
  );
};

export default ImageGridView;