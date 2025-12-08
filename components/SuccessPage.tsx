
import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface SuccessPageProps {
  provider: string;
  onContinue: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ provider, onContinue }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animation delay
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const getProviderName = (p: string) => {
      if (p === 'google') return 'Google Drive';
      return p.charAt(0).toUpperCase() + p.slice(1);
  };

  const name = getProviderName(provider);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className={`relative z-10 max-w-md w-full bg-zinc-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl flex flex-col items-center text-center transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Success Icon Animation */}
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-500 blur-[40px] opacity-40 rounded-full animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle size={48} className="text-white drop-shadow-md" />
            </div>
            <div className="absolute -top-2 -right-2 bg-white text-black p-2 rounded-full shadow-lg animate-bounce">
                <Sparkles size={16} />
            </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Success!</h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            You have successfully connected <strong className="text-white">{name}</strong> to your Infinity workspace.
        </p>

        <div className="w-full bg-zinc-800/50 rounded-2xl p-4 mb-8 border border-white/5 flex items-center gap-3">
            <ShieldCheck className="text-green-400 shrink-0" size={20} />
            <div className="text-left">
                <div className="text-sm font-bold text-white">Secure Connection Active</div>
                <div className="text-xs text-zinc-500">Token encrypted and stored locally.</div>
            </div>
        </div>

        <button 
            onClick={onContinue}
            className="w-full py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-2 group"
        >
            Continue to App <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
};

export default SuccessPage;
