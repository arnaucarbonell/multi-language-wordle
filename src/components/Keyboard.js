import React from 'react';

const Keyboard = ({ onKeyPress }) => {
    const keys = [
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ',
        'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE',
    ];

    return (
        <div className="keyboard">
            {keys.map((key, index) => (
                <button
                    key={index}
                    className={key === 'Enter' ? 'enter' : key === 'Backspace' ? 'backspace' : ''}
                    onClick={() => onKeyPress(key)}
                >
                    {key}
                </button>
            ))}
        </div>
    );
};

export default Keyboard;
