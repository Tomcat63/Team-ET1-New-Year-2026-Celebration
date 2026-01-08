import { useState, useEffect } from 'react';

export const usePixelGrid = (text: string) => {
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

    return { grid };
};
