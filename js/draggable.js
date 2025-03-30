export class Draggable {
  constructor(element, isKissButton = false) {
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
    this.isKissButton = isKissButton;
    this.clickCount = 0;
    this.isFree = false;

    if (!isKissButton) {
      // Center only if it's NOT the kiss button
      this.centerElementInViewport();
      // Set up drag events for music player
      this.initMusicPlayer();
    } else {
      // Set up click behavior for the kiss button
      this.initKissButton();
    }
  }

  // Set Zero Gravity Mode
  setZeroGravityMode(isZeroGravity) {
    this.isZeroGravity = isZeroGravity;
  }

  // Center element in the viewport (only for non-kiss button)
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

  // Initialize the Music Player drag functionality (no click behavior)
  initMusicPlayer() {
    this.element.addEventListener("mousedown", this.startDrag.bind(this));
    document.addEventListener("mousemove", this.drag.bind(this));
    document.addEventListener("mouseup", this.stopDrag.bind(this));
  }

  // Initialize the Kiss Button click functionality (no drag)
  initKissButton() {
    this.element.addEventListener('click', this.handleKissButtonClick.bind(this));
  }

  // Kiss button logic (responds to clicks)
  handleKissButtonClick(e) {
    if (!this.isKissButton) return;

    if (!this.isFree) {
      this.clickCount++;
      if (this.clickCount >= 10) {
        this.isFree = true;
        this.velocity = { x: 0, y: 0 }; // Reset velocity once free.
      } else {
        return;
      }
    }

    // Move in the opposite direction of the click
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    this.velocity.x = (centerX - e.clientX) * 0.5;
    this.velocity.y = (centerY - e.clientY) * 0.5;

    this.applyPhysics();
  }

  // Start dragging (for music player only)
  startDrag(e) {
    this.isDragging = true;
    this.isReleased = false;

    this.offset = {
      x: e.clientX - this.element.offsetLeft,
      y: e.clientY - this.element.offsetTop
    };

    cancelAnimationFrame(this.animationFrame);
  }

  // Dragging logic (for music player only)
  drag(e) {
    if (!this.isDragging) return;

    const newX = this.element.offsetLeft + (e.clientX - this.offset.x - this.element.offsetLeft) * 0.5;
    const newY = this.element.offsetTop + (e.clientY - this.offset.y - this.element.offsetTop) * 0.5;

    this.velocity.x = (newX - this.element.offsetLeft) * 1.5;
    this.velocity.y = (newY - this.element.offsetTop) * 1.5;

    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }

  // Stop dragging (for music player only)
  stopDrag() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.isReleased = true;
    this.applyPhysics();
  }

  // Apply physics (for both music player and kiss button)
  applyPhysics() {
    if (this.isKissButton && !this.isFree) return; // Prevent movement before it's free

    const animate = () => {
      if (!this.isZeroGravity && Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
        cancelAnimationFrame(this.animationFrame);
        return;
      }

      if (!this.isZeroGravity) {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
      }

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;

      // Separate boundaries for kiss button
      const minX = this.isKissButton ? 100 : 160;
      const minY = this.isKissButton ? 150 : 220;
      const maxX = document.documentElement.clientWidth - (this.isKissButton ? 100 : 160);
      const maxY = document.documentElement.clientHeight - (this.isKissButton ? 150 : 220);

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
