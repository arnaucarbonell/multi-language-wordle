import React from 'react';
import Cell from './Cell';

const Row = ({ row }) => {
    return (
        <div className="row">
            {row.map((cell, cellIndex) => (
                <Cell key={cellIndex} value={cell} />
            ))}
        </div>
    );
};

export default Row;
