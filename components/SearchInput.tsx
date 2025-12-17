
import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, X, ImageIcon, FileText, ChevronDown, Globe, Database, BookOpen, Radio, Users, Utensils, ShoppingBag, Plane, Terminal, Lock, Paperclip } from 'lucide-react';

interface AttachedFile {
  name: string;
  type: 'image' | 'text' | 'pdf';
  content: string;
  mimeType: string;
}

interface SearchInputProps {
  theme?: 'light' | 'dark';
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
  onVoiceClick?: () => void; 
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
    theme = 'dark',
    onSearch, 
    isSearching, 
    centered, 
    activeMode, 
    onModeChange,
    onFileSelect,
    attachedFile, 
    onRemoveFile,
    onCameraClick,
    isPro,
    onVoiceClick
}) => {
  const [query, setQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
              setShowModeMenu(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() || attachedFile) {
      onSearch(query, activeMode);
      setShowModeMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && onFileSelect) {
          onFileSelect(e.target.files[0]);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

  const getPlaceholder = () => {
      if (attachedFile && attachedFile.type === 'image') return "Ask about this image...";
      const modeLabel = MODES.find(m => m.id === activeMode)?.label || 'Web';
      return `Ask ${modeLabel} anything...`;
  };

  const ActiveIcon = MODES.find(m => m.id === activeMode)?.icon || Globe;

  return (
    <div 
      className={`transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-full max-w-3xl mx-auto flex flex-col items-center z-30 ${
        centered ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 pointer-events-none scale-95 absolute'
      }`}
    >
      <div 
        className="w-full relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
          <div 
            className={`relative flex flex-col w-full backdrop-blur-2xl border rounded-[32px] p-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl
                ${theme === 'dark' ? 'bg-[#1a1a1a]/95 border-white/10' : 'bg-white/95 border-black/5 shadow-zinc-200'}
                ${isDragging 
                    ? 'ring-2 ring-blue-500 bg-blue-900/20 border-blue-400 scale-[1.02]' 
                    : isFocused 
                        ? (theme === 'dark' ? 'border-white/20 ring-1 ring-white/10 bg-[#1a1a1a]' : 'border-black/10 ring-1 ring-black/5 bg-white') 
                        : ''
                }
            `}
          >
              <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={getPlaceholder()}
                  disabled={isSearching}
                  rows={1}
                  className={`w-full bg-transparent border-none outline-none text-xl placeholder-zinc-500 resize-none min-h-[96px] max-h-[300px] mb-2 custom-scrollbar ${theme === 'dark' ? 'text-white' : 'text-black'}`}
              />

              {attachedFile && (
                <div className={`flex items-center gap-3 mb-4 animate-slideUp p-2 rounded-xl border w-fit ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-100 border-black/5'}`}>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 relative">
                        {attachedFile.type === 'image' ? (
                            <img src={`data:${attachedFile.mimeType};base64,${attachedFile.content}`} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                <FileText size={18} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xs font-medium max-w-[150px] truncate ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{attachedFile.name}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">{attachedFile.type}</span>
                    </div>
                    <button onClick={onRemoveFile} className="p-1.5 hover:bg-red-500/10 rounded-full text-zinc-400 hover:text-red-400 transition-colors ml-2"><X size={14} /></button>
                </div>
              )}

              <div className={`flex items-center justify-between pt-2 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
                  <div className="relative" ref={menuRef}>
                      <button 
                        type="button"
                        onClick={() => setShowModeMenu(!showModeMenu)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 active:scale-95 text-sm font-medium border ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10' : 'bg-zinc-100 border-black/5 text-zinc-500 hover:text-black hover:bg-black/5'}`}
                      >
                          <ActiveIcon size={16} className={activeMode === 'web' ? (theme === 'dark' ? 'text-zinc-300' : 'text-zinc-500') : 'text-blue-500'} />
                          <span>{MODES.find(m => m.id === activeMode)?.label || 'Web'}</span>
                          <ChevronDown size={14} className={`transition-transform duration-300 ${showModeMenu ? 'rotate-180' : ''} opacity-50`} />
                      </button>

                      {showModeMenu && (
                          <div className={`absolute top-full left-0 mt-2 w-56 border rounded-2xl shadow-2xl overflow-hidden z-50 animate-scaleIn origin-top-left p-1.5 ${theme === 'dark' ? 'bg-[#1f1f1f] border-white/10' : 'bg-white border-black/10'}`}>
                              <div className="grid gap-0.5 max-h-[300px] overflow-y-auto glass-scroll">
                                  {MODES.map((mode) => (
                                      <button
                                        key={mode.id}
                                        type="button"
                                        onClick={() => { onModeChange(mode.id as any); setShowModeMenu(false); }}
                                        className={`flex items-center justify-between w-full p-2.5 rounded-xl text-sm transition-all duration-200 active:scale-95 ${
                                            activeMode === mode.id 
                                            ? (theme === 'dark' ? 'bg-zinc-800 text-white font-medium' : 'bg-zinc-100 text-black font-medium') 
                                            : (theme === 'dark' ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-zinc-500 hover:bg-black/5 hover:text-black')
                                        }`}
                                      >
                                          <div className="flex items-center gap-3">
                                              <mode.icon size={16} className={activeMode === mode.id ? 'text-blue-500' : 'opacity-70'} />
                                              <span>{mode.label}</span>
                                          </div>
                                          {mode.isPro && !isPro && <Lock size={12} className="text-yellow-500 opacity-80" />}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="flex items-center gap-2">
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,application/pdf,text/*" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-full hover:bg-zinc-500/10 text-zinc-500 hover:text-blue-500 transition-all active:scale-90" title="Attach"><Paperclip size={20} /></button>
                      <button type="button" onClick={onCameraClick} className="p-2.5 rounded-full hover:bg-zinc-500/10 text-zinc-500 hover:text-blue-500 transition-all active:scale-90" title="Camera"><Camera size={20} /></button>
                      <button type="button" onClick={onVoiceClick} className="p-2.5 rounded-full hover:bg-zinc-500/10 text-zinc-500 hover:text-blue-500 transition-all active:scale-90" title="Voice"><Mic size={20} /></button>
                      
                      <button
                          onClick={() => handleSubmit()}
                          disabled={!query.trim() && !attachedFile}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ml-1 ${
                              !query.trim() && !attachedFile 
                              ? (theme === 'dark' ? 'bg-zinc-800 text-zinc-600' : 'bg-zinc-100 text-zinc-300') 
                              : (theme === 'dark' ? 'bg-white text-black hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-black text-white hover:scale-110 shadow-lg')
                          }`}
                      >
                          <Search size={20} strokeWidth={2.5} />
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SearchInput;
