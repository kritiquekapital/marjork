import { track } from './analytics.js';

const photoButton = document.querySelector(".photo");

const CLASSIC_ROLL = {
  folder: "roll_03",
  files: [
    "roll_03_(11).jpg",
    "roll_03_(12).jpg",
    "roll_03_(13).jpg",
    "roll_03_(15).jpg",
    "roll_03_(17).jpg",
    "roll_03_(21).jpg",
    "roll_03_(22).jpg",
    "roll_03_(23).jpg",
    "roll_03_(24).jpg",
    "roll_03_(25).jpg",
    "roll_03_(28).jpg",
    "roll_03_(30).jpg",
    "roll_03_(31).jpg",
    "roll_03_(33).jpg"
  ]
};

const PLACEHOLDER_ROLL = {
  folder: "DUDEHELLOCAMERON",
  files: [
    "DUDEHELLOCAMERON.jpg",
    "quandry-01.jpg",
    "quandry-02.jpg",
    "quandry-03.jpg",
    "quandry-04.jpg",
    "quandry-05.jpg",
    "quandry-06.jpg",
    "quandry-07.jpg",
    "quandry-08.jpg",
    "quandry-09.jpg",
    "quandry-10.jpg"
  ]
};

const DISTORT_ROLL = {
  folder: "DISTORT_ROLL",
  files: [
    "blindingportal.jpg",
    "branchesinthedark.jpg",
    "gheist.jpg",
    "ideeeeek.jpg",
    "lightsonthewater.jpg",
    "PIKED.jpg",
    "twice.jpg"
  ]
};

const FRENCHRAIN_ROLL = {
  folder: "frenchrain",
  files: [
    "cordes en boyaux.png",
    "brella.png",
    "crowdd.png",
    "net.png",
    "range.png",
    "tarp.png"
  ]
};

const THEME_MAP = {
  classic: CLASSIC_ROLL,
  retro: DUDEHELLOCAMERON,
  art: DUDEHELLOCAMERON_ROLL,
  modern: PLACEHOLDER_ROLL,
  nature: PLACEHOLDER_ROLL,
  lofi: PLACEHOLDER_ROLL,
  space: DISTORT_ROLL,
  rain: FRENCHRAIN_ROLL,
  logistics: PLACEHOLDER_ROLL
};

const themeIndexes = {};

function getCurrentThemeName() {
  const themeClass = [...document.body.classList].find(c => c.startsWith("theme-"));
  return themeClass ? themeClass.replace("theme-", "") : "classic";
}

function getThemeRoll() {
  const theme = getCurrentThemeName();
  return THEME_MAP[theme] || CLASSIC_ROLL;
}

function getCurrentThemeIndex() {
  const theme = getCurrentThemeName();
  if (!(theme in themeIndexes)) themeIndexes[theme] = 0;
  return themeIndexes[theme];
}

function getImageURL() {
  const roll = getThemeRoll();

  if (!roll.files.length) return null;

  const index = getCurrentThemeIndex();
  const file = roll.files[index];

  return `https://raw.githubusercontent.com/kritiquekapital/marjork/main/suprises/${roll.folder}/${file}`;
}

function advanceIndex() {
  const theme = getCurrentThemeName();
  const roll = getThemeRoll();

  themeIndexes[theme] = (getCurrentThemeIndex() + 1) % roll.files.length;
}

function createFloatingImage(src) {
  const img = document.createElement("img");

  img.src = src;
  img.style.position = "fixed";
  img.style.width = "150px";
  img.style.pointerEvents = "none";
  img.style.transition = "all 8s linear";
  img.style.zIndex = "1000";
  img.style.border = "2px solid black";

  const maxX = window.innerWidth - 150;
  const maxY = window.innerHeight - 150;

  img.style.left = Math.random() * maxX + "px";
  img.style.top = Math.random() * maxY + "px";

  document.body.appendChild(img);

  requestAnimationFrame(() => {
    img.style.left = Math.random() * maxX + "px";
    img.style.top = Math.random() * maxY + "px";
    img.style.opacity = "0";
    img.style.transform = "scale(2)";
  });

  setTimeout(() => img.remove(), 8000);
}

if (photoButton) {
  photoButton.addEventListener("click", (e) => {
    e.preventDefault();

    const theme = getCurrentThemeName();
    const roll = getThemeRoll();
    const index = getCurrentThemeIndex();
    const file = roll.files[index];
    const url = getImageURL();

    if (!url) return;

    createFloatingImage(url);

    track("photo_click", {
      theme,
      file
    });

    advanceIndex();
  });
}
