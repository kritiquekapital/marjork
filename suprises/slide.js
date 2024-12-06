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
  gameContainer.innerHTML = ''; // Clear old tiles

  board.forEach((tile, index) => {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    
    // Set background classes based on the tile value
    if (tile === 2) cell.classList.add('tile-2');
    if (tile === 4) cell.classList.add('tile-4');
    if (tile === 8) cell.classList.add('tile-8');

    cell.textContent = tile === 0 ? '' : tile;
    gameContainer.appendChild(cell);
  });
}

// Check for moves in specific directions
function checkLeft() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i * 4 + j] !== 0 && board[i * 4 + j] === board[i * 4 + j + 1]) {
        return true;
      }
    }
  }
  return false;
}

function checkRight() {
  for (let i = 0; i < 4; i++) {
    for (let j = 3; j > 0; j--) {
      if (board[i * 4 + j] !== 0 && board[i * 4 + j] === board[i * 4 + j - 1]) {
        return true;
      }
    }
  }
  return false;
}

function checkUp() {
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 3; i++) {
      if (board[i * 4 + j] !== 0 && board[i * 4 + j] === board[(i + 1) * 4 + j]) {
        return true;
      }
    }
  }
  return false;
}

function checkDown() {
  for (let j = 0; j < 4; j++) {
    for (let i = 3; i > 0; i--) {
      if (board[i * 4 + j] !== 0 && board[i * 4 + j] === board[(i - 1) * 4 + j]) {
        return true;
      }
    }
  }
  return false;
}

// Check for game-over conditions
function checkGameOver() {
  if (
    board.every(value => value !== 0) && 
    !checkLeft() && 
    !checkRight() && 
    !checkUp() && 
    !checkDown()
  ) {
    document.getElementById("game-over").classList.remove("hidden");
    gameOver = true;
  }
}

// Handle keyboard events
function handleKeyPress(e) {
  if (gameOver) {
    if (e.key === 'r' || e.key === 'R') {
      restartGame();
    }
    return;
  }

  let moved = false;
  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
      moved = true;
      break;
    case 'ArrowRight':
    case 'd':
      moved = true;
      break;
    case 'ArrowUp':
    case 'w':
      moved = true;
      break;
    case 'ArrowDown':
    case 's':
      moved = true;
      break;
  }

  if (moved) {
    addRandomTile();
    checkGameOver();
  }
}

function restartGame() {
  board = Array(16).fill(0);
  gameOver = false;
  initializeGame();
}

document.addEventListener('keydown', handleKeyPress);
initializeGame();
