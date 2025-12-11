
import React, { useState, useEffect, useRef } from 'react';
import { Globe, Shield, Zap, Layers, Cpu, Activity, Bell, CheckCircle, LayoutGrid, Sparkles, Lock, Check, ChevronDown, MessageSquare, Star, Code, Terminal, Mic, Bookmark, BrainCircuit, Search, X, Server, Database, HelpCircle, ArrowRight, Play, Command } from 'lucide-react';
import BlackHoleAnimation from './BlackHoleAnimation';

interface MarketingPageProps {
  onGetStarted: () => void;
  onViewAssets: () => void;
}

// Simple Scroll Reveal Component
const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
        >
            {children}
        </div>
    );
};

const MarketingPage: React.FC<MarketingPageProps> = ({ onGetStarted, onViewAssets }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
        question: "Is Infinity OS really free?",
        answer: "Yes! Infinity OS is a community-supported project. We don't charge subscription fees for the core OS. You simply bring your own API keys for the services you use."
    },
    {
        question: "Where is my data stored?",
        answer: "Privacy is our priority. Your search history, API keys, and app tokens are stored locally on your device using encrypted LocalStorage. We do not have servers that store your personal data."
    },
    {
        question: "Do I need a Gemini API Key?",
        answer: "For the 'Deep Think' reasoning features and unlimited searches, yes. Google offers a generous free tier for the Gemini API that covers most personal use cases."
    },
    {
        question: "How does the 'Deep Think' engine work?",
        answer: "It uses an agentic workflow. Instead of just guessing the next word, it breaks your query into steps: researching multiple sources, cross-referencing facts, and then synthesizing a final answer."
    },
    {
        question: "Can I connect other apps besides Notion and Spotify?",
        answer: "Currently we support Notion, Spotify, Figma, and Google Drive. We are actively working on integrations for Slack, GitHub, and Linear."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Custom Styles */}
      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 30s linear infinite; }
        
        .bg-dot-pattern {
            background-image: radial-gradient(#333 1px, transparent 1px);
            background-size: 20px 20px;
        }

        @keyframes flow {
            to { stroke-dashoffset: 0; }
        }
        .animate-flow {
            stroke-dasharray: 10, 10;
            stroke-dashoffset: 200;
            animation: flow 3s linear infinite;
        }
        
        @keyframes float-icon {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float-icon {
            animation: float-icon 4s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Header */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-transparent py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
             <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm group-hover:scale-105 transition-transform" />
             <span className="group-hover:opacity-80 transition-opacity">Infinity OS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {['OS 26', 'Intelligence', 'Privacy', 'Developers'].map((item) => (
                <button key={item} className="text-sm font-semibold text-white/70 hover:text-white transition-colors">{item}</button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
                onClick={onGetStarted}
                className="hidden md:block text-sm font-semibold text-white/90 hover:text-white"
            >
                Log in
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-white text-black border border-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
            >
              Launch OS
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Modernized with Black Hole */}
      <section className="relative pt-32 pb-20 min-h-screen flex items-center bg-[#0a0a0a] px-6">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column: Typography & Content */}
              <div className="flex flex-col items-start relative z-10 animate-slideUp">
                  
                  {/* Badge */}
                  <div className="flex items-center gap-4 mb-8 group cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black shrink-0 transition-transform group-hover:scale-110">
                          <Command size={20} />
                      </div>
                      <div>
                          <div className="text-white font-bold text-lg leading-tight">Infinity OS 26.0</div>
                          <div className="text-white/60 text-sm underline underline-offset-4 decoration-white/30 group-hover:decoration-white transition-all">Read the Press Release</div>
                      </div>
                  </div>

                  {/* Headline */}
                  <h1 className="text-[5rem] md:text-[7rem] leading-[0.9] font-serif-display font-medium text-white mb-10 tracking-tight">
                      Infinity<sup className="text-4xl align-top text-blue-400">OS</sup>
                  </h1>

                  {/* Separator Line */}
                  <div className="w-24 h-[1px] bg-white/30 mb-10"></div>

                  {/* Subheadline */}
                  <p className="text-xl md:text-2xl text-white/80 font-light max-w-lg mb-12 leading-relaxed">
                      The Operating System for the Web. Harness AI-Powered Deep Think and fluid spatial computing in your browser.
                  </p>

                  {/* Review */}
                  <div className="flex items-center gap-4 mb-12 bg-white/5 pr-6 rounded-full border border-white/10 w-fit backdrop-blur-sm">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="User" className="w-12 h-12 rounded-full border-2 border-[#0a0a0a]" />
                      <div className="flex flex-col py-2">
                          <span className="text-sm font-medium text-white">"Feels like the future"</span>
                          <span className="text-xs text-white/50">Early Beta User <span className="text-white ml-2">★ 5.0</span></span>
                      </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-6">
                      <button 
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      >
                          Try Infinity OS
                      </button>
                      <button 
                        onClick={() => window.scrollTo({ top: 2000, behavior: 'smooth' })}
                        className="flex items-center gap-2 text-white font-semibold border-b border-transparent hover:border-white transition-all pb-0.5"
                      >
                          View Pricing <ArrowRight size={16} className="-rotate-45" />
                      </button>
                  </div>
              </div>

              {/* Right Column: Visual Animation */}
              <div className="relative h-[600px] w-full animate-fadeIn delay-300 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-black">
                   <BlackHoleAnimation />
                   
                   {/* Top Right Floating Badge */}
                   <div className="absolute top-[10%] right-[10%] w-40 h-40 bg-white/5 backdrop-blur-md rounded-[30px] border border-white/10 p-4 flex flex-col justify-between shadow-2xl animate-pulse">
                      <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Latency</span>
                      <div>
                          <span className="text-4xl font-bold text-white">12ms</span>
                          <p className="text-xs text-white/80 leading-tight mt-1">Deep Think 2.0 Speed</p>
                      </div>
                   </div>
              </div>

          </div>
      </section>

      {/* 4. Problem Statement */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative z-20 border-t border-white/5">
          <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">The Evolution</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Search needed an OS.</h3>
              <p className="text-xl text-zinc-400 leading-relaxed">
                  Basic keywords are history. Infinity OS 26 introduces "Deep Think"—an agentic workflow that reads, verifies, and synthesizes answers before you even see the first link. It's not just search; it's a computation engine.
              </p>
          </div>
          </ScrollReveal>
      </section>

      {/* 5. Features Bento Grid */}
      <section className="py-32 px-6 bg-[#0a0a0a] relative z-20">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none"></div>

          <ScrollReveal>
          <div className="max-w-7xl mx-auto">
              <div className="mb-20 text-center">
                   <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The OS Experience.</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 min-h-[600px]">
                  
                  {/* Card 1: Visual Search (Large) */}
                  <div className="md:col-span-2 row-span-2 bg-zinc-900/40 backdrop-blur-2xl rounded-[40px] border border-white/10 p-10 hover:border-white/20 transition-all duration-500 relative overflow-hidden group">
                      <div className="relative z-20">
                          <div className="w-14 h-14 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                              <BrainCircuit size={28} />
                          </div>
                          <h3 className="text-3xl font-bold mb-3 text-white">Deep Think 2.0</h3>
                          <p className="text-zinc-400 max-w-sm text-lg leading-relaxed">
                              Toggle "Deep Search" to unleash multi-step reasoning. Watch the AI break down complex queries in real-time with our new fluid animation engine.
                          </p>
                      </div>
                      
                      {/* Abstract UI Representation */}
                      <div className="absolute top-1/2 right-[-5%] w-[60%] h-[120%] bg-black/40 backdrop-blur-md rounded-l-[40px] border-l border-t border-white/10 p-6 flex flex-col gap-4 transform rotate-[-6deg] group-hover:rotate-0 transition-all duration-700 ease-out shadow-2xl">
                          <div className="text-xs font-mono text-green-400 p-2 bg-black rounded border border-green-900/50">&gt; Kernel initialized...</div>
                          <div className="text-xs font-mono text-green-400 p-2 bg-black rounded border border-green-900/50">&gt; Analyzing 14 sources...</div>
                          <div className="text-xs font-mono text-green-400 p-2 bg-black rounded border border-green-900/50">&gt; Synthesizing output...</div>
                      </div>
                  </div>

                  {/* Card 2: Voice */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[40px] border border-white/20 p-8 shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                      
                      <div className="relative z-10 h-full flex flex-col">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30 text-white shadow-inner">
                              <Mic size={24} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-white">Natural Voice</h3>
                          <p className="text-zinc-300 text-sm leading-relaxed">
                              Speak naturally. Infinity OS listens and responds with human-like spoken audio summaries.
                          </p>
                      </div>
                  </div>

                  {/* Card 3: Collections */}
                  <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8 shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                       <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500"></div>
                       
                       <div className="relative z-10 h-full flex flex-col">
                          <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 text-blue-400 shadow-inner">
                              <Bookmark size={24} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-white">FileSystem</h3>
                          <p className="text-zinc-400 text-sm leading-relaxed">
                              Save images, links, and code snippets to your personal library. Your knowledge, organized.
                          </p>
                      </div>
                  </div>

              </div>
          </div>
          </ScrollReveal>
      </section>

      {/* NEW: The Intelligence Engine (How It Works) */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative z-20 border-t border-white/10">
           <ScrollReveal>
             <div className="max-w-7xl mx-auto">
                 <div className="flex flex-col lg:flex-row gap-16 items-center">
                     <div className="lg:w-1/2">
                         <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Powered by <br/>
                            <span className="text-purple-400">Deep Think 2.0</span>
                         </h2>
                         <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                             Most search engines give you blue links. Infinity OS creates answers. Our multi-modal engine processes your query through three distinct layers of cognition.
                         </p>
                         
                         <div className="space-y-6">
                             <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 border border-blue-900/50 shrink-0">
                                     <Globe size={24}/>
                                 </div>
                                 <div>
                                     <h4 className="text-lg font-bold text-white mb-1">1. Retrieval Layer</h4>
                                     <p className="text-zinc-500">Scans billions of pages, including your connected Notion docs and local files.</p>
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center text-purple-400 border border-purple-900/50 shrink-0">
                                     <BrainCircuit size={24}/>
                                 </div>
                                 <div>
                                     <h4 className="text-lg font-bold text-white mb-1">2. Reasoning Kernel</h4>
                                     <p className="text-zinc-500">Cross-references facts, detects hallucinations, and filters out clickbait.</p>
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-full bg-green-900/20 flex items-center justify-center text-green-400 border border-green-900/50 shrink-0">
                                     <Sparkles size={24}/>
                                 </div>
                                 <div>
                                     <h4 className="text-lg font-bold text-white mb-1">3. Synthesis UI</h4>
                                     <p className="text-zinc-500">Generates a concise, cited, and actionable answer with relevant visuals.</p>
                                 </div>
                             </div>
                         </div>
                     </div>
                     
                     <div className="lg:w-1/2 relative">
                         {/* Visual Representation of Engine */}
                         <div className="relative aspect-square rounded-[40px] bg-gradient-to-tr from-zinc-900 to-black border border-white/10 flex items-center justify-center p-8 overflow-hidden shadow-2xl">
                              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                              
                              <div className="relative z-10 w-full max-w-sm bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                      <div className="flex gap-1.5">
                                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                      </div>
                                      <div className="text-xs font-mono text-zinc-500 ml-auto">infinity_kernel.log</div>
                                  </div>
                                  <div className="space-y-3 font-mono text-xs">
                                      <div className="flex items-center gap-2 text-green-400">
                                          <Check size={12} /> Query decomposed
                                      </div>
                                      <div className="flex items-center gap-2 text-green-400">
                                          <Check size={12} /> 14 sources identified
                                      </div>
                                      <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                                          <Activity size={12} /> Analyzing conflict...
                                      </div>
                                      <div className="text-zinc-500 pl-6">
                                          &gt; Checking reliability score...
                                      </div>
                                      <div className="text-zinc-500 pl-6">
                                          &gt; Filtering bias...
                                      </div>
                                  </div>
                              </div>
                         </div>
                     </div>
                 </div>
             </div>
           </ScrollReveal>
      </section>

      {/* NEW: Use Cases (Personas) */}
      <section className="py-24 px-6 bg-zinc-900/30 relative z-20">
          <ScrollReveal>
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Built for the inquisitive.</h2>
                  <p className="text-zinc-400">Tailored workflows for every type of thinker.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                  {/* Persona 1 */}
                  <div className="bg-black border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                      <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center mb-6">
                          <Code size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">For Developers</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                          Stop tab-switching between StackOverflow and documentation. Get code snippets, debug errors, and find repo docs instantly.
                      </p>
                      <ul className="space-y-2 text-sm text-zinc-400">
                          <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Syntax highlighting</li>
                          <li className="flex gap-2"><Check size={16} className="text-blue-500"/> Docs search integration</li>
                      </ul>
                  </div>

                  {/* Persona 2 */}
                  <div className="bg-black border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-6">
                          <Layers size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">For Designers</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                          Find visual inspiration across Pexels, Figma, and the web. Generate moodboards and color palettes in seconds.
                      </p>
                       <ul className="space-y-2 text-sm text-zinc-400">
                          <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Grid view gallery</li>
                          <li className="flex gap-2"><Check size={16} className="text-purple-500"/> Figma file search</li>
                      </ul>
                  </div>

                  {/* Persona 3 */}
                  <div className="bg-black border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                      <div className="w-12 h-12 bg-zinc-800 text-white rounded-xl flex items-center justify-center mb-6">
                          <Search size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">For Researchers</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                          Synthesize complex topics. "Deep Think" reads the papers so you don't have to, summarizing key findings with citations.
                      </p>
                       <ul className="space-y-2 text-sm text-zinc-400">
                          <li className="flex gap-2"><Check size={16} className="text-green-500"/> Citation links</li>
                          <li className="flex gap-2"><Check size={16} className="text-green-500"/> PDF analysis</li>
                      </ul>
                  </div>
              </div>
          </div>
          </ScrollReveal>
      </section>

      {/* NEW: Comparison Table */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/10 relative z-20">
          <ScrollReveal>
          <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Why switch to Infinity OS?</h2>
                  <p className="text-zinc-400">See how we stack up against the giants.</p>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-white/10">
                              <th className="py-6 px-4 text-zinc-500 font-medium">Feature</th>
                              <th className="py-6 px-4 text-white font-bold text-lg bg-white/5 rounded-t-xl">Infinity OS 26</th>
                              <th className="py-6 px-4 text-zinc-500 font-medium">Traditional Search</th>
                              <th className="py-6 px-4 text-zinc-500 font-medium">Standard AI Chat</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr className="border-b border-white/5">
                              <td className="py-6 px-4 text-white font-medium">Deep Think Reasoning</td>
                              <td className="py-6 px-4 bg-white/5 text-green-400"><CheckCircle size={20} /></td>
                              <td className="py-6 px-4 text-zinc-600"><X size={20} /></td>
                              <td className="py-6 px-4 text-zinc-600">Limited</td>
                          </tr>
                          <tr className="border-b border-white/5">
                              <td className="py-6 px-4 text-white font-medium">App Integrations (Notion/Spotify)</td>
                              <td className="py-6 px-4 bg-white/5 text-green-400"><CheckCircle size={20} /></td>
                              <td className="py-6 px-4 text-zinc-600"><X size={20} /></td>
                              <td className="py-6 px-4 text-zinc-600"><X size={20} /></td>
                          </tr>
                          <tr className="border-b border-white/5">
                              <td className="py-6 px-4 text-white font-medium">Visual Gallery Grid</td>
                              <td className="py-6 px-4 bg-white/5 text-green-400"><CheckCircle size={20} /></td>
                              <td className="py-6 px-4 text-zinc-500">Messy</td>
                              <td className="py-6 px-4 text-zinc-600"><X size={20} /></td>
                          </tr>
                          <tr className="border-b border-white/5">
                              <td className="py-6 px-4 text-white font-medium">Local-First Privacy</td>
                              <td className="py-6 px-4 bg-white/5 text-green-400"><CheckCircle size={20} /></td>
                              <td className="py-6 px-4 text-zinc-600">Ads Tracking</td>
                              <td className="py-6 px-4 text-zinc-600">Data Training</td>
                          </tr>
                          <tr>
                              <td className="py-6 px-4 text-white font-medium">Voice Synthesis (TTS)</td>
                              <td className="py-6 px-4 bg-white/5 rounded-b-xl text-green-400"><CheckCircle size={20} /></td>
                              <td className="py-6 px-4 text-zinc-600"><X size={20} /></td>
                              <td className="py-6 px-4 text-zinc-600">Sometimes</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
          </ScrollReveal>
      </section>

      {/* NEW: Privacy & Security */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative z-20">
          <ScrollReveal>
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>
               
               <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 text-white">
                   <Lock size={32} />
               </div>
               
               <h2 className="text-3xl font-bold text-white mb-4">Your Data. Your Keys.</h2>
               <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                   Unlike other platforms, Infinity OS is designed to be local-first. Bring your own Gemini API key for complete privacy. 
                   Your search history and connected app tokens are stored encrypted on your device, not our servers.
               </p>
               
               <div className="flex flex-wrap justify-center gap-4">
                   <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-full border border-zinc-800 text-sm text-zinc-400">
                       <Shield size={14} className="text-green-500" /> End-to-End Encryption
                   </div>
                   <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-full border border-zinc-800 text-sm text-zinc-400">
                       <Server size={14} className="text-green-500" /> No Data Training
                   </div>
                   <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-full border border-zinc-800 text-sm text-zinc-400">
                       <Database size={14} className="text-green-500" /> Local Storage
                   </div>
               </div>
          </div>
          </ScrollReveal>
      </section>

      {/* 9. Pricing (Modernized) */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/10 relative z-20">
          <ScrollReveal>
          <div className="max-w-7xl mx-auto text-center">
              <div className="mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Simple, Transparent Pricing.</h2>
                  <p className="text-zinc-500 text-xl max-w-2xl mx-auto">
                      Start for free, upgrade for power.
                  </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  
                  {/* FREE PLAN */}
                  <div className="p-8 rounded-[40px] border border-white/10 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col text-left group hover:border-white/20">
                      <h3 className="text-2xl font-bold text-white mb-2">Fair Use</h3>
                      <div className="text-5xl font-bold text-white mb-6">$0<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
                      <p className="text-zinc-400 mb-8">Perfect for exploring and personal use.</p>
                      
                      <div className="space-y-4 mb-8 flex-1">
                          {['Deep Think Engine', 'Voice Commands', 'Basic Collections', '3 Connected Apps', 'Local Privacy'].map(f => (
                              <div key={f} className="flex items-center gap-3 text-zinc-300">
                                  <CheckCircle size={18} className="text-white" />
                                  <span>{f}</span>
                              </div>
                          ))}
                      </div>
                      
                      <button onClick={onGetStarted} className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                          Get Started
                      </button>
                  </div>

                  {/* INFINITY+ PLAN */}
                  <div className="p-8 rounded-[40px] border border-white/10 bg-black relative flex flex-col text-left overflow-hidden">
                       <div className="absolute top-0 right-0 p-6">
                           <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
                       </div>
                       
                       <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">Infinity OS Pro</h3>
                       <div className="text-5xl font-bold text-zinc-700 mb-6">$20<span className="text-lg text-zinc-800 font-normal">/mo</span></div>
                       <p className="text-zinc-500 mb-8">For power users who need the best models.</p>

                       <div className="space-y-4 mb-8 flex-1">
                          {['Everything in Free', 'Gemini 3.0 Pro Access', 'Unlimited Collections', 'Unlimited Cloud Backup', 'Priority Support'].map(f => (
                              <div key={f} className="flex items-center gap-3 text-zinc-500">
                                  <CheckCircle size={18} className="text-zinc-700" />
                                  <span>{f}</span>
                              </div>
                          ))}
                      </div>

                      <button disabled className="w-full py-4 bg-zinc-900 text-zinc-500 rounded-full font-bold cursor-not-allowed border border-zinc-800">
                          Join Waitlist
                      </button>
                  </div>

              </div>
          </div>
          </ScrollReveal>
      </section>

      {/* 10. FAQ Section */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative z-20">
         <ScrollReveal>
         <div className="max-w-3xl mx-auto">
             <div className="text-center mb-16">
                 <h2 className="text-4xl font-bold mb-4">Common Questions</h2>
                 <p className="text-zinc-500">Everything you need to know about Infinity OS.</p>
             </div>

             <div className="space-y-4">
                 {faqs.map((faq, index) => (
                     <div key={index} className="border border-white/10 rounded-2xl bg-zinc-900/30 overflow-hidden">
                         <button 
                            onClick={() => toggleFaq(index)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                         >
                             <span className="font-bold text-white text-lg">{faq.question}</span>
                             <ChevronDown size={20} className={`text-zinc-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                         </button>
                         <div className={`px-6 text-zinc-400 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                             {faq.answer}
                         </div>
                     </div>
                 ))}
             </div>
         </div>
         </ScrollReveal>
      </section>

      {/* 11. Final CTA */}
      <section className="py-32 px-6 bg-[#0a0a0a] text-center relative overflow-hidden z-20">
           <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none"></div>
           <ScrollReveal>
           <div className="relative z-10 max-w-4xl mx-auto">
               <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white">
                   Ready to organize <br/> your digital chaos?
               </h2>
               <button 
                   onClick={onGetStarted}
                   className="px-10 py-5 bg-white text-black text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
               >
                   Boot Infinity OS
               </button>
               <p className="mt-6 text-zinc-500 text-sm">No credit card required</p>
           </div>
           </ScrollReveal>
      </section>

      {/* 12. Footer */}
      <footer className="py-20 px-6 bg-[#0a0a0a] border-t border-white/10 relative z-20">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                  <div>
                      <div className="flex items-center gap-3 font-bold text-2xl tracking-tight mb-6 text-white">
                        <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="Logo" className="w-8 h-8 rounded-lg grayscale hover:grayscale-0 transition-all" />
                        Infinity OS 26
                      </div>
                      <p className="text-zinc-500 max-w-sm">
                          The intelligent search workspace for the modern internet.
                      </p>
                  </div>
              </div>
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-zinc-600 text-sm">© 2025 Infinity Search Inc. v26.0</p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default MarketingPage;
