import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  centered: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isSearching, centered }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div 
      className={`transition-all duration-700 ease-in-out w-full max-w-3xl mx-auto flex flex-col items-center z-30 ${
        centered ? 'translate-y-0 scale-100' : '-translate-y-8 scale-95 opacity-0 pointer-events-none absolute'
      }`}
    >
      {centered && (
        <h1 className="text-3xl md:text-5xl font-semibold text-slate-800 mb-10 tracking-tight text-center">
            What <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">do you want to know?</span>
        </h1>
      )}

      <form onSubmit={handleSubmit} className="w-full relative group">
        <div className="relative flex items-center">
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything..."
            disabled={isSearching}
            className="w-full h-[72px] pl-8 pr-20 rounded-full bg-white border border-gray-200 text-slate-800 placeholder-slate-400 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-xl"
            />
            
            <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="absolute right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all bg-black hover:scale-105 text-white disabled:opacity-30 disabled:hover:scale-100"
            >
                <ArrowRight size={24} />
            </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;