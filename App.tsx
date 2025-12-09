import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
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
import SettingsView from './components/SettingsView';
import MarketingPage from './components/MarketingPage';
import LoginPage from './components/LoginPage';
import AssetsPage from './components/AssetsPage';
import SuccessPage from './components/SuccessPage';
import AgenticProcessView from './components/AgenticProcessView';
import CollectionsView from './components/CollectionsView';
import QuickAccessBar from './components/QuickAccessBar';
import { searchWithGemini } from './services/geminiService';
import { fetchImages as fetchPixabayImages, fetchPixabayVideos } from './services/pixabayService';
import { fetchPexelsImages, fetchPexelsVideos } from './services/pexelsService';
import { fetchNasaImages } from './services/nasaService';
import { supabase } from './services/supabaseClient';
import { searchNotion } from './services/notionService';
import { fetchBiblePassage } from './services/bibleService';
import { syncHistoryToDrive } from './services/googleDriveService';
import { fetchWeather, getWeatherDescription, WeatherData } from './services/weatherService';
import { SearchState, HistoryItem, NewsArticle, MediaItem, CollectionItem } from './types';
import { User } from '@supabase/supabase-js';
import { ChevronDown } from 'lucide-react';

// Helper to mix results from different sources
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
  content: string; // Base64 or text content
  mimeType: string;
}

