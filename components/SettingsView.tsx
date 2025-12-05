import React, { useState, useEffect } from 'react';
import { User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone } from 'lucide-react';

interface SettingsViewProps {
  isSpotifyConnected: boolean;
}

type Tab = 'profile' | 'customization' | 'ai' | 'connected';

const SettingsView: React.FC<SettingsViewProps> = ({ isSpotifyConnected }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved key on mount
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const navItemClass = (tab: Tab) => `
    flex items-center gap-3 px-6 py-4 rounded-full transition-all cursor-pointer font-medium mb-2
    ${activeTab === tab ? 'bg-black text-white shadow-lg transform scale-105' : 'text-gray-500 hover:bg-white/50 hover:text-black'}
  `;

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 p-4 md:p-8 animate-fadeIn">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-72 shrink-0">
        <h2 className="text-3xl font-bold text-white mb-8 pl-4 drop-shadow-md">Settings</h2>
        
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-[32px] p-4 shadow-xl">
            <div onClick={() => setActiveTab('profile')} className={navItemClass('profile')}>
                <User size={20} /> Profile
            </div>
            <div onClick={() => setActiveTab('customization')} className={navItemClass('customization')}>
                <Palette size={20} /> Customization
            </div>
            <div onClick={() => setActiveTab('ai')} className={navItemClass('ai')}>
                <Cpu size={20} /> Feature AI
            </div>
            <div onClick={() => setActiveTab('connected')} className={navItemClass('connected')}>
                <LinkIcon size={20} /> Connected Apps
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white/30 backdrop-blur-2xl border border-white/40 rounded-[40px] p-8 md:p-12 shadow-2xl overflow-y-auto glass-scroll relative">
          
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-800">My Profile</h3>
              
              <div className="flex items-center gap-6 p-6 bg-white/40 rounded-[32px] border border-white/20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white/30">
                   JD
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-800">John Doe</h4>
                  <p className="text-slate-600 font-medium">Lumina Free Plan</p>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 ml-2">FULL NAME</label>
                  <input type="text" defaultValue="John Doe" className="w-full h-14 px-6 bg-white/60 border border-white/50 rounded-full focus:ring-4 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 ml-2">EMAIL ADDRESS</label>
                  <input type="email" defaultValue="john@example.com" className="w-full h-14 px-6 bg-white/60 border border-white/50 rounded-full focus:ring-4 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
              </div>

               <div className="pt-4">
                  <button className="h-14 px-8 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                      Update Profile
                  </button>
               </div>
            </div>
          )}

          {/* TAB: CUSTOMIZATION */}
          {activeTab === 'customization' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-800">Customization</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-white/60 border border-white/40 rounded-[32px]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center"><Palette size={20}/></div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-800">Dark Mode</h4>
                            <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                        </div>
                    </div>
                    <div className="w-16 h-9 bg-slate-200 rounded-full relative cursor-pointer transition-colors hover:bg-slate-300">
                        <div className="absolute left-1 top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform"></div>
                    </div>
                </div>

                 <div className="flex items-center justify-between p-6 bg-white/60 border border-white/40 rounded-[32px]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Smartphone size={20}/></div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-800">Reduced Motion</h4>
                            <p className="text-sm text-slate-500">Disable complex animations</p>
                        </div>
                    </div>
                    <div className="w-16 h-9 bg-slate-200 rounded-full relative cursor-pointer transition-colors hover:bg-slate-300">
                         <div className="absolute left-1 top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform"></div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI (API KEY) */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-800">Feature AI</h3>
              <p className="text-slate-600 leading-relaxed font-medium bg-white/30 p-4 rounded-2xl border border-white/30">
                Unlock the full potential of Lumina by connecting your own Google Gemini API key. 
                Your key is stored locally on your device and never sent to our servers.
              </p>

              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-8 rounded-[32px] border border-blue-100 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-4 ml-2">
                    <Key size={16} /> GEMINI API KEY
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="flex-1 h-14 px-6 bg-white border border-blue-200 rounded-full focus:ring-4 focus:ring-blue-200 outline-none font-mono text-sm shadow-inner"
                    />
                    <button 
                        onClick={handleSaveKey}
                        className={`h-14 px-8 rounded-full font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105 ${isSaved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
                <p className="text-xs text-blue-600 mt-4 ml-2 font-medium">
                    Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-blue-800">Get one from Google AI Studio</a>.
                </p>
              </div>
            </div>
          )}

          {/* TAB: CONNECTED APPS */}
          {activeTab === 'connected' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-800">Connected Apps</h3>
              
              <div className="space-y-4">
                 {/* Spotify Card */}
                 <div className="flex items-center justify-between p-6 bg-white/70 border border-white/50 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#1DB954] rounded-2xl flex items-center justify-center text-white shadow-md transform rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42c-.18.3-.55.39-.84.21-2.31-1.41-5.23-1.73-8.66-.95-.33.07-.66-.14-.74-.46-.07-.33.14-.66.46-.74 3.75-.85 7.02-.48 9.57 1.1.3.18.39.55.21.84zm1.2-3.19c-.23.37-.71.49-1.08.26-2.67-1.64-6.74-2.11-9.9-1.15-.4.12-.84-.1-.95-.51-.12-.4.1-.84.51-.95 3.63-1.1 8.16-.57 11.16 1.27.37.23.49.71.26 1.08zm.11-3.32c-3.19-1.89-8.45-2.07-11.5-1.14-.49.15-1.01-.12-1.16-.61-.15-.49.12-1.01.61-1.16 3.53-1.07 9.32-.87 13.01 1.33.44.26.58.83.32 1.27-.26.44-.83.58-1.27.32z"/></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-slate-800">Spotify</h4>
                            <p className="text-sm text-slate-500 font-medium">{isSpotifyConnected ? 'Connected via OAuth' : 'Not connected'}</p>
                        </div>
                    </div>
                    <div>
                        {isSpotifyConnected ? (
                             <button className="h-10 px-5 bg-red-50 text-red-600 rounded-full text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors">Disconnect</button>
                        ) : (
                             <button className="h-10 px-5 bg-[#1DB954] text-white rounded-full text-sm font-bold shadow-md hover:bg-[#1ed760] opacity-50 cursor-not-allowed">Connect</button>
                        )}
                    </div>
                </div>

                {/* Google Card (Placeholder) */}
                <div className="flex items-center justify-between p-6 bg-white/40 border border-white/30 rounded-[32px] shadow-sm opacity-60 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-5">
                         <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm transform -rotate-2">
                             <img src="https://www.google.com/favicon.ico" alt="Google" className="w-7 h-7" />
                         </div>
                         <div>
                            <h4 className="font-bold text-xl text-slate-800">Google Drive</h4>
                            <p className="text-sm text-slate-500 font-medium">Coming soon</p>
                        </div>
                    </div>
                     <button className="h-10 px-5 bg-gray-100 text-gray-400 rounded-full text-sm font-bold cursor-not-allowed">Connect</button>
                </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default SettingsView;