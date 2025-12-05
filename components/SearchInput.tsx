import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Plus, Upload, Music, Globe } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string, mode: 'web' | 'spotify') => void;
  isSearching: boolean;
  centered: boolean;
  activeMode: 'web' | 'spotify';
  onModeChange: (mode: 'web' | 'spotify') => void;
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

  const handleModeSelect = (mode: 'web' | 'spotify') => {
      onModeChange(mode);
      setShowDropdown(false);
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
                    <div className="absolute top-14 left-0 w-56 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-2 animate-slideUp flex flex-col gap-1 overflow-hidden">
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
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-black/5 text-gray-700 transition-all text-left"
                            onClick={() => alert("File upload feature coming soon!")}
                        >
                            <Upload size={18} />
                            <span className="font-medium">File Upload</span>
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => handleModeSelect('spotify')}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeMode === 'spotify' ? 'bg-[#1DB954] text-white shadow-lg' : 'hover:bg-[#1DB954]/10 hover:text-[#1DB954] text-gray-700'}`}
                        >
                            <Music size={18} />
                            <span className="font-medium">Spotify Search</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Input Field */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={activeMode === 'spotify' ? "Search for songs, artists, albums..." : "Search for anything..."}
                disabled={isSearching}
                className={`w-full h-[72px] pl-16 pr-20 rounded-full border border-gray-200 text-slate-800 placeholder-slate-400 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-4 transition-all text-xl ${
                    activeMode === 'spotify' ? 'bg-[#f0f9f4] focus:ring-green-100' : 'bg-white focus:ring-blue-100'
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
