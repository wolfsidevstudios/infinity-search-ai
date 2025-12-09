
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Search, Plus, Send, Mic, Bot, MousePointer2, ExternalLink, Globe, Eye, MoreHorizontal, Keyboard, Cpu, ScanLine } from 'lucide-react';
import { getAiClient, searchWithGemini } from '../services/geminiService';
import { Source } from '../types';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const AgentView: React.FC = () => {
  // Browser Core State
  const [url, setUrl] = useState('google.com');
  const [iframeSrc, setIframeSrc] = useState<string>('');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
      { role: 'ai', text: "I am your fully autonomous web agent. I can browse the web, interact with apps, and find anything for you. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  // Cursor & Interaction State
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // Percentage 0-100
  const [showCursor, setShowCursor] = useState(false);
  const [clickRipple, setClickRipple] = useState<{x: number, y: number} | null>(null);
  const [typingOverlay, setTypingOverlay] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Browser Content State
  const [searchResults, setSearchResults] = useState<Source[]>([]);
  const [browserMode, setBrowserMode] = useState<'home' | 'search_results' | 'iframe' | 'reading'>('home');
  const [pageContentSummary, setPageContentSummary] = useState<string>('');

  const browserRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const SITES: Record<string, string> = {
      'maxilinks': 'https://maxilinks.vercel.app/',
      'infinity': 'https://infinitysearch-ai.vercel.app/',
      'emanuel': 'https://emanuelmartinez.vercel.app/',
      'hotel': 'https://hotelnochistlan.vercel.app/',
      'google': 'google_simulated',
  };

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- ANIMATION ENGINE ---

  const simulateCursorMove = (targetX: number, targetY: number, duration: number = 800): Promise<void> => {
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

  const simulateTyping = async (text: string) => {
      setTypingOverlay('');
      
      for (let i = 0; i < text.length; i++) {
          const char = text[i];
          setTypingOverlay(prev => (prev || '') + char);
          await new Promise(r => setTimeout(r, 50 + Math.random() * 50)); 
      }
      await new Promise(r => setTimeout(r, 500));
      setTypingOverlay(null);
  };

  const simulateScan = async () => {
      setIsScanning(true);
      await new Promise(r => setTimeout(r, 2000));
      setIsScanning(false);
  }

  // --- AGENT INTELLIGENCE ---

  const handleAgentAction = async (query: string) => {
      setIsThinking(true);
      
      const ai = getAiClient();
      const prompt = `
        You are a highly advanced autonomous web agent. You control a simulated browser.
        User Query: "${query}"
        
        Current State:
        - URL: "${url}"
        - Mode: "${browserMode}"
        - Known Apps: ${Object.keys(SITES).join(', ')}
        
        Your Goal: Break down the user's request into a sequence of browser interactions.
        
        Capabilities:
        1. NAVIGATE(url/app_name): Go to a website.
        2. SEARCH_GOOGLE(term): Use the search engine.
        3. CLICK(x, y, description): Move cursor to percentage coordinates (0-100) and click. Guess the position based on standard UI layouts.
           - Top Left (10, 10): Logo/Home
           - Top Right (90, 10): Login/Profile/Menu
           - Center (50, 50): Main Content/Search Bar
           - Bottom (50, 90): Footer/CTA
        4. TYPE(text): Simulate typing.
        5. SCROLL(direction): 'up' or 'down'.
        6. ANALYZE(): Read the page content.
        
        Response Format (JSON ONLY):
        {
            "actions": [
                { "type": "NAVIGATE", "payload": "target" },
                { "type": "CLICK", "x": 50, "y": 50, "desc": "clicking center" },
                { "type": "TYPE", "text": "hello" },
                { "type": "WAIT", "ms": 1000 },
                { "type": "RESPOND", "text": "I have done X." }
            ]
        }
        
        Example: "Search maxilinks"
        -> NAVIGATE(google) -> CLICK(50, 50, "search bar") -> TYPE(maxilinks) -> CLICK(50, 60, "search btn")
      `;

      try {
          const result = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt
          });
          
          const text = result.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
          const response = JSON.parse(text);

          // Execute Sequence
          for (const action of response.actions) {
              
              if (action.type === 'RESPOND') {
                  setMessages(prev => [...prev, { role: 'ai', text: action.text }]);
              }

              else if (action.type === 'NAVIGATE') {
                  const target = action.payload.toLowerCase();
                  let targetUrl = target;
                  
                  if (SITES[target]) {
                      targetUrl = SITES[target];
                      // Special handling for simulated google
                      if (target === 'google') {
                          setBrowserMode('home');
                          setUrl('google.com');
                      } else {
                          setBrowserMode('iframe');
                          setIframeSrc(targetUrl);
                          setUrl(targetUrl);
                      }
                  } else {
                      // Generic URL navigation
                      if (!target.includes('.')) targetUrl = target + '.com';
                      setUrl(targetUrl);
                      // If we can't embed it, use Reading Mode
                      setBrowserMode('reading');
                      setPageContentSummary("Loading content from external source...");
                  }
                  
                  // Visuals
                  await simulateCursorMove(20, 5, 600); // Address bar
                  await simulateClick();
                  await simulateTyping(targetUrl);
                  await new Promise(r => setTimeout(r, 1000)); // Load
              }

              else if (action.type === 'SEARCH_GOOGLE') {
                  const term = action.payload;
                  if (browserMode !== 'home') {
                      setBrowserMode('home');
                      setUrl('google.com');
                      await new Promise(r => setTimeout(r, 500));
                  }
                  await simulateCursorMove(50, 45, 800);
                  await simulateClick();
                  await simulateTyping(term);
                  await simulateCursorMove(50, 60, 500);
                  await simulateClick();
                  
                  // Perform real search
                  const searchData = await searchWithGemini(term);
                  setSearchResults(searchData.sources);
                  setBrowserMode('search_results');
                  setUrl(`google.com/search?q=${encodeURIComponent(term)}`);
              }

              else if (action.type === 'CLICK') {
                  await simulateCursorMove(action.x, action.y, 800);
                  await simulateClick();
              }

              else if (action.type === 'TYPE') {
                  await simulateTyping(action.text);
              }

              else if (action.type === 'SCROLL') {
                  // Visual scroll
                  if (browserRef.current) {
                      browserRef.current.scrollBy({ top: action.payload === 'down' ? 300 : -300, behavior: 'smooth' });
                  }
                  await new Promise(r => setTimeout(r, 500));
              }
              
              else if (action.type === 'ANALYZE') {
                  await simulateScan();
                  const summary = await searchWithGemini(`Summarize the website: ${url}`);
                  setPageContentSummary(summary.text);
                  setMessages(prev => [...prev, { role: 'ai', text: `I've analyzed the page. ${summary.text.substring(0, 100)}...` }]);
              }

              else if (action.type === 'WAIT') {
                  await new Promise(r => setTimeout(r, action.ms));
              }
          }

      } catch (e) {
          console.error(e);
          setMessages(prev => [...prev, { role: 'ai', text: "I encountered a processing error. Please try a simpler command." }]);
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

  const renderBrowserContent = () => {
      if (browserMode === 'home') {
          return (
              <div className="w-full h-full bg-[#202124] text-white flex flex-col items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-8 max-w-2xl w-full">
                      <h1 className="text-[5rem] font-bold tracking-tighter text-white drop-shadow-2xl select-none">Google</h1>
                      <div className="w-full h-14 rounded-full bg-[#303134] border border-[#5f6368] flex items-center px-6 text-zinc-400 shadow-lg relative">
                          <Search size={20} className="mr-4" />
                          <span className="text-zinc-500">Search Google or type a URL</span>
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
                  <div className="sticky top-0 bg-[#202124] border-b border-[#3c4043] p-6 flex items-center gap-8 z-10">
                      <span className="text-2xl font-bold tracking-tighter">Google</span>
                      <div className="flex-1 h-10 rounded-full bg-[#303134] border border-[#5f6368] flex items-center px-4 text-white text-sm shadow-inner">
                          {decodeURIComponent(url.split('q=')[1] || '')}
                      </div>
                  </div>
                  <div className="max-w-3xl px-6 py-8 space-y-8">
                      {searchResults.map((result, idx) => (
                          <div key={idx} className="group cursor-pointer">
                              <div className="flex items-center gap-2 text-sm text-[#dadce0] mb-1">
                                  <Globe size={14} className="text-[#9aa0a6]" />
                                  <div className="flex flex-col">
                                      <span className="truncate max-w-xs">{result.hostname}</span>
                                      <span className="text-xs text-[#9aa0a6] truncate max-w-xs">{result.uri}</span>
                                  </div>
                              </div>
                              <h3 className="text-xl text-[#8ab4f8] group-hover:underline mb-1 truncate">{result.title}</h3>
                              <p className="text-sm text-[#bdc1c6] leading-relaxed line-clamp-2">
                                  {result.title}
                              </p>
                          </div>
                      ))}
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
                  // Allow interactions but note that we can't programmatically control internal elements due to CORS
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
          );
      }

      if (browserMode === 'reading') {
          return (
              <div className="w-full h-full bg-white flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse border border-gray-200">
                      <Eye size={40} className="text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Page Content</h2>
                  <p className="text-gray-500 mb-8 font-mono text-sm bg-gray-100 px-4 py-1 rounded">{url}</p>
                  
                  {pageContentSummary && (
                      <div className="bg-gray-50 p-6 rounded-2xl max-w-lg border border-gray-200 text-left shadow-sm animate-slideUp">
                          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                              <Bot size={16} className="text-purple-600"/> Agent Analysis
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">{pageContentSummary}</p>
                      </div>
                  )}
              </div>
          );
      }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-black overflow-hidden animate-fadeIn">
      
      {/* LEFT: BROWSER SIMULATION */}
      <div className="flex-1 flex flex-col border-r border-white/10 bg-zinc-900 relative">
          
          {/* Browser Chrome (Header) */}
          <div className="h-14 bg-[#2b2b2b] border-b border-black flex items-center px-4 gap-4 shrink-0 shadow-md z-20">
              <div className="flex gap-2 group">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] group-hover:bg-[#ff5f56]/80 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] group-hover:bg-[#ffbd2e]/80 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] group-hover:bg-[#27c93f]/80 transition-colors"></div>
              </div>
              <div className="flex gap-4 text-[#9aa0a6]">
                  <ArrowLeft size={16} className="cursor-pointer hover:text-white" onClick={() => { setBrowserMode('home'); setUrl('google.com'); }} />
                  <ArrowRight size={16} className="opacity-50" />
                  <RotateCw size={16} className="cursor-pointer hover:text-white" onClick={() => setBrowserMode(browserMode)} />
              </div>
              {/* Address Bar */}
              <div className="flex-1 h-9 bg-[#1a1a1a] rounded-lg flex items-center px-4 text-xs text-[#e8eaed] gap-3 font-mono border border-[#3c3c3c] overflow-hidden shadow-inner group">
                  <Lock size={10} className="text-green-500 shrink-0 group-hover:text-green-400 transition-colors" />
                  <span className="truncate select-none opacity-80">{url}</span>
              </div>
              <MoreHorizontal size={16} className="text-[#9aa0a6]" />
          </div>

          {/* Browser Viewport */}
          <div className="flex-1 relative w-full h-full overflow-hidden bg-white" ref={browserRef}>
              
              {/* Content Layer */}
              {renderBrowserContent()}

              {/* Scanning Overlay Effect */}
              {isScanning && (
                  <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden bg-green-500/5">
                      <div className="w-full h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-[scan_2s_linear_infinite] top-0 absolute"></div>
                      <div className="absolute bottom-4 right-4 bg-black/80 text-green-400 text-xs px-3 py-1 rounded font-mono border border-green-500/30 flex items-center gap-2">
                          <ScanLine size={12} className="animate-spin" /> SCANNING DOM
                      </div>
                  </div>
              )}

              {/* Interaction Layer */}
              
              {/* Ghost Cursor */}
              <div 
                className={`absolute z-50 pointer-events-none transition-all ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                    left: `${cursorPos.x}%`, 
                    top: `${cursorPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    transitionDuration: '800ms'
                }}
              >
                  {/* Cursor Body */}
                  <MousePointer2 size={32} className="text-black fill-black stroke-white stroke-[2px] drop-shadow-2xl" />
                  
                  {/* Typing Bubble */}
                  {typingOverlay && (
                      <div className="absolute top-8 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-xl flex items-center gap-2 animate-slideUp border border-blue-400">
                          <Keyboard size={12} className="text-blue-200" />
                          <span className="font-mono">{typingOverlay}<span className="animate-pulse">|</span></span>
                      </div>
                  )}
                  
                  {/* Action Badge */}
                  {!typingOverlay && (
                      <div className="absolute top-6 left-4 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg border border-white/20 flex items-center gap-1">
                          <Cpu size={10} className="text-purple-400"/> Agent
                      </div>
                  )}
              </div>

              {/* Click Ripple */}
              {clickRipple && (
                  <div 
                      className="absolute w-12 h-12 rounded-full border-2 border-blue-500 bg-blue-500/20 animate-ping pointer-events-none z-40"
                      style={{ left: `${clickRipple.x}%`, top: `${clickRipple.y}%`, transform: 'translate(-50%, -50%)' }}
                  />
              )}
          </div>
      </div>

      {/* RIGHT: AGENT CHAT */}
      <div className="w-full md:w-[400px] bg-black border-l border-white/10 flex flex-col shrink-0 relative z-20 shadow-2xl">
          
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
              <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Bot size={20} className="text-purple-400" /> Infinity Agent
                  </h2>
                  <p className="text-xs text-zinc-500">Autonomous Mode Active</p>
              </div>
              <div className="flex gap-2">
                  <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
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
                  <div className="flex justify-start animate-fadeIn">
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
                      placeholder="Ask me to browse or do anything..."
                      className="w-full bg-black border border-zinc-800 rounded-full pl-4 pr-12 py-4 text-sm text-white focus:ring-2 focus:ring-purple-900/50 outline-none transition-all placeholder-zinc-600 shadow-inner"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button type="button" className="p-2 text-zinc-500 hover:text-white transition-colors">
                          <Mic size={18} />
                      </button>
                      <button 
                        type="submit" 
                        disabled={!input.trim() || isThinking}
                        className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                          <Send size={16} />
                      </button>
                  </div>
              </form>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  <button 
                    onClick={() => handleAgentAction("Go to Maxilinks and search for 'Bio'")}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 border border-zinc-700 whitespace-nowrap transition-colors"
                  >
                      Browse Maxilinks
                  </button>
                  <button 
                    onClick={() => handleAgentAction("Search Google for 'Latest AI News'")}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 border border-zinc-700 whitespace-nowrap transition-colors"
                  >
                      Search Google
                  </button>
                  <button 
                    onClick={() => handleAgentAction("Analyze the content of infinitysearch-ai.vercel.app")}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 border border-zinc-700 whitespace-nowrap transition-colors"
                  >
                      Analyze Site
                  </button>
              </div>
          </div>

      </div>

    </div>
  );
};

export default AgentView;
