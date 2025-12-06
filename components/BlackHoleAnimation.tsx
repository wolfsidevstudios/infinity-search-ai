
import React, { useEffect, useRef } from 'react';

const BlackHoleAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const particles: Particle[] = [];
    const particleCount = 4000; // Increased for dense "millions" feel

    class Particle {
      x: number;
      y: number;
      radius: number;
      angle: number;
      speed: number;
      size: number;
      opacity: number;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        // Start from random distance, spread out further
        this.radius = initial 
            ? Math.random() * (width * 1.5) 
            : width / 2 + Math.random() * 400;
            
        this.angle = Math.random() * Math.PI * 2;
        
        // Closer particles move faster
        this.speed = 0.5 + Math.random() * 2;
        this.size = Math.random() * 1.2;
        this.opacity = Math.random() * 0.8 + 0.2;
        
        // Calculate initial cartesian
        this.x = centerX + Math.cos(this.angle) * this.radius;
        this.y = centerY + Math.sin(this.angle) * this.radius;
      }

      update() {
        // Spiral in
        this.radius -= this.speed * (this.radius / 600); // Accelerate as they get closer
        this.angle += (this.speed / this.radius) * 8; // Higher angular velocity near center

        // Update Position
        this.x = centerX + Math.cos(this.angle) * this.radius;
        this.y = centerY + Math.sin(this.angle) * this.radius;

        // Reset if sucked in (event horizon)
        if (this.radius < 15) {
          this.reset();
        }
      }

      draw() {
        ctx!.beginPath();
        // Create trail effect by drawing lines or just dots
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Fade logic: bright near center, fade out at edges
        const distRatio = 1 - (this.radius / (width / 1.5));
        const alpha = Math.max(0, this.opacity * distRatio);
        
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`; 
        ctx!.fill();
      }
    }

    // Initialize
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const animate = () => {
      // Trail effect: clear with black opacity to create trails, blends with black bg
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Slightly higher opacity to clean trails faster for high particle count
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw the "Black Hole" center - pure black void
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Accretion disk glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 25, centerX, centerY, 150);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(0.15, 'rgba(255,255,255,0.05)'); // subtle rim
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default BlackHoleAnimation;
