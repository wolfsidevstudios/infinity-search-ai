
import React, { useState, useEffect } from 'react';
import { User, Palette, Cpu, Link as LinkIcon, Save, Key, CheckCircle, Smartphone, Image as ImageIcon, Check, BookOpen, LogOut, Cloud, RefreshCw, ExternalLink, Thermometer, Crown, DollarSign, Lock, CreditCard, AlertTriangle, Terminal, Settings, Server, Trash2, Plus, Download, Sparkles, Globe, Database, Radio, Utensils, ShoppingBag, Plane, Users, ShieldCheck, HardDrive, Moon, Sun } from 'lucide-react';
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
  const [clarifaiPat, setClarifaiPat] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  
  const [mcpServers, setMcpServers] = useState<McpServer[]>([]);
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
      }, 200);
  };

  const handleSync = async () => {
      if (onManualSync) {
          setIsSyncing(true);
          await onManualSync();
          setTimeout(() => setIsSyncing(false), 1500);
      }
  };

  const handleSaveKeys = () => {
    if (clarifaiPat.trim()) localStorage.setItem('clarifai_pat', clarifaiPat.trim());
    else localStorage.removeItem('clarifai_pat');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleModelChange = (model: string) => {
      const selected = AVAILABLE_MODELS.find(m => m.id === model);
      if (selected?.isPro && !isPro) return;
      setSelectedModel(model);
      localStorage.setItem('infinity_ai_model', model);
  };

  const handleCancelSubscription = () => {
      if (window.confirm("Are you sure you want to cancel your Infinity Pro subscription?")) {
          localStorage.removeItem('infinity_pro_status');
          setIsPro(false);
          const current = AVAILABLE_MODELS.find(m => m.id === selectedModel);
          if (current?.isPro) handleModelChange('gemini-2.5-flash');
      }
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

  const sectionClass = `space-y-8 animate-slideUp max-w-3xl`;
  const cardClass = `p-8 rounded-[32px] border relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`;

  return (
    <div className={`w-full h-full flex flex-col md:flex-row animate-fadeIn transition-colors duration-700 ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}>
      
      {/* Sidebar Navigation */}
      <div className={`w-full md:w-80 shrink-0 h-full border-r flex flex-col p-6 md:p-8 ${theme === 'dark' ? 'border-white/10 bg-black' : 'border-black/5 bg-white'}`}>
        <h2 className={`text-3xl font-bold mb-10 pl-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Settings</h2>
        
        <div className="flex flex-col gap-1">
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
          
          {activeTab === 'customization' && (
            <div className={sectionClass}>
              <h3 className="text-3xl font-bold">Customization</h3>
              <div className="space-y-4">
                  {/* Theme Switcher */}
                  <div className={cardClass}>
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'}`}>
                                  {theme === 'dark' ? <Moon size={20}/> : <Sun size={20}/>}
                              </div>
                              <div>
                                  <h4 className="font-bold">Infinity Design White Theme 1.0</h4>
                                  <p className="text-sm text-zinc-500">Switch between standard and white theme</p>
                              </div>
                          </div>
                          <div className={`flex rounded-lg p-1 border ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                              <button onClick={() => onThemeToggle('dark')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>Dark</button>
                              <button onClick={() => onThemeToggle('light')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>White</button>
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
                                  <p className="text-sm text-zinc-500">Display weather in Celsius or Fahrenheit</p>
                              </div>
                          </div>
                          <div className={`flex rounded-lg p-1 border ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                              <button onClick={() => onToggleWeatherUnit('c')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${weatherUnit === 'c' ? (theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-black shadow-sm') : 'text-zinc-500 hover:text-zinc-300'}`}>°C</button>
                              <button onClick={() => onToggleWeatherUnit('f')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${weatherUnit === 'f' ? (theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-white text-black shadow-sm') : 'text-zinc-500 hover:text-zinc-300'}`}>°F</button>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* ... other tabs would use cardClass and theme-aware colors ... */}
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
                            <button onClick={onUpgradeClick} className={`absolute right-6 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-lg z-20`}>
                                <Crown size={14} /> Upgrade
                            </button>
                        )}
                      </div>
                  </div>
                  <div className="pt-8 flex gap-4">
                      <button onClick={onLogout} className="h-14 px-10 bg-red-900/20 border border-red-900/50 text-red-500 rounded-full font-bold transition-all hover:bg-red-900/40 flex items-center gap-2">
                          <LogOut size={18} /> Sign Out
                      </button>
                   </div>
              </div>
          )}
          
          {activeTab === 'developer' && <DeveloperConsoleView />}
      </div>
    </div>
  );
};

export default SettingsView;
