import React from 'react';
import { ShoppingProduct } from '../types';
import { ShoppingBag, Star, ExternalLink, Tag } from 'lucide-react';

interface ShoppingResultsViewProps {
  products: ShoppingProduct[];
  query: string;
}

const ShoppingResultsView: React.FC<ShoppingResultsViewProps> = ({ products, query }) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, idx) => (
              <div 
                key={idx}
                className="group relative bg-zinc-900 border border-zinc-800 rounded-[24px] overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:border-zinc-600 flex flex-col"
              >
                  {/* Badge */}
                  {product.badge && (
                      <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md uppercase tracking-wide">
                          {product.badge}
                      </div>
                  )}

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
                              View Deal <ExternalLink size={12} />
                          </a>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default ShoppingResultsView;
