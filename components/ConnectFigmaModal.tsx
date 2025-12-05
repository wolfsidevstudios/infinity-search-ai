import React from 'react';
import { X, Link as LinkIcon } from 'lucide-react';

interface ConnectFigmaModalProps {
  onClose: () => void;
  onConnect: () => void;
}

const ConnectFigmaModal: React.FC<ConnectFigmaModalProps> = ({ onClose, onConnect }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl flex flex-col items-center animate-slideUp border border-gray-100">
        
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <X size={24} />
        </button>

        {/* Icons Row */}
        <div className="flex items-center gap-6 mb-8 mt-4">
            {/* App Logo */}
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
                <img src="https://iili.io/fIDzzRS.png" alt="Infinity" className="w-full h-full object-cover" />
            </div>
            
            {/* Link Icon */}
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <LinkIcon size={20} />
            </div>

            {/* Figma Logo */}
            <div className="w-20 h-20 bg-white border border-gray-200 rounded-3xl flex items-center justify-center shadow-sm p-4">
                 <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 346 512.36">
                    <g fillRule="nonzero">
                        <path fill="#00B6FF" d="M172.53 246.9c0-42.04 34.09-76.11 76.12-76.11h11.01c.3.01.63-.01.94-.01 47.16 0 85.4 38.25 85.4 85.4 0 47.15-38.24 85.39-85.4 85.39-.31 0-.64-.01-.95-.01l-11 .01c-42.03 0-76.12-34.09-76.12-76.12V246.9z"/>
                        <path fill="#24CB71" d="M0 426.98c0-47.16 38.24-85.41 85.4-85.41l87.13.01v84.52c0 47.65-39.06 86.26-86.71 86.26C38.67 512.36 0 474.13 0 426.98z"/>
                        <path fill="#FF7237" d="M172.53.01v170.78h87.13c.3-.01.63.01.94.01 47.16 0 85.4-38.25 85.4-85.4C346 38.24 307.76 0 260.6 0c-.31 0-.64.01-.95.01h-87.12z"/>
                        <path fill="#FF3737" d="M0 85.39c0 47.16 38.24 85.4 85.4 85.4h87.13V.01H85.39C38.24.01 0 38.24 0 85.39z"/>
                        <path fill="#874FFF" d="M0 256.18c0 47.16 38.24 85.4 85.4 85.4h87.13V170.8H85.39C38.24 170.8 0 209.03 0 256.18z"/>
                    </g>
                 </svg>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Connect Infinity to Figma</h2>
        <p className="text-gray-500 text-center mb-8 px-4 leading-relaxed">
            Access your design files, comments, and prototypes directly within your search workspace.
        </p>

        <div className="flex w-full gap-4">
            <button 
                onClick={onClose}
                className="flex-1 py-3.5 rounded-full bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={onConnect}
                className="flex-1 py-3.5 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors shadow-lg"
            >
                Allow access
            </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <div className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center">i</div>
            We only access files you select
        </div>

      </div>
    </div>
  );
};

export default ConnectFigmaModal;