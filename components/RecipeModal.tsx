
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white/90 backdrop-blur-xl w-full max-w-2xl max-h-[90vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-slideUp">
        
        {/* Header Image */}
        <div className="relative h-64 w-full shrink-0">
          <img 
            src={recipe.thumbnail} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md mb-2">
              {recipe.category} • {recipe.area}
            </span>
            <h2 className="text-3xl font-bold text-white leading-tight">{recipe.title}</h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto glass-scroll">
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-orange-600">
                <ChefHat size={20} /> Ingredients
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between border-b border-gray-100 pb-1">
                    <span>{ing.name}</span>
                    <span className="font-medium text-gray-500">{ing.measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Instructions</h3>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {recipe.instructions}
              </div>

              {/* Links */}
              <div className="flex gap-4 pt-6">
                {recipe.sourceUrl && (
                  <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">
                    <Globe size={14} /> View Source
                  </a>
                )}
                {recipe.youtubeUrl && (
                  <a href={recipe.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full transition-colors">
                    <Youtube size={14} /> Watch Video
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
