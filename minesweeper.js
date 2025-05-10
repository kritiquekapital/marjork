document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("minesweeper-game");
  const grid = document.getElementById("minesweeper-grid");
  const closeBtn = document.getElementById("close-minesweeper");
  const triggerBtn = document.querySelector(".secret-button");

  const rows = 8;
  const cols = 10;
  const mineCount = 10;
  let firstClick = true;
  let board = [];
  let revealedCount = 0;
  let gameOver = false;

  function createBoard() {
    board = [];
    revealedCount = 0;
    gameOver = false;
    firstClick = true;
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.row = r;
        tile.dataset.col = c;
        tile.addEventListener("click", handleClick);
        tile.addEventListener("contextmenu", handleRightClick);
        grid.appendChild(tile);
        row.push({ el: tile, isMine: false, revealed: false, flagged: false, adjacent: 0 });
      }
      board.push(row);
    }
  }

  function placeMines(safeR, safeC) {
    let placed = 0;
    while (placed < mineCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      const dist = Math.abs(r - safeR) + Math.abs(c - safeC);
      if (!board[r][c].isMine && dist > 1) {
        board[r][c].isMine = true;
        placed++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) count++;
          }
        }
        board[r][c].adjacent = count;
      }
    }
  }

  function handleClick(e) {
    if (gameOver) return;
    const r = parseInt(this.dataset.row);
    const c = parseInt(this.dataset.col);
    if (firstClick) {
      placeMines(r, c);
      firstClick = false;
    }
    reveal(r, c);
    checkWin();
  }

  function handleRightClick(e) {
    e.preventDefault();
    if (gameOver) return;
    const r = parseInt(this.dataset.row);
    const c = parseInt(this.dataset.col);
    const cell = board[r][c];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    cell.el.textContent = cell.flagged ? "🚩" : "";
  }

  function reveal(r, c) {
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;
    cell.revealed = true;
    cell.el.classList.add("revealed");
    if (cell.isMine) {
      cell.el.textContent = "💣";
      cell.el.classList.add("mine");
      endGame(false);
    } else {
      revealedCount++;
      if (cell.adjacent > 0) {
        cell.el.textContent = cell.adjacent;
      } else {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) reveal(nr, nc);
          }
        }
      }
    }
  }

  function checkWin() {
    if (revealedCount === rows * cols - mineCount) endGame(true);
  }

  function endGame(won) {
    gameOver = true;
    board.flat().forEach(cell => {
      if (cell.isMine && !cell.revealed) {
        cell.el.textContent = "💣";
        cell.el.classList.add("mine");
      }
    });
    setTimeout(() => alert(won ? "🎉 You win!" : "💥 Game over"), 200);
  }

  triggerBtn.addEventListener("click", () => {
    gameContainer.style.display = "block";
    createBoard();
  });

  closeBtn.addEventListener("click", () => {
    gameContainer.style.display = "none";
  });
});
