
import React from 'react';
import { Home, Plus, Compass, Clock, User, Image as ImageIcon, Bookmark, Users, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'discover' | 'history' | 'article' | 'images' | 'settings' | 'collections' | 'community' | 'recipe' | 'pricing';
  onTabChange: (tab: 'home' | 'discover' | 'history' | 'images' | 'settings' | 'collections' | 'community' | 'pricing') => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onReset }) => {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-24 flex flex-col items-center justify-between py-8 z-50">
      
      {/* Top: Profile / Settings */}
      <div>
        <button 
          onClick={() => onTabChange('settings')}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all group shadow-sm border border-white/10 ${
              activeTab === 'settings' 
              ? 'bg-white border-white scale-110' 
              : 'bg-zinc-900 border-zinc-800 hover:scale-105 hover:bg-zinc-800'
          }`}
          title="Settings"
        >
          <User size={20} className={activeTab === 'settings' ? 'text-black' : 'text-zinc-400 group-hover:text-white'} />
        </button>
      </div>

      {/* Middle: Navigation Tabs */}
      <div className="flex flex-col gap-6 items-center flex-1 justify-center">
            {/* New Chat (Reset) */}
            <button 
            onClick={onReset}
            className="w-12 h-12 mb-4 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
            title="New Chat"
            >
            <Plus size={24} className="text-black group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="w-8 h-[1px] bg-zinc-800 rounded-full mb-2"></div>

            <button 
                onClick={() => onTabChange('home')}
                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-110 ${
                  activeTab === 'home' || activeTab === 'recipe' 
                    ? 'text-white' 
                    : 'text-zinc-500 hover:text-white'
                }`}
                title="Home"
            >
                <Home size={(activeTab === 'home' || activeTab === 'recipe') ? 28 : 24} strokeWidth={(activeTab === 'home' || activeTab === 'recipe') ? 2.5 : 2} />
            </button>
            
            <button 
                onClick={() => onTabChange('discover')}
                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-110 ${
                  activeTab === 'discover' 
                    ? 'text-white' 
                    : 'text-zinc-500 hover:text-white'
                }`}
                title="Discover"
            >
                <Compass size={activeTab === 'discover' ? 28 : 24} strokeWidth={activeTab === 'discover' ? 2.5 : 2} />
            </button>

            <button 
                onClick={() => onTabChange('community')}
                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-110 ${
                  activeTab === 'community' 
                    ? 'text-white' 
                    : 'text-zinc-500 hover:text-white'
                }`}
                title="Community"
            >
                <Users size={activeTab === 'community' ? 28 : 24} strokeWidth={activeTab === 'community' ? 2.5 : 2} />
            </button>

            <button 
                onClick={() => onTabChange('collections')}
                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-110 ${
                  activeTab === 'collections' 
                    ? 'text-white' 
                    : 'text-zinc-500 hover:text-white'
                }`}
                title="Collections"
            >
                <Bookmark size={activeTab === 'collections' ? 28 : 24} strokeWidth={activeTab === 'collections' ? 2.5 : 2} fill={activeTab === 'collections' ? 'currentColor' : 'none'} />
            </button>
            
             <button 
                onClick={() => onTabChange('history')}
                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-110 ${
                  activeTab === 'history' 
                    ? 'text-white' 
                    : 'text-zinc-500 hover:text-white'
                }`}
                title="History"
            >
                <Clock size={activeTab === 'history' ? 28 : 24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
            </button>

            <button 
                onClick={() => onTabChange('pricing')}
                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-110 ${
                  activeTab === 'pricing' 
                    ? 'text-yellow-400' 
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
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-105 shadow-sm border ${
                activeTab === 'images' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20' 
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
