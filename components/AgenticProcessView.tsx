
import React, { useEffect, useState } from 'react';
import { Sparkles, Globe, ShieldCheck, BrainCircuit, CheckCircle2 } from 'lucide-react';

interface AgenticProcessViewProps {
  onComplete?: () => void;
  query: string;
}

const AgenticProcessView: React.FC<AgenticProcessViewProps> = ({ onComplete, query }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { text: "Understanding your question...", icon: BrainCircuit },
    { text: "Reading trusted sources...", icon: Globe },
    { text: "Verifying facts & data...", icon: ShieldCheck },
    { text: "Writing your answer...", icon: Sparkles },
  ];

  useEffect(() => {
    const stepDuration = 800; // ms per step
    
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, stepDuration);

    const totalTime = (steps.length * stepDuration) + 500;
    const timeout = setTimeout(() => {
        if (onComplete) onComplete();
    }, totalTime);

    return () => {
        clearInterval(interval);
        clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full animate-fadeIn relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center">
        
        {/* Central Visual */}
        <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
            {/* Spinning Rings */}
            <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-spin duration-[2s]"></div>
            <div className="absolute inset-2 border-r-4 border-blue-400/50 rounded-full animate-spin duration-[3s] direction-reverse"></div>
            
            {/* Center Icon */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <BrainCircuit size={40} className="text-white" />
            </div>
        </div>

        {/* Steps */}
        <div className="w-full space-y-6">
            <h2 className="text-2xl font-bold text-white text-center mb-8 tracking-tight">
                Thinking Deeply...
            </h2>
            
            <div className="space-y-4 px-8">
                {steps.map((step, index) => {
                    const isActive = index === activeStep;
                    const isCompleted = index < activeStep;
                    const Icon = step.icon;

                    return (
                        <div 
                            key={index}
                            className={`flex items-center gap-4 transition-all duration-500 ${
                                isActive || isCompleted ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                isCompleted 
                                    ? 'bg-green-500 border-green-500 text-black scale-100' 
                                    : isActive 
                                        ? 'bg-white border-white text-black scale-110 shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                                        : 'border-white/20 text-white/20 scale-90'
                            }`}>
                                {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={14} />}
                            </div>
                            
                            <span className={`text-lg font-medium transition-colors ${
                                isActive ? 'text-white' : isCompleted ? 'text-white/60' : 'text-white/20'
                            }`}>
                                {step.text}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>

      </div>
      
      <div className="absolute bottom-10 text-white/30 text-sm font-medium tracking-widest uppercase">
          Powered by Gemini 3.0
      </div>
    </div>
  );
};

export default AgenticProcessView;
