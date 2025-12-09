
import React, { useEffect, useState } from 'react';
import { Terminal, Globe, Cpu, ShieldCheck } from 'lucide-react';

interface AgenticProcessViewProps {
  onComplete?: () => void;
  query: string;
}

const AgenticProcessView: React.FC<AgenticProcessViewProps> = ({ onComplete, query }) => {
  const [log, setLog] = useState<string[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const logs = [
      "Initializing Deep Think v2.5...",
      `Analyzing intent: "${query.substring(0, 20)}..."`,
      "Decomposing query into sub-tasks...",
      "Accessing global knowledge graph...",
      "Reading source: Academic Papers...",
      "Reading source: Real-time News...",
      "Cross-referencing conflicting data...",
      "Checking factual consistency...",
      "Synthesizing multi-modal response...",
      "Finalizing output..."
    ];

    const interval = setInterval(() => {
      setStep(prev => {
        if (prev < logs.length) {
            setLog(curr => [...curr, logs[prev]]);
            return prev + 1;
        }
        return prev;
      });
    }, 600); // Faster for UX

    // Finish after logs are done + small buffer
    const totalTime = (logs.length * 600) + 800;
    const timeout = setTimeout(() => {
        if (onComplete) onComplete();
    }, totalTime);

    return () => {
        clearInterval(interval);
        clearTimeout(timeout);
    };
  }, [onComplete, query]);

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fadeIn w-full max-w-4xl mx-auto px-6">
      
      <div className="relative w-full max-w-3xl bg-gray-900 rounded-t-xl rounded-b-md border-[1px] border-gray-700 shadow-2xl overflow-hidden flex flex-col transform transition-all hover:scale-[1.01]">
        
        {/* Screen Header */}
        <div className="bg-gray-800 h-10 flex items-center px-4 gap-2 border-b border-gray-700 justify-between">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                <Cpu size={12} /> deep_think_engine.exe
            </div>
        </div>

        {/* Screen Content */}
        <div className="h-[400px] bg-black/95 p-8 font-mono text-sm overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,150,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,150,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="relative z-10 flex gap-10 h-full">
                {/* Left Panel: Logs */}
                <div className="w-3/5 flex flex-col border-r border-gray-800 pr-6">
                    <div className="text-emerald-500 font-bold mb-6 flex items-center gap-2 tracking-wider">
                        <Terminal size={16} /> REASONING_LOGS
                    </div>
                    <div className="flex-1 overflow-hidden flex flex-col gap-3">
                        {log.map((line, i) => (
                            <div key={i} className="text-emerald-400/90 animate-slideRight text-xs md:text-sm">
                                <span className="text-gray-600 mr-3">[{new Date().toLocaleTimeString()}]</span>
                                {'>'} {line}
                            </div>
                        ))}
                        <div className="w-2 h-5 bg-emerald-500 animate-pulse mt-2"></div>
                    </div>
                </div>

                {/* Right Panel: Active Task Visualization */}
                <div className="w-2/5 flex flex-col items-center justify-center relative">
                     <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl animate-pulse blur-xl"></div>
                     
                     <div className="relative z-10">
                         <div className="w-32 h-32 rounded-full border border-emerald-500/30 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 border-t-2 border-emerald-400 rounded-full animate-spin duration-[3s]"></div>
                            <div className="absolute inset-2 border-r-2 border-blue-500/50 rounded-full animate-spin duration-[2s] direction-reverse"></div>
                            <Cpu size={48} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                         </div>
                     </div>
                     
                     <div className="text-emerald-300 font-bold tracking-[0.2em] text-sm mb-6 animate-pulse">PROCESSING</div>
                     
                     <div className="grid grid-cols-1 gap-3 w-full">
                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex items-center gap-3">
                            <Globe size={16} className="text-blue-400" />
                            <div className="flex-1">
                                <div className="text-[10px] text-gray-400 mb-1">Web Sources</div>
                                <div className="h-1 bg-blue-400/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-[85%] animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex items-center gap-3">
                            <ShieldCheck size={16} className="text-purple-400" />
                            <div className="flex-1">
                                <div className="text-[10px] text-gray-400 mb-1">Fact Verification</div>
                                <div className="h-1 bg-purple-400/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-400 w-[100%]"></div>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
      
      <p className="mt-8 text-white/50 font-light tracking-widest uppercase text-sm animate-pulse">
          Generating comprehensive analysis...
      </p>
    </div>
  );
};

export default AgenticProcessView;
