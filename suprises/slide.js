app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-eval'"
  );
  next();
});

let board = Array(16).fill(0);
let score = 0;
let gameOver = false;

// Update score display
function updateScore() {
    document.getElementById("score").textContent = `Score: ${score}`;
}

// Add random tile (2 or 4) to the board
function addRandomTile() {
    const emptyIndexes = [];
    board.forEach((tile, index) => {
        if (tile === 0) emptyIndexes.push(index);
    });

    if (emptyIndexes.length > 0) {
        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        updateScore();
        updateGrid();
    }
}

// Handle keypresses for movement
function handleKeyPress(e) {
    if (gameOver) {
        if (e.key.toLowerCase() === "r") restartGame();
        return;
    }

    switch (e.key) {
        case "ArrowLeft":
        case "a":
            slideLeft();
            break;
        case "ArrowRight":
        case "d":
            slideRight();
            break;
        case "ArrowUp":
        case "w":
            slideUp();
            break;
        case "ArrowDown":
        case "s":
            slideDown();
            break;
    }
}

document.addEventListener("keydown", handleKeyPress);

// Function to slide tiles left
function slideLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
        let newRow = [];
        for (let col = 0; col < 4; col++) {
            const value = board[row * 4 + col];
            if (value !== 0) newRow.push(value);
        }

        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                score += newRow[i];
                newRow.splice(i + 1, 1);
            }
        }

        while (newRow.length < 4) newRow.push(0);

        for (let col = 0; col < 4; col++) {
            if (board[row * 4 + col] !== newRow[col]) moved = true;
            board[row * 4 + col] = newRow[col];
        }
    }

    if (moved) {
        addRandomTile();
        updateGrid();
        checkGameOver();
    }
}

// Function to slide tiles right
function slideRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
        let newRow = [];
        for (let col = 3; col >= 0; col--) {
            const value = board[row * 4 + col];
            if (value !== 0) newRow.push(value);
        }

        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                score += newRow[i];
                newRow.splice(i + 1, 1);
            }
        }

        while (newRow.length < 4) newRow.push(0);

        for (let col = 3; col >= 0; col--) {
            if (board[row * 4 + col] !== newRow[3 - col]) moved = true;
            board[row * 4 + col] = newRow[3 - col];
        }
    }

    if (moved) {
        addRandomTile();
        updateGrid();
        checkGameOver();
    }
}

// Function to slide tiles up
function slideUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 0; row < 4; row++) {
            if (board[row * 4 + col] !== 0) newCol.push(board[row * 4 + col]);
        }

        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                score += newCol[i];
                newCol.splice(i + 1, 1);
            }
        }

        while (newCol.length < 4) newCol.push(0);

        for (let row = 0; row < 4; row++) {
            if (board[row * 4 + col] !== newCol[row]) moved = true;
            board[row * 4 + col] = newCol[row];
        }
    }

    if (moved) {
        addRandomTile();
        updateGrid();
        checkGameOver();
    }
}

// Function to slide tiles down
function slideDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
        let newCol = [];
        for (let row = 3; row >= 0; row--) {
            if (board[row * 4 + col] !== 0) newCol.push(board[row * 4 + col]);
        }

        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                score += newCol[i];
                newCol.splice(i + 1, 1);
            }
        }

        while (newCol.length < 4) newCol.push(0);

        for (let row = 3; row >= 0; row--) {
            if (board[row * 4 + col] !== newCol[3 - row]) moved = true;
            board[row * 4 + col] = newCol[3 - row];
        }
    }

    if (moved) {
        addRandomTile();
        updateGrid();
        checkGameOver();
    }
}

// Restart Game
function restartGame() {
    board = Array(16).fill(0);
    score = 0;
    gameOver = false;
    updateScore();
    addRandomTile();
    addRandomTile();
    updateGrid();
    document.getElementById("game-over").classList.add("hidden");
}

// Game Over Logic
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
            if ((j < 3 && board[index] === board[index + 1]) || 
                (i < 3 && board[index] === board[index + 4])) {
                return true;
            }
        }
    }
    return false;
}

// Update grid visuals
function updateGrid() {
    const container = document.getElementById("grid-container");
    container.innerHTML = "";
    board.forEach((tile, index) => {
        const div = document.createElement("div");
        div.classList.add("grid-cell");
        if (tile !== 0) div.textContent = tile;
        div.style.transform = `translate(${(index % 4) * 110}px, ${Math.floor(index / 4) * 110}px)`;
        container.appendChild(div);
    });
    updateScore();
}
