
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

export interface Firework {
  x: number;
  y: number;
  targetY: number;
  color: string;
  particles: Particle[];
  exploded: boolean;
}

export enum AnimationPhase {
  TEAM_STILL = 'TEAM_STILL',         // 0-3s: Team Matrix statisch
  TRANSITION = 'TRANSITION',         // 3-6s: Matrix fade out, Slogan fade in
  CELEBRATION = 'CELEBRATION',       // 6-15s: Feuerwerk & Namen
  FINAL_SPOTLIGHT = 'FINAL_SPOTLIGHT'// 15-20s: Logo Fokus
}

export interface FallingMember {
  id: number;
  name: string;
  x: number;
  startX: number;
  y: number;
  speed: number;
  opacity: number;
  phase: number;
  color: string;
}

export const COLORS = [
  '#60a5fa', // Blue
  '#f472b6', // Pink
  '#fbbf24', // Amber
  '#34d399', // Emerald
  '#22d3ee', // Cyan
  '#a78bfa', // Violet
  '#f87171'  // Red
];
