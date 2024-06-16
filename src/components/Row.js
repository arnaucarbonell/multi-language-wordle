import React from 'react';
import Cell from './Cell';

const Row = ({ row, colors }) => {
    return (
        <div className="row">
            {row.map((cell, cellIndex) => (
                <Cell key={cellIndex} value={cell} color={colors[cellIndex]} />
            ))}
        </div>
    );
};

export default Row;
