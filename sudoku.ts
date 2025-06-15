export interface Cell {
  value: number;
  isGiven: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isError: boolean;
}

export interface GameState {
  grid: Cell[][];
  solution: number[][];
  mistakes: number;
  isCompleted: boolean;
  startTime: number;
  elapsedTime: number;
  selectedCell: { row: number; col: number } | null;
}

export type Difficulty = 'easy' | 'medium' | 'hard';