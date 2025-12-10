
import React from 'react';
import { CodeResult } from '../types';
import { Terminal, FileCode } from 'lucide-react';

interface CodePilotViewProps {
  codeResult: CodeResult;
}

const CodePilotView: React.FC<CodePilotViewProps> = ({ codeResult }) => {
  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-slideUp px-4">
        
        <div className="flex items-center justify-between mb-8 pl-2">
            <div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-bold uppercase tracking-wider mb-2">
                    <Terminal size={16} /> Code Pilot
                </div>
                <h1 className="text-3xl font-bold text-white">Generated Solution</h1>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Code Editor View */}
            <div className="lg:col-span-2">
                <div className="bg-[#1e1e1e] rounded-[24px] overflow-hidden border border-zinc-800 shadow-2xl">
                    <div className="flex items-center justify-between px-6 py-4 bg-[#252526] border-b border-black">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <FileCode size={16} />
                            <span>{codeResult.fileName}</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                            <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                        </div>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <pre className="font-mono text-sm leading-relaxed text-[#d4d4d4]">
                            <code>{codeResult.code}</code>
                        </pre>
                    </div>
                </div>
            </div>

            {/* Explanation Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Explanation</h3>
                    <p className="text-zinc-400 leading-relaxed text-sm">
                        {codeResult.explanation}
                    </p>
                </div>

                <div className="bg-blue-900/10 border border-blue-900/30 rounded-[24px] p-6">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Language</h3>
                    <div className="text-2xl font-bold text-white capitalize">{codeResult.language}</div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default CodePilotView;
