
import React from 'react';
import { ArrowRight, Search, Zap, Globe, Shield, Music, Layers, Cpu, Users, BarChart, MessageSquare, CheckCircle, Smartphone, Lock, HelpCircle, Code, Terminal, Activity, Bell, List } from 'lucide-react';

interface MarketingPageProps {
  onGetStarted: () => void;
  onViewAssets: () => void;
}

const MarketingPage: React.FC<MarketingPageProps> = ({ onGetStarted, onViewAssets }) => {
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

      {/* 2. Hero Section (Updated to match ChronoTask Reference) */}
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
                    Efficiently manage your digital life and boost productivity with AI-powered search.
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

      {/* 4. Footer */}
      <footer className="py-20 px-6 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                  <div>
                      <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-6">
                        <div className="w-8 h-8 bg-black rounded-lg"></div>
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
