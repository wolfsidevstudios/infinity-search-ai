
import React, { useState } from 'react';
import { CodeResult } from '../types';
import { Github, Save, Check, ExternalLink, FileCode, Terminal } from 'lucide-react';
import { pushCodeToGithub } from '../services/githubService';

interface CodePilotViewProps {
  codeResult: CodeResult;
  githubToken: string | null;
  onConnectGithub: () => void;
}

const CodePilotView: React.FC<CodePilotViewProps> = ({ codeResult, githubToken, onConnectGithub }) => {
  const [repoName, setRepoName] = useState('infinity-snippets');
  const [fileName, setFileName] = useState(codeResult.fileName);
  const [isPushing, setIsPushing] = useState(false);
  const [pushUrl, setPushUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePush = async () => {
      if (!githubToken) {
          onConnectGithub();
          return;
      }
      
      setIsPushing(true);
      setError(null);
      
      const result = await pushCodeToGithub(githubToken, repoName, fileName, codeResult.code, codeResult.explanation);
      
      if (result.success && result.url) {
          setPushUrl(result.url);
      } else {
          setError(result.error || "Failed to push to GitHub");
      }
      setIsPushing(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-slideUp px-4">
        
        <div className="flex items-center justify-between mb-8 pl-2">
            <div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-bold uppercase tracking-wider mb-2">
                    <Terminal size={16} /> Code Pilot
                </div>
                <h1 className="text-3xl font-bold text-white">Generated Solution</h1>
            </div>
            
            {/* GitHub Actions */}
            <div className="flex items-center gap-4">
                {githubToken ? (
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl p-1.5 pl-4">
                        <input 
                            type="text" 
                            value={repoName} 
                            onChange={(e) => setRepoName(e.target.value)}
                            className="bg-transparent text-sm text-white w-32 outline-none placeholder-zinc-500"
                            placeholder="repo-name"
                        />
                        <div className="h-4 w-[1px] bg-zinc-700"></div>
                        <input 
                            type="text" 
                            value={fileName} 
                            onChange={(e) => setFileName(e.target.value)}
                            className="bg-transparent text-sm text-white w-32 outline-none placeholder-zinc-500"
                            placeholder="filename.js"
                        />
                        <button 
                            onClick={handlePush} 
                            disabled={isPushing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                                pushUrl ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-zinc-200'
                            }`}
                        >
                            {isPushing ? 'Pushing...' : pushUrl ? <Check size={16}/> : <><Github size={16}/> Push</>}
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={onConnectGithub}
                        className="flex items-center gap-2 px-6 py-3 bg-[#24292e] text-white rounded-full font-bold hover:bg-[#2f363d] transition-all shadow-lg"
                    >
                        <Github size={18} /> Connect GitHub
                    </button>
                )}
            </div>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-2xl text-red-400 text-sm font-medium">
                Error: {error}
            </div>
        )}

        {pushUrl && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-900/50 rounded-2xl text-green-400 text-sm font-medium flex items-center justify-between">
                <span>Successfully pushed to GitHub!</span>
                <a href={pushUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline hover:text-green-300">
                    View File <ExternalLink size={14} />
                </a>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Code Editor View */}
            <div className="lg:col-span-2">
                <div className="bg-[#1e1e1e] rounded-[24px] overflow-hidden border border-zinc-800 shadow-2xl">
                    <div className="flex items-center justify-between px-6 py-4 bg-[#252526] border-b border-black">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <FileCode size={16} />
                            <span>{fileName}</span>
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
