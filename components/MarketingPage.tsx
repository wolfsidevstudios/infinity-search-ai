
import React, { useState } from 'react';
import { ArrowRight, Search, Zap, Globe, Shield, Music, Layers, Cpu, Users, BarChart, MessageSquare, CheckCircle, Smartphone, Lock, HelpCircle, Code, Terminal, Activity, Bell, List, Star, ChevronDown, Check, LayoutGrid, Sparkles } from 'lucide-react';

interface MarketingPageProps {
  onGetStarted: () => void;
  onViewAssets: () => void;
}

const MarketingPage: React.FC<MarketingPageProps> = ({ onGetStarted, onViewAssets }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* Custom Styles */}
      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scroll 30s linear infinite; }
        
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        @keyframes float-delayed { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; animation-delay: 2s; }

        @keyframes float-horizontal { 0%, 100% { transform: translateX(0px); } 50% { transform: translateX(5px); } }
        .animate-float-horizontal { animation: float-horizontal 5s ease-in-out infinite; }

        .bg-dot-pattern {
            background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
            background-size: 20px 20px;
        }
      `}</style>

      {/* 1. Header (Updated Layout) */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-black">
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                 <div className="grid grid-cols-2 gap-0.5">
                     <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                 </div>
             </div>
             Infinity
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Features</button>
            <button className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Solutions</button>
            <button className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Resources</button>
            <button className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Pricing</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
                onClick={onGetStarted}
                className="hidden md:block text-sm font-medium text-gray-900 hover:text-gray-600"
            >
                Sign in
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-white text-black border border-gray-200 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
              Get demo
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden bg-dot-pattern">
        
        {/* Floating Elements Container */}
        <div className="max-w-7xl mx-auto relative min-h-[600px] flex flex-col items-center justify-center text-center z-10">
            
            {/* Center Content */}
            <div className="relative z-20 max-w-4xl mx-auto">
                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100">
                         <div className="grid grid-cols-2 gap-1.5">
                             <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                             <div className="w-3 h-3 bg-black rounded-full"></div>
                             <div className="w-3 h-3 bg-black rounded-full"></div>
                             <div className="w-3 h-3 bg-black rounded-full"></div>
                         </div>
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.1] text-slate-900">
                    Think, plan, and find<br />
                    <span className="text-gray-400">all in one place</span>
                </h1>
                
                <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10 font-light leading-relaxed">
                    Efficiently manage your digital life and boost productivity with AI-powered search across all your apps.
                </p>

                <button 
                    onClick={onGetStarted}
                    className="px-8 py-4 bg-[#2563EB] text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-500/20"
                >
                    Get free demo
                </button>
            </div>

            {/* Floating Card 1: Top Left Sticky Note */}
            <div className="absolute top-0 left-0 md:left-20 xl:left-40 hidden md:block animate-float">
                <div className="w-64 bg-[#FEF08A] p-6 rounded-sm shadow-xl rotate-[-6deg] relative border border-yellow-200">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-sm border-2 border-white"></div>
                    <p className="font-handwriting text-slate-800 text-lg leading-snug">
                        Ask Gemini to summarize the Q3 financial report from Notion...
                    </p>
                </div>
                <div className="absolute top-20 -left-10 bg-white p-3 rounded-2xl shadow-lg animate-float-delayed">
                     <CheckCircle className="text-blue-500 w-8 h-8" />
                </div>
            </div>

            {/* Floating Card 2: Top Right Reminders */}
            <div className="absolute top-10 right-0 md:right-20 xl:right-40 hidden md:block animate-float-delayed">
                <div className="w-72 bg-white/80 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-gray-200 rotate-[3deg]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 text-lg">Briefings</h3>
                        <span className="text-xs text-gray-400">Today</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-gray-50 mb-3">
                         <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                             <Bell size={18} />
                         </div>
                         <div className="text-left">
                             <div className="font-bold text-sm">Morning Update</div>
                             <div className="text-xs text-gray-500">Call with marketing team</div>
                         </div>
                    </div>
                     <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg w-fit">
                        <Activity size={12} /> 09:00 - 09:15
                    </div>
                </div>
                 <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 animate-float">
                     <Activity className="text-red-500 w-6 h-6" />
                </div>
            </div>

            {/* Floating Card 3: Bottom Left Tasks */}
            <div className="absolute bottom-0 left-0 md:left-10 xl:left-32 hidden md:block animate-float-horizontal">
                 <div className="w-80 bg-white p-6 rounded-[24px] shadow-2xl border border-gray-100 rotate-[3deg]">
                    <h3 className="font-bold text-gray-800 mb-4 text-left">Today's Searches</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">N</div>
                            <div className="text-sm font-medium text-gray-700">New Ideas for campaign</div>
                        </div>
                         <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">S</div>
                            <div className="text-sm font-medium text-gray-700">Spotify: Top Hits</div>
                        </div>
                    </div>
                     <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[60%] rounded-full"></div>
                     </div>
                 </div>
            </div>

            {/* Floating Card 4: Bottom Right Integrations */}
            <div className="absolute bottom-10 right-0 md:right-10 xl:right-32 hidden md:block animate-float">
                <div className="bg-white p-6 rounded-[32px] shadow-2xl border border-gray-100 rotate-[-3deg]">
                    <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider text-left">100+ Integrations</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" className="w-8 h-8" alt="Notion"/>
                        </div>
                        <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm -mt-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" className="w-6 h-8" alt="Figma"/>
                        </div>
                        <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" className="w-8 h-8" alt="Spotify"/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* 3. Infinite Marquee */}
      <section className="py-12 border-y border-gray-100 bg-white overflow-hidden">
        <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by teams at</p>
        <div className="relative w-full overflow-hidden">
            <div className="flex w-[200%] animate-scroll">
                <div className="flex justify-around min-w-[50%] px-10 gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
                    <div className="text-xl font-bold flex items-center gap-2"><Globe size={24}/> Acme Corp</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Layers size={24}/> StackFlow</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Cpu size={24}/> AI Labs</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Zap size={24}/> Bolt Inc</div>
                    <div className="text-xl font-bold flex items-center gap-2"><Shield size={24}/> SecureNet</div>
                     <div className="text-xl font-bold flex items-center gap-2"><Activity size={24}/> HealthPlus</div>
                </div>
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

      {/* 4. Problem Statement */}
      <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">The Problem</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Stop drowning in tabs.</h3>
              <p className="text-xl text-slate-500 leading-relaxed">
                  Your work is scattered across Notion, Figma, Spotify, and the web. 
                  Searching for "that one file" shouldn't take 20 minutes and 15 open tabs. 
                  Infinity brings it all together in one beautiful, intelligent command center.
              </p>
          </div>
      </section>

      {/* 5. Features Bento Grid */}
      <section className="py-24 px-6 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
              <div className="mb-16 text-center">
                   <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need, instantly.</h2>
                   <p className="text-slate-500 max-w-2xl mx-auto">Our AI engine connects the dots between your apps and the open web.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
                  
                  {/* Card 1: Visual Search (Large) */}
                  <div className="md:col-span-2 row-span-2 bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                      <div className="absolute top-8 left-8 z-10">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                              <LayoutGrid size={24} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Visual First Search</h3>
                          <p className="text-gray-500 max-w-sm">Browse results in a stunning gallery view. Perfect for designers, photographers, and visual thinkers.</p>
                      </div>
                      {/* Abstract Visual Grid UI */}
                      <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gray-50 rounded-tl-[32px] border-t border-l border-gray-200 p-4 grid grid-cols-2 gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white rounded-xl shadow-sm h-full w-full"></div>
                          <div className="bg-gray-200 rounded-xl shadow-sm h-full w-full"></div>
                          <div className="bg-black rounded-xl shadow-sm h-full w-full"></div>
                          <div className="bg-blue-500 rounded-xl shadow-sm h-full w-full"></div>
                      </div>
                  </div>

                  {/* Card 2: AI Brain */}
                  <div className="bg-black text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 blur-[60px] opacity-30"></div>
                      <div className="relative z-10">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                              <Sparkles size={20} />
                          </div>
                          <h3 className="text-xl font-bold mb-2">Powered by Gemini</h3>
                          <p className="text-white/60 text-sm">Advanced reasoning across documents and web sources.</p>
                      </div>
                  </div>

                  {/* Card 3: Privacy */}
                  <div className="bg-white rounded-[32px] border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                              <Lock size={20} />
                          </div>
                          <h3 className="text-xl font-bold mb-2">Privacy Built-in</h3>
                          <p className="text-gray-500 text-sm">Your API keys are stored locally. We never train on your data.</p>
                      </div>
                  </div>

              </div>
          </div>
      </section>

      {/* 6. How It Works */}
      <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16">
                   <h2 className="text-3xl font-bold">How Infinity Works</h2>
               </div>
               
               <div className="grid md:grid-cols-3 gap-12">
                   <div className="text-center">
                       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold border border-gray-100 shadow-sm">1</div>
                       <h3 className="text-xl font-bold mb-3">Connect Apps</h3>
                       <p className="text-gray-500">Securely link your Spotify, Notion, and Figma accounts via OAuth.</p>
                   </div>
                   <div className="text-center">
                       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold border border-gray-100 shadow-sm">2</div>
                       <h3 className="text-xl font-bold mb-3">Ask Anything</h3>
                       <p className="text-gray-500">Use natural language to search across all connected sources at once.</p>
                   </div>
                   <div className="text-center">
                       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold border border-gray-100 shadow-sm">3</div>
                       <h3 className="text-xl font-bold mb-3">Get Results</h3>
                       <p className="text-gray-500">See visualized answers, summaries, and direct file links instantly.</p>
                   </div>
               </div>
          </div>
      </section>

      {/* 7. Integrations Detail */}
      <section className="py-24 px-6 bg-black text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black opacity-50"></div>
           <div className="max-w-7xl mx-auto relative z-10">
               <div className="grid md:grid-cols-2 gap-16 items-center">
                   <div>
                       <h2 className="text-4xl md:text-5xl font-bold mb-6">Deep integrations with tools you love.</h2>
                       <p className="text-xl text-gray-400 mb-8">
                           We don't just index titles. Infinity understands context, content, and metadata within your favorite apps.
                       </p>
                       <ul className="space-y-4">
                           <li className="flex items-center gap-3">
                               <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black"><Check size={14}/></div>
                               <span>Spotify: Search lyrics, audio features, and playlists.</span>
                           </li>
                           <li className="flex items-center gap-3">
                               <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center"><Check size={14}/></div>
                               <span>Notion: Find nested pages and database properties.</span>
                           </li>
                           <li className="flex items-center gap-3">
                               <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white"><Check size={14}/></div>
                               <span>Figma: Locate specific frames and comments.</span>
                           </li>
                       </ul>
                   </div>
                   <div className="relative">
                       {/* Abstract Stacked Cards */}
                       <div className="w-full h-80 bg-gray-900 rounded-[32px] border border-gray-800 absolute top-0 left-0 transform rotate-[-6deg] opacity-60"></div>
                       <div className="w-full h-80 bg-gray-800 rounded-[32px] border border-gray-700 absolute top-4 left-4 transform rotate-[-3deg] opacity-80"></div>
                       <div className="w-full h-80 bg-gray-900/50 backdrop-blur-xl rounded-[32px] border border-gray-600 relative p-8 flex flex-col justify-center items-center shadow-2xl">
                           <div className="flex gap-6">
                               <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" className="w-10 h-10"/></div>
                               <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg"><img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" className="w-10 h-10"/></div>
                           </div>
                           <div className="mt-8 text-center">
                               <div className="bg-black/50 px-4 py-2 rounded-full text-sm font-mono text-green-400 border border-green-900/50">
                                   Status: Connected
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
               <h2 className="text-3xl font-bold text-center mb-16">Loved by productive people</h2>
               <div className="grid md:grid-cols-3 gap-8">
                   {[
                       { name: "Alex Chen", role: "Product Designer", text: "Finally, I don't have to open Figma just to check one comment. Infinity saves me hours every week." },
                       { name: "Sarah Miller", role: "Content Creator", text: "The visual search is a game changer. Being able to see results from Pexels and my Notion docs side-by-side is magic." },
                       { name: "James Wilson", role: "Developer", text: "I love that I can bring my own API key. It feels secure and the responses are incredibly fast." }
                   ].map((t, i) => (
                       <div key={i} className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                           <div className="flex gap-1 mb-4 text-yellow-400">
                               <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                           </div>
                           <p className="text-slate-700 mb-6 leading-relaxed">"{t.text}"</p>
                           <div>
                               <div className="font-bold">{t.name}</div>
                               <div className="text-sm text-gray-500">{t.role}</div>
                           </div>
                       </div>
                   ))}
               </div>
          </div>
      </section>

      {/* 9. Pricing */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
                  <p className="text-gray-500">Start for free, upgrade for power.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Free Plan */}
                  <div className="p-8 rounded-[32px] border border-gray-200 hover:border-gray-300 transition-all">
                      <h3 className="text-xl font-bold mb-2">Starter</h3>
                      <div className="text-4xl font-bold mb-6">$0</div>
                      <p className="text-gray-500 mb-8">Perfect for personal use and exploration.</p>
                      <ul className="space-y-4 mb-8">
                          {['Unlimited Web Search', '3 Connected Apps', 'Basic Visual Results', 'Community Support'].map(f => (
                              <li key={f} className="flex items-center gap-3">
                                  <CheckCircle size={18} className="text-green-500" />
                                  <span>{f}</span>
                              </li>
                          ))}
                      </ul>
                      <button onClick={onGetStarted} className="w-full py-4 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors">Get Started</button>
                  </div>

                  {/* Pro Plan */}
                  <div className="p-8 rounded-[32px] bg-black text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-gradient-to-bl from-blue-600 to-transparent w-32 h-32 opacity-50"></div>
                      <h3 className="text-xl font-bold mb-2">Pro</h3>
                      <div className="text-4xl font-bold mb-6">$12<span className="text-lg font-normal text-gray-400">/mo</span></div>
                      <p className="text-gray-400 mb-8">For power users who need advanced reasoning.</p>
                      <ul className="space-y-4 mb-8">
                          {['Everything in Starter', 'Unlimited Integrations', 'Gemini 1.5 Pro Access', 'Priority Support', 'Early Feature Access'].map(f => (
                              <li key={f} className="flex items-center gap-3">
                                  <CheckCircle size={18} className="text-blue-400" />
                                  <span>{f}</span>
                              </li>
                          ))}
                      </ul>
                      <button onClick={onGetStarted} className="w-full py-4 rounded-xl bg-blue-600 font-bold hover:bg-blue-700 transition-colors shadow-lg">Upgrade to Pro</button>
                  </div>
              </div>
          </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-24 px-6 bg-gray-50">
           <div className="max-w-3xl mx-auto">
               <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
               <div className="space-y-4">
                   {[
                       { q: "Is my data secure?", a: "Yes. Infinity operates on a 'local-first' principle for API keys. Your Gemini API key is stored in your browser's local storage and is never sent to our servers." },
                       { q: "Do I need a paid Gemini subscription?", a: "To use the advanced features with your own key, you might need a billing account with Google Cloud, but the free tier of Gemini API is sufficient for many use cases." },
                       { q: "Can I connect custom apps?", a: "Currently we support Notion, Spotify, and Figma. We are working on a developer API to allow custom integrations soon." },
                       { q: "Is there a mobile app?", a: "Infinity is a Progressive Web App (PWA). You can add it to your home screen on iOS and Android for a native-like experience." }
                   ].map((item, index) => (
                       <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                           <button 
                                onClick={() => toggleFaq(index)}
                                className="w-full p-6 text-left flex justify-between items-center font-bold text-slate-900"
                           >
                               {item.q}
                               <ChevronDown size={20} className={`transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                           </button>
                           {openFaq === index && (
                               <div className="px-6 pb-6 text-slate-500 leading-relaxed">
                                   {item.a}
                               </div>
                           )}
                       </div>
                   ))}
               </div>
           </div>
      </section>

      {/* 11. Final CTA */}
      <section className="py-32 px-6 bg-white text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none"></div>
           <div className="relative z-10 max-w-4xl mx-auto">
               <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
                   Ready to organize <br/> your digital chaos?
               </h2>
               <button 
                   onClick={onGetStarted}
                   className="px-10 py-5 bg-black text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
               >
                   Start Searching for Free
               </button>
               <p className="mt-6 text-gray-500 text-sm">No credit card required • Cancel anytime</p>
           </div>
      </section>

      {/* 12. Footer */}
      <footer className="py-20 px-6 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                  <div>
                      <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-6">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                        </div>
                        Infinity
                      </div>
                      <p className="text-gray-400 max-w-sm">
                          The intelligent search workspace for the modern internet.
                      </p>
                  </div>
                  <div className="flex gap-20">
                      <div>
                          <h4 className="font-bold mb-6">Product</h4>
                          <ul className="space-y-4 text-gray-500 text-sm">
                              <li className="hover:text-black cursor-pointer">Features</li>
                              <li className="hover:text-black cursor-pointer">Pricing</li>
                              <li className="hover:text-black cursor-pointer">Changelog</li>
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-bold mb-6">Resources</h4>
                          <ul className="space-y-4 text-gray-500 text-sm">
                              <li className="hover:text-black cursor-pointer" onClick={onViewAssets}>Media Kit</li>
                              <li className="hover:text-black cursor-pointer">Careers</li>
                              <li className="hover:text-black cursor-pointer">Contact</li>
                          </ul>
                      </div>
                  </div>
              </div>
              <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-gray-400 text-sm">© 2025 Infinity Search Inc.</p>
                  <div className="flex gap-6 text-gray-400">
                      <Globe size={20} className="hover:text-black cursor-pointer" />
                      <MessageSquare size={20} className="hover:text-black cursor-pointer" />
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default MarketingPage;
