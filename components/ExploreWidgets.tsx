import React, { useState, useEffect } from 'react';
import { Calculator, Palette, Clock, Timer, FileText, Scale, Lightbulb, Activity, Wind, Circle, Fuel, Map, Cat } from 'lucide-react';
import { fetchGasPrices, GasPrice } from '../services/gasService';
import { fetchCityOfTheDay, CityData } from '../services/geoService';
import { fetchCatOfTheDay, CatData } from '../services/catService';

const ExploreWidgets: React.FC = () => {
  // Widget 1: Calculator State
  const [calcInput, setCalcInput] = useState('');
  
  // Widget 4: Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Widget 8: World Clock
  const [time, setTime] = useState(new Date());

  // Widget 6: Converter
  const [kg, setKg] = useState<number | ''>('');

  // New Widgets State
  const [gasPrices, setGasPrices] = useState<GasPrice[]>([]);
  const [city, setCity] = useState<CityData | null>(null);
  const [cat, setCat] = useState<CatData | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      let interval: any;
      if (timerRunning && timeLeft > 0) {
          interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      }
      return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  useEffect(() => {
      // Load New Data
      fetchGasPrices().then(setGasPrices);
      fetchCityOfTheDay().then(setCity);
      fetchCatOfTheDay().then(setCat);
  }, []);

  const evalCalc = () => {
      try {
          // eslint-disable-next-line no-eval
          setCalcInput(String(eval(calcInput))); 
      } catch {
          setCalcInput('Error');
      }
  };

  const widgetClass = "bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 flex flex-col shadow-lg relative overflow-hidden group hover:border-white/20 transition-all";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full pb-20">
      
      {/* 1. Calculator */}
      <div className={widgetClass}>
          <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Calculator size={14} /> Mini Calc
          </div>
          <input 
            className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-right text-white font-mono text-xl mb-3 outline-none" 
            value={calcInput} 
            readOnly 
          />
          <div className="grid grid-cols-4 gap-2">
              {[7,8,9,'/',4,5,6,'*',1,2,3,'-',0,'C','=','+'].map(k => (
                  <button 
                    key={k} 
                    onClick={() => {
                        if (k === '=') evalCalc();
                        else if (k === 'C') setCalcInput('');
                        else setCalcInput(prev => prev + k);
                    }}
                    className={`h-10 rounded-lg text-sm font-bold transition-colors ${k === '=' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                  >
                      {k}
                  </button>
              ))}
          </div>
      </div>

      {/* 2. Color Palette */}
      <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Palette size={14} /> Daily Palette
          </div>
          <div className="flex-1 flex gap-2 h-full">
               {['#FF5733', '#33FF57', '#3357FF', '#F333FF'].map(c => (
                   <div key={c} className="flex-1 rounded-xl h-24 relative group/color cursor-pointer" style={{ backgroundColor: c }} onClick={() => navigator.clipboard.writeText(c)}>
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity">
                           <span className="text-[10px] bg-black/50 text-white px-1 rounded backdrop-blur-md">{c}</span>
                       </div>
                   </div>
               ))}
          </div>
      </div>

      {/* 3. Daily Fact */}
      <div className={`${widgetClass} md:col-span-2`}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Lightbulb size={14} className="text-yellow-500" /> Did you know?
          </div>
          <p className="text-lg text-white font-light leading-relaxed">
              "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible."
          </p>
      </div>

      {/* 4. Pomodoro Timer */}
      <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Timer size={14} /> Pomodoro
          </div>
          <div className="flex flex-col items-center justify-center flex-1">
              <div className="text-4xl font-mono font-bold text-white mb-4">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
              <div className="flex gap-2 w-full">
                  <button onClick={() => setTimerRunning(!timerRunning)} className={`flex-1 py-2 rounded-lg font-bold text-sm ${timerRunning ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
                      {timerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button onClick={() => { setTimerRunning(false); setTimeLeft(25*60); }} className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg font-bold text-sm hover:bg-zinc-700">
                      Reset
                  </button>
              </div>
          </div>
      </div>

      {/* 5. Quick Note */}
      <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <FileText size={14} /> Scratchpad
          </div>
          <textarea 
            className="w-full h-full bg-transparent resize-none outline-none text-zinc-300 text-sm placeholder-zinc-600" 
            placeholder="Type quick notes here..."
          ></textarea>
      </div>

      {/* 6. Unit Converter */}
      <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Scale size={14} /> Mass Converter
          </div>
          <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={kg} 
                    onChange={e => setKg(parseFloat(e.target.value))} 
                    className="flex-1 bg-black border border-zinc-800 rounded-lg p-2 text-white outline-none" 
                    placeholder="0"
                  />
                  <span className="text-zinc-500 text-sm font-bold w-8">KG</span>
              </div>
              <div className="text-center text-zinc-600">=</div>
              <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-800/50 border border-zinc-800 rounded-lg p-2 text-zinc-300">
                      {kg ? (kg * 2.20462).toFixed(2) : '0'}
                  </div>
                  <span className="text-zinc-500 text-sm font-bold w-8">LB</span>
              </div>
          </div>
      </div>

      {/* 7. System Status (Mock) */}
      <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Activity size={14} /> System
          </div>
          <div className="space-y-4">
              <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>CPU Load</span>
                      <span>34%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[34%]"></div>
                  </div>
              </div>
              <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                      <span>Memory</span>
                      <span>1.2GB / 8GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 w-[15%]"></div>
                  </div>
              </div>
          </div>
      </div>

      {/* 8. World Clock */}
      <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Clock size={14} /> World Time
          </div>
          <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">New York</span>
                  <span className="text-white font-mono">{time.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">London</span>
                  <span className="text-white font-mono">{time.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Tokyo</span>
                  <span className="text-white font-mono">{time.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
          </div>
      </div>

      {/* 9. Daily Zen */}
      <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Wind size={14} /> Daily Zen
          </div>
          <div className="flex-1 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 flex items-center justify-center animate-pulse border border-teal-500/30">
                  <div className="text-xs text-teal-200 font-medium">Breathe</div>
              </div>
          </div>
      </div>

       {/* 10. Status Indicator */}
       <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Circle size={14} /> Network
          </div>
          <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
              <div>
                  <div className="text-white font-bold">Online</div>
                  <div className="text-xs text-zinc-500">Latency: 24ms</div>
              </div>
          </div>
      </div>

      {/* 11. Gas Prices (New) */}
      <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Fuel size={14} className="text-red-400" /> Fuel Prices
          </div>
          <div className="space-y-3">
              {gasPrices.slice(0, 4).map((price, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                      <span className="text-zinc-300 font-medium">{price.name}</span>
                      <div className="flex flex-col items-end">
                          <span className="text-white font-mono font-bold">${price.gasoline}</span>
                          <span className="text-[10px] text-zinc-500">Reg</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* 12. City of the Day (New) */}
      <div className={widgetClass}>
           <div className="flex items-center gap-2 mb-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Map size={14} className="text-blue-400" /> City of the Day
          </div>
          {city ? (
              <div className="flex flex-col h-full justify-between">
                  <div>
                      <h3 className="text-xl font-bold text-white leading-tight mb-1">{city.name}</h3>
                      <p className="text-sm text-zinc-400">{city.region}, {city.countryCode}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-end">
                          <div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold">Population</div>
                              <div className="text-lg font-mono text-white">{(city.population / 1000000).toFixed(1)}M</div>
                          </div>
                          <div className="text-right">
                              <div className="text-[10px] text-zinc-500 uppercase font-bold">Explorer Score</div>
                              <div className="text-lg font-bold text-green-400">9.2</div>
                          </div>
                      </div>
                  </div>
              </div>
          ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">Loading City...</div>
          )}
      </div>

      {/* 13. Cat of the Day (New) */}
      <div className={`${widgetClass} p-0`}>
           {cat ? (
               <>
                   <img src={cat.url} alt="Cat" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                   <div className="absolute top-6 left-6 flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wider z-10">
                      <Cat size={14} /> Cat of the Day
                   </div>
                   <div className="absolute bottom-6 left-6 right-6 z-10">
                       <h3 className="text-xl font-bold text-white leading-tight mb-1">
                           {cat.breeds?.[0]?.name || 'Mystery Cat'}
                       </h3>
                       <p className="text-xs text-zinc-300 line-clamp-2">
                           {cat.breeds?.[0]?.temperament || 'A cute furry friend.'}
                       </p>
                   </div>
               </>
           ) : (
               <div className="w-full h-full flex items-center justify-center text-zinc-500">
                   <Cat size={32} className="animate-bounce opacity-20" />
               </div>
           )}
      </div>

    </div>
  );
};

export default ExploreWidgets;