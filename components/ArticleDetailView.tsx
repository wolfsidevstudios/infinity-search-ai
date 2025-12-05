import React from 'react';
import { NewsArticle } from '../types';
import { Calendar, User, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';

interface ArticleDetailViewProps {
  article: NewsArticle;
  onBack: () => void;
  onSummarize: (url: string) => void;
}

const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ article, onBack, onSummarize }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-slideUp">
      {/* Navbar Actions */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
        >
          <ArrowLeft size={18} /> Back
        </button>
        
        <button 
            onClick={() => onSummarize(article.url)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg transition-all transform hover:scale-105"
        >
            <Sparkles size={16} /> Summarize with AI
        </button>
      </div>

      {/* Article Card */}
      <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-[40px] overflow-hidden shadow-2xl text-white">
        {/* Header Image */}
        <div className="relative h-[400px] w-full p-4">
            <div className="w-full h-full rounded-[32px] overflow-hidden relative shadow-inner">
                <img 
                    src={article.urlToImage || ''} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block bg-blue-500/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-3">
                        {article.source.name}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white drop-shadow-lg">
                        {article.title}
                    </h1>
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="px-8 md:px-12 py-8">
            <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{article.author || 'Unknown Author'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(article.publishedAt)}</span>
                </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-xl leading-relaxed font-light opacity-90 mb-6">
                    {article.description}
                </p>
                <p className="opacity-70 leading-relaxed">
                    {article.content ? article.content.split('[')[0] : 'Full content is available at the source.'}
                </p>
            </div>

            {/* CTA to source */}
            <div className="mt-12 pt-8 border-t border-white/10 flex justify-center">
                <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    Read Full Article at Source <ExternalLink size={20} />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailView;
