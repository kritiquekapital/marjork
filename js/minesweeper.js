document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("minesweeper-game");
  const gridElement = document.getElementById("minesweeper-grid");
  const closeButton = document.getElementById("close-minesweeper");
  const secretButton = document.querySelector(".secret-button");

  // Username setup
  let username = localStorage.getItem("minesweeperUsername") || "";
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
  const gridWrapper = document.querySelector(".grid-container");
  if (gridWrapper) gridWrapper.appendChild(usernameInput);

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
      const res = await fetch("/api/minesweeper/leaderboard?difficulty=" + currentDifficulty);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid leaderboard response");

      const board = document.getElementById("leaderboard") || document.createElement("div");
      board.id = "leaderboard";
      board.className = "leaderboard";
      board.innerHTML = `<h3>Leaderboard (${currentDifficulty})</h3><ol>` +
        data.map(entry => `<li>${entry.username}: ${formatElapsed(entry.time)}</li>`).join("") +
        `</ol>`;

      if (!document.body.contains(board)) document.body.appendChild(board);
    } catch (e) {
      console.error("Leaderboard fetch failed:", e);
    }
  }

  const difficulties = {
    easy: { cols: 10, rows: 8, mines: 10 },
    medium: { cols: 12, rows: 14, mines: 35 },
    hard: { cols: 14, rows: 18, mines: 90 },
  };

  let currentDifficulty = "easy";
  let board = [];
  let firstClick = true;
  let gameOver = false;

  let startTime = null;
  let timerInterval = null;

  let winCounts = {
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

  function formatElapsed(ms) {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const millis = String(ms % 1000).padStart(3, "0");
    return `${minutes}:${seconds}.${millis}`;
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

  function createDropdown() {
    const select = document.getElementById("difficulty-select");
    const newGameBtn = document.querySelector(".new-game-button");
    const fullscreenBtn = document.querySelector(".fullscreen-button");

    if (window.innerWidth > 768) fullscreenBtn.style.display = "none";

    select.addEventListener("change", () => {
      currentDifficulty = select.value;
      generateGrid();
      fetchLeaderboard();
    });

    newGameBtn.addEventListener("click", () => {
      generateGrid();
      fetchLeaderboard();
    });

    fullscreenBtn.addEventListener("click", () => {
      gameContainer.classList.toggle("mobile-fullscreen");
      generateGrid();
      fetchLeaderboard();
    });
  }

  function updateStats() {
    const label = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    statsDisplay.innerHTML = `
      <div class="wins">🏆 ${label} Wins: ${winCounts[currentDifficulty]}</div>
      <div class="booms">💥 Total Booms: ${totalBooms}</div>
    `;
  }

  function updateTimerDisplay() {
    if (!startTime) {
      timerDisplay.textContent = "⏳ 00:00.000";
      return;
    }
    const elapsed = Date.now() - startTime;
    timerDisplay.textContent = `⏳ ${formatElapsed(elapsed)}`;
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

  function preventContextMenu(e) {
    if (e.target.closest(".tile")) {
      e.preventDefault();
    }
  }

  if (secretButton) {
    secretButton.addEventListener("click", () => {
      gameContainer.style.display = "block";
      gameContainer.style.left = "50%";
      gameContainer.style.top = "50%";
      gameContainer.style.transform = "translate(-50%, -50%)";
      updateThemeClass();
      document.addEventListener("contextmenu", preventContextMenu);
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      gameContainer.style.display = "none";
      document.removeEventListener("contextmenu", preventContextMenu);
    });
  }

  createDropdown();
  generateGrid();
  fetchLeaderboard();
})
