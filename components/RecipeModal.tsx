import React from 'react';
import { X, Globe, Youtube, ChefHat } from 'lucide-react';
import { Recipe } from '../services/recipeService';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black animate-fadeIn"> 
      
      {/* Modal Content - Full Screen */}
      <div className="relative bg-[#0a0a0a] w-full h-full overflow-hidden flex flex-col text-white">
        
        {/* Header Image - Cinematic Height */}
        <div className="relative h-[45vh] w-full shrink-0">
          <img 
            src={recipe.thumbnail} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-14 h-14 bg-black/40 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center backdrop-blur-xl transition-all z-50 group border border-white/10 hover:border-transparent"
          >
            <X size={28} className="group-hover:rotate-90 transition-transform" />
          </button>
          
          <div className="absolute bottom-10 left-6 md:left-16 right-6 max-w-5xl">
            <span className="inline-flex items-center gap-2 bg-orange-600/90 backdrop-blur-md text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-lg border border-orange-500/20">
              <ChefHat size={16} /> {recipe.category} • {recipe.area}
            </span>
            <h2 className="text-4xl md:text-7xl font-bold text-white leading-tight drop-shadow-2xl tracking-tight">{recipe.title}</h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto glass-scroll bg-[#0a0a0a]">
          <div className="max-w-[1600px] mx-auto p-6 md:p-16 grid md:grid-cols-12 gap-12 md:gap-24">
            
            {/* Ingredients Side (Sticky on Desktop) */}
            <div className="md:col-span-4 space-y-8">
              <div className="md:sticky md:top-8 space-y-8">
                  <h3 className="text-3xl font-bold flex items-center gap-3 text-orange-400 font-serif border-b border-white/10 pb-4">
                    Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex justify-between items-start bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <span className="font-medium text-zinc-200 text-lg">{ing.name}</span>
                        <span className="font-bold text-orange-400 whitespace-nowrap ml-4">{ing.measure}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-4">
                    {recipe.youtubeUrl && (
                      <a href={recipe.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 text-lg font-bold bg-red-600 text-white hover:bg-red-700 py-4 rounded-xl transition-colors shadow-lg shadow-red-900/20">
                        <Youtube size={24} /> Watch Tutorial
                      </a>
                    )}
                    {recipe.sourceUrl && (
                      <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 text-lg font-bold bg-zinc-800 text-white hover:bg-white hover:text-black py-4 rounded-xl transition-colors border border-zinc-700 hover:border-transparent">
                        <Globe size={24} /> Original Recipe
                      </a>
                    )}
                  </div>
              </div>
            </div>

            {/* Instructions Side */}
            <div className="md:col-span-8">
              <h3 className="text-3xl font-bold text-white mb-10 font-serif border-b border-white/10 pb-4">Preparation</h3>
              <div className="space-y-10 text-zinc-300 text-xl leading-relaxed font-light">
                {recipe.instructions.split('\r\n').filter(p => p.trim()).map((paragraph, idx) => (
                    <div key={idx} className="flex gap-6 md:gap-8 group">
                        <span className="text-6xl font-serif text-white/10 font-bold -mt-3 select-none group-hover:text-orange-500/20 transition-colors">{idx + 1}</span>
                        <p>{paragraph}</p>
                    </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;