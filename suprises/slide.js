let board = Array(16).fill(0);
let gameOver = false;
let score = 0;

// Initialize the game by adding two random tiles
function initializeGame() {
  addRandomTile();
  addRandomTile();
  updateGrid();
}

// Add a random tile (2 or 4) to an empty space
function addRandomTile() {
  const emptyIndexes = [];
  board.forEach((tile, index) => {
    if (tile === 0) emptyIndexes.push(index);
  });
  if (emptyIndexes.length > 0) {
    const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    updateGrid();
  }
}

// Render the game grid to the DOM
function updateGrid() {
  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = ''; // Clear out old tiles

  board.forEach((tile, index) => {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    cell.textContent = tile === 0 ? '' : tile;
    gameContainer.appendChild(cell);
  });
}

// Handle move left
function moveLeft() {
  console.log('Left');
}

// Handle move right
function moveRight() {
  console.log('Right');
}

// Handle move up
function moveUp() {
  console.log('Up');
}

// Handle move down
function moveDown() {
  console.log('Down');
}

// Handle keyboard events
function handleKeyPress(e) {
  if (gameOver) {
    if (e.key === 'r' || e.key === 'R') {
      restartGame();
    }
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
      moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
      moveRight();
      break;
    case 'ArrowUp':
    case 'w':
      moveUp();
      break;
    case 'ArrowDown':
    case 's':
      moveDown();
      break;
  }
}

// Restart game logic
function restartGame() {
  board = Array(16).fill(0);
  score = 0;
  gameOver = false;
  initializeGame();
}

// Attach keyboard listener
document.addEventListener('keydown', handleKeyPress);

// Start the game
initializeGame();
