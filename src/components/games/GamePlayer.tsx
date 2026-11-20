'use client';
import dynamic from 'next/dynamic';
import type { GameKey } from '@/lib/games';

const MAP: Record<GameKey, ReturnType<typeof dynamic>> = {
  star_race: dynamic(() => import('./StarRace')), space_numbers: dynamic(() => import('./Space')), treasure: dynamic(() => import('./Treasure')),
  maze: dynamic(() => import('./Maze')), wheel: dynamic(() => import('./Wheel')), tower: dynamic(() => import('./Tower')),
  patterns: dynamic(() => import('./Patterns')), timed: dynamic(() => import('./Timed')),
};
export function GamePlayer({ k }: { k: GameKey }) { const G = MAP[k]; return <G />; }
