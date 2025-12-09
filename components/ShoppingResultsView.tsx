import React, { useState } from 'react';
import { ShoppingProduct, MediaItem } from '../types';
import { ShoppingBag, Star, ExternalLink, Sparkles, Check, Bookmark, Image as ImageIcon } from 'lucide-react';

interface ShoppingResultsViewProps {
  products: ShoppingProduct[];
  aiPicks: ShoppingProduct[];
  productImages: MediaItem[];
  query: string;
  onSave: (item: any) => void;
}

const ShoppingResultsView: React.FC<ShoppingResultsViewProps> = ({ products, aiPicks, productImages, query, onSave }) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSave = (product: ShoppingProduct) => {
      onSave({ type: 'product', content: product });
      const id = product.title + product.price; // Generate pseudo-id
      setSavedIds(prev => new Set(prev).add(id));
      setTimeout(() => {
          setSavedIds(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
          });
      }, 2000);
  };

  if (products.length === 0) {
      return (
          <div className="w-full h-96 flex flex-col items-center justify-center text-zinc-500 animate-fadeIn">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                  <ShoppingBag size={40} className="opacity-30" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No products found</h2>
              <p>We couldn't find any shopping results for "{query}".</p>
          </div>
      );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-slideUp px-4">
      
      {/* Header */}
      <div className="mb-10 pl-2">
         <div className="flex items-center gap-2 text-pink-400 text-sm font-bold uppercase tracking-wider mb-2">
             <ShoppingBag size={16} /> Shopping Agent
         </div>
         <h1 className="text-4xl font-bold text-white">
            Deals for "{query}"
         </h1>
      </div>

      {/* AI PICKS SECTION */}
      {aiPicks.length > 0 && (
          <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-yellow-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">AI Editor's Choice</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiPicks.map((product, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-[32px] p-6 flex items-start gap-6 relative overflow-hidden group">
                          {/* Background Glow */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] pointer-events-none"></div>
                          
                          <div className="w-32 h-32 shrink-0 bg-white rounded-2xl overflow-hidden p-2 flex items-center justify-center shadow-lg">
                              <img src={product.thumbnail} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Top Pick</span>
                                  <span className="text-xs text-zinc-400">{product.source}</span>
                              </div>
                              <h3 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">{product.title}</h3>
                              <p className="text-sm text-purple-200 mb-4 leading-relaxed line-clamp-2">
                                  "{product.aiReason || 'Best value option based on price and rating analysis.'}"
                              </p>
                              <div className="flex items-center justify-between">
                                  <span className="text-2xl font-bold text-white">{product.price}</span>
                                  <a href={product.link} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-purple-100 transition-colors">
                                      View Deal
                                  </a>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* STANDARD RESULTS */}
      <h2 className="text-xl font-bold text-white mb-6">All Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, idx) => (
              <div 
                key={idx}
                className="group relative bg-zinc-900 border border-zinc-800 rounded-[24px] overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:border-zinc-600 flex flex-col"
              >
                  {/* Badge */}
                  {product.badge && (
                      <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md uppercase tracking-wide">
                          {product.badge}
                      </div>
                  )}

                  {/* Save Button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); handleSave(product); }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/10 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
                  >
                      {savedIds.has(product.title + product.price) ? <Check size={14} className="text-green-500"/> : <Bookmark size={14} />}
                  </button>

                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden bg-white p-6 flex items-center justify-center">
                      <img 
                        src={product.thumbnail} 
                        alt={product.title} 
                        className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                      />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                      <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                          {product.source}
                          {product.delivery && <span className="text-green-500">• {product.delivery}</span>}
                      </div>
                      
                      <h3 className="text-white font-bold leading-tight mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {product.title}
                      </h3>

                      {/* Ratings */}
                      {product.rating && (
                          <div className="flex items-center gap-1 text-yellow-500 text-xs mb-3">
                              <Star size={12} fill="currentColor" />
                              <span className="font-bold">{product.rating}</span>
                              <span className="text-zinc-600">({product.reviews})</span>
                          </div>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-800">
                          <span className="text-xl font-bold text-white">{product.price}</span>
                          
                          <a 
                            href={product.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2"
                          >
                              View <ExternalLink size={12} />
                          </a>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {/* VISUALS SECTION (Google Images) */}
      {productImages.length > 0 && (
          <div className="mt-20">
              <div className="flex items-center gap-2 mb-6">
                  <ImageIcon size={20} className="text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Visual Inspiration</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {productImages.map((img, idx) => (
                      <a 
                        key={idx} 
                        href={img.pageUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="aspect-square rounded-2xl overflow-hidden relative group"
                      >
                          <img src={img.thumbnailUrl} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                              <p className="text-xs text-white line-clamp-2">{img.title}</p>
                          </div>
                      </a>
                  ))}
              </div>
          </div>
      )}

    </div>
  );
};

export default ShoppingResultsView;
