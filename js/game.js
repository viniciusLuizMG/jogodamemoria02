// Seleciona elementos do DOM que serão usados no jogo
const grid = document.querySelector('.grid'); // Contêiner das cartas
const spanPlayer = document.querySelector('.player'); // Elemento do nome do jogador
const timer = document.querySelector('.timer'); // Elemento do tempo do jogo

// Cria um elemento para exibir a mensagem de fim de jogo
const messageElement = document.createElement('div');
messageElement.className = 'endgame-message';
messageElement.style.display = 'none'; // Começa escondido
document.body.appendChild(messageElement); // Adiciona ao corpo da página

// Cria o botão de reinício do jogo
const restartButton = document.createElement('button');
restartButton.className = 'restart-button';
restartButton.innerText = 'Reiniciar Jogo';
restartButton.style.display = 'none'; // Começa escondido
document.body.appendChild(restartButton);

// Adiciona música de fundo
const backgroundMusic = new Audio('../sounds/fanfa.mp3'); // Caminho do áudio
backgroundMusic.loop = true; // Toca em loop
backgroundMusic.volume = 0.5; // Volume inicial

// Adiciona o som ao clicar em uma carta
const cardFlipSound = new Audio('../efects/Click.m4a'); // Caminho do áudio
cardFlipSound.volume = 0.5; // Define o volume do som

// Variáveis do jogo
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timerInterval; // Variável para o intervalo do timer
let gameStarted = false; // Para verificar se o jogo já começou
let moveCount = 0; // Variável para contar os movimentos
let timeElapsed = 0; // Variável para armazenar o tempo gasto

// Funções de música
const startMusic = () => {
  backgroundMusic.play();
};

const stopMusic = () => {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0; // Reseta o tempo da música
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

// Função que cria um novo elemento HTML
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

// Função que exibe a mensagem de fim de jogo e o botão de reinício
const showEndGameMessage = () => {
  stopTimer(); // Para o timer
  const playerName = spanPlayer.innerHTML;

  // Exibe a mensagem final com o número de movimentos
  messageElement.innerHTML = 
    `<p>Parabéns, ${playerName}! Você completou o jogo em ${timeElapsed} segundos com um total de ${moveCount} movimentos.</p>`;

  messageElement.style.display = 'flex'; // Mostra a mensagem
  restartButton.style.display = 'block'; // Mostra o botão de reinício
  
  startMusic(); // Toca a música ao final do jogo
};

// Função que toca o som ao clicar em uma carta
const playCardFlipSound = () => {
  cardFlipSound.currentTime = 0; // Reseta o áudio para o início
  cardFlipSound.play(); // Toca o som
};

// Função que inicia o cronômetro
const startTimer = () => {
  timer.innerHTML = '0'; // Reseta o timer
  timeElapsed = 0; // Reseta o tempo
  timerInterval = setInterval(() => {
    timeElapsed += 1; // Incrementa o tempo gasto
    timer.innerHTML = timeElapsed; // Atualiza o valor no elemento do cronômetro
  }, 1000); // Atualiza a cada segundo (1000 ms)
};

// Função que para o cronômetro
const stopTimer = () => {
  clearInterval(timerInterval); // Para o timer
};

const revealCard = ({ target }) => {
  if (lockBoard || target.parentNode.classList.contains('reveal-card')) {
    return;
  }

  // Toca o som de virar a carta
  playCardFlipSound();

  if (!gameStarted) {
    startTimer(); // Inicia o timer ao revelar a primeira carta
    gameStarted = true; // Marca que o jogo começou
  }

  target.parentNode.classList.add('reveal-card');

  if (!firstCard) {
    firstCard = target.parentNode;
  } else {
    secondCard = target.parentNode;
    lockBoard = true;
    checkCards();
    moveCount++; // Incrementa o contador de movimentos
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
  checkEndGame(); // Verifica se o jogo acabou
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
  
  // Se todas as cartas foram desabilitadas, o jogo termina
  if (disabledCards.length === 20) {
    showEndGameMessage(); // Exibe a mensagem de parabéns e toca a música
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

const loadGame = () => {
  grid.innerHTML = ''; // Limpa o tabuleiro antes de carregar o jogo novamente
  const combinedCharacters = [...characters, ...pesona];
  const shuffledArray = combinedCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });

  resetGameState(); // Reseta o estado do jogo
};

// Função que reseta o jogo quando o botão é clicado
const resetGameState = () => {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  stopTimer(); // Para o timer
  stopMusic(); // Para a música ao reiniciar
  messageElement.style.display = 'none'; // Esconde a mensagem de fim de jogo
  restartButton.style.display = 'none'; // Esconde o botão de reinício
  timer.innerHTML = '0'; // Reseta o cronômetro
  gameStarted = false; // Reseta o estado do jogo
  moveCount = 0; // Reseta o contador de movimentos
  loadGame(); // Carrega um novo jogo
};

// Adiciona o evento de clique para reiniciar o jogo
restartButton.addEventListener('click', resetGameState); // Liga o botão de reinício à função resetGameState

window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  loadGame(); // Carrega o jogo ao iniciar a página
};
