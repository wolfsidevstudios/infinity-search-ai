import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown, Upload, Globe, FileText, X, BookOpen, Mic, BrainCircuit, Search } from 'lucide-react';

interface AttachedFile {
  name: string;
  type: 'image' | 'text' | 'pdf';
  content: string;
  mimeType: string;
}

interface SearchInputProps {
  onSearch: (query: string, mode: 'web' | 'notion' | 'bible') => void;
  isSearching: boolean;
  centered: boolean;
  activeMode: 'web' | 'notion' | 'bible';
  onModeChange: (mode: 'web' | 'notion' | 'bible') => void;
  onFileSelect?: (file: File) => void;
  attachedFile?: AttachedFile | null;
  onRemoveFile?: () => void;
  isDeepSearchEnabled: boolean;
  onToggleDeepSearch: (enabled: boolean) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
    onSearch, 
    isSearching, 
    centered, 
    activeMode, 
    onModeChange,
    onFileSelect,
    attachedFile, 
    onRemoveFile,
    isDeepSearchEnabled,
    onToggleDeepSearch
}) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

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
    if (query.trim() || attachedFile) {
      onSearch(query, activeMode);
    }
  };

  const handleModeSelect = (mode: 'web' | 'notion' | 'bible') => {
      onModeChange(mode);
      setShowDropdown(false);
  };

  const handleFileUploadClick = () => {
      fileInputRef.current?.click();
      setShowDropdown(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && onFileSelect) {
          onFileSelect(e.target.files[0]);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleListening = () => {
      if (isListening) {
          recognitionRef.current?.stop();
          setIsListening(false);
      } else {
          startListening();
      }
  };

  const startListening = () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          alert("Speech recognition is not supported in this browser.");
          return;
      }

      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
          setIsListening(false);
          // Auto submit if query populated
      };
      
      recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          // Optional: Auto submit after voice
          // onSearch(transcript, activeMode);
      };

      recognition.start();
      recognitionRef.current = recognition;
  };

  const getPlaceholder = () => {
      if (isListening) return "Listening...";
      if (activeMode === 'notion') return "Search your workspace docs...";
      if (activeMode === 'bible') return "Search verse (e.g., John 3:16) or topic...";
      if (attachedFile) return "Ask about this file...";
      return "";
  };

  const getModeLabel = () => {
      switch(activeMode) {
          case 'notion': return 'Notion';
          case 'bible': return 'Scripture';
          default: return 'Web';
      }
  };

  const getModeIcon = () => {
      switch(activeMode) {
          case 'notion': return (
             <div className="w-4 h-4 flex items-center justify-center">
                <svg viewBox="0 0 122.88 128.1" fill="currentColor"><path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/></svg>
             </div>
          );
          case 'bible': return <BookOpen size={16} />;
          default: return <Globe size={16} />;
      }
  };

  return (
    <div 
      className={`transition-all duration-700 ease-in-out w-full max-w-3xl mx-auto flex flex-col items-center z-30 ${
        centered ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none absolute'
      }`}
    >
      <div className="w-full relative">
          
          {/* Main Bar */}
          <div className={`relative flex items-center w-full h-[64px] rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all ${
              isDeepSearchEnabled ? 'bg-zinc-900/90 ring-1 ring-purple-500/50' : 'bg-[#1a1a1a]/80 backdrop-blur-xl hover:bg-[#202020]'
          }`}>
              
              {/* Left: Mode Selector */}
              <div className="relative pl-2 z-20" ref={dropdownRef}>
                  <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
                  >
                      <span className={`${activeMode === 'web' ? 'text-blue-400' : activeMode === 'notion' ? 'text-white' : 'text-orange-400'}`}>
                        {getModeIcon()}
                      </span>
                      <span>{getModeLabel()}</span>
                      <ChevronDown size={14} className={`opacity-50 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-14 left-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-2 animate-slideUp flex flex-col gap-1 overflow-hidden z-50">
                        <button 
                            type="button"
                            onClick={() => handleModeSelect('web')}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeMode === 'web' ? 'bg-white text-black' : 'hover:bg-white/10 text-gray-300'}`}
                        >
                            <Globe size={18} />
                            <span className="font-medium">Web Search</span>
                        </button>
                        
                        <div className="h-[1px] bg-white/10 mx-2 my-1"></div>

                        <button 
                            type="button"
                            onClick={() => handleModeSelect('bible')}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeMode === 'bible' ? 'bg-[#3c3022] text-[#e8dccb] border border-[#5c4b37]' : 'hover:bg-white/10 text-gray-300'}`}
                        >
                            <BookOpen size={18} />
                            <span className="font-medium">Bible Search</span>
                        </button>

                        <div className="h-[1px] bg-white/10 mx-2 my-1"></div>

                         <button 
                            type="button"
                            onClick={() => handleModeSelect('notion')}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeMode === 'notion' ? 'bg-white text-black shadow-lg' : 'hover:bg-white/10 text-gray-300'}`}
                        >
                            <div className="w-4 h-4 flex items-center justify-center">
                                <svg viewBox="0 0 122.88 128.1" fill="currentColor"><path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/></svg>
                            </div>
                            <span className="font-medium">Notion</span>
                        </button>

                        <div className="h-[1px] bg-white/10 mx-2 my-1"></div>

                        <button 
                            type="button"
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/10 text-gray-300 transition-all text-left"
                            onClick={handleFileUploadClick}
                        >
                            <Upload size={18} />
                            <span className="font-medium">File Upload</span>
                        </button>
                    </div>
                  )}
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/10 mx-2"></div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex-1 flex items-center h-full">
                  <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={getPlaceholder()}
                      disabled={isSearching}
                      className="w-full bg-transparent border-none outline-none text-white text-lg placeholder-zinc-500 h-full px-2"
                  />
                  {/* Hidden File Input */}
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,application/pdf,text/*" />
              </form>

              {/* Right: Actions */}
              <div className="pr-2 flex items-center gap-2">
                  <button
                      type="button"
                      onClick={toggleListening}
                      className={`p-2.5 rounded-full hover:bg-white/10 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-zinc-400 hover:text-white'}`}
                  >
                      <Mic size={20} />
                  </button>
                  
                  {/* Mobile Circle Button / Submit */}
                  <button
                      onClick={handleSubmit}
                      disabled={!query.trim() && !attachedFile}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isDeepSearchEnabled 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20' 
                          : 'bg-white text-black hover:scale-105 shadow-lg'
                      } disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                  >
                      {isDeepSearchEnabled ? <BrainCircuit size={18} /> : <Search size={20} />}
                  </button>
              </div>
          </div>

          {/* Attached File Chip */}
          {attachedFile && (
            <div className="absolute top-[-44px] left-0 animate-slideUp z-20">
                <div className="flex items-center gap-2 bg-zinc-800 backdrop-blur-md border border-zinc-700 pl-3 pr-2 py-1.5 rounded-full shadow-sm text-sm font-medium text-gray-200">
                    <FileText size={14} className="text-blue-400" />
                    <span className="max-w-[150px] truncate">{attachedFile.name}</span>
                    <button 
                        type="button" 
                        onClick={onRemoveFile}
                        className="ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-zinc-700 text-gray-400"
                    >
                        <X size={12} />
                    </button>
                </div>
            </div>
          )}

          {/* Deep Search Toggle (Top Right Floating) */}
          <div className="absolute -top-10 right-0">
               <button
                  type="button"
                  onClick={() => onToggleDeepSearch(!isDeepSearchEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      isDeepSearchEnabled 
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/50' 
                      : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20'
                  }`}
               >
                   <BrainCircuit size={12} /> Deep Search {isDeepSearchEnabled ? 'ON' : 'OFF'}
               </button>
          </div>

          {/* "Hit Enter" Hint */}
          <div className="absolute -bottom-10 left-0 right-0 flex justify-center opacity-0 animate-fadeIn" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <span>Hit</span>
                  <span className="px-1.5 py-0.5 border border-zinc-700 rounded bg-zinc-800/50 text-zinc-400 font-mono text-[10px]">ENTER</span>
                  <span>to SEARCH</span>
              </div>
          </div>

      </div>
    </div>
  );
};

export default SearchInput;