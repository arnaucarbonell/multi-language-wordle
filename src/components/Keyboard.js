import React from 'react';

const Keyboard = ({ onKeyPress }) => {
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="keyboard">
            {keys.map((key) => (
                <button key={key} onClick={() => onKeyPress(key)}>
                    {key}
                </button>
            ))}
        </div>
    );
};

export default Keyboard;
