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
    flex items-center gap-3 px-6 py-3.5 rounded-full transition-all cursor-pointer font-medium mb-1.5
    ${activeTab === tab 
        ? 'bg-black text-white shadow-lg transform scale-105' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-black'}
  `;

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-white animate-fadeIn">
      
      {/* Sidebar Navigation - Full Height */}
      <div className="w-full md:w-80 shrink-0 h-full border-r border-gray-100 bg-white flex flex-col p-6 md:p-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 pl-2">Settings</h2>
        
        <div className="flex flex-col gap-1">
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

        <div className="mt-auto pl-4 text-xs text-gray-400 font-medium">
            Lumina v1.5.0
        </div>
      </div>

      {/* Main Content Area - Full Height & White */}
      <div className="flex-1 h-full bg-white p-6 md:p-12 overflow-y-auto relative">
          
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-900">My Profile</h3>
              
              <div className="flex items-center gap-6 p-6 bg-gray-50/80 rounded-[32px] border border-gray-100">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-black flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
                   JD
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">John Doe</h4>
                  <p className="text-slate-500 font-medium">Lumina Free Plan</p>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-3 tracking-wider uppercase">Full Name</label>
                  <input type="text" defaultValue="John Doe" className="w-full h-14 px-6 bg-gray-50 border border-gray-200 rounded-full focus:ring-4 focus:ring-black/5 focus:border-gray-300 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-3 tracking-wider uppercase">Email Address</label>
                  <input type="email" defaultValue="john@example.com" className="w-full h-14 px-6 bg-gray-50 border border-gray-200 rounded-full focus:ring-4 focus:ring-black/5 focus:border-gray-300 outline-none transition-all" />
                </div>
              </div>

               <div className="pt-4">
                  <button className="h-14 px-10 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-xl hover:shadow-2xl">
                      Update Profile
                  </button>
               </div>
            </div>
          )}

          {/* TAB: CUSTOMIZATION */}
          {activeTab === 'customization' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-900">Customization</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center"><Palette size={20}/></div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-900">Dark Mode</h4>
                            <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                        </div>
                    </div>
                    <div className="w-16 h-9 bg-gray-200 rounded-full relative cursor-pointer transition-colors hover:bg-gray-300">
                        <div className="absolute left-1 top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform"></div>
                    </div>
                </div>

                 <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Smartphone size={20}/></div>
                        <div>
                            <h4 className="font-bold text-lg text-slate-900">Reduced Motion</h4>
                            <p className="text-sm text-slate-500">Disable complex animations</p>
                        </div>
                    </div>
                    <div className="w-16 h-9 bg-gray-200 rounded-full relative cursor-pointer transition-colors hover:bg-gray-300">
                         <div className="absolute left-1 top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform"></div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI (API KEY) */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-900">Feature AI</h3>
              <p className="text-slate-600 leading-relaxed font-medium bg-blue-50/50 p-6 rounded-[24px] border border-blue-100">
                Unlock the full potential of Lumina by connecting your own Google Gemini API key. 
                Your key is stored locally on your device and never sent to our servers.
              </p>

              <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-xl">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 ml-2 uppercase tracking-wider">
                    <Key size={14} /> Gemini API Key
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="flex-1 h-14 px-6 bg-gray-50 border border-gray-200 rounded-full focus:ring-4 focus:ring-blue-100 focus:border-blue-300 outline-none font-mono text-sm shadow-inner transition-all"
                    />
                    <button 
                        onClick={handleSaveKey}
                        className={`h-14 px-8 rounded-full font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105 ${isSaved ? 'bg-green-500' : 'bg-black hover:bg-gray-800'}`}
                    >
                        {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
                <p className="text-xs text-blue-600 mt-4 ml-3 font-medium">
                    Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-blue-800">Get one from Google AI Studio</a>.
                </p>
              </div>
            </div>
          )}

          {/* TAB: CONNECTED APPS */}
          {activeTab === 'connected' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-900">Connected Apps</h3>
              
              <div className="space-y-4">
                 {/* Spotify Card */}
                 <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-[32px] shadow-sm hover:shadow-lg transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#1DB954] rounded-2xl flex items-center justify-center text-white shadow-md transform rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42c-.18.3-.55.39-.84.21-2.31-1.41-5.23-1.73-8.66-.95-.33.07-.66-.14-.74-.46-.07-.33.14-.66.46-.74 3.75-.85 7.02-.48 9.57 1.1.3.18.39.55.21.84zm1.2-3.19c-.23.37-.71.49-1.08.26-2.67-1.64-6.74-2.11-9.9-1.15-.4.12-.84-.1-.95-.51-.12-.4.1-.84.51-.95 3.63-1.1 8.16-.57 11.16 1.27.37.23.49.71.26 1.08zm.11-3.32c-3.19-1.89-8.45-2.07-11.5-1.14-.49.15-1.01-.12-1.16-.61-.15-.49.12-1.01.61-1.16 3.53-1.07 9.32-.87 13.01 1.33.44.26.58.83.32 1.27-.26.44-.83.58-1.27.32z"/></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-slate-900">Spotify</h4>
                            <p className="text-sm text-slate-500 font-medium">{isSpotifyConnected ? 'Connected via OAuth' : 'Not connected'}</p>
                        </div>
                    </div>
                    <div>
                        {isSpotifyConnected ? (
                             <button className="h-10 px-6 bg-red-50 text-red-600 rounded-full text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors">Disconnect</button>
                        ) : (
                             <button className="h-10 px-6 bg-[#1DB954] text-white rounded-full text-sm font-bold shadow-md hover:bg-[#1ed760] opacity-50 cursor-not-allowed">Connect</button>
                        )}
                    </div>
                </div>

                {/* Google Card (Placeholder) */}
                <div className="flex items-center justify-between p-6 bg-gray-50 border border-gray-200 rounded-[32px] shadow-inner opacity-70 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-5">
                         <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm transform -rotate-2">
                             <img src="https://www.google.com/favicon.ico" alt="Google" className="w-7 h-7" />
                         </div>
                         <div>
                            <h4 className="font-bold text-xl text-slate-900">Google Drive</h4>
                            <p className="text-sm text-slate-500 font-medium">Coming soon</p>
                        </div>
                    </div>
                     <button className="h-10 px-6 bg-white text-gray-400 border border-gray-200 rounded-full text-sm font-bold cursor-not-allowed">Connect</button>
                </div>
              </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default SettingsView;