import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, Globe, CheckCircle, Search } from 'lucide-react';

interface AgenticProcessViewProps {
  onComplete?: () => void;
  query: string;
}

const AgenticProcessView: React.FC<AgenticProcessViewProps> = ({ onComplete, query }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { text: "Analyzing your request...", icon: <BrainCircuit size={24} className="text-purple-400" /> },
    { text: "Reading trusted sources...", icon: <Globe size={24} className="text-blue-400" /> },
    { text: "Verifying facts...", icon: <Search size={24} className="text-yellow-400" /> },
    { text: "Synthesizing answer...", icon: <Sparkles size={24} className="text-green-400" /> }
  ];

  useEffect(() => {
    // Total duration ~3-4 seconds
    const stepDuration = 900;
    const totalDuration = stepDuration * steps.length + 500;
    
    const interval = setInterval(() => {
      setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepDuration);

    const progressInterval = setInterval(() => {
        setProgress(old => {
            if (old >= 100) return 100;
            return old + 2;
        });
    }, totalDuration / 50);

    const timeout = setTimeout(() => {
        if (onComplete) onComplete();
    }, totalDuration);

    return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
        clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fadeIn w-full max-w-2xl mx-auto px-6 relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
          
          {/* Main Visual: Pulsing Orb Ring */}
          <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
              {/* Outer Ring Progress */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke="#333" 
                    strokeWidth="2" 
                  />
                  <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="3" 
                    strokeDasharray="290"
                    strokeDashoffset={290 - (290 * progress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-100 ease-linear"
                  />
                  <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                  </defs>
              </svg>

              {/* Inner Pulsing Orb */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center justify-center animate-pulse">
                  <div className="w-20 h-20 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                       {steps[step].icon}
                  </div>
              </div>
          </div>

          {/* Current Step Text */}
          <h2 className="text-2xl font-medium text-white mb-2 text-center animate-slideUp key={step}">
              {steps[step].text}
          </h2>
          <p className="text-zinc-500 text-sm mb-8 text-center max-w-md">
             Gemini 2.5 is reasoning through "{query.substring(0, 30)}{query.length > 30 ? '...' : ''}"
          </p>

          {/* Steps Breadcrumbs */}
          <div className="flex items-center gap-3">
              {steps.map((s, i) => (
                  <React.Fragment key={i}>
                      <div className={`transition-all duration-500 flex items-center gap-2 px-3 py-1.5 rounded-full border ${i <= step ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-zinc-600'}`}>
                          {i < step ? <CheckCircle size={14} className="text-green-500" /> : <div className={`w-3 h-3 rounded-full ${i === step ? 'bg-blue-500 animate-pulse' : 'bg-zinc-700'}`}></div>}
                          <span className="text-xs font-medium hidden md:inline">{i === step ? 'Processing' : i < step ? 'Done' : 'Pending'}</span>
                      </div>
                      {i < steps.length - 1 && <div className={`w-8 h-[1px] ${i < step ? 'bg-white/20' : 'bg-zinc-800'}`}></div>}
                  </React.Fragment>
              ))}
          </div>

      </div>
    </div>
  );
};

export default AgenticProcessView;