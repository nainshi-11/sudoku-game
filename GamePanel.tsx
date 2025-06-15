import React from 'react';
import { Clock, AlertCircle, HelpCircle, RotateCcw } from 'lucide-react';
import { formatTime } from '../utils/sudokuLogic';

interface GamePanelProps {
  mistakes: number;
  elapsedTime: number;
  onHint: () => void;
  onNewGame: () => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({
  mistakes,
  elapsedTime,
  onHint,
  onNewGame
}) => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Timer */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Time</span>
        </div>
        <div className="text-2xl font-bold text-black">
          {formatTime(elapsedTime)}
        </div>
      </div>

      {/* Mistakes */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-gray-700">Mistakes</span>
        </div>
        <div className="text-2xl font-bold text-red-600">
          {mistakes}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <button
          onClick={onHint}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Get Hint</span>
        </button>

        <button
          onClick={onNewGame}
          className="w-full flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
};