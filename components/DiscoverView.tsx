import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchNews } from '../services/newsService';
import { fetchNasaNews } from '../services/nasaService';
import { summarizeWorldEvents } from '../services/geminiService';
import { NewsArticle } from '../types';
import { Sparkles, Eye, LayoutGrid, Newspaper, Sun } from 'lucide-react';
import DashboardWidgets from './DashboardWidgets';
import ExploreWidgets from './ExploreWidgets';

interface DiscoverViewProps {
  onOpenArticle: (article: NewsArticle) => void;
  onSummarize: (url: string) => void;
  initialTab?: 'news' | 'widgets' | 'whats_new' | 'brief';
}

const DiscoverView: React.FC<DiscoverViewProps> = ({ onOpenArticle, onSummarize, initialTab }) => {
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

  // Sync initialTab if prop changes
  useEffect(() => {
      if (initialTab) {
          setActiveSubTab(initialTab);
      }
  }, [initialTab]);

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

  // Scroll Detection Observer
  useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) => {
              setIsScrolled(!entry.isIntersecting);
          },
          { threshold: 0, rootMargin: "-10px 0px 0px 0px" }
      );
      
      if (sentinelRef.current) {
          observer.observe(sentinelRef.current);
      }
      
      return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-slideUp px-4 flex flex-col items-center relative min-h-screen">
      
      {/* Sentinel for Scroll Detection */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-1 pointer-events-none opacity-0" />

      {/* Floating Pill Navigation Bar */}
      <div className={`sticky top-2 z-50 transition-all duration-500 ease-in-out mb-8 ${isScrolled ? 'scale-90' : 'scale-100 mt-2'}`}>
          <div className={`flex items-center gap-2 rounded-full border shadow-2xl transition-all duration-500 ${
              isScrolled 
              ? 'p-1 bg-black/60 backdrop-blur-xl border-white/10' 
              : 'p-1.5 bg-zinc-900 border-zinc-800'
          }`}>
              <button 
                onClick={() => setActiveSubTab('widgets')}
                className={`rounded-full flex items-center justify-center transition-all ${
                    isScrolled ? 'w-10 h-8' : 'w-12 h-10'
                } ${activeSubTab === 'widgets' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
                title="Widgets"
              >
                  <LayoutGrid size={isScrolled ? 16 : 20} />
              </button>
              <button 
                onClick={() => setActiveSubTab('news')}
                className={`rounded-full flex items-center justify-center transition-all ${
                    isScrolled ? 'w-10 h-8' : 'w-12 h-10'
                } ${activeSubTab === 'news' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
                title="News"
              >
                  <Newspaper size={isScrolled ? 16 : 20} />
              </button>
              <button 
                onClick={() => setActiveSubTab('brief')}
                className={`rounded-full flex items-center justify-center transition-all ${
                    isScrolled ? 'w-10 h-8' : 'w-12 h-10'
                } ${activeSubTab === 'brief' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
                title="Daily Brief"
              >
                  <Sun size={isScrolled ? 16 : 20} />
              </button>
              <button 
                onClick={() => setActiveSubTab('whats_new')}
                className={`rounded-full flex items-center justify-center transition-all ${
                    isScrolled ? 'w-10 h-8' : 'w-12 h-10'
                } ${activeSubTab === 'whats_new' ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}`}
                title="What's New"
              >
                  <Sparkles size={isScrolled ? 16 : 20} />
              </button>
          </div>
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

      {/* --- BRIEF TAB --- */}
      {activeSubTab === 'brief' && (
          <div className="w-full max-w-4xl animate-fadeIn space-y-8">
              <div className="text-center mb-10">
                   <h2 className="text-4xl font-serif font-bold text-white mb-4">Daily Briefing</h2>
                   <p className="text-zinc-400">Your AI-curated summary of the world today.</p>
              </div>

              {/* AI Summary Card (Expanded) */}
                <div className="bg-gradient-to-br from-zinc-900 to-black backdrop-blur-xl border border-white/20 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <Sparkles size={120} className="text-purple-300" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6 text-purple-300">
                            <Sparkles size={24} />
                            <span className="text-sm font-bold uppercase tracking-widest">Global Executive Summary</span>
                        </div>
                        {summaryLoading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-6 bg-white/10 rounded w-full"></div>
                                <div className="h-6 bg-white/10 rounded w-5/6"></div>
                                <div className="h-6 bg-white/10 rounded w-4/6"></div>
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-lg max-w-none">
                                <p className="text-2xl font-light text-white leading-relaxed">
                                    {worldSummary}
                                </p>
                            </div>
                        )}
                        <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center text-sm text-zinc-500">
                            <span>Curated from {articles.length}+ sources</span>
                            <span>Updated just now</span>
                        </div>
                    </div>
                </div>

                {/* Top Stories Preview */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-6">Top Stories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.slice(0, 4).map((article, idx) => (
                            <div key={idx} onClick={() => onOpenArticle(article)} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 hover:border-zinc-700 cursor-pointer transition-all">
                                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                    <img src={article.urlToImage || ''} className="w-full h-full object-cover" alt="Thumb" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white leading-tight mb-2 line-clamp-2">{article.title}</h4>
                                    <div className="text-xs text-zinc-500">{article.source.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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