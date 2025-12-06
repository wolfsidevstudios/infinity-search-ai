
import React, { useEffect, useRef } from 'react';

const BlackHoleAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;

    // Function to update dimensions and center point
    const updateDimensions = () => {
        const parent = canvas.parentElement;
        if (parent) {
            width = canvas.width = parent.clientWidth;
            height = canvas.height = parent.clientHeight;
        } else {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        centerX = width / 2;
        centerY = height / 2;
    };

    // Initial sizing
    updateDimensions();

    const particles: Particle[] = [];
    const particleCount = 3000;

    class Particle {
      x: number = 0;
      y: number = 0;
      radius: number = 0;
      angle: number = 0;
      speed: number = 0;
      size: number = 0;
      opacity: number = 0;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        // Start from random distance, spread out further
        // Use current width/height for placement
        const maxDist = Math.max(width, height) / 1.5;
        
        this.radius = initial 
            ? Math.random() * maxDist 
            : maxDist + Math.random() * 100;
            
        this.angle = Math.random() * Math.PI * 2;
        
        // Closer particles move faster
        this.speed = 0.5 + Math.random() * 2;
        this.size = Math.random() * 1.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        
        // Calculate initial cartesian
        this.x = centerX + Math.cos(this.angle) * this.radius;
        this.y = centerY + Math.sin(this.angle) * this.radius;
      }

      update() {
        // Spiral in
        this.radius -= this.speed * (this.radius / 500); // Accelerate as they get closer
        this.angle += (this.speed / Math.max(1, this.radius)) * 5; // Higher angular velocity near center

        // Update Position using current center
        this.x = centerX + Math.cos(this.angle) * this.radius;
        this.y = centerY + Math.sin(this.angle) * this.radius;

        // Reset if sucked in (event horizon)
        if (this.radius < 10) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Fade logic
        const maxDist = Math.max(width, height) / 2;
        const distRatio = Math.max(0, 1 - (this.radius / maxDist));
        const alpha = this.opacity * distRatio;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; 
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      // Trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw the "Black Hole" center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Accretion disk glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 120);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,0.05)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Use ResizeObserver for robust sizing
    const resizeObserver = new ResizeObserver(() => {
        updateDimensions();
    });

    if (canvas.parentElement) {
        resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default BlackHoleAnimation;
