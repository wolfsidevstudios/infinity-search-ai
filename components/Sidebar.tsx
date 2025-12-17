
import React from 'react';
import { Home, Plus, Compass, Clock, User, Image as ImageIcon, Bookmark, Users, Sparkles, Layout, Grid } from 'lucide-react';

interface SidebarProps {
  theme?: 'light' | 'dark';
  activeTab: 'home' | 'os' | 'discover' | 'history' | 'article' | 'images' | 'settings' | 'collections' | 'community' | 'recipe' | 'pricing' | 'canvas';
  onTabChange: (tab: 'home' | 'os' | 'discover' | 'history' | 'images' | 'settings' | 'collections' | 'community' | 'pricing' | 'canvas') => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ theme = 'dark', activeTab, onTabChange, onReset }) => {
  
  const btnClass = (isActive: boolean) => `
    w-10 h-10 flex items-center justify-center 
    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] 
    hover:scale-110 active:scale-95
    ${isActive 
        ? (theme === 'dark' ? 'text-white' : 'text-black') 
        : (theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black')}
  `;

  return (
    <div className={`hidden md:flex fixed left-0 top-0 bottom-0 w-24 flex-col items-center justify-between py-8 z-50 transition-colors duration-700 ${theme === 'dark' ? 'bg-transparent' : 'bg-[#f5f5f7]/50 backdrop-blur-xl border-r border-black/5'}`}>
      
      {/* Top: Profile / Settings */}
      <div>
        <button 
          onClick={() => onTabChange('settings')}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group shadow-sm border hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] active:scale-95 ${
              activeTab === 'settings' 
              ? (theme === 'dark' ? 'bg-white border-white scale-110' : 'bg-black border-black scale-110') 
              : (theme === 'dark' ? 'bg-zinc-900 border-white/10 hover:bg-zinc-800' : 'bg-white border-black/10 hover:bg-zinc-50')
          }`}
          title="Settings"
        >
          <User size={20} className={`transition-colors duration-300 ${activeTab === 'settings' ? (theme === 'dark' ? 'text-black' : 'text-white') : (theme === 'dark' ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-500 group-hover:text-black')}`} />
        </button>
      </div>

      {/* Middle: Navigation Tabs */}
      <div className="flex flex-col gap-6 items-center flex-1 justify-center">
            <button 
            onClick={onReset}
            className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group ${theme === 'dark' ? 'bg-white text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]' : 'bg-black text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.2)]'}`}
            title="New Chat"
            >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
            </button>

            <div className={`w-8 h-[1px] rounded-full mb-2 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>

            <button onClick={() => onTabChange('home')} className={btnClass(activeTab === 'home' || activeTab === 'recipe')} title="Home">
                <Home size={(activeTab === 'home' || activeTab === 'recipe') ? 28 : 24} strokeWidth={(activeTab === 'home' || activeTab === 'recipe') ? 2.5 : 2} />
            </button>

            <button onClick={() => onTabChange('os')} className={btnClass(activeTab === 'os')} title="Dashboard">
                <Layout size={activeTab === 'os' ? 28 : 24} strokeWidth={activeTab === 'os' ? 2.5 : 2} />
            </button>

            <button onClick={() => onTabChange('canvas')} className={btnClass(activeTab === 'canvas')} title="Canvas">
                <Grid size={activeTab === 'canvas' ? 28 : 24} strokeWidth={activeTab === 'canvas' ? 2.5 : 2} />
            </button>
            
            <button onClick={() => onTabChange('discover')} className={btnClass(activeTab === 'discover')} title="Discover">
                <Compass size={activeTab === 'discover' ? 28 : 24} strokeWidth={activeTab === 'discover' ? 2.5 : 2} />
            </button>

            <button onClick={() => onTabChange('community')} className={btnClass(activeTab === 'community')} title="Community">
                <Users size={activeTab === 'community' ? 28 : 24} strokeWidth={activeTab === 'community' ? 2.5 : 2} />
            </button>

            <button onClick={() => onTabChange('collections')} className={btnClass(activeTab === 'collections')} title="Collections">
                <Bookmark size={activeTab === 'collections' ? 28 : 24} strokeWidth={activeTab === 'collections' ? 2.5 : 2} fill={activeTab === 'collections' ? 'currentColor' : 'none'} />
            </button>
            
             <button onClick={() => onTabChange('history')} className={btnClass(activeTab === 'history')} title="History">
                <Clock size={activeTab === 'history' ? 28 : 24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
            </button>

            <button 
                onClick={() => onTabChange('pricing')}
                className={`w-10 h-10 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-110 active:scale-95 ${
                  activeTab === 'pricing' 
                    ? 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]' 
                    : (theme === 'dark' ? 'text-zinc-500 hover:text-yellow-200' : 'text-zinc-400 hover:text-yellow-600')
                }`}
                title="Plus"
            >
                <Sparkles size={activeTab === 'pricing' ? 28 : 24} strokeWidth={activeTab === 'pricing' ? 2.5 : 2} fill={activeTab === 'pricing' ? 'currentColor' : 'none'} />
            </button>
      </div>

      {/* Bottom: Images Tab */}
      <div className="pt-4">
        <button 
            onClick={() => onTabChange('images')}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 active:scale-95 shadow-sm border ${
                activeTab === 'images' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                : (theme === 'dark' ? 'bg-zinc-900 text-zinc-500 border-white/10 hover:text-blue-500' : 'bg-white text-zinc-400 border-black/5 hover:text-blue-600 shadow-inner')
            }`}
            title="Images"
        >
            <ImageIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
