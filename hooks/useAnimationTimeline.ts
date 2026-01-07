import { useState, useEffect, useMemo } from 'react';
import { AnimationPhase } from '../types';

export const TIMELINE = {
    MATRIX_IN: 1200,
    TEAM_STAY: 3000,
    MATRIX_OUT: 1500,
    SLOGAN_START: 800,
    SLOGAN_PEAK: 2500,
    CELEBRATION_START: 5500,
    SPOTLIGHT_START: 15000,
    TOTAL_LOOP: 20000
};

export const useAnimationTimeline = (isPaused: boolean, isAudioInitialized: boolean, timelineSpeed: number, fireworkFrequency: number) => {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (isPaused || !isAudioInitialized) return;
        const interval = setInterval(() => {
            setTimer(t => (t + 50 * timelineSpeed >= TIMELINE.TOTAL_LOOP ? 0 : t + 50 * timelineSpeed));
        }, 50);
        return () => clearInterval(interval);
    }, [isPaused, isAudioInitialized, timelineSpeed]);

    const animation = useMemo(() => {
        let phase = AnimationPhase.TEAM_STILL;
        if (timer >= TIMELINE.SPOTLIGHT_START) phase = AnimationPhase.FINAL_SPOTLIGHT;
        else if (timer >= TIMELINE.CELEBRATION_START) phase = AnimationPhase.CELEBRATION;
        else if (timer >= (TIMELINE.MATRIX_IN + TIMELINE.TEAM_STAY)) phase = AnimationPhase.TRANSITION;

        let matrixOpacity = 0;
        const stayStart = TIMELINE.MATRIX_IN;
        const stayEnd = TIMELINE.MATRIX_IN + TIMELINE.TEAM_STAY;
        const fadeEnd = stayEnd + TIMELINE.MATRIX_OUT;

        if (timer < stayStart) {
            matrixOpacity = timer / stayStart;
        } else if (timer >= stayStart && timer < stayEnd) {
            matrixOpacity = 1;
        } else if (timer >= stayEnd && timer < fadeEnd) {
            matrixOpacity = 1 - (timer - stayEnd) / TIMELINE.MATRIX_OUT;
        }

        let sloganOpacity = 0;
        if (timer >= TIMELINE.SLOGAN_START && timer <= TIMELINE.SLOGAN_PEAK) {
            sloganOpacity = (timer - TIMELINE.SLOGAN_START) / (TIMELINE.SLOGAN_PEAK - TIMELINE.SLOGAN_START);
        } else if (timer > TIMELINE.SLOGAN_PEAK && timer <= stayEnd) {
            sloganOpacity = 1;
        } else if (timer > stayEnd && timer < fadeEnd) {
            sloganOpacity = 1 - (timer - stayEnd) / TIMELINE.MATRIX_OUT;
        }

        let fwIntensity = 0.8;
        if (phase === AnimationPhase.TRANSITION) fwIntensity = 1.8;
        else if (phase === AnimationPhase.CELEBRATION) fwIntensity = 2.8;
        else if (phase === AnimationPhase.FINAL_SPOTLIGHT) fwIntensity = 5.0;

        return { phase, matrixOpacity, sloganOpacity, fwIntensity: fwIntensity * fireworkFrequency };
    }, [timer, fireworkFrequency]);

    return { timer, animation };
};
