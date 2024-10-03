const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

// Elementos de mensagem e reinício
const messageElement = document.createElement('div');
messageElement.className = 'endgame-message';
messageElement.style.display = 'none';
document.body.appendChild(messageElement);

const restartButton = document.createElement('button');
restartButton.className = 'restart-button';
restartButton.innerText = 'Reiniciar Jogo';
restartButton.style.display = 'none';
document.body.appendChild(restartButton);

// Sons
const backgroundMusic = new Audio('../sounds/fanfa.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const cardFlipSound = new Audio('../efects/Click.m4a');
cardFlipSound.volume = 0.5;

// Variáveis de controle
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timerInterval;
let gameStarted = false;
let moveCount = 0;

// Funções de música
const startMusic = () => {
  backgroundMusic.play();
};

const stopMusic = () => {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
};



// Array com os nomes dos personagens (primeira metade dos pares)
const characters = [
  '1', '02', '3', '4', '5', '06', '07', '08', '09', '10',
];

// Array com os nomes das cópias dos personagens (segunda metade dos pares)
const pesona = [
  '1', '02', '3', '4', '5', '06', '07', '08', '09', '10',
];

// Objeto que associa cada personagem à sua respectiva cópia
const pairs = {
  '1': '1', '02': '02', '3': '3', '4': '4', '5': '5',
  '06': '06', '07': '07', '8': '8', '9': '09', '10': '10',
};
// Criação de elementos
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

// Função de mensagem de fim de jogo
const showEndGameMessage = () => {
  clearInterval(timerInterval);
  const playerName = spanPlayer.innerHTML;
  const timeSpent = timer.innerHTML;
  
  messageElement.innerHTML = `<p>Parabéns, ${playerName}! Você completou o jogo em ${timeSpent} segundos com um total de ${moveCount} movimentos.</p>`;
  messageElement.style.display = 'flex';
  restartButton.style.display = 'block';
  
  startMusic();
};

// Função de som ao virar a carta
const playCardFlipSound = () => {
  cardFlipSound.currentTime = 0;
  cardFlipSound.play();
};

const revealCard = ({ target }) => {
  if (lockBoard || target.parentNode.classList.contains('reveal-card')) {
    return;
  }

  playCardFlipSound();

  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  target.parentNode.classList.add('reveal-card');

  if (!firstCard) {
    firstCard = target.parentNode;
  } else {
    secondCard = target.parentNode;
    lockBoard = true;
    checkCards();
    moveCount++;
  }
};

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter || pairs[firstCharacter] === secondCharacter || pairs[secondCharacter] === firstCharacter) {
    disableCards();
  } else {
    unflipCards();
  }
};

const disableCards = () => {
  firstCard.firstChild.classList.add('disabled-card');
  secondCard.firstChild.classList.add('disabled-card');

  resetBoard();
  checkEndGame();
};

const unflipCards = () => {
  setTimeout(() => {
    firstCard.classList.remove('reveal-card');
    secondCard.classList.remove('reveal-card');
    resetBoard();
  }, 500);
};

const resetBoard = () => {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
};

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');
  if (disabledCards.length === 20) {
    showEndGameMessage();
  }
};

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character);

  return card;
};

// Função corrigida que revela todas as cartas por 5 segundos
const revealAllCards = () => {
  const allCards = document.querySelectorAll('.card');
  
  allCards.forEach(card => {
    card.classList.add('reveal-card');
  });

  // Esconde todas as cartas após 5 segundos
  setTimeout(() => {
    allCards.forEach(card => {
      card.classList.remove('reveal-card');
    });
    
    lockBoard = false; // Libera o tabuleiro
    gameStarted = false; // Aguarda o jogador clicar para começar
  }, 5000);
};

const loadGame = () => {
  grid.innerHTML = '';
  const combinedCharacters = [...characters, ...pesona];
  const shuffledArray = combinedCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });

  lockBoard = true; // Bloqueia o tabuleiro para interações durante a exibição das cartas
  revealAllCards(); // Revela as cartas por 5 segundos
};

const startTimer = () => {
  timer.innerHTML = '0';
  timerInterval = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
};

const resetGameState = () => {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  clearInterval(timerInterval);
  stopMusic();
  messageElement.style.display = 'none';
  restartButton.style.display = 'none';
  timer.innerHTML = '0';
  gameStarted = false;
  moveCount = 0;
  loadGame();
};

restartButton.addEventListener('click', resetGameState);

window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  loadGame();
};
