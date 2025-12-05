
import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, TrendingUp, TrendingDown, Newspaper, MapPin, Bone, Utensils, Trophy, PlayCircle, ArrowRight } from 'lucide-react';
import { fetchWeather, getWeatherIcon, WeatherData } from '../services/weatherService';
import { fetchMarketData, StockData } from '../services/stockService';
import { fetchNews } from '../services/newsService';
import { fetchRandomDog, DogData } from '../services/dogService';
import { fetchSportsNews } from '../services/sportsService';
import { fetchRandomRecipes, Recipe } from '../services/recipeService';
import { NewsArticle } from '../types';
import RecipeModal from './RecipeModal';

const DashboardWidgets: React.FC = () => {
  // Data State
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [sportsNews, setSportsNews] = useState<NewsArticle[]>([]);
  const [dog, setDog] = useState<DogData | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  // UI State
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    // 1. Weather
    const loadWeather = async () => {
        try {
             if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => setWeather(await fetchWeather(pos.coords.latitude, pos.coords.longitude)),
                    async () => setWeather(await fetchWeather(40.7128, -74.0060))
                );
            } else {
                setWeather(await fetchWeather(40.7128, -74.0060));
            }
        } catch(e) { console.error(e); }
    };
    loadWeather();

    // 2. Stocks
    fetchMarketData().then(setStocks);

    // 3. News (Global)
    fetchNews().then(setNews);

    // 4. Dog
    fetchRandomDog().then(setDog);

    // 5. Sports
    fetchSportsNews().then(setSportsNews);

    // 6. Recipes
    fetchRandomRecipes(5).then(setRecipes);
  }, []);

  // Autosliders
  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => setCurrentNewsIndex(p => (p + 1) % news.length), 6000);
    return () => clearInterval(interval);
  }, [news]);

  useEffect(() => {
    if (recipes.length === 0) return;
    const interval = setInterval(() => setCurrentRecipeIndex(p => (p + 1) % recipes.length), 5000);
    return () => clearInterval(interval);
  }, [recipes]);


  // Helper Renderers
  const renderWeatherIcon = (code: number | undefined) => {
      const iconType = code !== undefined ? getWeatherIcon(code) : 'sunny';
      switch (iconType) {
          case 'partly-cloudy': return <Cloud className="text-yellow-100" size={32} />;
          case 'fog': return <Wind className="text-gray-300" size={32} />;
          case 'rain': return <CloudRain className="text-blue-300" size={32} />;
          case 'snow': return <CloudSnow className="text-white" size={32} />;
          case 'storm': return <CloudLightning className="text-purple-300" size={32} />;
          case 'cloudy': return <Cloud className="text-gray-200" size={32} />;
          default: return <Sun className="text-yellow-400" size={32} />;
      }
  };

  const currentArticle = news[currentNewsIndex];
  const currentRecipe = recipes[currentRecipeIndex];

  // Common Widget Style
  const widgetClass = "rounded-[32px] overflow-hidden shadow-lg border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl relative group";

  return (
    <div className="w-full max-w-6xl mx-auto px-2 mt-4 space-y-6 animate-slideUp">
      
      {/* ROW 1: Stocks(3), Weather(3), Dog(2), Recipes(4) = 12 Cols */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* 1. Market Watch (3 cols) */}
        <div className={`md:col-span-3 ${widgetClass} bg-white/80 p-5 flex flex-col`}>
             <div className="flex items-center justify-between mb-3">
                 <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">Markets</h3>
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             </div>
             <div className="flex-1 flex flex-col justify-center gap-3">
                 {stocks.slice(0, 3).map(s => (
                     <div key={s.symbol} className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2">
                             <div className="font-bold text-gray-800">{s.symbol}</div>
                             <div className={`text-[10px] ${s.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                 {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
                             </div>
                         </div>
                         <div className="font-mono text-gray-700">${s.price.toFixed(2)}</div>
                     </div>
                 ))}
             </div>
        </div>

        {/* 2. Weather (3 cols) */}
        <div className={`md:col-span-3 ${widgetClass} bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5`}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 opacity-80 text-[10px] font-bold uppercase tracking-wider mb-1">
                        <MapPin size={10} /> {weather?.city || 'Locating...'}
                    </div>
                    <div className="text-4xl font-bold tracking-tighter">{weather?.temperature ? Math.round(weather.temperature) : '--'}°</div>
                </div>
                <div className="transform scale-110">{renderWeatherIcon(weather?.weathercode)}</div>
            </div>
        </div>

        {/* 3. Dog of the Day (2 cols) */}
        <div className={`md:col-span-2 ${widgetClass} h-[140px] md:h-auto`}>
            {dog ? (
                <>
                    <img src={dog.imageUrl} alt="Dog" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-200 mb-0.5">
                            <Bone size={10} /> Daily Dog
                        </div>
                        <div className="font-bold text-sm capitalize">{dog.breed}</div>
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse" />
            )}
        </div>

        {/* 4. Recipes (4 cols) */}
        <div 
            className={`md:col-span-4 ${widgetClass} cursor-pointer`}
            onClick={() => currentRecipe && setSelectedRecipe(currentRecipe)}
        >
            {currentRecipe ? (
                <>
                    {/* Background Slider */}
                    {recipes.map((r, idx) => (
                        <div 
                            key={r.id}
                            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${idx === currentRecipeIndex ? 'opacity-100' : 'opacity-0'}`}
                            style={{ backgroundImage: `url(${r.thumbnail})` }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-white/20">
                        <Utensils size={10} /> Featured Recipe
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white text-lg font-bold leading-tight mb-1">{currentRecipe.title}</h3>
                        <div className="flex items-center gap-2 text-white/70 text-xs">
                            <span>{currentRecipe.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 group-hover:text-orange-300 transition-colors">View Recipe <ArrowRight size={10} /></span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
        </div>
      </div>


      {/* ROW 2: Global News(8), Sports(4) = 12 cols */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* 5. Global News (8 cols) */}
        <div className={`md:col-span-8 ${widgetClass} min-h-[220px] md:h-[260px]`}>
            {news.map((article, idx) => (
                <div 
                    key={article.url + idx}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${idx === currentNewsIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                    style={{ backgroundImage: `url(${article.urlToImage})` }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
            
            <div className="relative z-10 p-8 h-full flex flex-col justify-between items-start max-w-2xl">
                 <div className="flex items-center gap-2 text-blue-200 bg-blue-900/30 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/30">
                    <Newspaper size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Global Briefing</span>
                </div>

                <div className="mt-auto">
                    {currentArticle && (
                        <div className="animate-slideUp">
                            <div className="text-white/60 text-xs font-bold mb-2 flex gap-2">
                                <span>{currentArticle.source.name}</span>
                                <span>•</span>
                                <span>{new Date(currentArticle.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <h2 
                                className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4 hover:text-blue-200 cursor-pointer transition-colors"
                                onClick={() => window.open(currentArticle.url, '_blank')}
                            >
                                {currentArticle.title}
                            </h2>
                            <p className="text-white/80 line-clamp-2 md:line-clamp-none max-w-lg text-sm font-light">
                                {currentArticle.description}
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Dots */}
                <div className="absolute bottom-6 right-6 flex gap-1.5">
                    {news.slice(0, 5).map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentNewsIndex ? 'bg-white w-6' : 'bg-white/30 w-1.5'}`} />
                    ))}
                </div>
            </div>
        </div>

        {/* 6. Sports (4 cols) */}
        <div className={`md:col-span-4 ${widgetClass} bg-gray-900 overflow-y-auto glass-scroll h-[260px]`}>
            <div className="sticky top-0 bg-gray-900/90 backdrop-blur-xl p-4 border-b border-white/10 z-10 flex justify-between items-center">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <Trophy size={14} className="text-yellow-500" /> Sports Highlights
                </h3>
            </div>
            
            <div className="p-2 space-y-2">
                {sportsNews.length > 0 ? sportsNews.slice(0, 5).map((sport, i) => (
                    <a 
                        key={i} 
                        href={sport.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors group/item"
                    >
                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-800">
                             <img src={sport.urlToImage || ''} alt="sport" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-1 group-hover/item:text-yellow-400 transition-colors">
                                {sport.title}
                            </h4>
                            <div className="flex items-center gap-1 text-[10px] text-white/40">
                                <span>ESPN</span>
                                <span>•</span>
                                <span>{new Date(sport.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    </a>
                )) : (
                    <div className="p-4 text-white/40 text-sm text-center">Loading sports data...</div>
                )}
            </div>
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal 
        recipe={selectedRecipe} 
        onClose={() => setSelectedRecipe(null)} 
      />

    </div>
  );
};

export default DashboardWidgets;
