
import React, { useState, useEffect, useRef } from 'react';
import { Globe, Shield, Zap, Layers, Cpu, Activity, Bell, CheckCircle, LayoutGrid, Sparkles, Lock, Check, ChevronDown, MessageSquare, Star, Code, Terminal, Mic, Bookmark, BrainCircuit, Search, X, Server, Database } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
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

      {/* 1. Header (Updated Layout) */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-xl z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-white cursor-pointer" onClick={() => window.scrollTo(0,0)}>
             <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="Infinity Logo" className="w-8 h-8 rounded-lg shadow-sm" />
             Infinity 2.0
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Deep Think</button>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Collections</button>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
                onClick={onGetStarted}
                className="hidden md:block text-sm font-medium text-gray-400 hover:text-white"
            >
                Sign in
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-white text-black border border-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section - Split Screen with Animation */}
      <section className="pt-32 pb-20 relative bg-black min-h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-0 md:gap-12 items-center relative z-10 px-6">
            
            {/* Left Content */}
            <div className="text-left animate-fadeIn order-2 md:order-1 relative z-20 pt-10 md:pt-0">
                
                {/* Badge Removed per request */}

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1] text-white">
                    More than <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">just search.</span>
                </h1>
                
                <p className="text-xl text-gray-400 max-w-xl mb-10 font-light leading-relaxed">
                    Now with Voice Command and multi-step AI reasoning. Infinity connects your world and helps you understand it deeply.
                </p>

                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-200 transition-all shadow-xl hover:shadow-white/20 hover:scale-105 flex items-center gap-2"
                    >
                        Try Deep Think <BrainCircuit size={18} />
                    </button>
                    <button 
                         onClick={onViewAssets}
                        className="px-8 py-4 bg-transparent border border-white/20 text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all"
                    >
                        Media Kit
                    </button>
                </div>

                {/* Badge Section */}
                <div className="mt-12 flex items-center gap-4">
                    <a href="https://startupslab.site" target="_blank" rel="noopener" className="transition-opacity hover:opacity-80">
                        <img 
                            src="https://cdn.startupslab.site/site-images/badge-light.png" 
                            alt="Featured on Startups Lab" 
                            className="h-10 w-auto rounded-xl shadow-lg border border-white/5"
                        />
                    </a>
                </div>
            </div>

            {/* Right Animation - The Black Hole */}
            <div className="relative h-[600px] md:h-[900px] w-full order-1 md:order-2 flex items-center justify-center">
                <div className="absolute inset-0 w-full h-full">
                    <BlackHoleAnimation />
                </div>
                
                {/* Floating UI Elements inside the void */}
                <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="absolute top-[20%] right-[20%] bg-zinc-900/40 backdrop-blur-md p-4 rounded-xl border border-white/10 animate-pulse">
                         <BrainCircuit className="w-8 h-8 opacity-80 text-purple-400" />
                    </div>
                     <div className="absolute bottom-[30%] left-[15%] bg-zinc-900/40 backdrop-blur-md p-4 rounded-xl border border-white/10 animate-pulse delay-700">
                         <Mic className="w-8 h-8 opacity-80 text-red-400" />
                    </div>
                    <div className="absolute top-[40%] left-[10%] bg-zinc-900/40 backdrop-blur-md p-4 rounded-xl border border-white/10 animate-pulse delay-300">
                        <Bookmark className="w-6 h-8 opacity-80 text-blue-400" />
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* 4. Problem Statement */}
      <section className="py-24 px-6 bg-black relative z-20 border-t border-white/5">
          <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">The Evolution</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Search needed a brain upgrade.</h3>
              <p className="text-xl text-zinc-400 leading-relaxed">
                  Basic keywords aren't enough for complex problems. Infinity 2.0 introduces "Deep Think"—an agentic workflow that reads, verifies, and synthesizes answers before you even see the first link.
              </p>
          </div>
          </ScrollReveal>
      </section>

      {/* 5. Features Bento Grid */}
      <section className="py-32 px-6 bg-black relative z-20">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none"></div>

          <ScrollReveal>
          <div className="max-w-7xl mx-auto">
              <div className="mb-20 text-center">
                   <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The 2.0 Experience.</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 min-h-[600px]">
                  
                  {/* Card 1: Visual Search (Large) */}
                  <div className="md:col-span-2 row-span-2 bg-zinc-900/40 backdrop-blur-2xl rounded-[40px] border border-white/10 p-10 hover:border-white/20 transition-all duration-500 relative overflow-hidden group">
                      <div className="relative z-20">
                          <div className="w-14 h-14 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                              <BrainCircuit size={28} />
                          </div>
                          <h3 className="text-3xl font-bold mb-3 text-white">Deep Think Engine</h3>
                          <p className="text-zinc-400 max-w-sm text-lg leading-relaxed">
                              Toggle "Deep Search" to unleash multi-step reasoning. Watch the AI break down complex queries in real-time.
                          </p>
                      </div>
                      
                      {/* Abstract UI Representation */}
                      <div className="absolute top-1/2 right-[-5%] w-[60%] h-[120%] bg-black/40 backdrop-blur-md rounded-l-[40px] border-l border-t border-white/10 p-6 flex flex-col gap-4 transform rotate-[-6deg] group-hover:rotate-0 transition-all duration-700 ease-out shadow-2xl">
                          <div className="text-xs font-mono text-green-400 p-2 bg-black rounded border border-green-900/50">> Analyzing sources...</div>
                          <div className="text-xs font-mono text-green-400 p-2 bg-black rounded border border-green-900/50">> Cross-referencing data...</div>
                          <div className="text-xs font-mono text-green-400 p-2 bg-black rounded border border-green-900/50">> Synthesizing output...</div>
                      </div>
                  </div>

                  {/* Card 2: Voice */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[40px] border border-white/20 p-8 shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                      
                      <div className="relative z-10 h-full flex flex-col">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30 text-white shadow-inner">
                              <Mic size={24} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-white">Voice Command</h3>
                          <p className="text-zinc-300 text-sm leading-relaxed">
                              Speak naturally. Infinity listens and responds with spoken audio summaries.
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
                          <h3 className="text-2xl font-bold mb-2 text-white">Collections</h3>
                          <p className="text-zinc-400 text-sm leading-relaxed">
                              Save images, links, and songs to your personal library. Build your knowledge base.
                          </p>
                      </div>
                  </div>

              </div>
          </div>
          </ScrollReveal>
      </section>

      {/* NEW: The Intelligence Engine (How It Works) */}
      <section className="py-24 px-6 bg-black relative z-20 border-t border-white/10">
           <ScrollReveal>
             <div className="max-w-7xl mx-auto">
                 <div className="flex flex-col lg:flex-row gap-16 items-center">
                     <div className="lg:w-1/2">
                         <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Inside the <br/>
                            <span className="text-purple-400">Deep Think Engine</span>
                         </h2>
                         <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                             Most search engines give you blue links. Infinity creates answers. Our multi-modal engine processes your query through three distinct layers of cognition.
                         </p>
                         
                         <div className="space-y-6">
                             <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 border border-blue-900/50 shrink-0">
                                     <Globe size={24}/>
                                 </div>
                                 <div>
                                     <h4 className="text-lg font-bold text-white mb-1">1. Information Retrieval</h4>
                                     <p className="text-zinc-500">Scans billions of pages, including your connected Notion docs and local files.</p>
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center text-purple-400 border border-purple-900/50 shrink-0">
                                     <BrainCircuit size={24}/>
                                 </div>
                                 <div>
                                     <h4 className="text-lg font-bold text-white mb-1">2. Reasoning & Verification</h4>
                                     <p className="text-zinc-500">Cross-references facts, detects hallucinations, and filters out clickbait.</p>
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-full bg-green-900/20 flex items-center justify-center text-green-400 border border-green-900/50 shrink-0">
                                     <Sparkles size={24}/>
                                 </div>
                                 <div>
                                     <h4 className="text-lg font-bold text-white mb-1">3. Synthesis</h4>
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
                                      <div className="text-xs font-mono text-zinc-500 ml-auto">agent_v2.0.log</div>
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
                                          {">"} Checking reliability score...
                                      </div>
                                      <div className="text-zinc-500 pl-6">
                                          {">"} Filtering bias...
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
      <section className="py-24 px-6 bg-black border-t border-white/10 relative z-20">
          <ScrollReveal>
          <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Why switch to Infinity?</h2>
                  <p className="text-zinc-400">See how we stack up against the giants.</p>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-white/10">
                              <th className="py-6 px-4 text-zinc-500 font-medium">Feature</th>
                              <th className="py-6 px-4 text-white font-bold text-lg bg-white/5 rounded-t-xl">Infinity 2.0</th>
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
      <section className="py-24 px-6 bg-black relative z-20">
          <ScrollReveal>
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>
               
               <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 text-white">
                   <Lock size={32} />
               </div>
               
               <h2 className="text-3xl font-bold text-white mb-4">Your Data. Your Keys.</h2>
               <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                   Unlike other platforms, Infinity is designed to be local-first. Bring your own Gemini API key for complete privacy. 
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

      {/* 9. Pricing (Completely Free) */}
      <section className="py-24 px-6 bg-black border-t border-white/10 relative z-20">
          <ScrollReveal>
          <div className="max-w-7xl mx-auto text-center">
              <div className="mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Completely Free. Forever.</h2>
                  <p className="text-zinc-500 text-xl max-w-2xl mx-auto">
                      Infinity is a community project supported by user contributions. 
                      Bring your own API key for unlimited AI power.
                  </p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                  <div className="p-10 rounded-[40px] border border-white/10 bg-zinc-900/50 hover:border-white/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                          <div className="text-left">
                              <h3 className="text-3xl font-bold mb-2 text-white">Fair Use Plan</h3>
                              <p className="text-zinc-500">Everything included.</p>
                          </div>
                          <div className="text-6xl font-bold tracking-tight text-white">$0</div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-left mb-10">
                          {['Deep Think Engine', 'Voice Commands', 'Unlimited Collections', 'Notion Integration', 'Spotify Integration', 'Figma Integration', 'Local-First Privacy', 'Community Support'].map(f => (
                              <div key={f} className="flex items-center gap-3">
                                  <CheckCircle size={20} className="text-green-500 shrink-0" />
                                  <span className="text-zinc-300 font-medium">{f}</span>
                              </div>
                          ))}
                      </div>

                      <button 
                        onClick={onGetStarted} 
                        className="w-full py-5 rounded-full bg-white text-black text-lg font-bold hover:bg-gray-200 hover:scale-[1.02] transition-all shadow-xl"
                      >
                          Get Started for Free
                      </button>
                      <p className="mt-4 text-xs text-zinc-600">Open source friendly. No hidden fees.</p>
                  </div>
              </div>
          </div>
          </ScrollReveal>
      </section>

      {/* 11. Final CTA */}
      <section className="py-32 px-6 bg-black text-center relative overflow-hidden z-20">
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
                   Start Searching Now
               </button>
               <p className="mt-6 text-zinc-500 text-sm">No credit card required</p>
           </div>
           </ScrollReveal>
      </section>

      {/* 12. Footer */}
      <footer className="py-20 px-6 bg-black border-t border-white/10 relative z-20">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                  <div>
                      <div className="flex items-center gap-3 font-bold text-2xl tracking-tight mb-6 text-white">
                        <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="Logo" className="w-8 h-8 rounded-lg grayscale hover:grayscale-0 transition-all" />
                        Infinity 2.0
                      </div>
                      <p className="text-zinc-500 max-w-sm">
                          The intelligent search workspace for the modern internet.
                      </p>
                  </div>
              </div>
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-zinc-600 text-sm">© 2025 Infinity Search Inc.</p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default MarketingPage;
