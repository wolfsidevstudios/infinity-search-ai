
import React, { useState } from 'react';
import { Home, Plus, Compass, Clock, User, Image as ImageIcon, Bookmark, Users, Sparkles, Layout, Grid, Briefcase, Archive, Layers, Zap, MoreVertical, ChevronRight } from 'lucide-react';

interface SidebarProps {
  theme?: 'light' | 'dark';
  activeTab: 'home' | 'os' | 'discover' | 'history' | 'article' | 'images' | 'settings' | 'collections' | 'community' | 'recipe' | 'pricing' | 'canvas';
  onTabChange: (tab: any) => void;
  onReset: () => void;
}

interface NavGroupProps {
    id: string;
    label: string;
    icon: React.ElementType;
    active: boolean;
    theme: 'light' | 'dark';
    children: React.ReactNode;
}

const NavGroup: React.FC<NavGroupProps> = ({ id, label, icon: Icon, active, theme, children }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="relative flex flex-col items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group relative
                    ${active 
                        ? (theme === 'dark' ? 'bg-white text-black shadow-lg scale-110' : 'bg-black text-white shadow-lg scale-110') 
                        : (theme === 'dark' ? 'bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 hover:text-white' : 'bg-white text-zinc-400 border border-black/5 hover:bg-zinc-100 hover:text-black')}
                `}
            >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                {active && <div className={`absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`} />}
            </button>

            {/* Hover Popover */}
            <div className={`absolute left-full ml-4 py-2 px-2 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-all duration-300 origin-left z-[100] flex flex-col gap-1 min-w-[140px]
                ${theme === 'dark' ? 'bg-[#1a1a1a]/95 border-white/10' : 'bg-white/95 border-black/5 shadow-zinc-200'}
                ${isHovered ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 -translate-x-4 pointer-events-none'}
            `}>
                <div className="px-3 py-1.5 mb-1 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{label}</span>
                </div>
                {children}
            </div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ theme = 'dark', activeTab, onTabChange, onReset }) => {
  
  const subBtnClass = (isActive: boolean) => `
    flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 w-full text-left
    ${isActive 
        ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-black') 
        : (theme === 'dark' ? 'text-zinc-500 hover:bg-white/5 hover:text-white' : 'text-zinc-400 hover:bg-black/5 hover:text-black')}
  `;

  return (
    <div className={`hidden md:flex fixed left-0 top-0 bottom-0 w-24 flex-col items-center justify-between py-8 z-50 transition-colors duration-700 ${theme === 'dark' ? 'bg-transparent' : 'bg-[#f5f5f7]/50 backdrop-blur-xl border-r border-black/5'}`}>
      
      {/* Top: Profile */}
      <button 
          onClick={() => onTabChange('settings')}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group shadow-sm border active:scale-95 ${
              activeTab === 'settings' 
              ? (theme === 'dark' ? 'bg-white border-white scale-110' : 'bg-black border-black scale-110') 
              : (theme === 'dark' ? 'bg-zinc-900 border-white/10 hover:bg-zinc-800' : 'bg-white border-black/10 hover:bg-zinc-50')
          }`}
          title="Settings"
      >
          <User size={20} className={`transition-colors duration-300 ${activeTab === 'settings' ? (theme === 'dark' ? 'text-black' : 'text-white') : (theme === 'dark' ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-500 group-hover:text-black')}`} />
      </button>

      {/* Main Navigation Groups */}
      <div className="flex flex-col gap-6 items-center flex-1 justify-center w-full">
            {/* 1. Core Group */}
            <div className="flex flex-col gap-4 items-center">
                <button 
                    onClick={onReset}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all duration-500 group ${theme === 'dark' ? 'bg-white text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]' : 'bg-black text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.2)]'}`}
                    title="New Chat"
                >
                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
                <button 
                    onClick={() => onTabChange('home')}
                    className={`p-3 rounded-xl transition-all duration-300 ${activeTab === 'home' ? (theme === 'dark' ? 'text-white' : 'text-black') : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                </button>
            </div>

            <div className={`w-8 h-[1px] rounded-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`}></div>

            {/* 2. Workspace Group */}
            <NavGroup 
                id="workspace" 
                label="Space" 
                icon={Briefcase} 
                theme={theme}
                active={activeTab === 'os' || activeTab === 'canvas'}
            >
                <button onClick={() => onTabChange('os')} className={subBtnClass(activeTab === 'os')}>
                    <Layout size={14} /> Dashboard
                </button>
                <button onClick={() => onTabChange('canvas')} className={subBtnClass(activeTab === 'canvas')}>
                    <Grid size={14} /> Canvas
                </button>
            </NavGroup>

            {/* 3. Explore Group */}
            <NavGroup 
                id="explore" 
                label="Connect" 
                icon={Compass} 
                theme={theme}
                active={activeTab === 'discover' || activeTab === 'community'}
            >
                <button onClick={() => onTabChange('discover')} className={subBtnClass(activeTab === 'discover')}>
                    <Layers size={14} /> Discover
                </button>
                <button onClick={() => onTabChange('community')} className={subBtnClass(activeTab === 'community')}>
                    <Users size={14} /> Community
                </button>
            </NavGroup>

            {/* 4. Vault Group */}
            <NavGroup 
                id="vault" 
                label="Memory" 
                icon={Archive} 
                theme={theme}
                active={activeTab === 'history' || activeTab === 'collections'}
            >
                <button onClick={() => onTabChange('history')} className={subBtnClass(activeTab === 'history')}>
                    <Clock size={14} /> Recents
                </button>
                <button onClick={() => onTabChange('collections')} className={subBtnClass(activeTab === 'collections')}>
                    <Bookmark size={14} /> Pinned
                </button>
            </NavGroup>
      </div>

      {/* Bottom: Gallery & Plus */}
      <div className="flex flex-col gap-4 items-center">
            <NavGroup 
                id="media" 
                label="Creative" 
                icon={ImageIcon} 
                theme={theme}
                active={activeTab === 'images' || activeTab === 'pricing'}
            >
                <button onClick={() => onTabChange('images')} className={subBtnClass(activeTab === 'images')}>
                    <ImageIcon size={14} /> Gallery
                </button>
                <button onClick={() => onTabChange('pricing')} className={subBtnClass(activeTab === 'pricing')}>
                    <Sparkles size={14} className="text-yellow-500" /> Upgrade
                </button>
            </NavGroup>
      </div>
    </div>
  );
};

export default Sidebar;
