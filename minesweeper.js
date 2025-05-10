document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("minesweeper-game");
  const gridElement = document.getElementById("minesweeper-grid");
  const closeButton = document.getElementById("close-minesweeper");
  const difficultySelect = document.getElementById("difficulty-select");
  const newGameBtn = document.querySelector(".new-game-button");
  const fullscreenBtn = document.querySelector(".fullscreen-button");
  const secretButton = document.querySelector(".secret-button");

  const difficulties = {
    easy: { cols: 10, rows: 8, mines: 10 },
    medium: { cols: 18, rows: 14, mines: 40 },
    hard: { cols: 24, rows: 20, mines: 99 },
  };

  let currentDifficulty = "easy";
  let board = [];
  let firstClick = true;
  let gameOver = false;

  function generateGrid() {
    gridElement.innerHTML = "";
    board = [];
    firstClick = true;
    gameOver = false;

    const { cols, rows } = difficulties[currentDifficulty];
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridElement.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < cols; x++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.x = x;
        tile.dataset.y = y;

        tile.addEventListener("click", () => handleClick(x, y));

        tile.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          toggleFlag(x, y);
        });

        // Mobile long-press as flag
        let longPressTimer = null;
        tile.addEventListener("touchstart", () => {
          longPressTimer = setTimeout(() => toggleFlag(x, y), 600);
        });
        tile.addEventListener("touchend", () => {
          clearTimeout(longPressTimer);
        });
        tile.addEventListener("touchmove", () => {
          clearTimeout(longPressTimer);
        });

        row.push({ x, y, el: tile, mine: false, revealed: false, flagged: false, count: 0 });
        gridElement.appendChild(tile);
      }
      board.push(row);
    }
  }

  function placeMines(safeX, safeY) {
    const { cols, rows, mines } = difficulties[currentDifficulty];
    let placed = 0;

    while (placed < mines) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      if (board[y][x].mine || (Math.abs(x - safeX) <= 1 && Math.abs(y - safeY) <= 1)) continue;
      board[y][x].mine = true;
      placed++;
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!board[y][x].mine) {
          board[y][x].count = getNeighbors(x, y).filter(n => n.mine).length;
        }
      }
    }
  }

  function handleClick(x, y) {
    if (gameOver) return;
    const tile = board[y][x];
    if (tile.revealed || tile.flagged) return;

    if (firstClick) {
      placeMines(x, y);
      firstClick = false;
    }

    revealTile(x, y);

    if (tile.mine) {
      tile.el.classList.add("mine");
      tile.el.textContent = "💥";
      revealAllAnimated();
      gameOver = true;
    }
  }

  function toggleFlag(x, y) {
    if (gameOver) return;
    const tile = board[y][x];
    if (tile.revealed) return;
    tile.flagged = !tile.flagged;
    tile.el.textContent = tile.flagged ? "🫥" : "";
  }

  function revealTile(x, y) {
    const tile = board[y]?.[x];
    if (!tile || tile.revealed || tile.flagged) return;

    tile.revealed = true;
    tile.el.classList.add("revealed");

    if (tile.mine) {
      tile.el.textContent = "💣";
    } else if (tile.count > 0) {
      tile.el.textContent = tile.count;
    } else {
      getNeighbors(x, y).forEach(n => revealTile(n.x, n.y));
    }
  }

  function revealAllAnimated() {
    const mines = [];
    for (let row of board) {
      for (let tile of row) {
        if (tile.mine && !tile.revealed) {
          mines.push(tile);
        }
      }
    }

    mines.forEach((tile, i) => {
      setTimeout(() => {
        tile.el.textContent = "💣";
        tile.el.classList.add("mine");
        tile.revealed = true;
      }, i * 150);
    });
  }

  function getNeighbors(x, y) {
    const neighbors = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx, ny = y + dy;
        if (board[ny]?.[nx]) neighbors.push(board[ny][nx]);
      }
    }
    return neighbors;
  }

  function preventContextMenu(e) {
    e.preventDefault();
  }

  function openGame() {
    const { cols, rows } = difficulties[currentDifficulty];
    gameContainer.style.display = "block";
    gameContainer.style.left = `${(window.innerWidth - cols * 32) / 2}px`;
    gameContainer.style.top = `${(window.innerHeight - rows * 32) / 2}px`;
    updateThemeClass();
    document.addEventListener("contextmenu", preventContextMenu);
  }

  function updateThemeClass() {
    const themeClass = document.body.classList.contains("theme-retro")
      ? "retro"
      : document.body.classList.contains("theme-art")
      ? "paint"
      : null;

    gameContainer.classList.remove("retro", "paint");
    if (themeClass) gameContainer.classList.add(themeClass);
  }

  if (secretButton) {
    secretButton.addEventListener("click", openGame);
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      gameContainer.style.display = "none";
      document.removeEventListener("contextmenu", preventContextMenu);
    });
  }

  if (difficultySelect) {
    difficultySelect.addEventListener("change", () => {
      currentDifficulty = difficultySelect.value;
      generateGrid();
    });
  }

  if (newGameBtn) {
    newGameBtn.addEventListener("click", generateGrid);
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      gameContainer.requestFullscreen?.();
    });
  }

  generateGrid();
});
