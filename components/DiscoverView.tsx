import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchNews } from '../services/newsService';
import { fetchNasaNews } from '../services/nasaService';
import { summarizeWorldEvents } from '../services/geminiService';
import { NewsArticle } from '../types';
import { Sparkles, Eye, LayoutGrid, Newspaper } from 'lucide-react';
import DashboardWidgets from './DashboardWidgets';
import ExploreWidgets from './ExploreWidgets';

interface DiscoverViewProps {
  onOpenArticle: (article: NewsArticle) => void;
  onSummarize: (url: string) => void;
}

const DiscoverView: React.FC<DiscoverViewProps> = ({ onOpenArticle, onSummarize }) => {
  const [activeSubTab, setActiveSubTab] = useState<'news' | 'widgets' | 'whats_new'>('news');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [worldSummary, setWorldSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Initial Data Load
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      const [newsData, nasaData] = await Promise.all([
          fetchNews(1),
          fetchNasaNews(1)
      ]);
      
      // Interleave/Mix news
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

  // Fetch more data when page increases
  useEffect(() => {
      if (page === 1) return; // Handled by initial load

      const loadMore = async () => {
          const [moreNews, moreNasa] = await Promise.all([
              fetchNews(page),
              fetchNasaNews(page)
          ]);
          
          if (moreNews.length === 0 && moreNasa.length === 0) {
              setHasMore(false);
              return;
          }

          const mixed = [...moreNews, ...moreNasa].sort(() => Math.random() - 0.5); // Shuffle for variety
          setArticles(prev => [...prev, ...mixed]);
      };
      loadMore();
  }, [page]);

  // Infinite Scroll Observer
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
  }, [handleObserver, articles, activeSubTab]); // Re-attach when articles change so ref is valid

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-slideUp px-4 flex flex-col items-center">
      
      {/* Pill Navigation Bar (Top Only Icons) */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-full mb-10 shadow-lg">
          <button 
            onClick={() => setActiveSubTab('widgets')}
            className={`w-12 h-10 rounded-full flex items-center justify-center transition-all ${activeSubTab === 'widgets' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
            title="Widgets"
          >
              <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setActiveSubTab('news')}
            className={`w-12 h-10 rounded-full flex items-center justify-center transition-all ${activeSubTab === 'news' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
            title="News"
          >
              <Newspaper size={20} />
          </button>
          <button 
            onClick={() => setActiveSubTab('whats_new')}
            className={`w-12 h-10 rounded-full flex items-center justify-center transition-all ${activeSubTab === 'whats_new' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
            title="What's New"
          >
              <Sparkles size={20} />
          </button>
      </div>

      {/* --- WIDGETS TAB --- */}
      {activeSubTab === 'widgets' && (
          <div className="w-full space-y-8 animate-fadeIn">
              <div className="text-center mb-6">
                   <h2 className="text-3xl font-bold text-white mb-2">Widgets Dashboard</h2>
                   <p className="text-zinc-500">Tools and utilities for your daily workflow.</p>
              </div>
              <ExploreWidgets />
          </div>
      )}

      {/* --- NEWS TAB --- */}
      {activeSubTab === 'news' && (
          <div className="w-full animate-fadeIn">
                {/* Header & Widgets */}
                <div className="mb-10 space-y-8">
                    <h2 className="text-4xl font-bold text-white mb-6">Discover</h2>
                    
                    {/* Dashboard Widgets at Top */}
                    <DashboardWidgets />
                    
                    {/* AI Summary Card */}
                    <div className="bg-transparent backdrop-blur-xl border border-white/20 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group mt-8">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Sparkles size={64} className="text-purple-300" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3 text-purple-300">
                                <Sparkles size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Global Briefing</span>
                            </div>
                            {summaryLoading ? (
                                <div className="h-16 w-full animate-pulse bg-white/5 rounded-lg"></div>
                            ) : (
                                <p className="text-xl md:text-2xl font-light text-white leading-relaxed max-w-3xl">
                                    {worldSummary}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                    <div
                        key={`${article.url}-${index}`}
                        className="group relative flex flex-col bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-[32px] p-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-full"
                    >
                        {/* Image Container - Padded and Rounded */}
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                        <img 
                            src={article.urlToImage || ''} 
                            alt={article.title} 
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badge with Verified Checkmark */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md pl-3 pr-2 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105">
                            <span className="text-black text-[10px] font-bold uppercase tracking-wider max-w-[120px] truncate">
                                {article.source.name}
                            </span>
                            <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-white text-xl font-bold leading-snug mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                            {article.title}
                        </h3>
                        
                        <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-3 mb-6 flex-1">
                            {article.description}
                        </p>

                        {/* Actions */}
                        <div className="mt-auto flex gap-3">
                            <button 
                                onClick={() => onOpenArticle(article)}
                                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-full text-sm font-medium transition-colors"
                            >
                                <Eye size={16} /> Read
                            </button>
                            <button 
                                onClick={() => onSummarize(article.url)}
                                className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 py-3 rounded-full text-sm font-bold transition-colors shadow-lg"
                            >
                                <Sparkles size={16} className="text-purple-600" /> Summarize
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}
                    
                    {/* Loading Skeletons for initial load */}
                    {loading && Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white/5 animate-pulse rounded-[32px] h-96 border border-white/5"></div>
                    ))}
                </div>
                
                {/* Sentinel for infinite scroll */}
                {hasMore && (
                    <div ref={lastElementRef} className="w-full py-10 flex justify-center">
                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}
          </div>
      )}

      {/* --- WHATS NEW TAB --- */}
      {activeSubTab === 'whats_new' && (
          <div className="w-full flex flex-col items-center justify-center h-[50vh] text-zinc-500 animate-fadeIn">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                  <Sparkles size={32} className="opacity-50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
              <p className="max-w-md text-center">We're working on exciting new features. Check back later!</p>
          </div>
      )}
      
    </div>
  );
};

export default DiscoverView;