const App: React.FC = () => {
  // App Logic State
  const [view, setView] = useState<'landing' | 'login' | 'app' | 'assets' | 'success'>('landing');
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'history' | 'article' | 'images' | 'settings' | 'collections'>('home');
  const [discoverViewTab, setDiscoverViewTab] = useState<'news' | 'widgets' | 'whats_new' | 'brief'>('news');
  
  // Appearance
  const [currentWallpaper, setCurrentWallpaper] = useState<string | null>(null);

  // Search State
  const [searchState, setSearchState] = useState<SearchState>({
    status: 'idle',
    query: '',
    summary: '',
    sources: [],
    media: [],
    isDeepSearch: false,
  });

  // Search Mode & Deep Search
  const [searchMode, setSearchMode] = useState<'web' | 'notion' | 'bible'>('web');
  const [isDeepSearchEnabled, setIsDeepSearchEnabled] = useState(false);

  // File Upload State
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);

  // Collections State
  const [collections, setCollections] = useState<CollectionItem[]>([]);

  // Auth State (Legacy/Direct Connections)
  const [notionToken, setNotionToken] = useState<string | null>(null);
  const [showNotionModal, setShowNotionModal] = useState(false);

  // Google Drive
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);

  // Connection Success State
  const [connectedProvider, setConnectedProvider] = useState<string>('');

  // State for Images/Media Tab
  const [mediaGridData, setMediaGridData] = useState<{ items: MediaItem[], loading: boolean }>({
    items: [],
    loading: false
  });
  
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  // State for history
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // State for viewing an article
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);

  // Weather State for Home Greeting
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // -- INIT & ROUTING LOGIC --
  useEffect(() => {
    const initApp = async () => {
        setIsAuthChecking(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        // 1. Check Deep Link Path
        const path = window.location.pathname.replace('/', '');
        if (session) {
            setSessionUser(session.user);
            restoreTokens();
            
            // If connecting provider, we go to success page, otherwise restore path
            const connectingProvider = localStorage.getItem('connecting_provider');
            if (connectingProvider) {
                 // handled in auth listener
            } else {
                 setView('app');
                 if (['home', 'discover', 'history', 'images', 'settings', 'collections'].includes(path)) {
                      setActiveTab(path as any);
                 }
            }
        } else {
             // If trying to access protected route without session, go to landing or login
             if (path === 'login') setView('login');
             else setView('landing');
        }
        setIsAuthChecking(false);
    };

    initApp();

    // Fetch Weather for Home Greeting
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

    // Load Collections & AutoSave
    const savedCollections = localStorage.getItem('infinity_collections');
    if (savedCollections) setCollections(JSON.parse(savedCollections));

    const savedAutoSave = localStorage.getItem('autosave_history');
    if (savedAutoSave === 'true') setIsAutoSaveEnabled(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            setSessionUser(session.user);
            captureProviderTokens(session);

            // CHECK IF WE CAME FROM A "CONNECT" ACTION
            const connectingProvider = localStorage.getItem('connecting_provider');
            if (connectingProvider) {
                setConnectedProvider(connectingProvider);
                setView('success');
                localStorage.removeItem('connecting_provider');
            } else {
                setView('app');
            }
        } else {
            setSessionUser(null);
            setView('landing');
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update URL on Tab Change
  useEffect(() => {
      if (view === 'app') {
          const path = activeTab === 'home' ? '/' : `/${activeTab}`;
          window.history.pushState({}, '', path);
      }
  }, [activeTab, view]);

  const restoreTokens = () => {
        const savedDriveToken = localStorage.getItem('google_drive_token');
        if (savedDriveToken) setGoogleAccessToken(savedDriveToken);
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
           if (provider === 'google') {
               setGoogleAccessToken(session.provider_token);
               localStorage.setItem('google_drive_token', session.provider_token);
           }
      }
  };

  // Sync Collections
  useEffect(() => {
      localStorage.setItem('infinity_collections', JSON.stringify(collections));
  }, [collections]);

  // History Sync Logic
  useEffect(() => {
      if (isAutoSaveEnabled && googleAccessToken && history.length > 0) {
          const timeout = setTimeout(() => {
              syncHistoryToDrive(history, googleAccessToken)
                  .then(res => {
                      if (!res.success && res.message === "Token expired") {
                          setGoogleAccessToken(null);
                          localStorage.removeItem('google_drive_token');
                      }
                  })
                  .catch(err => console.error("Sync failed", err));
          }, 5000); 
          return () => clearTimeout(timeout);
      }
  }, [history, isAutoSaveEnabled, googleAccessToken]);

  const handleToggleAutoSave = (enabled: boolean) => {
      setIsAutoSaveEnabled(enabled);
      localStorage.setItem('autosave_history', String(enabled));
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setSessionUser(null);
      setView('landing');
      setActiveTab('home');
      setSearchState({
          status: 'idle',
          query: '',
          summary: '',
          sources: [],
          media: [],
      });
      // Clear tokens
      setNotionToken(null);
      setGoogleAccessToken(null);
      localStorage.clear(); 
      window.history.pushState({}, '', '/');
  };

  const saveReturnTab = () => localStorage.setItem('return_tab', activeTab);

  const initiateNotionLogin = async () => {
      saveReturnTab();
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
  const initiateGoogleLogin = async () => {
      saveReturnTab();
      localStorage.setItem('connecting_provider', 'google');
      try {
          const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin, scopes: 'https://www.googleapis.com/auth/drive.file', queryParams: { access_type: 'offline', prompt: 'consent' } }
          });
          if (error) throw error;
      } catch (e) {
          setGoogleAccessToken("mock-google-token-demo");
          setConnectedProvider('google');
          setView('success');
          localStorage.removeItem('connecting_provider');
      }
  };
  
  const handleSuccessContinue = () => { 
      const returnTab = localStorage.getItem('return_tab');
      setView('app'); 
      if (returnTab) {
          setActiveTab(returnTab as any);
          localStorage.removeItem('return_tab');
      } else {
          setActiveTab('settings');
      }
  };

  const handleModeChange = (mode: 'web' | 'notion' | 'bible') => {
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

  const handleRemoveFile = () => setAttachedFile(null);

  // --- COLLECTIONS LOGIC ---
  const handleSaveToCollections = (item: any) => {
      const newItem: CollectionItem = {
          id: Date.now().toString(),
          type: item.type,
          content: item.content,
          dateAdded: Date.now()
      };
      setCollections(prev => [newItem, ...prev]);
  };

  const handleRemoveFromCollections = (id: string) => {
      setCollections(prev => prev.filter(item => item.id !== id));
  };

  // --- SEARCH LOGIC ---
  const performSearch = async (query: string, mode: 'web' | 'notion' | 'bible') => {
     try {
      if (mode === 'notion') {
          if (!notionToken) return setShowNotionModal(true);
          const pages = await searchNotion(query, notionToken);
          setSearchState({ status: 'results', query, summary: `Found ${pages.length} pages in Notion.`, sources: [], media: pages });
          addToHistory({ type: 'search', title: `Notion: ${query}`, summary: `Workspace search for ${query}`, sources: [] });
      } else if (mode === 'bible') {
          const preferredVersion = localStorage.getItem('bible_version') || 'kjv';
          const preferredLang = (localStorage.getItem('bible_lang') as 'en' | 'es') || 'en';
          const bibleData = await fetchBiblePassage(query, preferredVersion, preferredLang);
          if (bibleData) {
              setSearchState({ status: 'results', query, summary: `Passage from ${bibleData.reference}`, sources: [], media: [{ id: bibleData.reference, type: 'bible', thumbnailUrl: '', contentUrl: '', pageUrl: '', title: bibleData.reference, source: bibleData.translation_id, data: bibleData }] });
              addToHistory({ type: 'search', title: `Scripture: ${bibleData.reference}`, summary: bibleData.text.substring(0, 100) + '...', sources: [] });
          } else {
             setSearchState(prev => ({ ...prev, status: 'results', media: [], summary: "No results found." }));
          }
      } else {
          // Web Search
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
          setMediaType('image');
          setAttachedFile(null);

          // Voice Synthesis (Jarvis Mode)
          if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(aiData.text);
              utterance.pitch = 1;
              utterance.rate = 1.1;
              window.speechSynthesis.speak(utterance);
          }
      }
    } catch (error) {
      console.error(error);
      setSearchState(prev => ({ ...prev, status: 'idle', error: 'Something went wrong. Please try again.' }));
    }
  };

  const handleSearch = async (query: string, mode: 'web' | 'notion' | 'bible') => {
    // If Deep Search is enabled for Web, show Thinking UI first
    if (mode === 'web' && isDeepSearchEnabled) {
        setSearchState(prev => ({ ...prev, status: 'thinking', query, isDeepSearch: true }));
        // Logic continues in onDeepSearchComplete
    } else {
        setSearchState(prev => ({ ...prev, status: 'searching', query, isDeepSearch: false }));
        setActiveTab('home');
        performSearch(query, mode);
    }
  };

  const handleDeepSearchComplete = () => {
      // Logic after animation finishes
      performSearch(searchState.query, 'web');
  };

  // ... (Keep existing handleMediaSearch, handleReset, etc.)
  const handleMediaSearch = async (query: string, type: 'image' | 'video') => {
      setMediaGridData({ items: [], loading: true });
      setMediaType(type);
      setActiveTab('images');
      let results: MediaItem[] = [];
      try {
        if (type === 'image') {
          const [pixabay, pexels, nasa] = await Promise.all([fetchPixabayImages(query, 10), fetchPexelsImages(query, 10), fetchNasaImages(query)]);
          results = interleaveResults([pixabay, pexels, nasa]);
        } else {
          const [pixabayVids, pexelsVids] = await Promise.all([fetchPixabayVideos(query, 8), fetchPexelsVideos(query, 8)]);
          results = interleaveResults([pixabayVids, pexelsVids]);
        }
      } catch (e) { console.error("Media search failed", e); }
      setMediaGridData({ items: results, loading: false });
      addToHistory({ type: 'search', title: `${type === 'image' ? 'Images' : 'Videos'}: ${query}`, summary: `Visual discovery for "${query}"` });
  };

  const handleReset = () => {
    setActiveTab('home');
    setSearchState({ status: 'idle', query: '', summary: '', sources: [], media: [] });
    setSearchMode('web');
    setAttachedFile(null);
    window.speechSynthesis.cancel();
    window.history.pushState({}, '', '/');
  };

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    if (tab === 'images' && mediaGridData.items.length === 0 && searchState.query && searchMode === 'web') {
         handleMediaSearch(searchState.query, mediaType);
    }
  };

  const handleOpenArticle = (article: NewsArticle) => {
      setCurrentArticle(article);
      setActiveTab('article');
      addToHistory({ type: 'article', title: article.title, subtitle: article.source.name, data: article });
  };

  const handleSummarizeArticle = (url: string) => {
      const query = `Summarize this article: ${url}`;
      setSearchMode('web');
      handleSearch(query, 'web');
  };

  const handleHistorySelect = (item: HistoryItem) => {
      // ... same as before
      if (item.type === 'search') {
          if (item.title.startsWith("Notion: ")) { setSearchMode('notion'); handleSearch(item.title.replace("Notion: ", ""), 'notion'); }
          else if (item.title.startsWith("Scripture: ")) { setSearchMode('bible'); handleSearch(item.title.replace("Scripture: ", ""), 'bible'); }
          else { setSearchMode('web'); handleSearch(item.title, 'web'); }
      } else if (item.type === 'article' && item.data) { setCurrentArticle(item.data); setActiveTab('article'); }
  };

  const handleViewDailyBrief = () => {
      setDiscoverViewTab('brief');
      setActiveTab('discover');
  };

  // PURE BLACK BACKGROUND
  const bgStyle = () => {
     return { backgroundColor: '#000000', backgroundImage: 'none' };
  };

  if (view === 'assets') return <AssetsPage onBack={() => setView('landing')} />;
  if (view === 'success') return <SuccessPage provider={connectedProvider} onContinue={handleSuccessContinue} />;
  if (view === 'landing') return <div className="h-screen w-full overflow-y-auto bg-black"><MarketingPage onGetStarted={() => setView('login')} onViewAssets={() => setView('assets')} /></div>;
  if (view === 'login' && !sessionUser) {
      if (isAuthChecking) return <div className="h-screen w-full bg-black flex items-center justify-center"><LoadingAnimation/></div>;
      return <div className="h-screen w-full bg-black"><LoginPage onSkip={() => { setSessionUser({ id: 'demo-user', email: 'demo@infinity.ai', app_metadata: {}, user_metadata: { full_name: 'Demo User' }, aud: 'authenticated', created_at: '' } as User); setView('app'); }} /></div>;
  }

  // Greeting Variables
  const userName = sessionUser?.user_metadata?.full_name?.split(' ')[0] || "there";
  const temp = weather?.temperature ? Math.round(weather.temperature) : '--';
  const condition = weather?.weathercode !== undefined ? getWeatherDescription(weather.weathercode) : 'clear';
  const city = weather?.city || "your location";

  return (
    <div className="relative h-screen w-full bg-black text-white flex overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onReset={handleReset} />

      <main className="flex-1 m-3 ml-24 h-[calc(100vh-1.5rem)] relative rounded-[40px] overflow-hidden shadow-2xl flex flex-col z-10 transition-all duration-500 border border-white/10" style={bgStyle()}>
        
        {/* Quick Access Bar - Absolute Top Right */}
        {activeTab === 'home' && searchState.status === 'idle' && (
            <div className="absolute top-6 right-8 z-50">
                <QuickAccessBar />
            </div>
        )}

        <div className={`h-20 flex items-center justify-between pointer-events-none relative z-20 px-8 pt-4 shrink-0 ${activeTab === 'settings' ? 'hidden' : ''}`}>
            <div className="pointer-events-auto">
                {activeTab === 'home' && (searchState.status === 'results' || searchState.status === 'thinking') && (
                    <div onClick={handleReset} className="cursor-pointer group flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full group-hover:scale-150 transition-transform bg-white`}/>
                        <span className={`font-medium tracking-wide group-hover:opacity-100 opacity-80 text-white`}>Back to Search</span>
                    </div>
                )}
            </div>
            {!(activeTab === 'home' && searchState.status === 'idle') && (
                <div className={`font-bold tracking-tight text-xl opacity-80 flex items-center gap-2 text-white`}>
                    Infinity 2.0
                    {searchState.isDeepSearch && <span className="text-purple-300 text-xs uppercase tracking-widest border border-purple-500 px-1 rounded animate-pulse">Deep Think</span>}
                </div>
            )}
        </div>

        <div className={`flex-1 flex flex-col relative z-20 transition-all w-full ${activeTab === 'images' || activeTab === 'settings' ? 'overflow-hidden' : 'overflow-y-auto glass-scroll px-4 md:px-8 pb-8'}`}>
            
            {activeTab === 'home' && (
              <>
                <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${searchState.status === 'idle' ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    
                    {/* Home Content */}
                    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mb-20 animate-slideUp">
                        {/* Logo */}
                        <img 
                            src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" 
                            alt="Infinity Logo" 
                            className="w-24 h-24 mb-4 rounded-3xl shadow-2xl" 
                        />
                        
                        {/* Search Input */}
                        <div className="w-full">
                            <SearchInput 
                                onSearch={handleSearch} 
                                isSearching={searchState.status === 'searching' || searchState.status === 'thinking'} 
                                centered={true}
                                activeMode={searchMode}
                                onModeChange={handleModeChange}
                                onFileSelect={handleFileSelect}
                                attachedFile={attachedFile}
                                onRemoveFile={handleRemoveFile}
                                isDeepSearchEnabled={isDeepSearchEnabled}
                                onToggleDeepSearch={setIsDeepSearchEnabled}
                            />
                        </div>

                        {/* Greeting & Brief Link */}
                        <div className="text-center space-y-3 mt-4">
                            <p className="text-xl text-zinc-400 font-light">
                                Hi, {userName}. Today, there will be <span className="text-white font-medium">{temp}°C</span> and <span className="text-white font-medium">{condition}</span> in {city}.
                            </p>
                            <button 
                                onClick={handleViewDailyBrief}
                                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors mx-auto group"
                            >
                                See your daily briefing <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                </div>

                {searchState.status === 'searching' && <div className="absolute inset-0 flex items-center justify-center"><LoadingAnimation /></div>}
                
                {searchState.status === 'thinking' && (
                     <AgenticProcessView query={searchState.query} onComplete={handleDeepSearchComplete} />
                )}

                {searchState.status === 'results' && (
                    <div className="w-full h-full pt-4">
                        {searchMode === 'notion' ? (
                            <NotionResultsView items={searchState.media} query={searchState.query} />
                        ) : searchMode === 'bible' ? (
                            <BibleResultsView items={searchState.media} query={searchState.query} />
                        ) : (
                            <>
                                <div className="max-w-4xl mx-auto mb-6">
                                    <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">{searchState.query}</h2>
                                </div>
                                <ResultsView 
                                    summary={searchState.summary} 
                                    sources={searchState.sources} 
                                    images={searchState.media} 
                                    onOpenImageGrid={() => handleMediaSearch(searchState.query, 'image')}
                                    onSave={handleSaveToCollections}
                                />
                            </>
                        )}
                    </div>
                )}
              </>
            )}

            {activeTab === 'discover' && <div className="w-full h-full pt-4"><DiscoverView onOpenArticle={handleOpenArticle} onSummarize={handleSummarizeArticle} initialTab={discoverViewTab} /></div>}
            {activeTab === 'collections' && <div className="w-full h-full pt-4"><CollectionsView items={collections} onRemove={handleRemoveFromCollections}/></div>}
            {activeTab === 'images' && <div className="w-full h-full"><ImageGridView items={mediaGridData.items} onSearch={handleMediaSearch} loading={mediaGridData.loading} activeMediaType={mediaType} onMediaTypeChange={setMediaType} /></div>}
            {activeTab === 'article' && currentArticle && <div className="w-full h-full pt-4"><ArticleDetailView article={currentArticle} onBack={() => setActiveTab('discover')} onSummarize={handleSummarizeArticle}/></div>}
            {activeTab === 'history' && <div className="w-full h-full pt-4"><HistoryView history={history} onSelectItem={handleHistorySelect}/></div>}
            {activeTab === 'settings' && (
                <div className="w-full h-full">
                    <SettingsView 
                        isNotionConnected={!!notionToken} isGoogleDriveConnected={!!googleAccessToken}
                        onConnectNotion={initiateNotionLogin} onConnectGoogleDrive={initiateGoogleLogin}
                        isAutoSaveEnabled={isAutoSaveEnabled} onToggleAutoSave={handleToggleAutoSave}
                        currentWallpaper={currentWallpaper} onWallpaperChange={setCurrentWallpaper}
                        user={sessionUser} onLogout={handleLogout}
                    />
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;