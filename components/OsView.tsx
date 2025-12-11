
import React, { useState, useEffect } from 'react';
import { User, LogOut, Search, Clock, Calendar, Cloud, LayoutGrid, Cpu, History, Bookmark, Sparkles, Youtube, Mail, HardDrive, Music, Play, ArrowRight, Zap } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { HistoryItem, CollectionItem } from '../types';
import { getWeatherDescription, WeatherData } from '../services/weatherService';

interface OsViewProps {
  user: SupabaseUser | null;
  onLogout: () => void;
  weather: WeatherData | null;
  history: HistoryItem[];
  collections: CollectionItem[];
  onSearch: (query: string) => void;
}

const OsView: React.FC<OsViewProps> = ({ user, onLogout, weather, history, collections, onSearch }) => {
  const [time, setTime] = useState(new Date());
  const [slideIndex, setSlideIndex] = useState(0);
  const [query, setQuery] = useState('');

  // 1. Clock Logic
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Carousel Data Construction
  const cards = [
      { id: 'welcome', type: 'system', title: 'Welcome Back', content: `Infinity OS 26.0 is ready.`, icon: <Cpu size={40} className="text-blue-400" /> },
      ...history.slice(0, 3).map(h => ({ id: h.id, type: 'history', title: 'Recent Search', content: h.title, icon: <History size={40} className="text-purple-400" /> })),
      ...collections.slice(0, 3).map(c => ({ id: c.id, type: 'collection', title: 'Saved Item', content: typeof c.content === 'object' ? c.content.title : 'Saved Note', icon: <Bookmark size={40} className="text-yellow-400" /> })),
      { id: 'widget', type: 'system', title: 'System Status', content: 'All systems operational.', icon: <LayoutGrid size={40} className="text-green-400" /> }
  ];

  // 3. Carousel Auto-Slide
  useEffect(() => {
      const interval = setInterval(() => {
          setSlideIndex((prev) => (prev + 1) % cards.length);
      }, 4000);
      return () => clearInterval(interval);
  }, [cards.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
          onSearch(query);
      }
  };

  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const userName = user?.user_metadata?.full_name || 'Guest User';
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <div className="w-full h-full flex flex-col justify-between px-8 pb-8 pt-4 relative overflow-hidden animate-fadeIn">
      
      {/* --- TOP BAR --- */}
      <div className="flex justify-between items-start z-20">
          {/* Top Left: Profile */}
          <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-2 pr-6 rounded-full shadow-lg">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                      {userAvatar ? (
                          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white"><User size={20} /></div>
                      )}
                  </div>
                  <div>
                      <div className="text-white font-bold leading-tight">{userName}</div>
                      <div className="text-xs text-green-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> Online</div>
                  </div>
              </div>
              <button 
                onClick={onLogout} 
                className="ml-4 text-xs font-medium text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors group"
              >
                  <LogOut size={12} className="group-hover:-translate-x-0.5 transition-transform" /> Sign Out
              </button>
          </div>

          {/* Top Right: Time & Weather */}
          <div className="flex flex-col items-end gap-2 text-right">
              <div className="text-6xl font-light text-white tracking-tighter drop-shadow-xl font-serif-display">
                  {formattedTime}
              </div>
              <div className="flex items-center gap-4 text-zinc-400 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar size={14} /> {formattedDate}
                  </div>
                  <div className="w-[1px] h-3 bg-white/20"></div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                      <Cloud size={14} /> {weather ? `${Math.round(weather.temperature)}°` : '--°'}
                  </div>
              </div>
          </div>
      </div>

      {/* --- CENTER: CAROUSEL --- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative w-full max-w-2xl aspect-[16/9] perspective-1000">
              {cards.map((card, index) => {
                  // Calculate positioning
                  const diff = (index - slideIndex + cards.length) % cards.length;
                  const isCenter = diff === 0;
                  const isNext = diff === 1;
                  const isPrev = diff === cards.length - 1;
                  
                  let className = "absolute inset-0 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 flex flex-col justify-between shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto";
                  let style: React.CSSProperties = {};

                  if (isCenter) {
                      style = { transform: 'scale(1) translateZ(0)', opacity: 1, zIndex: 10 };
                  } else if (isNext) {
                      style = { transform: 'scale(0.8) translateX(60%) rotateY(-15deg)', opacity: 0.4, zIndex: 5 };
                  } else if (isPrev) {
                      style = { transform: 'scale(0.8) translateX(-60%) rotateY(15deg)', opacity: 0.4, zIndex: 5 };
                  } else {
                      style = { transform: 'scale(0.5) translateZ(-500px)', opacity: 0, zIndex: 0 };
                  }

                  return (
                      <div key={card.id + index} className={className} style={style}>
                          <div className="flex justify-between items-start">
                              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                  {card.icon}
                              </div>
                              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{card.type}</span>
                          </div>
                          <div>
                              <h3 className="text-3xl font-bold text-white mb-2 line-clamp-2">{card.content}</h3>
                              <p className="text-zinc-400 font-medium">{card.title}</p>
                          </div>
                          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mt-6">
                              {isCenter && <div className="h-full bg-white animate-[progress_4s_linear]" />}
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="flex flex-col items-center z-20 w-full max-w-5xl mx-auto">
          
          <div className="flex items-end w-full gap-6">
              
              {/* Left Quick Apps */}
              <div className="flex gap-3 pb-1">
                  <a href="https://mail.google.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-900/80 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-zinc-800 hover:scale-110 transition-all hover:-translate-y-2 duration-300 shadow-lg group">
                      <Mail size={20} className="text-red-400 group-hover:text-white transition-colors"/>
                  </a>
                  <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-900/80 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-zinc-800 hover:scale-110 transition-all hover:-translate-y-2 duration-300 shadow-lg group">
                      <HardDrive size={20} className="text-blue-400 group-hover:text-white transition-colors"/>
                  </a>
                  <a href="https://open.spotify.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-900/80 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-zinc-800 hover:scale-110 transition-all hover:-translate-y-2 duration-300 shadow-lg group">
                      <Music size={20} className="text-green-400 group-hover:text-white transition-colors"/>
                  </a>
              </div>

              {/* Center Search Input */}
              <form onSubmit={handleSearchSubmit} className="flex-1 relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                  <div className="relative flex items-center bg-black rounded-full border border-white/10 shadow-2xl overflow-hidden h-12 px-4 transition-all focus-within:border-white/30">
                      <Sparkles size={16} className="text-zinc-500 mr-3 animate-pulse" />
                      <input 
                          type="text" 
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Ask Infinity Assistant about your data..."
                          className="flex-1 bg-transparent text-sm font-mono text-white placeholder-zinc-600 outline-none h-full"
                      />
                      <button type="submit" className="p-1.5 bg-white rounded-full text-black hover:scale-110 transition-transform">
                          <ArrowRight size={14} />
                      </button>
                  </div>
              </form>

              {/* Right Quick Apps */}
              <div className="flex gap-3 pb-1">
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-900/80 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-zinc-800 hover:scale-110 transition-all hover:-translate-y-2 duration-300 shadow-lg group">
                      <Youtube size={20} className="text-red-500 group-hover:text-white transition-colors"/>
                  </a>
                  <button onClick={() => {}} className="w-12 h-12 bg-zinc-900/80 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-zinc-800 hover:scale-110 transition-all hover:-translate-y-2 duration-300 shadow-lg group">
                      <Play size={20} className="text-zinc-400 group-hover:text-white transition-colors fill-current"/>
                  </button>
                  <button onClick={() => {}} className="w-12 h-12 bg-zinc-900/80 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-zinc-800 hover:scale-110 transition-all hover:-translate-y-2 duration-300 shadow-lg group">
                      <LayoutGrid size={20} className="text-orange-400 group-hover:text-white transition-colors"/>
                  </button>
              </div>

          </div>
          
          <div className="mt-4 text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
              Infinity OS v26.0 • System Ready
          </div>

      </div>

      <style>{`
        @keyframes progress {
            0% { width: 0% }
            100% { width: 100% }
        }
      `}</style>
    </div>
  );
};

export default OsView;
