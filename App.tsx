import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SearchInput from './components/SearchInput';
import ResultsView from './components/ResultsView';
import DiscoverView from './components/DiscoverView';
import ArticleDetailView from './components/ArticleDetailView';
import HistoryView from './components/HistoryView';
import ImageGridView from './components/ImageGridView';
import LoadingAnimation from './components/LoadingAnimation';
import DashboardWidgets from './components/DashboardWidgets'; // Import new widgets
import { searchWithGemini } from './services/geminiService';
import { fetchImages as fetchPixabayImages, fetchPixabayVideos } from './services/pixabayService';
import { fetchPexelsImages, fetchPexelsVideos } from './services/pexelsService';
import { fetchNasaImages } from './services/nasaService';
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

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
      const newItem: HistoryItem = {
          ...item,
          id: Date.now().toString(),
          timestamp: new Date()
      };
      setHistory(prev => [newItem, ...prev]);
  };

  const handleSearch = async (query: string) => {
    setSearchState(prev => ({ 
        ...prev, 
        status: 'searching', 
        query,
    }));
    setActiveTab('home');

    try {
      // Parallel execution for speed
      const [aiData, pixabayImgs, pexelsImgs, nasaImgs] = await Promise.all([
        searchWithGemini(query),
        fetchPixabayImages(query, 4),
        fetchPexelsImages(query, 4),
        fetchNasaImages(query)
      ]);

      const combinedImages = interleaveResults([pixabayImgs, pexelsImgs, nasaImgs]);

      // Add search to history with result data
      addToHistory({
        type: 'search',
        title: query,
        summary: aiData.text,
        sources: aiData.sources
      });

      // Artificial delay for animation effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newSearchState: SearchState = {
        status: 'results',
        query,
        summary: aiData.text,
        sources: aiData.sources,
        media: combinedImages,
      };

      setSearchState(newSearchState);
      
      // Also prepopulate media grid (defaulting to images)
      setMediaGridData({ items: combinedImages, loading: false });
      setMediaType('image');
      
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
  };

  const handleTabChange = (tab: 'home' | 'discover' | 'history' | 'images') => {
    setActiveTab(tab);
    // Auto-populate image tab if we have a search query but no grid data yet
    if (tab === 'images' && mediaGridData.items.length === 0 && searchState.query) {
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
      handleSearch(query);
  };

  const handleHistorySelect = (item: HistoryItem) => {
      if (item.type === 'search') {
          // If it was an image search (heuristic check on title)
          if (item.title.startsWith("Images: ")) {
              handleMediaSearch(item.title.replace("Images: ", ""), 'image');
          } else if (item.title.startsWith("Videos: ")) {
              handleMediaSearch(item.title.replace("Videos: ", ""), 'video');
          } else {
              handleSearch(item.title); // Re-run as normal search by default
          }
      } else if (item.type === 'article' && item.data) {
          setCurrentArticle(item.data);
          setActiveTab('article');
      }
  };

  const onMediaTypeSwitch = (newType: 'image' | 'video') => {
      setMediaType(newType);
      // Strategy: If searchState.query exists, use it. Otherwise clear.
      if (searchState.query) {
          handleMediaSearch(searchState.query, newType);
      } else {
          setMediaGridData({ items: [], loading: false });
      }
  };

  return (
    <div className="relative h-screen w-full bg-[#f2f4f6] text-slate-800 flex overflow-hidden">
      
      {/* Sidebar is fixed on the white/gray background */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onReset={handleReset} />

      {/* Main Floating Content Area */}
      {/* H-Screen constraint with margins ensures strict layout sizing for internal scrolling */}
      <main className="flex-1 m-3 ml-24 h-[calc(100vh-1.5rem)] relative rounded-[40px] overflow-hidden shadow-2xl flex flex-col z-10 transition-all duration-500">
        
        {/* Dynamic Background Layer (Inside the floating card) */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-[2s] ease-in-out"
            style={{ 
            backgroundImage: activeTab === 'home' && searchState.status === 'idle' 
                ? 'none' // No background image for the initial "clean search" look
                : `url('https://i.ibb.co/MxrKTrKV/upscalemedia-transformed-4.png')`,
            backgroundColor: activeTab === 'home' && searchState.status === 'idle' 
                ? '#ffffff' // White background for clean search
                : '#000000', // Black fallback
            transform: searchState.status === 'idle' && activeTab === 'home' ? 'scale(1)' : 'scale(1.05)' 
            }}
        >
            {/* Overlay */}
            <div className={`absolute inset-0 transition-all duration-1000 ${
                activeTab === 'home' && searchState.status === 'idle' 
                ? 'bg-transparent' 
                : 'bg-black/40 backdrop-blur-sm' // Darken background for content readability
            }`} />
        </div>

        {/* Header/Logo Area (Inside Floating Card) */}
        <div className="h-20 flex items-center justify-between pointer-events-none relative z-20 px-8 pt-4 shrink-0">
            {/* Back button logic for Search Results */}
            <div className="pointer-events-auto">
                {activeTab === 'home' && searchState.status === 'results' && (
                    <div onClick={handleReset} className="cursor-pointer group flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white group-hover:scale-150 transition-transform"/>
                        <span className="text-white/80 font-medium tracking-wide group-hover:text-white">Back to Search</span>
                    </div>
                )}
            </div>
            
            {/* Show Logo only when NOT in clean search mode (because search mode has large text) */}
            {!(activeTab === 'home' && searchState.status === 'idle') && (
                <div className="text-white font-bold tracking-tight text-xl opacity-80">Lumina</div>
            )}
        </div>

        {/* Content Container (Inside Floating Card) */}
        {/* Key Fix: Ensure flex-1 and accurate overflow handling */}
        <div className={`flex-1 flex flex-col relative z-20 transition-all w-full ${
            activeTab === 'images' 
            ? 'overflow-hidden' // Disable parent scroll for images tab, it handles its own
            : 'overflow-y-auto glass-scroll px-4 md:px-8 pb-8' // Enable parent scroll for others
        }`}>
            
            {/* HOME TAB CONTENT */}
            {activeTab === 'home' && (
              <>
                {/* Center View: Input */}
                <div className={`flex-1 flex flex-col justify-center transition-all duration-500 ${searchState.status === 'idle' ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    <SearchInput 
                        onSearch={handleSearch} 
                        isSearching={searchState.status === 'searching'} 
                        centered={true}
                    />
                    
                    {/* NEW: Dashboard Widgets placed directly below search bar on Home screen */}
                    <div className="w-full animate-fadeIn delay-300">
                       <DashboardWidgets />
                    </div>
                </div>

                {/* Searching View */}
                {searchState.status === 'searching' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingAnimation />
                    </div>
                )}

                {/* Results View */}
                {searchState.status === 'results' && (
                    <div className="w-full h-full pt-4">
                        <div className="max-w-4xl mx-auto mb-8">
                            <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2 flex items-center gap-3">
                                {searchState.query}
                            </h2>
                        </div>
                        <ResultsView 
                            summary={searchState.summary} 
                            sources={searchState.sources} 
                            images={searchState.media} 
                            onOpenImageGrid={() => {
                                handleMediaSearch(searchState.query, 'image');
                            }}
                        />
                    </div>
                )}
              </>
            )}

            {/* DISCOVER TAB CONTENT */}
            {activeTab === 'discover' && (
              <div className="w-full h-full pt-4">
                <DiscoverView 
                    onOpenArticle={handleOpenArticle} 
                    onSummarize={handleSummarizeArticle}
                />
              </div>
            )}

            {/* MEDIA (IMAGES/VIDEOS) TAB CONTENT */}
            {activeTab === 'images' && (
                <div className="w-full h-full">
                    <ImageGridView 
                        items={mediaGridData.items}
                        onSearch={handleMediaSearch}
                        loading={mediaGridData.loading}
                        activeMediaType={mediaType}
                        onMediaTypeChange={onMediaTypeSwitch}
                    />
                </div>
            )}

            {/* ARTICLE READER CONTENT */}
            {activeTab === 'article' && currentArticle && (
                <div className="w-full h-full pt-4">
                    <ArticleDetailView 
                        article={currentArticle} 
                        onBack={() => setActiveTab('discover')} 
                        onSummarize={handleSummarizeArticle}
                    />
                </div>
            )}

            {/* HISTORY TAB CONTENT */}
            {activeTab === 'history' && (
                <div className="w-full h-full pt-4">
                    <HistoryView 
                        history={history} 
                        onSelectItem={handleHistorySelect}
                    />
                </div>
            )}

        </div>
      </main>

    </div>
  );
};

export default App;