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
    id: "immaculate grid",
    title: "immaculate grid",
    url: "https://www.sports-reference.com/immaculate-grid/",
    desc: "ball knower of the day",
    image: "css/pic/game-five.jpg"
  },
  {
    id: "gamedefault-2",
    title: "game six",
    url: "#",
    desc: "add later",
    image: "css/pic/game-six.jpg"
  },
  {
    id: "gamedefault-3",
    title: "game seven",
    url: "#",
    desc: "add later",
    image: "css/pic/game-seven.jpg"
  },
  {
    id: "gamedefault-4",
    title: "game eight",
    url: "#",
    desc: "add later",
    image: "css/pic/game-eight.jpg"
  },
  {
    id: "gamedefault-5",
    title: "game nine",
    url: "#",
    desc: "add later",
    image: "css/pic/game-nine.jpg"
  },
  {
    id: "gamedefault-6",
    title: "game ten",
    url: "#",
    desc: "add later",
    image: "css/pic/game-ten.jpg"
  }
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

  function renderGames() {
    shelfRow.innerHTML = "";

    gamesILike.forEach((game) => {
      const card = document.createElement("a");
      card.className = "game-case";
      card.dataset.game = game.id;
      card.href = game.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", game.title);
      card.style.setProperty("--game-bg", `url("${game.image}")`);

      card.innerHTML = `
        <div class="game-case-inner">
          <div class="game-case-spine">
            <span class="game-case-title">${game.title}</span>
          </div>
        </div>
      `;

      card.addEventListener(
        "touchstart",
        () => {
          shelfRow.querySelectorAll(".game-case.is-active").forEach((el) => {
            if (el !== card) el.classList.remove("is-active");
          });
          card.classList.add("is-active");
        },
        { passive: true }
      );

      card.addEventListener(
        "touchend",
        () => {
          setTimeout(() => card.classList.remove("is-active"), 180);
        },
        { passive: true }
      );

      shelfRow.appendChild(card);
    });
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
