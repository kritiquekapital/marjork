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
        updateGrid();
        updateScore(score + (board[randomIndex] === 4 ? 4 : 2));
    }
}

// Function to check for game over
function checkGameOver() {
    const canMove = [checkLeft(), checkRight(), checkUp(), checkDown()].some(movable => movable);
    if (!canMove) {
        document.getElementById("game-over").classList.remove("hidden");
        gameOver = true;
    }
}

// Function to reset the game
function restartGame() {
    board = Array(16).fill(0);
    score = 0;
    updateScore(score);
    document.getElementById("game-over").classList.add("hidden");
    addRandomTile();
    addRandomTile();
    gameOver = false;
}

// Function to render the game state
function updateGrid() {
    const gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = '';

    board.forEach((tile, index) => {
        const tileElement = document.createElement("div");
        tileElement.classList.add("grid-cell");
        tileElement.dataset.value = tile;
        tileElement.textContent = tile === 0 ? '' : tile;
        gridContainer.appendChild(tileElement);
        const x = (index % 4) * 85 + 10; // X coordinate
        const y = Math.floor(index / 4) * 85 + 10; // Y coordinate
        tileElement.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Movement logic helpers
function slideAndCombine(arr) {
    let newArr = arr.filter(val => val !== 0); // Remove 0's
    for (let i = 0; i < newArr.length - 1; i++) {
        if (newArr[i] === newArr[i + 1]) {
            newArr[i] *= 2; // Combine tiles
            score += newArr[i];
            newArr[i + 1] = 0; // Clear next tile
        }
    }
    newArr = newArr.filter(val => val !== 0); // Remove zeros again
    while (newArr.length < 4) newArr.unshift(0); // Pad with zeros to maintain length
    return newArr;
}

function moveLeft() {
    const newBoard = [];
    for (let row = 0; row < 4; row++) {
        const slice = board.slice(row * 4, row * 4 + 4);
        const newRow = slideAndCombine(slice);
        newBoard.push(...newRow);
    }
    board = newBoard;
    updateGrid();
    updateScore(score);
}

function moveRight() {
    const newBoard = [];
    for (let row = 0; row < 4; row++) {
        const slice = board.slice(row * 4, row * 4 + 4).reverse();
        const newRow = slideAndCombine(slice);
        newBoard.push(...newRow.reverse());
    }
    board = newBoard;
    updateGrid();
    updateScore(score);
}

function moveUp() {
    const newBoard = [];
    for (let col = 0; col < 4; col++) {
        const slice = [board[col], board[col + 4], board[col + 8], board[col + 12]];
        const newCol = slideAndCombine(slice);
        for (let row = 0; row < 4; row++) {
            newBoard[col + row * 4] = newCol[row];
        }
    }
    board = newBoard;
    updateGrid();
    updateScore(score);
}

function moveDown() {
    const newBoard = [];
    for (let col = 0; col < 4; col++) {
        const slice = [board[col + 12], board[col + 8], board[col + 4], board[col]];
        const newCol = slideAndCombine(slice);
        for (let row = 0; row < 4; row++) {
            newBoard[col + row * 4] = newCol[3 - row];
        }
    }
    board = newBoard;
    updateGrid();
    updateScore(score);
}

// Handle key press events
function handleKeyPress(e) {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowLeft, A':
            moveLeft();
            addRandomTile();
            checkGameOver();
            break;
        case 'ArrowRight, D':
            moveRight();
            addRandomTile();
            checkGameOver();
            break;
        case 'ArrowUp, W':
            moveUp();
            addRandomTile();
            checkGameOver();
            break;
        case 'ArrowDown, D':
            moveDown();
            addRandomTile();
            checkGameOver();
            break;
    }
}

document.addEventListener("keydown", handleKeyPress);

// Start with two initial random tiles
addRandomTile();
addRandomTile();
