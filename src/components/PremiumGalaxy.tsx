import React, { useEffect, useRef } from "react";

export default function PremiumGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Handle crisp resolution on Retina Displays (Macs/iPhones)
    const dpr = window.devicePixelRatio || 1;

    class Star {
      x: number;
      y: number;
      baseSize: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      vx: number;
      vy: number;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Mostly tiny stars, rarely larger ones
        this.baseSize = Math.random() < 0.8 ? Math.random() * 0.8 + 0.2 : Math.random() * 1.5 + 1;
        this.baseAlpha = Math.random() * 0.4 + 0.1;
        this.twinkleSpeed = Math.random() * 0.002 + 0.0005;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        
        // Depth-based movement (larger = closer = moves slightly faster)
        const speedMultiplier = this.baseSize * 0.05; 
        this.vx = (Math.random() - 0.5) * speedMultiplier;
        this.vy = (Math.random() - 0.5) * speedMultiplier;
      }

      update(width: number, height: number, mx: number, my: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Subtle Parallax with Mouse
        const parallaxFactor = this.baseSize * 0.002;
        this.x += mx * parallaxFactor;
        this.y += my * parallaxFactor;

        // Screen Wrap
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw(ctx: CanvasRenderingContextState, time: number) {
        // Sine wave for buttery smooth twinkling
        const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset);
        
        let currentAlpha = this.baseAlpha + (twinkle * 0.3);
        currentAlpha = Math.max(0.05, Math.min(0.8, currentAlpha));

        const currentSize = this.baseSize + (twinkle * 0.2);

        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.1, currentSize), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${currentAlpha})`;
        ctx.fill();
      }
    }

    const init = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Premium Sparse Density (Less cluttered!)
      const area = width * height;
      const starCount = Math.floor(area / 15000); 
      
      stars = Array.from({ length: starCount }, () => new Star(width, height));
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const width = parseFloat(canvas.style.width);
      const height = parseFloat(canvas.style.height);

      stars.forEach((star) => {
        star.update(width, height, mouseX, mouseY);
        star.draw(ctx, time);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * -0.1;
      targetMouseY = (e.clientY - window.innerHeight / 2) * -0.1;
    };

    init();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", init);
    
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-50] pointer-events-none overflow-hidden bg-[#03000A]">
      
      {/* Background Deep Space Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)] blur-3xl mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.08)_0%,transparent_70%)] blur-3xl mix-blend-screen" />
      
      {/* The HTML5 Canvas for Stars */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />

      {/* Cinematic SVG Noise Texture to prevent color banding */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
}
