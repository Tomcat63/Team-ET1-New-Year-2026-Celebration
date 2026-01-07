import React from 'react';
import appConfig from '../config';

export const Branding: React.FC = () => {
    return (
        <div className="fixed top-4 left-4 md:top-8 md:left-8 flex items-center gap-5 z-[110] pointer-events-none scale-75 md:scale-100 origin-top-left">
            <div className="flex flex-col font-sans">
                <div className="flex items-center leading-none">
                    <span className="text-orange-500 font-black text-2xl md:text-3xl tracking-tight uppercase">THE</span>
                    <span className="text-orange-500 font-black text-2xl md:text-3xl tracking-tight uppercase ml-2 flex items-center">
                        <div className="relative flex flex-col items-center mr-0.5 -mb-1">
                            <div className="flex gap-0.5 mb-1 opacity-50 scale-75">
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-duration:1s]"></div>
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.3s]"></div>
                            </div>
                            <div className="w-2.5 h-6 bg-orange-500 rounded-t-sm shadow-inner"></div>
                        </div>
                        DEA
                    </span>
                </div>
                <span className="text-white font-medium text-3xl md:text-4xl tracking-tight -mt-1 ml-0.5">Factory</span>
                <div className="h-[2px] w-full bg-gradient-to-r from-orange-500 via-orange-500 to-transparent mt-1"></div>
                <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1 ml-0.5 opacity-80">
                    {appConfig.branding.subtitle}
                </span>
            </div>
        </div>
    );
};
