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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#1a1a1a] md:bg-[#1a1a1a]/95 backdrop-blur-2xl w-full h-full md:max-w-7xl md:h-[90vh] md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col animate-slideUp text-white">
        
        {/* Header Image */}
        <div className="relative h-64 md:h-96 w-full shrink-0">
          <img 
            src={recipe.thumbnail} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors z-10"
          >
            <X size={24} />
          </button>
          
          <div className="absolute bottom-8 left-8 right-8">
            <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider shadow-lg">
              {recipe.category} • {recipe.area}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-xl">{recipe.title}</h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 md:p-12 overflow-y-auto glass-scroll flex-1">
          
          <div className="grid md:grid-cols-12 gap-12">
            {/* Ingredients */}
            <div className="md:col-span-4 space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-orange-400">
                <ChefHat size={28} /> Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <span className="font-medium text-zinc-200">{ing.name}</span>
                    <span className="font-bold text-orange-400">{ing.measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="md:col-span-8 space-y-8">
              <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Instructions</h3>
                  <div className="space-y-6 text-zinc-300 text-lg leading-relaxed whitespace-pre-line font-light">
                    {recipe.instructions.split('\r\n').map((paragraph, idx) => (
                        paragraph.trim() && <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10">
                {recipe.sourceUrl && (
                  <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-full transition-colors">
                    <Globe size={18} /> View Source
                  </a>
                )}
                {recipe.youtubeUrl && (
                  <a href={recipe.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-full transition-colors shadow-lg shadow-red-900/20">
                    <Youtube size={18} /> Watch Video
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;