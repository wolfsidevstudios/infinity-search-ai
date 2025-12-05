import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Plus, Upload, Music, Globe } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string, mode: 'web' | 'spotify' | 'notion') => void;
  isSearching: boolean;
  centered: boolean;
  activeMode: 'web' | 'spotify' | 'notion';
  onModeChange: (mode: 'web' | 'spotify' | 'notion') => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isSearching, centered, activeMode, onModeChange }) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setShowDropdown(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, activeMode);
    }
  };

  const handleModeSelect = (mode: 'web' | 'spotify' | 'notion') => {
      onModeChange(mode);
      setShowDropdown(false);
  };

  const getPlaceholder = () => {
      if (activeMode === 'spotify') return "Search for songs, artists, albums...";
      if (activeMode === 'notion') return "Search your workspace docs...";
      return "Search for anything...";
  };

  return (
    <div 
      className={`transition-all duration-700 ease-in-out w-full max-w-3xl mx-auto flex flex-col items-center z-30 ${
        centered ? 'translate-y-0 scale-100' : '-translate-y-8 scale-95 opacity-0 pointer-events-none absolute'
      }`}
    >
      {centered && (
        <h1 className="text-3xl md:text-5xl font-semibold text-slate-800 mb-10 tracking-tight text-center">
            {activeMode === 'spotify' ? (
                 <>Search <span className="text-[#1DB954]">Spotify</span></>
            ) : activeMode === 'notion' ? (
                 <>Search <span className="text-black">Notion</span></>
            ) : (
                 <>What <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">do you want to know?</span></>
            )}
        </h1>
      )}

      <form onSubmit={handleSubmit} className="w-full relative group">
        <div className="relative flex items-center">
            {/* Plus Button with Dropdown */}
            <div className="absolute left-2 z-20" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${showDropdown ? 'bg-gray-100 rotate-45' : 'bg-transparent hover:bg-gray-100'}`}
                >
                    <Plus size={24} className="text-gray-500" />
                </button>

                {/* Frosted Dropdown */}
                {showDropdown && (
                    <div className="absolute top-14 left-0 w-64 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-2 animate-slideUp flex flex-col gap-1 overflow-hidden">
                        <button 
                            type="button"
                            onClick={() => handleModeSelect('web')}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeMode === 'web' ? 'bg-black text-white' : 'hover:bg-black/5 text-gray-700'}`}
                        >
                            <Globe size={18} />
                            <span className="font-medium">Web Search</span>
                        </button>
                        
                        <div className="h-[1px] bg-gray-200/50 mx-2 my-1"></div>

                         <button 
                            type="button"
                            onClick={() => handleModeSelect('notion')}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeMode === 'notion' ? 'bg-black text-white shadow-lg' : 'hover:bg-black/5 text-gray-700'}`}
                        >
                            <div className="w-4 h-4 flex items-center justify-center">
                                <svg viewBox="0 0 122.88 128.1" fill="currentColor"><path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/></svg>
                            </div>
                            <span className="font-medium">Notion</span>
                        </button>

                        <button 
                            type="button"
                            onClick={() => handleModeSelect('spotify')}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeMode === 'spotify' ? 'bg-[#1DB954] text-white shadow-lg' : 'hover:bg-[#1DB954]/10 hover:text-[#1DB954] text-gray-700'}`}
                        >
                            <Music size={18} />
                            <span className="font-medium">Spotify</span>
                        </button>

                        <div className="h-[1px] bg-gray-200/50 mx-2 my-1"></div>

                        <button 
                            type="button"
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-black/5 text-gray-700 transition-all text-left"
                            onClick={() => alert("File upload feature coming soon!")}
                        >
                            <Upload size={18} />
                            <span className="font-medium">File Upload</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Input Field */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={getPlaceholder()}
                disabled={isSearching}
                className={`w-full h-[72px] pl-16 pr-20 rounded-full border border-gray-200 text-slate-800 placeholder-slate-400 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-4 transition-all text-xl ${
                    activeMode === 'spotify' 
                    ? 'bg-[#f0f9f4] focus:ring-green-100' 
                    : activeMode === 'notion'
                    ? 'bg-gray-50 focus:ring-gray-200'
                    : 'bg-white focus:ring-blue-100'
                }`}
            />
            
            <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className={`absolute right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 text-white disabled:opacity-30 disabled:hover:scale-100 ${
                    activeMode === 'spotify' ? 'bg-[#1DB954]' : 'bg-black'
                }`}
            >
                <ArrowRight size={24} />
            </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;