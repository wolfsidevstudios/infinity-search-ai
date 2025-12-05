import React, { useState, useEffect } from 'react';
import { X, User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  isSpotifyConnected: boolean;
}

type Tab = 'profile' | 'customization' | 'ai' | 'connected';

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, isSpotifyConnected }) => {
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
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-medium
    ${activeTab === tab ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}
  `;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative bg-white/90 backdrop-blur-2xl w-full max-w-4xl h-[600px] rounded-[32px] shadow-2xl flex overflow-hidden animate-slideUp border border-white/40">
        
        {/* Sidebar */}
        <div className="w-64 bg-white/50 border-r border-gray-200/50 p-6 flex flex-col gap-2">
          <h2 className="text-2xl font-bold mb-8 pl-2">Settings</h2>
          
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

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto glass-scroll relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-3xl font-bold">My Profile</h3>
              
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                   JD
                </div>
                <div>
                  <h4 className="text-xl font-bold">John Doe</h4>
                  <p className="text-gray-500">Free Plan</p>
                </div>
              </div>

              <div className="grid gap-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Full Name</label>
                  <input type="text" defaultValue="John Doe" className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Email Address</label>
                  <input type="email" defaultValue="john@example.com" className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMIZATION */}
          {activeTab === 'customization' && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-3xl font-bold">Customization</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center"><Palette size={18}/></div>
                        <div>
                            <h4 className="font-bold">Dark Mode</h4>
                            <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                        </div>
                    </div>
                    <div className="w-14 h-8 bg-gray-200 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>

                 <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Smartphone size={18}/></div>
                        <div>
                            <h4 className="font-bold">Reduced Motion</h4>
                            <p className="text-sm text-gray-500">Disable complex animations</p>
                        </div>
                    </div>
                    <div className="w-14 h-8 bg-gray-200 rounded-full relative cursor-pointer">
                         <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AI (API KEY) */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-3xl font-bold">Feature AI</h3>
              <p className="text-gray-600 leading-relaxed">
                Unlock the full potential of Lumina by connecting your own Google Gemini API key. 
                Your key is stored locally on your device and never sent to our servers.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <label className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-3">
                    <Key size={16} /> GEMINI API KEY
                </label>
                <div className="flex gap-3">
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="flex-1 p-4 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-200 outline-none font-mono text-sm"
                    />
                    <button 
                        onClick={handleSaveKey}
                        className={`px-6 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${isSaved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                    Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold">Get one from Google AI Studio</a>.
                </p>
              </div>
            </div>
          )}

          {/* TAB: CONNECTED APPS */}
          {activeTab === 'connected' && (
            <div className="space-y-8 animate-fadeIn">
              <h3 className="text-3xl font-bold">Connected Apps</h3>
              
              <div className="space-y-4">
                 {/* Spotify Card */}
                 <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#1DB954] rounded-xl flex items-center justify-center text-white shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42c-.18.3-.55.39-.84.21-2.31-1.41-5.23-1.73-8.66-.95-.33.07-.66-.14-.74-.46-.07-.33.14-.66.46-.74 3.75-.85 7.02-.48 9.57 1.1.3.18.39.55.21.84zm1.2-3.19c-.23.37-.71.49-1.08.26-2.67-1.64-6.74-2.11-9.9-1.15-.4.12-.84-.1-.95-.51-.12-.4.1-.84.51-.95 3.63-1.1 8.16-.57 11.16 1.27.37.23.49.71.26 1.08zm.11-3.32c-3.19-1.89-8.45-2.07-11.5-1.14-.49.15-1.01-.12-1.16-.61-.15-.49.12-1.01.61-1.16 3.53-1.07 9.32-.87 13.01 1.33.44.26.58.83.32 1.27-.26.44-.83.58-1.27.32z"/></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Spotify</h4>
                            <p className="text-sm text-gray-500">{isSpotifyConnected ? 'Connected via OAuth' : 'Not connected'}</p>
                        </div>
                    </div>
                    <div>
                        {isSpotifyConnected ? (
                             <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100 hover:bg-red-100">Disconnect</button>
                        ) : (
                             <button className="px-4 py-2 bg-[#1DB954] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#1ed760] opacity-50 cursor-not-allowed">Connect</button>
                        )}
                    </div>
                </div>

                {/* Google Card (Placeholder) */}
                <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl shadow-sm opacity-60">
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                             <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="font-bold text-lg">Google Drive</h4>
                            <p className="text-sm text-gray-500">Coming soon</p>
                        </div>
                    </div>
                     <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-bold cursor-not-allowed">Connect</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;