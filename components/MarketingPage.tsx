
import React, { useState, useEffect, useRef } from 'react';
/* Added Play, ShieldCheck, and Crown to imports to fix compilation errors on lines 131, 253, and 312 */
import { Shield, Zap, Layers, Cpu, Activity, LayoutGrid, Sparkles, Lock, Check, ChevronDown, MessageSquare, Code, Terminal, Mic, Bookmark, BrainCircuit, Search, X, Server, Database, ArrowRight, Command, Globe, ExternalLink, Play, ShieldCheck, Crown } from 'lucide-react';

interface MarketingPageProps {
  onGetStarted: () => void;
  onViewAssets: () => void;
}

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
            className={`transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isVisible ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-12 filter blur-lg'} ${className}`}
        >
            {children}
        </div>
    );
};

const MarketingPage: React.FC<MarketingPageProps> = ({ onGetStarted, onViewAssets }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
        question: "Is Infinity OS truly local-first?",
        answer: "Absolutely. Your encryption keys, search history, and connected app tokens never leave your browser's secure enclave. We provide the interface; you provide the intelligence."
    },
    {
        question: "How does 'Deep Think' differ from standard search?",
        answer: "Standard search finds links. Deep Think performs research. It breaks your query into multi-step reasoning chains, verifies cross-source validity, and synthesizes an authoritative answer."
    },
    {
        question: "Do I need a paid API key?",
        answer: "Infinity OS is free to use. To unlock advanced reasoning models like Gemini 2.5 Pro or Grok 3, you can connect your own API keys. We also offer a managed Pro tier for convenience."
    }
  ];

  const HERO_IMG = "https://i.ibb.co/Rkftnft0/DALL-E-2025-02-13-11-20-56-A-stunning-and-ultra-modern-background-image-for-an-AI-search-engine-interfac.webp";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 overflow-x-hidden">
      
      {/* 1. Sophisticated Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'py-4 bg-black/60 backdrop-blur-2xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
             <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
                <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="Logo" className="w-6 h-6 relative z-10" />
             </div>
             <span className="font-bold text-xl tracking-tighter uppercase italic">Infinity</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
            {['Intelligence', 'Privacy', 'Ecosystem', 'Drops'].map((item) => (
                <button key={item} className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 hover:text-white transition-all duration-300">{item}</button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onGetStarted} className="hidden md:block text-xs font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors">Sign In</button>
            <button 
              onClick={onGetStarted}
              className="bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Launch OS
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Immersive Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Background Image with Layered Gradients */}
          <div className="absolute inset-0 z-0">
              <img src={HERO_IMG} className="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_10s_ease-in-out_infinite]" alt="Deep Background" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
              <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full text-center">
              <ScrollReveal>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-12 animate-fadeIn">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Version 26.0 • Now Stable</span>
                  </div>
                  
                  <h1 className="text-7xl md:text-[9rem] font-serif-display leading-[0.85] tracking-tighter mb-12">
                      The Architecture <br/>
                      <span className="italic font-light opacity-80 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">of Thought.</span>
                  </h1>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto">
                      <p className="text-lg md:text-xl text-white/50 font-light leading-relaxed text-center md:text-left border-l-2 border-white/10 pl-8">
                          Infinity OS is a spatial workspace that synthesizes the web into a unified, agentic stream. Built for the high-performance mind.
                      </p>
                      <div className="shrink-0 flex flex-col gap-4">
                          <button 
                            onClick={onGetStarted}
                            className="bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                          >
                            Get Started
                          </button>
                          <button className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                             Watch the Keynote <Play size={10} fill="currentColor" />
                          </button>
                      </div>
                  </div>
              </ScrollReveal>
          </div>

          {/* Bottom Floating Stats */}
          <div className="absolute bottom-12 left-0 right-0 z-20 hidden lg:block px-12">
              <div className="max-w-7xl mx-auto flex justify-between border-t border-white/10 pt-8">
                  {[
                      { label: 'Latency', value: '14ms' },
                      { label: 'Sources', value: '10B+' },
                      { label: 'Privacy', value: 'Zero-Log' },
                      { label: 'Kernel', value: 'Synapse 2' }
                  ].map((stat, i) => (
                      <div key={i} className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</span>
                          <span className="text-xl font-serif italic text-white/80">{stat.value}</span>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 3. Deep Think Section (High End Visual) */}
      <section className="py-40 px-8 relative overflow-hidden bg-black">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
              <ScrollReveal>
                  <div className="space-y-8">
                      <h2 className="text-5xl md:text-7xl font-serif-display leading-tight">
                          Research <br/>
                          <span className="text-white/40">In Real-Time.</span>
                      </h2>
                      <div className="h-[1px] w-24 bg-white/20"></div>
                      <p className="text-xl text-white/60 font-light leading-relaxed max-w-lg">
                          Most AI's guess the next word. Infinity OS computes the best answer. By cross-referencing live data streams, our Deep Think engine provides a verified perspective on complex reality.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-8 pt-8">
                          <div className="space-y-4">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                  <BrainCircuit size={20} className="text-blue-400"/>
                              </div>
                              <h4 className="font-bold text-sm tracking-tight">Agentic Reasoning</h4>
                              <p className="text-xs text-white/40 leading-relaxed">Multi-turn planning to ensure data integrity.</p>
                          </div>
                          <div className="space-y-4">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                  <Globe size={20} className="text-purple-400"/>
                              </div>
                              <h4 className="font-bold text-sm tracking-tight">Live Grounding</h4>
                              <p className="text-xs text-white/40 leading-relaxed">Connected to the current pulse of the internet.</p>
                          </div>
                      </div>
                  </div>
              </ScrollReveal>

              <ScrollReveal className="relative">
                  <div className="aspect-[4/5] rounded-[60px] bg-zinc-900/50 border border-white/10 relative overflow-hidden shadow-2xl group">
                       <img src="https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" alt="Tech" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                       
                       <div className="absolute bottom-12 left-12 right-12 space-y-6">
                           <div className="p-6 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl animate-slideUp">
                               <div className="flex items-center gap-3 mb-4">
                                   <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                   <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Synapse Kernel</span>
                               </div>
                               <div className="space-y-2 font-mono text-[11px] text-white/80">
                                   <div className="flex justify-between"><span>&gt; analyze_intent</span> <span className="text-blue-400">COMPLETED</span></div>
                                   <div className="flex justify-between"><span>&gt; scrape_global_sources</span> <span className="text-blue-400">14 FOUND</span></div>
                                   <div className="flex justify-between"><span>&gt; verify_contradictions</span> <span className="animate-pulse text-yellow-500">IN PROGRESS</span></div>
                               </div>
                           </div>
                       </div>
                  </div>
              </ScrollReveal>
          </div>
      </section>

      {/* 4. Feature Bento (Modern Editorial Style) */}
      <section className="py-40 px-8 bg-[#050505]">
          <div className="max-w-7xl mx-auto">
              <ScrollReveal className="text-center mb-24">
                  <h2 className="text-5xl md:text-6xl font-serif-display mb-6 italic">Built for the Architect.</h2>
                  <p className="text-white/40 uppercase tracking-[0.4em] text-xs font-black">A New Paradigm in Workspace Utility</p>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
                  {/* Big Card: Canvas */}
                  <div className="md:col-span-8 bg-zinc-900/20 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 flex flex-col justify-between group hover:border-white/20 transition-all duration-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                          <LayoutGrid size={120} className="text-white/5" />
                      </div>
                      <div className="relative z-10 max-w-md">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 block">Spatial Workflow</span>
                          <h3 className="text-4xl font-serif mb-6">Infinite Canvas.</h3>
                          <p className="text-white/50 font-light leading-relaxed">
                              Break out of the tab cycle. Drag search results, notes, and images onto a fluid, spatial canvas where your ideas can breathe and interconnect.
                          </p>
                      </div>
                      <div className="relative h-64 mt-12 bg-black/40 rounded-3xl border border-white/5 shadow-inner overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full animate-pulse"></div>
                      </div>
                  </div>

                  {/* Vertical Card: Privacy */}
                  <div className="md:col-span-4 bg-[#111] border border-white/5 rounded-[40px] p-12 flex flex-col group hover:border-green-500/30 transition-all duration-700 relative overflow-hidden">
                      <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                          <Lock size={200} />
                      </div>
                      <div className="relative z-10 mb-auto">
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-4 block">Data Sovereignty</span>
                          <h3 className="text-3xl font-serif mb-6">Zero-Knowledge Architecture.</h3>
                          <p className="text-white/40 text-sm leading-relaxed mb-8">
                              We built Infinity OS with the radical belief that your thoughts are yours alone. Your search history and keys stay on your machine. Always.
                          </p>
                      </div>
                      <div className="relative p-6 bg-green-500/5 rounded-3xl border border-green-500/10">
                          <div className="flex items-center gap-3 text-green-400 text-[10px] font-bold uppercase tracking-widest">
                              <ShieldCheck size={14}/> Secure Enclave Active
                          </div>
                      </div>
                  </div>

                  {/* Horizontal Card: Ecosystem */}
                  <div className="md:col-span-12 bg-white/5 border border-white/5 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 group hover:border-white/10 transition-all duration-700 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>
                      <div className="md:w-1/2 space-y-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Open Architecture</span>
                          <h3 className="text-4xl font-serif">Unified Ecosystem.</h3>
                          <p className="text-white/50 font-light leading-relaxed">
                              Connect your existing digital life. From Notion to Spotify, Infinity OS acts as the connective tissue between your favorite applications.
                          </p>
                      </div>
                      <div className="md:w-1/2 flex justify-center gap-8 items-center">
                          {/* Floating App Icons */}
                          <div className="flex gap-4 animate-float-icon">
                               <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all"><img src="https://www.google.com/favicon.ico" className="w-8 h-8" alt="G" /></div>
                               <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all"><img src="https://notion.so/favicon.ico" className="w-8 h-8" alt="N" /></div>
                               <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 grayscale hover:grayscale-0 transition-all"><img src="https://spotify.com/favicon.ico" className="w-8 h-8" alt="S" /></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. Minimalist Pricing */}
      <section className="py-40 px-8 bg-black relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <ScrollReveal className="max-w-4xl mx-auto text-center mb-24">
              <h2 className="text-6xl font-serif-display mb-4">Investment in Mind.</h2>
              <p className="text-white/30 tracking-widest uppercase text-xs font-bold">Standard or Plus. Forever Transparent.</p>
          </ScrollReveal>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
              {/* Starter */}
              <ScrollReveal>
                  <div className="p-12 rounded-[50px] border border-white/5 bg-zinc-900/20 hover:border-white/10 transition-all duration-700">
                      <h3 className="text-xl font-bold uppercase tracking-widest mb-8">Starter</h3>
                      <div className="text-6xl font-serif-display mb-4">$0 <span className="text-lg text-white/20 italic">/ lifetime</span></div>
                      <p className="text-white/40 text-sm leading-relaxed mb-10 h-12">The foundation of your digital brain. Local search and core ecosystem access.</p>
                      <ul className="space-y-4 mb-12">
                          {['Core Deep Think Engine', 'Local History Storage', 'Basic Voice Mode', '3 Connected Apps'].map((f, i) => (
                              <li key={i} className="flex items-center gap-3 text-white/60 text-sm italic">
                                  <div className="w-1 h-1 rounded-full bg-white/40"></div> {f}
                              </li>
                          ))}
                      </ul>
                      <button onClick={onGetStarted} className="w-full py-5 rounded-2xl border border-white/20 text-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all">Get Started</button>
                  </div>
              </ScrollReveal>

              {/* Plus */}
              <ScrollReveal>
                  <div className="p-12 rounded-[50px] border border-white/10 bg-white text-black shadow-[0_0_80px_rgba(255,255,255,0.1)] relative overflow-hidden group">
                      <div className="absolute top-8 right-8">
                          <Crown size={24} className="text-black/20" />
                      </div>
                      <h3 className="text-xl font-bold uppercase tracking-widest mb-8">Plus</h3>
                      <div className="text-6xl font-serif-display mb-4">$20 <span className="text-lg text-black/40 italic">/ month</span></div>
                      <p className="text-black/60 text-sm leading-relaxed mb-10 h-12">For power users who require absolute reasoning capabilities and global sync.</p>
                      <ul className="space-y-4 mb-12">
                          {['Everything in Starter', 'Gemini 3.0 Pro Reasoning', 'Unlimited Cloud Sync', 'Priority Kernel Access'].map((f, i) => (
                              <li key={i} className="flex items-center gap-3 text-black/80 text-sm font-medium">
                                  <div className="w-1.5 h-1.5 rounded-full bg-black"></div> {f}
                              </li>
                          ))}
                      </ul>
                      <button onClick={onGetStarted} className="w-full py-5 rounded-2xl bg-black text-white font-bold uppercase text-xs tracking-widest hover:scale-[1.02] transition-all">Join Pro Waitlist</button>
                  </div>
              </ScrollReveal>
          </div>
      </section>

      {/* 6. FAQ - Clean Accordion */}
      <section className="py-40 px-8 bg-black">
          <div className="max-w-3xl mx-auto">
              <ScrollReveal className="text-center mb-24">
                  <h2 className="text-4xl font-serif mb-4">Frequently Asked.</h2>
              </ScrollReveal>

              <div className="space-y-6">
                 {faqs.map((faq, index) => (
                     <ScrollReveal key={index}>
                        <div className="group border-b border-white/10">
                            <button 
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full flex items-center justify-between py-8 text-left transition-all"
                            >
                                <span className={`text-xl font-serif transition-colors ${openFaq === index ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>{faq.question}</span>
                                <ChevronDown size={20} className={`text-white/20 transition-transform duration-500 ${openFaq === index ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${openFaq === index ? 'max-h-64 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="text-white/40 leading-relaxed italic font-light">{faq.answer}</p>
                            </div>
                        </div>
                     </ScrollReveal>
                 ))}
              </div>
          </div>
      </section>

      {/* 7. Final Call - High Impact */}
      <section className="py-60 px-8 bg-[#050505] relative overflow-hidden flex items-center justify-center text-center">
           <div className="absolute inset-0 z-0">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[150px] rounded-full"></div>
           </div>
           
           <ScrollReveal className="relative z-10 space-y-12">
               <h2 className="text-7xl md:text-9xl font-serif-display tracking-tight leading-[0.8]">
                   Intelligence <br/>
                   <span className="italic opacity-40">Awaits.</span>
               </h2>
               <p className="text-white/30 text-lg uppercase tracking-[0.5em] font-black">Limited Beta Access</p>
               <button 
                    onClick={onGetStarted}
                    className="px-16 py-6 bg-white text-black rounded-full font-black uppercase text-sm tracking-[0.2em] hover:scale-110 active:scale-95 transition-all shadow-[0_0_100px_rgba(255,255,255,0.15)]"
               >
                   Launch System
               </button>
           </ScrollReveal>
      </section>

      {/* 8. Minimal Footer */}
      <footer className="py-20 px-8 border-t border-white/5 bg-black">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex items-center gap-3">
                 <img src="https://i.ibb.co/pjtXDLqZ/Google-AI-Studio-2025-12-06-T01-46-54-593-Z-modified.png" alt="Logo" className="w-6 h-6 grayscale opacity-40" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/20">© 2025 Infinity Search Inc. v26.0</span>
              </div>
              <div className="flex gap-10">
                  {['Terms', 'Privacy', 'Security', 'OSS'].map(l => (
                      <button key={l} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">{l}</button>
                  ))}
              </div>
          </div>
      </footer>
    </div>
  );
};

export default MarketingPage;
