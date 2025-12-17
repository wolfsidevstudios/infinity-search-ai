import React, { useState, useEffect } from 'react';
/* Fixed: Added missing imports for Bot and Zap icons from lucide-react */
import { User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone, Image as ImageIcon, Check, BookOpen, LogOut, Cloud, RefreshCw, ExternalLink, Thermometer, Crown, DollarSign, Lock, CreditCard, AlertTriangle, Terminal, Settings, Server, Trash2, Plus, Download, Sparkles, Globe, Database, Radio, Utensils, ShoppingBag, Plane, Users, ShieldCheck, HardDrive, Moon, Sun, ChevronRight, Bot, Zap } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { getMcpServers, addMcpServer, removeMcpServer, refreshMcpServer, McpServer } from '../services/mcpService';
import DeveloperConsoleView from './DeveloperConsoleView';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  onThemeToggle: (theme: 'light' | 'dark') => void;
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
  isCloudEnabled?: boolean;
  onToggleCloud?: (enabled: boolean) => void;
  lastSynced?: Date | null;
  onManualSync?: () => void;
  isAutoSyncEnabled?: boolean;
  onToggleAutoSync?: (enabled: boolean) => void;
}

type Tab = 'profile' | 'customization' | 'wallpapers' | 'cloud' | 'bible' | 'ai' | 'connected' | 'subscription' | 'updates' | 'developer';

