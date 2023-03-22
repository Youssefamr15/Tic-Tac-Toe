//Selectors
const gameBoard = document.querySelector('#board');
const info = document.querySelector('#info');
let turn;
const winningCombos = [
  [0, 1, 2], //Top Row
  [3, 4, 5], //Mid Row
  [6, 7, 8], //Bot Row
  [0, 3, 6], //Left Col
  [1, 4, 7], //Mid Col
  [2, 5, 8], //Right Col
  [0, 4, 8], //Left-to-Right Diagonal
  [2, 4, 6], //Right-to-Left Diagonal
];

//Create Game Board
function createGameBoard() {
  const emptyTiles = ' '.repeat(9).split('');
  const tileGrid = emptyTiles
    .map((t) => `<button class="tile"></button>`)
    .join('');
  gameBoard.innerHTML = tileGrid;
  turn = 'X';
  document.documentElement.style.setProperty('--hue', 10);
  info.textContent = `${turn}'s turn`;
  gameBoard.addEventListener('click', handleGameboardClick);
  const allTiles = gameBoard.querySelectorAll('.tile');
  allTiles.forEach((t) => {
    t.addEventListener('mouseenter', handleMouseEnter);
    t.addEventListener('mouseleave', handleMouseLeave);
  });
  gameBoard.removeAttribute('inert');
}

createGameBoard();

function updateTurn() {
  turn = turn === 'X' ? 'O' : 'X';
  info.textContent = `${turn}'s trun`;
  document.documentElement.style.setProperty('--hue', turn === 'X' ? 10 : 220);
}

function restartGame() {
  let seconds = 3;
  const timer = setInterval(() => {
    info.textContent = `Restarting in ${seconds}...`;
    seconds--;
    if (seconds < 0) {
      //clear the interval
      clearInterval(timer);
      //Restart the game
      createGameBoard();
    }
  }, 1000);
}

function showCongrats() {
  info.textContent = `${turn}'s Win!`;
  gameBoard.removeEventListener('click', handleGameboardClick);
  gameBoard.setAttribute('inert', true);
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: ['🥳', '👏', '🎊', '🎉'],
  });
  setTimeout(restartGame, 2000);
}

function checkScore() {
  const allTiles = [...document.querySelectorAll('.tile')];
  const tileValues = allTiles.map((t) => t.dataset.value);
  const isWinner = winningCombos.some((combo) => {
    const [a, b, c] = combo;
    return (
      tileValues[a] &&
      tileValues[a] === tileValues[b] &&
      tileValues[a] === tileValues[c]
    );
  });
  if (isWinner) {
    return showCongrats();
  }
  updateTurn();
}

function handleGameboardClick(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.value = turn;
    e.target.style.setProperty('--hue', turn === 'X' ? 10 : 220);
    checkScore();
  }
}

function handleMouseEnter(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.hover = turn;
    e.target.style.setProperty('--hue', turn === 'X' ? 10 : 220);
  }
}

function handleMouseLeave(e) {
  e.target.dataset.hover = '';
}
