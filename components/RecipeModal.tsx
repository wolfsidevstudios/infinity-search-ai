
import React from 'react';
import { ArrowLeft, Globe, Youtube, ChefHat, ExternalLink } from 'lucide-react';
import { Recipe } from '../services/recipeService';

interface RecipeDetailViewProps {
  recipe: Recipe | null;
  onBack: () => void;
}

const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, onBack }) => {
  if (!recipe) return null;

  return (
    <div className="w-full h-full bg-[#0a0a0a] overflow-y-auto animate-fadeIn relative">
        {/* Header Image Section */}
        <div className="relative h-[50vh] w-full shrink-0">
            <img src={recipe.thumbnail} className="w-full h-full object-cover" alt={recipe.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
            
            <button 
                onClick={onBack}
                className="absolute top-6 left-6 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all group z-50 shadow-lg"
            >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-6xl mx-auto">
                 <div className="flex items-center gap-3 mb-4 animate-slideUp">
                     <span className="px-4 py-1.5 rounded-full bg-orange-600/90 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg">
                         <ChefHat size={14} /> {recipe.category}
                     </span>
                     <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center gap-2">
                         <Globe size={14} /> {recipe.area}
                     </span>
                 </div>
                 <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-2xl mb-4 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    {recipe.title}
                 </h1>
            </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
            {/* Sidebar (Ingredients) */}
            <div className="lg:col-span-1 space-y-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="bg-zinc-900/50 rounded-[32px] p-8 border border-white/5 shadow-xl">
                    <h3 className="text-2xl font-bold text-orange-400 mb-6 font-serif border-b border-white/5 pb-4">Ingredients</h3>
                    <ul className="space-y-4">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex justify-between items-start pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                <span className="text-zinc-200 font-medium">{ing.name}</span>
                                <span className="text-zinc-500 text-sm bg-zinc-800 px-2 py-0.5 rounded font-mono">{ing.measure}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="flex flex-col gap-3">
                    {recipe.youtubeUrl && (
                        <a href={recipe.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-red-900/20 hover:-translate-y-1">
                            <Youtube size={20} /> Watch Video
                        </a>
                    )}
                    {recipe.sourceUrl && (
                        <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-all border border-zinc-700 hover:border-zinc-600 hover:-translate-y-1">
                            <ExternalLink size={20} /> Source Website
                        </a>
                    )}
                </div>
            </div>

            {/* Main (Instructions) */}
            <div className="lg:col-span-2 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Preparation</h3>
                <div className="space-y-10">
                    {recipe.instructions.split('\r\n').filter(p => p.trim()).map((step, idx) => (
                        <div key={idx} className="flex gap-6 group">
                            <div className="flex-shrink-0 w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-xl font-serif font-bold text-orange-400 border border-white/5 group-hover:border-orange-500/30 transition-colors shadow-lg">
                                {idx + 1}
                            </div>
                            <p className="text-xl text-zinc-300 leading-relaxed pt-1 font-light">
                                {step}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default RecipeDetailView;
