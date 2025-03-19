const imageList = [
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
];

let currentIndex = 0;
const photoButton = document.querySelector(".photo");
const imageFolderURL = "https://raw.githubusercontent.com/kritiquekapital/marjork/main/suprises/roll_03/";

function createFloatingImage(imageURL) {
  const img = document.createElement("img");
  img.src = imageURL;
  img.crossOrigin = "anonymous";
  img.style.position = "fixed";
  img.style.width = "150px";
  img.style.height = "auto";
  img.style.opacity = "1";
  img.style.pointerEvents = "none";
  img.style.transition = "left 8s linear, top 8s linear, opacity 8s ease-out, transform 8s ease-out";
  img.style.zIndex = "1000";
  img.style.border = "2px solid black";
  img.style.boxSizing = "border-box";

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const maxX = viewportWidth - 150;
  const maxY = viewportHeight - 150;
  const startX = Math.random() * maxX;
  const startY = Math.random() * maxY;

  img.style.left = `${startX}px`;
  img.style.top = `${startY}px`;

  document.body.appendChild(img);

  img.onload = () => {
    moveImage();
  };

  img.onerror = () => {
    console.error("Failed to load image:", imageURL);
  };

  setTimeout(() => {
    img.remove();
  }, 8000);
}

photoButton.addEventListener("click", (event) => {
  event.preventDefault();
  const imageURL = imageFolderURL + imageList[currentIndex];
  createFloatingImage(imageURL);
  currentIndex = (currentIndex + 1) % imageList.length;
});
