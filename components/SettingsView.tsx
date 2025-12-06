
import React, { useState, useEffect } from 'react';
import { User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone, Image as ImageIcon, Check, BookOpen } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { BIBLE_VERSIONS } from '../services/bibleService';

interface SettingsViewProps {
  isSpotifyConnected: boolean;
  isNotionConnected: boolean;
  isFigmaConnected: boolean;
  onConnectNotion: () => void;
  onConnectSpotify: () => void;
  onConnectFigma: () => void;
  onWallpaperChange: (url: string | null) => void;
  currentWallpaper: string | null;
  user: SupabaseUser | null;
}

type Tab = 'profile' | 'customization' | 'wallpapers' | 'ai' | 'bible' | 'connected';

const WALLPAPERS = [
  { id: 'default', url: null, name: 'Default Black' },
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
    currentWallpaper,
    user
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  // Bible Settings
  const [bibleLang, setBibleLang] = useState<'en' | 'es'>('en');
  const [bibleVersion, setBibleVersion] = useState<string>('kjv');

  useEffect(() => {
    // Load saved key on mount
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
    
    const savedBibleVersion = localStorage.getItem('bible_version') || 'kjv';
    const savedBibleLang = localStorage.getItem('bible_lang') || 'en';
    setBibleVersion(savedBibleVersion);
    setBibleLang(savedBibleLang as 'en' | 'es');
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

  const handleBibleSave = (version: string) => {
      setBibleVersion(version);
      localStorage.setItem('bible_version', version);
      localStorage.setItem('bible_lang', bibleLang);
  };

  const navItemClass = (tab: Tab) => `
    flex items-center gap-3 px-6 py-3.5 rounded-full transition-all cursor-pointer font-medium mb-1.5
    ${activeTab === tab 
        ? 'bg-white text-black shadow-lg transform scale-105' 
        : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}
  `;

  // Get user details or defaults
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-black animate-fadeIn text-white">
      
      {/* Sidebar Navigation - Full Height */}
      <div className="w-full md:w-80 shrink-0 h-full border-r border-white/10 bg-black flex flex-col p-6 md:p-8">
        <h2 className="text-3xl font-bold text-white mb-10 pl-2">Settings</h2>
        
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
            <div onClick={() => setActiveTab('bible')} className={navItemClass('bible')}>
                <BookOpen size={20} /> Bible Preferences
            </div>
            <div onClick={() => setActiveTab('ai')} className={navItemClass('ai')}>
                <Cpu size={20} /> Feature AI
            </div>
            <div onClick={() => setActiveTab('connected')} className={navItemClass('connected')}>
                <LinkIcon size={20} /> Connected Apps
            </div>
        </div>

        <div className="mt-auto pl-4 text-xs text-zinc-500 font-medium">
            Infinity v2.1.0
        </div>
      </div>

      {/* Main Content Area - Full Height & Black */}
      <div className="flex-1 h-full bg-black p-6 md:p-12 overflow-y-auto relative">
          
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">My Profile</h3>
              
              <div className="flex items-center gap-6 p-6 bg-zinc-900 rounded-[32px] border border-zinc-800">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-black overflow-hidden">
                   {avatarUrl ? (
                       <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                       displayName.charAt(0).toUpperCase()
                   )}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white">{displayName}</h4>
                  <p className="text-zinc-400 font-medium">Infinity Free Plan</p>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 ml-3 tracking-wider uppercase">Full Name</label>
                  <input type="text" readOnly value={displayName} className="w-full h-14 px-6 bg-zinc-900 border border-zinc-800 rounded-full focus:ring-4 focus:ring-white/10 focus:border-white/20 outline-none transition-all text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 ml-3 tracking-wider uppercase">Email Address</label>
                  <input type="email" readOnly value={displayEmail} className="w-full h-14 px-6 bg-zinc-900 border border-zinc-800 rounded-full focus:ring-4 focus:ring-white/10 focus:border-white/20 outline-none transition-all text-white" />
                </div>
              </div>

               <div className="pt-4">
                  <button className="h-14 px-10 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform shadow-xl hover:shadow-2xl hover:bg-gray-200">
                      Update Profile
                  </button>
               </div>
            </div>
          )}

          {/* TAB: CUSTOMIZATION */}
          {activeTab === 'customization' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Customization</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-sm hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-black border border-zinc-800 text-white flex items-center justify-center"><Palette size={20}/></div>
                        <div>
                            <h4 className="font-bold text-lg text-white">Dark Mode</h4>
                            <p className="text-sm text-zinc-400">Switch between light and dark themes</p>
                        </div>
                    </div>
                    <div className="w-16 h-9 bg-zinc-700 rounded-full relative cursor-pointer transition-colors hover:bg-zinc-600">
                        <div className="absolute right-1 top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform"></div>
                    </div>
                </div>

                 <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-sm hover:border-zinc-700 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center"><Smartphone size={20}/></div>
                        <div>
                            <h4 className="font-bold text-lg text-white">Reduced Motion</h4>
                            <p className="text-sm text-zinc-400">Disable complex animations</p>
                        </div>
                    </div>
                    <div className="w-16 h-9 bg-zinc-800 rounded-full relative cursor-pointer transition-colors hover:bg-zinc-700">
                         <div className="absolute left-1 top-1 w-7 h-7 bg-zinc-500 rounded-full shadow-md transition-transform"></div>
                    </div>
                </div>
              </div>
            </div>
          )}

           {/* TAB: WALLPAPERS */}
           {activeTab === 'wallpapers' && (
            <div className="space-y-8 animate-slideUp max-w-4xl">
              <h3 className="text-3xl font-bold text-white">Home Wallpaper</h3>
              <p className="text-zinc-500">Choose a background for your main search dashboard.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {WALLPAPERS.map((wp) => (
                    <div 
                        key={wp.id}
                        onClick={() => onWallpaperChange(wp.url)}
                        className={`group cursor-pointer relative aspect-[9/16] rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-md ${
                            currentWallpaper === wp.url ? 'border-white scale-105 shadow-xl' : 'border-transparent hover:scale-105'
                        }`}
                    >
                        {wp.url ? (
                            <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                                <span className="text-zinc-600 font-bold text-sm">Default</span>
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        
                        {currentWallpaper === wp.url && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-black shadow-lg">
                                <Check size={14} />
                            </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">{wp.name}</span>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BIBLE PREFERENCES */}
          {activeTab === 'bible' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Bible Preferences</h3>
              <p className="text-zinc-500">Select your preferred language and translation for Bible search.</p>

              <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => setBibleLang('en')}
                    className={`px-6 py-3 rounded-full font-bold transition-all ${bibleLang === 'en' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'}`}
                  >
                      English
                  </button>
                  <button 
                    onClick={() => setBibleLang('es')}
                    className={`px-6 py-3 rounded-full font-bold transition-all ${bibleLang === 'es' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'}`}
                  >
                      Español
                  </button>
              </div>

              <div className="space-y-4">
                  {BIBLE_VERSIONS.filter(v => v.language === bibleLang).map((version) => (
                      <div 
                        key={version.id}
                        onClick={() => handleBibleSave(version.id)}
                        className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
                            bibleVersion === version.id 
                            ? 'border-white bg-zinc-900 shadow-md' 
                            : 'border-zinc-800 bg-black hover:border-zinc-600'
                        }`}
                      >
                          <div className="flex items-center gap-4">
                              <BookOpen size={20} className={bibleVersion === version.id ? 'text-white' : 'text-zinc-600'} />
                              <span className={`font-bold ${bibleVersion === version.id ? 'text-white' : 'text-zinc-500'}`}>
                                  {version.name}
                              </span>
                          </div>
                          {bibleVersion === version.id && (
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black">
                                  <Check size={14} />
                              </div>
                          )}
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: AI (API KEY) */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Feature AI</h3>
              <p className="text-blue-200 leading-relaxed font-medium bg-blue-900/20 p-6 rounded-[24px] border border-blue-900/50">
                Unlock the full potential of Infinity by connecting your own Google Gemini API key. 
                Your key is stored locally on your device and never sent to our servers.
              </p>

              <div className="bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 shadow-xl">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-4 ml-2 uppercase tracking-wider">
                    <Key size={14} /> Gemini API Key
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="flex-1 h-14 px-6 bg-black border border-zinc-800 rounded-full focus:ring-4 focus:ring-blue-900/50 focus:border-blue-700 outline-none font-mono text-sm shadow-inner transition-all text-white placeholder-zinc-700"
                    />
                    <button 
                        onClick={handleSaveKey}
                        className={`h-14 px-8 rounded-full font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105 ${isSaved ? 'bg-green-600' : 'bg-white text-black hover:bg-gray-200'}`}
                    >
                        {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
                <p className="text-xs text-blue-400 mt-4 ml-3 font-medium">
                    Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-blue-300">Get one from Google AI Studio</a>.
                </p>
              </div>
            </div>
          )}

          {/* TAB: CONNECTED APPS */}
          {activeTab === 'connected' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Connected Apps</h3>
              
              <div className="space-y-4">
                 {/* Notion Card */}
                 <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-sm hover:border-zinc-600 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm p-3">
                             <svg viewBox="0 0 122.88 128.1" fill="currentColor" className="w-full h-full text-black">
                                <path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/>
                             </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-white">Notion</h4>
                            <p className="text-sm text-zinc-500 font-medium">{isNotionConnected ? 'Connected' : 'Not connected'}</p>
                        </div>
                    </div>
                    <div>
                        {isNotionConnected ? (
                             <button className="h-10 px-6 bg-red-900/20 text-red-400 rounded-full text-sm font-bold border border-red-900/50 hover:bg-red-900/40 transition-colors">Disconnect</button>
                        ) : (
                             <button onClick={onConnectNotion} className="h-10 px-6 bg-white text-black rounded-full text-sm font-bold shadow-md hover:bg-gray-200">Connect</button>
                        )}
                    </div>
                </div>

                 {/* Spotify Card */}
                 <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-sm hover:border-zinc-600 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#1DB954] rounded-2xl flex items-center justify-center text-white shadow-md transform rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42c-.18.3-.55.39-.84.21-2.31-1.41-5.23-1.73-8.66-.95-.33.07-.66-.14-.74-.46-.07-.33.14-.66.46-.74 3.75-.85 7.02-.48 9.57 1.1.3.18.39.55.21.84zm1.2-3.19c-.23.37-.71.49-1.08.26-2.67-1.64-6.74-2.11-9.9-1.15-.4.12-.84-.1-.95-.51-.12-.4.1-.84.51-.95 3.63-1.1 8.16-.57 11.16 1.27.37.23.49.71.26 1.08zm.11-3.32c-3.19-1.89-8.45-2.07-11.5-1.14-.49.15-1.01-.12-1.16-.61-.15-.49.12-1.01.61-1.16 3.53-1.07 9.32-.87 13.01 1.33.44.26.58.83.32 1.27-.26.44-.83.58-1.27.32z"/></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-white">Spotify</h4>
                            <p className="text-sm text-zinc-500 font-medium">{isSpotifyConnected ? 'Connected via OAuth' : 'Not connected'}</p>
                        </div>
                    </div>
                    <div>
                        {isSpotifyConnected ? (
                             <button className="h-10 px-6 bg-red-900/20 text-red-400 rounded-full text-sm font-bold border border-red-900/50 hover:bg-red-900/40 transition-colors">Disconnect</button>
                        ) : (
                             <button onClick={onConnectSpotify} className="h-10 px-6 bg-[#1DB954] text-white rounded-full text-sm font-bold shadow-md hover:bg-[#1ed760]">Connect</button>
                        )}
                    </div>
                </div>

                {/* Figma Card */}
                <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-sm hover:border-zinc-600 transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-black border border-zinc-700 rounded-2xl flex items-center justify-center text-white shadow-md p-3">
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
                            <h4 className="font-bold text-xl text-white">Figma</h4>
                            <p className="text-sm text-zinc-500 font-medium">{isFigmaConnected ? 'Connected' : 'Not connected'}</p>
                        </div>
                    </div>
                    <div>
                        {isFigmaConnected ? (
                             <button className="h-10 px-6 bg-red-900/20 text-red-400 rounded-full text-sm font-bold border border-red-900/50 hover:bg-red-900/40 transition-colors">Disconnect</button>
                        ) : (
                             <button onClick={onConnectFigma} className="h-10 px-6 bg-white text-black rounded-full text-sm font-bold shadow-md hover:bg-gray-200">Connect</button>
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
