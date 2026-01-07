import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useFireworkEngine } from '../hooks/useFireworkEngine';

export interface FireworkEngineHandle { launchAt: (x: number, y: number) => void; }

export const FireworkEngine = forwardRef<FireworkEngineHandle, { intensity?: number; isPaused?: boolean; lifetime?: number }>(({ intensity = 1, isPaused = false, lifetime = 1 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { fireworksRef, particlesRef, explode, createFirework } = useFireworkEngine(lifetime);

  useImperativeHandle(ref, () => ({ launchAt: (x, y) => createFirework(canvasRef.current, x, y, true) }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused) return;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    let animationFrameId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.03 * intensity) createFirework(canvas);

      fireworksRef.current = fireworksRef.current.filter(fw => {
        if (fw.exploded) return false;
        fw.y -= 10;
        ctx.beginPath(); ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = fw.color; ctx.fill();
        if (fw.y <= fw.targetY) { fw.exploded = true; explode(fw.x, fw.targetY, fw.color); return false; }
        return true;
      });

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.vx *= 0.985; p.vy *= 0.985; p.alpha -= p.decay;
        if (p.alpha <= 0) return false;
        ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, [intensity, isPaused, createFirework, explode, fireworksRef, particlesRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-black" />;
});
