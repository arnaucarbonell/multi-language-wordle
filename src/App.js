import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import './App.css';
import axios from 'axios';

const App = () => {
    const [board, setBoard] = useState([...Array(6)].map(() => Array(5).fill('')));
    const [colors, setColors] = useState([...Array(6)].map(() => Array(5).fill('')));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);
    const [language, setLanguage] = useState('english'); // Default language
    const [correctWord, setCorrectWord] = useState('');

    const languages = {
        english: {
            enterWord: 'Enter Word',
            backspace: 'Backspace',
            changeLanguage: 'Change Language',
        },
        spanish: {
            enterWord: 'Introducir Palabra',
            backspace: 'Retroceso',
            changeLanguage: 'Cambiar Idioma',
        },
        catalan: {
            enterWord: 'Introduir Paraula',
            backspace: 'Retrocés',
            changeLanguage: 'Canviar Idioma',
        },
    };

    const englishWords = require('./words/englishWords');
    const spanishWords = require('./words/spanishWords');
    const catalanWords = ['gatas', 'taula', 'llums', 'pluja', 'flors'];

    const getRandomWord = (language) => {
        const words = {
            english: englishWords,
            spanish: spanishWords,
            catalan: catalanWords
        };

        const randomIndex = Math.floor(Math.random() * words[language].length);
        return words[language][randomIndex].toUpperCase(); // Convert to uppercase
    };

    const handleKeyPress = (event) => {
        console.log(event);
        let key;
        if(event === 'BACKSPACE' || event === 'ENTER'){
            key = event;
        }
        else{
            key = event.key.toUpperCase();
        }
        if (key === 'ENTER') {
            if (currentCol === 5) {
                checkWord();
            }
        } else if (key === 'BACKSPACE') {
            if (currentCol > 0) {
                const newBoard = [...board];
                newBoard[currentRow][currentCol - 1] = '';
                setBoard(newBoard);
                setCurrentCol((prevCol) => prevCol - 1);
            }
        } else if (/^[A-Z]$/.test(key)) {
            if (currentCol < 5) {
                const newBoard = [...board];
                newBoard[currentRow][currentCol] = key;
                setBoard(newBoard);
                setCurrentCol((prevCol) => prevCol + 1);
            }
        }
    };

    const checkWord = () => {
        const guessedWord = board[currentRow].join('').toUpperCase(); // Convert to lowercase for case-insensitive comparison
        const newColors = [...colors];
        console.log(guessedWord, correctWord);
        // Check if the guessed word exists in the array of words
        if (englishWords.includes(guessedWord) || spanishWords.includes(guessedWord) || catalanWords.includes(guessedWord)) {
            for (let i = 0; i < 5; i++) {
                console.log(guessedWord[i], correctWord[i]);
                if (guessedWord[i] === correctWord[i]) {
                    newColors[currentRow][i] = 'green';
                } else if (correctWord.includes(guessedWord[i])) {
                    newColors[currentRow][i] = 'orange';
                } else {
                    newColors[currentRow][i] = 'grey';
                }
            }
            setColors(newColors);
            setCurrentRow((prevRow) => prevRow + 1);
            setCurrentCol(0);
        } else {
            // Handle case where guessed word is not in the array
           /* for (let i = 0; i < 5; i++) {
                newColors[currentRow][i] = 'red'; // Example: Color the row in red if word is incorrect
            }*/
        }

    };

    const handleChangeLanguage = (lang) => {
        setLanguage(lang);
        fetchRandomWord(lang); // Fetch a new word when the language changes
    };

    const fetchRandomWord = (lang) => {
        const word = getRandomWord(lang);
        setCorrectWord(word);
    };

    useEffect(() => {
        fetchRandomWord(language);
    }, [language]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toUpperCase();
            if (/[A-Z]|ENTER|BACKSPACE/.test(key)) {
                handleKeyPress(event);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentRow, currentCol, board, colors]);


    return (
        <div className="App">
            <h1>Wordle Clone</h1>
            <div className="correct-word">Correct Word: {correctWord}</div>
            <Board board={board} colors={colors}/>
            <Keyboard onKeyPress={handleKeyPress}/>
            <div className="language-buttons">
                <button onClick={() => handleChangeLanguage('english')}>English</button>
                <button onClick={() => handleChangeLanguage('spanish')}>Español</button>
                <button onClick={() => handleChangeLanguage('catalan')}>Català</button>
            </div>
            <div>{languages[language].enterWord}</div>
            <div>{languages[language].backspace}</div>
            <div>{languages[language].changeLanguage}</div>
        </div>
    );
};

export default App;