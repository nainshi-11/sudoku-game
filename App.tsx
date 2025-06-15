import React, { useState, useEffect, useCallback } from 'react';
import { SudokuGrid } from './components/SudokuGrid';
import { GamePanel } from './components/GamePanel';
import { CongratsModal } from './components/CongratsModal';
import { SudokuGenerator, isValidMove, getHint, isGridComplete } from './utils/sudokuLogic';
import { Cell, GameState } from './types/sudoku';

function App() {
  const sudokuGenerator = new SudokuGenerator();

  const initializeGame = useCallback((): GameState => {
    const { puzzle, solution } = sudokuGenerator.generatePuzzle('medium');
    
    const grid: Cell[][] = puzzle.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        value: cell,
        isGiven: cell !== 0,
        isSelected: false,
        isHighlighted: false,
        isError: false
      }))
    );

    return {
      grid,
      solution,
      mistakes: 0,
      isCompleted: false,
      startTime: Date.now(),
      elapsedTime: 0,
      selectedCell: null
    };
  }, []);

  const [gameState, setGameState] = useState<GameState>(initializeGame);

  // Timer effect
  useEffect(() => {
    if (gameState.isCompleted) return;

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isCompleted, gameState.startTime]);

  const handleCellClick = (row: number, col: number) => {
    if (gameState.grid[row][col].isGiven || gameState.isCompleted) return;

    setGameState(prev => ({
      ...prev,
      selectedCell: { row, col },
      grid: prev.grid.map((gridRow, r) =>
        gridRow.map((cell, c) => ({
          ...cell,
          isSelected: r === row && c === col,
          isHighlighted: r === row || c === col || (
            Math.floor(r / 3) === Math.floor(row / 3) && 
            Math.floor(c / 3) === Math.floor(col / 3)
          )
        }))
      )
    }));
  };

  const handleNumberInput = (num: number) => {
    if (!gameState.selectedCell || gameState.isCompleted) return;

    const { row, col } = gameState.selectedCell;
    if (gameState.grid[row][col].isGiven) return;

    setGameState(prev => {
      const newGrid = [...prev.grid];
      const currentCell = newGrid[row][col];
      
      // Clear error state
      newGrid[row][col] = {
        ...currentCell,
        value: num,
        isError: false
      };

      let newMistakes = prev.mistakes;

      // Check if move is valid and update mistakes
      if (num !== 0) {
        const gridValues = newGrid.map(row => row.map(cell => cell.value));
        if (num !== prev.solution[row][col]) {
          newGrid[row][col].isError = true;
          newMistakes++;
        }
      }

      // Check completion
      const gridValues = newGrid.map(row => row.map(cell => cell.value));
      const isCompleted = isGridComplete(gridValues) && 
        JSON.stringify(gridValues) === JSON.stringify(prev.solution);

      return {
        ...prev,
        grid: newGrid,
        mistakes: newMistakes,
        isCompleted
      };
    });
  };

  const handleHint = () => {
    if (gameState.isCompleted) return;

    const gridValues = gameState.grid.map(row => row.map(cell => cell.value));
    const hint = getHint(gridValues, gameState.solution);
    
    if (hint) {
      setGameState(prev => {
        const newGrid = [...prev.grid];
        newGrid[hint.row][hint.col] = {
          ...newGrid[hint.row][hint.col],
          value: hint.value,
          isError: false
        };

        // Check completion after hint
        const gridValues = newGrid.map(row => row.map(cell => cell.value));
        const isCompleted = isGridComplete(gridValues) && 
          JSON.stringify(gridValues) === JSON.stringify(prev.solution);

        return {
          ...prev,
          grid: newGrid,
          isCompleted,
          selectedCell: { row: hint.row, col: hint.col }
        };
      });
    }
  };

  const handleNewGame = () => {
    setGameState(initializeGame());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Sudoku</h1>
          <p className="text-gray-600">Challenge your mind with this classic puzzle game</p>
        </div>

        {/* Game Layout */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Main Sudoku Grid */}
          <div className="flex-shrink-0">
            <SudokuGrid
              grid={gameState.grid}
              onCellClick={handleCellClick}
              onNumberInput={handleNumberInput}
              selectedCell={gameState.selectedCell}
            />
          </div>

          {/* Game Panel */}
          <div className="flex-shrink-0">
            <GamePanel
              mistakes={gameState.mistakes}
              elapsedTime={gameState.elapsedTime}
              onHint={handleHint}
              onNewGame={handleNewGame}
            />
          </div>
        </div>

        {/* Number Input Panel (Mobile) */}
        <div className="mt-8 lg:hidden">
          <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleNumberInput(0)}
              className="col-span-1 w-12 h-12 bg-red-100 border-2 border-red-300 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Congratulations Modal */}
      <CongratsModal
        isOpen={gameState.isCompleted}
        elapsedTime={gameState.elapsedTime}
        mistakes={gameState.mistakes}
        onNewGame={handleNewGame}
      />
    </div>
  );
}

export default App;