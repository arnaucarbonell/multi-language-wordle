import React from 'react';
import Row from './Row';

const Board = ({ board, colors }) => {
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <Row key={rowIndex} row={row} colors={colors[rowIndex]} />
            ))}
        </div>
    );
};

export default Board;
