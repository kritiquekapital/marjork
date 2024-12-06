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
    if (emptyIndexes.length > 0) {
        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        updateScore(score + (board[randomIndex] === 4 ? 4 : 2));
        updateGrid();
    }
}

// Function to slide all cells visually with animation
function updateGrid() {
    const gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = "";

    board.forEach((tile, index) => {
        const tileElement = document.createElement("div");
        tileElement.classList.add("grid-cell");
        
        if (tile !== 0) {
            tileElement.textContent = tile;
            tileElement.classList.add(`tile-${tile}`);
        }

        const x = (index % 4) * 90 + 10;
        const y = Math.floor(index / 4) * 90 + 10;

        // Animate the position
        tileElement.style.transform = `translate(${x}px, ${y}px)`;

        gridContainer.appendChild(tileElement);
    });
}

// Handle game over logic
function checkGameOver() {
    if (
        board.every(tile => tile !== 0) &&
        !canMakeMove()
    ) {
        document.getElementById("game-over").classList.remove("hidden");
        gameOver = true;
    }
}

function canMakeMove() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const index = i * 4 + j;
            if (
                (j < 3 && board[index] === board[index + 1]) || 
                (i < 3 && board[index] === board[index + 4])
            ) {
                return true;
            }
        }
    }
    return false;
}

// Restart Game
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

// Handle user keyboard input
function handleKeyPress(e) {
    if (gameOver) {
        if (e.key.toLowerCase() === "r") {
            handleRestart();
        }
        return;
    }

    let moved = false;

    // Swapped controls
    if (e.key === "ArrowDown" || e.key === "s") {
        moveUp();
        moved = true;
    }
    if (e.key === "ArrowUp" || e.key === "w") {
        moveDown();
        moved = true;
    }
    if (e.key === "ArrowRight" || e.key === "d") {
        moveLeft();
        moved = true;
    }
    if (e.key === "ArrowLeft" || e.key === "a") {
        moveRight();
        moved = true;
    }

    if (moved) {
        addRandomTile();
        checkGameOver();
    }
}

// Placeholder movement functions
function moveLeft() {
    console.log("Moved left");
}

function moveRight() {
    console.log("Moved right");
}

function moveUp() {
    console.log("Moved up");
}

function moveDown() {
    console.log("Moved down");
}

document.addEventListener("keydown", handleKeyPress);

// Initialize game
addRandomTile();
addRandomTile();
updateGrid();
