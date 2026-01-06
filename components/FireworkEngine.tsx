
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Particle, Firework } from '../types';
import { soundEngine } from '../services/SoundEngine';

interface FireworkEngineProps {
  intensity?: number;
  isPaused?: boolean;
  lifetime?: number;
}

export interface FireworkEngineHandle {
  launchAt: (x: number, y: number) => void;
}

export const FireworkEngine = forwardRef<FireworkEngineHandle, FireworkEngineProps>(({ intensity = 1, isPaused = false, lifetime = 1 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const colors = ['#60a5fa', '#f472b6', '#fbbf24', '#34d399', '#22d3ee', '#a78bfa', '#f87171', '#ffffff'];

  const explode = (x: number, y: number, color: string) => {
    soundEngine.playExplosion();
    const count = 80 + Math.random() * 60;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.2;
      particlesRef.current.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        alpha: 1,
        size: Math.random() * 2 + 0.5,
        decay: (Math.random() * 0.015 + 0.005) * (1 / lifetime)
      });
    }
  };

  const createFirework = (x?: number, targetY?: number, instant = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const spawnX = x ?? Math.random() * canvas.width;
    const tY = targetY ?? (100 + Math.random() * (canvas.height * 0.5));
    const color = colors[Math.floor(Math.random() * colors.length)];

    if (instant) {
      explode(spawnX, tY, color);
    } else {
      const spawnY = canvas.height;
      fireworksRef.current.push({ x: spawnX, y: spawnY, targetY: tY, color, particles: [], exploded: false });
      soundEngine.playLaunch();
    }
  };

  useImperativeHandle(ref, () => ({
    launchAt: (x: number, y: number) => {
      createFirework(x, y, true);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    if (isPaused) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.03 * intensity) {
        createFirework();
      }

      fireworksRef.current = fireworksRef.current.filter(fw => {
        if (!fw.exploded) {
          fw.y -= 10;
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.fill();

          if (fw.y <= fw.targetY) {
            fw.exploded = true;
            explode(fw.x, fw.targetY, fw.color);
            return false;
          }
          return true;
        }
        return false;
      });

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, isPaused]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 bg-black"
    />
  );
});
