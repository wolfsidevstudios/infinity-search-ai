
import React, { useState, useEffect } from 'react';
import { User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone, Image as ImageIcon, Check, BookOpen, LogOut, Cloud, RefreshCw, ExternalLink, Thermometer, Crown, DollarSign, Lock, CreditCard, AlertTriangle, Terminal, Settings, Server, Trash2, Plus, Download, Sparkles, Globe, Database, Radio, Utensils, ShoppingBag, Plane, Users } from 'lucide-react';
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

// Updated Model List for 26.2
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

// Search Modes for Display
const SEARCH_MODES = [
    { label: 'Web', icon: Globe, desc: 'Real-time internet search' },
    { label: 'Scripture', icon: BookOpen, desc: 'Bible analysis' },
    { label: 'Podcast', icon: Radio, desc: 'Audio episode finder' },
    { label: 'Community', icon: Users, desc: 'Social discussions' },
    { label: 'Recipes', icon: Utensils, desc: 'Cooking instructions' },
    { label: 'Shopping', icon: ShoppingBag, desc: 'Product deals' },
    { label: 'Flights', icon: Plane, desc: 'Travel booking' },
    { label: 'Code Pilot', icon: Terminal, desc: 'Programming assistant' },
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
    osVersion = '26.2 Beta',
    onUpdateOS
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [apiKey, setApiKey] = useState('');
  const [clarifaiPat, setClarifaiPat] = useState('');
  const [isSaved, setIsSaved] = useState(false);
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

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);

    const savedClarifaiPat = localStorage.getItem('clarifai_pat');
    if (savedClarifaiPat) setClarifaiPat(savedClarifaiPat);

    const proStatus = localStorage.getItem('infinity_pro_status');
    setIsPro(proStatus === 'active');

    const savedModel = localStorage.getItem('infinity_ai_model') || 'gemini-2.5-flash';
    setSelectedModel(savedModel);

    setMcpServers(getMcpServers());
    
    // Auto-check logic
    if (osVersion.includes('26.2')) {
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
                  if (onUpdateOS) onUpdateOS('26.2 Beta');
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

  const navItemClass = (tab: Tab) => `
    flex items-center gap-3 px-6 py-3.5 rounded-full cursor-pointer font-medium mb-1.5
    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
    ${activeTab === tab 
        ? 'bg-white text-black shadow-lg transform scale-105' 
        : 'text-zinc-500 hover:bg-zinc-900 hover:text-white hover:scale-[1.02] active:scale-[0.98]'}
  `;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
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
                          {updateStatus === 'uptodate' ? `Infinity OS ${osVersion}` : 'Infinity OS 26.2 Available'}
                      </h3>
                      <p className="text-zinc-500 text-lg">
                          {updateStatus === 'uptodate' 
                            ? 'You are on the cutting-edge "Synapse" beta channel.' 
                            : 'A new software update is available for your workspace.'}
                      </p>
                  </div>

                  {updateStatus === 'available' && (
                      <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-[32px] p-8 shadow-2xl animate-fadeIn relative overflow-hidden group hover:border-zinc-700 transition-all">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] pointer-events-none"></div>
                          
                          <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-4">
                                  <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md">BETA</span>
                                  <h4 className="text-xl font-bold text-white">Update: "Synapse"</h4>
                              </div>
                              <ul className="space-y-3 mb-8 text-zinc-400 text-sm">
                                  <li className="flex gap-2"><Check size={16} className="text-green-500 shrink-0"/> <strong>Dynamic Hub:</strong> New alive status bar interface.</li>
                                  <li className="flex gap-2"><Check size={16} className="text-green-500 shrink-0"/> <strong>Beta Channel:</strong> Early access to experimental features.</li>
                                  <li className="flex gap-2"><Check size={16} className="text-green-500 shrink-0"/> <strong>Refined UI:</strong> Smoother animations and glass effects.</li>
                              </ul>
                              
                              <button 
                                onClick={handleUpdateOS} 
                                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                              >
                                  <Download size={20} /> Update to Beta
                              </button>
                              <p className="text-center text-xs text-zinc-600 mt-4">Size: 62 MB • Requires Restart</p>
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
              <p className="text-zinc-400">Sync search history and files securely.</p>
              
              {/* Google Drive - Discontinued */}
              <div className="bg-zinc-900 border border-red-900/30 rounded-3xl p-8 flex flex-col opacity-80">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 grayscale opacity-50">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo_%282020%29.svg" alt="Drive" className="w-10 h-10" />
                          </div>
                          <div>
                              <h4 className="text-xl font-bold text-zinc-300">Google Drive (Discontinued)</h4>
                              <p className="text-zinc-500">Google Drive integration has been discontinued.</p>
                          </div>
                      </div>
                      <div className="px-4 py-1.5 bg-red-900/20 text-red-400 text-xs font-bold rounded-full border border-red-900/30">DEPRECATED</div>
                  </div>
                  <button disabled className="w-full py-3 bg-zinc-800 text-zinc-600 rounded-xl font-bold cursor-not-allowed">
                      Connection Unavailable
                  </button>
              </div>

              {/* Infinity Cloud - Coming Soon */}
              <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] pointer-events-none"></div>
                  
                  <div className="flex items-center gap-6 mb-6">
                      <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-green-500/30 shadow-lg shadow-green-900/20">
                          <Database size={32} className="text-green-400" />
                      </div>
                      <div>
                          <h4 className="text-xl font-bold text-white">Infinity Cloud</h4>
                          <p className="text-green-400/80 text-sm font-medium">Powered by Supabase</p>
                      </div>
                  </div>
                  
                  <p className="text-zinc-400 leading-relaxed mb-6">
                      Coming soon in the next few months. A lightning-fast, encrypted storage solution built specifically for your Infinity workspace. Sync history, files, and preferences instantly across devices.
                  </p>

                  <button disabled className="w-full py-3 bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                      <Sparkles size={16} /> Coming Soon
                  </button>
              </div>
            </div>
          )}

          {/* TAB: CONNECTED APPS & MCP */}
          {activeTab === 'connected' && (
            <div className="space-y-8 animate-slideUp max-w-4xl">
              <h3 className="text-3xl font-bold text-white">Capabilities</h3>
              <p className="text-zinc-400">Manage search modes and connect external tools.</p>
              
              {/* Search Modes Grid */}
              <div className="mb-8">
                  <h4 className="text-lg font-bold text-white mb-4">Available Search Modes</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {SEARCH_MODES.map((mode, idx) => (
                          <div key={idx} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center text-center gap-3 hover:border-zinc-700 transition-all group">
                              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                                  <mode.icon size={18} />
                              </div>
                              <div>
                                  <div className="font-bold text-sm text-white">{mode.label}</div>
                                  <div className="text-[10px] text-zinc-500 mt-1">{mode.desc}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Custom MCP Section */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8">
                  <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-white flex items-center gap-3">
                          <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400">
                              <Server size={20} />
                          </div>
                          Custom Tools (MCP)
                      </h4>
                      <button 
                        onClick={() => setAddingMcp(!addingMcp)}
                        className="flex items-center gap-2 text-xs font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
                      >
                          {addingMcp ? 'Cancel' : <><Plus size={14} /> Add Server</>}
                      </button>
                  </div>

                  <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed">
                      Connect custom Model Context Protocol (MCP) servers to allow the AI to access local tools, databases, or internal APIs during chat sessions.
                  </p>

                  {/* Add New Server Form */}
                  {addingMcp && (
                      <div className="bg-black border border-zinc-800 rounded-2xl p-6 mb-6 animate-slideUp">
                          <h5 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">New Connection</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <input 
                                  type="text" 
                                  placeholder="Server Name (e.g. Local Database)" 
                                  value={newMcpName}
                                  onChange={(e) => setNewMcpName(e.target.value)}
                                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition-colors"
                              />
                              <input 
                                  type="text" 
                                  placeholder="Server URL (e.g. ws://localhost:3000)" 
                                  value={newMcpUrl}
                                  onChange={(e) => setNewMcpUrl(e.target.value)}
                                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition-colors font-mono"
                              />
                          </div>
                          <button 
                              onClick={handleAddMcpServer}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-purple-900/20"
                          >
                              Connect Server
                          </button>
                      </div>
                  )}

                  {/* Server List */}
                  <div className="space-y-4">
                      {mcpServers.length === 0 ? (
                          <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-2xl">
                              <Server size={32} className="mx-auto text-zinc-700 mb-2" />
                              <p className="text-zinc-500 text-sm">No custom tools connected.</p>
                          </div>
                      ) : (
                          mcpServers.map((server) => (
                              <div key={server.id} className="flex items-center justify-between p-5 bg-black border border-zinc-800 rounded-2xl group hover:border-zinc-700 transition-all">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${server.status === 'connected' ? 'bg-green-500 shadow-green-900' : 'bg-red-500 shadow-red-900'}`}></div>
                                      <div>
                                          <div className="font-bold text-white text-sm flex items-center gap-2">
                                              {server.name}
                                              {server.status === 'connected' && <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded border border-green-900/50">Active</span>}
                                          </div>
                                          <div className="text-xs text-zinc-500 font-mono mt-0.5">{server.url}</div>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                          onClick={() => handleRefreshMcpServer(server.id)}
                                          className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                          title="Reconnect"
                                      >
                                          <RefreshCw size={16} />
                                      </button>
                                      <button 
                                          onClick={() => handleRemoveMcpServer(server.id)}
                                          className="p-2 bg-zinc-900 hover:bg-red-900/30 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                                          title="Remove"
                                      >
                                          <Trash2 size={16} />
                                      </button>
                                  </div>
                              </div>
                          ))
                      )}
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
