import { useState } from 'react';

export const useAudioInitializer = () => {
    const [isAudioInitialized, setIsAudioInitialized] = useState(false);

    const startShow = async () => {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!(window as any)._fireworkAudioCtx) {
            (window as any)._fireworkAudioCtx = new AudioCtx();
        }
        const ctx = (window as any)._fireworkAudioCtx;

        try {
            if (ctx.state === 'suspended') {
                await ctx.resume();
            }
            setIsAudioInitialized(true);

            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => { });
            }
        } catch (e) {
            console.error("Audio initialization failed", e);
            setIsAudioInitialized(true);
        }
    };

    return { isAudioInitialized, startShow };
};
