
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Search, Plus, Send, Mic, Bot, MousePointer2 } from 'lucide-react';
import { getAiClient } from '../services/geminiService';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const AgentView: React.FC = () => {
  const [url, setUrl] = useState('google.com');
  const [currentSite, setCurrentSite] = useState<string>('google');
  const [iframeSrc, setIframeSrc] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
      { role: 'ai', text: "I'm your agentic companion. I can browse these supported apps for you. Where should we go?" }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // Percentage
  const [showCursor, setShowCursor] = useState(false);

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
      // Scroll chat to bottom
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateCursorMove = (targetX: number, targetY: number, callback?: () => void) => {
      setShowCursor(true);
      // Smooth transition handled by CSS, just set state
      setCursorPos({ x: targetX, y: targetY });
      
      setTimeout(() => {
          if (callback) callback();
      }, 1000); // Wait for transition
  };

  const handleAgentAction = async (query: string) => {
      setIsThinking(true);
      
      // 1. Ask Gemini for intent
      const ai = getAiClient();
      const prompt = `
        You are an autonomous browser agent.
        User Query: "${query}"
        Current Site: "${currentSite}"
        Available Sites to navigate to: ${JSON.stringify(SITE_NAMES)}
        
        Capabilities:
        1. NAVIGATE: Go to one of the available sites.
        2. GOOGLE_SEARCH: If the user wants to search for something general.
        3. EXPLAIN: Explain what is on the current site based on its name.
        4. SCROLL: Simulate scrolling (just return text saying you are scrolling).
        
        Return ONLY a JSON object:
        {
            "action": "NAVIGATE" | "GOOGLE_SEARCH" | "EXPLAIN" | "SCROLL",
            "target": "site_key_from_list" (only for NAVIGATE),
            "search_query": "query" (only for GOOGLE_SEARCH),
            "response_text": "text to say to user"
        }
      `;

      try {
          const result = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt
          });
          
          const text = result.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
          const action = JSON.parse(text);

          // 2. Execute Action
          if (action.action === 'NAVIGATE' && action.target && SITES[action.target]) {
              simulateCursorMove(20, 10, () => { // Move to address bar area
                  setCurrentSite(action.target);
                  setUrl(SITES[action.target]);
                  setIframeSrc(SITES[action.target]);
                  setMessages(prev => [...prev, { role: 'ai', text: action.response_text || `Navigating to ${action.target}...` }]);
              });
          } 
          else if (action.action === 'GOOGLE_SEARCH') {
              simulateCursorMove(50, 40, () => { // Move to center
                  setCurrentSite('google');
                  setUrl(`google.com/search?q=${action.search_query}`);
                  setIframeSrc(''); // Render custom google view
                  setMessages(prev => [...prev, { role: 'ai', text: action.response_text || `Searching Google for "${action.search_query}"...` }]);
              });
          }
          else {
              // Just talk
              setMessages(prev => [...prev, { role: 'ai', text: action.response_text || "I can help you browse specific apps." }]);
          }

      } catch (e) {
          console.error(e);
          setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to the agent brain." }]);
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

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-black overflow-hidden animate-fadeIn">
      
      {/* LEFT: BROWSER SIMULATION */}
      <div className="flex-1 flex flex-col border-r border-white/10 bg-zinc-900 relative">
          
          {/* Browser Header */}
          <div className="h-14 bg-zinc-900 border-b border-white/10 flex items-center px-4 gap-4">
              <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="flex gap-4 text-zinc-500">
                  <ArrowLeft size={16} />
                  <ArrowRight size={16} />
                  <RotateCw size={16} />
              </div>
              {/* Address Bar */}
              <div className="flex-1 h-9 bg-black rounded-lg flex items-center px-3 text-xs text-zinc-400 gap-2 font-mono">
                  <Lock size={12} className="text-green-500" />
                  <span className="truncate">{currentSite === 'google' ? url : SITES[currentSite]}</span>
              </div>
              <div className="flex gap-3 text-zinc-500">
                  <Plus size={16} />
              </div>
          </div>

          {/* Browser Content */}
          <div className="flex-1 relative bg-white w-full h-full overflow-hidden" ref={browserRef}>
              
              {/* Ghost Cursor */}
              <div 
                className={`absolute z-50 pointer-events-none transition-all duration-1000 ease-in-out ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                    left: `${cursorPos.x}%`, 
                    top: `${cursorPos.y}%`,
                    transform: 'translate(-50%, -50%)'
                }}
              >
                  <MousePointer2 size={32} className="text-black fill-black stroke-white stroke-2 drop-shadow-xl" />
                  <div className="absolute top-6 left-4 bg-black text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap">
                      Agent
                  </div>
              </div>

              {currentSite === 'google' ? (
                  // Simulated Google View
                  <div className="w-full h-full bg-[#202124] text-white flex flex-col items-center justify-center p-8 overflow-y-auto">
                      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
                          <h1 className="text-6xl font-bold tracking-tighter">Google</h1>
                          <div className="w-full h-12 rounded-full bg-[#303134] border border-[#5f6368] flex items-center px-6 text-zinc-400">
                              <Search size={18} className="mr-3" />
                              {url.includes('?q=') ? decodeURIComponent(url.split('?q=')[1]) : 'Search Google or type a URL'}
                          </div>
                          
                          {url.includes('?q=') && (
                              <div className="w-full space-y-6 mt-8">
                                  {[1, 2, 3].map(i => (
                                      <div key={i} className="space-y-1">
                                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                                              <div className="w-6 h-6 rounded-full bg-zinc-700"></div>
                                              <span>Result Source {i}</span>
                                          </div>
                                          <div className="text-blue-400 text-xl font-medium hover:underline">Simulated Search Result Title {i}</div>
                                          <div className="text-zinc-400 text-sm">This is a simulated description of the search result provided by the agentic browser experience.</div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
              ) : (
                  // Iframe View
                  <iframe 
                      src={iframeSrc} 
                      className="w-full h-full border-0"
                      title="Agent Browser"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                  />
              )}
              
              {/* Overlay to prevent user clicks if desired, or allow them */}
              {/* <div className="absolute inset-0 bg-transparent" /> */}
          </div>
      </div>

      {/* RIGHT: AGENT CHAT */}
      <div className="w-full md:w-[400px] bg-black border-l border-white/10 flex flex-col shrink-0">
          
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Bot size={20} className="text-purple-400" /> Agent Companion
                  </h2>
                  <p className="text-xs text-zinc-500">Autonomous Navigation Active</p>
              </div>
              <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                          msg.role === 'user' 
                          ? 'bg-white text-black rounded-tr-sm' 
                          : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-sm'
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
                      className="w-full bg-black border border-zinc-800 rounded-full pl-4 pr-12 py-4 text-sm text-white focus:ring-2 focus:ring-white/20 outline-none transition-all placeholder-zinc-600"
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
                  {Object.keys(SITES).filter(k => k !== 'google').map(site => (
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
