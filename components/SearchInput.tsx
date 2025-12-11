
import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, X, ImageIcon, FileText, ChevronDown, Globe, Database, BookOpen, Radio, Users, Utensils, ShoppingBag, Plane, Terminal, Lock } from 'lucide-react';

interface AttachedFile {
  name: string;
  type: 'image' | 'text' | 'pdf';
  content: string;
  mimeType: string;
}

interface SearchInputProps {
  onSearch: (query: string, mode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight' | 'drive' | 'code') => void;
  isSearching: boolean;
  centered: boolean;
  activeMode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight' | 'drive' | 'code';
  onModeChange: (mode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight' | 'drive' | 'code') => void;
  onFileSelect?: (file: File) => void;
  attachedFile?: AttachedFile | null;
  onRemoveFile?: () => void;
  onCameraClick: () => void;
  isPro: boolean;
}

const MODES = [
  { id: 'web', label: 'Web', icon: Globe, isPro: false },
  { id: 'notion', label: 'Notion', icon: Database, isPro: false },
  { id: 'bible', label: 'Scripture', icon: BookOpen, isPro: false },
  { id: 'podcast', label: 'Podcast', icon: Radio, isPro: false },
  { id: 'community', label: 'Community', icon: Users, isPro: false },
  { id: 'recipe', label: 'Recipes', icon: Utensils, isPro: false },
  { id: 'code', label: 'Code Pilot', icon: Terminal, isPro: false },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, isPro: true },
  { id: 'flight', label: 'Flights', icon: Plane, isPro: true },
] as const;

const SearchInput: React.FC<SearchInputProps> = ({ 
    onSearch, 
    isSearching, 
    centered, 
    activeMode, 
    onModeChange,
    onFileSelect,
    attachedFile, 
    onRemoveFile,
    onCameraClick,
    isPro
}) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
              setShowModeMenu(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          if (recognitionRef.current) {
              recognitionRef.current.stop();
          }
      };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() || attachedFile) {
      onSearch(query, activeMode);
      setShowModeMenu(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && onFileSelect) {
          onFileSelect(e.target.files[0]);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0] && onFileSelect) {
          onFileSelect(e.dataTransfer.files[0]);
      }
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
      };
      
      recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
      };

      recognition.start();
      recognitionRef.current = recognition;
  };

  const getPlaceholder = () => {
      if (isListening) return "Listening...";
      if (attachedFile && attachedFile.type === 'image') return "Ask about this image...";
      
      const modeLabel = MODES.find(m => m.id === activeMode)?.label || 'Web';
      return `Ask ${modeLabel}...`;
  };

  const ActiveIcon = MODES.find(m => m.id === activeMode)?.icon || Globe;

  return (
    <div 
      className={`transition-all duration-700 ease-in-out w-full max-w-3xl mx-auto flex flex-col items-center z-30 ${
        centered ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 pointer-events-none absolute'
      }`}
    >
      <div className="w-full relative">
          
          {/* Main Bar */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex items-center w-full h-14 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 bg-[#1a1a1a]/90 backdrop-blur-xl hover:bg-[#202020] ${isDragging ? 'ring-2 ring-blue-500 bg-blue-900/20' : ''}`}
          >
              {/* Mode Selector */}
              <div className="relative pl-2" ref={menuRef}>
                  <button 
                    type="button"
                    onClick={() => setShowModeMenu(!showModeMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                  >
                      <ActiveIcon size={18} className="text-blue-400" />
                      <span className="text-sm font-medium hidden sm:block">{MODES.find(m => m.id === activeMode)?.label || 'Web'}</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${showModeMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showModeMenu && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a1a] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slideUp">
                          <div className="p-2 grid gap-1 max-h-[300px] overflow-y-auto glass-scroll">
                              {MODES.map((mode) => (
                                  <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => {
                                        onModeChange(mode.id as any);
                                        setShowModeMenu(false);
                                    }}
                                    className={`flex items-center justify-between w-full p-2.5 rounded-xl text-sm transition-all ${
                                        activeMode === mode.id 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                    }`}
                                  >
                                      <div className="flex items-center gap-3">
                                          <mode.icon size={16} />
                                          <span>{mode.label}</span>
                                      </div>
                                      {mode.isPro && !isPro && <Lock size={12} className="text-yellow-500" />}
                                  </button>
                              ))}
                          </div>
                      </div>
                  )}
              </div>

              {/* Divider */}
              <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex-1 flex items-center h-full">
                  <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={getPlaceholder()}
                      disabled={isSearching}
                      className="w-full bg-transparent border-none outline-none text-white text-lg placeholder-zinc-500 h-full"
                  />
                  {/* Hidden File Input */}
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,application/pdf,text/*" />
              </form>

              {/* Right: Actions */}
              <div className="pr-2 flex items-center gap-1">
                  
                  {/* Visual Search / Camera Button */}
                  <button
                      type="button"
                      onClick={onCameraClick}
                      className="p-3 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      title="Visual Search"
                  >
                      <Camera size={20} />
                  </button>

                  <button
                      type="button"
                      onClick={toggleListening}
                      className={`p-3 rounded-full hover:bg-white/10 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-zinc-400 hover:text-white'}`}
                  >
                      <Mic size={20} />
                  </button>
                  
                  {/* Submit */}
                  <button
                      onClick={handleSubmit}
                      disabled={!query.trim() && !attachedFile}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white text-black hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed ml-1"
                  >
                      <Search size={20} />
                  </button>
              </div>
          </div>

          {/* Attached Images - Circles Under Input */}
          {attachedFile && (
            <div className="w-full flex items-center gap-3 mt-4 ml-2 animate-slideUp">
                <div className="relative group">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-zinc-800 shadow-lg">
                        {attachedFile.type === 'image' ? (
                            <img src={`data:${attachedFile.mimeType};base64,${attachedFile.content}`} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                <FileText size={20} />
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={onRemoveFile}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={10} />
                    </button>
                </div>
                
                {attachedFile.type === 'image' && (
                    <div className="flex flex-col">
                        <span className="text-xs text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <ImageIcon size={10} /> Visual Search
                        </span>
                        <span className="text-[10px] text-zinc-500 max-w-[150px] truncate">
                            {attachedFile.name}
                        </span>
                    </div>
                )}
            </div>
          )}

          {/* Drag Overlay Tip */}
          {isDragging && (
              <div className="absolute top-16 left-0 right-0 text-center animate-fadeIn">
                  <div className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-blue-400">
                      Drop image to search
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default SearchInput;
