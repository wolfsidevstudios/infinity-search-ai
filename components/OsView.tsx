
import React, { useState, useEffect, useRef } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
    Send, Mic, Paperclip, Camera, Image as ImageIcon, FileText, 
    ChevronDown, Zap, Lightbulb, MessageSquare, Bot, Copy, Download, Check
} from 'lucide-react';
import { chatWithGemini, getSelectedModel } from '../services/geminiService';
import { HistoryItem, CollectionItem } from '../types';
import { WeatherData } from '../services/weatherService';

interface OsViewProps {
  user: SupabaseUser | null;
  onLogout: () => void;
  weather: WeatherData | null;
  history: HistoryItem[];
  collections: CollectionItem[];
  onSearch: (query: string) => void;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

const MODELS = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', icon: <Zap size={14} className="text-yellow-400" /> },
    { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro', icon: <Bot size={14} className="text-purple-400" /> },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', icon: <Bot size={14} className="text-blue-400" /> },
    { id: 'gpt-oss-120b', name: 'GPT-OSS 120B', icon: <Bot size={14} className="text-green-400" /> },
];

const OsView: React.FC<OsViewProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(getSelectedModel());
  const [showModelMenu, setShowModelMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      // Scroll to bottom on new messages
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
      if (!input.trim() || isLoading) return;

      const userMsg: Message = {
          id: Date.now().toString(),
          role: 'user',
          text: input,
          timestamp: new Date()
      };

      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      // Build History for API
      const apiHistory = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
      }));
      apiHistory.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const responseText = await chatWithGemini(apiHistory, selectedModel);

      const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
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

  // Helper to render formatting
  const renderMessageContent = (text: string) => {
      // 1. Split Code Blocks
      const parts = text.split(/```/g);
      
      return parts.map((part, index) => {
          if (index % 2 === 1) {
              // CODE BLOCK
              const lines = part.split('\n');
              const language = lines[0].trim() || 'code';
              const code = lines.slice(1).join('\n').trim();
              return <CodeBlock key={index} language={language} code={code} />;
          } else {
              // TEXT BLOCK (Process basic markdown)
              // Detect Tables first? Complex. Let's do simple formatting first.
              
              // Tables: Identify simple markdown table structure
              if (part.includes('|') && part.includes('---')) {
                  // Very basic table detection
                  const tableMatch = part.match(/\|(.+)\|\n\|([-:| ]+)\|\n((?:\|.*\|\n?)+)/);
                  if (tableMatch) {
                      return <TableBlock key={index} content={tableMatch[0]} />;
                  }
              }

              return (
                  <div key={index} className="prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {part.split('\n').map((line, i) => {
                          // Bold: **text**
                          const boldParts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                              <div key={i} className="min-h-[1.5em]">
                                  {line.trim().startsWith('- ') || line.trim().startsWith('* ') ? (
                                      <div className="flex gap-2 ml-4">
                                          <span className="text-zinc-500">•</span>
                                          <span>
                                               {processInlineFormatting(line.substring(2))}
                                          </span>
                                      </div>
                                  ) : (
                                      processInlineFormatting(line)
                                  )}
                              </div>
                          );
                      })}
                  </div>
              );
          }
      });
  };

  const processInlineFormatting = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((p, idx) => {
          if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={idx} className="text-white font-bold">{p.slice(2, -2)}</strong>;
          }
          return p;
      });
  };

  const currentModelName = MODELS.find(m => m.id === selectedModel)?.name || selectedModel;

  return (
    <div className="w-full h-full flex flex-col bg-black text-white relative animate-fadeIn">
      
      {/* Empty State / Header */}
      {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
              {/* Logo / Avatar Orb */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-[2px] shadow-[0_0_40px_rgba(34,197,94,0.3)] mb-8 animate-pulse">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-b from-green-400/20 to-transparent flex items-center justify-center">
                          <Bot size={40} className="text-white drop-shadow-lg" />
                      </div>
                  </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-tight">
                  Good evening, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-zinc-500 text-center mb-12">
                  Can I help you with anything?
              </h2>

              {/* Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-12">
                  {[
                      { icon: <Zap size={18} className="text-yellow-400" />, text: "Get fresh perspectives on tricky problems" },
                      { icon: <Lightbulb size={18} className="text-purple-400" />, text: "Brainstorm creative ideas" },
                      { icon: <FileText size={18} className="text-blue-400" />, text: "Rewrite message for maximum impact" },
                      { icon: <MessageSquare size={18} className="text-green-400" />, text: "Summarize key points" }
                  ].map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => setInput(s.text)}
                        className="bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-2xl p-4 text-left transition-all hover:scale-[1.02] active:scale-95 group"
                      >
                          <div className="mb-3 p-2 bg-black rounded-lg w-fit group-hover:bg-zinc-700 transition-colors">
                              {s.icon}
                          </div>
                          <p className="text-sm font-medium text-zinc-300 leading-snug">{s.text}</p>
                      </button>
                  ))}
              </div>
          </div>
      ) : (
          <div className="flex-1 overflow-y-auto px-4 md:px-0 scroll-smooth">
              <div className="max-w-4xl mx-auto py-8 space-y-10">
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-green-900/20 border-green-500/20'}`}>
                              {msg.role === 'user' ? (
                                  <div className="text-sm font-bold">{user?.email?.[0].toUpperCase() || 'U'}</div>
                              ) : (
                                  <Bot size={20} className="text-green-400" />
                              )}
                          </div>
                          
                          <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                              <div className="text-xs text-zinc-500 font-bold mb-2 uppercase tracking-wider">
                                  {msg.role === 'user' ? 'You' : 'ThinkAI'}
                              </div>
                              <div className={`text-[16px] leading-7 ${msg.role === 'user' ? 'text-white' : 'text-zinc-200'}`}>
                                  {msg.role === 'user' ? msg.text : renderMessageContent(msg.text)}
                              </div>
                          </div>
                      </div>
                  ))}
                  
                  {isLoading && (
                      <div className="flex gap-6">
                          <div className="w-10 h-10 rounded-full bg-green-900/20 border border-green-500/20 flex items-center justify-center shrink-0 animate-pulse">
                              <Bot size={20} className="text-green-400" />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                              <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce delay-200"></div>
                          </div>
                      </div>
                  )}
                  <div ref={chatEndRef} className="h-4" />
              </div>
          </div>
      )}

      {/* Input Area (Bottom Fixed) */}
      <div className="w-full bg-black/90 backdrop-blur-xl border-t border-zinc-800 p-6 z-20">
          <div className="max-w-4xl mx-auto relative">
              
              {/* Input Container */}
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-3xl p-2 shadow-2xl relative transition-all focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-600">
                  <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="How can ThinkAI help you today?"
                      className="w-full bg-transparent text-white text-lg px-4 py-3 min-h-[60px] max-h-[200px] outline-none resize-none placeholder-zinc-500 custom-scrollbar"
                      rows={1}
                      style={{ height: 'auto', minHeight: '60px' }}
                  />
                  
                  {/* Bottom Controls */}
                  <div className="flex items-center justify-between px-2 pb-1 pt-2">
                      
                      {/* Left: Model Switcher & Tools */}
                      <div className="flex items-center gap-2">
                          <div className="relative">
                              <button 
                                onClick={() => setShowModelMenu(!showModelMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-black border border-zinc-700 rounded-full text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
                              >
                                  {MODELS.find(m => m.id === selectedModel)?.icon}
                                  {currentModelName}
                                  <ChevronDown size={12} className={`transition-transform ${showModelMenu ? 'rotate-180' : ''}`}/>
                              </button>

                              {showModelMenu && (
                                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#1a1a1a] border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50 animate-scaleIn origin-bottom-left">
                                      {MODELS.map((model) => (
                                          <button
                                            key={model.id}
                                            onClick={() => selectModel(model.id)}
                                            className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-left hover:bg-zinc-800 transition-colors ${selectedModel === model.id ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                                          >
                                              {model.icon}
                                              {model.name}
                                              {selectedModel === model.id && <Check size={14} className="ml-auto text-green-500" />}
                                          </button>
                                      ))}
                                  </div>
                              )}
                          </div>

                          <button className="p-2 text-zinc-500 hover:text-white transition-colors" title="Attach">
                              <Paperclip size={18} />
                          </button>
                          <button className="p-2 text-zinc-500 hover:text-white transition-colors" title="Visual Search">
                              <Camera size={18} />
                          </button>
                      </div>

                      {/* Right: Send */}
                      <div className="flex items-center gap-3">
                          <span className="text-[10px] text-zinc-600 font-medium hidden md:inline">Use shift + return for new line</span>
                          <button 
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className={`p-3 rounded-full transition-all ${
                                input.trim() && !isLoading
                                ? 'bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95' 
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            }`}
                          >
                              <Send size={18} fill={input.trim() ? "currentColor" : "none"} />
                          </button>
                      </div>
                  </div>
              </div>

              {/* Footer Disclaimer */}
              <p className="text-center text-[10px] text-zinc-600 mt-4">
                  ThinkAI can make mistakes. Please double-check responses.
              </p>
          </div>
      </div>

    </div>
  );
};

// --- SUB-COMPONENTS ---

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `snippet.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 bg-[#1e1e1e] shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black">
                <span className="text-xs font-mono text-zinc-400 uppercase">{language}</span>
                <div className="flex gap-2">
                    <button onClick={handleCopy} className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs">
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button onClick={handleDownload} className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors" title="Download">
                        <Download size={14} />
                    </button>
                </div>
            </div>
            <div className="p-4 overflow-x-auto custom-scrollbar">
                <pre className="font-mono text-sm text-[#d4d4d4] leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

const TableBlock: React.FC<{ content: string }> = ({ content }) => {
    // Parse Markdown Table (Basic)
    const rows = content.trim().split('\n');
    const headerRow = rows[0].split('|').filter(c => c.trim()).map(c => c.trim());
    const dataRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));

    return (
        <div className="my-6 overflow-hidden rounded-xl border border-zinc-700 shadow-lg bg-zinc-900/50">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border-b border-zinc-700">
                <Zap size={14} className="text-green-400" />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Data Sheet</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-400 uppercase bg-black/40">
                        <tr>
                            {headerRow.map((h, i) => (
                                <th key={i} className="px-6 py-3 border-b border-zinc-800">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataRows.map((row, i) => (
                            <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                                {row.map((cell, j) => (
                                    <td key={j} className="px-6 py-4 font-mono text-zinc-300">{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OsView;
