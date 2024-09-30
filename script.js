let currentWord = '';
let scrambledWord = '';
let attempts = 0;
let errors = [];

const scrambledWordElement = document.getElementById('scrambled-word');
const wordInputElement = document.getElementById('word-input');
const attemptsElement = document.getElementById('attempts');
const errorsElement = document.getElementById('errors');
const randomButton = document.getElementById('random-btn');
const resetButton = document.getElementById('reset-btn');

function shakeContainer() {
    const container = document.querySelector('.container');
    container.classList.add('shake');
    setTimeout(() => container.classList.remove('shake'), 500);
}

async function getRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?lang=es');
        if (!response.ok) {
            throw new Error('No se pudo obtener una palabra');
        }
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error al obtener palabra:', error);
        return 'futurista'; // Palabra por defecto en caso de error
    }
}

function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

async function generateNewWord() {
    currentWord = await getRandomWord();
    scrambledWord = shuffleWord(currentWord);
    scrambledWordElement.textContent = scrambledWord;
    createInputFields();
}

function createInputFields() {
    wordInputElement.innerHTML = '';
    for (let i = 0; i < currentWord.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.dataset.index = i;
        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', handleKeyDown);
        wordInputElement.appendChild(input);
    }
    wordInputElement.firstChild.focus();
}

function handleInput(event) {
    const index = parseInt(event.target.dataset.index);
    const nextInput = wordInputElement.querySelector(`input[data-index="${index + 1}"]`);
    
    if (event.target.value.length === 1 && nextInput) {
        nextInput.focus();
    }
    
    checkWord();
}

function handleKeyDown(event) {
    if (event.key === 'Backspace' && event.target.value === '') {
        const index = parseInt(event.target.dataset.index);
        const prevInput = wordInputElement.querySelector(`input[data-index="${index - 1}"]`);
        if (prevInput) {
            prevInput.focus();
        }
    }
}

function checkWord() {
    const inputs = wordInputElement.querySelectorAll('input');
    const guessedWord = Array.from(inputs).map(input => input.value).join('');
    
    if (guessedWord.length === currentWord.length) {
        if (guessedWord.toLowerCase() === currentWord.toLowerCase()) {
            showSuccessMessage();
            setTimeout(() => {
                generateNewWord();
            }, 1500);
        } else {
            shakeContainer();
            attempts++;
            attemptsElement.textContent = attempts;
            errors.push(guessedWord);
            errorsElement.textContent = errors.join(', ');
            inputs.forEach(input => input.value = '');
            inputs[0].focus();
        }
        
        if (attempts === 6 || errors.length === 6) {
            showFailureMessage();
            setTimeout(() => {
                resetGame();
            }, 2000);
        }
    }
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.textContent = '¡Éxito!';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '3rem';
    message.style.color = '#4CAF50';
    message.style.textShadow = '0 0 10px #4CAF50';
    message.style.zIndex = '1000';
    document.body.appendChild(message);
    setTimeout(() => {
        document.body.removeChild(message);
    }, 1500);
}

function showFailureMessage() {
    const message = document.createElement('div');
    message.textContent = '¡Fallaste! La palabra era: ' + currentWord;
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '2rem';
    message.style.color = '#FF5252';
    message.style.textShadow = '0 0 10px #FF5252';
    message.style.zIndex = '1000';
    document.body.appendChild(message);
    setTimeout(() => {
        document.body.removeChild(message);
    }, 2000);
}

function resetGame() {
    attempts = 0;
    errors = [];
    attemptsElement.textContent = attempts;
    errorsElement.textContent = '';
    generateNewWord();
}

randomButton.addEventListener('click', generateNewWord);
resetButton.addEventListener('click', resetGame);

// Initialize the game
generateNewWord();

function createStarryBackground() {
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars');
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainer.appendChild(star);
    }
}

// Call this function when the page loads
window.addEventListener('load', createStarryBackground);