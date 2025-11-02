
export type ShapeType = 'circle' | 'triangle' | 'square';
export type ColorType = 'red' | 'green' | 'purple';
export type ShadingType = 'empty' | 'striped' | 'filled';
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
