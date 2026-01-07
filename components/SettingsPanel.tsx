import React from 'react';
import { Settings, X } from 'lucide-react';
import appConfig from '../config';

interface SettingsPanelProps {
    settings: any;
    setSettings: (settings: any) => void;
    showSettings: boolean;
    setShowSettings: (show: boolean) => void;
    phase: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, showSettings, setShowSettings, phase }) => {
    const settingItems = [
        { label: 'Timeline', key: 'timelineSpeed', min: 0.1, max: 5.0, step: 0.1, tooltip: 'Geschwindigkeit des gesamten Show-Ablaufs.' },
        { label: 'Member Fall', key: 'memberSpeed', min: 0.1, max: 5.0, step: 0.1, tooltip: 'Fallgeschwindigkeit der Teamnamen.' },
        { label: 'Frequency', key: 'fireworkFrequency', min: 0.1, max: 10.0, step: 0.1, tooltip: 'Anzahl der automatischen Hintergrund-Feuerwerke.' },
        { label: 'Lifetime', key: 'fireworkLifetime', min: 0.1, max: 5.0, step: 0.05, tooltip: 'Dauer, wie lange die Feuerwerks-Partikel glühen.' },
    ];

    return (
        <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-[120]">
            {showSettings && (
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-72 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-5">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs opacity-60">System Engine</h3>
                        <button onClick={(e) => { e.stopPropagation(); setShowSettings(false); }} className="text-white/40 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {settingItems.map(item => (
                            <div key={item.key} className="space-y-1 group relative">
                                <div className="absolute bottom-full left-0 mb-3 w-max max-w-[200px] pointer-events-none opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-[130]">
                                    <div className="bg-blue-600/90 backdrop-blur-md border border-white/20 p-2 px-3 rounded-xl shadow-2xl">
                                        <p className="text-white text-[10px] leading-tight font-medium">{item.tooltip}</p>
                                    </div>
                                    <div className="w-2 h-2 bg-blue-600/90 rotate-45 -mt-1 ml-4 border-r border-b border-white/20"></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-white/40 uppercase font-mono group-hover:text-white/80 transition-colors">
                                    <span>{item.label}</span>
                                    <span>{settings[item.key].toFixed(2)}x</span>
                                </div>
                                <input type="range" min={item.min} max={item.max} step={item.step} value={settings[item.key]}
                                    onChange={(e) => setSettings({ ...settings, [item.key]: parseFloat(e.target.value) })}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                            </div>
                        ))}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setSettings({ timelineSpeed: appConfig.timelineSpeed, memberSpeed: appConfig.memberSpeed, fireworkFrequency: appConfig.fireworkFrequency, fireworkLifetime: appConfig.fireworkLifetime }); }}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-all mt-2">
                        Reset to Default
                    </button>
                </div>
            )}
            <div className="flex flex-col items-end gap-1 opacity-20 font-mono text-[10px] text-white uppercase tracking-[0.5em]">
                <div>DESIGNER: HDA/AI</div>
                <div>TESTER: ANTONI</div>
                <div>STATE: {phase}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                className={`p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all ${showSettings ? 'rotate-90 text-orange-500' : ''}`}>
                <Settings size={20} />
            </button>
        </div>
    );
};
