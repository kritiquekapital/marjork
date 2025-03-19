const imageList = [
  "roll_03_01.jpg",
  // Add other image names
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