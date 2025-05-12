document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("minesweeper-game");
  const gridElement = document.getElementById("minesweeper-grid");
  const closeButton = document.getElementById("close-minesweeper");
  const secretButton = document.querySelector(".secret-button");

  // Username setup
  let username = localStorage.getItem("minesweeperUsername") || "";
  let currentDifficulty = "easy";
  let board = [];
  let firstClick = true;
  let gameOver = false;
  let startTime = null;
  let timerInterval = null;

  const difficulties = {
    easy: { cols: 10, rows: 8, mines: 10 },
    medium: { cols: 12, rows: 14, mines: 35 },
    hard: { cols: 14, rows: 18, mines: 90 },
  };

  const winCounts = {
    easy: parseInt(localStorage.getItem("easyWins")) || 0,
    medium: parseInt(localStorage.getItem("mediumWins")) || 0,
    hard: parseInt(localStorage.getItem("hardWins")) || 0,
  };

  let totalBooms = parseInt(localStorage.getItem("minesweeperTotalBooms")) || 0;
  let bestTimes = JSON.parse(localStorage.getItem("minesweeperBestTimes") || '{}');

  const infoContainer = document.createElement("div");
  infoContainer.className = "minesweeper-info";

  const timerDisplay = document.createElement("div");
  timerDisplay.className = "minesweeper-timer";
  timerDisplay.textContent = "⏳ 00:00.000";

  const bestTimeDisplay = document.createElement("div");
  bestTimeDisplay.className = "minesweeper-best-time";
  bestTimeDisplay.textContent = "🕒 Best: --:--.---";

  infoContainer.appendChild(timerDisplay);
  infoContainer.appendChild(bestTimeDisplay);
  gameContainer.appendChild(infoContainer);

  const statsDisplay = document.createElement("div");
  statsDisplay.className = "minesweeper-stats";
  gameContainer.appendChild(statsDisplay);

  const leaderboardContainer = document.createElement("div");
  leaderboardContainer.id = "leaderboard";
  leaderboardContainer.className = "leaderboard hidden";
  gameContainer.appendChild(leaderboardContainer);

  function formatElapsed(ms) {
    const m = String(Math.floor(ms / 60000)).padStart(2, "0");
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const msStr = String(ms % 1000).padStart(3, "0");
    return `${m}:${s}.${msStr}`;
  }

  async function submitScore(time, difficulty) {
    if (!username || username.length === 0) return;
    try {
      const res = await fetch("/api/minesweeper/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, time, difficulty })
      });
      const result = await res.json();
      if (!result.success) console.error("Score submit error:", result.error);
    } catch (e) {
      console.error("Submit failed:", e);
    }
  }

  async function fetchLeaderboard() {
    try {
      const res = await fetch(`/api/minesweeper/leaderboard?difficulty=${currentDifficulty}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid leaderboard");

      leaderboardContainer.innerHTML = `
        <h3>Leaderboard (${currentDifficulty})</h3>
        <ol>${data.map(e => `<li>${e.username}: ${formatElapsed(e.time)}</li>`).join("")}</ol>
      `;
    } catch (e) {
      leaderboardContainer.innerHTML = `<p>Failed to load leaderboard.</p>`;
    }
  }

  function updateStats() {
    const label = currentDifficulty[0].toUpperCase() + currentDifficulty.slice(1);
    statsDisplay.innerHTML = `
      <div class="wins">🏆 ${label} Wins: ${winCounts[currentDifficulty]}</div>
      <div class="booms">💥 Total Booms: ${totalBooms}</div>
      <input class="minesweeper-username" type="text" maxlength="6" placeholder="Name" value="${username}">
    `;
    const nameField = statsDisplay.querySelector(".minesweeper-username");
    nameField.addEventListener("input", () => {
      username = nameField.value;
      localStorage.setItem("minesweeperUsername", username);
    });
  }

  function updateTimerDisplay() {
    if (!startTime) {
      timerDisplay.textContent = "⏳ 00:00.000";
      return;
    }
    timerDisplay.textContent = `⏳ ${formatElapsed(Date.now() - startTime)}`;
  }

  function updateBestTime() {
    const best = bestTimes[currentDifficulty];
    bestTimeDisplay.textContent = best ? `🕒 Best: ${formatElapsed(best)}` : `🕒 Best: --:--.---`;
  }

  function startTimer() {
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimerDisplay, 100);
  }

  function stopTimer(won = false) {
    clearInterval(timerInterval);
    const elapsed = Date.now() - startTime;
    updateTimerDisplay();
    startTime = null;

    if (won) {
      winCounts[currentDifficulty]++;
      localStorage.setItem(`${currentDifficulty}Wins`, winCounts[currentDifficulty]);

      if (!bestTimes[currentDifficulty] || elapsed < bestTimes[currentDifficulty]) {
        bestTimes[currentDifficulty] = elapsed;
        localStorage.setItem("minesweeperBestTimes", JSON.stringify(bestTimes));
      }

      submitScore(elapsed, currentDifficulty);
      fetchLeaderboard();
      playWinAnimation();
    }

    updateStats();
    updateBestTime();
  }

  function generateGrid() {
    gridElement.innerHTML = "";
    board = [];
    firstClick = true;
    gameOver = false;
    stopTimer();
    leaderboardContainer.classList.add("hidden");

    const { cols, rows } = difficulties[currentDifficulty];
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridElement.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    gameContainer.setAttribute("data-difficulty", currentDifficulty);

    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < cols; x++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.x = x;
        tile.dataset.y = y;

        tile.addEventListener("click", () => handleClick(x, y));
        tile.addEventListener("contextmenu", e => {
          e.preventDefault();
          toggleFlag(x, y);
        });

        tile.addEventListener("touchstart", e => {
          tile._touchTimer = setTimeout(() => toggleFlag(x, y), 500);
        });
        tile.addEventListener("touchend", () => clearTimeout(tile._touchTimer));

        row.push({ x, y, el: tile, mine: false, revealed: false, flagged: false, count: 0 });
        gridElement.appendChild(tile);
      }
      board.push(row);
    }

    if (window.innerWidth <= 768 && gameContainer.classList.contains("mobile-fullscreen")) {
      requestAnimationFrame(() => {
        const header = document.querySelector('.minesweeper-header');
        const info = document.querySelector('.minesweeper-info');
        const stats = document.querySelector('.minesweeper-stats');

        const hH = header?.offsetHeight || 0;
        const iH = info?.offsetHeight || 0;
        const sH = stats?.offsetHeight || 0;

        const availableH = window.innerHeight - hH - iH - sH - 32;
        const availableW = window.innerWidth - 24;

        const tileSize = Math.min(
          Math.floor(availableH / rows),
          Math.floor(availableW / cols)
        );

        gridElement.querySelectorAll(".tile").forEach(tile => {
          tile.style.height = `${tileSize}px`;
          tile.style.width = `${tileSize}px`;
        });
      });
    }

    updateStats();
    updateTimerDisplay();
    updateBestTime();
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
      startTimer();
    }

    revealTile(x, y);

    if (tile.mine) {
      tile.el.classList.add("mine");
      tile.el.textContent = "💥";
      gameOver = true;
      totalBooms++;
      localStorage.setItem("minesweeperTotalBooms", totalBooms);
      stopTimer(false);
      revealAllAnimated();
    } else if (checkWin()) {
      gameOver = true;
      stopTimer(true);
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
    tile.el.classList.add("revealed", "pulse");

    if (tile.mine) tile.el.textContent = "💣";
    else if (tile.count > 0) tile.el.textContent = tile.count;
    else getNeighbors(x, y).forEach(n => revealTile(n.x, n.y));
  }

  function checkWin() {
    return board.flat().every(tile => tile.mine || tile.revealed);
  }

  function revealAllAnimated() {
    const mines = board.flat().filter(tile => tile.mine && !tile.revealed);
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
        if (dx || dy) {
          const nx = x + dx, ny = y + dy;
          if (board[ny]?.[nx]) neighbors.push(board[ny][nx]);
        }
      }
    }
    return neighbors;
  }

  function playWinAnimation() {
    const colors = [
      "linear-gradient(45deg, red, orange)",
      "linear-gradient(45deg, orange, yellow)",
      "linear-gradient(45deg, yellow, green)",
      "linear-gradient(45deg, green, cyan)",
      "linear-gradient(45deg, cyan, blue)",
      "linear-gradient(45deg, blue, violet)",
      "linear-gradient(45deg, violet, pink)"
    ];
    let step = 0;
    const cols = board[0].length;
    const rows = board.length;
    const totalSteps = cols * 6;

    const interval = setInterval(() => {
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const tile = board[y][x];
          if (tile.revealed && !tile.mine) {
            const colorIndex = (step + x + y) % colors.length;
            tile.el.style.backgroundImage = colors[colorIndex];
            tile.el.style.color = "#fff";
          }
        }
      }
      if (++step >= totalSteps) clearInterval(interval);
    }, 100);
  }

  function preventContextMenu(e) {
    if (e.target.closest(".tile")) e.preventDefault();
  }

  function openGame() {
    gameContainer.style.display = "block";
    gameContainer.style.left = "50%";
    gameContainer.style.top = "50%";
    gameContainer.style.transform = "translate(-50%, -50%)";
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

  document.querySelector(".fullscreen-button")?.addEventListener("click", () => {
    const isLeaderboard = leaderboardContainer.classList.toggle("hidden") === false;
    gameContainer.classList.toggle("mobile-fullscreen", isLeaderboard);
    if (isLeaderboard) fetchLeaderboard();
    else generateGrid();
  });

  createDropdown();
  generateGrid();
});
