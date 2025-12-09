import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown, Upload, Globe, FileText, X, BookOpen, Mic, BrainCircuit, Search, Camera, Image as ImageIcon, Users, Utensils, ShoppingBag, Plane } from 'lucide-react';

interface AttachedFile {
  name: string;
  type: 'image' | 'text' | 'pdf';
  content: string;
  mimeType: string;
}

interface SearchInputProps {
  onSearch: (query: string, mode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight') => void;
  isSearching: boolean;
  centered: boolean;
  activeMode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight';
  onModeChange: (mode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight') => void;
  onFileSelect?: (file: File) => void;
  attachedFile?: AttachedFile | null;
  onRemoveFile?: () => void;
  onCameraClick: () => void;
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
    onCameraClick
}) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setShowDropdown(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          // Stop mic if component unmounts
          if (recognitionRef.current) {
              recognitionRef.current.stop();
          }
      };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() || attachedFile) {
      onSearch(query, activeMode);
    }
  };

  const handleModeSelect = (mode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight') => {
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
      if (activeMode === 'notion') return "Search your workspace...";
      if (activeMode === 'bible') return "Search verse, topic, or emotion...";
      if (activeMode === 'podcast') return "Search for podcasts...";
      if (activeMode === 'community') return "Search community posts...";
      if (activeMode === 'recipe') return "What do you want to cook?";
      if (activeMode === 'shopping') return "Search for products...";
      if (activeMode === 'flight') return "Where do you want to go?";
      if (attachedFile && attachedFile.type === 'image') return "Ask about this image...";
      return "Ask anything...";
  };

  const getModeLabel = () => {
      switch(activeMode) {
          case 'notion': return 'Notion';
          case 'bible': return 'Scripture';
          case 'podcast': return 'Podcast';
          case 'community': return 'Community';
          case 'recipe': return 'Recipes';
          case 'shopping': return 'Shopping';
          case 'flight': return 'Flights';
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
          case 'podcast': return <Mic size={16} />;
          case 'community': return <Users size={16} />;
          case 'recipe': return <Utensils size={16} />;
          case 'shopping': return <ShoppingBag size={16} />;
          case 'flight': return <Plane size={16} />;
          default: return <Globe size={16} />;
      }
  };

  const renderDropdownItem = (
      mode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight', 
      icon: React.ReactNode, 
      label: string,
      colorClass: string,
      borderClass: string = 'border-transparent'
  ) => (
      <button 
          type="button"
          onClick={() => handleModeSelect(mode)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all text-sm ${
              activeMode === mode 
              ? `${colorClass} ${borderClass} shadow-sm` 
              : 'hover:bg-white/10 text-gray-300'
          }`}
      >
          {icon}
          <span className="font-medium">{label}</span>
          {activeMode === mode && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />}
      </button>
  );

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
            className={`relative flex items-center w-full h-12 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 bg-[#1a1a1a]/80 backdrop-blur-xl hover:bg-[#202020] ${isDragging ? 'ring-2 ring-blue-500 bg-blue-900/20' : ''}`}
          >
              
              {/* Left: Mode Selector */}
              <div className="relative pl-1 z-20" ref={dropdownRef}>
                  <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors text-xs font-medium"
                  >
                      <span className={`${activeMode === 'web' ? 'text-blue-400' : activeMode === 'notion' ? 'text-white' : activeMode === 'recipe' ? 'text-orange-400' : activeMode === 'shopping' ? 'text-pink-400' : activeMode === 'flight' ? 'text-sky-400' : activeMode === 'podcast' ? 'text-red-400' : activeMode === 'community' ? 'text-sky-400' : 'text-[#e8dccb]'}`}>
                        {getModeIcon()}
                      </span>
                      <span>{getModeLabel()}</span>
                      <ChevronDown size={12} className={`opacity-50 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu (Compact) */}
                  {showDropdown && (
                    <div className="absolute top-10 left-0 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl p-1.5 animate-slideUp flex flex-col gap-0.5 overflow-hidden z-50">
                        {renderDropdownItem('web', <Globe size={16} />, 'Web Search', 'bg-white text-black')}
                        {renderDropdownItem('shopping', <ShoppingBag size={16} />, 'Shopping', 'bg-pink-900/30 text-pink-400 border border-pink-800/50')}
                        {renderDropdownItem('flight', <Plane size={16} />, 'Flights', 'bg-sky-900/30 text-sky-400 border border-sky-800/50')}
                        {renderDropdownItem('recipe', <Utensils size={16} />, 'Recipes', 'bg-orange-900/30 text-orange-400 border border-orange-800/50')}
                        {renderDropdownItem('bible', <BookOpen size={16} />, 'Scripture', 'bg-[#3c3022] text-[#e8dccb] border border-[#5c4b37]')}
                        {renderDropdownItem('community', <Users size={16} />, 'Community', 'bg-sky-900/30 text-sky-400 border border-sky-800/50')}
                        {renderDropdownItem('podcast', <Mic size={16} />, 'Podcast', 'bg-red-900/20 text-red-200 border border-red-900/50')}
                        
                        <div className="h-[1px] bg-white/10 mx-1 my-1"></div>
                        
                        {renderDropdownItem('notion', 
                            <div className="w-4 h-4 flex items-center justify-center">
                                <svg viewBox="0 0 122.88 128.1" fill="currentColor"><path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/></svg>
                            </div>, 
                            'Notion', 
                            'bg-white text-black shadow-lg'
                        )}

                        <button 
                            type="button"
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-white/10 text-gray-300 transition-all text-left text-sm"
                            onClick={handleFileUploadClick}
                        >
                            <Upload size={16} />
                            <span className="font-medium">File Upload</span>
                        </button>
                    </div>
                  )}
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-white/10 mx-2"></div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex-1 flex items-center h-full">
                  <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={getPlaceholder()}
                      disabled={isSearching}
                      className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-zinc-500 h-full px-2"
                  />
                  {/* Hidden File Input */}
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,application/pdf,text/*" />
              </form>

              {/* Right: Actions */}
              <div className="pr-1 flex items-center gap-1">
                  
                  {/* Visual Search / Camera Button */}
                  <button
                      type="button"
                      onClick={onCameraClick}
                      className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      title="Visual Search"
                  >
                      <Camera size={18} />
                  </button>

                  <button
                      type="button"
                      onClick={toggleListening}
                      className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-zinc-400 hover:text-white'}`}
                  >
                      <Mic size={18} />
                  </button>
                  
                  {/* Mobile Circle Button / Submit */}
                  <button
                      onClick={handleSubmit}
                      disabled={!query.trim() && !attachedFile}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white text-black hover:scale-105 shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  >
                      <Search size={16} />
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
              <div className="absolute top-14 left-0 right-0 text-center animate-fadeIn">
                  <div className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-blue-400">
                      Drop image to search
                  </div>
              </div>
          )}

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