import { useState, useEffect, useRef } from 'react';
import { FallingMember, AnimationPhase, COLORS } from '../types';
import appConfig from '../config';
import { TIMELINE } from './useAnimationTimeline';

export const useFallingMembers = (isPaused: boolean, isAudioInitialized: boolean, timer: number, phase: AnimationPhase, memberSpeed: number) => {
    const [fallingMembers, setFallingMembers] = useState<FallingMember[]>([]);
    const memberQueueRef = useRef<string[]>([]);

    useEffect(() => {
        const stayEnd = TIMELINE.MATRIX_IN + TIMELINE.TEAM_STAY;
        if (isPaused || !isAudioInitialized || timer < stayEnd) {
            if (timer < stayEnd) setFallingMembers([]);
            return;
        }

        let animId: number;
        const animate = () => {
            setFallingMembers(prev => {
                const windowH = window.innerHeight;
                const updated = prev.map(m => ({
                    ...m,
                    y: m.y + m.speed,
                    x: m.startX + Math.sin((m.y + m.speed) / 80 + m.phase) * 4,
                    opacity: 1
                })).filter(m => m.y < windowH + 100);

                if (memberQueueRef.current.length === 0 && updated.length === 0) {
                    memberQueueRef.current = [...appConfig.teamMembers].sort(() => Math.random() - 0.5);
                }

                const spawnChance = phase === AnimationPhase.CELEBRATION ? 0.05 : 0.01;
                if (memberQueueRef.current.length > 0 && updated.length < 5 && Math.random() < spawnChance) {
                    const name = memberQueueRef.current.shift()!;
                    const startX = 15 + Math.random() * 70;
                    updated.push({
                        id: Date.now() + Math.random(),
                        name, startX, x: startX, y: -100,
                        speed: (1.5 + Math.random() * 2) * memberSpeed,
                        opacity: 0, phase: Math.random() * Math.PI * 2,
                        color: COLORS[Math.floor(Math.random() * COLORS.length)]
                    });
                }
                return updated;
            });
            animId = requestAnimationFrame(animate);
        };
        animId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animId);
    }, [isPaused, isAudioInitialized, timer, phase, memberSpeed]);

    return { fallingMembers };
};
