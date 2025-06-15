export class SudokuGenerator {
  private grid: number[][] = [];

  // Generate a complete valid Sudoku grid
  generateCompleteGrid(): number[][] {
    this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
    this.fillGrid(0, 0);
    return JSON.parse(JSON.stringify(this.grid));
  }

  private fillGrid(row: number, col: number): boolean {
    if (row === 9) return true;
    if (col === 9) return this.fillGrid(row + 1, 0);

    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (const num of numbers) {
      if (isValidMove(this.grid, row, col, num)) {
        this.grid[row][col] = num;
        if (this.fillGrid(row, col + 1)) {
          return true;
        }
        this.grid[row][col] = 0;
      }
    }
    
    return false;
  }

  // Generate puzzle by removing numbers from complete grid
  generatePuzzle(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): { puzzle: number[][], solution: number[][] } {
    const solution = this.generateCompleteGrid();
    const puzzle = JSON.parse(JSON.stringify(solution));
    
    const cellsToRemove = {
      easy: 40,
      medium: 50,
      hard: 60
    }[difficulty];

    const positions = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push([i, j]);
      }
    }

    this.shuffleArray(positions);
    
    for (let i = 0; i < cellsToRemove; i++) {
      const [row, col] = positions[i];
      puzzle[row][col] = 0;
    }

    return { puzzle, solution };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export function isValidMove(grid: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let j = 0; j < 9; j++) {
    if (grid[row][j] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (grid[i][j] === num) return false;
    }
  }

  return true;
}

export function getHint(grid: number[][], solution: number[][]): { row: number; col: number; value: number } | null {
  const emptyCells = [];
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ row: i, col: j, value: solution[i][j] });
      }
    }
  }

  if (emptyCells.length === 0) return null;
  
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

export function isGridComplete(grid: number[][]): boolean {
  return grid.every(row => row.every(cell => cell !== 0));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}