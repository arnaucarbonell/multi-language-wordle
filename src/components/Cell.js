import React from 'react';

const Cell = ({ value, color }) => {
    return (
        <div className="cell" style={{ backgroundColor: color }}>
            {value}
        </div>
    );
};

export default Cell;
