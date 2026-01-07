import React from 'react';
import appConfig from '../config';

export const Greeting: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full z-[100] pt-12 pb-8 pointer-events-none text-center bg-gradient-to-b from-black/60 to-transparent">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_0_40px_rgba(250,204,21,0.8)] mb-2 animate-pulse [animation-duration:4s]">
                {appConfig.year}
            </h1>
            <p className="text-2xl md:text-4xl font-light tracking-[0.8em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] uppercase">
                {appConfig.greeting}
            </p>
        </div>
    );
};
