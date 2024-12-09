let board = Array(16).fill(0); // Game board state
let score = 0;
let gameOver = false;

// Update the score display
function updateScore(newScore) {
  score = newScore;
  document.getElementById("score").textContent = `Score: ${score}`;
}

// Function to add a random tile (2 or 4) safely
function addRandomTile() {
  const emptyIndexes = [];
  board.forEach((tile, index) => {
    if (tile === 0) emptyIndexes.push(index);
  });

  if (emptyIndexes.length > 0) {
    const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    const newTileValue = Math.random() < 0.9 ? 2 : 4; // Randomly select 2 or 4
    board[randomIndex] = newTileValue;
    updateScore(score + newTileValue);
    updateGrid();
  }
}

// Function to redraw the game grid
function updateGrid() {
  const gridContainer = document.getElementById("grid-container");
  gridContainer.innerHTML = "";

  board.forEach((tile, index) => {
    const tileElement = document.createElement("div");
    tileElement.classList.add("grid-cell");

    if (tile !== 0) {
      tileElement.textContent = tile; // Display the tile number
      tileElement.classList.add(`tile-${tile}`); // Set the correct style class
    }

    const x = (index % 4) * 90 + 10;
    const y = Math.floor(index / 4) * 90 + 10;

    tileElement.style.transform = `translate(${x}px, ${y}px)`; // Position the tile

    gridContainer.appendChild(tileElement);
  });
}

// Check if there are any possible moves left
function checkGameOver() {
  if (board.every(tile => tile !== 0) && !canMakeMove()) {
    document.getElementById("game-over").classList.remove("hidden");
    gameOver = true;
  }
}

// Check if a valid move is possible
function canMakeMove() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      const currentTile = board[index];
      if (
        (j < 3 && currentTile === board[index + 1]) || // Check horizontal match
        (i < 3 && currentTile === board[index + 4]) // Check vertical match
      ) {
        return true;
      }
    }
  }
  return false;
}

// Restart the game
function handleRestart() {
  board = Array(16).fill(0);
  score = 0;
  gameOver = false;
  document.getElementById("game-over").classList.add("hidden");
  updateScore(score);
  addRandomTile();
  addRandomTile();
  updateGrid();
}

// Handle user keyboard input for game mechanics
function handleKeyPress(e) {
  if (gameOver) {
    if (e.key.toLowerCase() === "r") {
      handleRestart();
    }
    return;
  }

  switch (e.key) {
    case "ArrowLeft":
    case "a":
      console.log("Left movement logic here.");
      break;
    case "ArrowRight":
    case "d":
      console.log("Right movement logic here.");
      break;
    case "ArrowUp":
    case "w":
      console.log("Up movement logic here.");
      break;
    case "ArrowDown":
    case "s":
      console.log("Down movement logic here.");
      break;
  }
}

document.addEventListener("keydown", handleKeyPress);

// Initialize the game by adding two random tiles and setting the grid
addRandomTile();
addRandomTile();
updateGrid();
