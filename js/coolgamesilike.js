const gamesILike = [
  {
    id: "colorguesser",
    title: "colorguesser",
    url: "https://colorguesser.com/",
    desc: "color of the day",
    image: "/marjork/css/pic/Vibrant Color Fiesta - Pane.png"
  },
  {
    id: "songless",
    title: "songless",
    url: "https://lessgames.com/songless",
    desc: "song of the day",
    image: "/marjork/css/pic/Songless.png"
  },
  {
    id: "tradle",
    title: "tradle",
    url: "https://games.oec.world/en/tradle/",
    desc: "international trade of the day",
    image: "/marjork/css/pic/TRADLE.png"
  },
  {
    id: "framed",
    title: "framed",
    url: "https://framed.wtf/",
    desc: "movie of the day",
    image: "/marjork/css/pic/FRAMED.png"
  },
  {
    id: "immaculate-grid",
    title: "immaculate grid",
    url: "https://www.sports-reference.com/immaculate-grid/",
    desc: "sports grid of the day",
    image: "/marjork/css/pic/ImaGrid.png"
  },
  {
    id: "gamedefault-2",
    title: "game six",
    url: "#",
    desc: "add later",
    image: "/marjork/css/pic/game-six.jpg"
  },
  {
    id: "gamedefault-3",
    title: "game seven",
    url: "#",
    desc: "add later",
    image: "/marjork/css/pic/game-seven.jpg"
  },
  {
    id: "gamedefault-4",
    title: "game eight",
    url: "#",
    desc: "add later",
    image: "/marjork/css/pic/game-eight.jpg"
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("games-like-button");
  const overlay = document.getElementById("gamesShelfOverlay");
  const closeButton = document.getElementById("closeGamesShelf");
  const shelfRow = document.getElementById("gamesShelfRow");

  if (!openButton || !overlay || !closeButton || !shelfRow) {
    console.warn("Games shelf elements missing.");
    return;
  }

  let activeGameId = gamesILike[0]?.id || null;

  function setActiveGame(gameId) {
    activeGameId = gameId;

    shelfRow.querySelectorAll(".game-case").forEach((card) => {
      const isActive = card.dataset.game === activeGameId;
      card.classList.toggle("is-active", isActive);
      card.classList.toggle("game-case-featured", isActive);
      card.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function renderGames() {
    shelfRow.innerHTML = "";

    gamesILike.forEach((game) => {
      const card = document.createElement("a");
      card.className = "game-case";
      card.dataset.game = game.id;
      card.href = game.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `${game.title} — ${game.desc}`);

      card.innerHTML = `
        <div
          class="game-case-bg"
          style="background-image: url('${game.image}');"
        ></div>

        <div class="game-case-cover">
          <div class="game-case-spine">
            <span class="game-case-title">${game.title}</span>
          </div>
        </div>

        <div class="game-case-details">
          <div class="game-case-details-inner">
            <div class="game-case-details-title">${game.title}</div>
            <div class="game-case-details-desc">${game.desc}</div>
          </div>
        </div>
      `;

      card.addEventListener("mouseenter", () => {
        setActiveGame(game.id);
      });

      card.addEventListener("focus", () => {
        setActiveGame(game.id);
      });

      card.addEventListener(
        "touchstart",
        () => {
          setActiveGame(game.id);
        },
        { passive: true }
      );

      shelfRow.appendChild(card);
    });

    setActiveGame(activeGameId);
  }

  function openShelf() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeShelf() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  renderGames();

  openButton.addEventListener("click", openShelf);
  closeButton.addEventListener("click", closeShelf);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeShelf();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeShelf();
    }
  });
});
