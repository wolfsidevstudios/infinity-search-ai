
import React, { useState, useEffect } from 'react';
import { User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone, Image as ImageIcon, Check, BookOpen, LogOut, Cloud, RefreshCw, ExternalLink, Thermometer, Crown, DollarSign, Lock, CreditCard, AlertTriangle, Terminal, Settings } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { BIBLE_VERSIONS } from '../services/bibleService';
import DeveloperConsoleView from './DeveloperConsoleView';

interface SettingsViewProps {
  isNotionConnected: boolean;
  onConnectNotion: () => void;
  onWallpaperChange: (url: string | null) => void;
  currentWallpaper: string | null;
  user: SupabaseUser | null;
  onLogout: () => void;
  weatherUnit: 'c' | 'f';
  onToggleWeatherUnit: (unit: 'c' | 'f') => void;
  onUpgradeClick: () => void;
  osVersion?: string;
  onUpdateOS?: (version: string) => void;
}

type Tab = 'profile' | 'customization' | 'wallpapers' | 'cloud' | 'bible' | 'ai' | 'connected' | 'subscription' | 'updates' | 'developer';

const WALLPAPERS = [
  { id: 'default', url: null, name: 'Default Black', isPro: false },
  { id: 'abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop', name: 'Neon Abstract', isPro: true },
  { id: 'user1', url: 'https://iili.io/fItvPs9.jpg', name: 'Dark Gradient', isPro: true },
  { id: 'user2', url: 'https://iili.io/fItv4xS.jpg', name: 'Soft Mesh', isPro: true },
];

