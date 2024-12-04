let board = Array(16).fill(0);
let score = 0;
let gameOver = false;

// Update score display
function updateScore(newScore) {
    score = newScore;
    document.getElementById("score").textContent = `Score: ${score}`;
}

// Function to add random tiles to the grid
function addRandomTile() {
    const emptyIndexes = [];
    board.forEach((tile, index) => {
        if (tile === 0) emptyIndexes.push(index);
    });
    const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    updateScore(score + (board[randomIndex] === 4 ? 4 : 2)); // Update score based on tile added
    updateGrid();
}

// Function to check for game over
function checkGameOver() {
    // Check for game-over conditions (e.g., no empty spaces and no more possible moves)
    if (board.every(value => value !== 0)) {
        // If no more moves are possible
        document.getElementById("game-over").classList.remove("hidden");
        gameOver = true;
    }
}

// Function to restart the game
function restartGame() {
    // Reset game board and score
    board = Array(16).fill(0);
    score = 0;
    updateScore(score);
    document.getElementById("game-over").classList.add("hidden");
    addRandomTile();
    addRandomTile();
    gameOver = false;
}

// Render the grid and tiles on the screen
function updateGrid() {
    const gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = '';

    board.forEach((tile, index) => {
        const tileElement = document.createElement("div");
        tileElement.classList.add("grid-cell");
        tileElement.dataset.value = tile;
        tileElement.textContent = tile === 0 ? '' : tile;
        gridContainer.appendChild(tileElement);
        const x = (index % 4) * 85 + 10; // X position
        const y = Math.floor(index / 4) * 85 + 10; // Y position
        tileElement.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Handle key press events and prevent moves when game is over
function handleKeyPress(e) {
    if (gameOver) return;

    let moved = false;
    if (e.key === "ArrowUp") {
        moveUp();
        moved = true;
    }
    if (e.key === "ArrowDown") {
        moveDown();
        moved = true;
    }
    if (e.key === "ArrowLeft") {
        moveLeft();
        moved = true;
    }
    if (e.key === "ArrowRight") {
        moveRight();
        moved = true;
    }

    if (moved) {
        addRandomTile();
        checkGameOver(); // Check if game is over after each move
    }
}

document.addEventListener("keydown", handleKeyPress);

// Add two random tiles initially
addRandomTile();
addRandomTile();
