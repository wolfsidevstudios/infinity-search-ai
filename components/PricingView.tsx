
import React from 'react';
import { Check, Sparkles, Zap, Shield, Crown, ArrowRight } from 'lucide-react';

const PricingView: React.FC = () => {
  const checkoutUrl = "https://sandbox.polar.sh/checkout/polar_c_af59j8QHCjJBb3uzWdbwOjuTbrftmGe3sLXWP26VUf6";

  const features = [
    "Unlimited Deep Think queries (Gemini 2.5 Pro)",
    "Cloud History Sync & Auto-Backup",
    "Priority Support & Feature Requests",
    "Early Access to Beta Features (Vision Agent)",
    "Custom Themes & Wallpapers",
    "Support Open Source Development"
  ];

  return (
    <div className="w-full h-full overflow-y-auto glass-scroll animate-fadeIn pb-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5 text-yellow-200 text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            <Crown size={14} /> Infinity Plus
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Unlock your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-orange-400 to-yellow-200">supermind.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Upgrade to Infinity Plus for unrestricted access to our most powerful reasoning models, cloud sync, and premium customization.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* Free Tier */}
          <div className="p-8 rounded-[40px] border border-white/10 bg-zinc-900/50 backdrop-blur-xl flex flex-col hover:border-white/20 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
            <div className="text-5xl font-bold text-white mb-6">$0<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
            <p className="text-zinc-400 mb-8 h-12">Perfect for casual browsing and quick answers.</p>
            
            <div className="space-y-4 mb-8 flex-1">
              {['Standard Search', 'Local History Storage', 'Basic Voice Mode', '3 Connected Apps'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                    <Check size={14} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full py-4 bg-zinc-800 text-white rounded-2xl font-bold cursor-not-allowed opacity-70">
              Current Plan
            </button>
          </div>

          {/* Pro Tier - Highlighted */}
          <div className="relative p-1 rounded-[40px] bg-gradient-to-b from-yellow-500 via-orange-500 to-purple-600 shadow-2xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
              Recommended
            </div>
            
            <div className="h-full bg-black rounded-[38px] p-8 flex flex-col relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] pointer-events-none"></div>

               <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400 mb-2 flex items-center gap-2">
                 Plus <Sparkles size={20} className="text-yellow-400" />
               </h3>
               <div className="text-5xl font-bold text-white mb-6">$20<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
               <p className="text-zinc-300 mb-8 h-12">For power users who need deep reasoning and sync.</p>

               <div className="space-y-4 mb-10 flex-1">
                  {features.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shrink-0 shadow-lg">
                        <Check size={14} className="text-black font-bold" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
               </div>

               <a 
                 href={checkoutUrl}
                 target="_blank"
                 rel="noreferrer"
                 className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
               >
                 Upgrade Now <ArrowRight size={20} />
               </a>
               <p className="text-center text-xs text-zinc-500 mt-4">Secure payment via Polar.sh</p>
            </div>
          </div>

        </div>

        {/* Trust/Footer */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <Shield size={32} className="mx-auto mb-4 text-green-400" />
                <h4 className="font-bold text-white mb-2">Secure & Private</h4>
                <p className="text-sm text-zinc-500">We don't sell your data. Your privacy is our business model.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <Zap size={32} className="mx-auto mb-4 text-blue-400" />
                <h4 className="font-bold text-white mb-2">Blazing Fast</h4>
                <p className="text-sm text-zinc-500">Access the fastest models with zero latency caps.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <Sparkles size={32} className="mx-auto mb-4 text-purple-400" />
                <h4 className="font-bold text-white mb-2">Cutting Edge</h4>
                <p className="text-sm text-zinc-500">Get access to new AI agents before they are public.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PricingView;
    