const SettingsView: React.FC<SettingsViewProps> = ({ 
    isNotionConnected, 
    onConnectNotion, 
    onWallpaperChange,
    currentWallpaper,
    user,
    onLogout,
    weatherUnit,
    onToggleWeatherUnit,
    onUpgradeClick,
    osVersion = '26.0',
    onUpdateOS
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [apiKey, setApiKey] = useState('');
  const [polarToken, setPolarToken] = useState('polar_oat_A3eSAxJk9CcPfFdmTxBYzY4YtXgOiBy5ULqa836FrZP'); // Pre-filled default
  const [isSaved, setIsSaved] = useState(false);
  const [isPolarSaved, setIsPolarSaved] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.0-flash');
  
  // Update Simulation State
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'downloading' | 'installing' | 'completed'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  // Bible Settings
  const [bibleLang, setBibleLang] = useState<'en' | 'es'>('en');
  const [bibleVersion, setBibleVersion] = useState<string>('kjv');

  useEffect(() => {
    // Load saved key on mount
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);

    const savedPolarToken = localStorage.getItem('polar_access_token');
    if (savedPolarToken) setPolarToken(savedPolarToken);
    
    const savedBibleVersion = localStorage.getItem('bible_version') || 'kjv';
    const savedBibleLang = localStorage.getItem('bible_lang') || 'en';
    setBibleVersion(savedBibleVersion);
    setBibleLang(savedBibleLang as 'en' | 'es');

    const proStatus = localStorage.getItem('infinity_pro_status');
    setIsPro(proStatus === 'active');

    const savedModel = localStorage.getItem('infinity_ai_model') || 'gemini-2.5-flash';
    setSelectedModel(savedModel);
  }, [user]);

  // Update Logic Effect
  useEffect(() => {
      if (activeTab === 'updates' && updateStatus === 'idle' && osVersion === '26.0') {
          setUpdateStatus('checking');
          setTimeout(() => setUpdateStatus('available'), 2000);
      }
  }, [activeTab, updateStatus, osVersion]);

  const handleStartUpdate = () => {
      setUpdateStatus('downloading');
      
      // Simulate Download
      const interval = setInterval(() => {
          setDownloadProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setUpdateStatus('installing');
                  setTimeout(() => {
                      if (onUpdateOS) onUpdateOS('26.1 Beta');
                      setUpdateStatus('completed');
                  }, 2000);
                  return 100;
              }
              return prev + Math.random() * 15;
          });
      }, 500);
  };

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSavePolar = () => {
      if (polarToken.trim()) {
          localStorage.setItem('polar_access_token', polarToken.trim());
      } else {
          localStorage.removeItem('polar_access_token');
      }
      setIsPolarSaved(true);
      setTimeout(() => setIsPolarSaved(false), 2000);
  };

  const handleModelChange = (model: string) => {
      if (model !== 'gemini-2.5-flash' && !isPro) return;
      setSelectedModel(model);
      localStorage.setItem('infinity_ai_model', model);
  };

  const handleCancelSubscription = () => {
      if (window.confirm("Are you sure you want to cancel your Infinity Pro subscription? You will lose access to premium features immediately.")) {
          localStorage.removeItem('infinity_pro_status');
          setIsPro(false);
          alert("Subscription cancelled successfully.");
          // Reset model if on pro model
          if (selectedModel !== 'gemini-2.5-flash') {
              handleModelChange('gemini-2.5-flash');
          }
      }
  };

  const navItemClass = (tab: Tab) => `
    flex items-center gap-3 px-6 py-3.5 rounded-full cursor-pointer font-medium mb-1.5
    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
    ${activeTab === tab 
        ? 'bg-white text-black shadow-lg transform scale-105' 
        : 'text-zinc-500 hover:bg-zinc-900 hover:text-white hover:scale-[1.02] active:scale-[0.98]'}
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
            <div onClick={() => setActiveTab('subscription')} className={navItemClass('subscription')}>
                <CreditCard size={20} /> Subscription
            </div>
            
            <div className="h-[1px] bg-zinc-900 my-2 mx-4"></div>

            <div onClick={() => setActiveTab('updates')} className={navItemClass('updates')}>
                <div className="relative">
                    <Settings size={20} />
                    {osVersion === '26.0' && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></div>}
                </div>
                Software Updates
            </div>

            <div className="h-[1px] bg-zinc-900 my-2 mx-4"></div>

            <div onClick={() => setActiveTab('customization')} className={navItemClass('customization')}>
                <Palette size={20} /> Customization
            </div>
             <div onClick={() => setActiveTab('wallpapers')} className={navItemClass('wallpapers')}>
                <ImageIcon size={20} /> Wallpapers
            </div>
            <div onClick={() => setActiveTab('cloud')} className={navItemClass('cloud')}>
                <Cloud size={20} /> Cloud Storage
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
            
            {/* Developer Section Divider */}
            <div className="h-[1px] bg-zinc-900 my-4 mx-4"></div>
            
            <div onClick={() => setActiveTab('developer')} className={navItemClass('developer')}>
                <Terminal size={20} /> Developer
            </div>
        </div>

        <div className="mt-auto pl-4 text-xs text-zinc-500 font-medium">
            Infinity OS {osVersion}
        </div>
      </div>

      {/* Main Content Area - Full Height & Black */}
      <div className="flex-1 h-full bg-black p-6 md:p-12 overflow-y-auto relative">
          
          {/* TAB: DEVELOPER */}
          {activeTab === 'developer' && (
              <DeveloperConsoleView />
          )}

          {/* TAB: UPDATES */}
          {activeTab === 'updates' && (
              <div className="space-y-8 animate-slideUp max-w-2xl mx-auto pt-10">
                  
                  {/* Status Icon */}
                  <div className="flex justify-center mb-8">
                      <div className="w-32 h-32 bg-zinc-900 rounded-[32px] flex items-center justify-center shadow-2xl border border-zinc-800">
                          {updateStatus === 'checking' || updateStatus === 'downloading' || updateStatus === 'installing' ? (
                              <Settings size={64} className="text-blue-500 animate-spin-slow" />
                          ) : (
                              <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                                  <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="OS" className="w-12 h-12 object-cover rounded-lg" />
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Checking / Up to Date */}
                  {(updateStatus === 'checking' || (updateStatus === 'idle' && osVersion !== '26.0')) && (
                      <div className="text-center">
                          <h3 className="text-2xl font-bold text-white mb-2">
                              {updateStatus === 'checking' ? 'Checking for updates...' : `Infinity OS ${osVersion}`}
                          </h3>
                          {updateStatus !== 'checking' && (
                              <p className="text-zinc-500">Your software is up to date.</p>
                          )}
                      </div>
                  )}

                  {/* Available Update */}
                  {(updateStatus === 'available' || updateStatus === 'downloading' || updateStatus === 'installing') && (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-xl animate-fadeIn">
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h3 className="text-2xl font-bold text-white">Infinity OS 26.1 Beta</h3>
                                  <p className="text-zinc-500 text-sm font-medium mt-1">Infinity Inc. • 345.2 MB</p>
                              </div>
                          </div>
                          
                          <div className="prose prose-invert prose-sm max-w-none text-zinc-400 mb-8">
                              <p>
                                  Infinity OS 26.1 introduces a refined spatial design language, deeper integration with next-gen reasoning models, and significant stability improvements.
                              </p>
                              <ul className="list-disc pl-4 space-y-1 mt-2">
                                  <li>New "Fluid Physics" animation engine.</li>
                                  <li>Improved "Deep Think" latency.</li>
                                  <li>Security patches for local storage encryption.</li>
                              </ul>
                          </div>

                          {updateStatus === 'available' ? (
                              <button 
                                  onClick={handleStartUpdate}
                                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                              >
                                  Download and Install
                              </button>
                          ) : (
                              <div className="space-y-3">
                                  <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                      <span>{updateStatus === 'downloading' ? 'Downloading...' : 'Installing...'}</span>
                                      <span>{Math.round(downloadProgress)}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-zinc-800">
                                      <div 
                                          className="h-full bg-blue-500 transition-all duration-300 ease-linear" 
                                          style={{ width: `${downloadProgress}%` }} 
                                      />
                                  </div>
                                  <p className="text-center text-xs text-zinc-600 mt-2">
                                      Do not close this tab.
                                  </p>
                              </div>
                          )}
                      </div>
                  )}

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                      <span className="text-white font-medium">Automatic Updates</span>
                      <div className="w-12 h-7 bg-green-500 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
                      </div>
                  </div>

              </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">My Profile</h3>
              
              <div className="flex items-center gap-6 p-6 bg-zinc-900 rounded-[32px] border border-zinc-800 relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.01]">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-black overflow-hidden relative z-10">
                   {avatarUrl ? (
                       <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                       displayName.charAt(0).toUpperCase()
                   )}
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold text-white">{displayName}</h4>
                  <p className={`font-medium flex items-center gap-2 ${isPro ? 'text-yellow-400' : 'text-zinc-400'}`}>
                      {isPro ? <><Crown size={14} fill="currentColor"/> Infinity Pro Plan</> : 'Infinity Free Plan'}
                  </p>
                </div>
                
                {!isPro && (
                    <button 
                        onClick={onUpgradeClick}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-lg z-20"
                    >
                        <Crown size={14} /> Upgrade Plan
                    </button>
                )}
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

               <div className="pt-8 flex gap-4">
                  <button className="h-14 px-10 bg-white text-black rounded-full font-bold transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:bg-gray-200">
                      Update Profile
                  </button>
                  <button 
                    onClick={onLogout}
                    className="h-14 px-10 bg-red-900/20 border border-red-900/50 text-red-500 rounded-full font-bold transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-red-900/40 hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                      <LogOut size={18} /> Sign Out
                  </button>
               </div>
            </div>
          )}

          {/* TAB: SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Subscription Management</h3>
              
              {isPro ? (
                  <div className="bg-zinc-900 border border-yellow-500/30 rounded-[32px] p-8 relative overflow-hidden shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.01]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[80px] pointer-events-none"></div>
                      
                      <div className="flex items-center gap-6 mb-8 relative z-10">
                          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                              <Crown size={32} className="text-white" fill="currentColor" />
                          </div>
                          <div>
                              <h4 className="text-3xl font-bold text-white mb-1">Infinity Pro</h4>
                              <div className="flex items-center gap-2 text-green-400 text-sm font-bold uppercase tracking-wider bg-green-900/20 px-3 py-1 rounded-full border border-green-900/50 w-fit">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                  Active Subscription
                              </div>
                          </div>
                      </div>

                      <div className="space-y-5 mb-10 border-t border-white/10 pt-8 relative z-10">
                          <div className="flex justify-between items-center text-base">
                              <span className="text-zinc-400 font-medium">Billing Cycle</span>
                              <span className="text-white font-bold">Monthly</span>
                          </div>
                          <div className="flex justify-between items-center text-base">
                              <span className="text-zinc-400 font-medium">Next Payment</span>
                              <span className="text-white font-bold">May 12, 2025</span>
                          </div>
                          <div className="flex justify-between items-center text-base">
                              <span className="text-zinc-400 font-medium">Amount</span>
                              <span className="text-white font-bold text-xl">$20.00</span>
                          </div>
                      </div>

                      <div className="flex gap-4 relative z-10">
                          <button 
                              onClick={handleCancelSubscription}
                              className="flex-1 h-14 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-full font-bold transition-all flex items-center justify-center gap-2 group active:scale-95"
                          >
                              <AlertTriangle size={18} className="group-hover:scale-110 transition-transform"/> Cancel Subscription
                          </button>
                      </div>
                      
                      <p className="text-xs text-zinc-500 mt-6 text-center">
                          Managed securely via Polar.sh. Canceling will downgrade your account at the end of the billing period.
                      </p>
                  </div>
              ) : (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-10 text-center relative overflow-hidden group hover:border-zinc-700 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.01]">
                      <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                          <User size={40} className="text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="text-3xl font-bold text-white mb-2">Free Plan</h4>
                      <p className="text-zinc-400 mb-8 max-w-sm mx-auto text-lg leading-relaxed">
                          You are currently on the free tier. Upgrade to unlock the full power of Infinity including 3.0 Pro reasoning and cloud sync.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto mb-10 text-zinc-500 text-sm">
                          <div className="flex items-center gap-2"><CheckCircle size={14}/> Basic Search</div>
                          <div className="flex items-center gap-2"><CheckCircle size={14}/> Local History</div>
                          <div className="flex items-center gap-2 opacity-50"><Lock size={14}/> Deep Reasoning</div>
                          <div className="flex items-center gap-2 opacity-50"><Lock size={14}/> Cloud Backup</div>
                      </div>

                      <button 
                          onClick={onUpgradeClick}
                          className="h-16 px-10 bg-white text-black rounded-full font-bold transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-3 mx-auto text-lg"
                      >
                          <Crown size={20} className="text-yellow-600" fill="currentColor" /> Upgrade to Pro
                      </button>
                  </div>
              )}
            </div>
          )}

          {activeTab === 'customization' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Customization</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-sm hover:border-zinc-700 transition-all duration-300 hover:scale-[1.01]">
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

                 <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-sm hover:border-zinc-700 transition-all duration-300 hover:scale-[1.01]">
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

                <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-sm hover:border-zinc-700 transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-900/30 text-orange-400 flex items-center justify-center"><Thermometer size={20}/></div>
                        <div>
                            <h4 className="font-bold text-lg text-white">Weather Unit</h4>
                            <p className="text-sm text-zinc-400">Choose between Celsius and Fahrenheit</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-800 p-1 rounded-full border border-zinc-700">
                        <button 
                            onClick={() => onToggleWeatherUnit('c')}
                            className={`w-10 h-8 rounded-full font-bold text-sm transition-all ${weatherUnit === 'c' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            °C
                        </button>
                        <button 
                            onClick={() => onToggleWeatherUnit('f')}
                            className={`w-10 h-8 rounded-full font-bold text-sm transition-all ${weatherUnit === 'f' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            °F
                        </button>
                    </div>
                </div>
              </div>
            </div>
          )}

           {activeTab === 'wallpapers' && (
            <div className="space-y-8 animate-slideUp max-w-4xl">
              <h3 className="text-3xl font-bold text-white">Home Wallpaper</h3>
              <p className="text-zinc-500">Choose a background for your main search dashboard.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {WALLPAPERS.map((wp) => (
                    <div 
                        key={wp.id}
                        onClick={() => { if (!wp.isPro || isPro) onWallpaperChange(wp.url); else onUpgradeClick(); }}
                        className={`group cursor-pointer relative aspect-[9/16] rounded-2xl overflow-hidden border-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-md ${
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

                        {wp.isPro && !isPro && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                                <div className="bg-yellow-500/20 text-yellow-400 p-2 rounded-full border border-yellow-500/50">
                                    <Lock size={20} />
                                </div>
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

          {/* TAB: AI (API KEY) */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Feature AI</h3>
              
              {/* Model Switcher */}
              <div className="bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 shadow-xl mb-6 relative overflow-hidden transition-all duration-500 hover:scale-[1.01]">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Cpu size={20} /> AI Model Selection
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                      {[
                          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Fastest reasoning', isPro: false },
                          { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Balanced performance', isPro: true },
                          { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro', desc: 'Maximum reasoning power', isPro: true },
                      ].map((model) => (
                          <div 
                            key={model.id}
                            onClick={() => handleModelChange(model.id)}
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                                selectedModel === model.id 
                                ? 'bg-blue-900/20 border-blue-500/50 scale-[1.02] shadow-lg' 
                                : 'bg-black border-zinc-800 hover:border-zinc-700 hover:scale-[1.01]'
                            }`}
                          >
                              <div>
                                  <div className={`font-bold ${selectedModel === model.id ? 'text-blue-400' : 'text-white'}`}>{model.name}</div>
                                  <div className="text-xs text-zinc-500">{model.desc}</div>
                              </div>
                              {model.isPro && !isPro ? (
                                  <Lock size={16} className="text-yellow-500" />
                              ) : (
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedModel === model.id ? 'border-blue-500 bg-blue-500' : 'border-zinc-600'}`}>
                                      {selectedModel === model.id && <Check size={12} className="text-white" />}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>

              <p className="text-blue-200 leading-relaxed font-medium bg-blue-900/20 p-6 rounded-[24px] border border-blue-900/50">
                Unlock the full potential of Infinity by connecting your own Google Gemini API key. 
                Your key is stored locally on your device and never sent to our servers.
              </p>

              <div className="bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 shadow-xl transition-all duration-500 hover:scale-[1.01]">
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
                        className={`h-14 px-8 rounded-full font-bold text-white transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 ${isSaved ? 'bg-green-600' : 'bg-white text-black hover:bg-gray-200'}`}
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

          {activeTab === 'cloud' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Cloud Storage</h3>
              <p className="text-zinc-500">Sync your data across devices securely.</p>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-12 text-center flex flex-col items-center justify-center transition-all hover:scale-[1.01]">
                  <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 relative">
                      <Cloud size={40} className="text-zinc-400" />
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">New</div>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3">Supabase Cloud Sync</h4>
                  <p className="text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
                      We are migrating from Google Drive to Supabase Storage for faster, more secure, and seamless synchronization of your search history and collections.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-zinc-800/50 border border-zinc-700 rounded-full px-5 py-2.5 text-zinc-300 font-medium text-sm">
                      <RefreshCw size={14} className="animate-spin-slow" /> Development in Progress
                  </div>
              </div>
            </div>
          )}

          {/* TAB: CONNECTED APPS */}
          {activeTab === 'connected' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Connected Apps</h3>
              
              <div className="space-y-4">
                 
                 {/* Notion Card */}
                 <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-sm hover:border-zinc-600 transition-all duration-300 hover:scale-[1.01]">
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
                             <button className="h-10 px-6 bg-red-900/20 text-red-400 rounded-full text-sm font-bold border border-red-900/50 hover:bg-red-900/40 transition-colors active:scale-95">Disconnect</button>
                        ) : (
                             <button onClick={onConnectNotion} className="h-10 px-6 bg-white text-black rounded-full text-sm font-bold shadow-md hover:bg-gray-200 active:scale-95 transition-transform">Connect</button>
                        )}
                    </div>
                </div>

                {/* Polar Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 shadow-sm hover:border-zinc-600 transition-all duration-300 hover:scale-[1.01]">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 bg-black border border-white/20 rounded-2xl flex items-center justify-center shadow-sm">
                             <DollarSign size={24} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-white">Polar Payments</h4>
                            <p className="text-sm text-zinc-500 font-medium">Use your own checkout configuration</p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-zinc-500 mb-2 block uppercase tracking-wider">
                            Access Token
                        </label>
                        <div className="flex gap-3">
                            <input 
                                type="password" 
                                value={polarToken}
                                onChange={(e) => setPolarToken(e.target.value)}
                                placeholder="polar_pat_..."
                                className="flex-1 h-12 px-4 bg-black border border-zinc-800 rounded-full focus:ring-2 focus:ring-blue-900 outline-none font-mono text-sm text-white placeholder-zinc-700"
                            />
                            <button 
                                onClick={handleSavePolar}
                                className={`h-12 px-6 rounded-full font-bold text-white transition-all flex items-center gap-2 active:scale-95 ${isPolarSaved ? 'bg-green-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                            >
                                {isPolarSaved ? <CheckCircle size={18} /> : <Save size={18} />}
                                Save
                            </button>
                        </div>
                        <p className="text-xs text-zinc-600 mt-2">
                            Providing a token allows dynamic checkout generation. Without it, the default link is used.
                        </p>
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
