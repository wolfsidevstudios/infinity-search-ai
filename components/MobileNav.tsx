
import React from 'react';
import { Home, MessageSquarePlus, Clock, Settings, Sparkles } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onReset: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange, onReset }) => {
  const navItemClass = (isActive: boolean) => `
    flex flex-col items-center justify-center gap-1 w-full h-full
    transition-all duration-300 active:scale-95
    ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
  `;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[88px] bg-[#000000]/90 backdrop-blur-xl border-t border-white/10 z-50 md:hidden pb-5 px-2">
      <div className="flex justify-around items-center h-full">
        
        {/* Home */}
        <button 
            onClick={() => onTabChange('home')} 
            className={navItemClass(activeTab === 'home')}
        >
           <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} fill={activeTab === 'home' ? "currentColor" : "none"} />
           <span className="text-[10px] font-medium tracking-wide">Home</span>
        </button>

        {/* New Chat (OS/Chat Tab) */}
        <button 
            onClick={() => {
                if (activeTab === 'os') {
                    // If already on chat, maybe reset?
                    // For now just stay.
                } else {
                    onTabChange('os');
                }
            }} 
            className={navItemClass(activeTab === 'os')}
        >
           <MessageSquarePlus size={24} strokeWidth={activeTab === 'os' ? 2.5 : 2} />
           <span className="text-[10px] font-medium tracking-wide">New Chat</span>
        </button>

        {/* Recents */}
        <button 
            onClick={() => onTabChange('history')} 
            className={navItemClass(activeTab === 'history')}
        >
           <Clock size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
           <span className="text-[10px] font-medium tracking-wide">Recents</span>
        </button>

        {/* Settings */}
        <button 
            onClick={() => onTabChange('settings')} 
            className={navItemClass(activeTab === 'settings')}
        >
           <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
           <span className="text-[10px] font-medium tracking-wide">Settings</span>
        </button>

      </div>
    </div>
  );
};

export default MobileNav;
