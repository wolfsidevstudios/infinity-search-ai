import React, { useEffect, useState } from 'react';
import { Globe, Search, Sparkles } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  const [text, setText] = useState("Connecting to web...");
  
  useEffect(() => {
    const steps = [
      "Connecting to web...",
      "Scrolling search results...",
      "Reading sources...",
      "Synthesizing answer..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % steps.length;
      setText(steps[i]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fadeIn">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white animate-pulse">
          <Globe size={32} />
        </div>
      </div>
      <p className="text-white text-lg font-light tracking-wide backdrop-blur-sm px-4 py-1 rounded-full bg-black/10">
        {text}
      </p>
    </div>
  );
};

export default LoadingAnimation;