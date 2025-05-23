document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("minesweeper-game");
  const gridElement = document.getElementById("minesweeper-grid");
  const closeButton = document.getElementById("close-minesweeper");
  const secretButton = document.querySelector(".secret-button");

  const API_BASE = "https://minesweeper-zeta-eight.vercel.app";

  const difficulties = {
    easy: { cols: 10, rows: 8, mines: 10 },
    medium: { cols: 12, rows: 14, mines: 33 },
    hard: { cols: 14, rows: 18, mines: 69 },
  };

  let currentDifficulty = "easy";
  let currentStat = "time";
  let board = [];
  let firstClick = true;
  let gameOver = false;
  let startTime = null;
  let timerInterval = null;

  let username = localStorage.getItem("minesweeperUsername") || "";
  let bestTimes = JSON.parse(localStorage.getItem("minesweeperBestTimes") || '{}');

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.maxLength = 6;
  usernameInput.placeholder = "Name";
  usernameInput.value = username;
  usernameInput.classList.add("minesweeper-username");
  usernameInput.addEventListener("input", () => {
    username = usernameInput.value;
    localStorage.setItem("minesweeperUsername", username);
  });

  const leaderboardBtn = document.querySelector(".fullscreen-button");
  if (leaderboardBtn) leaderboardBtn.textContent = "🏆";

  let leaderboardOpen = false;
  const leaderboardPanel = document.createElement("div");
  leaderboardPanel.id = "leaderboard";
  leaderboardPanel.className = "leaderboard-panel";
  leaderboardPanel.style.display = "none";
  gameContainer.appendChild(leaderboardPanel);

  leaderboardBtn?.addEventListener("click", () => {
    leaderboardOpen = !leaderboardOpen;
    leaderboardPanel.style.display = leaderboardOpen ? "block" : "none";
    gridElement.style.display = leaderboardOpen ? "none" : "grid";
    if (leaderboardOpen) fetchLeaderboard();
  });

  async function fetchLeaderboard() {
    try {
      const diffQuery = currentStat === "time" ? `&difficulty=${currentDifficulty}` : "";
      const res = await fetch(`${API_BASE}/api/minesweeper/leaderboard?sort=${currentStat}${diffQuery}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid leaderboard response");

      if (currentStat === "wins" || currentStat === "booms") {
        data.sort((a, b) => {
          const aVal = currentStat === "wins" ? (a[currentDifficulty] ?? 0) : (a.totalBooms ?? 0);
          const bVal = currentStat === "wins" ? (b[currentDifficulty] ?? 0) : (b.totalBooms ?? 0);
          return bVal - aVal;
        });
      }

      leaderboardPanel.innerHTML = `
        <div class="leaderboard-header">
          <div class="leaderboard-modes">
            <button class="mode-btn" data-diff="easy">Easy</button>
            <button class="mode-btn" data-diff="medium">Medium</button>
            <button class="mode-btn" data-diff="hard">Hard</button>
          </div>
          <div class="leaderboard-sorts">
            <button class="sort-btn" data-sort="time">⌛ Time</button>
            <button class="sort-btn" data-sort="wins">🏆 Wins</button>
            <button class="sort-btn" data-sort="booms">💥 Booms</button>
          </div>
        </div>
        <ol class="leaderboard-list">
          ${data.length > 0
            ? data.map(entry => {
                let value;
                  if (currentStat === "time") {
                    const timeValue = entry.bestTimes?.[currentDifficulty];
                    value = timeValue != null
                      ? formatElapsed(timeValue)
                       : "--:--.---";
                  } else if (currentStat === "wins") {
                    value = `${entry[currentDifficulty] ?? 0} 🏆`;
                  } else {
                    value = `${entry.totalBooms ?? 0} 💥`;
                  }
                return `<li><span>${entry.username}</span><span class="score-value">${value}</span></li>`;
              }).join("")
            : "<li>No entries yet</li>"}
        </ol>
        <div style="display: flex; justify-content: center; margin-top: 1rem;">
          <button class="sort-btn back-button">Back</button>
        </div>
      `;

      leaderboardPanel.querySelectorAll(".mode-btn").forEach(btn => {
        const isBooms = currentStat === "booms";
        btn.classList.toggle("active", isBooms || btn.dataset.diff === currentDifficulty);
        btn.onclick = () => {
          currentDifficulty = btn.dataset.diff;
          fetchLeaderboard();
        };
      });

      leaderboardPanel.querySelectorAll(".sort-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.sort === currentStat);
        btn.onclick = () => {
          currentStat = btn.dataset.sort;
          fetchLeaderboard();
        };
      });

      leaderboardPanel.querySelector(".back-button").addEventListener("click", () => {
        leaderboardOpen = false;
        leaderboardPanel.style.display = "none";
        gridElement.style.display = "grid";
      });
    } catch (e) {
      console.error("Leaderboard fetch failed:", e);
    }
  }

  let currentHintTile = null;
  let hintTimeout;

  function scheduleHintAfterMove() {
    clearTimeout(hintTimeout);

    let waitTime = 4000;
    if (currentDifficulty === "medium") waitTime = 5000;
    else if (currentDifficulty === "hard") waitTime = 8000;

    hintTimeout = setTimeout(() => {
      if (gameOver || firstClick) return;
      highlightSafeTile();
    }, waitTime);
  }

  function highlightSafeTile() {
    // Only highlight a new one if there’s no active hint or it was clicked
    if (currentHintTile && !currentHintTile.revealed) return;

    const revealedSafeTiles = board.flat().filter(tile => tile.revealed && !tile.mine);
    const guessable = new Set();

    revealedSafeTiles.forEach(tile => {
      getNeighbors(tile.x, tile.y).forEach(neighbor => {
        if (!neighbor.revealed && !neighbor.flagged && !neighbor.mine) {
          guessable.add(neighbor);
        }
      });
    });

    if (guessable.size === 0) return;

    const guessableArray = Array.from(guessable);
    const tile = guessableArray[Math.floor(Math.random() * guessableArray.length)];

    // Clear previous if any
    if (currentHintTile) currentHintTile.el.classList.remove("glow-hint");

    tile.el.classList.add("glow-hint");
    currentHintTile = tile;
  }
  
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
  statsDisplay.appendChild(usernameInput);
  gameContainer.appendChild(statsDisplay);

  function formatElapsed(ms) {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const millis = String(ms % 1000).padStart(3, "0");
    return `${minutes}:${seconds}.${millis}`;
  }

  function updateTimerDisplay() {
    if (!startTime) {
      timerDisplay.textContent = "⏳ 00:00.000";
      return;
    }
    const elapsed = Date.now() - startTime;
    timerDisplay.textContent = `⏳ ${formatElapsed(elapsed)}`;
  }

  async function updateBestTime() {
    if (!username || !currentDifficulty) {
      bestTimeDisplay.textContent = `🕒 Best: --:--.---`;
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/minesweeper/fetch_best?username=${username}`);
      const data = await res.json();
      if (!data.success || !data.record) {
        bestTimeDisplay.textContent = `🕒 Best: --:--.---`;
        return;
      }

      const bestTime = data.record[`${currentDifficulty}_time`];
      bestTimeDisplay.textContent = bestTime != null
        ? `🕒 Best: ${formatElapsed(bestTime)}`
        : `🕒 Best: --:--.---`;
    } catch (err) {
      console.error("Failed to fetch best time:", err);
      bestTimeDisplay.textContent = `🕒 Best: --:--.---`;
    }
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
      submitScore({ username, time: elapsed, difficulty: currentDifficulty, booms: 0 });
    } else {
      submitScore({ username, time: null, difficulty: currentDifficulty, booms: 1 });
    }

    updateBestTime(); // optional: local display
  }


  function generateGrid() {
    gridElement.innerHTML = "";
    board = [];
    firstClick = true;
    gameOver = false;
    stopTimer();

    const { cols, rows } = difficulties[currentDifficulty];
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridElement.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    currentHintTile = null;
    clearTimeout(hintTimeout);

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

    updateTimerDisplay();
    updateBestTime();
  }

  function placeMines(safeX, safeY) {
    const { cols, rows, mines } = difficulties[currentDifficulty];
    let placed = 0;

    // Define safe radius based on difficulty
    const safeRadius = currentDifficulty === "hard" ? 3 : currentDifficulty === "medium" ? 2 : 1;

    while (placed < mines) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      const distX = Math.abs(x - safeX);
      const distY = Math.abs(y - safeY);
      if (board[y][x].mine || (distX <= safeRadius && distY <= safeRadius)) continue;
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

  function toggleFlag(x, y) {
    if (gameOver) return;
    const tile = board[y][x];
    if (tile.revealed) return;
    tile.flagged = !tile.flagged;
    tile.el.textContent = tile.flagged ? "🫥" : "";

    scheduleHintAfterMove(); // ✅ added here

    if (currentHintTile === board[y][x]) {
      currentHintTile.el.classList.remove("glow-hint");
      currentHintTile = null;
    }
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
    return board.flat().every(tile => tile.revealed || tile.mine);
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

    if (currentHintTile === board[y][x]) {
      currentHintTile.el.classList.remove("glow-hint");
      currentHintTile = null;
    }

    revealTile(x, y);

    if (tile.mine) {
      tile.el.classList.add("mine");
      tile.el.textContent = "💥";
      gameOver = true;
      stopTimer(false);
      revealAllAnimated();
    } else if (checkWin()) {
      gameOver = true;
      stopTimer(true);
      playWinAnimation();
    }

    scheduleHintAfterMove(); // ✅ added here
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
      step++;
      if (step >= totalSteps) clearInterval(interval);
    }, 100);
  }

  async function submitScore({ username, time, difficulty, booms }) {
    if (!username || !difficulty || typeof booms !== "number") {
    console.error("Missing fields in submitScore:", { username, time, difficulty, booms });
    return;
  }

    try {
      const res = await fetch(`${API_BASE}/api/minesweeper/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, time, difficulty, booms })
      });
      const result = await res.json();
      if (!result.success) {
        console.error("Score submit error:", result.error);
      } else {
        console.log("Score submitted");
      }
    } catch (e) {
      console.error("Submit failed:", e);
    }
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

  if (secretButton) secretButton.addEventListener("click", openGame);
  if (closeButton) closeButton.addEventListener("click", () => {
    gameContainer.style.display = "none";
    document.removeEventListener("contextmenu", preventContextMenu);
  });

  const newGameBtn = document.querySelector(".new-game-button");
  newGameBtn?.addEventListener("click", generateGrid);

  const difficultySelect = document.querySelector(".difficulty-select");
  difficultySelect?.addEventListener("change", (e) => {
    currentDifficulty = e.target.value;
    generateGrid();
  });

  generateGrid();
});
