
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Search, Plus, Send, Mic, Bot, MousePointer2, ExternalLink, Globe, MapPin, Car, Clock, CreditCard, Star } from 'lucide-react';
import { getAiClient, searchWithGemini } from '../services/geminiService';
import { Source } from '../types';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const AgentView: React.FC = () => {
  // Browser Core State
  const [url, setUrl] = useState('google.com');
  const [currentSite, setCurrentSite] = useState<string>('google');
  const [iframeSrc, setIframeSrc] = useState<string>('');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
      { role: 'ai', text: "I'm your agentic companion. I can browse the web, find information, or book rides for you. Where would you like to go?" }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  // Cursor & Interaction State
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // Percentage 0-100
  const [showCursor, setShowCursor] = useState(false);
  const [clickRipple, setClickRipple] = useState<{x: number, y: number} | null>(null);
  const [typedText, setTypedText] = useState(''); 
  
  // Browser Content State
  const [searchResults, setSearchResults] = useState<Source[]>([]);
  const [browserMode, setBrowserMode] = useState<'home' | 'search_results' | 'iframe' | 'uber'>('home');

  // Uber Simulation State
  const [uberState, setUberState] = useState({
      step: 'home', // home, selection, finding, confirmed
      pickup: 'Current Location',
      destination: '',
      selectedRide: 'uberx',
      price: 0
  });

  const browserRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const SITES: Record<string, string> = {
      'maxilinks': 'https://maxilinks.vercel.app/',
      'infinity': 'https://infinitysearch-ai.vercel.app/',
      'emanuel': 'https://emanuelmartinez.vercel.app/',
      'hotel': 'https://hotelnochistlan.vercel.app/',
      'google': 'google_simulated',
      'uber': 'uber_simulated'
  };

  const SITE_NAMES = Object.keys(SITES);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- ANIMATION ENGINE ---

  const simulateCursorMove = (targetX: number, targetY: number, duration: number = 1000): Promise<void> => {
      return new Promise((resolve) => {
          setShowCursor(true);
          setCursorPos({ x: targetX, y: targetY });
          setTimeout(resolve, duration);
      });
  };

  const simulateClick = async () => {
      setClickRipple(cursorPos);
      setTimeout(() => setClickRipple(null), 400);
      await new Promise(r => setTimeout(r, 400));
  };

  const simulateTyping = async (text: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
      setter('');
      for (let i = 0; i < text.length; i++) {
          setter(prev => prev + text[i]);
          await new Promise(r => setTimeout(r, 30 + Math.random() * 50)); // Natural typing variation
      }
      await new Promise(r => setTimeout(r, 500));
  };

  // --- AGENT INTELLIGENCE ---

  const handleAgentAction = async (query: string) => {
      setIsThinking(true);
      
      const ai = getAiClient();
      const prompt = `
        You are an autonomous browser agent. You control a simulated browser with specific apps.
        
        User Query: "${query}"
        Current Context: URL="${url}", Mode="${browserMode}"
        Available Apps: ${JSON.stringify(SITE_NAMES)}
        
        Capabilities:
        1. NAVIGATE: Go to a specific app/URL.
        2. SEARCH_GOOGLE: Perform a Google search.
        3. UBER_FLOW: If user wants a ride/taxi/uber.
           - If in 'uber' mode and needs destination: "UBER_ENTER_DEST"
           - If selecting ride: "UBER_SELECT_RIDE"
           - If confirming: "UBER_CONFIRM"
        
        Output JSON ONLY:
        {
            "action": "NAVIGATE" | "SEARCH_GOOGLE" | "UBER_INIT" | "UBER_ENTER_DEST" | "UBER_CONFIRM",
            "target": "site_key" (for NAVIGATE),
            "search_term": "string" (for SEARCH_GOOGLE),
            "destination": "string" (for UBER),
            "response_text": "Brief confirmation message to user"
        }
      `;

      try {
          const result = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt
          });
          
          const text = result.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
          const action = JSON.parse(text);

          // ------------------------------------------
          // SCENARIO: GOOGLE SEARCH
          // ------------------------------------------
          if (action.action === 'SEARCH_GOOGLE') {
              setMessages(prev => [...prev, { role: 'ai', text: action.response_text || `Searching Google for "${action.search_term}"...` }]);
              
              if (browserMode !== 'home') {
                  // Navigate home first
                  setUrl('google.com');
                  setBrowserMode('home');
                  await simulateCursorMove(10, 5, 800); // Address bar
                  await simulateClick();
              }

              // Move to Search Bar (Center)
              await simulateCursorMove(50, 45, 1000); 
              await simulateClick();
              
              // Type
              await simulateTyping(action.search_term, setTypedText);
              
              // Move to "Google Search" Button (Center-ish)
              await simulateCursorMove(42, 60, 600);
              await simulateClick();

              // Fetch & Render Results
              const searchData = await searchWithGemini(action.search_term);
              setSearchResults(searchData.sources);
              setBrowserMode('search_results');
              setUrl(`google.com/search?q=${encodeURIComponent(action.search_term)}`);
              setCurrentSite('google');
          } 
          
          // ------------------------------------------
          // SCENARIO: UBER BOOKING
          // ------------------------------------------
          else if (action.action === 'UBER_INIT' || action.action === 'UBER_ENTER_DEST') {
              setMessages(prev => [...prev, { role: 'ai', text: action.response_text || `Opening Uber to go to ${action.destination}...` }]);
              
              // 1. Go to Uber URL if not there
              if (browserMode !== 'uber') {
                  await simulateCursorMove(20, 5, 800); // Address bar
                  await simulateClick();
                  setUrl('uber.com/app');
                  setBrowserMode('uber');
                  setCurrentSite('uber');
                  setUberState(prev => ({...prev, step: 'home'}));
                  await new Promise(r => setTimeout(r, 800)); // Load time
              }

              // 2. Click "Where to?" Input
              if (action.destination) {
                  await simulateCursorMove(50, 35, 1000); // Input box coordinates
                  await simulateClick();
                  
                  // 3. Type Destination
                  await simulateTyping(action.destination, (val) => setUberState(prev => ({...prev, destination: typeof val === 'string' ? val : prev.destination})));
                  
                  // 4. Click First Suggestion
                  await simulateCursorMove(50, 45, 600);
                  await simulateClick();
                  
                  // Transition to Ride Selection
                  setUberState(prev => ({...prev, step: 'selection', price: 14 + Math.random() * 5}));
              }
          }

          else if (action.action === 'UBER_CONFIRM') {
               setMessages(prev => [...prev, { role: 'ai', text: "Confirming your ride now..." }]);
               
               // Move to "UberX" selection
               await simulateCursorMove(50, 60, 800);
               await simulateClick();

               // Move to "Choose UberX" Button (Bottom)
               await simulateCursorMove(50, 90, 800);
               await simulateClick();

               setUberState(prev => ({...prev, step: 'finding'}));
               setTimeout(() => {
                   setUberState(prev => ({...prev, step: 'confirmed'}));
                   setMessages(prev => [...prev, { role: 'ai', text: "Ride confirmed! Your driver, Michael, is 4 minutes away." }]);
               }, 3000);
          }

          // ------------------------------------------
          // SCENARIO: NAVIGATION
          // ------------------------------------------
          else if (action.action === 'NAVIGATE') {
              const target = action.target;
              if (SITES[target]) {
                  setMessages(prev => [...prev, { role: 'ai', text: action.response_text || `Navigating to ${target}...` }]);
                  await simulateCursorMove(20, 5); 
                  await simulateClick();
                  
                  if (target === 'google') setBrowserMode('home');
                  else if (target === 'uber') setBrowserMode('uber');
                  else {
                      setBrowserMode('iframe');
                      setIframeSrc(SITES[target]);
                  }
                  setCurrentSite(target);
                  setUrl(SITES[target]);
              }
          }
          
          else {
              setMessages(prev => [...prev, { role: 'ai', text: action.response_text || "I'm not sure how to do that yet." }]);
          }

      } catch (e) {
          console.error(e);
          setMessages(prev => [...prev, { role: 'ai', text: "I encountered an error processing that command." }]);
      }
      setIsThinking(false);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim()) return;
      const userMsg = input;
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
      setInput('');
      handleAgentAction(userMsg);
  };

  // --- RENDERERS ---

  const renderUberContent = () => {
      return (
          <div className="w-full h-full relative font-sans overflow-hidden bg-gray-100">
              {/* Map Background (Static Image) */}
              <div 
                className="absolute inset-0 z-0 opacity-80" 
                style={{ 
                    backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-74.006,40.7128,13,0/1200x800?access_token=pk.simulated')`,
                    backgroundSize: 'cover',
                    backgroundColor: '#e5e7eb' // Fallback
                }}
              >
                  {/* Fallback Map Pattern if image fails */}
                  <div className="w-full h-full bg-[#f3f4f6] opacity-100" style={{backgroundImage: "radial-gradient(#cbd5e1 2px, transparent 2px)", backgroundSize: "20px 20px"}}></div>
              </div>

              {/* Uber App Interface */}
              <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
                  
                  {/* Top Bar */}
                  <div className="bg-black text-white p-4 flex justify-between items-center shadow-md">
                      <div className="font-bold text-xl tracking-tight">Uber</div>
                      <div className="flex gap-4 text-sm">
                          <span>Ride</span>
                          <span>Package</span>
                      </div>
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xs">JD</span>
                      </div>
                  </div>

                  {/* Main Interaction Area */}
                  <div className="flex-1 flex flex-col justify-end md:justify-center items-center p-4">
                      
                      {/* Booking Card */}
                      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden pointer-events-auto transition-all duration-500">
                          
                          {/* STEP 1: ENTER DESTINATION */}
                          {uberState.step === 'home' && (
                              <div className="p-6">
                                  <h2 className="text-2xl font-bold mb-6">Go anywhere</h2>
                                  <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-4 mb-4 border border-transparent hover:bg-gray-200 transition-colors cursor-text">
                                      <Search size={20} />
                                      {uberState.destination ? (
                                          <span className="text-black font-medium">{uberState.destination}</span>
                                      ) : (
                                          <span className="text-gray-500 font-medium">Where to?</span>
                                      )}
                                  </div>
                                  <div className="flex gap-4 mt-6">
                                      <div className="flex flex-col items-center gap-2">
                                          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center"><Clock size={20}/></div>
                                          <span className="text-xs font-bold">Now</span>
                                      </div>
                                      <div className="flex flex-col items-center gap-2">
                                          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center"><ArrowRight size={20}/></div>
                                          <span className="text-xs font-bold">Later</span>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* STEP 2: RIDE SELECTION */}
                          {uberState.step === 'selection' && (
                              <div className="flex flex-col h-[400px]">
                                  <div className="p-4 border-b">
                                      <div className="flex items-center gap-3">
                                          <ArrowLeft size={20} className="text-gray-500" />
                                          <div className="flex flex-col">
                                              <span className="font-bold text-sm">To {uberState.destination}</span>
                                              <span className="text-xs text-gray-500">Dropoff • 4:45 PM</span>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  {/* Map Preview Area (Simulated) */}
                                  <div className="h-32 bg-gray-100 relative overflow-hidden">
                                      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2">
                                          <div className="w-4 h-4 bg-black rounded-full border-4 border-white shadow-lg"></div>
                                      </div>
                                      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 -translate-x-1/2">
                                          <MapPin className="text-black fill-black" size={24} />
                                      </div>
                                      {/* Route Line */}
                                      <svg className="absolute inset-0 w-full h-full">
                                          <path d="M100,60 Q180,60 280,60" fill="none" stroke="black" strokeWidth="3" strokeDasharray="5,5" />
                                      </svg>
                                  </div>

                                  <div className="flex-1 overflow-y-auto p-2">
                                      <div className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer ${uberState.selectedRide === 'uberx' ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}>
                                          <div className="flex items-center gap-4">
                                              <div className="w-16">
                                                  <Car size={32} />
                                              </div>
                                              <div>
                                                  <div className="font-bold flex items-center gap-2">UberX <UserIcon size={10}/> 4</div>
                                                  <div className="text-xs text-gray-500">4:45 PM</div>
                                              </div>
                                          </div>
                                          <div className="font-bold">${uberState.price.toFixed(2)}</div>
                                      </div>
                                      
                                      <div className="flex items-center justify-between p-3 rounded-xl border-2 border-transparent hover:bg-gray-50 cursor-pointer">
                                          <div className="flex items-center gap-4">
                                              <div className="w-16">
                                                  <Car size={32} className="text-black fill-black" />
                                              </div>
                                              <div>
                                                  <div className="font-bold flex items-center gap-2">Black <UserIcon size={10}/> 3</div>
                                                  <div className="text-xs text-gray-500">4:48 PM</div>
                                              </div>
                                          </div>
                                          <div className="font-bold">${(uberState.price * 1.8).toFixed(2)}</div>
                                      </div>
                                  </div>

                                  <div className="p-4 border-t bg-white">
                                      <div className="flex justify-between items-center mb-4">
                                          <div className="flex items-center gap-2 text-sm font-bold">
                                              <CreditCard size={16} /> Personal •••• 4242
                                          </div>
                                      </div>
                                      <button className="w-full bg-black text-white font-bold py-3 rounded-lg text-lg hover:bg-gray-900 transition-colors">
                                          Choose UberX
                                      </button>
                                  </div>
                              </div>
                          )}

                          {/* STEP 3: FINDING DRIVER / CONFIRMED */}
                          {(uberState.step === 'finding' || uberState.step === 'confirmed') && (
                              <div className="p-6 text-center">
                                  {uberState.step === 'finding' ? (
                                      <div className="py-10">
                                          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
                                          <h3 className="font-bold text-xl mb-2">Connecting to a driver...</h3>
                                      </div>
                                  ) : (
                                      <div className="py-6 animate-fadeIn">
                                          <div className="flex justify-between items-start mb-6">
                                              <div className="text-left">
                                                  <h3 className="text-xs font-bold text-gray-500 uppercase">Driver</h3>
                                                  <div className="text-xl font-bold">Michael</div>
                                                  <div className="flex items-center gap-1 text-sm"><Star size={12} fill="black"/> 4.95</div>
                                              </div>
                                              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                                                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Driver" />
                                              </div>
                                          </div>
                                          
                                          <div className="flex justify-between items-center mb-8">
                                              <div className="text-left">
                                                  <h3 className="text-xs font-bold text-gray-500 uppercase">Car</h3>
                                                  <div className="text-lg font-bold">Toyota Camry</div>
                                                  <div className="text-sm bg-gray-100 px-2 rounded inline-block">HSW 882</div>
                                              </div>
                                              <div>
                                                  <Car size={48} />
                                              </div>
                                          </div>

                                          <div className="bg-black text-white p-4 rounded-xl flex justify-between items-center">
                                              <span className="font-bold">Arriving in 4 min</span>
                                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          )}

                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const renderBrowserContent = () => {
      if (browserMode === 'uber') return renderUberContent();

      if (browserMode === 'home') {
          return (
              <div className="w-full h-full bg-[#202124] text-white flex flex-col items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-8 max-w-2xl w-full">
                      <h1 className="text-[5rem] font-bold tracking-tighter text-white drop-shadow-2xl">Google</h1>
                      <div className="w-full h-14 rounded-full bg-[#303134] border border-[#5f6368] flex items-center px-6 text-zinc-400 shadow-lg relative">
                          <Search size={20} className="mr-4" />
                          <span className={`${typedText ? 'text-white' : 'text-zinc-500'}`}>
                              {typedText || 'Search Google or type a URL'}
                          </span>
                          {typedText && <div className="w-0.5 h-5 bg-blue-500 ml-1 animate-pulse"></div>}
                      </div>
                      <div className="flex gap-4">
                          <button className="px-6 py-2 bg-[#303134] hover:bg-[#3c4043] rounded border border-[#303134] text-sm text-[#e8eaed]">Google Search</button>
                          <button className="px-6 py-2 bg-[#303134] hover:bg-[#3c4043] rounded border border-[#303134] text-sm text-[#e8eaed]">I'm Feeling Lucky</button>
                      </div>
                  </div>
              </div>
          );
      }

      if (browserMode === 'search_results') {
          return (
              <div className="w-full h-full bg-[#202124] text-[#e8eaed] overflow-y-auto">
                  {/* Sticky Header */}
                  <div className="sticky top-0 bg-[#202124] border-b border-[#3c4043] p-6 flex items-center gap-8 z-10">
                      <span className="text-2xl font-bold tracking-tighter">Google</span>
                      <div className="flex-1 h-10 rounded-full bg-[#303134] border border-[#5f6368] flex items-center px-4 text-white text-sm shadow-inner">
                          {decodeURIComponent(url.split('q=')[1] || '')}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs">A</div>
                  </div>

                  {/* Results List */}
                  <div className="max-w-3xl px-6 py-8 space-y-8">
                      <div className="text-sm text-[#9aa0a6]">About {searchResults.length} results (0.42 seconds)</div>
                      
                      {searchResults.map((result, idx) => (
                          <div key={idx} className="group cursor-pointer" onClick={() => {
                              setUrl(result.uri);
                              setIframeSrc(result.uri);
                              setBrowserMode('iframe');
                          }}>
                              <div className="flex items-center gap-2 text-sm text-[#dadce0] mb-1">
                                  <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center">
                                      <Globe size={14} className="text-[#9aa0a6]" />
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="truncate max-w-xs">{result.hostname}</span>
                                      <span className="text-xs text-[#9aa0a6] truncate max-w-xs">{result.uri}</span>
                                  </div>
                              </div>
                              <h3 className="text-xl text-[#8ab4f8] group-hover:underline mb-1 truncate">{result.title}</h3>
                              <p className="text-sm text-[#bdc1c6] leading-relaxed line-clamp-2">
                                  {result.title} - Comprehensive search results provided by the agent. Click to navigate to this result.
                              </p>
                          </div>
                      ))}
                      
                      {searchResults.length === 0 && (
                          <div className="text-[#bdc1c6]">No results found.</div>
                      )}
                  </div>
              </div>
          );
      }

      if (browserMode === 'iframe') {
          return (
              <iframe 
                  src={iframeSrc} 
                  className="w-full h-full border-0 bg-white"
                  title="Agent Browser"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
          );
      }
  };

  // Helper component for small user icon
  const UserIcon: React.FC<{size: number}> = ({size}) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
      </svg>
  );

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-black overflow-hidden animate-fadeIn">
      
      {/* LEFT: BROWSER SIMULATION */}
      <div className="flex-1 flex flex-col border-r border-white/10 bg-zinc-900 relative">
          
          {/* Browser Chrome (Header) */}
          <div className="h-14 bg-[#202124] border-b border-black flex items-center px-4 gap-4 shrink-0">
              <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex gap-4 text-[#9aa0a6]">
                  <ArrowLeft size={16} className="cursor-pointer hover:text-white" onClick={() => { setBrowserMode('home'); setUrl('google.com'); }} />
                  <ArrowRight size={16} className="opacity-50" />
                  <RotateCw size={16} className="cursor-pointer hover:text-white" onClick={() => setBrowserMode(browserMode)} />
              </div>
              {/* Address Bar */}
              <div className="flex-1 h-8 bg-[#000000] rounded-full flex items-center px-4 text-xs text-[#9aa0a6] gap-2 font-mono border border-[#3c4043] overflow-hidden">
                  <Lock size={10} className="text-green-500 shrink-0" />
                  <span className="truncate">{url}</span>
              </div>
          </div>

          {/* Browser Viewport */}
          <div className="flex-1 relative w-full h-full overflow-hidden" ref={browserRef}>
              
              {/* Simulated Content */}
              {renderBrowserContent()}

              {/* Ghost Cursor Overlay */}
              <div 
                className={`absolute z-50 pointer-events-none transition-all ease-in-out ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                    left: `${cursorPos.x}%`, 
                    top: `${cursorPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    transitionDuration: '800ms'
                }}
              >
                  <MousePointer2 size={32} className="text-black fill-black stroke-white stroke-2 drop-shadow-xl" />
                  <div className="absolute top-6 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap shadow-lg">
                      Agent
                  </div>
              </div>

              {/* Click Ripple */}
              {clickRipple && (
                  <div 
                      className="absolute w-8 h-8 rounded-full bg-blue-500/50 animate-ping pointer-events-none"
                      style={{ left: `${clickRipple.x}%`, top: `${clickRipple.y}%`, transform: 'translate(-50%, -50%)' }}
                  />
              )}
          </div>
      </div>

      {/* RIGHT: AGENT CHAT */}
      <div className="w-full md:w-[400px] bg-black border-l border-white/10 flex flex-col shrink-0 relative z-20">
          
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/50 backdrop-blur">
              <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Bot size={20} className="text-purple-400" /> Agent Companion
                  </h2>
                  <p className="text-xs text-zinc-500">Autonomous Navigation Active</p>
              </div>
              <div className="flex gap-2">
                  <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-sm' 
                          : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-tl-sm'
                      }`}>
                          {msg.text}
                      </div>
                  </div>
              ))}
              {isThinking && (
                  <div className="flex justify-start">
                      <div className="bg-zinc-900 rounded-2xl p-4 flex gap-2 items-center border border-zinc-800">
                          <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                  </div>
              )}
              <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-zinc-900/50">
              <form onSubmit={handleSendMessage} className="relative">
                  <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="e.g. Get me a ride to Airport"
                      className="w-full bg-black border border-zinc-800 rounded-full pl-4 pr-12 py-4 text-sm text-white focus:ring-2 focus:ring-blue-900/50 outline-none transition-all placeholder-zinc-600"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button type="button" className="p-2 text-zinc-500 hover:text-white transition-colors">
                          <Mic size={18} />
                      </button>
                      <button 
                        type="submit" 
                        disabled={!input.trim() || isThinking}
                        className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <Send size={16} />
                      </button>
                  </div>
              </form>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  <button 
                    onClick={() => handleAgentAction("Search Google for AI trends")}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 border border-zinc-700 whitespace-nowrap transition-colors"
                  >
                      Search Google
                  </button>
                  <button 
                    onClick={() => handleAgentAction("Get me an uber to Downtown")}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 border border-zinc-700 whitespace-nowrap transition-colors"
                  >
                      Book Uber
                  </button>
                  {SITE_NAMES.filter(k => k !== 'google' && k !== 'uber').map(site => (
                      <button 
                        key={site}
                        onClick={() => handleAgentAction(`Go to ${site}`)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 border border-zinc-700 whitespace-nowrap transition-colors capitalize"
                      >
                          {site}
                      </button>
                  ))}
              </div>
          </div>

      </div>

    </div>
  );
};

export default AgentView;
