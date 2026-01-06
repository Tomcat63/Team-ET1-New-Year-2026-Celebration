
import React, { useEffect, useState } from 'react';

interface PixelMatrixProps {
  text: string;
  active: boolean;
  isPaused?: boolean;
}

export const PixelMatrix: React.FC<PixelMatrixProps> = ({ text, active, isPaused = false }) => {
  const [grid, setGrid] = useState<boolean[][]>([]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 120;
    const height = 30;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = 'white';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    const imgData = ctx.getImageData(0, 0, width, height).data;
    const newGrid: boolean[][] = [];

    for (let y = 0; y < height; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        row.push(imgData[index + 3] > 128);
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, [text]);

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
                  style={{
                    animationDelay: isPaused ? '0s' : `${(x + y) * 15}ms`,
                    // Keine CSS-Transition hier, damit App.tsx die volle Kontrolle über die Opacity behält
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