const WALLPAPERS = [
  { name: 'Deep Space', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022&auto=format&fit=crop' },
  { name: 'Mountain Mist', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Abstract Flow', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Neural Network', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Tokyo Night', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094&auto=format&fit=crop' },
  { name: 'Minimalist Sand', url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2070&auto=format&fit=crop' },
];

const AVAILABLE_MODELS = [
    { id: 'gemma-2-9b', name: 'Google Gemma 2', desc: 'Fast, efficient, budget-friendly.', isPro: false, badge: 'NEW' },
    { id: 'gemini-2.5-flash', name: 'Gemini 3 Flash', desc: 'Standard reasoning engine.', isPro: false, badge: 'DEFAULT' },
    { id: 'gpt-oss-120b', name: 'GPT-OSS 120B', desc: 'Powerful open-source benchmark leader.', isPro: false, badge: 'OPEN' },
    { id: 'gemini-2.5-pro', name: 'Gemini 3 Pro', desc: 'Advanced complex reasoning.', isPro: true },
    { id: 'gemini-3.0-pro', name: 'Gemini 3 Pro (Ultra)', desc: 'Maximum reasoning power.', isPro: true },
    { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', desc: 'Anthropic\'s most capable model.', isPro: true, badge: 'PREMIUM' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', desc: 'OpenAI\'s next-gen efficient model.', isPro: true, badge: 'BETA' },
    { id: 'grok-3', name: 'Grok 3', desc: 'xAI\'s real-time reasoning model.', isPro: true, badge: 'NEW' },
];

const SettingsView: React.FC<SettingsViewProps> = ({ 
    theme,
    onThemeToggle,
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
    onUpdateOS,
    isCloudEnabled = false,
    onToggleCloud,
    lastSynced,
    onManualSync,
    isAutoSyncEnabled = false,
    onToggleAutoSync
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isPro, setIsPro] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const [updateStatus, setUpdateStatus] = useState<'available' | 'installing' | 'uptodate'>('available');
  const [installProgress, setInstallProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const proStatus = localStorage.getItem('infinity_pro_status');
    setIsPro(proStatus === 'active');
    const savedModel = localStorage.getItem('infinity_ai_model') || 'gemini-2.5-flash';
    setSelectedModel(savedModel);
    if (osVersion.includes('26.2')) setUpdateStatus('uptodate');
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
          } else { setInstallProgress(progress); }
      }, 100);
  };

  const handleSync = async () => {
      if (onManualSync) {
          setIsSyncing(true);
          await onManualSync();
          setTimeout(() => setIsSyncing(false), 1500);
      }
  };

  const handleModelChange = (model: string) => {
      const selected = AVAILABLE_MODELS.find(m => m.id === model);
      if (selected?.isPro && !isPro) {
          onUpgradeClick();
          return;
      }
      setSelectedModel(model);
      localStorage.setItem('infinity_ai_model', model);
  };

  const navItemClass = (tab: Tab) => `
    flex items-center gap-3 px-6 py-3.5 rounded-full cursor-pointer font-medium mb-1.5
    transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
    ${activeTab === tab 
        ? (theme === 'dark' ? 'bg-white text-black shadow-lg transform scale-105' : 'bg-black text-white shadow-lg transform scale-105') 
        : (theme === 'dark' ? 'text-zinc-500 hover:bg-zinc-900 hover:text-white' : 'text-zinc-400 hover:bg-zinc-100 hover:text-black')}
  `;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;

  const sectionClass = `space-y-8 animate-slideUp max-w-3xl pb-20`;
  const cardClass = `p-8 rounded-[32px] border relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`;
  const subTextClass = `text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`;

  return (
    <div className={`w-full h-full flex flex-col md:flex-row animate-fadeIn transition-colors duration-700 ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}>
      
      {/* Sidebar Navigation */}
      <div className={`w-full md:w-80 shrink-0 h-full border-r flex flex-col p-6 md:p-8 ${theme === 'dark' ? 'border-white/10 bg-black' : 'border-black/5 bg-white'}`}>
        <h2 className={`text-3xl font-bold mb-10 pl-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Settings</h2>
        
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto glass-scroll pr-2">
            <div onClick={() => setActiveTab('profile')} className={navItemClass('profile')}>
                <User size={20} /> Profile
            </div>
            <div onClick={() => setActiveTab('subscription')} className={navItemClass('subscription')}>
                <CreditCard size={20} /> Subscription
            </div>
            <div className={`h-[1px] my-2 mx-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'}`}></div>
            <div onClick={() => setActiveTab('updates')} className={navItemClass('updates')}>
                <div className="relative">
                    <Settings size={20} />
                    {updateStatus === 'available' && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                </div>
                Software Updates
            </div>
            <div className={`h-[1px] my-2 mx-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'}`}></div>
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
            <div className={`h-[1px] my-4 mx-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'}`}></div>
            <div onClick={() => setActiveTab('developer')} className={navItemClass('developer')}>
                <Terminal size={20} /> Developer
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 h-full p-6 md:p-12 overflow-y-auto relative ${theme === 'dark' ? 'bg-black' : 'bg-[#f5f5f7]'}`}>
          
          {/* PROFILE */}
          {activeTab === 'profile' && (
              <div className={sectionClass}>
                  <h3 className="text-3xl font-bold">My Profile</h3>
                  <div className={cardClass}>
                      <div className="flex items-center gap-6 relative z-10">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ${theme === 'dark' ? 'ring-black' : 'ring-white'} overflow-hidden relative z-10`}>
                           {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-bold">{displayName}</h4>
                          <p className={`font-medium flex items-center gap-2 ${isPro ? 'text-yellow-400' : 'text-zinc-500'}`}>
                              {isPro ? <><Crown size={14} fill="currentColor"/> Infinity Pro Plan</> : 'Infinity Free Plan'}
                          </p>
                        </div>
                        {!isPro && (
                            <button onClick={onUpgradeClick} className={`absolute right-6 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-lg z-20 active:scale-95`}>
                                <Crown size={14} /> Upgrade
                            </button>
                        )}
                      </div>
                  </div>
                  <div className="flex flex-col gap-4">
                      <div className={cardClass}>
                          <h4 className="font-bold mb-4">Account Information</h4>
                          <div className="space-y-4">
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                  <span className="text-zinc-500">Email</span>
                                  <span className="font-medium">{user?.email || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                  <span className="text-zinc-500">Member Since</span>
                                  <span className="font-medium">{new Date(user?.created_at || '').toLocaleDateString()}</span>
                              </div>
                          </div>
                      </div>
                      <button onClick={onLogout} className="h-14 px-10 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full font-bold transition-all hover:bg-red-500/20 flex items-center justify-center gap-2 active:scale-95">
                          <LogOut size={18} /> Sign Out
                      </button>
                   </div>
              </div>
          )}

          {/* CUSTOMIZATION */}
          {activeTab === 'customization' && (
            <div className={sectionClass}>
              <h3 className="text-3xl font-bold">Customization</h3>
              <div className="space-y-4">
                  <div className={cardClass}>
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'}`}>
                                  {theme === 'dark' ? <Moon size={20}/> : <Sun size={20}/>}
                              </div>
                              <div>
                                  <h4 className="font-bold">Infinity Design White Theme 1.0</h4>
                                  <p className={subTextClass}>Refined visual identity system</p>
                              </div>
                          </div>
                          <div className={`flex rounded-lg p-1 border ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-zinc-200/50 border-zinc-200'}`}>
                              <button onClick={() => onThemeToggle('dark')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}>Dark</button>
                              <button onClick={() => onThemeToggle('light')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-zinc-500'}`}>White</button>
                          </div>
                      </div>
                  </div>

                  <div className={cardClass}>
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                  <Thermometer size={20}/>
                              </div>
                              <div>
                                  <h4 className="font-bold">Temperature Unit</h4>
                                  <p className={subTextClass}>Display weather in Celsius or Fahrenheit</p>
                              </div>
                          </div>
                          <div className={`flex rounded-lg p-1 border ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-zinc-200/50 border-zinc-200'}`}>
                              <button onClick={() => onToggleWeatherUnit('c')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${weatherUnit === 'c' ? (theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-black shadow-sm') : 'text-zinc-500'}`}>°C</button>
                              <button onClick={() => onToggleWeatherUnit('f')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${weatherUnit === 'f' ? (theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-black shadow-sm') : 'text-zinc-500'}`}>°F</button>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* WALLPAPERS */}
          {activeTab === 'wallpapers' && (
              <div className={sectionClass}>
                  <h3 className="text-3xl font-bold">Wallpapers</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div 
                        onClick={() => onWallpaperChange(null)}
                        className={`aspect-video rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all ${!currentWallpaper ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white/5 hover:border-white/20'}`}
                      >
                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">None</span>
                      </div>
                      {WALLPAPERS.map((wp) => (
                          <div 
                            key={wp.name}
                            onClick={() => onWallpaperChange(wp.url)}
                            className={`aspect-video rounded-2xl border-2 overflow-hidden cursor-pointer transition-all relative group ${currentWallpaper === wp.url ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white/5 hover:border-white/20'}`}
                          >
                              <img src={wp.url} className="w-full h-full object-cover" alt={wp.name} />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">{wp.name}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* CLOUD STORAGE */}
          {activeTab === 'cloud' && (
              <div className={sectionClass}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold">Cloud Storage</h3>
                    {isCloudEnabled && (
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-500">
                            <ShieldCheck size={14}/> Secure Sync
                        </div>
                    )}
                  </div>
                  
                  <div className={cardClass}>
                      <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner">
                                  <Cloud size={24} />
                              </div>
                              <div>
                                  <h4 className="text-lg font-bold">Infinity Cloud Sync</h4>
                                  <p className={subTextClass}>Encrypted backup for your OS state</p>
                              </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={isCloudEnabled} onChange={e => onToggleCloud?.(e.target.checked)} />
                            <div className="w-12 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                      </div>

                      {isCloudEnabled && (
                          <div className="space-y-4 animate-fadeIn border-t border-white/5 pt-6">
                               <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">Auto-Sync Changes</div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={isAutoSyncEnabled} onChange={e => onToggleAutoSync?.(e.target.checked)} />
                                        <div className="w-11 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                                    </label>
                               </div>
                               <div className="flex items-center justify-between">
                                   <div className="text-xs text-zinc-500">Last Synced: {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}</div>
                                   <button 
                                        onClick={handleSync}
                                        disabled={isSyncing}
                                        className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                                    >
                                       <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} /> Sync Now
                                   </button>
                               </div>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {/* FEATURE AI */}
          {activeTab === 'ai' && (
              <div className={sectionClass}>
                  <h3 className="text-3xl font-bold">Feature AI</h3>
                  <p className={subTextClass}>Select the reasoning engine that powers your search and workspace.</p>
                  
                  <div className="grid gap-3">
                      {AVAILABLE_MODELS.map((model) => (
                          <div 
                            key={model.id}
                            onClick={() => handleModelChange(model.id)}
                            className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all group flex items-center justify-between ${selectedModel === model.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 hover:border-white/10'}`}
                          >
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedModel === model.id ? 'bg-blue-500 text-white shadow-lg' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                      <Bot size={20} />
                                  </div>
                                  <div>
                                      <div className="flex items-center gap-2">
                                          <span className="font-bold text-sm">{model.name}</span>
                                          {model.badge && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-black">{model.badge}</span>}
                                      </div>
                                      <p className="text-xs text-zinc-500">{model.desc}</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3">
                                  {model.isPro && !isPro && <Crown size={14} className="text-yellow-500" />}
                                  {selectedModel === model.id && <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white"><Check size={12} strokeWidth={4} /></div>}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* CONNECTED APPS */}
          {activeTab === 'connected' && (
              <div className={sectionClass}>
                  <h3 className="text-3xl font-bold">Connected Apps</h3>
                  <div className="space-y-4">
                       <div className={cardClass}>
                           <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-lg p-2">
                                       <svg viewBox="0 0 122.88 128.1" fill="currentColor"><path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/></svg>
                                   </div>
                                   <div>
                                       <h4 className="font-bold">Notion Workspace</h4>
                                       <p className={subTextClass}>{isNotionConnected ? 'Active Connection' : 'Search your private docs'}</p>
                                   </div>
                               </div>
                               <button 
                                    onClick={onConnectNotion}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${isNotionConnected ? 'bg-zinc-800 text-zinc-400 hover:bg-red-500/10 hover:text-red-500' : 'bg-white text-black hover:bg-zinc-200'}`}
                                >
                                   {isNotionConnected ? 'Disconnect' : 'Connect'}
                               </button>
                           </div>
                       </div>
                       
                       <div className={`${cardClass} opacity-50 cursor-not-allowed`}>
                           <div className="flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-white border border-black/5 rounded-2xl flex items-center justify-center shadow-lg p-2 overflow-hidden">
                                       <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="G" />
                                   </div>
                                   <div>
                                       <h4 className="font-bold">Google Drive</h4>
                                       <p className={subTextClass}>AI Search for files</p>
                                   </div>
                               </div>
                               <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Soon</div>
                           </div>
                       </div>
                  </div>
              </div>
          )}

          {/* SUBSCRIPTION */}
          {activeTab === 'subscription' && (
              <div className={sectionClass}>
                  <h3 className="text-3xl font-bold">Subscription</h3>
                  <div className={`${cardClass} bg-gradient-to-br from-zinc-800 to-black border-yellow-500/20`}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div>
                              <div className="flex items-center gap-2 mb-2">
                                  <Crown size={20} className="text-yellow-500" fill="currentColor" />
                                  <h4 className="text-xl font-bold text-white">Infinity Plus</h4>
                              </div>
                              <p className="text-zinc-400 max-w-md">Unlimited reasoning queries, global cloud sync, and priority access to new agent tools.</p>
                          </div>
                          <div className="text-right">
                              <div className="text-3xl font-bold text-white mb-2">$20/mo</div>
                              <button 
                                onClick={onUpgradeClick}
                                className={`px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 ${isPro ? 'bg-zinc-800 text-zinc-500 cursor-default' : 'bg-white text-black hover:bg-yellow-400'}`}
                              >
                                  {isPro ? 'Active' : 'Upgrade Plan'}
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className={cardClass}>
                           <div className="flex items-center gap-3 mb-4">
                               <Lock size={16} className="text-blue-400" />
                               <h5 className="font-bold">Billing Details</h5>
                           </div>
                           <p className="text-xs text-zinc-500">Secure payments are handled by Polar.sh. We never store your card details on our servers.</p>
                       </div>
                       <div className={cardClass}>
                           <div className="flex items-center gap-3 mb-4">
                               <Zap size={16} className="text-purple-400" />
                               <h5 className="font-bold">Usage Limits</h5>
                           </div>
                           <div className="space-y-2">
                               <div className="flex justify-between text-xs">
                                   <span className="text-zinc-500">Search Queries</span>
                                   <span className="text-zinc-300 font-mono">Unlimited</span>
                               </div>
                               <div className="flex justify-between text-xs">
                                   <span className="text-zinc-500">Deep Reasoning</span>
                                   <span className="text-zinc-300 font-mono">{isPro ? 'Unlimited' : '20 / day'}</span>
                               </div>
                           </div>
                       </div>
                  </div>
              </div>
          )}

          {/* UPDATES */}
          {activeTab === 'updates' && (
              <div className={sectionClass}>
                  <h3 className="text-3xl font-bold">Software Updates</h3>
                  <div className={cardClass}>
                      <div className="flex items-center justify-between mb-10">
                          <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-zinc-800 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl relative">
                                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                                  </div>
                              </div>
                              <div>
                                  <h4 className="text-xl font-bold">Infinity OS</h4>
                                  <p className={subTextClass}>Currently Version: {osVersion}</p>
                              </div>
                          </div>
                          {updateStatus === 'uptodate' ? (
                              <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                                  <CheckCircle size={18} /> Up to Date
                              </div>
                          ) : updateStatus === 'available' ? (
                              <button onClick={handleUpdateOS} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95">Update Now</button>
                          ) : null}
                      </div>

                      {updateStatus === 'installing' && (
                          <div className="space-y-4 animate-fadeIn">
                              <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest text-zinc-500">
                                  <span>Downloading OS 26.2...</span>
                                  <span className="text-blue-400">{Math.round(installProgress)}%</span>
                              </div>
                              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${installProgress}%` }}></div>
                              </div>
                              <p className="text-[10px] text-zinc-600 font-medium">Please do not refresh the page during kernel installation.</p>
                          </div>
                      )}

                      <div className="mt-8 border-t border-white/5 pt-8">
                          <h5 className="font-bold mb-4 flex items-center gap-2"><Sparkles size={14} className="text-yellow-500" /> New in OS 26.0 Series</h5>
                          <ul className="space-y-3 text-sm text-zinc-500">
                              <li className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                  <span>Added <strong>Deep Think 2.5</strong> for multi-step reasoning capabilities.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                  <span>Introduced <strong>Spatial Glass UI</strong> with theme system 1.0.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                  <span>Optimized local-first database encryption latency.</span>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          )}

          {/* DEVELOPER */}
          {activeTab === 'developer' && <DeveloperConsoleView />}
          
      </div>
    </div>
  );
};

export default SettingsView;