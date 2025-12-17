
import React, { useState, useEffect } from 'react';
import { User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone, Image as ImageIcon, Check, BookOpen, LogOut, Cloud, RefreshCw, ExternalLink, Thermometer, Crown, DollarSign, Lock, CreditCard, AlertTriangle, Terminal, Settings, Server, Trash2, Plus, Download, Sparkles, Globe, Database, Radio, Utensils, ShoppingBag, Plane, Users, ShieldCheck, HardDrive } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
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
  // Cloud Props
  isCloudEnabled?: boolean;
  onToggleCloud?: (enabled: boolean) => void;
  lastSynced?: Date | null;
  onManualSync?: () => void;
  isAutoSyncEnabled?: boolean;
  onToggleAutoSync?: (enabled: boolean) => void;
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
    { id: 'gemini-2.5-flash', name: 'Gemini 3 Flash', desc: 'Standard reasoning engine.', isPro: false, badge: 'DEFAULT' },
    { id: 'gpt-oss-120b', name: 'GPT-OSS 120B', desc: 'Powerful open-source benchmark leader.', isPro: false, badge: 'OPEN' },
    { id: 'gemini-2.5-pro', name: 'Gemini 3 Pro', desc: 'Advanced complex reasoning.', isPro: true },
    { id: 'gemini-3.0-pro', name: 'Gemini 3 Pro (Ultra)', desc: 'Maximum reasoning power.', isPro: true },
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
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const savedClarifaiPat = localStorage.getItem('clarifai_pat');
    if (savedClarifaiPat) setClarifaiPat(savedClarifaiPat);

    const proStatus = localStorage.getItem('infinity_pro_status');
    setIsPro(proStatus === 'active');

    const savedModel = localStorage.getItem('infinity_ai_model') || 'gemini-2.5-flash';
    setSelectedModel(savedModel);

    setMcpServers(getMcpServers());
    
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

  const handleSync = async () => {
      if (onManualSync) {
          setIsSyncing(true);
          await onManualSync();
          setTimeout(() => setIsSyncing(false), 1500); // Visual delay
      }
  };

  const handleSaveKeys = () => {
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
                  <h3 className="text-3xl font-bold text-white">Software Updates</h3>
                  <div className="p-8 rounded-[32px] bg-zinc-900 border border-white/10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                          <Settings size={40} className={updateStatus === 'installing' ? 'animate-spin text-blue-400' : 'text-zinc-400'} />
                      </div>
                      
                      {updateStatus === 'uptodate' ? (
                          <>
                              <h4 className="text-xl font-bold mb-2">Infinity OS is up to date</h4>
                              <p className="text-zinc-500 text-sm mb-8">Version {osVersion} Beta</p>
                              <div className="flex items-center gap-2 text-green-500 text-sm font-bold bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                                  <Check size={16} /> Latest version installed
                              </div>
                          </>
                      ) : updateStatus === 'available' ? (
                          <>
                              <h4 className="text-xl font-bold mb-2">New Update Available</h4>
                              <p className="text-zinc-500 text-sm mb-8">Infinity OS 26.2.1-stable • 142MB</p>
                              <div className="text-left w-full bg-black/40 p-4 rounded-2xl border border-white/5 mb-8">
                                  <div className="text-xs font-bold text-blue-400 uppercase mb-2">What's New</div>
                                  <ul className="text-xs text-zinc-400 space-y-1">
                                      <li>• Improved kernel reasoning latency</li>
                                      <li>• Optimized spatial window physics</li>
                                      <li>• New dynamic glass textures</li>
                                  </ul>
                              </div>
                              <button onClick={handleUpdateOS} className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all shadow-xl">
                                  Update Now
                              </button>
                          </>
                      ) : (
                          <div className="w-full">
                              <h4 className="text-xl font-bold mb-2">Installing Update</h4>
                              <p className="text-zinc-500 text-sm mb-6">Preparing components... {Math.round(installProgress)}%</p>
                              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-8">
                                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${installProgress}%` }}></div>
                              </div>
                              <button disabled className="w-full py-4 bg-zinc-800 text-zinc-500 rounded-2xl font-bold cursor-wait">
                                  Please wait...
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {/* TAB: CLOUD STORAGE */}
          {activeTab === 'cloud' && (
            <div className="space-y-8 animate-slideUp max-w-3xl">
              <h3 className="text-3xl font-bold text-white">Cloud Storage</h3>
              <p className="text-zinc-400">Manage your data synchronization.</p>
              
              <div className={`p-8 rounded-[32px] border relative overflow-hidden transition-all duration-500 ${isCloudEnabled ? 'bg-gradient-to-br from-zinc-900 to-black border-green-900/50 shadow-lg shadow-green-900/10' : 'bg-zinc-900 border-zinc-800'}`}>
                  
                  {isCloudEnabled && <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] pointer-events-none"></div>}
                  
                  <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${isCloudEnabled ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                              <Cloud size={32} />
                          </div>
                          <div>
                              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                  Infinity Cloud
                                  {isCloudEnabled && <span className="bg-green-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>}
                              </h4>
                              <p className="text-sm text-zinc-400 mt-1">Sync history, settings, and collections across devices.</p>
                          </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isCloudEnabled} 
                            onChange={(e) => onToggleCloud && onToggleCloud(e.target.checked)} 
                            disabled={!user}
                        />
                        <div className="w-14 h-8 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-400 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600 peer-checked:after:bg-white"></div>
                      </label>
                  </div>

                  {!user && (
                      <div className="bg-yellow-900/20 border border-yellow-900/50 p-4 rounded-xl flex items-center gap-3 text-yellow-500 text-sm mb-6">
                          <AlertTriangle size={16} />
                          Please sign in to enable Cloud Sync.
                      </div>
                  )}

                  {isCloudEnabled && user && (
                      <div className="space-y-6 relative z-10">
                          <div className="bg-black/40 rounded-2xl p-5 border border-white/5 flex items-center justify-between">
                              <div>
                                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Status</div>
                                  <div className="text-white font-medium flex items-center gap-2">
                                      {isSyncing ? (
                                          <><RefreshCw size={14} className="animate-spin text-blue-400" /> Syncing...</>
                                      ) : (
                                          <><CheckCircle size={14} className="text-green-500" /> Synced</>
                                      )}
                                  </div>
                              </div>
                              <div className="text-right">
                                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Last Synced</div>
                                  <div className="text-white font-mono text-sm">
                                      {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}
                                  </div>
                              </div>
                          </div>

                          <div>
                              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                                  <span>Storage Usage</span>
                                  <span>24% used</span>
                              </div>
                              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500 w-[24%]"></div>
                              </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                              <div>
                                  <div className="font-bold text-white flex items-center gap-2 text-sm">
                                      Auto-Sync <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">BETA</span>
                                  </div>
                                  <div className="text-xs text-zinc-500 mt-1">Automatically sync changes in the background.</div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      checked={isAutoSyncEnabled} 
                                      onChange={(e) => onToggleAutoSync && onToggleAutoSync(e.target.checked)} 
                                  />
                                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                          </div>

                          <button 
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                              {isSyncing ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />} Sync Now
                          </button>
                      </div>
                  )}
              </div>
          </div>
          )}

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
                              <span>Access to Gemini 3 Pro & Claude Opus</span>
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

          {activeTab === 'customization' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Customization</h3>
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center"><Thermometer size={20}/></div>
                          <div>
                              <h4 className="font-bold text-white">Temperature Unit</h4>
                              <p className="text-sm text-zinc-500">Display weather in Celsius or Fahrenheit</p>
                          </div>
                      </div>
                      <div className="flex bg-black rounded-lg p-1 border border-zinc-800">
                          <button onClick={() => onToggleWeatherUnit('c')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${weatherUnit === 'c' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>°C</button>
                          <button onClick={() => onToggleWeatherUnit('f')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${weatherUnit === 'f' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>°F</button>
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* TAB: FEATURE AI */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-slideUp max-w-3xl">
              <h3 className="text-3xl font-bold text-white">Feature AI</h3>
              <p className="text-zinc-400">Select the intelligence engine that powers your search and workspace.</p>
              
              <div className="grid gap-3">
                  {AVAILABLE_MODELS.map((model) => (
                      <div 
                        key={model.id}
                        onClick={() => handleModelChange(model.id)}
                        className={`p-6 rounded-[24px] border transition-all cursor-pointer relative group ${
                            selectedModel === model.id 
                            ? 'bg-white text-black border-white shadow-lg' 
                            : model.isPro && !isPro 
                                ? 'bg-zinc-900/50 border-zinc-800 opacity-60 cursor-not-allowed' 
                                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                          <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                  <div className={`font-bold ${selectedModel === model.id ? 'text-black' : 'text-white'}`}>{model.name}</div>
                                  {model.badge && (
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedModel === model.id ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                                          {model.badge}
                                      </span>
                                  )}
                              </div>
                              {selectedModel === model.id && <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white"><Check size={12}/></div>}
                              {model.isPro && !isPro && <Lock size={14} className="text-zinc-500" />}
                          </div>
                          <div className={`text-sm ${selectedModel === model.id ? 'text-black/60' : 'text-zinc-500'}`}>{model.desc}</div>
                      </div>
                  ))}
              </div>

              {/* Fixed: Removed manual Gemini API Key input UI as per guidelines. API key is pre-configured. */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl mt-8">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-green-400" /> Pre-configured Intelligence
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                      Infinity Search uses a system-provided API key for Gemini models to ensure maximum security and privacy. You do not need to provide your own key.
                  </p>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-6 rounded-2xl border border-blue-900/30">
                <label className="flex items-center gap-2 text-sm font-bold text-blue-300 mb-3">
                    <Key size={16} /> CLARIFAI ACCESS TOKEN (Optional)
                </label>
                <div className="flex gap-3">
                    <input 
                        type="password" 
                        value={clarifaiPat}
                        onChange={(e) => setClarifaiPat(e.target.value)}
                        placeholder="Clarifai PAT..."
                        className="flex-1 p-4 bg-black border border-zinc-800 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none font-mono text-sm text-white"
                    />
                    <button 
                        onClick={handleSaveKeys}
                        className={`px-6 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${isSaved ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSaved ? <Check size={20} /> : <Save size={20} />}
                    </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'connected' && (
            <div className="space-y-8 animate-slideUp max-w-2xl">
              <h3 className="text-3xl font-bold text-white">Connected Apps</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-zinc-800 rounded-xl flex items-center justify-center p-2">
                             <img src="https://notion.so/favicon.ico" alt="Notion" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-white">Notion</h4>
                            <p className="text-sm text-zinc-500">{isNotionConnected ? 'Active Connection' : 'Not linked'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onConnectNotion}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${isNotionConnected ? 'bg-zinc-800 text-zinc-400 hover:bg-red-900/20 hover:text-red-500' : 'bg-white text-black hover:bg-zinc-200'}`}
                    >
                        {isNotionConnected ? 'Connected' : 'Connect'}
                    </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'developer' && <DeveloperConsoleView />}

      </div>
    </div>
  );
};

export default SettingsView;
