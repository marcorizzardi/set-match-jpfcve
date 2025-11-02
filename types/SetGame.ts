
export type ShapeType = 'diamond' | 'oval' | 'squiggle';
export type ColorType = 'red' | 'green' | 'purple';
export type ShadingType = 'solid' | 'striped' | 'open';
export type NumberType = 1 | 2 | 3;

export interface Card {
  id: string;
  shape: ShapeType;
  color: ColorType;
  shading: ShadingType;
  number: NumberType;
}

export interface GameState {
  deck: Card[];
  board: Card[];
  selectedCards: Card[];
  foundSets: Card[][];
  score: number;
  startTime: number;
  elapsedTime: number;
  hintsUsed: number;
}
