
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Trophy, Volume2, Pause } from 'lucide-react';
import { FireworkEngine, FireworkEngineHandle } from './components/FireworkEngine';
import { PixelMatrix } from './components/PixelMatrix';
import { AnimationPhase, FallingMember, COLORS } from './types';
import appConfig from './config';

// Zentrale Konfiguration der Zeitachse (in ms)
const TIMELINE = {
  MATRIX_IN: 1200,          // Sanfterer Start: Einblenden der Matrix
  TEAM_STAY: 3000,          // Dauer, die das Team voll sichtbar bleibt (nach Fade-In)
  MATRIX_OUT: 1500,         // Schnellerer, knackigerer Ausblend-Vorgang
  SLOGAN_START: 800,        // Slogan erscheint kurz nach Matrix-Start
  SLOGAN_PEAK: 2500,        // Peak-Sichtbarkeit Slogan
  CELEBRATION_START: 5500,  // Hauptfeuerwerk startet etwas früher
  SPOTLIGHT_START: 15000,   
  TOTAL_LOOP: 20000         
};

const App: React.FC = () => {
  const [fallingMembers, setFallingMembers] = useState<FallingMember[]>([]);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const fireworkRef = useRef<FireworkEngineHandle>(null);
  const memberQueueRef = useRef<string[]>([]);

  // Ticker
  useEffect(() => {
    if (isPaused || !isAudioInitialized) return;
    const interval = setInterval(() => {
      setTimer(t => (t + 50 >= TIMELINE.TOTAL_LOOP ? 0 : t + 50));
    }, 50);
    return () => clearInterval(interval);
  }, [isPaused, isAudioInitialized]);

  // --- ZENTRALE STATE MACHINE BERECHNUNGEN ---
  const animation = useMemo(() => {
    // 1. Phasen-Bestimmung
    let phase = AnimationPhase.TEAM_STILL;
    if (timer >= TIMELINE.SPOTLIGHT_START) phase = AnimationPhase.FINAL_SPOTLIGHT;
    else if (timer >= TIMELINE.CELEBRATION_START) phase = AnimationPhase.CELEBRATION;
    else if (timer >= (TIMELINE.MATRIX_IN + TIMELINE.TEAM_STAY)) phase = AnimationPhase.TRANSITION;

    // 2. Matrix Opacity Logic (Sanft rein, Stillstand, Knackig raus)
    let matrixOpacity = 0;
    const stayStart = TIMELINE.MATRIX_IN;
    const stayEnd = TIMELINE.MATRIX_IN + TIMELINE.TEAM_STAY;
    const fadeEnd = stayEnd + TIMELINE.MATRIX_OUT;

    if (timer < stayStart) {
      matrixOpacity = timer / stayStart; // Fade In
    } else if (timer >= stayStart && timer < stayEnd) {
      matrixOpacity = 1; // Stay Still
    } else if (timer >= stayEnd && timer < fadeEnd) {
      matrixOpacity = 1 - (timer - stayEnd) / TIMELINE.MATRIX_OUT; // Snappier Fade Out
    }

    // 3. Slogan & Cup Opacity
    let sloganOpacity = 0;
    if (timer >= TIMELINE.SLOGAN_START && timer <= TIMELINE.SLOGAN_PEAK) {
      sloganOpacity = (timer - TIMELINE.SLOGAN_START) / (TIMELINE.SLOGAN_PEAK - TIMELINE.SLOGAN_START);
    } else if (timer > TIMELINE.SLOGAN_PEAK && timer <= stayEnd) {
      sloganOpacity = 1;
    } else if (timer > stayEnd && timer < fadeEnd) {
      sloganOpacity = 1 - (timer - stayEnd) / TIMELINE.MATRIX_OUT;
    }

    // 4. Feuerwerk Intensität (Baseline 0.8 für sofortigen Start)
    let fwIntensity = 0.8; 
    if (phase === AnimationPhase.TRANSITION) fwIntensity = 1.8;
    else if (phase === AnimationPhase.CELEBRATION) fwIntensity = 2.8;
    else if (phase === AnimationPhase.FINAL_SPOTLIGHT) fwIntensity = 5.0;

    return { phase, matrixOpacity, sloganOpacity, fwIntensity };
  }, [timer]);

  // Fallende Namen Logic
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
        const updated = prev.map(m => {
          const newY = m.y + m.speed;
          return { ...m, y: newY, x: m.startX + Math.sin(newY / 80 + m.phase) * 4, opacity: 1 };
        }).filter(m => m.y < windowH + 200);

        if (memberQueueRef.current.length === 0 && updated.length === 0) {
          memberQueueRef.current = [...appConfig.teamMembers].sort(() => Math.random() - 0.5);
        }

        const spawnChance = animation.phase === AnimationPhase.CELEBRATION ? 0.04 : 0.01;
        if (memberQueueRef.current.length > 0 && updated.length < 5 && Math.random() < spawnChance) {
          const name = memberQueueRef.current.shift()!;
          const startX = 15 + Math.random() * 70;
          updated.push({
            id: Date.now() + Math.random(),
            name, startX, x: startX, y: -100,
            speed: 1.2 + Math.random() * 2,
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
  }, [isPaused, isAudioInitialized, timer, animation.phase]);

  const handleInteraction = (e: React.MouseEvent) => {
    if (!isAudioInitialized) {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!(window as any)._fireworkAudioCtx) (window as any)._fireworkAudioCtx = new AudioCtx();
      const ctx = (window as any)._fireworkAudioCtx;
      if (ctx.state === 'suspended') ctx.resume().then(() => setIsAudioInitialized(true));
      else setIsAudioInitialized(true);
      
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (!isPaused && fireworkRef.current) {
        fireworkRef.current.launchAt(e.clientX, e.clientY);
      } else {
        setIsPaused(!isPaused);
      }
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={handleInteraction}
    >
      <FireworkEngine 
        ref={fireworkRef}
        intensity={animation.fwIntensity} 
        isPaused={isPaused || !isAudioInitialized}
      />

      {/* BRANDING TOP LEFT */}
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

      {/* FIXED GREETING */}
      <div className="fixed top-0 left-0 w-full z-[100] pt-12 pb-8 pointer-events-none text-center bg-gradient-to-b from-black/60 to-transparent">
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_0_40px_rgba(250,204,21,0.8)] mb-2 animate-pulse [animation-duration:4s]">
          {appConfig.year}
        </h1>
        <p className="text-2xl md:text-4xl font-light tracking-[0.8em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] uppercase">
          {appConfig.greeting}
        </p>
      </div>

      {/* FALLING NAMES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {fallingMembers.map(member => (
          <div key={member.id} className="absolute font-mono font-black whitespace-nowrap"
            style={{ left: `${member.x}%`, top: `${member.y}px`, opacity: member.opacity, fontSize: '2rem', color: member.color, textShadow: `0 0 15px ${member.color}80`, transform: 'translateX(-50%)' }}>
            {member.name}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT LAYER */}
      <main className="relative z-10 w-full max-w-4xl px-4 text-center pointer-events-none flex flex-col items-center gap-12">
        
        {/* MATRIX CONTAINER */}
        <div style={{ opacity: animation.matrixOpacity, transform: `scale(${0.85 + animation.matrixOpacity * 0.15})` }} className="transition-transform duration-500 ease-out">
           <PixelMatrix 
             text={appConfig.teamName} 
             active={animation.matrixOpacity > 0}
             isPaused={isPaused}
           />
        </div>

        {/* INTEGRATED SLOGAN & CUP BLOCK */}
        <div className="flex flex-col items-center">
          <div 
            className="flex flex-col items-center transition-none"
            style={{ 
              opacity: animation.sloganOpacity, 
              transform: `translateY(${(1 - animation.sloganOpacity) * 20}px) scale(${0.8 + animation.sloganOpacity * 0.2})` 
            }}
          >
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

      {/* START OVERLAY */}
      {!isAudioInitialized && (
        <div className="fixed inset-0 z-[200] bg-black/98 flex flex-col items-center justify-center backdrop-blur-2xl">
          <div className="p-16 rounded-[4rem] bg-white/5 border border-white/10 flex flex-col items-center gap-12 text-center shadow-2xl">
            <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(37,99,235,0.5)]">
              <Volume2 className="text-white w-16 h-16" />
            </div>
            <div className="space-y-4">
              <h2 className="text-white text-4xl font-black tracking-tighter">START TEAM SHOW</h2>
              <p className="text-white/60 text-xl font-light leading-relaxed">Full Experience & Sound mit ET1 System state engine</p>
              <p className="text-white/60 text-xl font-light leading-relaxed">Klicken auf Bildschirm für mehr Feuerwerke</p>
            </div>
            <button className="px-16 py-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full text-black font-black text-xl uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-xl shadow-yellow-500/20"
              onClick={(e) => { e.stopPropagation(); handleInteraction(e as any); }}>
              Beginnen
            </button>
          </div>
        </div>
      )}

      {/* UI DECORATION */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-1 z-30 pointer-events-none opacity-20 font-mono text-[10px] text-white uppercase tracking-[0.5em]">
        <div>TRANSITION ENGINE ET1.v1.03</div>
        <div>System State: {animation.phase}</div>
      </div>
    </div>
  );
};

export default App;
