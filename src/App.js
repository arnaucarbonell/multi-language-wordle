import React, { useState, useEffect, useRef } from 'react';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import './App.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
    const [board, setBoard] = useState([...Array(6)].map(() => Array(5).fill('')));
    const [colors, setColors] = useState([...Array(6)].map(() => Array(5).fill('')));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);
    const [language, setLanguage] = useState('english'); // Default language
    const [correctWord, setCorrectWord] = useState();
    const [userId, setUserId] = useState(null);

    const englishButtonRef = useRef(null);
    const spanishButtonRef = useRef(null);
    const catalanButtonRef = useRef(null);

    const handleChangeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        resetBoard();
        let tempCorrectWord = '';
        switch (newLanguage) {
            case 'english':
                setCorrectWord(dailyWords.english);
                break;
            case 'spanish':
                setCorrectWord(dailyWords.spanish);
                break;
            case 'catalan':
                setCorrectWord(dailyWords.catalan);
                break;
            default:
                break;
        }
        console.log('Correct woaaaaaaaard:',getCorrectWord(newLanguage));
        englishButtonRef.current.blur();
        spanishButtonRef.current.blur();
        catalanButtonRef.current.blur();
        fetchTodaysGame(userId, newLanguage, getCorrectWord(newLanguage));
    };

    function getCorrectWord(language){
        switch (language) {
            case 'english':
                return dailyWords.english;
            case 'spanish':
                return dailyWords.spanish;
            case 'catalan':
                return dailyWords.catalan;
            default:
                return '';
        }
    }
    const fetchDailyWords = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/daily-words');
            setDailyWords(response.data);
            switch (language) {
                case 'english':
                    setCorrectWord(response.data.english);
                    break;
                case 'spanish':
                    setCorrectWord(response.data.spanish);
                    break;
                case 'catalan':
                    setCorrectWord(response.data.catalan);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error fetching daily words:', error);
        }
        console.log('Correct word7777:', correctWord);
    };

    useEffect(() => {
        let storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            storedUserId = uuidv4();
            localStorage.setItem('userId', storedUserId);
        }
        setUserId(storedUserId);

        const createUser = async (id) => {
            try {
                await axios.post('http://localhost:5000/api/users', { id });
            } catch (error) {
                console.error('Error config:', error.config);
            }
        };
        createUser(storedUserId);
        fetchDailyWords();
        fetchTodaysGame(storedUserId, language, correctWord);
    }, []);

    const fetchTodaysGame = async (userId, currentLanguage, currentWord) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/todays-game/${userId}`);
            let word = '';
            try {
                const response = await axios.get('http://localhost:5000/api/daily-words');
                setDailyWords(response.data);
                switch (currentLanguage) {
                    case 'english':
                        setCorrectWord(response.data.english);
                        word = response.data.english;
                        break;
                    case 'spanish':
                        setCorrectWord(response.data.spanish);
                        word = response.data.spanish;
                        break;
                    case 'catalan':
                        setCorrectWord(response.data.catalan);
                        word = response.data.catalan;
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.error('Error fetching daily words:', error);
            }
            const game = response.data;
            console.log('game:', game);
            console.log('currentLanguage:', currentLanguage);
            console.log('currentWord:', word);
            setBoardFromStoredWords(game, currentLanguage, word);
        } catch (error) {
            console.error('Error fetching today\'s game:', error);
        }
    };

    const setBoardFromStoredWords = (game, currentLanguage, currentWord) => {
        console.log('currentLanguage:', currentLanguage);
        console.log('currentWord222222222:', currentWord);
        const words = game[currentLanguage];
        const newBoard = [...Array(6)].map(() => Array(5).fill(''));
        const newColors = [...Array(6)].map(() => Array(5).fill(''));

        words.forEach((word, rowIndex) => {
            for (let i = 0; i < 5; i++) {
                newBoard[rowIndex][i] = word[i];
            }
            changeLettersColor(word, newColors, rowIndex, currentWord); // Pass rowIndex to changeLettersColor
        });

        setBoard(newBoard);
        setColors(newColors);
        setCurrentRow(words.length); // Set currentRow to the number of words loaded
        setCurrentCol(0);
    };


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

    const [dailyWords, setDailyWords] = useState({
        english: '',
        spanish: '',
        catalan: ''
    });

    const resetBoard = () => {
        setBoard([...Array(6)].map(() => Array(5).fill('')));
        setColors([...Array(6)].map(() => Array(5).fill('')));
        setCurrentRow(0);
        setCurrentCol(0);
    };

    const handleKeyPress = (event) => {
        let key;
        if(event === 'BACKSPACE' || event === 'ENTER' || event.key === undefined){
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

    const checkWord = async () => {
        const guessedWord = board[currentRow].join('').toUpperCase(); // Convert to uppercase for consistent comparison
        const newColors = [...colors];

        try {
            const response = await fetch('http://localhost:5000/api/check-word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ guessedWord, language }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.isValid) {
                changeLettersColor(guessedWord, newColors, currentRow);
                setCurrentRow((prevRow) => prevRow + 1);
                setCurrentCol(0);
                await axios.post('http://localhost:5000/api/guess-word', {
                    userId,
                    guessedWord,
                    language
                });
            } else {
                // Handle case where guessed word is incorrect
                // Example: Color the row in red if word is incorrect
                /* for (let i = 0; i < 5; i++) {
                    newColors[currentRow][i] = 'red';
                }*/
            }
        } catch (error) {
            console.error('Error checking word:', error);
            // Handle error appropriately
        }
    };

    const changeLettersColor = (guessedWord, newColors, rowIndex, currentWord) => {
        // Check if the guessed word exists in the array of words
        console.log(language);
        for (let i = 0; i < 5; i++) {
            if (guessedWord[i] === currentWord[i]) {
                newColors[rowIndex][i] = 'green';
            } else if (currentWord.includes(guessedWord[i])) {
                newColors[rowIndex][i] = 'orange';
            } else {
                newColors[rowIndex][i] = 'grey';
            }
        }
        setColors(newColors);
    };

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
            <p>Your User ID: {userId}</p>
            <p>The daily word in English is: {dailyWords.english}</p>
            <p>La palabra del día en español es: {dailyWords.spanish}</p>
            <p>La paraula del dia en català és: {dailyWords.catalan}</p>
            <div className="correct-word">Correct Word: {correctWord}</div>
            <Board board={board} colors={colors}/>
            <Keyboard onKeyPress={handleKeyPress}/>
            <div className="language-buttons">
                <button ref={englishButtonRef} onClick={() => handleChangeLanguage('english')}>English</button>
                <button ref={spanishButtonRef} onClick={() => handleChangeLanguage('spanish')}>Español</button>
                <button ref={catalanButtonRef} onClick={() => handleChangeLanguage('catalan')}>Català</button>
            </div>
            <div>{languages[language].enterWord}</div>
            <div>{languages[language].backspace}</div>
            <div>{languages[language].changeLanguage}</div>
        </div>
    );
};

export default App;