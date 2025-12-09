import React from 'react';
import { MediaItem } from '../types';
import { Heart, Repeat, MessageCircle, Share, Twitter } from 'lucide-react';

interface TwitterResultsViewProps {
  items: MediaItem[];
  query: string;
}

const TwitterResultsView: React.FC<TwitterResultsViewProps> = ({ items, query }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString();
  };

  if (!items.length) return null;

  return (
    <div className="w-full max-w-2xl mx-auto pb-20 animate-slideUp px-4">
      
      <div className="flex items-center gap-3 mb-8 pl-2">
         <div className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
             <Twitter size={20} fill="currentColor" />
         </div>
         <h1 className="text-3xl font-bold text-white">
            Latest on "{query}"
         </h1>
      </div>

      <div className="space-y-4">
          {items.map((item) => (
              <div 
                key={item.id}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => window.open(item.pageUrl, '_blank')}
              >
                  <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="shrink-0">
                          <img 
                            src={item.data?.avatar} 
                            alt={item.data?.authorName} 
                            className="w-12 h-12 rounded-full object-cover border border-white/10"
                          />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white hover:underline">{item.data?.authorName}</span>
                              <span className="text-zinc-500 text-sm">@{item.data?.authorHandle}</span>
                              <span className="text-zinc-600 text-xs">•</span>
                              <span className="text-zinc-500 text-sm hover:underline">{formatDate(item.data?.date)}</span>
                          </div>

                          {/* Body */}
                          <p className="text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap mb-3">
                              {item.title}
                          </p>

                          {/* Media Attachment */}
                          {item.thumbnailUrl && item.thumbnailUrl !== item.data?.avatar && (
                              <div className="mb-3 rounded-2xl overflow-hidden border border-white/10 mt-2">
                                  <img src={item.thumbnailUrl} alt="Media" className="w-full h-auto object-cover max-h-[300px]" />
                              </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between text-zinc-500 max-w-sm mt-2">
                              <button className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
                                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                                      <MessageCircle size={18} />
                                  </div>
                                  <span className="text-xs">Reply</span>
                              </button>
                              <button className="flex items-center gap-2 group hover:text-green-400 transition-colors">
                                  <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                                      <Repeat size={18} />
                                  </div>
                                  <span className="text-xs">{formatNumber(item.data?.retweets || 0)}</span>
                              </button>
                              <button className="flex items-center gap-2 group hover:text-pink-500 transition-colors">
                                  <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                                      <Heart size={18} />
                                  </div>
                                  <span className="text-xs">{formatNumber(item.data?.likes || 0)}</span>
                              </button>
                              <button className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
                                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                                      <Share size={18} />
                                  </div>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default TwitterResultsView;