
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav'; 
import SearchInput from './components/SearchInput';
import ResultsView from './components/ResultsView';
import DiscoverView from './components/DiscoverView';
import ArticleDetailView from './components/ArticleDetailView';
import HistoryView from './components/HistoryView';
import ImageGridView from './components/ImageGridView';
import LoadingAnimation from './components/LoadingAnimation';
import ConnectNotionModal from './components/ConnectNotionModal';
import NotionResultsView from './components/NotionResultsView';
import BibleResultsView from './components/BibleResultsView';
import PodcastResultsView from './components/PodcastResultsView';
import CommunityView from './components/CommunityView';
import RecipeResultsView from './components/RecipeResultsView';
import RecipeDetailView from './components/RecipeModal'; 
import ShoppingResultsView from './components/ShoppingResultsView';
import FlightResultsView from './components/FlightResultsView';
import CodePilotView from './components/CodePilotView';
import SettingsView from './components/SettingsView';
import MarketingPage from './components/MarketingPage';
import LoginPage from './components/LoginPage';
import AssetsPage from './components/AssetsPage';
import SuccessPage from './components/SuccessPage';
import CollectionsView from './components/CollectionsView';
import QuickAccessBar from './components/QuickAccessBar';
import CameraView from './components/CameraView';
import PricingView from './components/PricingView';
import OsView from './components/OsView';
import CanvasView from './components/CanvasView'; 
import VoiceOverlay from './components/VoiceOverlay'; 
import { searchWithGemini, getProductRecommendations, askDrive, generateCode } from './services/geminiService';
import { fetchImages as fetchPixabayImages, fetchPixabayVideos } from './services/pixabayService';
import { fetchPexelsImages, fetchPexelsVideos } from './services/pexelsService';
import { fetchNasaImages } from './services/nasaService';
import { supabase } from './services/supabaseClient';
import { searchNotion } from './services/notionService';
import { fetchBiblePassage } from './services/bibleService';
import { searchPodcasts } from './services/podcastService';
import { searchRecipes, Recipe } from './services/recipeService';
import { searchShopping, fetchGoogleImages } from './services/shoppingService';
import { searchFlights } from './services/flightService';
import { fetchWeather, getWeatherDescription, WeatherData } from './services/weatherService';
import { enableInfinityCloud, disableInfinityCloud, syncData, loadFromCloud } from './services/infinityCloudService';
import { SearchState, HistoryItem, NewsArticle, MediaItem, CollectionItem, ShoppingProduct, Flight } from './types';
import { User } from '@supabase/supabase-js';
import { ChevronDown, Globe, Image as ImageIcon, ShoppingBag, Plane, Terminal, HardDrive, Newspaper } from 'lucide-react';

const interleaveResults = (sources: MediaItem[][]): MediaItem[] => {
    const result: MediaItem[] = [];
    const maxLen = Math.max(...sources.map(s => s.length));
    for (let i = 0; i < maxLen; i++) {
        for (const source of sources) {
            if (source[i]) result.push(source[i]);
        }
    }
    return result;
};

