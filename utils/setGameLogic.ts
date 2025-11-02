
import { Card, ShapeType, ColorType, ShadingType, NumberType } from '@/types/SetGame';

export function generateDeck(): Card[] {
  const shapes: ShapeType[] = ['circle', 'triangle', 'square'];
  const colors: ColorType[] = ['red', 'green', 'purple'];
  const shadings: ShadingType[] = ['empty', 'striped', 'filled'];
  const numbers: NumberType[] = [1, 2, 3];

  const deck: Card[] = [];
  let id = 0;

  for (const shape of shapes) {
    for (const color of colors) {
      for (const shading of shadings) {
        for (const number of numbers) {
          deck.push({
            id: `card-${id++}`,
            shape,
            color,
            shading,
            number,
          });
        }
      }
    }
  }

  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function isValidSet(cards: Card[]): boolean {
  if (cards.length !== 3) return false;

  const [card1, card2, card3] = cards;

  const shapeValid =
    (card1.shape === card2.shape && card2.shape === card3.shape) ||
    (card1.shape !== card2.shape && card2.shape !== card3.shape && card1.shape !== card3.shape);

  const colorValid =
    (card1.color === card2.color && card2.color === card3.color) ||
    (card1.color !== card2.color && card2.color !== card3.color && card1.color !== card3.color);

  const shadingValid =
    (card1.shading === card2.shading && card2.shading === card3.shading) ||
    (card1.shading !== card2.shading && card2.shading !== card3.shading && card1.shading !== card3.shading);

  const numberValid =
    (card1.number === card2.number && card2.number === card3.number) ||
    (card1.number !== card2.number && card2.number !== card3.number && card1.number !== card3.number);

  return shapeValid && colorValid && shadingValid && numberValid;
}

export function findAllSets(board: Card[]): Card[][] {
  const sets: Card[][] = [];

  for (let i = 0; i < board.length - 2; i++) {
    for (let j = i + 1; j < board.length - 1; j++) {
      for (let k = j + 1; k < board.length; k++) {
        const potentialSet = [board[i], board[j], board[k]];
        if (isValidSet(potentialSet)) {
          sets.push(potentialSet);
        }
      }
    }
  }

  return sets;
}

export function getHint(board: Card[]): Card[] | null {
  const sets = findAllSets(board);
  return sets.length > 0 ? sets[0] : null;
}
