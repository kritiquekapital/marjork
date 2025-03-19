const vinylLink = document.querySelector(".vinyl-link");
const liveLinks2 = [
  "https://www.youtube.com/watch?v=6riDJMI-Y8U",
  // Add other vinyl links
];

let currentLinkIndex2 = 0;

if (vinylLink) {
  vinylLink.addEventListener("click", (event) => {
    event.preventDefault();
    const newTab = window.open(liveLinks2[currentLinkIndex2], "_blank");
    if (newTab) newTab.blur();
    currentLinkIndex2 = (currentLinkIndex2 + 1) % liveLinks2.length;
  });
}

const vinylButton = document.querySelector(".vinyl");
const arm = document.querySelector(".vinyl .arm");

if (vinylButton && arm) {
  vinylButton.addEventListener("mouseover", () => {
    arm.style.transition = "transform 0.2s";
    arm.style.transform = "rotate(290deg)";

    setTimeout(() => {
      arm.style.transition = "transform 5s ease-out";
      arm.style.transform = "rotate(322deg)";
    }, 200);
  });

  vinylButton.addEventListener("mouseleave", () => {
    arm.style.transition = "transform 0.5s ease-in";
    arm.style.transform = "rotate(270deg)";
  });
}