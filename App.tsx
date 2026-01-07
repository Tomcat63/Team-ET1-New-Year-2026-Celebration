import React, { useState, useRef } from 'react';
import { FireworkEngine, FireworkEngineHandle } from './components/FireworkEngine';
import { Branding } from './components/Branding';
import { Greeting } from './components/Greeting';
import { Stage } from './components/Stage';
import { SettingsPanel } from './components/SettingsPanel';
import { IntroOverlay } from './components/IntroOverlay';
import { useAnimationTimeline } from './hooks/useAnimationTimeline';
import { useFallingMembers } from './hooks/useFallingMembers';
import { useAudioInitializer } from './hooks/useAudioInitializer';
import appConfig from './config';

const App: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const fireworkRef = useRef<FireworkEngineHandle>(null);

  const [settings, setSettings] = useState({
    timelineSpeed: appConfig.timelineSpeed,
    memberSpeed: appConfig.memberSpeed,
    fireworkFrequency: appConfig.fireworkFrequency,
    fireworkLifetime: appConfig.fireworkLifetime
  });

  const { isAudioInitialized, startShow } = useAudioInitializer();
  const { timer, animation } = useAnimationTimeline(isPaused, isAudioInitialized, settings.timelineSpeed, settings.fireworkFrequency);
  const { fallingMembers } = useFallingMembers(isPaused, isAudioInitialized, timer, animation.phase, settings.memberSpeed);

  const handleInteraction = (e: React.MouseEvent) => {
    if (!isAudioInitialized) return startShow();
    if (!isPaused && fireworkRef.current) {
      fireworkRef.current.launchAt(e.clientX, e.clientY);
    } else {
      setIsPaused(!isPaused);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none" onClick={handleInteraction}>
      <FireworkEngine ref={fireworkRef} intensity={animation.fwIntensity} isPaused={isPaused || !isAudioInitialized} lifetime={settings.fireworkLifetime} />
      <Branding />
      <Greeting />

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {fallingMembers.map(member => (
          <div key={member.id} className="absolute font-mono font-black whitespace-nowrap" style={{ left: `${member.x}%`, top: `${member.y}px`, opacity: member.opacity, fontSize: '2.5rem', color: member.color, textShadow: `0 0 15px ${member.color}80`, transform: 'translateX(-50%)' }}>
            {member.name}
          </div>
        ))}
      </div>

      <Stage matrixOpacity={animation.matrixOpacity} sloganOpacity={animation.sloganOpacity} isPaused={isPaused} />

      {!isAudioInitialized && <IntroOverlay onStart={startShow} />}

      <SettingsPanel settings={settings} setSettings={setSettings} showSettings={showSettings} setShowSettings={setShowSettings} phase={animation.phase} />
    </div>
  );
};

export default App;
