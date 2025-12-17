
import React, { useState, useEffect, useRef } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
    Send, Mic, Paperclip, Camera, Image as ImageIcon, FileText, 
    ChevronDown, Zap, Lightbulb, MessageSquare, Bot, Copy, Download, Check, Calculator, Clock, Sparkles, Cpu
} from 'lucide-react';
import { chatWithGemini, getSelectedModel } from '../services/geminiService';
import { HistoryItem, CollectionItem } from '../types';
import { WeatherData } from '../services/weatherService';

interface OsViewProps {
  user: SupabaseUser | null;
  theme?: 'light' | 'dark';
  onLogout: () => void;
  weather: WeatherData | null;
  history: HistoryItem[];
  collections: CollectionItem[];
  onSearch: (query: string) => void;
  onSaveHistory: (item: HistoryItem) => void;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
    widget?: string; // e.g. 'CALCULATOR', 'WEATHER'
}

const MODELS = [
    { id: 'gemma-2-9b', name: 'Gemma 2', icon: <Sparkles size={14} className="text-green-300" /> },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', icon: <Zap size={14} className="text-yellow-400" /> },
    { id: 'gpt-oss-120b', name: 'GPT-OSS', icon: <Cpu size={14} className="text-pink-400" /> },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', icon: <Bot size={14} className="text-blue-400" /> },
    { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro', icon: <Bot size={14} className="text-purple-400" /> },
    { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', icon: <Bot size={14} className="text-orange-400" /> },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', icon: <Bot size={14} className="text-blue-400" /> },
    { id: 'grok-3', name: 'Grok 3', icon: <Bot size={14} className="text-white" /> },
];

const OsView: React.FC<OsViewProps> = ({ user, theme = 'dark', weather, collections, onSaveHistory }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(getSelectedModel());
  const [showModelMenu, setShowModelMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
      if (!input.trim() || isLoading) return;

      const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      const apiHistory = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      apiHistory.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const appContext = `
      Current User: ${user?.user_metadata?.full_name || 'User'}
      Current Date: ${new Date().toLocaleString()}
      Current Weather: ${weather ? `${weather.temperature}° in ${weather.city}` : 'Unknown'}
      Saved Collections: ${collections.length} items.
      Supported widgets: CALCULATOR, CLOCK.
      `;

      const responseText = await chatWithGemini(apiHistory, selectedModel, appContext);

      let widgetType = undefined;
      if (responseText.includes('[WIDGET:CALCULATOR]')) widgetType = 'CALCULATOR';
      if (responseText.includes('[WIDGET:CLOCK]')) widgetType = 'CLOCK';

      const cleanText = responseText.replace(/\[WIDGET:[A-Z]+\]/g, '');
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: cleanText, timestamp: new Date(), widget: widgetType };

      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
      onSaveHistory({ id: Date.now().toString(), type: 'search', title: userMsg.text, summary: cleanText, timestamp: new Date(), sources: [] });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  const selectModel = (id: string) => {
      setSelectedModel(id);
      localStorage.setItem('infinity_ai_model', id);
      setShowModelMenu(false);
  };

  const renderMessageContent = (text: string) => {
      const parts = text.split(/```/g);
      return parts.map((part, index) => {
          if (index % 2 === 1) {
              const lines = part.split('\n');
              const language = lines[0].trim() || 'code';
              const code = lines.slice(1).join('\n').trim();
              return <CodeBlock key={index} language={language} code={code} />;
          } else {
              if (part.includes('|') && part.includes('---')) {
                  const tableMatch = part.match(/\|(.+)\|\n\|([-:| ]+)\|\n((?:\|.*\|\n?)+)/);
                  if (tableMatch) return <TableBlock key={index} theme={theme} content={tableMatch[0]} />;
              }

              return (
                  <div key={index} className={`prose max-w-none leading-relaxed whitespace-pre-wrap ${theme === 'dark' ? 'prose-invert text-zinc-300' : 'text-zinc-700'}`}>
                      {part.split('\n').map((line, i) => (
                          <div key={i} className="min-h-[1.5em]">
                              {line.trim().startsWith('- ') || line.trim().startsWith('* ') ? (
                                  <div className="flex gap-2 ml-4"><span className="text-zinc-500">•</span><span>{processInlineFormatting(line.substring(2))}</span></div>
                              ) : (processInlineFormatting(line))}
                          </div>
                      ))}
                  </div>
              );
          }
      });
  };

  const processInlineFormatting = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((p, idx) => {
          if (p.startsWith('**') && p.endsWith('**')) return <strong key={idx} className={theme === 'dark' ? 'text-white font-bold' : 'text-black font-bold'}>{p.slice(2, -2)}</strong>;
          return p;
      });
  };

  const currentModelName = MODELS.find(m => m.id === selectedModel)?.name || selectedModel;

  return (
    <div className={`w-full h-full flex flex-col relative animate-fadeIn transition-colors duration-700 ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#f5f5f7] text-black'}`}>
      
      {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full pb-40">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-[2px] shadow-[0_0_40px_rgba(34,197,94,0.3)] mb-8 animate-pulse">
                  <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                      <div className="w-full h-full bg-gradient-to-b from-green-400/20 to-transparent flex items-center justify-center">
                          <Bot size={40} className={theme === 'dark' ? 'text-white' : 'text-black'} />
                      </div>
                  </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">Good evening, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}</h1>
              <h2 className="text-2xl md:text-3xl font-medium text-zinc-500 text-center mb-12">How can I help you today?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {[
                      { icon: <Zap size={18} className="text-yellow-400" />, text: "My collections" },
                      { icon: <Lightbulb size={18} className="text-purple-400" />, text: "Open calc" },
                      { icon: <FileText size={18} className="text-blue-400" />, text: "Phone table" },
                      { icon: <MessageSquare size={18} className="text-green-400" />, text: "Weather" }
                  ].map((s, i) => (
                      <button key={i} onClick={() => setInput(s.text)} className={`border rounded-2xl p-4 text-left transition-all hover:scale-[1.02] active:scale-95 group ${theme === 'dark' ? 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-black/5 hover:border-black/10 shadow-sm'}`}>
                          <div className={`mb-3 p-2 rounded-lg w-fit transition-colors ${theme === 'dark' ? 'bg-black group-hover:bg-zinc-700' : 'bg-zinc-100 group-hover:bg-zinc-200'}`}>{s.icon}</div>
                          <p className={`text-sm font-bold leading-snug ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>{s.text}</p>
                      </button>
                  ))}
              </div>
          </div>
      ) : (
          <div className="flex-1 overflow-y-auto px-4 md:px-0 scroll-smooth pb-40">
              <div className="max-w-4xl mx-auto py-8 space-y-10">
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-green-900/20 border-green-500/20'}`}>
                              {msg.role === 'user' ? <div className="text-sm font-bold text-white">{user?.email?.[0].toUpperCase() || 'U'}</div> : <Bot size={20} className="text-green-400" />}
                          </div>
                          <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                              <div className="text-xs text-zinc-500 font-black italic mb-2 uppercase tracking-wider">{msg.role === 'user' ? 'User' : 'Infinity'}</div>
                              <div className={`text-[16px] leading-7 ${msg.role === 'user' ? (theme === 'dark' ? 'text-white' : 'text-black') : (theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800')}`}>{msg.role === 'user' ? msg.text : renderMessageContent(msg.text)}</div>
                              {msg.widget === 'CALCULATOR' && <div className="mt-4 max-w-sm"><SimpleCalculator theme={theme} /></div>}
                              {msg.widget === 'CLOCK' && <div className="mt-4 max-w-sm"><SimpleClock theme={theme} /></div>}
                          </div>
                      </div>
                  ))}
                  {isLoading && <div className="flex gap-6"><div className="w-10 h-10 rounded-full bg-green-900/20 flex items-center justify-center shrink-0 animate-pulse"><Bot size={20} className="text-green-400" /></div><div className="flex items-center gap-2 mt-2"><div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce delay-100"></div></div></div>}
                  <div ref={chatEndRef} className="h-4" />
              </div>
          </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none pb-8 pt-12 ${theme === 'dark' ? 'bg-gradient-to-t from-black via-black/80 to-transparent' : 'bg-gradient-to-t from-[#f5f5f7] via-[#f5f5f7]/80 to-transparent'}`}>
          <div className="max-w-3xl mx-auto relative pointer-events-auto">
              <div className={`border rounded-[32px] p-2 shadow-2xl relative transition-all focus-within:ring-1 backdrop-blur-xl ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 focus-within:border-zinc-600 focus-within:ring-zinc-700' : 'bg-white border-black/5 focus-within:border-black/10 focus-within:ring-black/5 shadow-zinc-300/50'}`}>
                  <textarea 
                      value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="How can Infinity help you?"
                      className={`w-full bg-transparent text-lg px-4 py-3 min-h-[60px] max-h-[200px] outline-none resize-none placeholder-zinc-500 custom-scrollbar ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                      rows={1}
                  />
                  <div className="flex items-center justify-between px-2 pb-1 pt-2">
                      <div className="flex items-center gap-2">
                          <div className="relative">
                              <button onClick={() => setShowModelMenu(!showModelMenu)} className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-xs font-bold transition-all ${theme === 'dark' ? 'bg-black border-zinc-700 text-zinc-300 hover:text-white' : 'bg-zinc-100 border-black/5 text-zinc-600 hover:text-black'}`}>
                                  {MODELS.find(m => m.id === selectedModel)?.icon}{currentModelName}<ChevronDown size={12} className={`transition-transform ${showModelMenu ? 'rotate-180' : ''}`}/>
                              </button>
                              {showModelMenu && (
                                  <div className={`absolute bottom-full left-0 mb-2 w-56 border rounded-xl shadow-xl overflow-hidden z-50 animate-scaleIn origin-bottom-left ${theme === 'dark' ? 'bg-[#1a1a1a] border-zinc-700' : 'bg-white border-black/5'}`}>
                                      {MODELS.map((model) => (
                                          <button key={model.id} onClick={() => selectModel(model.id)} className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors ${selectedModel === model.id ? (theme === 'dark' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black') : (theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-50')}`}>
                                              {model.icon}{model.name}{selectedModel === model.id && <Check size={14} className="ml-auto text-green-500" />}
                                          </button>
                                      ))}
                                  </div>
                              )}
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <button onClick={handleSend} disabled={!input.trim() || isLoading} className={`p-3 rounded-full transition-all ${input.trim() && !isLoading ? (theme === 'dark' ? 'bg-white text-black hover:scale-105 shadow-lg' : 'bg-black text-white hover:scale-105 shadow-lg') : 'bg-zinc-200 text-zinc-400 cursor-not-allowed opacity-50'}`}>
                              <Send size={18} fill={input.trim() ? "currentColor" : "none"} />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const TableBlock: React.FC<{ content: string; theme: 'light' | 'dark' }> = ({ content, theme }) => {
    const rows = content.trim().split('\n');
    const headerRow = rows[0].split('|').filter(c => c.trim()).map(c => c.trim());
    const dataRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));
    return (
        <div className={`my-6 overflow-hidden rounded-xl border shadow-2xl ${theme === 'dark' ? 'border-zinc-700 bg-[#1a1a1a]' : 'border-black/5 bg-white'}`}>
            <div className={`flex items-center gap-2 px-6 py-3 border-b ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-black/5'}`}>
                <div className="bg-blue-500/10 p-1.5 rounded-md"><Zap size={14} className="text-blue-500" /></div>
                <span className={`text-sm font-black italic uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Data Snapshot</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className={`text-xs uppercase ${theme === 'dark' ? 'text-zinc-400 bg-black/40' : 'text-zinc-500 bg-zinc-50'}`}>
                        <tr>{headerRow.map((h, i) => (<th key={i} className="px-6 py-4 border-b border-zinc-800/20 font-bold">{h}</th>))}</tr>
                    </thead>
                    <tbody>
                        {dataRows.map((row, i) => (
                            <tr key={i} className={`border-b last:border-0 ${theme === 'dark' ? 'border-zinc-800/50 hover:bg-zinc-800/30' : 'border-black/5 hover:bg-zinc-50'}`}>
                                {row.map((cell, j) => (<td key={j} className={`px-6 py-4 font-mono ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{cell}</td>))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SimpleCalculator: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'dark' }) => {
    const [val, setVal] = useState('');
    return (
        <div className={`border rounded-2xl p-4 shadow-lg ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-black/5 shadow-zinc-200'}`}>
            <div className="flex items-center gap-2 mb-2 text-zinc-500 text-xs font-bold uppercase"><Calculator size={12}/> Calc</div>
            <input className={`w-full border rounded-lg p-2 text-right font-mono mb-2 outline-none ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-50 border-black/5 text-black'}`} value={val} readOnly />
            <div className="grid grid-cols-4 gap-1">
                {[7,8,9,'/',4,5,6,'*',1,2,3,'-',0,'C','=','+'].map(k => (
                    <button key={k} onClick={() => k === '=' ? setVal(String(eval(val)||'')) : k==='C' ? setVal('') : setVal(v=>v+k)} className={`h-8 rounded text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-black hover:bg-zinc-200'}`}>{k}</button>
                ))}
            </div>
        </div>
    );
};

const SimpleClock: React.FC<{ theme?: 'light' | 'dark' }> = ({ theme = 'dark' }) => {
    const [time, setTime] = useState(new Date());
    useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i); }, []);
    return (
        <div className={`border rounded-2xl p-4 shadow-lg flex items-center gap-4 ${theme === 'dark' ? 'bg-black border-zinc-800' : 'bg-white border-black/5 shadow-zinc-200'}`}>
            <Clock size={24} className="text-blue-500" />
            <div>
                <div className={`text-2xl font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{time.toLocaleTimeString()}</div>
                <div className="text-xs text-zinc-500 font-bold">{time.toLocaleDateString()}</div>
            </div>
        </div>
    );
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
    const [copied, setCopied] = useState(false);
    return (
        <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 bg-[#1e1e1e] shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black">
                <span className="text-xs font-mono text-zinc-400 uppercase">{language}</span>
                <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-zinc-400 hover:text-white text-xs flex items-center gap-1.5">{copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}{copied ? 'Copied' : 'Copy'}</button>
            </div>
            <div className="p-4 overflow-x-auto custom-scrollbar"><pre className="font-mono text-sm text-[#d4d4d4] leading-relaxed"><code>{code}</code></pre></div>
        </div>
    );
};

export default OsView;
