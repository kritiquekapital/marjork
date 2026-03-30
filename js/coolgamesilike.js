import { track } from './analytics.js';

const gamesILike = [
  {
    id: "colorguesser",
    title: "colorguesser",
    url: "https://colorguesser.com/",
    desc: "color of the day",
    image: "css/pic/gamesilike/COLOR.png"
  },
  {
    id: "songless",
    title: "songless",
    url: "https://lessgames.com/songless",
    desc: "song of the day",
    image: "css/pic/gamesilike/SONGLESS.png"
  },
  {
    id: "tradle",
    title: "tradle",
    url: "https://games.oec.world/en/tradle/",
    desc: "trade of the day",
    image: "css/pic/gamesilike/TRADLE.png"
  },
  {
    id: "framed",
    title: "framed",
    url: "https://framed.wtf/",
    desc: "movie of the day",
    image: "css/pic/gamesilike/FRAMED.png"
  },
  {
    id: "immaculate-grid",
    title: "immaculate grid",
    url: "https://www.sports-reference.com/immaculate-grid/",
    desc: "sports grid of the day",
    image: "css/pic/gamesilike/IMAG.png"
  },
  {
    id: "openguessr",
    title: "openguessr",
    url: "https://openguessr.com/",
    desc: "location of the day",
    image: "css/pic/gamesilike/GEO.png"
  },
  {
    id: "foodguessr",
    title: "foodguessr",
    url: "https://www.foodguessr.com/game/daily",
    desc: "food of the day",
    image: "css/pic/gamesilike/FOOD.png"
  },
  {
    id: "guess-the-game",
    title: "guess the game",
    url: "https://guessthe.game/",
    desc: "game of the day",
    image: "css/pic/gamesilike/GAME.png"
  },
  {
    id: "guess-the-book",
    title: "guess the book",
    url: "https://guessthebook.app/",
    desc: "book of the day",
    image: "css/pic/gamesilike/BOOK.png"
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
          <div class="game-case-details-desc">${game.desc}</div>
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
      
      card.addEventListener("click", () => {
        track("games_shelf_game_click", {
        game: game.id,
        title: game.title
      });
    });
      
      shelfRow.appendChild(card);
    });

    setActiveGame(activeGameId);
  }

  function openShelf() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    track("games_shelf_open");
  }

  function closeShelf() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    track("games_shelf_close");
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
