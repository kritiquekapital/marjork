export class Draggable {
  constructor(element) {
    if (!element) {
      throw new Error("Element is required to initialize Draggable.");
    }

    this.element = element;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.isReleased = false;
    this.animationFrame = null;
    this.isZeroGravity = false;

    // Ensure absolute positioning
    this.element.style.position = 'absolute';
    this.centerElementInViewport();

    // Initialize event listeners
    this.init();
  }

  centerElementInViewport() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const elementWidth = this.element.offsetWidth;
    const elementHeight = this.element.offsetHeight;

    const initialLeft = (viewportWidth - elementWidth) / 2;
    const initialTop = (viewportHeight - elementHeight) / 2;

    this.element.style.left = `${initialLeft}px`;
    this.element.style.top = `${initialTop}px`;
  }

  init() {
    this.element.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));
  }

  startDrag(e) {
    this.isDragging = true;
    this.isReleased = false;

    this.offset = {
      x: e.clientX - this.element.offsetLeft,
      y: e.clientY - this.element.offsetTop
    };

    cancelAnimationFrame(this.animationFrame);
  }

  drag(e) {
    if (!this.isDragging) return;

    const newX = this.element.offsetLeft + (e.clientX - this.offset.x - this.element.offsetLeft) * 0.5;
    const newY = this.element.offsetTop + (e.clientY - this.offset.y - this.element.offsetTop) * 0.5;

    this.velocity.x = (newX - this.element.offsetLeft) * 1.5;
    this.velocity.y = (newY - this.element.offsetTop) * 1.5;

    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }

  stopDrag() {
    this.isDragging = false;
    this.isReleased = true;
    this.applyPhysics();
  }

  applyPhysics() {
    if (!this.isReleased) return;

    const animate = () => {
      if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
        cancelAnimationFrame(this.animationFrame);
        return;
      }

      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;
      const minX = 155;
      const minY = 200;
      const maxX = document.documentElement.clientWidth - 155;
      const maxY = document.documentElement.clientHeight - 200;

      if (newLeft < minX || newLeft > maxX) {
        this.velocity.x *= -1;
      }
      if (newTop < minY || newTop > maxY) {
        this.velocity.y *= -1;
      }

      this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
      this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const videoPlayerModal = document.getElementById("videoPlayerModal");
  const videoFrame = document.getElementById("videoFrame");
  const popoutButton = document.getElementById("popoutButton");

  let draggableInstance = null;  // Store the Draggable instance for the pop-out video player

  // Popout Button logic
  popoutButton.addEventListener("click", (event) => {
    event.preventDefault();

    // Set the video source
    videoFrame.src = "https://www.youtube.com/embed/P0jJhwPjyok?autoplay=1&vq=hd1080"; // Example video link
    videoPlayerModal.style.visibility = "visible";
    videoPlayerModal.style.display = "flex";

    // Initialize draggable only if not already initialized
    if (!draggableInstance) {
      draggableInstance = new Draggable(videoPlayerModal);
    }
  });

  // Close the modal logic
  window.addEventListener("click", (event) => {
    if (event.target === videoPlayerModal) {
      videoPlayerModal.style.visibility = "hidden";
      videoPlayerModal.style.display = "none";
      videoFrame.src = ""; // Stop the video

      // Optional: Reset draggable position or other properties when modal is closed
      if (draggableInstance) {
        draggableInstance = null;  // Reset draggable instance if you want to reinitialize it later
      }
    }
  });
});
