
import React, { useState, useEffect, useRef } from 'react';
import { Globe, Shield, Zap, Layers, Cpu, Activity, Bell, CheckCircle, LayoutGrid, Sparkles, Lock, Check, ChevronDown, MessageSquare, Star } from 'lucide-react';
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
             Infinity
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</button>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Solutions</button>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Resources</button>
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-6 text-blue-300">
                    <Sparkles size={12} /> New: Gemini 2.5 Integration
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1] text-white">
                    Singularity <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">for your search.</span>
                </h1>
                
                <p className="text-xl text-gray-400 max-w-xl mb-10 font-light leading-relaxed">
                    Pull everything into one place. Infinity acts as a gravitational center for your digital life, merging web, apps, and files into a single intelligence.
                </p>

                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-gray-200 transition-all shadow-xl hover:shadow-white/20 hover:scale-105"
                    >
                        Start Searching Free
                    </button>
                    <button 
                         onClick={onViewAssets}
                        className="px-8 py-4 bg-transparent border border-white/20 text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all"
                    >
                        View Media Kit
                    </button>
                </div>

                <div className="mt-12 flex items-center gap-4 text-sm text-gray-500 font-mono">
                    <div className="flex -space-x-2">
                         <div className="w-8 h-8 rounded-full bg-zinc-800 border border-black flex items-center justify-center text-[10px]">JD</div>
                         <div className="w-8 h-8 rounded-full bg-zinc-700 border border-black flex items-center justify-center text-[10px]">AS</div>
                         <div className="w-8 h-8 rounded-full bg-zinc-600 border border-black flex items-center justify-center text-[10px]">+2k</div>
                    </div>
                    <div>Joined by 2,000+ early adopters</div>
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
                         <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" className="w-8 h-8 opacity-80" alt="Notion"/>
                    </div>
                     <div className="absolute bottom-[30%] left-[15%] bg-zinc-900/40 backdrop-blur-md p-4 rounded-xl border border-white/10 animate-pulse delay-700">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" className="w-8 h-8 opacity-80" alt="Spotify"/>
                    </div>
                    <div className="absolute top-[40%] left-[10%] bg-zinc-900/40 backdrop-blur-md p-4 rounded-xl border border-white/10 animate-pulse delay-300">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" className="w-6 h-8 opacity-80" alt="Figma"/>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* 3. Infinite Marquee */}
      <section className="py-12 border-y border-white/10 bg-black overflow-hidden relative z-20">
        <p className="text-center text-sm font-bold text-zinc-600 uppercase tracking-widest mb-8">Trusted by teams at</p>
        <div className="relative w-full overflow-hidden">
            <div className="flex w-[200%] animate-scroll">
                <div className="flex justify-around min-w-[50%] px-10 gap-12 opacity-40 grayscale transition-all text-white">
                    <div className="text-xl font-bold flex items-center gap-2"><Globe size={24}/> Acme Corp</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Layers size={24}/> StackFlow</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Cpu size={24}/> AI Labs</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Zap size={24}/> Bolt Inc</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Shield size={24}/> SecureNet</div>
                     <div className="text-xl font-bold flex items-center gap-2"><Activity size={24}/> HealthPlus</div>
                </div>
                <div className="flex justify-around min-w-[50%] px-10 gap-12 opacity-40 grayscale transition-all text-white">
                    <div className="text-xl font-bold flex items-center gap-2"><Globe size={24}/> Acme Corp</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Layers size={24}/> StackFlow</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Cpu size={24}/> AI Labs</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Zap size={24}/> Bolt Inc</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Shield size={24}/> SecureNet</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Activity size={24}/> HealthPlus</div>
                </div>
            </div>
        </div>
      </section>

      {/* 4. Problem Statement */}
      <section className="py-24 px-6 bg-black relative z-20">
          <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">The Problem</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Stop drowning in tabs.</h3>
              <p className="text-xl text-zinc-400 leading-relaxed">
                  Your work is scattered across Notion, Figma, Spotify, and the web. 
                  Searching for "that one file" shouldn't take 20 minutes and 15 open tabs. 
                  Infinity brings it all together in one beautiful, intelligent command center.
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
                   <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Everything you need, <span className="text-zinc-500">instantly.</span></h2>
                   <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                       Our AI engine connects the dots between your apps and the open web, wrapping it all in a beautiful interface.
                   </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 min-h-[600px]">
                  
                  {/* Card 1: Visual Search (Large) */}
                  <div className="md:col-span-2 row-span-2 bg-zinc-900/40 backdrop-blur-2xl rounded-[40px] border border-white/10 p-10 hover:border-white/20 transition-all duration-500 relative overflow-hidden group">
                      <div className="relative z-20">
                          <div className="w-14 h-14 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                              <LayoutGrid size={28} />
                          </div>
                          <h3 className="text-3xl font-bold mb-3 text-white">Visual First Search</h3>
                          <p className="text-zinc-400 max-w-sm text-lg leading-relaxed">
                              Browse results in a stunning gallery view. Designed for visual thinkers who need inspiration fast.
                          </p>
                      </div>
                      
                      {/* Abstract UI Representation */}
                      <div className="absolute top-1/2 right-[-5%] w-[60%] h-[120%] bg-black/40 backdrop-blur-md rounded-l-[40px] border-l border-t border-white/10 p-6 grid grid-cols-2 gap-4 transform rotate-[-6deg] group-hover:rotate-0 transition-all duration-700 ease-out shadow-2xl">
                          <div className="bg-zinc-800/50 rounded-2xl overflow-hidden border border-white/5 relative group/img">
                              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover opacity-80 group-hover/img:scale-110 transition-transform duration-700" alt="Abstract" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>
                          <div className="bg-zinc-800/50 rounded-2xl overflow-hidden border border-white/5 relative group/img mt-8">
                               <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover opacity-80 group-hover/img:scale-110 transition-transform duration-700" alt="Neon" />
                          </div>
                          <div className="bg-zinc-800/50 rounded-2xl overflow-hidden border border-white/5 relative group/img -mt-8">
                               <img src="https://images.unsplash.com/photo-1542202229-7d93c33f5d07?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover opacity-80 group-hover/img:scale-110 transition-transform duration-700" alt="Forest" />
                          </div>
                          <div className="bg-zinc-800/50 rounded-2xl overflow-hidden border border-white/5 relative group/img">
                               <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover opacity-80 group-hover/img:scale-110 transition-transform duration-700" alt="City" />
                          </div>
                      </div>
                      
                      {/* Gradient Overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Card 2: AI Brain (Frosted Light) */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[40px] border border-white/20 p-8 shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                      
                      <div className="relative z-10 h-full flex flex-col">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30 text-white shadow-inner">
                              <Sparkles size={24} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-white">Powered by Gemini</h3>
                          <p className="text-zinc-300 text-sm leading-relaxed">
                              Advanced reasoning across documents and web sources. Capable of understanding complex context.
                          </p>
                      </div>
                  </div>

                  {/* Card 3: Privacy (Frosted Dark with Green) */}
                  <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8 shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                       <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-green-500/20 transition-colors duration-500"></div>
                       
                       <div className="relative z-10 h-full flex flex-col">
                          <div className="w-12 h-12 bg-green-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-green-500/30 text-green-400 shadow-inner">
                              <Lock size={24} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2 text-white">Privacy Built-in</h3>
                          <p className="text-zinc-400 text-sm leading-relaxed">
                              Your API keys are stored locally on your device. We never train on your personal data.
                          </p>
                      </div>
                  </div>

              </div>
          </div>
          </ScrollReveal>
      </section>

      {/* 6. How It Works */}
      <section className="py-24 px-6 bg-black relative z-20">
          <ScrollReveal>
          <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16">
                   <h2 className="text-3xl font-bold text-white">How Infinity Works</h2>
               </div>
               
               <div className="grid md:grid-cols-3 gap-12">
                   <div className="text-center group">
                       <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold border border-zinc-800 shadow-sm group-hover:scale-110 transition-transform text-white">1</div>
                       <h3 className="text-xl font-bold mb-3 text-white">Connect Apps</h3>
                       <p className="text-zinc-500">Securely link your Spotify, Notion, and Figma accounts via OAuth.</p>
                   </div>
                   <div className="text-center group">
                       <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold border border-zinc-800 shadow-sm group-hover:scale-110 transition-transform delay-100 text-white">2</div>
                       <h3 className="text-xl font-bold mb-3 text-white">Ask Anything</h3>
                       <p className="text-zinc-500">Use natural language to search across all connected sources at once.</p>
                   </div>
                   <div className="text-center group">
                       <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold border border-zinc-800 shadow-sm group-hover:scale-110 transition-transform delay-200 text-white">3</div>
                       <h3 className="text-xl font-bold mb-3 text-white">Get Results</h3>
                       <p className="text-zinc-500">See visualized answers, summaries, and direct file links instantly.</p>
                   </div>
               </div>
          </div>
          </ScrollReveal>
      </section>

      {/* 7. Integrations Detail - ANIMATED REDESIGN */}
      <section className="py-24 px-6 bg-zinc-900 text-white relative overflow-hidden border-y border-white/5 z-20">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-black opacity-50"></div>
           <ScrollReveal>
           <div className="max-w-7xl mx-auto relative z-10">
               <div className="grid md:grid-cols-2 gap-20 items-center">
                   <div>
                       <h2 className="text-4xl md:text-5xl font-bold mb-6">Deep integrations <br/>with tools you love.</h2>
                       <p className="text-xl text-gray-400 mb-8">
                           We don't just index titles. Infinity understands context, content, and metadata within your favorite apps.
                       </p>
                       <ul className="space-y-4">
                           <li className="flex items-center gap-3 text-zinc-300">
                               <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black"><Check size={14}/></div>
                               <span>Spotify: Search lyrics, audio features, and playlists.</span>
                           </li>
                           <li className="flex items-center gap-3 text-zinc-300">
                               <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center"><Check size={14}/></div>
                               <span>Notion: Find nested pages and database properties.</span>
                           </li>
                           <li className="flex items-center gap-3 text-zinc-300">
                               <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white"><Check size={14}/></div>
                               <span>Figma: Locate specific frames and comments.</span>
                           </li>
                       </ul>
                   </div>
                   
                   {/* Animated Hub Visual */}
                   <div className="relative h-[400px] w-full flex items-center justify-center">
                       {/* Connection Lines Layer */}
                       <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.2))' }}>
                           {/* Center to Top (Notion) */}
                           <path d="M50% 50% L50% 20%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                           <path d="M50% 50% L50% 20%" stroke="white" strokeWidth="2" strokeDasharray="5 5" fill="none" className="animate-flow opacity-60" />

                           {/* Center to Bottom Left (Spotify) */}
                           <path d="M50% 50% L20% 80%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                           <path d="M50% 50% L20% 80%" stroke="#1DB954" strokeWidth="2" strokeDasharray="5 5" fill="none" className="animate-flow opacity-60" style={{ animationDelay: '1s' }} />

                           {/* Center to Bottom Right (Figma) */}
                           <path d="M50% 50% L80% 80%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
                           <path d="M50% 50% L80% 80%" stroke="#A259FF" strokeWidth="2" strokeDasharray="5 5" fill="none" className="animate-flow opacity-60" style={{ animationDelay: '0.5s' }} />
                       </svg>

                       {/* Central Infinity Hub */}
                       <div className="relative z-20 w-32 h-32 bg-black border-2 border-white/20 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-pulse">
                           <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" className="w-16 h-16 rounded-xl" alt="Infinity" />
                           <div className="absolute -bottom-8 text-xs font-mono text-zinc-500">Connecting...</div>
                       </div>

                       {/* Floating Nodes */}
                       {/* Notion Node */}
                       <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-20 h-20 bg-zinc-900 border border-white/20 rounded-2xl flex items-center justify-center shadow-xl animate-float-icon" style={{ animationDelay: '0s' }}>
                           <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" className="w-10 h-10" alt="Notion" />
                           <div className="absolute -right-2 -top-2 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                       </div>

                       {/* Spotify Node */}
                       <div className="absolute bottom-[10%] left-[15%] w-20 h-20 bg-zinc-900 border border-white/20 rounded-2xl flex items-center justify-center shadow-xl animate-float-icon" style={{ animationDelay: '2s' }}>
                           <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" className="w-10 h-10" alt="Spotify" />
                           <div className="absolute -right-2 -top-2 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                       </div>

                       {/* Figma Node */}
                       <div className="absolute bottom-[10%] right-[15%] w-20 h-20 bg-zinc-900 border border-white/20 rounded-2xl flex items-center justify-center shadow-xl animate-float-icon" style={{ animationDelay: '1s' }}>
                           <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" className="w-8 h-10" alt="Figma" />
                           <div className="absolute -right-2 -top-2 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                       </div>

                   </div>
               </div>
           </div>
           </ScrollReveal>
      </section>

      {/* 8. Testimonials */}
      <section className="py-24 px-6 bg-black relative z-20">
          <ScrollReveal>
          <div className="max-w-7xl mx-auto">
               <h2 className="text-3xl font-bold text-center mb-16 text-white">Loved by productive people</h2>
               <div className="grid md:grid-cols-3 gap-8">
                   {[
                       { name: "Alex Chen", role: "Product Designer", text: "Finally, I don't have to open Figma just to check one comment. Infinity saves me hours every week." },
                       { name: "Sarah Miller", role: "Content Creator", text: "The visual search is a game changer. Being able to see results from Pexels and my Notion docs side-by-side is magic." },
                       { name: "James Wilson", role: "Developer", text: "I love that I can bring my own API key. It feels secure and the responses are incredibly fast." }
                   ].map((t, i) => (
                       <div key={i} className="bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg hover:border-zinc-700">
                           <div className="flex gap-1 mb-4 text-yellow-500">
                               <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                           </div>
                           <p className="text-zinc-300 mb-6 leading-relaxed">"{t.text}"</p>
                           <div>
                               <div className="font-bold text-white">{t.name}</div>
                               <div className="text-sm text-zinc-500">{t.role}</div>
                           </div>
                       </div>
                   ))}
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
                          {['Unlimited Web Search', 'Unlimited Connected Apps', 'Visual Results Gallery', 'Notion Integration', 'Spotify Integration', 'Figma Integration', 'Local-First Privacy', 'Community Support'].map(f => (
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

      {/* 10. FAQ */}
      <section className="py-24 px-6 bg-black relative z-20">
           <ScrollReveal>
           <div className="max-w-3xl mx-auto">
               <h2 className="text-3xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
               <div className="space-y-4">
                   {[
                       { q: "Is my data secure?", a: "Yes. Infinity operates on a 'local-first' principle for API keys. Your Gemini API key is stored in your browser's local storage and is never sent to our servers." },
                       { q: "Why is it free?", a: "We believe in democratizing access to intelligent search. We cover basic costs, and power users provide their own API keys for heavy lifting." },
                       { q: "Can I connect custom apps?", a: "Currently we support Notion, Spotify, and Figma. We are working on a developer API to allow custom integrations soon." },
                       { q: "Is there a mobile app?", a: "Infinity is a Progressive Web App (PWA). You can add it to your home screen on iOS and Android for a native-like experience." }
                   ].map((item, index) => (
                       <div key={index} className="bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden">
                           <button 
                                onClick={() => toggleFaq(index)}
                                className="w-full p-6 text-left flex justify-between items-center font-bold text-white hover:bg-zinc-800 transition-colors"
                           >
                               {item.q}
                               <ChevronDown size={20} className={`transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                           </button>
                           {openFaq === index && (
                               <div className="px-6 pb-6 text-zinc-400 leading-relaxed animate-fadeIn">
                                   {item.a}
                               </div>
                           )}
                       </div>
                   ))}
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
                        Infinity
                      </div>
                      <p className="text-zinc-500 max-w-sm">
                          The intelligent search workspace for the modern internet.
                      </p>
                  </div>
                  <div className="flex gap-20">
                      <div>
                          <h4 className="font-bold mb-6 text-white">Product</h4>
                          <ul className="space-y-4 text-zinc-500 text-sm">
                              <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                              <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                              <li className="hover:text-white cursor-pointer transition-colors">Changelog</li>
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-bold mb-6 text-white">Resources</h4>
                          <ul className="space-y-4 text-zinc-500 text-sm">
                              <li className="hover:text-white cursor-pointer transition-colors" onClick={onViewAssets}>Media Kit</li>
                              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                              <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                          </ul>
                      </div>
                  </div>
              </div>
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-zinc-600 text-sm">© 2025 Infinity Search Inc.</p>
                  <div className="flex gap-6 text-zinc-500">
                      <Globe size={20} className="hover:text-white cursor-pointer transition-colors" />
                      <MessageSquare size={20} className="hover:text-white cursor-pointer transition-colors" />
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default MarketingPage;