import React from 'react';
import { Cell } from '../types/sudoku';

interface SudokuGridProps {
  grid: Cell[][];
  onCellClick: (row: number, col: number) => void;
  onNumberInput: (num: number) => void;
  selectedCell: { row: number; col: number } | null;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  grid,
  onCellClick,
  onNumberInput,
  selectedCell
}) => {
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedCell) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9) {
          onNumberInput(num);
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
          onNumberInput(0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, onNumberInput]);

  const getCellClasses = (cell: Cell, row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isHighlighted = selectedCell && (
      selectedCell.row === row || 
      selectedCell.col === col ||
      (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && 
       Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
    );

    let classes = `
      w-12 h-12 border border-gray-300 flex items-center justify-center text-lg font-medium
      cursor-pointer transition-all duration-200 relative
    `;

    // Border styling for 3x3 boxes
    if (row % 3 === 0) classes += ' border-t-2 border-t-black';
    if (col % 3 === 0) classes += ' border-l-2 border-l-black';
    if (row === 8) classes += ' border-b-2 border-b-black';
    if (col === 8) classes += ' border-r-2 border-r-black';

    // Cell states
    if (isSelected) {
      classes += ' bg-blue-200 border-blue-400';
    } else if (isHighlighted && !cell.isGiven) {
      classes += ' bg-blue-50';
    } else if (cell.isGiven) {
      classes += ' bg-gray-100 text-black font-bold';
    } else {
      classes += ' bg-white hover:bg-gray-50';
    }

    if (cell.isError) {
      classes += ' bg-red-100 text-red-600';
    }

    return classes;
  };

  return (
    <div className="inline-block p-4 bg-white rounded-lg shadow-lg border-2 border-black">
      <div className="grid grid-cols-9 gap-0 border-2 border-black">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClasses(cell, rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell.value !== 0 && (
                <span className={cell.isGiven ? 'text-black' : 'text-blue-600'}>
                  {cell.value}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};