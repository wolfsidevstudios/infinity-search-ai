
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchNews } from '../services/newsService';
import { fetchNasaNews } from '../services/nasaService';
import { summarizeWorldEvents } from '../services/geminiService';
import { NewsArticle } from '../types';
import { Sparkles, Eye, LayoutGrid, Newspaper, Sun } from 'lucide-react';
import DashboardWidgets from './DashboardWidgets';
import ExploreWidgets from './ExploreWidgets';
import AppStoreView from './AppStoreView';
import { Recipe } from '../services/recipeService';

interface DiscoverViewProps {
  theme?: 'light' | 'dark';
  onOpenArticle: (article: NewsArticle) => void;
  onSummarize: (url: string) => void;
  onOpenRecipe: (recipe: Recipe) => void;
  initialTab?: 'news' | 'widgets' | 'whats_new' | 'brief';
  weatherUnit: 'c' | 'f';
}

const DiscoverView: React.FC<DiscoverViewProps> = ({ theme = 'dark', onOpenArticle, onSummarize, onOpenRecipe, initialTab, weatherUnit }) => {
  const [activeSubTab, setActiveSubTab] = useState<'news' | 'widgets' | 'whats_new' | 'brief'>(initialTab || 'news');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [worldSummary, setWorldSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      const [newsData, nasaData] = await Promise.all([fetchNews(1), fetchNasaNews(1)]);
      const mixed = [...newsData, ...nasaData].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      setArticles(mixed);
      setLoading(false);
      if (mixed.length > 0) {
        setSummaryLoading(true);
        const headlines = mixed.slice(0, 5).map(a => a.title);
        const summary = await summarizeWorldEvents(headlines);
        setWorldSummary(summary);
        setSummaryLoading(false);
      }
    };
    loadInitial();
  }, []);

  useEffect(() => { if (initialTab) setActiveSubTab(initialTab); }, [initialTab]);

  useEffect(() => {
      if (page === 1) return;
      const loadMore = async () => {
          const [moreNews, moreNasa] = await Promise.all([fetchNews(page), fetchNasaNews(page)]);
          if (moreNews.length === 0 && moreNasa.length === 0) { setHasMore(false); return; }
          const mixed = [...moreNews, ...moreNasa].sort(() => Math.random() - 0.5);
          setArticles(prev => [...prev, ...mixed]);
      };
      loadMore();
  }, [page]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading && activeSubTab === 'news') {
          setPage(prev => prev + 1);
      }
  }, [hasMore, loading, activeSubTab]);

  useEffect(() => {
      const option = { root: null, rootMargin: "100px", threshold: 0.1 };
      observerRef.current = new IntersectionObserver(handleObserver, option);
      if (lastElementRef.current) observerRef.current.observe(lastElementRef.current);
      return () => { if (observerRef.current) observerRef.current.disconnect(); }
  }, [handleObserver, articles, activeSubTab]);

  useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => setIsScrolled(!entry.isIntersecting), { threshold: 0, rootMargin: "-10px 0px 0px 0px" });
      if (sentinelRef.current) observer.observe(sentinelRef.current);
      return () => observer.disconnect();
  }, []);

  const getNavBtnClass = (isActive: boolean) => `
    rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
    ${isScrolled ? 'w-10 h-8' : 'w-12 h-10'}
    ${isActive 
      ? (theme === 'dark' ? 'bg-white text-black shadow-lg scale-105' : 'bg-black text-white shadow-lg scale-105') 
      : (theme === 'dark' ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-black hover:bg-black/5')
    }
  `;

  return (
    <div className={`w-full max-w-7xl mx-auto pb-20 animate-slideUp px-4 flex flex-col items-center relative min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-1 pointer-events-none opacity-0" />

      <div className={`sticky top-2 z-50 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] mb-8 ${isScrolled ? 'translate-y-0 scale-90' : 'translate-y-2 scale-100'}`}>
          <div className={`flex items-center gap-2 rounded-full border shadow-2xl transition-all duration-500 ${
              theme === 'dark' 
              ? (isScrolled ? 'p-1 bg-black/60 backdrop-blur-xl border-white/10' : 'p-1.5 bg-zinc-900 border-zinc-800') 
              : (isScrolled ? 'p-1 bg-white/80 backdrop-blur-xl border-black/5' : 'p-1.5 bg-white border-black/10 shadow-lg shadow-zinc-200')
          }`}>
              <button onClick={() => setActiveSubTab('widgets')} className={getNavBtnClass(activeSubTab === 'widgets')} title="Widgets"><LayoutGrid size={isScrolled ? 16 : 20} /></button>
              <button onClick={() => setActiveSubTab('news')} className={getNavBtnClass(activeSubTab === 'news')} title="News"><Newspaper size={isScrolled ? 16 : 20} /></button>
              <button onClick={() => setActiveSubTab('brief')} className={getNavBtnClass(activeSubTab === 'brief')} title="Daily Brief"><Sun size={isScrolled ? 16 : 20} /></button>
              <button onClick={() => setActiveSubTab('whats_new')} className={getNavBtnClass(activeSubTab === 'whats_new')} title="App Store"><Sparkles size={isScrolled ? 16 : 20} /></button>
          </div>
      </div>

      {activeSubTab === 'widgets' && (
          <div className="w-full space-y-8 animate-fadeIn">
              <div className="text-center mb-6">
                   <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Dashboard</h2>
                   <p className="text-zinc-500">Intelligent tools for your workflow.</p>
              </div>
              <ExploreWidgets />
          </div>
      )}

      {activeSubTab === 'brief' && (
          <div className="w-full max-w-4xl animate-fadeIn space-y-8">
              <div className="text-center mb-10">
                   <h2 className={`text-4xl font-serif font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Daily Briefing</h2>
                   <p className="text-zinc-500">The world through the eyes of Synapse.</p>
              </div>

                <div className={`backdrop-blur-xl border rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 to-black border-white/20' : 'bg-white border-black/5 shadow-zinc-200'}`}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6 text-purple-500">
                            <Sparkles size={24} />
                            <span className="text-sm font-black uppercase tracking-widest italic">Global Synthesis</span>
                        </div>
                        {summaryLoading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className={`h-6 rounded w-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`}></div>
                                <div className={`h-6 rounded w-5/6 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`}></div>
                            </div>
                        ) : (
                            <div className="prose prose-lg max-w-none">
                                <p className={`text-2xl font-light leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                    {worldSummary}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
          </div>
      )}

      {activeSubTab === 'news' && (
          <div className="w-full animate-fadeIn">
                <div className="mb-10 space-y-8">
                    <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Discover</h2>
                    <DashboardWidgets weatherUnit={weatherUnit} onOpenRecipe={onOpenRecipe} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                    <div
                        key={`${article.url}-${index}`}
                        className={`group relative flex flex-col border rounded-[32px] p-3 h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-white border-black/5 shadow-sm hover:border-black/10'}`}
                    >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                        <img 
                            src={article.urlToImage || ''} alt={article.title} loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`absolute top-3 left-3 flex items-center gap-1.5 backdrop-blur-md pl-3 pr-2 py-1.5 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-105 origin-left ${theme === 'dark' ? 'bg-white/90 text-black' : 'bg-black/90 text-white'}`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider max-w-[120px] truncate">{article.source.name}</span>
                        </div>
                        </div>

                        <div className="p-4 flex flex-col flex-1">
                        <h3 className={`text-xl font-bold leading-snug mb-3 line-clamp-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white group-hover:text-blue-300' : 'text-black group-hover:text-blue-600'}`}>
                            {article.title}
                        </h3>
                        <p className={`text-sm font-light leading-relaxed line-clamp-3 mb-6 flex-1 ${theme === 'dark' ? 'text-white/60' : 'text-zinc-500'}`}>
                            {article.description}
                        </p>
                        <div className="mt-auto flex gap-3">
                            <button onClick={() => onOpenArticle(article)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-all active:scale-95 ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-black'}`}><Eye size={16} /> Read</button>
                            <button onClick={() => onSummarize(article.url)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all shadow-lg active:scale-95 ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'}`}><Sparkles size={16} /> Summary</button>
                        </div>
                        </div>
                    </div>
                    ))}
                    {loading && Array.from({ length: 6 }).map((_, i) => (<div key={i} className={`animate-pulse rounded-[32px] h-96 border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'}`}></div>))}
                </div>
                {hasMore && (<div ref={lastElementRef} className="w-full py-10 flex justify-center"><div className={`w-8 h-8 border-4 border-t-blue-500 rounded-full animate-spin ${theme === 'dark' ? 'border-white/20' : 'border-black/5'}`}></div></div>)}
          </div>
      )}

      {activeSubTab === 'whats_new' && (
          <div className="w-full animate-fadeIn">
              <AppStoreView />
          </div>
      )}
      
    </div>
  );
};

export default DiscoverView;
