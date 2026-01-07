import React from 'react';
import { Trophy } from 'lucide-react';
import { PixelMatrix } from './PixelMatrix';
import appConfig from '../config';

interface StageProps {
    matrixOpacity: number;
    sloganOpacity: number;
    isPaused: boolean;
}

export const Stage: React.FC<StageProps> = ({ matrixOpacity, sloganOpacity, isPaused }) => {
    return (
        <main className="relative z-10 w-full max-w-4xl px-4 text-center pointer-events-none flex flex-col items-center gap-12">
            <div style={{ opacity: matrixOpacity, transform: `scale(${0.9 + matrixOpacity * 0.1})` }} className="transition-transform duration-500 ease-out">
                <PixelMatrix text={appConfig.teamName} active={matrixOpacity > 0} isPaused={isPaused} />
            </div>

            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center transition-none" style={{ opacity: sloganOpacity, transform: `translateY(${(1 - sloganOpacity) * 20}px) scale(${0.8 + sloganOpacity * 0.2})` }}>
                    <div className="relative mb-6">
                        <div className="absolute -inset-12 bg-blue-600 rounded-full blur-[50px] opacity-20 animate-pulse"></div>
                        <Trophy className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,1)]" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold tracking-[0.8em] text-blue-300 uppercase drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]">
                        {appConfig.slogan}
                    </div>
                </div>
            </div>
        </main>
    );
};
