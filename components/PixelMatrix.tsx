import React from 'react';
import { usePixelGrid } from '../hooks/usePixelGrid';

interface PixelMatrixProps {
  text: string;
  active: boolean;
  isPaused?: boolean;
}

export const PixelMatrix: React.FC<PixelMatrixProps> = ({ text, isPaused = false }) => {
  const { grid } = usePixelGrid(text);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="inline-grid gap-[3px] p-8 bg-black/40 rounded-xl backdrop-blur-sm border border-blue-500/10 matrix-flicker relative overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
        {grid.map((row, y) => (
          <div key={y} className="flex gap-[3px]">
            {row.map((activePixel, x) => {
              if (!activePixel) return <div key={`${x}-${y}`} className="w-[4px] h-[4px] md:w-[6px] md:h-[6px]" />;
              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-[4px] h-[4px] md:w-[6px] md:h-[6px] rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] ${isPaused ? '' : 'animate-pulse'}`}
                  style={{ animationDelay: isPaused ? '0s' : `${(x + y) * 15}ms` }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
