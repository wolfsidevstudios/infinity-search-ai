import React from 'react';
import { Home, Plus, Compass, Clock, User, Image as ImageIcon } from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'discover' | 'history' | 'article' | 'images';
  onTabChange: (tab: 'home' | 'discover' | 'history' | 'images') => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onReset }) => {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-24 flex flex-col items-center justify-between py-8 z-50">
      
      {/* Top: Profile */}
      <div>
        <button className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center hover:scale-105 transition-all group shadow-sm">
          <User size={20} className="text-gray-600 group-hover:text-black" />
        </button>
      </div>

      {/* Middle: Navigation Tabs */}
      <div className="flex flex-col gap-6 items-center flex-1 justify-center">
            {/* New Chat (Reset) */}
            <button 
            onClick={onReset}
            className="w-12 h-12 mb-4 rounded-full bg-black flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
            title="New Chat"
            >
            <Plus size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="w-8 h-[1px] bg-gray-300 rounded-full mb-2"></div>

            <button 
                onClick={() => onTabChange('home')}
                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-110 ${
                  activeTab === 'home' 
                    ? 'text-black' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Home"
            >
                <Home size={activeTab === 'home' ? 28 : 24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            </button>
            
            <button 
                onClick={() => onTabChange('discover')}
                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-110 ${
                  activeTab === 'discover' 
                    ? 'text-black' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Discover"
            >
                <Compass size={activeTab === 'discover' ? 28 : 24} strokeWidth={activeTab === 'discover' ? 2.5 : 2} />
            </button>
            
             <button 
                onClick={() => onTabChange('history')}
                className={`w-10 h-10 flex items-center justify-center transition-all hover:scale-110 ${
                  activeTab === 'history' 
                    ? 'text-black' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Recent Chats"
            >
                <Clock size={activeTab === 'history' ? 28 : 24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
            </button>
      </div>

      {/* Bottom: Images Tab */}
      <div className="pt-4">
        <button 
            onClick={() => onTabChange('images')}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-105 shadow-sm border ${
                activeTab === 'images' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200' 
                : 'bg-white text-gray-400 border-gray-200 hover:text-blue-500 hover:border-blue-200'
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