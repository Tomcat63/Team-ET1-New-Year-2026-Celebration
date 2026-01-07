import React from 'react';
import { Volume2 } from 'lucide-react';

interface IntroOverlayProps {
    onStart: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onStart }) => {
    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <div className="p-12 rounded-[3rem] bg-white/5 border border-white/10 flex flex-col items-center gap-10 text-center">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center animate-bounce">
                    <Volume2 className="text-white w-12 h-12" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-white text-3xl font-black tracking-tighter uppercase">Team ET1 Show 2026</h2>
                    <p className="text-white/60 text-xl font-light leading-relaxed">Full Experience & Sound mit ET1 System state engine</p>
                    <p className="text-white/60 text-xl font-light leading-relaxed">Klicken auf Bildschirm für mehr Feuerwerke</p>
                    <p className="text-white/60 text-xl font-light leading-relaxed">Settings mit Klick auf Zahnrad</p>
                </div>
                <button
                    className="px-12 py-6 bg-yellow-500 rounded-full text-black font-black text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
                    onClick={(e) => { e.stopPropagation(); onStart(); }}
                >
                    Show starten
                </button>
            </div>
        </div>
    );
};
