const photoButton = document.querySelector(".photo");

const CLASSIC_ROLL = {
  folder: "roll_03",
  files: [
    "roll_03_01.jpg",
    "roll_03_(02).jpg",
    "roll_03_(03).jpg",
    "roll_03_(04).jpg",
    "roll_03_(05).jpg",
    "roll_03_(06).jpg",
    "roll_03_(07).jpg",
    "roll_03_(08).jpg",
    "roll_03_(09).jpg",
    "roll_03_(10).jpg",
    "roll_03_(11).jpg",
    "roll_03_(12).jpg",
    "roll_03_(13).jpg",
    "roll_03_(14).jpg",
    "roll_03_(15).jpg",
    "roll_03_(16).jpg",
    "roll_03_(17).jpg",
    "roll_03_(18).jpg",
    "roll_03_(19).jpg",
    "roll_03_(20).jpg",
    "roll_03_(21).jpg",
    "roll_03_(22).jpg",
    "roll_03_(23).jpg",
    "roll_03_(24).jpg",
    "roll_03_(25).jpg",
    "roll_03_(26).jpg",
    "roll_03_(27).jpg",
    "roll_03_(28).jpg",
    "roll_03_(29).jpg",
    "roll_03_(30).jpg",
    "roll_03_(31).jpg",
    "roll_03_(32).jpg",
    "roll_03_(33).jpg"
  ]
};

const PLACEHOLDER_ROLL = {
  folder: "DUDEHELLOCAMERON",
  files: [
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

const THEME_MAP = {
  classic: CLASSIC_ROLL,
  retro: PLACEHOLDER_ROLL,
  art: PLACEHOLDER_ROLL,
  modern: PLACEHOLDER_ROLL,
  nature: PLACEHOLDER_ROLL,
  lofi: PLACEHOLDER_ROLL,
  space: PLACEHOLDER_ROLL,
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

function getImageURL() {
  const theme = getCurrentThemeName();
  const roll = getThemeRoll();

  if (!roll.files.length) return null;

  if (!(theme in themeIndexes)) themeIndexes[theme] = 0;

  const file = roll.files[themeIndexes[theme]];
  return `https://raw.githubusercontent.com/kritiquekapital/marjork/main/suprises/${roll.folder}/${file}`;
}

function advanceIndex() {
  const theme = getCurrentThemeName();
  const roll = getThemeRoll();

  themeIndexes[theme] = (themeIndexes[theme] + 1) % roll.files.length;
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

    const url = getImageURL();
    if (!url) return;

    createFloatingImage(url);
    advanceIndex();
  });
}
