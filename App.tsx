
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchInput from './components/SearchInput';
import ResultsView from './components/ResultsView';
import DiscoverView from './components/DiscoverView';
import ArticleDetailView from './components/ArticleDetailView';
import HistoryView from './components/HistoryView';
import ImageGridView from './components/ImageGridView';
import LoadingAnimation from './components/LoadingAnimation';
import DashboardWidgets from './components/DashboardWidgets'; 
import ConnectSpotifyModal from './components/ConnectSpotifyModal';
import ConnectNotionModal from './components/ConnectNotionModal';
import ConnectFigmaModal from './components/ConnectFigmaModal';
import SpotifyResultsView from './components/SpotifyResultsView';
import NotionResultsView from './components/NotionResultsView';
import BibleResultsView from './components/BibleResultsView';
import SettingsView from './components/SettingsView';
import MarketingPage from './components/MarketingPage';
import LoginPage from './components/LoginPage';
import AssetsPage from './components/AssetsPage';
import { searchWithGemini } from './services/geminiService';
import { fetchImages as fetchPixabayImages, fetchPixabayVideos } from './services/pixabayService';
import { fetchPexelsImages, fetchPexelsVideos } from './services/pexelsService';
import { fetchNasaImages } from './services/nasaService';
import { supabase } from './services/supabaseClient';
import { searchSpotify } from './services/spotifyService';
import { searchNotion } from './services/notionService';
import { fetchBiblePassage } from './services/bibleService';
import { SearchState, HistoryItem, NewsArticle, MediaItem } from './types';
import { User } from '@supabase/supabase-js';

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
  const [view, setView] = useState<'landing' | 'login' | 'app' | 'assets'>('landing');
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'history' | 'article' | 'images' | 'settings'>('home');
  
  // Appearance
  const [currentWallpaper, setCurrentWallpaper] = useState<string | null>(null);

  // Search State
  const [searchState, setSearchState] = useState<SearchState>({
    status: 'idle',
    query: '',
    summary: '',
    sources: [],
    media: [],
  });

  // Search Mode
  const [searchMode, setSearchMode] = useState<'web' | 'spotify' | 'notion' | 'bible'>('web');

  // File Upload State
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);

  // Auth State (Legacy/Direct Connections)
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);
  
  const [notionToken, setNotionToken] = useState<string | null>(null);
  const [showNotionModal, setShowNotionModal] = useState(false);

  const [isFigmaConnected, setIsFigmaConnected] = useState(false);
  const [showFigmaModal, setShowFigmaModal] = useState(false);

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

  // Init Session Check
  useEffect(() => {
    const checkSession = async () => {
        setIsAuthChecking(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            setSessionUser(session.user);
            if (session.provider_token) {
               if (session.user.app_metadata.provider === 'spotify') setSpotifyToken(session.provider_token);
               if (session.user.app_metadata.provider === 'notion') setNotionToken(session.provider_token);
            }
            setView('app');
        } else {
            // Keep default view as landing
        }
        setIsAuthChecking(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSessionUser(session?.user || null);
        if (session && session.provider_token) {
           if (session.user.app_metadata.provider === 'spotify') setSpotifyToken(session.provider_token);
           if (session.user.app_metadata.provider === 'notion') setNotionToken(session.provider_token);
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  const initiateSpotifyLogin = async () => {
      try {
          const { error } = await supabase.auth.signInWithOAuth({
              provider: 'spotify',
              options: {
                  scopes: 'user-read-email user-top-read user-library-read streaming',
                  redirectTo: window.location.origin,
              }
          });
          
          if (error) throw error;
      } catch (e) {
          console.warn("Spotify Auth flow encountered an issue (likely Redirect URL config). Activating Demo Mode.");
          // Fallback for demo: Simulate successful connection
          setSpotifyToken("mock-spotify-token-demo");
          setShowSpotifyModal(false);
      }
  };

  const initiateNotionLogin = async () => {
      try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'notion',
            options: {
                redirectTo: window.location.origin
            }
          });
          if (error) throw error;
      } catch (e) {
          console.warn("Notion Auth flow encountered an issue. Activating Demo Mode.");
          // Fallback for demo
          setNotionToken('mock-notion-token-demo');
          setShowNotionModal(false);
      }
  };

  const initiateFigmaConnection = () => {
      // Figma usually requires custom Enterprise Auth in Supabase or manual OAuth flow.
      // For this app, we simulate the connection immediately.
      setTimeout(() => {
        setIsFigmaConnected(true);
        setShowFigmaModal(false);
      }, 500);
  };

  const handleModeChange = (mode: 'web' | 'spotify' | 'notion' | 'bible') => {
      if (mode === 'spotify' && !spotifyToken) {
          setShowSpotifyModal(true);
      } else if (mode === 'notion' && !notionToken) {
          setShowNotionModal(true);
      } else {
          setSearchMode(mode);
      }
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
      const newItem: HistoryItem = {
          ...item,
          id: Date.now().toString(),
          timestamp: new Date()
      };
      setHistory(prev => [newItem, ...prev]);
  };

  const handleFileSelect = (file: File) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
          const content = e.target?.result as string;
          let type: 'image' | 'text' | 'pdf' = 'text';
          
          if (file.type.startsWith('image/')) {
              type = 'image';
          } else if (file.type === 'application/pdf') {
              type = 'pdf';
          }

          let rawData = content;
          if (type === 'image' || type === 'pdf') {
              rawData = content.split(',')[1];
          }

          setAttachedFile({
              name: file.name,
              type,
              content: rawData,
              mimeType: file.type
          });
      };

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
          reader.readAsDataURL(file);
      } else {
          reader.readAsText(file);
      }
  };

  const handleRemoveFile = () => {
      setAttachedFile(null);
  };

  const handleSearch = async (query: string, mode: 'web' | 'spotify' | 'notion' | 'bible') => {
    setSearchState(prev => ({ 
        ...prev, 
        status: 'searching', 
        query,
    }));
    setActiveTab('home');

    try {
      if (mode === 'spotify') {
          if (!spotifyToken) {
              setSearchState(prev => ({ ...prev, status: 'idle', error: "Not authenticated with Spotify" }));
              setShowSpotifyModal(true);
              return;
          }

          const tracks = await searchSpotify(query, spotifyToken);
          await new Promise(resolve => setTimeout(resolve, 800)); 

          setSearchState({
              status: 'results',
              query,
              summary: `Found top tracks for "${query}" on Spotify.`,
              sources: [],
              media: tracks
          });
          
          addToHistory({
              type: 'search',
              title: `Spotify: ${query}`,
              summary: `Music search results for ${query}`,
              sources: []
          });

      } else if (mode === 'notion') {
          if (!notionToken) {
              setSearchState(prev => ({ ...prev, status: 'idle', error: "Not authenticated with Notion" }));
              setShowNotionModal(true);
              return;
          }

          const pages = await searchNotion(query, notionToken);
          
          setSearchState({
              status: 'results',
              query,
              summary: `Found ${pages.length} pages in Notion.`,
              sources: [],
              media: pages
          });

          addToHistory({
              type: 'search',
              title: `Notion: ${query}`,
              summary: `Workspace search for ${query}`,
              sources: []
          });

      } else if (mode === 'bible') {
          // Bible Search
          const preferredVersion = localStorage.getItem('bible_version') || 'kjv';
          const bibleData = await fetchBiblePassage(query, preferredVersion);

          if (bibleData) {
              setSearchState({
                  status: 'results',
                  query,
                  summary: `Passage from ${bibleData.reference}`,
                  sources: [],
                  media: [{
                      id: bibleData.reference,
                      type: 'bible',
                      thumbnailUrl: '',
                      contentUrl: '',
                      pageUrl: '',
                      title: bibleData.reference,
                      source: bibleData.translation_id,
                      data: bibleData
                  }]
              });

              addToHistory({
                  type: 'search',
                  title: `Scripture: ${bibleData.reference}`,
                  summary: bibleData.text.substring(0, 100) + '...',
                  sources: []
              });
          } else {
             setSearchState(prev => ({ 
                 ...prev, 
                 status: 'results', 
                 media: [], // Empty media signals no results found
                 summary: "No results found." 
             }));
          }

      } else {
          // Standard Web Search (with optional file context)
          const fileContext = attachedFile ? {
              content: attachedFile.content,
              mimeType: attachedFile.mimeType
          } : undefined;

          const [aiData, pixabayImgs, pexelsImgs, nasaImgs] = await Promise.all([
            searchWithGemini(query, fileContext),
            fetchPixabayImages(query, 4),
            fetchPexelsImages(query, 4),
            fetchNasaImages(query)
          ]);
    
          const combinedImages = interleaveResults([pixabayImgs, pexelsImgs, nasaImgs]);
    
          addToHistory({
            type: 'search',
            title: query,
            summary: aiData.text,
            sources: aiData.sources
          });
    
          await new Promise(resolve => setTimeout(resolve, 1500));
    
          const newSearchState: SearchState = {
            status: 'results',
            query,
            summary: aiData.text,
            sources: aiData.sources,
            media: combinedImages,
          };
    
          setSearchState(newSearchState);
          setMediaGridData({ items: combinedImages, loading: false });
          setMediaType('image');
          
          // Clear file after search
          setAttachedFile(null);
      }
      
    } catch (error) {
      console.error(error);
      setSearchState(prev => ({ 
        ...prev, 
        status: 'idle', 
        error: 'Something went wrong. Please try again.' 
      }));
    }
  };

  const handleMediaSearch = async (query: string, type: 'image' | 'video') => {
      setMediaGridData({ items: [], loading: true });
      setMediaType(type);
      setActiveTab('images');
      
      let results: MediaItem[] = [];

      try {
        if (type === 'image') {
          const [pixabay, pexels, nasa] = await Promise.all([
             fetchPixabayImages(query, 10),
             fetchPexelsImages(query, 10),
             fetchNasaImages(query)
          ]);
          results = interleaveResults([pixabay, pexels, nasa]);
        } else {
          const [pixabayVids, pexelsVids] = await Promise.all([
              fetchPixabayVideos(query, 8),
              fetchPexelsVideos(query, 8)
          ]);
          results = interleaveResults([pixabayVids, pexelsVids]);
        }
      } catch (e) {
        console.error("Media search failed", e);
      }
      
      setMediaGridData({ items: results, loading: false });

      addToHistory({
          type: 'search',
          title: `${type === 'image' ? 'Images' : 'Videos'}: ${query}`,
          summary: `Visual discovery for "${query}"`
      });
  };

  const handleReset = () => {
    setActiveTab('home');
    setSearchState({
      status: 'idle',
      query: '',
      summary: '',
      sources: [],
      media: [],
    });
    setSearchMode('web');
    setAttachedFile(null);
  };

  const handleTabChange = (tab: 'home' | 'discover' | 'history' | 'images' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'images' && mediaGridData.items.length === 0 && searchState.query && searchMode === 'web') {
         handleMediaSearch(searchState.query, mediaType);
    }
  };

  const handleOpenArticle = (article: NewsArticle) => {
      setCurrentArticle(article);
      setActiveTab('article');
      addToHistory({
          type: 'article',
          title: article.title,
          subtitle: article.source.name,
          data: article
      });
  };

  const handleSummarizeArticle = (url: string) => {
      const query = `Summarize this article: ${url}`;
      setSearchMode('web');
      handleSearch(query, 'web');
  };

  const handleHistorySelect = (item: HistoryItem) => {
      if (item.type === 'search') {
          if (item.title.startsWith("Spotify: ")) {
             setSearchMode('spotify');
             handleSearch(item.title.replace("Spotify: ", ""), 'spotify');
          } else if (item.title.startsWith("Notion: ")) {
              setSearchMode('notion');
              handleSearch(item.title.replace("Notion: ", ""), 'notion');
          } else if (item.title.startsWith("Scripture: ")) {
              setSearchMode('bible');
              handleSearch(item.title.replace("Scripture: ", ""), 'bible');
          } else if (item.title.startsWith("Images: ")) {
              handleMediaSearch(item.title.replace("Images: ", ""), 'image');
          } else if (item.title.startsWith("Videos: ")) {
              handleMediaSearch(item.title.replace("Videos: ", ""), 'video');
          } else {
              setSearchMode('web');
              handleSearch(item.title, 'web');
          }
      } else if (item.type === 'article' && item.data) {
          setCurrentArticle(item.data);
          setActiveTab('article');
      }
  };

  const onMediaTypeSwitch = (newType: 'image' | 'video') => {
      setMediaType(newType);
      if (searchState.query) {
          handleMediaSearch(searchState.query, newType);
      } else {
          setMediaGridData({ items: [], loading: false });
      }
  };

  // --- BACKGROUND LOGIC ---
  const getBackgroundStyle = () => {
      if (activeTab === 'settings' || searchMode === 'notion' || searchMode === 'bible') {
          return {
              backgroundImage: 'none',
              backgroundColor: '#000000' // Dark background for settings
          };
      }
      
      if (activeTab === 'home') {
          if (currentWallpaper) {
              return {
                  backgroundImage: `url('${currentWallpaper}')`,
                  backgroundColor: '#000000',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
              };
          }

          if (searchState.status === 'idle') {
              return {
                  backgroundImage: 'none',
                  backgroundColor: '#000000'
              };
          }
      }

      if (searchMode === 'spotify') {
          return {
              backgroundImage: `url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000&auto=format&fit=crop')`,
              backgroundColor: '#000000'
          };
      }

      return {
          backgroundImage: `url('https://i.ibb.co/MxrKTrKV/upscalemedia-transformed-4.png')`,
          backgroundColor: '#000000'
      };
  };

  const bgStyle = getBackgroundStyle();

  // --- VIEW ROUTING ---
  
  if (view === 'assets') {
      return <AssetsPage onBack={() => setView('landing')} />;
  }

  if (view === 'landing') {
      return (
        <div className="h-screen w-full overflow-y-auto bg-black">
             <MarketingPage 
                onGetStarted={() => setView('login')} 
                onViewAssets={() => setView('assets')}
             />
        </div>
      );
  }

  if (view === 'login' && !sessionUser) {
      if (isAuthChecking) return <div className="h-screen w-full bg-black flex items-center justify-center"><LoadingAnimation/></div>;
      
      return (
        <div className="h-screen w-full bg-black">
            <LoginPage onSkip={() => {
                // Demo fallback user
                setSessionUser({ 
                    id: 'demo-user', 
                    email: 'demo@infinity.ai',
                    app_metadata: {}, 
                    user_metadata: { full_name: 'Demo User' }, 
                    aud: 'authenticated', 
                    created_at: '' 
                } as User);
                setView('app');
            }} />
        </div>
      );
  }

  return (
    <div className="relative h-screen w-full bg-black text-white flex overflow-hidden">
      
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onReset={handleReset} 
      />

      <main className="flex-1 m-3 ml-24 h-[calc(100vh-1.5rem)] relative rounded-[40px] overflow-hidden shadow-2xl flex flex-col z-10 transition-all duration-500 border border-white/10">
        
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-[2s] ease-in-out"
            style={{ 
                ...bgStyle,
                transform: searchState.status === 'idle' && activeTab === 'home' ? 'scale(1)' : 'scale(1.05)' 
            }}
        >
            <div className={`absolute inset-0 transition-all duration-1000 ${
                (activeTab === 'home' && searchState.status === 'idle' && !currentWallpaper) || activeTab === 'settings' || searchMode === 'notion' || searchMode === 'bible'
                ? 'bg-transparent' 
                : 'bg-black/40 backdrop-blur-sm' 
            }`} />
        </div>

        <div className={`h-20 flex items-center justify-between pointer-events-none relative z-20 px-8 pt-4 shrink-0 ${activeTab === 'settings' ? 'hidden' : ''}`}>
            <div className="pointer-events-auto">
                {activeTab === 'home' && searchState.status === 'results' && (
                    <div onClick={handleReset} className="cursor-pointer group flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full group-hover:scale-150 transition-transform bg-white`}/>
                        <span className={`font-medium tracking-wide group-hover:opacity-100 opacity-80 text-white`}>Back to Search</span>
                    </div>
                )}
            </div>
            
            {!(activeTab === 'home' && searchState.status === 'idle') && (
                <div className={`font-bold tracking-tight text-xl opacity-80 flex items-center gap-2 text-white`}>
                    Infinity
                    {searchMode === 'spotify' && <span className="text-[#1DB954] text-xs uppercase tracking-widest border border-[#1DB954] px-1 rounded">Music</span>}
                    {searchMode === 'notion' && <span className="text-white text-xs uppercase tracking-widest border border-white px-1 rounded">Workspace</span>}
                    {searchMode === 'bible' && <span className="text-[#e8dccb] text-xs uppercase tracking-widest border border-[#e8dccb] px-1 rounded">Scripture</span>}
                </div>
            )}
        </div>

        <div className={`flex-1 flex flex-col relative z-20 transition-all w-full ${
            activeTab === 'images' || activeTab === 'settings'
            ? 'overflow-hidden' 
            : 'overflow-y-auto glass-scroll px-4 md:px-8 pb-8' 
        }`}>
            
            {activeTab === 'home' && (
              <>
                <div className={`flex-1 flex flex-col justify-center transition-all duration-500 ${searchState.status === 'idle' ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    <SearchInput 
                        onSearch={handleSearch} 
                        isSearching={searchState.status === 'searching'} 
                        centered={true}
                        activeMode={searchMode}
                        onModeChange={handleModeChange}
                        onFileSelect={handleFileSelect}
                        attachedFile={attachedFile}
                        onRemoveFile={handleRemoveFile}
                    />
                    
                    {searchMode === 'web' && (
                        <div className="w-full animate-fadeIn delay-300">
                           <DashboardWidgets />
                        </div>
                    )}
                </div>

                {searchState.status === 'searching' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingAnimation />
                    </div>
                )}

                {searchState.status === 'results' && (
                    <div className="w-full h-full pt-4">
                        {searchMode === 'spotify' ? (
                            <>
                                <div className="max-w-6xl mx-auto mb-6 px-4">
                                     <h2 className="text-3xl font-bold text-white flex items-center gap-3">{searchState.query}</h2>
                                </div>
                                <SpotifyResultsView items={searchState.media} query={searchState.query} />
                            </>
                        ) : searchMode === 'notion' ? (
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
                                    onOpenImageGrid={() => {
                                        handleMediaSearch(searchState.query, 'image');
                                    }}
                                />
                            </>
                        )}
                    </div>
                )}
              </>
            )}

            {activeTab === 'discover' && <div className="w-full h-full pt-4"><DiscoverView onOpenArticle={handleOpenArticle} onSummarize={handleSummarizeArticle}/></div>}
            {activeTab === 'images' && <div className="w-full h-full"><ImageGridView items={mediaGridData.items} onSearch={handleMediaSearch} loading={mediaGridData.loading} activeMediaType={mediaType} onMediaTypeChange={onMediaTypeSwitch}/></div>}
            {activeTab === 'article' && currentArticle && <div className="w-full h-full pt-4"><ArticleDetailView article={currentArticle} onBack={() => setActiveTab('discover')} onSummarize={handleSummarizeArticle}/></div>}
            {activeTab === 'history' && <div className="w-full h-full pt-4"><HistoryView history={history} onSelectItem={handleHistorySelect}/></div>}
            {activeTab === 'settings' && (
                <div className="w-full h-full">
                    <SettingsView 
                        isSpotifyConnected={!!spotifyToken} 
                        isNotionConnected={!!notionToken}
                        isFigmaConnected={isFigmaConnected}
                        onConnectNotion={() => setShowNotionModal(true)}
                        onConnectSpotify={() => setShowSpotifyModal(true)}
                        onConnectFigma={() => setShowFigmaModal(true)}
                        currentWallpaper={currentWallpaper}
                        onWallpaperChange={setCurrentWallpaper}
                        user={sessionUser}
                    />
                </div>
            )}

        </div>
      </main>

      {showSpotifyModal && (
          <ConnectSpotifyModal 
            onClose={() => setShowSpotifyModal(false)}
            onConnect={initiateSpotifyLogin}
          />
      )}
      {showNotionModal && (
          <ConnectNotionModal 
            onClose={() => setShowNotionModal(false)}
            onConnect={initiateNotionLogin}
          />
      )}
      {showFigmaModal && (
          <ConnectFigmaModal 
            onClose={() => setShowFigmaModal(false)}
            onConnect={initiateFigmaConnection}
          />
      )}

    </div>
  );
};

export default App;
