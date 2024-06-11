import React from 'react';
import Row from './Row';

const Board = ({ board }) => {
    return (
        <div className="board">
            {board.map((row, rowIndex) => (
                <Row key={rowIndex} row={row} />
            ))}
        </div>
    );
};

export default Board;
