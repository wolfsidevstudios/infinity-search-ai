
import React from 'react';
import { Home, Plus, Compass, Clock, User, Image as ImageIcon, Bookmark, Users, Sparkles, Layout } from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'os' | 'discover' | 'history' | 'article' | 'images' | 'settings' | 'collections' | 'community' | 'recipe' | 'pricing';
  onTabChange: (tab: 'home' | 'os' | 'discover' | 'history' | 'images' | 'settings' | 'collections' | 'community' | 'pricing') => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onReset }) => {
  
  // Common class for icon buttons with iOS physics
  const btnClass = (isActive: boolean) => `
    w-10 h-10 flex items-center justify-center 
    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] 
    hover:scale-110 active:scale-95
    ${isActive ? 'text-white' : 'text-zinc-500 hover:text-white'}
  `;

  return (
    <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-24 flex-col items-center justify-between py-8 z-50">
      
      {/* Top: Profile / Settings */}
      <div>
        <button 
          onClick={() => onTabChange('settings')}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group shadow-sm border border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 ${
              activeTab === 'settings' 
              ? 'bg-white border-white scale-110' 
              : 'bg-zinc-900 border-zinc-800 hover:scale-105 hover:bg-zinc-800'
          }`}
          title="Settings"
        >
          <User size={20} className={`transition-colors duration-300 ${activeTab === 'settings' ? 'text-black' : 'text-zinc-400 group-hover:text-white'}`} />
        </button>
      </div>

      {/* Middle: Navigation Tabs */}
      <div className="flex flex-col gap-6 items-center flex-1 justify-center">
            {/* New Chat (Reset) */}
            <button 
            onClick={onReset}
            className="w-12 h-12 mb-4 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-90 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group"
            title="New Chat"
            >
            <Plus size={24} className="text-black group-hover:rotate-90 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
            </button>

            <div className="w-8 h-[1px] bg-zinc-800 rounded-full mb-2"></div>

            <button 
                onClick={() => onTabChange('home')}
                className={btnClass(activeTab === 'home' || activeTab === 'recipe')}
                title="Home"
            >
                <Home size={(activeTab === 'home' || activeTab === 'recipe') ? 28 : 24} strokeWidth={(activeTab === 'home' || activeTab === 'recipe') ? 2.5 : 2} />
            </button>

            <button 
                onClick={() => onTabChange('os')}
                className={btnClass(activeTab === 'os')}
                title="Infinity OS Dashboard"
            >
                <Layout size={activeTab === 'os' ? 28 : 24} strokeWidth={activeTab === 'os' ? 2.5 : 2} />
            </button>
            
            <button 
                onClick={() => onTabChange('discover')}
                className={btnClass(activeTab === 'discover')}
                title="Discover"
            >
                <Compass size={activeTab === 'discover' ? 28 : 24} strokeWidth={activeTab === 'discover' ? 2.5 : 2} />
            </button>

            <button 
                onClick={() => onTabChange('community')}
                className={btnClass(activeTab === 'community')}
                title="Community"
            >
                <Users size={activeTab === 'community' ? 28 : 24} strokeWidth={activeTab === 'community' ? 2.5 : 2} />
            </button>

            <button 
                onClick={() => onTabChange('collections')}
                className={btnClass(activeTab === 'collections')}
                title="Collections"
            >
                <Bookmark size={activeTab === 'collections' ? 28 : 24} strokeWidth={activeTab === 'collections' ? 2.5 : 2} fill={activeTab === 'collections' ? 'currentColor' : 'none'} />
            </button>
            
             <button 
                onClick={() => onTabChange('history')}
                className={btnClass(activeTab === 'history')}
                title="History"
            >
                <Clock size={activeTab === 'history' ? 28 : 24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
            </button>

            <button 
                onClick={() => onTabChange('pricing')}
                className={`w-10 h-10 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-110 active:scale-95 ${
                  activeTab === 'pricing' 
                    ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                    : 'text-zinc-500 hover:text-yellow-200'
                }`}
                title="Upgrade to Plus"
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
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-blue-500 hover:border-blue-500/30'
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
