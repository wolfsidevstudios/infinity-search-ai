
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Search, Plus, Send, Mic, Bot, MousePointer2, ExternalLink, Globe } from 'lucide-react';
import { getAiClient, searchWithGemini } from '../services/geminiService';
import { Source } from '../types';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const AgentView: React.FC = () => {
  const [url, setUrl] = useState('google.com');
  const [currentSite, setCurrentSite] = useState<string>('google');
  const [iframeSrc, setIframeSrc] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
      { role: 'ai', text: "I'm your agentic companion. I can browse the web and specific apps for you. What would you like to do?" }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  // Interaction State
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // Percentage
  const [showCursor, setShowCursor] = useState(false);
  const [clickRipple, setClickRipple] = useState<{x: number, y: number} | null>(null);
  const [typedText, setTypedText] = useState(''); // For search bar typing simulation

  // Browser State
  const [searchResults, setSearchResults] = useState<Source[]>([]);
  const [browserMode, setBrowserMode] = useState<'home' | 'search_results' | 'iframe'>('home');

  const browserRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const SITES: Record<string, string> = {
      'maxilinks': 'https://maxilinks.vercel.app/',
      'infinity': 'https://infinitysearch-ai.vercel.app/',
      'emanuel': 'https://emanuelmartinez.vercel.app/',
      'hotel': 'https://hotelnochistlan.vercel.app/',
      'google': 'google_simulated'
  };

  const SITE_NAMES = Object.keys(SITES);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- ANIMATION HELPERS ---

  const simulateCursorMove = (targetX: number, targetY: number, duration: number = 1000): Promise<void> => {
      return new Promise((resolve) => {
          setShowCursor(true);
          setCursorPos({ x: targetX, y: targetY });
          setTimeout(resolve, duration);
      });
  };

  const simulateClick = async () => {
      setClickRipple(cursorPos);
      setTimeout(() => setClickRipple(null), 500);
      await new Promise(r => setTimeout(r, 300));
  };

  const simulateTyping = async (text: string) => {
      setTypedText('');
      for (let i = 0; i < text.length; i++) {
          setTypedText(prev => prev + text[i]);
          await new Promise(r => setTimeout(r, 50 + Math.random() * 50)); // Random typing speed
      }
      await new Promise(r => setTimeout(r, 500)); // Pause after typing
  };

  // --- AGENT LOGIC ---

  const handleAgentAction = async (query: string) => {
      setIsThinking(true);
      
      const ai = getAiClient();
      const prompt = `
        You are an autonomous browser agent controlling a simulated browser.
        User Query: "${query}"
        Current URL: "${url}"
        Available Apps: ${JSON.stringify(SITE_NAMES)}
        
        Capabilities:
        1. NAVIGATE: Go to a specific app from the list or a full URL.
        2. SEARCH: Perform a Google search for the user.
        3. EXPLAIN: Explain what is currently visible.
        
        Return ONLY a JSON object:
        {
            "action": "NAVIGATE" | "SEARCH" | "EXPLAIN",
            "target": "site_key_or_url" (for NAVIGATE),
            "search_query": "query_string" (for SEARCH),
            "response_text": "brief confirmation to user"
        }
      `;

      try {
          const result = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt
          });
          
          const text = result.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
          const action = JSON.parse(text);

          // ACTION: SEARCH GOOGLE
          if (action.action === 'SEARCH') {
              setMessages(prev => [...prev, { role: 'ai', text: action.response_text || `Searching for "${action.search_query}"...` }]);
              
              // 1. Move to search bar
              await simulateCursorMove(50, 40);
              await simulateClick();
              
              // 2. Type query
              await simulateTyping(action.search_query);
              
              // 3. Move to button and click
              await simulateCursorMove(85, 40, 500); // Near search button
              await simulateClick();

              // 4. Execute Search
              const searchData = await searchWithGemini(action.search_query);
              setSearchResults(searchData.sources);
              setBrowserMode('search_results');
              setUrl(`google.com/search?q=${encodeURIComponent(action.search_query)}`);
              setCurrentSite('google');
          } 
          
          // ACTION: NAVIGATE APP
          else if (action.action === 'NAVIGATE') {
              const target = action.target;
              
              // Check if it's a known app
              if (SITES[target]) {
                  setMessages(prev => [...prev, { role: 'ai', text: action.response_text || `Opening ${target}...` }]);
                  
                  // Move to address bar
                  await simulateCursorMove(20, 5); 
                  await simulateClick();
                  
                  setBrowserMode('iframe');
                  setCurrentSite(target);
                  setUrl(SITES[target]);
                  setIframeSrc(SITES[target]);
              } else {
                  // External URL attempt
                  setMessages(prev => [...prev, { role: 'ai', text: `Navigating to external site: ${target}` }]);
                  setBrowserMode('iframe');
                  setUrl(target);
                  setIframeSrc(target);
              }
          }
          
          else {
              setMessages(prev => [...prev, { role: 'ai', text: action.response_text || "I'm ready to browse." }]);
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

  // --- BROWSER RENDERER ---

  const renderBrowserContent = () => {
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
                  <ArrowLeft size={16} className="cursor-pointer hover:text-white" onClick={() => setBrowserMode('home')} />
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
                className={`absolute z-50 pointer-events-none transition-all ease-out ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                    left: `${cursorPos.x}%`, 
                    top: `${cursorPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    transitionDuration: '1s'
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
                      placeholder="Ask agent to navigate..."
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
                  {SITE_NAMES.filter(k => k !== 'google').map(site => (
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
