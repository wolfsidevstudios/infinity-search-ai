import React from 'react';
import { ArrowRight, Search, Zap, Globe, Shield, Music, Layers, Cpu, Users, BarChart, MessageSquare, CheckCircle, Smartphone, Lock, HelpCircle, Code, Terminal, Activity } from 'lucide-react';

interface MarketingPageProps {
  onGetStarted: () => void;
}

const MarketingPage: React.FC<MarketingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>

      {/* 1. Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <img src="https://iili.io/fIDzzRS.png" alt="Infinity Logo" className="w-8 h-8 rounded-lg shadow-sm object-cover" />
            Infinity
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:block text-sm font-medium text-gray-500 hover:text-black transition-colors">Features</button>
            <button className="hidden md:block text-sm font-medium text-gray-500 hover:text-black transition-colors">Integrations</button>
            <button className="hidden md:block text-sm font-medium text-gray-500 hover:text-black transition-colors">Enterprise</button>
            <button 
              onClick={onGetStarted}
              className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg hover:shadow-black/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Abstract BG Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 animate-fadeIn shadow-sm hover:shadow-md transition-shadow">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> v2.5 Public Beta
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] animate-slideUp">
            Search your world.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-black">All in one place.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Infinity connects your apps, web searches, and local files into a single, intelligent workspace powered by Gemini AI.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={onGetStarted}
              className="px-10 py-5 bg-black text-white text-lg font-bold rounded-full flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Searching Free <ArrowRight size={20} />
            </button>
            <button className="px-10 py-5 bg-white text-black border border-gray-200 text-lg font-bold rounded-full hover:bg-gray-50 transition-all">
              Watch 2 min Demo
            </button>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-slideUp" style={{ animationDelay: '0.3s' }}>
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-[40px] blur-2xl opacity-50" />
             <div className="relative bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden aspect-[16/9] flex flex-col transform transition-transform hover:scale-[1.01] duration-700">
                <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-2 bg-gray-50/50">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                        <div className="w-3 h-3 rounded-full bg-green-400/20" />
                    </div>
                    <div className="flex-1 mx-4 h-8 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center text-xs text-gray-400 font-mono">
                        infinity-search.ai
                    </div>
                </div>
                <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center bg-white relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] opacity-[0.03] pointer-events-none">
                        {Array.from({ length: 400 }).map((_, i) => (
                            <div key={i} className="border-r border-b border-black" />
                        ))}
                    </div>
                    
                    <div className="w-full max-w-xl bg-white rounded-full shadow-2xl border border-gray-100 p-2 flex items-center gap-4 transform transition-transform hover:scale-105 duration-500 group cursor-pointer animate-float">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shrink-0 group-hover:bg-blue-600 transition-colors">
                            <Search size={24} />
                        </div>
                        <div className="flex-1 text-2xl font-light text-gray-300 group-hover:text-gray-400 transition-colors">
                            Ask anything...
                        </div>
                    </div>

                    {/* Floating App Icons */}
                    <div className="absolute top-1/4 left-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 animate-float-delayed">
                        <Music className="text-green-500" />
                    </div>
                    <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 animate-float">
                         <Layers className="text-black" />
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. Infinite Marquee */}
      <section className="py-12 border-b border-gray-100 bg-gray-50/50 overflow-hidden">
        <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Powering Teams At</p>
        <div className="relative w-full overflow-hidden">
            <div className="flex w-[200%] animate-scroll">
                {/* Logo Set 1 */}
                <div className="flex justify-around min-w-[50%] px-10 gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
                    <div className="text-xl font-bold flex items-center gap-2"><Globe size={24}/> Acme Corp</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Layers size={24}/> StackFlow</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Cpu size={24}/> AI Labs</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Zap size={24}/> Bolt Inc</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Shield size={24}/> SecureNet</div>
                     <div className="text-xl font-bold flex items-center gap-2"><Activity size={24}/> HealthPlus</div>
                </div>
                 {/* Logo Set 2 (Duplicate for smooth scroll) */}
                <div className="flex justify-around min-w-[50%] px-10 gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
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

      {/* 4. Bento Grid Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Everything you need.<br/>Nothing you don't.</h2>
                <p className="text-xl text-gray-500 font-light">
                    We stripped away the clutter of traditional search engines and replaced it with pure intelligence.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 - Web & News */}
                <div className="md:col-span-2 bg-gray-50 rounded-[40px] p-12 border border-gray-100 hover:shadow-2xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={240} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Lightning Fast Results</h3>
                    <p className="text-gray-500 max-w-md leading-relaxed text-lg">
                        Powered by Google's Gemini 2.5 Flash model, get answers synthesized from the live web in milliseconds.
                    </p>
                    <div className="mt-10 flex gap-3">
                        <div className="px-5 py-2 bg-white shadow-sm rounded-xl text-xs font-bold uppercase tracking-wider animate-float">Web</div>
                        <div className="px-5 py-2 bg-white shadow-sm rounded-xl text-xs font-bold uppercase tracking-wider animate-float-delayed">Images</div>
                        <div className="px-5 py-2 bg-white shadow-sm rounded-xl text-xs font-bold uppercase tracking-wider animate-float">News</div>
                    </div>
                </div>

                {/* Feature 2 - AI First */}
                <div className="bg-black text-white rounded-[40px] p-10 shadow-2xl hover:-translate-y-2 transition-transform flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity" />
                    <Cpu size={56} className="mb-6 text-blue-400" />
                    <div>
                        <h3 className="text-2xl font-bold mb-2">AI-First Core</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Built from the ground up with generative AI to understand context, intent, and nuance—not just keywords.
                        </p>
                    </div>
                </div>

                {/* Feature 3 - Spotify */}
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 hover:shadow-2xl transition-all flex flex-col items-center text-center group">
                    <div className="w-20 h-20 rounded-3xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Music size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Spotify Connected</h3>
                    <p className="text-gray-500 text-sm">Connect your account to search tracks and get AI insights.</p>
                </div>

                {/* Feature 4 - Notion Integration */}
                <div className="md:col-span-2 bg-white rounded-[40px] p-12 border border-gray-100 hover:shadow-2xl transition-all relative overflow-hidden group">
                     <div className="flex items-center gap-8 mb-8">
                        <div className="w-20 h-20 rounded-3xl bg-black flex items-center justify-center text-white p-5 shadow-lg">
                            <svg viewBox="0 0 122.88 128.1" fill="currentColor" className="w-full h-full">
                                <path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold">Connect Notion</h3>
                            <p className="text-gray-500 text-lg">Search your workspace documents alongside the web.</p>
                        </div>
                     </div>
                     <div className="absolute right-0 bottom-0 w-80 h-40 bg-gray-50 rounded-tl-[40px] border-t border-l border-gray-100 p-6 space-y-3 opacity-60 group-hover:opacity-100 transition-opacity">
                         <div className="h-3 w-2/3 bg-gray-200 rounded-full"/>
                         <div className="h-3 w-1/2 bg-gray-200 rounded-full"/>
                         <div className="h-3 w-3/4 bg-gray-200 rounded-full"/>
                         <div className="h-3 w-full bg-gray-200 rounded-full"/>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* NEW SECTION: Live Processing Terminal */}
      <section className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    <Terminal size={14} /> Live Agent V2
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Behind the curtain.</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    Watch how Infinity breaks down complex queries, delegates tasks to specialized sub-agents, and cross-references data in real-time.
                </p>
                
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> System Online
                    </div>
                     <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div> Gemini 2.5 Active
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/2 bg-[#111] rounded-xl border border-gray-800 shadow-2xl p-4 font-mono text-xs md:text-sm h-[320px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                
                {/* Simulated Logs */}
                <div className="space-y-2 opacity-80">
                    <div className="text-green-400">user@infinity:~$ search "climate change impact on gdp"</div>
                    <div className="text-blue-400">>>> INTENT_DETECTED: [Economic_Analysis, Environment]</div>
                    <div className="text-gray-400">... Initiating web_crawler_v4</div>
                    <div className="text-gray-400">... Accessing specialized_datasets (IMF, World Bank)</div>
                    <div className="text-yellow-400">! Found 142 referenced papers</div>
                    <div className="text-gray-400">... Synthesizing cross-references</div>
                    <div className="pl-4 border-l border-gray-700 text-gray-500">
                         {`{ "region": "global", "projected_loss": "11-14%", "timeline": "2050" }`}
                    </div>
                    <div className="text-purple-400">>>> GENERATING_SUMMARY...</div>
                    <div className="text-green-400">Done (0.42s).</div>
                    <div className="animate-pulse">_</div>
                </div>

                {/* Scan Line */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent h-[20%] w-full animate-scan pointer-events-none"></div>
            </div>
        </div>
      </section>

      {/* 5. Deep Dive: Intelligence */}
      <section className="py-24 bg-black text-white overflow-hidden relative border-t border-gray-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                  <div className="text-blue-500 font-bold mb-6 tracking-widest uppercase">The Brain</div>
                  <h2 className="text-5xl font-bold mb-6 leading-tight">It doesn't just search.<br/>It <span className="text-blue-400">thinks.</span></h2>
                  <p className="text-gray-400 text-xl leading-relaxed mb-8">
                      Traditional search engines give you links. Infinity reads, synthesizes, and presents answers. Whether it's complex code documentation or a simple recipe, get the "what" without the "where".
                  </p>
                  <ul className="space-y-4">
                      {['Multi-step reasoning', 'Context awareness', 'Real-time data synthesis'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-lg">
                              <CheckCircle className="text-blue-500" size={24} /> {item}
                          </li>
                      ))}
                  </ul>
              </div>
              <div className="md:w-1/2 relative">
                  {/* Glowing Ring Animation */}
                  <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 animate-pulse" />
                  
                  {/* Central Node */}
                  <div className="relative w-full aspect-square flex items-center justify-center">
                      <div className="absolute w-64 h-64 border border-blue-500/30 rounded-full animate-pulse-ring"></div>
                      <div className="absolute w-48 h-48 border border-purple-500/30 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
                      
                      {/* Floating Nodes */}
                      <div className="absolute top-10 right-20 w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 animate-float">
                          <Globe className="text-blue-400"/>
                      </div>
                      <div className="absolute bottom-20 left-10 w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 animate-float-delayed">
                          <Code className="text-green-400"/>
                      </div>
                      
                      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 relative z-10 shadow-2xl w-80">
                          <div className="flex gap-4 mb-6 border-b border-gray-800 pb-4">
                              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400"><Cpu size={20}/></div>
                              <div>
                                  <div className="text-sm text-gray-400">Processing Query</div>
                                  <div className="font-mono text-xs text-green-400">Analyzing 14 sources...</div>
                              </div>
                          </div>
                          <div className="space-y-3">
                              <div className="h-2 bg-gray-800 rounded w-full animate-pulse" />
                              <div className="h-2 bg-gray-800 rounded w-5/6 animate-pulse" style={{ animationDelay: '0.2s' }} />
                              <div className="h-2 bg-gray-800 rounded w-4/6 animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 6. Integration Carousel */}
      <section className="py-24 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-16">Your ecosystem, united.</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                      { name: 'Spotify', icon: <Music size={32}/>, color: 'text-green-500' },
                      { name: 'Notion', icon: <Layers size={32}/>, color: 'text-black' },
                      { name: 'Figma', icon: <Zap size={32}/>, color: 'text-purple-500' },
                      { name: 'Google Drive', icon: <Globe size={32}/>, color: 'text-blue-500' },
                  ].map((app, i) => (
                      <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform group">
                          <div className={`w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center ${app.color} group-hover:scale-110 transition-transform`}>
                              {app.icon}
                          </div>
                          <h3 className="font-bold text-xl">{app.name}</h3>
                          <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Live</div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 7. Use Cases */}
      <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold">Built for every workflow</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { title: 'For Developers', desc: 'Find code snippets, debug errors, and search documentation without leaving your flow.', icon: <Code/> },
                      { title: 'For Creatives', desc: 'Search visual inspiration, find assets in Figma, and generate moodboards instantly.', icon: <Zap/> },
                      { title: 'For Students', desc: 'Summarize long papers, find credible sources, and organize your research notes.', icon: <MessageSquare/> },
                  ].map((caseItem, i) => (
                      <div key={i} className="p-8 border border-gray-100 rounded-[32px] hover:bg-gray-50 transition-colors">
                          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6 shadow-lg">
                              {caseItem.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-3">{caseItem.title}</h3>
                          <p className="text-gray-500 leading-relaxed">{caseItem.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 8. Stats */}
      <section className="py-20 bg-black text-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
                  {[
                      { label: 'Queries Processed', val: '10M+' },
                      { label: 'Active Users', val: '50k+' },
                      { label: 'Apps Connected', val: '15+' },
                      { label: 'Time Saved', val: '200yrs' },
                  ].map((stat, i) => (
                      <div key={i} className="p-4">
                          <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">{stat.val}</div>
                          <div className="text-gray-500 text-sm uppercase tracking-widest">{stat.label}</div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 9. Comparison */}
      <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why switch?</h2>
              <div className="bg-gray-50 rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-xl">
                  <div className="grid grid-cols-3 gap-4 text-center border-b border-gray-200 pb-6 mb-6 font-bold text-lg">
                      <div className="text-left text-gray-400">Feature</div>
                      <div className="text-gray-400">Traditional</div>
                      <div className="text-black">Infinity</div>
                  </div>
                  {[
                      { feat: 'Ad Tracking', bad: 'Aggressive', good: 'Zero' },
                      { feat: 'Results', bad: '10 Blue Links', good: 'Direct Answer' },
                      { feat: 'Context', bad: 'None', good: 'Full History' },
                      { feat: 'App Search', bad: 'Impossible', good: 'Native' },
                      { feat: 'Privacy', bad: 'Data Sold', good: 'Encrypted' },
                  ].map((row, i) => (
                      <div key={i} className="grid grid-cols-3 gap-4 text-center py-4 border-b border-gray-200 last:border-0 items-center hover:bg-gray-50 transition-colors rounded-lg">
                          <div className="text-left font-medium pl-2">{row.feat}</div>
                          <div className="text-gray-400">{row.bad}</div>
                          <div className="font-bold flex justify-center items-center gap-2">
                              <CheckCircle size={16} className="text-green-500" /> {row.good}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 10. Privacy */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                      <Lock size={32} />
                  </div>
                  <h2 className="text-4xl font-bold mb-4">Your data stays yours.</h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-6">
                      We believe privacy is a fundamental right. Infinity performs searches locally where possible, encrypts data in transit, and never sells your personal information to advertisers.
                  </p>
                  <a href="#" className="text-blue-600 font-bold underline decoration-2 underline-offset-4">Read our Security Whitepaper</a>
              </div>
              <div className="md:w-1/2 bg-gray-50 p-10 rounded-[40px] border border-gray-100">
                  <div className="space-y-4">
                      <div className="flex items-center gap-4">
                          <Shield className="text-green-500" />
                          <span className="font-medium">SOC2 Compliant</span>
                      </div>
                      <div className="flex items-center gap-4">
                          <Shield className="text-green-500" />
                          <span className="font-medium">End-to-End Encryption</span>
                      </div>
                      <div className="flex items-center gap-4">
                          <Shield className="text-green-500" />
                          <span className="font-medium">GDPR Ready</span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 11. FAQ */}
      <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-6">
                  {[
                      { q: 'Is Infinity free to use?', a: 'Yes, we offer a generous free tier that includes unlimited web searches. Premium features like advanced AI models require a subscription.' },
                      { q: 'How do I connect my apps?', a: 'Simply go to Settings > Connected Apps and sign in with your provider. We use standard OAuth 2.0 protocols.' },
                      { q: 'Can I bring my own API key?', a: 'Absolutely. Power users can input their own Gemini API key in settings to bypass rate limits.' },
                  ].map((item, i) => (
                      <div key={i} className="p-6 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                          <h3 className="font-bold text-lg mb-2 flex justify-between">
                              {item.q} <HelpCircle size={20} className="text-gray-400" />
                          </h3>
                          <p className="text-gray-500 leading-relaxed">{item.a}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 12. Footer */}
      <footer className="py-20 px-6 bg-black text-white rounded-t-[40px]">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                  <div>
                      <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-6">
                        <img src="https://iili.io/fIDzzRS.png" alt="Infinity Logo" className="w-8 h-8 rounded-lg shadow-sm object-cover" />
                        Infinity
                      </div>
                      <p className="text-gray-400 max-w-sm">
                          The intelligent search workspace for the modern internet.
                      </p>
                  </div>
                  <div className="flex gap-20">
                      <div>
                          <h4 className="font-bold mb-6">Product</h4>
                          <ul className="space-y-4 text-gray-400 text-sm">
                              <li className="hover:text-white cursor-pointer">Features</li>
                              <li className="hover:text-white cursor-pointer">Pricing</li>
                              <li className="hover:text-white cursor-pointer">Changelog</li>
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-bold mb-6">Company</h4>
                          <ul className="space-y-4 text-gray-400 text-sm">
                              <li className="hover:text-white cursor-pointer">About</li>
                              <li className="hover:text-white cursor-pointer">Careers</li>
                              <li className="hover:text-white cursor-pointer">Contact</li>
                          </ul>
                      </div>
                  </div>
              </div>
              <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-gray-500 text-sm">© 2025 Infinity Search Inc.</p>
                  <div className="flex gap-6 text-gray-500">
                      <Globe size={20} className="hover:text-white cursor-pointer" />
                      <MessageSquare size={20} className="hover:text-white cursor-pointer" />
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default MarketingPage;