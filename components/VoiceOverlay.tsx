
import React, { useEffect, useState } from 'react';
import { Mic, X, MicOff } from 'lucide-react';
import BlackHoleAnimation from './BlackHoleAnimation';

interface VoiceOverlayProps {
  onClose: () => void;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'listening' | 'processing' | 'speaking'>('listening');
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Simulate interaction cycle for demo purposes
    let timeout: any;
    
    if (status === 'listening') {
        timeout = setTimeout(() => {
            setStatus('processing');
            setTranscript("Start searching for quantum computing updates...");
        }, 3000);
    } else if (status === 'processing') {
        timeout = setTimeout(() => {
            setStatus('speaking');
            setTranscript("I found several new breakthroughs in quantum coherence from Google and IBM.");
        }, 2000);
    } else if (status === 'speaking') {
        timeout = setTimeout(() => {
            setStatus('listening');
            setTranscript("");
        }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fadeIn">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all z-50 group"
        >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>

        {/* Status Text */}
        <div className="absolute top-12 left-0 right-0 text-center z-40">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                <div className={`w-2 h-2 rounded-full ${status === 'listening' ? 'bg-red-500 animate-pulse' : status === 'processing' ? 'bg-blue-500 animate-bounce' : 'bg-green-500'}`}></div>
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                    {status === 'listening' ? 'Listening' : status === 'processing' ? 'Thinking' : 'Speaking'}
                </span>
            </div>
        </div>

        {/* Center Visual (Orb) */}
        <div className="relative w-full h-[60vh] flex items-center justify-center">
            {/* Using BlackHoleAnimation as the base for the voice orb, scaled down */}
            <div className={`transition-all duration-700 ease-out ${status === 'speaking' ? 'scale-125' : 'scale-100'}`}>
                <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden relative shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                    <BlackHoleAnimation />
                    
                    {/* Overlay to tint the hole based on state */}
                    <div className={`absolute inset-0 transition-colors duration-1000 mix-blend-overlay ${
                        status === 'listening' ? 'bg-red-500/10' : 
                        status === 'processing' ? 'bg-blue-500/10' : 
                        'bg-green-500/10'
                    }`}></div>
                </div>
            </div>
        </div>

        {/* Transcription / Subtitles */}
        <div className="absolute bottom-20 left-0 right-0 px-8 text-center z-40">
            <p className={`text-2xl md:text-4xl font-light text-white leading-relaxed max-w-4xl mx-auto transition-all duration-500 ${transcript ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                "{transcript}"
            </p>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 flex gap-6 z-50">
            <button className="p-4 rounded-full bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-all">
                <MicOff size={24} />
            </button>
        </div>

    </div>
  );
};

export default VoiceOverlay;
