import { useRef, useCallback } from 'react';
import { Particle, Firework } from '../types';
import { soundEngine } from '../services/SoundEngine';

export const useFireworkEngine = (lifetime: number) => {
    const fireworksRef = useRef<Firework[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const colors = ['#60a5fa', '#f472b6', '#fbbf24', '#34d399', '#22d3ee', '#a78bfa', '#f87171', '#ffffff'];

    const explode = useCallback((x: number, y: number, color: string) => {
        soundEngine.playExplosion();
        const count = 80 + Math.random() * 60;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1.2;
            particlesRef.current.push({
                x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                color, alpha: 1, size: Math.random() * 2 + 0.5,
                decay: (Math.random() * 0.015 + 0.005) * (1 / lifetime)
            });
        }
    }, [lifetime]);

    const createFirework = useCallback((canvas: HTMLCanvasElement | null, x?: number, targetY?: number, instant = false) => {
        if (!canvas) return;
        const spawnX = x ?? Math.random() * canvas.width;
        const tY = targetY ?? (100 + Math.random() * (canvas.height * 0.5));
        const color = colors[Math.floor(Math.random() * colors.length)];

        if (instant) {
            explode(spawnX, tY, color);
        } else {
            fireworksRef.current.push({ x: spawnX, y: canvas.height, targetY: tY, color, particles: [], exploded: false });
            soundEngine.playLaunch();
        }
    }, [explode]);

    return { fireworksRef, particlesRef, explode, createFirework };
};
