import React from 'react';
import { Trophy, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { formatTime } from '../utils/sudokuLogic';

interface CongratsModalProps {
  isOpen: boolean;
  elapsedTime: number;
  mistakes: number;
  onNewGame: () => void;
}

export const CongratsModal: React.FC<CongratsModalProps> = ({
  isOpen,
  elapsedTime,
  mistakes,
  onNewGame
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center transform animate-pulse">
        <div className="mb-6">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-2">
            Congratulations!
          </h1>
          <p className="text-gray-600">
            You've successfully completed the Sudoku puzzle!
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Time</span>
            </div>
            <span className="font-bold text-black">{formatTime(elapsedTime)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-gray-700">Mistakes</span>
            </div>
            <span className="font-bold text-red-600">{mistakes}</span>
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Play Again</span>
        </button>
      </div>
    </div>
  );
};