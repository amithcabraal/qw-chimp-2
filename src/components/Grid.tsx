import React from 'react';
import { motion } from 'framer-motion';

interface GridProps {
  numbers: { value: number; position: number }[];
  showNumbers: boolean;
  onCellClick: (position: number) => void;
  disabled: boolean;
  clickedNumbers: number[];
  showSolution?: boolean;
  incorrectClicks?: number[];
}

export default function Grid({ 
  numbers, 
  showNumbers, 
  onCellClick, 
  disabled, 
  clickedNumbers,
  showSolution,
  incorrectClicks = []
}: GridProps) {
  const columns = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const rows = ['1', '2', '3', '4', '5', '6', '7'];

  const getClickOrder = (position: number) => {
    const index = clickedNumbers.indexOf(position);
    return index !== -1 ? index + 1 : null;
  };

  const getCellContent = (rowIndex: number, colIndex: number) => {
    if (rowIndex === -1) return columns[colIndex];
    if (colIndex === 0) return rows[rowIndex];
    
    const position = (rowIndex * 7) + (colIndex - 1);
    const number = numbers.find((n) => n.position === position);
    const isClicked = clickedNumbers.includes(position);
    const isIncorrect = incorrectClicks?.includes(position);
    const clickOrder = getClickOrder(position);

    if (showNumbers && number) return number.value;
    if (!showNumbers && clickOrder) return clickOrder;
    if (showSolution && number && !isClicked) return number.value;
    return null;
  };

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    if (rowIndex === -1 || colIndex === 0) {
      return 'bg-gray-100 text-gray-600 font-semibold cursor-default select-none';
    }

    const position = (rowIndex * 7) + (colIndex - 1);
    const isClicked = clickedNumbers.includes(position);
    const isIncorrect = incorrectClicks?.includes(position);
    const number = numbers.find((n) => n.position === position);

    if (showNumbers && number) return 'bg-blue-500 text-white';
    if (isClicked) {
      return isIncorrect
        ? 'bg-red-500/70 text-white'
        : 'bg-green-500/70 text-white';
    }
    if (showSolution && number && !isClicked) return 'bg-blue-500/30 text-white';
    return 'bg-gray-200 hover:bg-gray-300';
  };

  return (
    <div className="grid grid-cols-8 gap-2">
      {/* Header row */}
      {columns.map((col, colIndex) => (
        <div
          key={`header-${col}`}
          className="h-10 flex items-center justify-center bg-gray-100 rounded-md font-semibold text-gray-600"
        >
          {col}
        </div>
      ))}

      {/* Grid rows */}
      {rows.map((row, rowIndex) => (
        <React.Fragment key={`row-${row}`}>
          {columns.map((_, colIndex) => {
            const isHeader = colIndex === 0;
            const position = (rowIndex * 7) + (colIndex - 1);
            const content = getCellContent(rowIndex, colIndex);
            const cellStyle = getCellStyle(rowIndex, colIndex);

            return (
              <motion.button
                key={`cell-${rowIndex}-${colIndex}`}
                whileTap={!isHeader ? { scale: 0.95 } : undefined}
                className={`h-10 rounded-md text-lg font-bold flex items-center justify-center ${cellStyle} ${
                  isHeader ? 'cursor-default' : disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => !isHeader && !disabled && onCellClick(position)}
                disabled={isHeader || disabled}
              >
                {content}
              </motion.button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}