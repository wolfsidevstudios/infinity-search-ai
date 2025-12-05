import React, { useState, useEffect } from 'react';
import { User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone, Image as ImageIcon, Check } from 'lucide-react';

interface SettingsViewProps {
  isSpotifyConnected: boolean;
  isNotionConnected: boolean;
  isFigmaConnected: boolean;
  onConnectNotion: () => void;
  onConnectSpotify: () => void;
  onConnectFigma: () => void;
  onWallpaperChange: (url: string | null) => void;
  currentWallpaper: string | null;
}

type Tab = 'profile' | 'customization' | 'wallpapers' | 'ai' | 'connected';

const WALLPAPERS = [
  { id: 'default', url: null, name: 'Default White' },
  { id: 'abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop', name: 'Neon Abstract' },
  { id: 'user1', url: 'https://iili.io/fItvPs9.jpg', name: 'Dark Gradient' },
  { id: 'user2', url: 'https://iili.io/fItv4xS.jpg', name: 'Soft Mesh' },
];

const SettingsView: React.FC<SettingsViewProps> = ({ 
    isSpotifyConnected, 
    isNotionConnected, 
    isFigmaConnected,
    onConnectNotion, 
    onConnectSpotify, 
    onConnectFigma,
    onWallpaperChange,
    currentWallpaper
}) => {
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
             <div onClick={() => setActiveTab('wallpapers')} className={navItemClass('wallpapers')}>
                <ImageIcon size={20} /> Wallpapers
            </div>
            <div onClick={() => setActiveTab('ai')} className={navItemClass('ai')}>
                <Cpu size={20} /> Feature AI
            </div>
            <div onClick={() => setActiveTab('connected')} className={navItemClass('connected')}>
                <LinkIcon size={20} /> Connected Apps
            </div>
        </div>

        <div className="mt-auto pl-4 text-xs text-gray-400 font-medium">
            Infinity v2.1.0
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
                  <p className="text-slate-500 font-medium">Infinity Free Plan</p>
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

           {/* TAB: WALLPAPERS */}
           {activeTab === 'wallpapers' && (
            <div className="space-y-8 animate-slideUp max-w-4xl">
              <h3 className="text-3xl font-bold text-slate-900">Home Wallpaper</h3>
              <p className="text-slate-500">Choose a background for your main search dashboard.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {WALLPAPERS.map((wp) => (
                    <div 
                        key={wp.id}
                        onClick={() => onWallpaperChange(wp.url)}
                        className={`group cursor-pointer relative aspect-[9/16] rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-md ${
                            currentWallpaper === wp.url ? 'border-black scale-105 shadow-xl' : 'border-transparent hover:scale-105'
                        }`}
                    >
                        {wp.url ? (
                            <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-white flex items-center justify-center border border-gray-100">
                                <span className="text-gray-400 font-bold text-sm">Default</span>
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        
                        {currentWallpaper === wp.url && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white shadow-lg">
                                <Check size={14} />
                            </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">{wp.name}</span>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AI (API KEY) */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-900">Feature AI</h3>
              <p className="text-slate-600 leading-relaxed font-medium bg-blue-50/50 p-6 rounded-[24px] border border-blue-100">
                Unlock the full potential of Infinity by connecting your own Google Gemini API key. 
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
                 {/* Notion Card */}
                 <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-[32px] shadow-sm hover:shadow-lg transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm p-3">
                             <svg viewBox="0 0 122.88 128.1" fill="currentColor" className="w-full h-full text-black">
                                <path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/>
                             </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-slate-900">Notion</h4>
                            <p className="text-sm text-slate-500 font-medium">{isNotionConnected ? 'Connected' : 'Not connected'}</p>
                        </div>
                    </div>
                    <div>
                        {isNotionConnected ? (
                             <button className="h-10 px-6 bg-red-50 text-red-600 rounded-full text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors">Disconnect</button>
                        ) : (
                             <button onClick={onConnectNotion} className="h-10 px-6 bg-black text-white rounded-full text-sm font-bold shadow-md hover:bg-gray-800">Connect</button>
                        )}
                    </div>
                </div>

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
                             <button onClick={onConnectSpotify} className="h-10 px-6 bg-[#1DB954] text-white rounded-full text-sm font-bold shadow-md hover:bg-[#1ed760]">Connect</button>
                        )}
                    </div>
                </div>

                {/* Figma Card */}
                <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-[32px] shadow-sm hover:shadow-lg transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-md p-3">
                             <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 346 512.36">
                                <g fillRule="nonzero">
                                    <path fill="#00B6FF" d="M172.53 246.9c0-42.04 34.09-76.11 76.12-76.11h11.01c.3.01.63-.01.94-.01 47.16 0 85.4 38.25 85.4 85.4 0 47.15-38.24 85.39-85.4 85.39-.31 0-.64-.01-.95-.01l-11 .01c-42.03 0-76.12-34.09-76.12-76.12V246.9z"/>
                                    <path fill="#24CB71" d="M0 426.98c0-47.16 38.24-85.41 85.4-85.41l87.13.01v84.52c0 47.65-39.06 86.26-86.71 86.26C38.67 512.36 0 474.13 0 426.98z"/>
                                    <path fill="#FF7237" d="M172.53.01v170.78h87.13c.3-.01.63.01.94.01 47.16 0 85.4-38.25 85.4-85.4C346 38.24 307.76 0 260.6 0c-.31 0-.64.01-.95.01h-87.12z"/>
                                    <path fill="#FF3737" d="M0 85.39c0 47.16 38.24 85.4 85.4 85.4h87.13V.01H85.39C38.24.01 0 38.24 0 85.39z"/>
                                    <path fill="#874FFF" d="M0 256.18c0 47.16 38.24 85.4 85.4 85.4h87.13V170.8H85.39C38.24 170.8 0 209.03 0 256.18z"/>
                                </g>
                             </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-slate-900">Figma</h4>
                            <p className="text-sm text-slate-500 font-medium">{isFigmaConnected ? 'Connected' : 'Not connected'}</p>
                        </div>
                    </div>
                    <div>
                        {isFigmaConnected ? (
                             <button className="h-10 px-6 bg-red-50 text-red-600 rounded-full text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors">Disconnect</button>
                        ) : (
                             <button onClick={onConnectFigma} className="h-10 px-6 bg-black text-white rounded-full text-sm font-bold shadow-md hover:bg-gray-800">Connect</button>
                        )}
                    </div>
                </div>

              </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default SettingsView;