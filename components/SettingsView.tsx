
import React, { useState, useEffect } from 'react';
import { User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone, Image as ImageIcon, Check, BookOpen, LogOut, Cloud, RefreshCw, ExternalLink, Thermometer, Crown, DollarSign, Lock, CreditCard, AlertTriangle, Terminal, Settings, Server, Trash2, Plus, Download, Sparkles } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { BIBLE_VERSIONS } from '../services/bibleService';
import { getMcpServers, addMcpServer, removeMcpServer, refreshMcpServer, McpServer } from '../services/mcpService';
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
  { id: 'space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop', name: 'Deep Space', isPro: true },
  { id: 'minimal', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop', name: 'Minimal Gray', isPro: false },
];

// Updated Model List for 26.1 - Restored Missing Models
const AVAILABLE_MODELS = [
    { id: 'gemma-2-9b', name: 'Google Gemma 2', desc: 'Fast, efficient, budget-friendly.', isPro: false, badge: 'NEW' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Standard reasoning engine.', isPro: false, badge: 'DEFAULT' },
    { id: 'gpt-oss-120b', name: 'GPT-OSS 120B', desc: 'Powerful open-source benchmark leader.', isPro: false, badge: 'OPEN' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Advanced complex reasoning.', isPro: true },
    { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro', desc: 'Maximum reasoning power.', isPro: true },
    { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', desc: 'Anthropic\'s most capable model.', isPro: true, badge: 'PREMIUM' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', desc: 'OpenAI\'s next-gen efficient model.', isPro: true, badge: 'BETA' },
    { id: 'grok-3', name: 'Grok 3', desc: 'xAI\'s real-time reasoning model.', isPro: true, badge: 'NEW' },
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
  const [clarifaiPat, setClarifaiPat] = useState('');
  const [polarToken, setPolarToken] = useState('polar_oat_A3eSAxJk9CcPfFdmTxBYzY4YtXgOiBy5ULqa836FrZP');
  const [isSaved, setIsSaved] = useState(false);
  const [isPolarSaved, setIsPolarSaved] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  
  // MCP State
  const [mcpServers, setMcpServers] = useState<McpServer[]>([]);
  const [newMcpUrl, setNewMcpUrl] = useState('');
  const [newMcpName, setNewMcpName] = useState('');
  const [addingMcp, setAddingMcp] = useState(false);
  
  // Update Simulation State
  const [updateStatus, setUpdateStatus] = useState<'available' | 'installing' | 'uptodate'>('available');
  const [installProgress, setInstallProgress] = useState(0);
  
  const [bibleLang, setBibleLang] = useState<'en' | 'es'>('en');
  const [bibleVersion, setBibleVersion] = useState<string>('kjv');

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);

    const savedClarifaiPat = localStorage.getItem('clarifai_pat');
    if (savedClarifaiPat) setClarifaiPat(savedClarifaiPat);

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

    setMcpServers(getMcpServers());
    
    // Auto-check logic: If current OS is already 26.1, we are up to date
    if (osVersion === '26.1') {
        setUpdateStatus('uptodate');
    }
  }, [user, osVersion]);

  const handleUpdateOS = () => {
      setUpdateStatus('installing');
      let progress = 0;
      const interval = setInterval(() => {
          progress += Math.random() * 5;
          if (progress >= 100) {
              clearInterval(interval);
              setInstallProgress(100);
              setTimeout(() => {
                  if (onUpdateOS) onUpdateOS('26.1');
                  setUpdateStatus('uptodate');
              }, 1000);
          } else {
              setInstallProgress(progress);
          }
      }, 200);
  };

  const handleSaveKeys = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }

    if (clarifaiPat.trim()) {
      localStorage.setItem('clarifai_pat', clarifaiPat.trim());
    } else {
      localStorage.removeItem('clarifai_pat');
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
      const selected = AVAILABLE_MODELS.find(m => m.id === model);
      if (selected?.isPro && !isPro) return;
      setSelectedModel(model);
      localStorage.setItem('infinity_ai_model', model);
  };

  const handleAddMcpServer = async () => {
      if (!newMcpName || !newMcpUrl) return;
      setAddingMcp(true);
      await addMcpServer(newMcpName, newMcpUrl);
      setMcpServers(getMcpServers());
      setNewMcpName('');
      setNewMcpUrl('');
      setAddingMcp(false);
  };

  const handleRemoveMcpServer = (id: string) => {
      removeMcpServer(id);
      setMcpServers(getMcpServers());
  };

  const handleRefreshMcpServer = async (id: string) => {
      await refreshMcpServer(id);
      setMcpServers(getMcpServers());
  };

  const handleCancelSubscription = () => {
      if (window.confirm("Are you sure you want to cancel your Infinity Pro subscription? You will lose access to premium features immediately.")) {
          localStorage.removeItem('infinity_pro_status');
          setIsPro(false);
          // Fallback to free model if current is pro
          const current = AVAILABLE_MODELS.find(m => m.id === selectedModel);
          if (current?.isPro) handleModelChange('gemini-2.5-flash');
          alert("Subscription cancelled successfully.");
      }
  };

  const handleBibleSettingsChange = (key: string, value: string) => {
      if (key === 'version') {
          setBibleVersion(value);
          localStorage.setItem('bible_version', value);
      } else {
          setBibleLang(value as any);
          localStorage.setItem('bible_lang', value);
      }
  };

  const navItemClass = (tab: Tab) => `
    flex items-center gap-3 px-6 py-3.5 rounded-full cursor-pointer font-medium mb-1.5
    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
    ${activeTab === tab 
        ? 'bg-white text-black shadow-lg transform scale-105' 
        : 'text-zinc-500 hover:bg-zinc-900 hover:text-white hover:scale-[1.02] active:scale-[0.98]'}
  `;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || 'user@example.com';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-black animate-fadeIn text-white">
      
      {/* Sidebar Navigation */}
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
                    {updateStatus === 'available' && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
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
            <div onClick={() => setActiveTab('ai')} className={navItemClass('ai')}>
                <Cpu size={20} /> Feature AI
            </div>
            <div onClick={() => setActiveTab('connected')} className={navItemClass('connected')}>
                <LinkIcon size={20} /> Connected Apps
            </div>
            
            <div className="h-[1px] bg-zinc-900 my-4 mx-4"></div>
            
            <div onClick={() => setActiveTab('developer')} className={navItemClass('developer')}>
                <Terminal size={20} /> Developer
            </div>
        </div>

        <div className="mt-auto pl-4 text-xs text-zinc-500 font-medium">
            Infinity OS {osVersion}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full bg-black p-6 md:p-12 overflow-y-auto relative">
          
          {/* TAB: UPDATES */}
          {activeTab === 'updates' && (
              <div className="space-y-8 animate-slideUp max-w-2xl mx-auto pt-10">
                  <div className="flex justify-center mb-8">
                      <div className="w-32 h-32 bg-zinc-900 rounded-[32px] flex items-center justify-center shadow-2xl border border-zinc-800 relative group overflow-hidden">
                          {updateStatus === 'installing' ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                              </div>
                          ) : null}
                          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center relative z-0">
                              <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="OS" className="w-16 h-16 object-cover rounded-xl" />
                          </div>
                      </div>
                  </div>
                  
                  <div className="text-center">
                      <h3 className="text-3xl font-bold text-white mb-2">
                          {updateStatus === 'uptodate' ? `Infinity OS ${osVersion} is up to date` : 'Infinity OS 26.1 Available'}
                      </h3>
                      <p className="text-zinc-500 text-lg">
                          {updateStatus === 'uptodate' 
                            ? 'You are running the latest version with Deep Think 2.0.' 
                            : 'A new software update is available for your workspace.'}
                      </p>
                  </div>

                  {updateStatus === 'available' && (
                      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-[32px] p-8 shadow-2xl animate-fadeIn relative overflow-hidden group hover:border-zinc-700 transition-all">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none"></div>
                          
                          <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-4">
                                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">NEW</span>
                                  <h4 className="text-xl font-bold text-white">Feature Drop: "Polymath"</h4>
                              </div>
                              <ul className="space-y-3 mb-8 text-zinc-400 text-sm">
                                  <li className="flex gap-2"><Check size={16} className="text-green-500 shrink-0"/> <strong>New AI Models:</strong> Claude Opus 4.5, GPT-5 Mini, Grok 3.</li>
                                  <li className="flex gap-2"><Check size={16} className="text-green-500 shrink-0"/> <strong>Smoother Animations:</strong> Rebuilt physics engine for 120Hz feel.</li>
                                  <li className="flex gap-2"><Check size={16} className="text-green-500 shrink-0"/> <strong>Budget Options:</strong> Added Google Gemma 2 for efficient queries.</li>
                              </ul>
                              
                              <button 
                                onClick={handleUpdateOS} 
                                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                              >
                                  <Download size={20} /> Download and Install
                              </button>
                              <p className="text-center text-xs text-zinc-600 mt-4">Size: 45 MB • Requires Restart</p>
                          </div>
                      </div>
                  )}

                  {updateStatus === 'installing' && (
                      <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden mt-8">
                          <div 
                            className="bg-white h-full transition-all duration-200 ease-out" 
                            style={{ width: `${installProgress}%` }}
                          />
                      </div>
                  )}
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
                    <button onClick={onUpgradeClick} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-lg z-20">
                        <Crown size={14} /> Upgrade Plan
                    </button>
                )}
              </div>
              <div className="pt-8 flex gap-4">
                  <button onClick={onLogout} className="h-14 px-10 bg-red-900/20 border border-red-900/50 text-red-500 rounded-full font-bold transition-all hover:bg-red-900/40 flex items-center gap-2">
                      <LogOut size={18} /> Sign Out
                  </button>
               </div>
            </div>
          )}

          {/* TAB: SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Subscription</h3>
              
              <div className="p-8 rounded-[32px] bg-gradient-to-br from-zinc-900 to-black border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                      <div>
                          <div className="text-sm text-zinc-500 font-bold uppercase tracking-wider mb-2">Current Plan</div>
                          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                              {isPro ? 'Infinity Pro' : 'Free Plan'}
                              {isPro && <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">ACTIVE</span>}
                          </h2>
                      </div>
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                          {isPro ? <Crown size={24} className="text-yellow-400" fill="currentColor"/> : <User size={24} className="text-zinc-400"/>}
                      </div>
                  </div>

                  {isPro ? (
                      <div className="space-y-6">
                          <div className="flex items-center gap-3 text-zinc-300">
                              <CheckCircle size={20} className="text-green-500" />
                              <span>Access to Gemini 3.0 Pro & Claude Opus</span>
                          </div>
                          <div className="flex items-center gap-3 text-zinc-300">
                              <CheckCircle size={20} className="text-green-500" />
                              <span>Unlimited Cloud History Sync</span>
                          </div>
                          <div className="flex items-center gap-3 text-zinc-300">
                              <CheckCircle size={20} className="text-green-500" />
                              <span>Early access to experimental features</span>
                          </div>
                          
                          <div className="pt-6 border-t border-white/10 flex gap-4">
                              <button className="flex-1 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors">Manage Subscription</button>
                              <button onClick={handleCancelSubscription} className="px-6 py-3 bg-red-900/20 text-red-400 rounded-xl font-bold hover:bg-red-900/30 transition-colors border border-red-900/50">Cancel</button>
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-6">
                          <p className="text-zinc-400">Upgrade to unlock the full potential of Infinity OS.</p>
                          <button onClick={onUpgradeClick} className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                              <Crown size={18} /> Upgrade to Pro - $20/mo
                          </button>
                      </div>
                  )}
              </div>
            </div>
          )}

          {/* TAB: CUSTOMIZATION */}
          {activeTab === 'customization' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Customization</h3>
              
              <div className="space-y-4">
                  {/* Weather Unit */}
                  <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center"><Thermometer size={20}/></div>
                          <div>
                              <h4 className="font-bold text-white">Temperature Unit</h4>
                              <p className="text-sm text-zinc-500">Display weather in Celsius or Fahrenheit</p>
                          </div>
                      </div>
                      <div className="flex bg-black rounded-lg p-1 border border-zinc-800">
                          <button 
                            onClick={() => onToggleWeatherUnit('c')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${weatherUnit === 'c' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                          >
                              °C
                          </button>
                          <button 
                            onClick={() => onToggleWeatherUnit('f')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${weatherUnit === 'f' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                          >
                              °F
                          </button>
                      </div>
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-2xl opacity-60 cursor-not-allowed" title="Coming in 26.2">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-purple-900/30 text-purple-400 flex items-center justify-center"><Smartphone size={20}/></div>
                          <div>
                              <h4 className="font-bold text-white">Reduced Motion</h4>
                              <p className="text-sm text-zinc-500">Minimize animations for faster feel</p>
                          </div>
                      </div>
                      <div className="w-12 h-6 bg-zinc-800 rounded-full relative">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-zinc-600 rounded-full"></div>
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* TAB: WALLPAPERS */}
          {activeTab === 'wallpapers' && (
            <div className="space-y-8 animate-slideUp max-w-4xl">
              <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-bold text-white">Wallpapers</h3>
                  <button className="bg-zinc-800 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-zinc-700 transition-colors">
                      <Plus size={16} /> Upload
                  </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {WALLPAPERS.map((wp) => (
                      <div 
                        key={wp.id} 
                        onClick={() => {
                            if (wp.isPro && !isPro) return;
                            onWallpaperChange(wp.url);
                        }}
                        className={`aspect-video rounded-2xl overflow-hidden relative cursor-pointer group border-2 transition-all ${currentWallpaper === wp.url ? 'border-blue-500 scale-[1.02]' : 'border-transparent hover:scale-[1.02]'}`}
                      >
                          {wp.url ? (
                              <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full bg-black flex items-center justify-center text-zinc-600 font-bold">Default Black</div>
                          )}
                          
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                              <span className="text-white font-bold">{wp.name}</span>
                              {wp.isPro && !isPro && <span className="text-yellow-400 text-xs flex items-center gap-1"><Lock size={10}/> Pro Locked</span>}
                          </div>

                          {/* Lock Overlay */}
                          {wp.isPro && !isPro && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <Lock size={24} className="text-white opacity-50" />
                              </div>
                          )}
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: CLOUD STORAGE */}
          {activeTab === 'cloud' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Cloud Storage</h3>
              <p className="text-zinc-400">Connect your cloud provider to sync search history and files.</p>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo_%282020%29.svg" alt="Drive" className="w-10 h-10" />
                      </div>
                      <div>
                          <h4 className="text-xl font-bold text-white">Google Drive</h4>
                          <p className="text-zinc-500">Sync history, images, and notes.</p>
                      </div>
                  </div>
                  <button className="px-6 py-3 bg-zinc-800 text-white rounded-full font-bold hover:bg-zinc-700 transition-colors border border-zinc-700">
                      Connect
                  </button>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex items-center justify-between opacity-50 grayscale">
                  <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#0061FF] rounded-2xl flex items-center justify-center shrink-0">
                          <Cloud size={32} className="text-white" />
                      </div>
                      <div>
                          <h4 className="text-xl font-bold text-white">Dropbox</h4>
                          <p className="text-zinc-500">Coming soon in v26.2</p>
                      </div>
                  </div>
                  <button disabled className="px-6 py-3 bg-transparent text-zinc-500 rounded-full font-bold cursor-not-allowed border border-zinc-800">
                      Unavailable
                  </button>
              </div>
            </div>
          )}

          {/* TAB: CONNECTED APPS */}
          {activeTab === 'connected' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Connected Apps</h3>
              
              <div className="space-y-4">
                  {/* Notion */}
                  <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="black"><path d="M4.222 24C1.889 24 0 22.111 0 19.778V5.333C0 3 1.889 1.111 4.222 1.111h15.556C22.111 1.111 24 3 24 5.333v14.445C24 22.111 22.111 24 19.778 24H4.222zM19.111 6.667h-2.333l-4.556 8.333-2.778-5.333H7.556v10.666h2.444V12l3.444 6.778h1.667l6-10.778v9.333h2.222V6.667z"/></svg>
                          </div>
                          <div>
                              <h4 className="font-bold text-white">Notion</h4>
                              <p className="text-sm text-zinc-500">{isNotionConnected ? 'Workspace Connected' : 'Not Connected'}</p>
                          </div>
                      </div>
                      <button 
                        onClick={onConnectNotion}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${isNotionConnected ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-white text-black hover:bg-gray-200'}`}
                      >
                          {isNotionConnected ? 'Disconnect' : 'Connect'}
                      </button>
                  </div>

                  {/* Spotify */}
                  <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#1DB954] rounded-xl flex items-center justify-center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42c-.18.3-.55.39-.84.21-2.31-1.41-5.23-1.73-8.66-.95-.33.07-.66-.14-.74-.46-.07-.33.14-.66.46-.74 3.75-.85 7.02-.48 9.57 1.1.3.18.39.55.21.84zm1.2-3.19c-.23.37-.71.49-1.08.26-2.67-1.64-6.74-2.11-9.9-1.15-.4.12-.84-.1-.95-.51-.12-.4.1-.84.51-.95 3.63-1.1 8.16-.57 11.16 1.27.37.23.49.71.26 1.08zm.11-3.32c-3.19-1.89-8.45-2.07-11.5-1.14-.49.15-1.01-.12-1.16-.61-.15-.49.12-1.01.61-1.16 3.53-1.07 9.32-.87 13.01 1.33.44.26.58.83.32 1.27-.26.44-.83.58-1.27.32z"/></svg>
                          </div>
                          <div>
                              <h4 className="font-bold text-white">Spotify</h4>
                              <p className="text-sm text-zinc-500">Connect to control music</p>
                          </div>
                      </div>
                      <button className="px-5 py-2 bg-zinc-800 text-white rounded-lg text-sm font-bold hover:bg-zinc-700 transition-colors">Connect</button>
                  </div>

                  {/* Figma */}
                  <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#2c2c2c] rounded-xl flex items-center justify-center border border-white/10">
                              <svg width="24" height="24" viewBox="0 0 15 23" fill="none"><path d="M3.75 23C5.82107 23 7.5 21.3211 7.5 19.25V11.75H3.75C1.67893 11.75 0 13.4289 0 15.5C0 17.5711 1.67893 19.25 3.75 19.25V23ZM0 7.75C0 9.82107 1.67893 11.5 3.75 11.5H7.5V7.75C7.5 5.67893 5.82107 4 3.75 4C1.67893 4 0 5.67893 0 7.75ZM7.5 0V7.5H11.25C13.3211 7.5 15 5.82107 15 3.75C15 1.67893 13.3211 0 11.25 0H7.5ZM7.5 11.75V19.25C9.57107 19.25 11.25 17.5711 11.25 15.5C11.25 13.4289 9.57107 11.75 7.5 11.75Z" fill="white"/></svg>
                          </div>
                          <div>
                              <h4 className="font-bold text-white">Figma</h4>
                              <p className="text-sm text-zinc-500">Search design files</p>
                          </div>
                      </div>
                      <button className="px-5 py-2 bg-zinc-800 text-white rounded-lg text-sm font-bold hover:bg-zinc-700 transition-colors">Connect</button>
                  </div>
              </div>
            </div>
          )}

          {/* TAB: AI - Updated Model Selection */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Feature AI</h3>
              
              {/* Model Switcher */}
              <div className="bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 shadow-xl mb-6 relative overflow-hidden transition-all duration-500 hover:scale-[1.01]">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Cpu size={20} /> AI Model Selection
                  </h4>
                  <p className="text-sm text-zinc-500 mb-6">Choose the reasoning engine that powers Deep Think.</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                      {AVAILABLE_MODELS.map((model) => (
                          <div 
                            key={model.id} 
                            onClick={() => handleModelChange(model.id)} 
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 group ${
                                selectedModel === model.id 
                                ? 'bg-blue-900/20 border-blue-500/50 scale-[1.02] shadow-lg' 
                                : 'bg-black border-zinc-800 hover:border-zinc-700 hover:scale-[1.01]'
                            }`}
                          >
                              <div>
                                  <div className="flex items-center gap-2">
                                      <div className={`font-bold ${selectedModel === model.id ? 'text-blue-400' : 'text-white'}`}>{model.name}</div>
                                      {model.badge && (
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${model.badge === 'NEW' ? 'bg-green-900 text-green-400' : model.badge === 'PREMIUM' ? 'bg-purple-900 text-purple-400' : model.badge === 'OPEN' ? 'bg-pink-900 text-pink-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                              {model.badge}
                                          </span>
                                      )}
                                  </div>
                                  <div className="text-xs text-zinc-500 mt-1">{model.desc}</div>
                              </div>
                              {model.isPro && !isPro ? (
                                  <Lock size={16} className="text-yellow-500" />
                              ) : (
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedModel === model.id ? 'border-blue-500 bg-blue-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                                      {selectedModel === model.id && <Check size={12} className="text-white" />}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>

              <div className="bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 shadow-xl transition-all duration-500 hover:scale-[1.01] space-y-6">
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-4 ml-2 uppercase tracking-wider"><Key size={14} /> Gemini API Key</label>
                    <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full h-14 px-6 bg-black border border-zinc-800 rounded-full focus:ring-4 focus:ring-blue-900/50 focus:border-blue-700 outline-none font-mono text-sm shadow-inner transition-all text-white placeholder-zinc-700"/>
                </div>
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-4 ml-2 uppercase tracking-wider"><Key size={14} /> Clarifai PAT (for External Models)</label>
                    <input type="password" value={clarifaiPat} onChange={(e) => setClarifaiPat(e.target.value)} placeholder="Clarifai Personal Access Token..." className="w-full h-14 px-6 bg-black border border-zinc-800 rounded-full focus:ring-4 focus:ring-blue-900/50 focus:border-blue-700 outline-none font-mono text-sm shadow-inner transition-all text-white placeholder-zinc-700"/>
                </div>
                <button onClick={handleSaveKeys} className={`h-14 px-8 w-full rounded-full font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 ${isSaved ? 'bg-green-600' : 'bg-white text-black hover:bg-gray-200'}`}>
                    {isSaved ? <CheckCircle size={20} /> : <Save size={20} />} {isSaved ? 'Keys Saved' : 'Save Keys'}
                </button>
              </div>
            </div>
          )}

          {/* TAB: DEVELOPER */}
          {activeTab === 'developer' && <DeveloperConsoleView />}

      </div>
    </div>
  );
};

export default SettingsView;
