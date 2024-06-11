import React, { useState } from 'react';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import './App.css';

const App = () => {
  const [board, setBoard] = useState([...Array(6)].map(() => Array(5).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  // Define the correct word
  const correctWord = "REACT";

  const handleKeyPress = (key) => {
    // Game logic here
  };

  return (
      <div className="App">
        <h1>Wordle Clone</h1>
        <Board board={board} />
        <Keyboard onKeyPress={handleKeyPress} />
      </div>
  );
};

export default App;