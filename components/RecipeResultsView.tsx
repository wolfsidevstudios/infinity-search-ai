
import React from 'react';
import { Recipe } from '../services/recipeService';
import { Utensils, Globe, ArrowRight, ChefHat, Play } from 'lucide-react';

interface RecipeResultsViewProps {
  recipes: Recipe[];
  query: string;
  onOpenRecipe: (recipe: Recipe) => void;
}

const RecipeResultsView: React.FC<RecipeResultsViewProps> = ({ recipes, query, onOpenRecipe }) => {

  if (recipes.length === 0) {
      return (
          <div className="w-full h-96 flex flex-col items-center justify-center text-zinc-500 animate-fadeIn">
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                  <Utensils size={40} className="opacity-30" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No recipes found</h2>
              <p>We couldn't find any recipes for "{query}". Try a different ingredient.</p>
          </div>
      );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 animate-slideUp px-4">
      
      {/* Header */}
      <div className="mb-10 pl-2">
         <div className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wider mb-2">
             <ChefHat size={16} /> Kitchen
         </div>
         <h1 className="text-4xl font-bold text-white">
            Recipes for "{query}"
         </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
              <div 
                key={recipe.id}
                onClick={() => onOpenRecipe(recipe)}
                className="group relative bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:border-orange-500/30"
              >
                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={recipe.thumbnail} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                      
                      {/* Floating Category Tag */}
                      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white">
                          {recipe.category}
                      </div>

                      {/* Video Indicator if available */}
                      {recipe.youtubeUrl && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                              <Play size={12} fill="currentColor" />
                          </div>
                      )}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white leading-tight mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                          {recipe.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-zinc-400 text-sm">
                          <div className="flex items-center gap-2">
                              <Globe size={14} />
                              <span>{recipe.area}</span>
                          </div>
                          <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-white font-bold">
                              View <ArrowRight size={14} />
                          </div>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default RecipeResultsView;
