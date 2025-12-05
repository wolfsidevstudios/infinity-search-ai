import React, { useEffect, useState } from 'react';
import { Terminal, Globe, Cpu, ShieldCheck } from 'lucide-react';

const AgenticProcessView: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const logs = [
      "Initializing Agent v2.5...",
      "Connecting to secure workspace...",
      "Analyzing request parameters...",
      "Launching browser environment...",
      "Navigating to search engine...",
      "Querying knowledge graph...",
      "Reading source: Wikipedia...",
      "Reading source: NewsAPI...",
      "Cross-referencing data points...",
      "Synthesizing final report..."
    ];

    const interval = setInterval(() => {
      setStep(prev => {
        if (prev < logs.length - 1) {
            setLog(curr => [...curr, logs[prev]]);
            return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fadeIn w-full max-w-4xl mx-auto">
      
      <div className="relative w-full max-w-2xl aspect-video bg-gray-900 rounded-t-xl rounded-b-md border-[12px] border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Monitor Frame Details */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full opacity-50"></div>
        
        {/* Screen Header */}
        <div className="bg-gray-800 h-8 flex items-center px-4 gap-2 border-b border-gray-700">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="flex-1 text-center text-xs text-gray-400 font-mono">agent_workspace_preview.exe</div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 bg-black/90 p-6 font-mono text-sm overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            <div className="relative z-10 flex gap-6 h-full">
                {/* Left Panel: Logs */}
                <div className="w-1/2 flex flex-col border-r border-green-500/20 pr-4">
                    <div className="text-emerald-500 font-bold mb-4 flex items-center gap-2">
                        <Terminal size={14} /> SYSTEM_LOGS
                    </div>
                    <div className="flex-1 overflow-hidden flex flex-col gap-2">
                        {log.map((line, i) => (
                            <div key={i} className="text-green-400/80 animate-slideRight">
                                <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                > {line}
                            </div>
                        ))}
                        <div className="w-2 h-4 bg-green-500 animate-pulse mt-1"></div>
                    </div>
                </div>

                {/* Right Panel: Active Task Visualization */}
                <div className="w-1/2 flex flex-col items-center justify-center relative">
                     <div className="absolute inset-0 bg-emerald-500/5 rounded-lg animate-pulse"></div>
                     <div className="w-24 h-24 rounded-full border border-emerald-500/30 flex items-center justify-center mb-4 relative">
                        <div className="absolute inset-0 border-t-2 border-emerald-400 rounded-full animate-spin"></div>
                        <Cpu size={32} className="text-emerald-400" />
                     </div>
                     <div className="text-emerald-300 font-bold tracking-widest text-xs">PROCESSING</div>
                     
                     <div className="mt-8 grid grid-cols-2 gap-2 w-full px-4">
                        <div className="bg-gray-800/50 p-2 rounded border border-gray-700 flex items-center gap-2">
                            <Globe size={12} className="text-blue-400" />
                            <div className="h-1 bg-blue-400/30 flex-1 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-400 w-[70%] animate-pulse"></div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 p-2 rounded border border-gray-700 flex items-center gap-2">
                            <ShieldCheck size={12} className="text-purple-400" />
                            <div className="text-[10px] text-purple-300">Verified</div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Stand */}
      <div className="w-32 h-16 bg-gradient-to-b from-gray-800 to-gray-900 mx-auto -mt-2 rounded-b-lg shadow-xl relative z-[-1]"></div>
      <div className="w-48 h-2 bg-gray-800 mx-auto rounded-full mt-1 opacity-50 blur-sm"></div>

      <p className="mt-8 text-white/70 font-light tracking-widest uppercase text-sm animate-pulse">Agent is thinking...</p>
    </div>
  );
};

export default AgenticProcessView;