import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, RefreshCw } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure permissions are granted.");
      onClose();
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get base64 string (remove prefix for consistency with app logic)
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        onCapture(imageSrc);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <button onClick={onClose} className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white">
          <X size={24} />
        </button>
        <button 
          onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
          className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white"
        >
          <RefreshCw size={24} />
        </button>
      </div>

      {/* Video Feed */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Footer / Capture */}
      <div className="absolute bottom-0 left-0 right-0 p-10 flex justify-center z-20 bg-gradient-to-t from-black/80 to-transparent">
        <button 
          onClick={handleCapture}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-transform"
        >
          <div className="w-16 h-16 bg-white rounded-full group-active:bg-gray-200" />
        </button>
      </div>
    </div>
  );
};

export default CameraView;