import React from 'react';
import { ArrowRight, Search, Zap, Globe, Shield, Music, Layers, Cpu } from 'lucide-react';

interface MarketingPageProps {
  onGetStarted: () => void;
}

const MarketingPage: React.FC<MarketingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            Lumina
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-sm font-medium text-gray-500 hover:text-black transition-colors">Features</button>
            <button className="hidden md:block text-sm font-medium text-gray-500 hover:text-black transition-colors">Pricing</button>
            <button 
              onClick={onGetStarted}
              className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> v2.0 Now Available
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] animate-slideUp">
            Search your world.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-black">All in one place.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Lumina connects your apps, web searches, and local files into a single, intelligent workspace powered by Gemini AI.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={onGetStarted}
              className="px-10 py-5 bg-black text-white text-lg font-bold rounded-full flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Searching Free <ArrowRight size={20} />
            </button>
            <button className="px-10 py-5 bg-white text-black border border-gray-200 text-lg font-bold rounded-full hover:bg-gray-50 transition-all">
              View Demo
            </button>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-slideUp" style={{ animationDelay: '0.3s' }}>
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-[40px] blur-2xl opacity-50" />
             <div className="relative bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden aspect-[16/9] flex flex-col">
                {/* Mock Browser UI */}
                <div className="h-12 border-b border-gray-100 flex items-center px-6 gap-2 bg-gray-50/50">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                        <div className="w-3 h-3 rounded-full bg-green-400/20" />
                    </div>
                    <div className="flex-1 mx-4 h-8 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center text-xs text-gray-400 font-mono">
                        lumina-search.ai
                    </div>
                </div>
                {/* Content */}
                <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center bg-white relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] opacity-[0.03] pointer-events-none">
                        {Array.from({ length: 400 }).map((_, i) => (
                            <div key={i} className="border-r border-b border-black" />
                        ))}
                    </div>
                    
                    <div className="w-full max-w-xl bg-white rounded-full shadow-2xl border border-gray-100 p-2 flex items-center gap-4 transform transition-transform hover:scale-105 duration-500">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                            <Search size={24} />
                        </div>
                        <div className="flex-1 text-2xl font-light text-gray-300">
                            Ask anything...
                        </div>
                        <div className="flex -space-x-2 mr-2">
                           <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white">
                               <Music size={16} />
                           </div>
                           <div className="w-10 h-10 rounded-full bg-black border-2 border-white flex items-center justify-center text-white p-2">
                               <svg viewBox="0 0 122.88 128.1" fill="currentColor" className="w-full h-full">
                                  <path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/>
                               </svg>
                           </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-16 text-center tracking-tight">Everything you need.<br/>Nothing you don't.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="md:col-span-2 bg-white rounded-[32px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={200} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Lightning Fast Results</h3>
                    <p className="text-gray-500 max-w-md leading-relaxed">
                        Powered by Google's Gemini 2.5 Flash model, get answers synthesized from the live web in milliseconds.
                    </p>
                    <div className="mt-8 flex gap-2">
                        <div className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold uppercase">Web</div>
                        <div className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold uppercase">Images</div>
                        <div className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold uppercase">News</div>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-black text-white rounded-[32px] p-10 shadow-xl hover:-translate-y-2 transition-transform flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 blur-[60px] opacity-40" />
                    <Cpu size={48} className="mb-6 text-blue-400" />
                    <div>
                        <h3 className="text-2xl font-bold mb-2">AI-First</h3>
                        <p className="text-gray-400 text-sm">
                            Built from the ground up with generative AI to understand context, not just keywords.
                        </p>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-6">
                        <Music size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Spotify Integration</h3>
                    <p className="text-gray-500 text-sm">Connect your account to search tracks and get AI insights.</p>
                </div>

                {/* Feature 4 - Notion */}
                <div className="md:col-span-2 bg-white rounded-[32px] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
                     <div className="flex items-center gap-6 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white p-4">
                            <svg viewBox="0 0 122.88 128.1" fill="currentColor" className="w-full h-full">
                                <path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Connect Notion</h3>
                            <p className="text-gray-500">Search your workspace documents alongside the web.</p>
                        </div>
                     </div>
                     <div className="absolute right-0 bottom-0 w-64 h-32 bg-gray-50 rounded-tl-3xl border-t border-l border-gray-100 p-4 space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                         <div className="h-2 w-2/3 bg-gray-200 rounded-full"/>
                         <div className="h-2 w-1/2 bg-gray-200 rounded-full"/>
                         <div className="h-2 w-3/4 bg-gray-200 rounded-full"/>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-gray-100 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to explore?</h2>
          <button 
              onClick={onGetStarted}
              className="px-10 py-4 bg-black text-white text-lg font-bold rounded-full hover:scale-105 transition-transform"
            >
              Launch Lumina
            </button>
            <p className="mt-8 text-gray-400 text-sm">© 2025 Lumina Search. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MarketingPage;