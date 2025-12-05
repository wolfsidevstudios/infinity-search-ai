import React from 'react';
import { X, Link as LinkIcon } from 'lucide-react';

interface ConnectNotionModalProps {
  onClose: () => void;
  onConnect: () => void;
}

const ConnectNotionModal: React.FC<ConnectNotionModalProps> = ({ onClose, onConnect }) => {
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
            {/* App Logo Placeholder */}
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center shadow-lg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            
            {/* Link Icon */}
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <LinkIcon size={20} />
            </div>

            {/* Notion Logo */}
            <div className="w-20 h-20 bg-white border border-gray-200 rounded-3xl flex items-center justify-center shadow-sm p-4">
                 <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 128.1">
                    <path d="M21.19,22.46c4,3.23,5.48,3,13,2.49l70.53-4.24c1.5,0,.25-1.49-.25-1.74L92.72,10.5a14.08,14.08,0,0,0-11-3.23l-68.29,5c-2.49.24-3,1.49-2,2.49l9.73,7.72ZM25.42,38.9v74.21c0,4,2,5.48,6.48,5.23l77.52-4.48c4.49-.25,5-3,5-6.23V33.91c0-3.23-1.25-5-4-4.73l-81,4.73c-3,.25-4,1.75-4,5Zm76.53,4c.49,2.24,0,4.48-2.25,4.73L96,48.36v54.79c-3.24,1.74-6.23,2.73-8.72,2.73-4,0-5-1.24-8-5L54.83,62.55V99.66l7.73,1.74s0,4.48-6.23,4.48l-17.2,1c-.5-1,0-3.48,1.75-4l4.48-1.25V52.59l-6.23-.5a4.66,4.66,0,0,1,4.24-5.73l18.44-1.24L87.24,84V49.6l-6.48-.74a4.21,4.21,0,0,1,4-5l17.21-1ZM7.72,5.52l71-5.23C87.49-.46,89.73.05,95.21,4L117.89,20c3.74,2.74,5,3.48,5,6.47v87.42c0,5.47-2,8.71-9,9.21l-82.5,5c-5.24.25-7.73-.5-10.47-4L4.24,102.4c-3-4-4.24-7-4.24-10.46V14.24C0,9.76,2,6,7.72,5.52Z"/>
                 </svg>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Connect Lumina to Notion</h2>
        <p className="text-gray-500 text-center mb-8 px-4 leading-relaxed">
            Allow Lumina to search your Notion pages and databases to provide answers from your personal workspace.
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
            We only access pages you select
        </div>

      </div>
    </div>
  );
};

export default ConnectNotionModal;