interface AttachedFile {
  name: string;
  type: 'image' | 'text' | 'pdf';
  content: string;
  mimeType: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'app' | 'assets' | 'success'>('landing');
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'home' | 'os' | 'discover' | 'history' | 'article' | 'images' | 'settings' | 'collections' | 'community' | 'recipe' | 'pricing' | 'canvas'>('home');
  const [previousTab, setPreviousTab] = useState<'home' | 'os' | 'discover' | 'history' | 'article' | 'images' | 'settings' | 'collections' | 'community' | 'recipe' | 'pricing' | 'canvas'>('home');
  const [discoverViewTab, setDiscoverViewTab] = useState<'news' | 'widgets' | 'whats_new' | 'brief'>('news');
  const [initialCommunityPostId, setInitialCommunityPostId] = useState<string | null>(null);
  const [currentWallpaper, setCurrentWallpaper] = useState<string | null>(null);
  const [weatherUnit, setWeatherUnit] = useState<'c' | 'f'>('c');
  const [isPro, setIsPro] = useState(false);
  const [osVersion, setOsVersion] = useState<string>('26.2 Beta');
  const [isCloudEnabled, setIsCloudEnabled] = useState(false);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [searchState, setSearchState] = useState<SearchState>({ status: 'idle', query: '', summary: '', sources: [], media: [], shopping: [], aiProductPicks: [], productImages: [], flights: [], isDeepSearch: false });
  const [searchMode, setSearchMode] = useState<'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight' | 'drive' | 'code'>('web');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [notionToken, setNotionToken] = useState<string | null>(null);
  const [showNotionModal, setShowNotionModal] = useState(false);
  const [connectedProvider, setConnectedProvider] = useState<string>('');
  const [mediaGridData, setMediaGridData] = useState<{ items: MediaItem[], loading: boolean }>({ items: [], loading: false });
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
        setIsAuthChecking(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        // Load persistable local settings
        const proStatus = localStorage.getItem('infinity_pro_status');
        if (proStatus === 'active') setIsPro(true);
        const savedVersion = localStorage.getItem('infinity_os_version');
        if (savedVersion) setOsVersion(savedVersion);
        const cloudEnabled = localStorage.getItem('infinity_cloud_enabled') === 'true';
        setIsCloudEnabled(cloudEnabled);
        const autoSync = localStorage.getItem('infinity_auto_sync') === 'true';
        setIsAutoSyncEnabled(autoSync);

        if (session) {
            setSessionUser(session.user);
            setView('app');
            restoreTokens();
            if (cloudEnabled) {
                const cloudData = await loadFromCloud(session.user.id);
                if (cloudData) {
                    setCollections(cloudData.collections);
                    setHistory(cloudData.history);
                    if (cloudData.settings?.weather_unit) setWeatherUnit(cloudData.settings.weather_unit as 'c'|'f');
                    if (cloudData.settings?.wallpaper_url) setCurrentWallpaper(cloudData.settings.wallpaper_url);
                    setLastSynced(new Date());
                }
            }
        } else {
            // Check for specific deep links or stay on landing
            const path = window.location.pathname.replace('/', '');
            if (path === 'login') setView('login');
            else setView('landing');
        }
        setIsAuthChecking(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
            setSessionUser(session.user);
            captureProviderTokens(session);
            const connectingProvider = localStorage.getItem('connecting_provider');
            if (connectingProvider) {
                setConnectedProvider(connectingProvider);
                setView('success');
                localStorage.removeItem('connecting_provider');
            } else if (view !== 'success') {
                setView('app');
            }
        } else if (event === 'SIGNED_OUT') {
            setSessionUser(null);
            setView('landing');
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
      const loadWeather = async () => {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                  async (pos) => setWeather(await fetchWeather(pos.coords.latitude, pos.coords.longitude)),
                  async () => setWeather(await fetchWeather(40.7128, -74.0060))
              );
          } else {
              setWeather(await fetchWeather(40.7128, -74.0060));
          }
      };
      loadWeather();
      const savedCollections = localStorage.getItem('infinity_collections');
      if (savedCollections && !isCloudEnabled) setCollections(JSON.parse(savedCollections));
  }, [isCloudEnabled]);

  useEffect(() => {
      const sync = async () => {
          if (isCloudEnabled && sessionUser && !isAutoSyncEnabled) {
              const res = await syncData(sessionUser.id, collections, history, {
                  weatherUnit,
                  wallpaperUrl: currentWallpaper,
                  osVersion
              });
              if (res?.success) setLastSynced(new Date());
          } else if (!isCloudEnabled) {
              localStorage.setItem('infinity_collections', JSON.stringify(collections));
          }
      };
      const timeout = setTimeout(sync, 2000);
      return () => clearTimeout(timeout);
  }, [collections, history, weatherUnit, currentWallpaper, isCloudEnabled, sessionUser, isAutoSyncEnabled, osVersion]);

  useEffect(() => {
      let interval: any;
      if (isAutoSyncEnabled && isCloudEnabled && sessionUser) {
          interval = setInterval(async () => {
              const res = await syncData(sessionUser.id, collections, history, {
                  weatherUnit,
                  wallpaperUrl: currentWallpaper,
                  osVersion
              });
              if (res?.success) setLastSynced(new Date());
          }, 30000);
      }
      return () => clearInterval(interval);
  }, [isAutoSyncEnabled, isCloudEnabled, sessionUser, collections, history, weatherUnit, currentWallpaper, osVersion]);

  useEffect(() => {
      if (view === 'app') {
          let path = '/';
          if (activeTab !== 'home') {
              path = `/${activeTab}`;
              if (activeTab === 'community' && initialCommunityPostId) path = `/community/${initialCommunityPostId}`;
          }
          window.history.pushState({}, '', path);
      }
  }, [activeTab, view, initialCommunityPostId]);

  const restoreTokens = () => {
        const savedNotionToken = localStorage.getItem('notion_token');
        if (savedNotionToken) setNotionToken(savedNotionToken);
  };

  const captureProviderTokens = (session: any) => {
      if (session.provider_token) {
           const provider = session.user.app_metadata.provider;
           if (provider === 'notion') {
               setNotionToken(session.provider_token);
               localStorage.setItem('notion_token', session.provider_token);
           }
      }
  };

  const handleWeatherUnitChange = (unit: 'c' | 'f') => {
      setWeatherUnit(unit);
      localStorage.setItem('weather_unit', unit);
  };

  const handleToggleCloud = async (enabled: boolean) => {
      if (!sessionUser) return;
      setIsCloudEnabled(enabled);
      if (enabled) {
          await enableInfinityCloud(sessionUser.id);
          const res = await syncData(sessionUser.id, collections, history, { weatherUnit, wallpaperUrl: currentWallpaper, osVersion });
          if(res?.success) setLastSynced(new Date());
      } else {
          await disableInfinityCloud(sessionUser.id);
      }
  };

  const handleToggleAutoSync = (enabled: boolean) => {
      setIsAutoSyncEnabled(enabled);
      localStorage.setItem('infinity_auto_sync', String(enabled));
  };

  const handleManualSync = async () => {
      if (isCloudEnabled && sessionUser) {
          await syncData(sessionUser.id, collections, history, { weatherUnit, wallpaperUrl: currentWallpaper, osVersion });
          setLastSynced(new Date());
      }
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setSessionUser(null);
      setView('landing');
      setActiveTab('home');
      setSearchState({ status: 'idle', query: '', summary: '', sources: [], media: [] });
      setNotionToken(null);
      // Selective clearing to maintain app settings but clear user session
      localStorage.removeItem('notion_token');
      localStorage.removeItem('infinity_cloud_enabled');
      localStorage.removeItem('infinity_auto_sync');
      localStorage.removeItem('infinity_collections');
      window.history.pushState({}, '', '/');
  };

  const initiateNotionLogin = async () => {
      localStorage.setItem('return_tab', activeTab);
      localStorage.setItem('connecting_provider', 'notion');
      try {
          const { error } = await supabase.auth.signInWithOAuth({ provider: 'notion', options: { redirectTo: window.location.origin } });
          if (error) throw error;
      } catch (e) {
          setNotionToken('mock-notion-token-demo');
          setConnectedProvider('notion');
          setView('success');
          localStorage.removeItem('connecting_provider');
          setShowNotionModal(false);
      }
  };
  
  const handleSuccessContinue = () => { 
      const returnTab = localStorage.getItem('return_tab');
      setView('app'); 
      if (returnTab) {
          setActiveTab(returnTab as any);
          localStorage.removeItem('return_tab');
      } else {
          setActiveTab('home');
      }
  };

  const handleModeChange = (mode: any) => {
      if ((mode === 'shopping' || mode === 'flight' || mode === 'drive') && !isPro) {
          alert(`Upgrade to Infinity Pro to access ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode!`);
          setActiveTab('pricing');
          return;
      }
      if (mode === 'notion' && !notionToken) setShowNotionModal(true);
      else setSearchMode(mode);
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
      const newItem: HistoryItem = { ...item, id: Date.now().toString(), timestamp: new Date() };
      setHistory(prev => [newItem, ...prev]);
  };

  const handleFileSelect = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          const content = e.target?.result as string;
          let type: 'image' | 'text' | 'pdf' = 'text';
          if (file.type.startsWith('image/')) type = 'image';
          else if (file.type === 'application/pdf') type = 'pdf';
          let rawData = content;
          if (type === 'image' || type === 'pdf') rawData = content.split(',')[1];
          setAttachedFile({ name: file.name, type, content: rawData, mimeType: file.type });
      };
      if (file.type.startsWith('image/') || file.type === 'application/pdf') reader.readAsDataURL(file);
      else reader.readAsText(file);
  };

  const handleCameraCapture = (imageSrc: string) => {
      setAttachedFile({ name: 'Camera Capture', type: 'image', content: imageSrc, mimeType: 'image/jpeg' });
      setShowCamera(false);
  };

  const handleRemoveFile = () => setAttachedFile(null);

  const handleSaveToCollections = (item: any) => {
      const newItem: CollectionItem = { id: Date.now().toString(), type: item.type, content: item.content, dateAdded: Date.now() };
      setCollections(prev => [newItem, ...prev]);
  };

  const handleRemoveFromCollections = (id: string) => setCollections(prev => prev.filter(item => item.id !== id));
  const handleOsUpdate = (version: string) => { setOsVersion(version); localStorage.setItem('infinity_os_version', version); };

  const handleSearch = async (query: string, mode: any) => {
      setSearchState(prev => ({ ...prev, status: 'searching', query, isDeepSearch: false }));
      setActiveTab('home');
      try {
        if (mode === 'code') {
            const result = await generateCode(query);
            setSearchState({ status: 'results', query, summary: result.explanation, sources: [], media: [], codeResult: result });
            addToHistory({ type: 'search', title: `Code: ${query}`, summary: result.explanation, sources: [] });
        } else if (mode === 'notion') {
            if (!notionToken) return setShowNotionModal(true);
            const pages = await searchNotion(query, notionToken);
            setSearchState({ status: 'results', query, summary: `Found ${pages.length} pages in Notion.`, sources: [], media: pages });
            addToHistory({ type: 'search', title: `Notion: ${query}`, summary: `Workspace search for ${query}`, sources: [] });
        } else if (mode === 'bible') {
            const bibleData = await fetchBiblePassage(query);
            if (bibleData) {
                setSearchState({ status: 'results', query, summary: `Passage from ${bibleData.reference}`, sources: [], media: [{ id: bibleData.reference, type: 'bible', thumbnailUrl: '', contentUrl: '', pageUrl: '', title: bibleData.reference, source: bibleData.translation_id, data: bibleData }] });
                addToHistory({ type: 'search', title: `Scripture: ${bibleData.reference}`, summary: bibleData.text.substring(0, 100) + '...', sources: [] });
            }
        } else if (mode === 'recipe') {
            const results = await searchRecipes(query);
            setRecipes(results);
            setSearchState({ status: 'results', query, summary: `Found ${results.length} recipes.`, sources: [], media: [] });
            addToHistory({ type: 'search', title: `Recipe: ${query}`, summary: `Cooking search for ${query}`, sources: [] });
        } else {
            const fileContext = attachedFile ? { content: attachedFile.content, mimeType: attachedFile.mimeType } : undefined;
            const [aiData, pixabayImgs, pexelsImgs, nasaImgs] = await Promise.all([
              searchWithGemini(query, fileContext),
              fetchPixabayImages(query, 4),
              fetchPexelsImages(query, 4),
              fetchNasaImages(query)
            ]);
            const combinedImages = interleaveResults([pixabayImgs, pexelsImgs, nasaImgs]);
            addToHistory({ type: 'search', title: query, summary: aiData.text, sources: aiData.sources });
            setSearchState({ status: 'results', query, summary: aiData.text, sources: aiData.sources, media: combinedImages });
            setMediaGridData({ items: combinedImages, loading: false });
            setAttachedFile(null); 
        }
      } catch (error) {
        console.error(error);
        setSearchState(prev => ({ ...prev, status: 'idle', error: 'Search failed' }));
      }
  };

  const handleMediaSearch = async (query: string, type: 'image' | 'video') => {
      setMediaGridData({ items: [], loading: true });
      setMediaType(type);
      setActiveTab('images');
      let results: MediaItem[] = [];
      if (type === 'image') {
        const [pixabay, pexels, nasa] = await Promise.all([fetchPixabayImages(query, 10), fetchPexelsImages(query, 10), fetchNasaImages(query)]);
        results = interleaveResults([pixabay, pexels, nasa]);
      } else {
        const [pixabayVids, pexelsVids] = await Promise.all([fetchPixabayVideos(query, 8), fetchPexelsVideos(query, 8)]);
        results = interleaveResults([pixabayVids, pexelsVids]);
      }
      setMediaGridData({ items: results, loading: false });
  };

  const handleReset = () => {
    setActiveTab('home');
    setSearchState({ status: 'idle', query: '', summary: '', sources: [], media: [] });
    setSearchMode('web');
    setAttachedFile(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    window.history.pushState({}, '', '/');
  };

  if (view === 'assets') return <AssetsPage onBack={() => setView('landing')} />;
  if (view === 'success') return <SuccessPage provider={connectedProvider} onContinue={handleSuccessContinue} />;
  if (isAuthChecking) return <div className="h-screen w-full bg-black flex items-center justify-center"><LoadingAnimation/></div>;
  if (view === 'landing') return <div className="h-screen w-full overflow-y-auto bg-black"><MarketingPage onGetStarted={() => setView('login')} onViewAssets={() => setView('assets')} /></div>;
  if (view === 'login' && !sessionUser) return <div className="h-screen w-full bg-black"><LoginPage onSkip={() => setView('app')} /></div>;

  const userName = sessionUser?.user_metadata?.full_name?.split(' ')[0] || "there";
  const userAvatar = sessionUser?.user_metadata?.avatar_url;
  const tempVal = weather?.temperature || 0;
  const tempDisplay = weatherUnit === 'c' ? Math.round(tempVal) : Math.round(tempVal * 9/5 + 32);
  const tempUnitLabel = weatherUnit === 'c' ? 'C' : 'F';
  const condition = weather?.weathercode !== undefined ? getWeatherDescription(weather.weathercode) : 'clear';
  const city = weather?.city || "your location";

  return (
    <div className="relative h-screen w-full bg-black text-white flex flex-col md:flex-row overflow-hidden">
      {showCamera && <CameraView onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}
      {showVoiceMode && <VoiceOverlay onClose={() => setShowVoiceMode(false)} />}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onReset={handleReset} />
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} onReset={handleReset} />

      <main 
        className="flex-1 w-full h-full md:h-[calc(100vh-1.5rem)] md:m-3 md:ml-24 relative md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col z-10 transition-all duration-500 border-x border-b md:border border-white/10 pb-20 md:pb-0" 
        style={currentWallpaper ? { backgroundImage: `url(${currentWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#000' }}
      >
        {currentWallpaper && <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none z-0" />}

        {activeTab === 'home' && searchState.status === 'idle' && (
            <div className="absolute top-6 right-8 z-50 flex items-center gap-4">
                <QuickAccessBar />
                {sessionUser && (
                    <div className={`w-10 h-10 rounded-full p-[2px] ${isPro ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin-slow' : 'bg-transparent'}`}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-black border border-white/10">
                            {userAvatar ? <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white font-bold">{userName.charAt(0).toUpperCase()}</div>}
                        </div>
                    </div>
                )}
            </div>
        )}

        <div className={`h-20 flex items-center justify-between pointer-events-none relative z-20 px-8 pt-4 shrink-0 ${activeTab === 'settings' || activeTab === 'canvas' ? 'hidden' : ''}`}>
            <div className="pointer-events-auto">
                {activeTab === 'home' && (searchState.status === 'results' || searchState.status === 'thinking') && (
                    <div onClick={handleReset} className="cursor-pointer group flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full group-hover:scale-150 transition-transform bg-white"/>
                        <span className="font-medium tracking-wide group-hover:opacity-100 opacity-80 text-white">Back to Search</span>
                    </div>
                )}
            </div>
            {!(activeTab === 'home' && searchState.status === 'idle') && (activeTab !== 'os') && (
                <div className="flex items-center gap-3 px-4 py-2 bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all hover:border-white/20 group">
                    <div className="relative"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div><div className="absolute inset-0 bg-purple-500 blur-[4px] opacity-50"></div></div>
                    <span className="font-semibold text-sm text-white/90 tracking-tight">Infinity {osVersion}</span>
                    <div className="h-3 w-[1px] bg-white/10"></div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Synapse</span>
                </div>
            )}
        </div>

        <div className={`flex-1 flex flex-col relative z-20 transition-all w-full ${activeTab === 'images' || activeTab === 'settings' || activeTab === 'recipe' || activeTab === 'pricing' || activeTab === 'os' || activeTab === 'canvas' ? 'overflow-hidden' : 'overflow-y-auto glass-scroll px-4 md:px-8 pb-8'}`}>
            {activeTab === 'home' && (
              <>
                <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${searchState.status === 'idle' ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mb-20 animate-slideUp">
                        <img src="https://iili.io/fRRfoF9.png" alt="Infinity Logo" className="w-64 md:w-80 h-auto mb-4 drop-shadow-2xl" />
                        <SearchInput 
                            onSearch={handleSearch} isSearching={searchState.status === 'searching' || searchState.status === 'thinking'} 
                            centered={true} activeMode={searchMode} onModeChange={handleModeChange}
                            onFileSelect={handleFileSelect} attachedFile={attachedFile} onRemoveFile={handleRemoveFile}
                            onCameraClick={() => setShowCamera(true)} isPro={isPro} onVoiceClick={() => setShowVoiceMode(true)}
                        />
                        <div className="text-center space-y-3 mt-4 px-4">
                            <p className="text-lg md:text-xl text-zinc-400 font-light">Hi, {userName}. Today, there will be <span className="text-white font-medium">{tempDisplay}°{tempUnitLabel}</span> and <span className="text-white font-medium">{condition}</span> in {city}.</p>
                            <button onClick={() => { setDiscoverViewTab('brief'); setActiveTab('discover'); }} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors mx-auto group">See your daily briefing <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" /></button>
                        </div>
                    </div>
                </div>
                {searchState.status === 'searching' && <div className="absolute inset-0 flex items-center justify-center"><LoadingAnimation /></div>}
                {searchState.status === 'results' && (
                    <div className="w-full h-full pt-4">
                        {searchMode === 'code' && searchState.codeResult ? <CodePilotView codeResult={searchState.codeResult} /> 
                        : searchMode === 'notion' ? <NotionResultsView items={searchState.media} query={searchState.query} /> 
                        : searchMode === 'bible' ? <BibleResultsView items={searchState.media} query={searchState.query} /> 
                        : searchMode === 'podcast' ? <PodcastResultsView items={searchState.media} query={searchState.query} onSave={handleSaveToCollections} /> 
                        : searchMode === 'community' ? <CommunityView user={sessionUser} initialQuery={searchState.query} /> 
                        : searchMode === 'recipe' ? <RecipeResultsView recipes={recipes} query={searchState.query} onOpenRecipe={setCurrentRecipe} /> 
                        : searchMode === 'shopping' ? <ShoppingResultsView products={searchState.shopping || []} aiPicks={searchState.aiProductPicks || []} productImages={searchState.productImages || []} query={searchState.query} onSave={handleSaveToCollections} /> 
                        : searchMode === 'flight' ? <FlightResultsView flights={searchState.flights || []} query={searchState.query} onSave={handleSaveToCollections} /> 
                        : (
                            <>
                                <div className="max-w-4xl mx-auto mb-6"><h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">{searchState.query}</h2></div>
                                <ResultsView summary={searchState.summary} sources={searchState.sources} images={searchState.media} onOpenImageGrid={() => handleMediaSearch(searchState.query, 'image')} onSave={handleSaveToCollections} query={searchState.query} />
                            </>
                        )}
                    </div>
                )}
              </>
            )}
            {activeTab === 'os' && <OsView user={sessionUser} onLogout={handleLogout} weather={weather} history={history} collections={collections} onSearch={(q) => handleSearch(q, 'web')} onSaveHistory={addToHistory} />}
            {activeTab === 'canvas' && <CanvasView />}
            {activeTab === 'discover' && <div className="w-full h-full pt-4"><DiscoverView onOpenArticle={setCurrentArticle} onSummarize={(url) => handleSearch(`Summarize: ${url}`, 'web')} onOpenRecipe={setCurrentRecipe} initialTab={discoverViewTab} weatherUnit={weatherUnit} /></div>}
            {activeTab === 'collections' && <div className="w-full h-full pt-4"><CollectionsView items={collections} onRemove={handleRemoveFromCollections}/></div>}
            {activeTab === 'community' && <div className="w-full h-full pt-4"><CommunityView user={sessionUser} initialPostId={initialCommunityPostId} /></div>}
            {activeTab === 'images' && <div className="w-full h-full"><ImageGridView items={mediaGridData.items} onSearch={handleMediaSearch} loading={mediaGridData.loading} activeMediaType={mediaType} onMediaTypeChange={setMediaType} /></div>}
            {activeTab === 'article' && currentArticle && <ArticleDetailView article={currentArticle} onBack={() => setActiveTab(previousTab)} onSummarize={(url) => handleSearch(`Summarize: ${url}`, 'web')} />}
            {activeTab === 'recipe' && currentRecipe && <RecipeDetailView recipe={currentRecipe} onBack={() => setActiveTab(previousTab)} />}
            {activeTab === 'pricing' && <PricingView />}
            {activeTab === 'history' && <HistoryView history={history} onSelectItem={(item) => item.type === 'search' ? handleSearch(item.title, 'web') : setCurrentArticle(item.data)} />}
            {activeTab === 'settings' && <SettingsView isNotionConnected={!!notionToken} onConnectNotion={initiateNotionLogin} currentWallpaper={currentWallpaper} onWallpaperChange={setCurrentWallpaper} user={sessionUser} onLogout={handleLogout} weatherUnit={weatherUnit} onToggleWeatherUnit={handleWeatherUnitChange} onUpgradeClick={() => setActiveTab('pricing')} osVersion={osVersion} onUpdateOS={handleOsUpdate} isCloudEnabled={isCloudEnabled} onToggleCloud={handleToggleCloud} lastSynced={lastSynced} onManualSync={handleManualSync} isAutoSyncEnabled={isAutoSyncEnabled} onToggleAutoSync={handleToggleAutoSync} />}
        </div>
      </main>
    </div>
  );
};

export default App;
