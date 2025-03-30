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
