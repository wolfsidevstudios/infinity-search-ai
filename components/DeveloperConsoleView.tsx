
import React, { useState, useEffect } from 'react';
import { Terminal, Server, Save, Plus, Trash2, AlertCircle, Database, Cpu, Code2 } from 'lucide-react';

const DeveloperConsoleView: React.FC = () => {
  const [customModelEnabled, setCustomModelEnabled] = useState(false);
  const [modelId, setModelId] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  const [mcpServers, setMcpServers] = useState<{name: string, url: string, status: 'connected' | 'error'}[]>([]);
  const [showAddMcp, setShowAddMcp] = useState(false);
  const [newMcpUrl, setNewMcpUrl] = useState('');

  useEffect(() => {
      const savedConfig = localStorage.getItem('custom_llm_config');
      const savedEnabled = localStorage.getItem('use_custom_llm');
      
      if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          setModelId(parsed.modelId || '');
          setBaseUrl(parsed.baseUrl || '');
          setApiKey(parsed.apiKey || '');
      }
      setCustomModelEnabled(savedEnabled === 'true');
  }, []);

  const handleSaveModel = () => {
    const config = { modelId, baseUrl, apiKey };
    localStorage.setItem('custom_llm_config', JSON.stringify(config));
    localStorage.setItem('use_custom_llm', String(customModelEnabled));
    
    // Show visual feedback (simple alert for now, could be toast)
    const btn = document.getElementById('save-model-btn');
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = 'Saved!';
        btn.classList.add('bg-green-600');
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('bg-green-600');
        }, 2000);
    }
  };

  const handleAddMcp = () => {
      if(newMcpUrl) {
          // Mock connection check
          setMcpServers([...mcpServers, { name: `Server ${mcpServers.length + 1}`, url: newMcpUrl, status: 'connected' }]);
          setNewMcpUrl('');
          setShowAddMcp(false);
      }
  };

  return (
    <div className="space-y-8 animate-slideUp max-w-4xl pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-5 mb-8 border-b border-white/10 pb-8">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-green-500 shadow-lg shadow-green-900/10">
              <Terminal size={32} />
          </div>
          <div>
              <h3 className="text-3xl font-bold text-white mb-1">Developer Console</h3>
              <p className="text-zinc-500">Advanced configuration and experimental protocols.</p>
          </div>
      </div>

      {/* Custom LLM Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 relative overflow-hidden transition-all hover:border-zinc-700">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <Cpu size={200} />
          </div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
              <h4 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400">
                      <Database size={20} />
                  </div>
                  Custom Model Override
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={customModelEnabled} onChange={e => setCustomModelEnabled(e.target.checked)} />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
              </label>
          </div>

          <p className="text-sm text-zinc-400 mb-8 max-w-2xl relative z-10 leading-relaxed">
              Override the default Gemini models with any OpenAI-compatible API endpoint (e.g., LocalAI, Ollama, Groq). 
              This allows you to power Infinity with your own fine-tuned models or local inference engines.
          </p>

          <div className={`space-y-5 transition-all duration-300 relative z-10 ${customModelEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none filter grayscale'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Model ID</label>
                      <input 
                        type="text" 
                        value={modelId}
                        onChange={e => setModelId(e.target.value)}
                        placeholder="e.g. llama-3-70b-8192" 
                        className="w-full h-12 px-4 bg-black border border-zinc-800 rounded-xl text-white font-mono text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-700"
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Base URL</label>
                      <input 
                        type="text" 
                        value={baseUrl}
                        onChange={e => setBaseUrl(e.target.value)}
                        placeholder="e.g. https://api.groq.com/openai/v1" 
                        className="w-full h-12 px-4 bg-black border border-zinc-800 rounded-xl text-white font-mono text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-700"
                      />
                  </div>
              </div>
              <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">API Key</label>
                  <input 
                    type="password" 
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-..." 
                    className="w-full h-12 px-4 bg-black border border-zinc-800 rounded-xl text-white font-mono text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-700"
                  />
              </div>
              
              <div className="pt-2">
                  <button 
                    id="save-model-btn"
                    onClick={handleSaveModel} 
                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                  >
                      <Save size={18} /> Save Configuration
                  </button>
              </div>
          </div>
      </div>

      {/* MCP Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400">
                      <Server size={20} />
                  </div>
                  Model Context Protocol (MCP)
              </h4>
              <span className="bg-purple-500/10 text-purple-400 text-[10px] font-bold px-3 py-1 rounded-full border border-purple-500/20 tracking-wider">COMING SOON</span>
          </div>

          <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed">
              Connect external data sources and tools using the standard Model Context Protocol. 
              Infinity will soon support acting as an MCP Client, allowing you to interface with local file systems, databases, and custom tools directly.
          </p>

          <div className="space-y-4 opacity-70">
              {mcpServers.map((server, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                          <div>
                              <div className="text-sm font-bold text-white">{server.name}</div>
                              <div className="text-xs text-zinc-500 font-mono">{server.url}</div>
                          </div>
                      </div>
                      <button onClick={() => setMcpServers(prev => prev.filter((_, i) => i !== idx))} className="text-zinc-600 hover:text-red-500 transition-colors p-2">
                          <Trash2 size={16} />
                      </button>
                  </div>
              ))}

              {showAddMcp ? (
                  <div className="flex gap-3 animate-fadeIn bg-black p-2 rounded-2xl border border-zinc-800">
                      <input 
                        type="text" 
                        value={newMcpUrl}
                        onChange={e => setNewMcpUrl(e.target.value)}
                        placeholder="ws://localhost:3000/mcp" 
                        className="flex-1 h-10 px-4 bg-transparent text-white font-mono text-sm outline-none"
                        autoFocus
                      />
                      <button onClick={handleAddMcp} className="px-4 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-colors">Connect</button>
                      <button onClick={() => setShowAddMcp(false)} className="px-3 text-zinc-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                  </div>
              ) : (
                  <button onClick={() => setShowAddMcp(true)} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 font-bold hover:border-zinc-600 hover:text-zinc-300 transition-all flex items-center justify-center gap-2 group">
                      <Plus size={18} className="group-hover:scale-110 transition-transform" /> Add MCP Server
                  </button>
              )}
          </div>
      </div>
      
      {/* Warning Footer */}
      <div className="p-5 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-4">
          <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-500/80 leading-relaxed">
              <span className="font-bold text-yellow-500">Developer Warning:</span> These features are experimental. Using custom models or unverified MCP servers may result in unstable behavior, hallucinations, or data leakage. Proceed with caution.
          </div>
      </div>

    </div>
  );
};

export default DeveloperConsoleView;
