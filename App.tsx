
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
import { searchTwitter } from './services/twitterService';
import { syncHistoryToDrive } from './services/googleDriveService';
import { fetchWeather, getWeatherDescription, WeatherData } from './services/weatherService';
import { SearchState, HistoryItem, NewsArticle, MediaItem, CollectionItem, ShoppingProduct, Flight } from './types';
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
  
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'history' | 'article' | 'images' | 'settings' | 'collections' | 'community' | 'recipe' | 'pricing'>('home');
  const [previousTab, setPreviousTab] = useState<'home' | 'discover' | 'history' | 'article' | 'images' | 'settings' | 'collections' | 'community' | 'recipe' | 'pricing'>('home');
  
  const [discoverViewTab, setDiscoverViewTab] = useState<'news' | 'widgets' | 'whats_new' | 'brief'>('news');
  const [initialCommunityPostId, setInitialCommunityPostId] = useState<string | null>(null);
  
  // Appearance & Settings
  const [currentWallpaper, setCurrentWallpaper] = useState<string | null>(null);
  const [weatherUnit, setWeatherUnit] = useState<'c' | 'f'>('c');
  const [isPro, setIsPro] = useState(false);

  // Search State
  const [searchState, setSearchState] = useState<SearchState>({
    status: 'idle',
    query: '',
    summary: '',
    sources: [],
    media: [],
    shopping: [],
    aiProductPicks: [],
    productImages: [],
    flights: [],
    isDeepSearch: false,
  });

  // Search Mode
  const [searchMode, setSearchMode] = useState<'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight' | 'drive' | 'code'>('web');

  // File Upload & Camera State
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Collections State
  const [collections, setCollections] = useState<CollectionItem[]>([]);

  // Auth State (Legacy/Direct Connections)
  const [notionToken, setNotionToken] = useState<string | null>(null);
  const [showNotionModal, setShowNotionModal] = useState(false);

  // Google Drive
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);

  // GitHub (Code Pilot)
  const [githubToken, setGithubToken] = useState<string | null>(null);

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

  // State for viewing details
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);

  // Weather State for Home Greeting
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // State for Recipes Search Results
  const [recipes, setRecipes] = useState<any[]>([]);

  // -- INIT & ROUTING LOGIC --
  useEffect(() => {
    const initApp = async () => {
        setIsAuthChecking(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        const proStatus = localStorage.getItem('infinity_pro_status');
        if (proStatus === 'active') setIsPro(true);

        // 1. Check for Payment Return Parameters First
        const urlParams = new URLSearchParams(window.location.search);
        const providerParam = urlParams.get('provider');
        const successParam = urlParams.get('success');

        if (providerParam === 'polar' || successParam === 'true') {
            console.log("Payment detected via URL params.");
            // Activate Pro Status
            localStorage.setItem('infinity_pro_status', 'active');
            setIsPro(true);
            setConnectedProvider('Polar Pro Plan');
            setView('success');
            // Clean URL so refresh doesn't re-trigger logic or keep ugly params
            window.history.replaceState({}, '', window.location.pathname);
            setIsAuthChecking(false);
            
            // If user was logged in, ensure session is set
            if (session) {
                setSessionUser(session.user);
                restoreTokens();
            } else {
                // Ensure a session exists if they paid anonymously (demo flow)
                setSessionUser({ id: 'pro-user', email: 'pro@infinity.ai', app_metadata: {}, user_metadata: { full_name: 'Pro User' }, aud: 'authenticated', created_at: '' } as User);
            }
            return;
        }

        // 2. Check Deep Link Path
        const path = window.location.pathname.replace('/', '');
        
        if (session) {
            setSessionUser(session.user);
            restoreTokens();
            
            // If connecting provider, we go to success page, otherwise restore path
            const connectingProvider = localStorage.getItem('connecting_provider');
            if (connectingProvider) {
                 // handled in auth listener below
            } else {
                 setView('app');
                 
                 // Handle specific routes
                 if (path.startsWith('community/')) {
                     setActiveTab('community');
                     const postId = path.split('/')[1];
                     if (postId) setInitialCommunityPostId(postId);
                 } else if (['home', 'discover', 'history', 'images', 'settings', 'collections', 'community', 'pricing'].includes(path)) {
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

    const savedWeatherUnit = localStorage.getItem('weather_unit');
    if (savedWeatherUnit) setWeatherUnit(savedWeatherUnit as 'c' | 'f');

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
          let path = '/';
          if (activeTab !== 'home') {
              path = `/${activeTab}`;
              if (activeTab === 'community' && initialCommunityPostId) {
                  path = `/community/${initialCommunityPostId}`;
              }
          }
          window.history.pushState({}, '', path);
      }
  }, [activeTab, view, initialCommunityPostId]);

  const restoreTokens = () => {
        const savedDriveToken = localStorage.getItem('google_drive_token');
        if (savedDriveToken) setGoogleAccessToken(savedDriveToken);
        const savedNotionToken = localStorage.getItem('notion_token');
        if (savedNotionToken) setNotionToken(savedNotionToken);
        const savedGithubToken = localStorage.getItem('github_token');
        if (savedGithubToken) setGithubToken(savedGithubToken);
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
           if (provider === 'github') {
               setGithubToken(session.provider_token);
               localStorage.setItem('github_token', session.provider_token);
           }
      } else {
          // If we linked an identity, the token might be in the identities array (access token not always exposed this way without re-auth, but supabase handles provider_token on signIn). 
          // For linked identities, usually re-login is required to refresh session with new tokens.
      }
  };

  // Sync Collections
  useEffect(() => {
      localStorage.setItem('infinity_collections', JSON.stringify(collections));
  }, [collections]);

  // History Sync Logic - Restricted to Pro for Auto Sync, but let's assume auto-sync logic is checked inside Settings toggle
  // If user enabled it previously but is no longer pro (unlikely), we honor the local storage flag but check permission.
  useEffect(() => {
      // Auto-save logic now gated in settings, but we double check here
      if (isAutoSaveEnabled && isPro && googleAccessToken && history.length > 0) {
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
  }, [history, isAutoSaveEnabled, googleAccessToken, isPro]);

  const handleToggleAutoSave = (enabled: boolean) => {
      setIsAutoSaveEnabled(enabled);
      localStorage.setItem('autosave_history', String(enabled));
  };

  const handleWeatherUnitChange = (unit: 'c' | 'f') => {
      setWeatherUnit(unit);
      localStorage.setItem('weather_unit', unit);
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
      setGithubToken(null);
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

  const initiateGithubConnect = async () => {
      saveReturnTab();
      localStorage.setItem('connecting_provider', 'github');
      try {
          const { error } = await supabase.auth.signInWithOAuth({
              provider: 'github',
              options: { redirectTo: window.location.origin, scopes: 'repo' }
          });
          if (error) throw error;
      } catch (e) {
          console.error(e);
          // Demo fallback logic if Auth fails in preview environment
          alert("Could not initiate GitHub auth in this environment.");
      }
  };
  
  const handleSuccessContinue = () => { 
      // If we just came from Polar payment, show Pricing tab to confirm status
      if (connectedProvider === 'Polar Pro Plan') {
          setView('app');
          setActiveTab('pricing');
          return;
      }

      const returnTab = localStorage.getItem('return_tab');
      setView('app'); 
      if (returnTab) {
          setActiveTab(returnTab as any);
          localStorage.removeItem('return_tab');
      } else {
          setActiveTab('settings');
      }
  };

  const handleModeChange = (mode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight' | 'drive' | 'code') => {
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
      setAttachedFile({
          name: 'Camera Capture',
          type: 'image',
          content: imageSrc,
          mimeType: 'image/jpeg'
      });
      setShowCamera(false);
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
  const performSearch = async (query: string, mode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight' | 'drive' | 'code') => {
     try {
      // Pro Gate Check inside search execution for safety
      if ((mode === 'shopping' || mode === 'flight' || mode === 'drive') && !isPro) {
          setSearchState(prev => ({ ...prev, status: 'idle' }));
          setActiveTab('pricing');
          return;
      }

      if (mode === 'drive') {
          if (!googleAccessToken) {
              await initiateGoogleLogin(); 
              return; 
          }
          const { text, sources } = await askDrive(query, googleAccessToken);
          const mediaItems: MediaItem[] = sources.map((s, i) => ({
              id: `drive-${i}`,
              type: 'article',
              thumbnailUrl: '', 
              contentUrl: s.uri,
              pageUrl: s.uri,
              title: s.title,
              source: 'Google Drive'
          }));
          
          setSearchState({ status: 'results', query, summary: text, sources: sources, media: mediaItems });
          addToHistory({ type: 'search', title: `Drive: ${query}`, summary: text, sources: [] });

      } else if (mode === 'code') {
          // Code Pilot Mode
          const result = await generateCode(query);
          setSearchState({ 
              status: 'results', 
              query, 
              summary: result.explanation, 
              sources: [], 
              media: [], 
              codeResult: result 
          });
          addToHistory({ type: 'search', title: `Code: ${query}`, summary: result.explanation, sources: [] });

      } else if (mode === 'notion') {
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
      } else if (mode === 'podcast') {
          const podcasts = await searchPodcasts(query);
          setSearchState({ status: 'results', query, summary: `Found ${podcasts.length} podcasts.`, sources: [], media: podcasts });
          addToHistory({ type: 'search', title: `Podcast: ${query}`, summary: `Audio search for ${query}`, sources: [] });
      } else if (mode === 'community') {
          // Just set state to results, the view will handle the fetching
          setSearchState({ status: 'results', query, summary: `Searching community...`, sources: [], media: [] });
      } else if (mode === 'recipe') {
          const results = await searchRecipes(query);
          setRecipes(results); // Store in dedicated recipe state
          setSearchState({ status: 'results', query, summary: `Found ${results.length} recipes.`, sources: [], media: [] });
          addToHistory({ type: 'search', title: `Recipe: ${query}`, summary: `Cooking search for ${query}`, sources: [] });
      } else if (mode === 'shopping') {
          // 1. Parallel Fetch: Multi-source products + Google Images
          const [products, images] = await Promise.all([
              searchShopping(query),
              fetchGoogleImages(query)
          ]);
          
          setSearchState({ 
              status: 'results', 
              query, 
              summary: `Found ${products.length} products.`, 
              sources: [], 
              media: [], 
              shopping: products,
              productImages: images,
              aiProductPicks: [] // Temporary empty
          });

          // 2. AI Post-Processing (Async)
          if (products.length > 0) {
              getProductRecommendations(products, query).then(picks => {
                  setSearchState(prev => ({ ...prev, aiProductPicks: picks }));
              });
          }

          addToHistory({ type: 'search', title: `Shopping: ${query}`, summary: `Product search for ${query}`, sources: [] });
      } else if (mode === 'flight') {
          const flights = await searchFlights(query);
          setSearchState({ status: 'results', query, summary: `Found ${flights.length} flights.`, sources: [], media: [], flights: flights });
          addToHistory({ type: 'search', title: `Flight: ${query}`, summary: `Travel search for ${query}`, sources: [] });
      } else {
          // Web Search (or Visual Search)
          const fileContext = attachedFile ? { content: attachedFile.content, mimeType: attachedFile.mimeType } : undefined;
          
          // Modify query for Visual Search if empty and file is present
          let activeQuery = query;
          if (!activeQuery && attachedFile) {
              activeQuery = "Find images related to this input image and explain them.";
          }

          const [aiData, pixabayImgs, pexelsImgs, nasaImgs] = await Promise.all([
            searchWithGemini(activeQuery, fileContext),
            fetchPixabayImages(activeQuery, 4),
            fetchPexelsImages(activeQuery, 4),
            fetchNasaImages(activeQuery)
          ]);
    
          const combinedImages = interleaveResults([pixabayImgs, pexelsImgs, nasaImgs]);
          addToHistory({ type: 'search', title: activeQuery, summary: aiData.text, sources: aiData.sources });
    
          setSearchState({ status: 'results', query: activeQuery, summary: aiData.text, sources: aiData.sources, media: combinedImages });
          setMediaGridData({ items: combinedImages, loading: false });
          setMediaType('image');
          setAttachedFile(null); // Clear attachment after search
      }
    } catch (error) {
      console.error(error);
      setSearchState(prev => ({ ...prev, status: 'idle', error: 'Something went wrong. Please try again.' }));
    }
  };

  const handleSearch = async (query: string, mode: 'web' | 'notion' | 'bible' | 'podcast' | 'community' | 'recipe' | 'shopping' | 'flight' | 'drive' | 'code') => {
      setSearchState(prev => ({ ...prev, status: 'searching', query, isDeepSearch: false }));
      setActiveTab('home');
      performSearch(query, mode);
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
    // Only save previous tab if not already on it
    if (activeTab !== tab && tab !== 'recipe' && tab !== 'article') {
        setPreviousTab(activeTab as any); 
    }
    setActiveTab(tab);
    if (tab === 'community') {
        // Clear specific post state when clicking tab
        setInitialCommunityPostId(null);
    }
    if (tab === 'images' && mediaGridData.items.length === 0 && searchState.query && searchMode === 'web') {
         handleMediaSearch(searchState.query, mediaType);
    }
  };

  const handleOpenArticle = (article: NewsArticle) => {
      setPreviousTab('discover'); // Assume discovering
      setCurrentArticle(article);
      setActiveTab('article');
      addToHistory({ type: 'article', title: article.title, subtitle: article.source.name, data: article });
  };

  const handleOpenRecipe = (recipe: Recipe) => {
      setPreviousTab(activeTab !== 'recipe' ? (activeTab as any) : 'home');
      setCurrentRecipe(recipe);
      setActiveTab('recipe');
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
          else if (item.title.startsWith("Podcast: ")) { setSearchMode('podcast'); handleSearch(item.title.replace("Podcast: ", ""), 'podcast'); }
          else if (item.title.startsWith("Recipe: ")) { setSearchMode('recipe'); handleSearch(item.title.replace("Recipe: ", ""), 'recipe'); }
          else if (item.title.startsWith("Shopping: ")) { setSearchMode('shopping'); handleSearch(item.title.replace("Shopping: ", ""), 'shopping'); }
          else if (item.title.startsWith("Flight: ")) { setSearchMode('flight'); handleSearch(item.title.replace("Flight: ", ""), 'flight'); }
          else if (item.title.startsWith("Drive: ")) { setSearchMode('drive'); handleSearch(item.title.replace("Drive: ", ""), 'drive'); }
          else if (item.title.startsWith("Code: ")) { setSearchMode('code'); handleSearch(item.title.replace("Code: ", ""), 'code'); }
          else { setSearchMode('web'); handleSearch(item.title, 'web'); }
      } else if (item.type === 'article' && item.data) { setCurrentArticle(item.data); setActiveTab('article'); }
  };

  const handleViewDailyBrief = () => {
      setDiscoverViewTab('brief');
      setActiveTab('discover');
  };

  const handleUpgradeClick = () => {
      setActiveTab('pricing');
  };

  // UPDATED: Pure black background logic as requested
  const bgStyle = () => {
     if (currentWallpaper) return { backgroundImage: `url(${currentWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' };
     // User requested pure black background default
     return { backgroundColor: '#000000' };
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
  const tempVal = weather?.temperature || 0;
  const tempDisplay = weatherUnit === 'c' ? Math.round(tempVal) : Math.round(tempVal * 9/5 + 32);
  const tempUnitLabel = weatherUnit === 'c' ? 'C' : 'F';
  
  const condition = weather?.weathercode !== undefined ? getWeatherDescription(weather.weathercode) : 'clear';
  const city = weather?.city || "your location";

  return (
    <div className="relative h-screen w-full bg-black text-white flex overflow-hidden">
      
      {showCamera && (
          <CameraView 
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
      )}

      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onReset={handleReset} />

      <main 
        className="flex-1 m-3 ml-24 h-[calc(100vh-1.5rem)] relative rounded-[40px] overflow-hidden shadow-2xl flex flex-col z-10 transition-all duration-500 border border-white/10" 
        style={bgStyle()}
      >
        {/* Use a simple overlay only if we have a wallpaper image to dim it */}
        {currentWallpaper && <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none z-0" />}

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
                </div>
            )}
        </div>

        <div className={`flex-1 flex flex-col relative z-20 transition-all w-full ${activeTab === 'images' || activeTab === 'settings' || activeTab === 'recipe' || activeTab === 'pricing' ? 'overflow-hidden' : 'overflow-y-auto glass-scroll px-4 md:px-8 pb-8'}`}>
            
            {activeTab === 'home' && (
              <>
                <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${searchState.status === 'idle' ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    
                    {/* Home Content */}
                    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mb-20 animate-slideUp">
                        {/* Logo - Updated Bigger Size */}
                        <a href="https://freeimage.host/" target="_blank" rel="noopener noreferrer">
                            <img 
                                src="https://iili.io/fRRfoF9.png" 
                                alt="Infinity Visual" 
                                className="w-80 h-auto mb-4 drop-shadow-2xl" 
                            />
                        </a>
                        
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
                                onCameraClick={() => setShowCamera(true)}
                            />
                        </div>

                        {/* Greeting & Brief Link */}
                        <div className="text-center space-y-3 mt-4">
                            <p className="text-xl text-zinc-400 font-light">
                                Hi, {userName}. Today, there will be <span className="text-white font-medium">{tempDisplay}°{tempUnitLabel}</span> and <span className="text-white font-medium">{condition}</span> in {city}.
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
                
                {searchState.status === 'results' && (
                    <div className="w-full h-full pt-4">
                        {searchMode === 'code' && searchState.codeResult ? (
                            <CodePilotView 
                                codeResult={searchState.codeResult} 
                                githubToken={githubToken} 
                                onConnectGithub={initiateGithubConnect} 
                            />
                        ) : searchMode === 'notion' ? (
                            <NotionResultsView items={searchState.media} query={searchState.query} />
                        ) : searchMode === 'bible' ? (
                            <BibleResultsView items={searchState.media} query={searchState.query} />
                        ) : searchMode === 'podcast' ? (
                            <PodcastResultsView items={searchState.media} query={searchState.query} onSave={handleSaveToCollections} />
                        ) : searchMode === 'community' ? (
                            <CommunityView user={sessionUser} initialQuery={searchState.query} />
                        ) : searchMode === 'recipe' ? (
                            <RecipeResultsView recipes={recipes} query={searchState.query} onOpenRecipe={handleOpenRecipe} />
                        ) : searchMode === 'shopping' ? (
                            <ShoppingResultsView 
                                products={searchState.shopping || []} 
                                aiPicks={searchState.aiProductPicks || []}
                                productImages={searchState.productImages || []}
                                query={searchState.query} 
                                onSave={handleSaveToCollections}
                            />
                        ) : searchMode === 'flight' ? (
                            <FlightResultsView flights={searchState.flights || []} query={searchState.query} onSave={handleSaveToCollections} />
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
                                    query={searchState.query}
                                />
                            </>
                        )}
                    </div>
                )}
              </>
            )}

            {activeTab === 'discover' && (
                <div className="w-full h-full pt-4">
                    <DiscoverView 
                        onOpenArticle={handleOpenArticle} 
                        onSummarize={handleSummarizeArticle} 
                        onOpenRecipe={handleOpenRecipe}
                        initialTab={discoverViewTab} 
                        weatherUnit={weatherUnit} 
                    />
                </div>
            )}
            {activeTab === 'collections' && <div className="w-full h-full pt-4"><CollectionsView items={collections} onRemove={handleRemoveFromCollections}/></div>}
            {activeTab === 'community' && <div className="w-full h-full pt-4"><CommunityView user={sessionUser} initialPostId={initialCommunityPostId} /></div>}
            {activeTab === 'images' && <div className="w-full h-full"><ImageGridView items={mediaGridData.items} onSearch={handleMediaSearch} loading={mediaGridData.loading} activeMediaType={mediaType} onMediaTypeChange={setMediaType} /></div>}
            {activeTab === 'article' && currentArticle && <div className="w-full h-full pt-4"><ArticleDetailView article={currentArticle} onBack={() => setActiveTab(previousTab as any)} onSummarize={handleSummarizeArticle}/></div>}
            {activeTab === 'recipe' && currentRecipe && <div className="w-full h-full"><RecipeDetailView recipe={currentRecipe} onBack={() => setActiveTab(previousTab as any)} /></div>}
            {activeTab === 'pricing' && <div className="w-full h-full"><PricingView /></div>}
            {activeTab === 'history' && <div className="w-full h-full pt-4"><HistoryView history={history} onSelectItem={handleHistorySelect}/></div>}
            {activeTab === 'settings' && (
                <div className="w-full h-full">
                    <SettingsView 
                        isNotionConnected={!!notionToken} isGoogleDriveConnected={!!googleAccessToken}
                        onConnectNotion={initiateNotionLogin} onConnectGoogleDrive={initiateGoogleLogin}
                        isAutoSaveEnabled={isAutoSaveEnabled} onToggleAutoSave={handleToggleAutoSave}
                        currentWallpaper={currentWallpaper} onWallpaperChange={setCurrentWallpaper}
                        user={sessionUser} onLogout={handleLogout}
                        weatherUnit={weatherUnit} onToggleWeatherUnit={handleWeatherUnitChange}
                        onUpgradeClick={handleUpgradeClick}
                    />
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
