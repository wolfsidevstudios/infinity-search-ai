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
import SpotifyResultsView from './components/SpotifyResultsView';
import { searchWithGemini } from './services/geminiService';
import { fetchImages as fetchPixabayImages, fetchPixabayVideos } from './services/pixabayService';
import { fetchPexelsImages, fetchPexelsVideos } from './services/pexelsService';
import { fetchNasaImages } from './services/nasaService';
import { supabase } from './services/supabaseClient';
import { searchSpotify } from './services/spotifyService';
import { SearchState, HistoryItem, NewsArticle, MediaItem } from './types';

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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'history' | 'article' | 'images'>('home');
  
  // State for search
  const [searchState, setSearchState] = useState<SearchState>({
    status: 'idle',
    query: '',
    summary: '',
    sources: [],
    media: [],
  });

  // Search Mode
  const [searchMode, setSearchMode] = useState<'web' | 'spotify'>('web');

  // Spotify Auth State
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);

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

  // Init Spotify Session Check
  useEffect(() => {
    // Check local session/url hash for auth result
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.provider_token) {
            setSpotifyToken(session.provider_token);
        }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.provider_token) {
            setSpotifyToken(session.provider_token);
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  const initiateSpotifyLogin = async () => {
      await supabase.auth.signInWithOAuth({
          provider: 'spotify',
          options: {
              scopes: 'user-read-email user-top-read user-library-read streaming',
              redirectTo: window.location.origin
          }
      });
  };

  const handleModeChange = (mode: 'web' | 'spotify') => {
      if (mode === 'spotify' && !spotifyToken) {
          setShowSpotifyModal(true);
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

  const handleSearch = async (query: string, mode: 'web' | 'spotify') => {
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
          
          await new Promise(resolve => setTimeout(resolve, 800)); // Animation delay

          setSearchState({
              status: 'results',
              query,
              summary: `Found top tracks for "${query}" on Spotify.`,
              sources: [],
              media: tracks
          });

          // Also populate the "Images" tab (repurposed as Media gallery)
          setMediaGridData({ items: tracks, loading: false });
          
          addToHistory({
              type: 'search',
              title: `Spotify: ${query}`,
              summary: `Music search results for ${query}`,
              sources: []
          });

      } else {
          // Standard Web Search
          const [aiData, pixabayImgs, pexelsImgs, nasaImgs] = await Promise.all([
            searchWithGemini(query),
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
  };

  const handleTabChange = (tab: 'home' | 'discover' | 'history' | 'images') => {
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

  return (
    <div className="relative h-screen w-full bg-[#f2f4f6] text-slate-800 flex overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onReset={handleReset} />

      {/* Main Floating Content Area */}
      <main className="flex-1 m-3 ml-24 h-[calc(100vh-1.5rem)] relative rounded-[40px] overflow-hidden shadow-2xl flex flex-col z-10 transition-all duration-500">
        
        {/* Dynamic Background */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-[2s] ease-in-out"
            style={{ 
            backgroundImage: activeTab === 'home' && searchState.status === 'idle' 
                ? 'none' 
                : searchMode === 'spotify' 
                  ? `url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2000&auto=format&fit=crop')` // Music themed BG
                  : `url('https://i.ibb.co/MxrKTrKV/upscalemedia-transformed-4.png')`,
            backgroundColor: activeTab === 'home' && searchState.status === 'idle' 
                ? '#ffffff' 
                : '#000000', 
            transform: searchState.status === 'idle' && activeTab === 'home' ? 'scale(1)' : 'scale(1.05)' 
            }}
        >
            <div className={`absolute inset-0 transition-all duration-1000 ${
                activeTab === 'home' && searchState.status === 'idle' 
                ? 'bg-transparent' 
                : 'bg-black/40 backdrop-blur-sm' 
            }`} />
        </div>

        {/* Header */}
        <div className="h-20 flex items-center justify-between pointer-events-none relative z-20 px-8 pt-4 shrink-0">
            <div className="pointer-events-auto">
                {activeTab === 'home' && searchState.status === 'results' && (
                    <div onClick={handleReset} className="cursor-pointer group flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white group-hover:scale-150 transition-transform"/>
                        <span className="text-white/80 font-medium tracking-wide group-hover:text-white">Back to Search</span>
                    </div>
                )}
            </div>
            
            {!(activeTab === 'home' && searchState.status === 'idle') && (
                <div className="text-white font-bold tracking-tight text-xl opacity-80 flex items-center gap-2">
                    Lumina
                    {searchMode === 'spotify' && <span className="text-[#1DB954] text-xs uppercase tracking-widest border border-[#1DB954] px-1 rounded">Music</span>}
                </div>
            )}
        </div>

        {/* Content Container */}
        <div className={`flex-1 flex flex-col relative z-20 transition-all w-full ${
            activeTab === 'images' 
            ? 'overflow-hidden' 
            : 'overflow-y-auto glass-scroll px-4 md:px-8 pb-8' 
        }`}>
            
            {/* HOME TAB */}
            {activeTab === 'home' && (
              <>
                {/* Center Input View */}
                <div className={`flex-1 flex flex-col justify-center transition-all duration-500 ${searchState.status === 'idle' ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    <SearchInput 
                        onSearch={handleSearch} 
                        isSearching={searchState.status === 'searching'} 
                        centered={true}
                        activeMode={searchMode}
                        onModeChange={handleModeChange}
                    />
                    
                    {/* Hide widgets if in Spotify mode to keep focus clean, or keep them? Keeping them is standard. */}
                    {searchMode === 'web' && (
                        <div className="w-full animate-fadeIn delay-300">
                           <DashboardWidgets />
                        </div>
                    )}
                </div>

                {/* Loading */}
                {searchState.status === 'searching' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingAnimation />
                    </div>
                )}

                {/* Results */}
                {searchState.status === 'results' && (
                    <div className="w-full h-full pt-4">
                        <div className="max-w-4xl mx-auto mb-8">
                            <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2 flex items-center gap-3">
                                {searchMode === 'spotify' && <span className="text-[#1DB954]">Spotify Results:</span>}
                                {searchState.query}
                            </h2>
                        </div>
                        
                        {/* Custom Render for Spotify Results vs Web Results */}
                        {searchMode === 'spotify' ? (
                            <SpotifyResultsView items={searchState.media} query={searchState.query} />
                        ) : (
                            <ResultsView 
                                summary={searchState.summary} 
                                sources={searchState.sources} 
                                images={searchState.media} 
                                onOpenImageGrid={() => {
                                    handleMediaSearch(searchState.query, 'image');
                                }}
                            />
                        )}
                    </div>
                )}
              </>
            )}

            {activeTab === 'discover' && <div className="w-full h-full pt-4"><DiscoverView onOpenArticle={handleOpenArticle} onSummarize={handleSummarizeArticle}/></div>}
            {activeTab === 'images' && <div className="w-full h-full"><ImageGridView items={mediaGridData.items} onSearch={handleMediaSearch} loading={mediaGridData.loading} activeMediaType={mediaType} onMediaTypeChange={onMediaTypeSwitch}/></div>}
            {activeTab === 'article' && currentArticle && <div className="w-full h-full pt-4"><ArticleDetailView article={currentArticle} onBack={() => setActiveTab('discover')} onSummarize={handleSummarizeArticle}/></div>}
            {activeTab === 'history' && <div className="w-full h-full pt-4"><HistoryView history={history} onSelectItem={handleHistorySelect}/></div>}

        </div>
      </main>

      {/* Spotify Connect Modal */}
      {showSpotifyModal && (
          <ConnectSpotifyModal 
            onClose={() => setShowSpotifyModal(false)}
            onConnect={initiateSpotifyLogin}
          />
      )}

    </div>
  );
};

export default App;