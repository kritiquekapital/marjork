export class Draggable {
  constructor(element, maxClicks = 30) {
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
    this.isZeroGravity = false;  // New property to track zero-gravity mode
    this.clickCount = 0;  // Track the number of clicks
    this.maxClicks = maxClicks;  // The number of clicks before breaking free

    // Ensure absolute positioning
    this.element.style.position = 'absolute';

    // Center the element in the viewport
    this.centerElementInViewport();

    // Initialize event listeners
    this.init();
  }

  // Function to toggle physics mode based on theme
  setZeroGravityMode(isZeroGravity) {
    this.isZeroGravity = isZeroGravity;
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

    // If this is the kiss button, add click event listener for the click tracking
    if (this.element.classList.contains('kiss-button')) {
      this.element.addEventListener('click', this.handleClick.bind(this));
    }
  }

  handleClick(e) {
    this.clickCount++;

    if (this.clickCount >= this.maxClicks) {
      this.breakFree();  // Allow the kiss button to "break free"
    }
  }

  startDrag(e) {
    if (this.clickCount < this.maxClicks) return;  // Don't drag until threshold is hit

    this.isDragging = true;
    this.isReleased = false;
    
    this.offset = {
      x: e.clientX - this.element.offsetLeft,
      y: e.clientY - this.element.offsetTop
    };

    cancelAnimationFrame(this.animationFrame);
  }

  drag(e) {
    if (!this.isDragging || this.clickCount < this.maxClicks) return;

    const newX = this.element.offsetLeft + (e.clientX - this.offset.x - this.element.offsetLeft) * 0.5;
    const newY = this.element.offsetTop + (e.clientY - this.offset.y - this.element.offsetTop) * 0.5;

    this.velocity.x = (newX - this.element.offsetLeft) * 1.5;
    this.velocity.y = (newY - this.element.offsetTop) * 1.5;

    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }

  stopDrag() {
    if (this.clickCount < this.maxClicks) return;

    this.isDragging = false;
    this.isReleased = true;
    this.applyPhysics();
  }

  applyPhysics() {
    if (!this.isReleased || this.clickCount < this.maxClicks) return;

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
      const minX = 160;
      const minY = 220;
      const maxX = document.documentElement.clientWidth - 160;
      const maxY = document.documentElement.clientHeight - 220;

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

  breakFree() {
    // Change the element's behavior after it "breaks free" (allows zero-gravity and physics)
    this.setZeroGravityMode(true);
    this.element.style.cursor = 'pointer';  // Change cursor to indicate interaction

    // Set the initial velocity and direction based on the click position
    const rect = this.element.getBoundingClientRect();
    const clickX = event.clientX;
    const clickY = event.clientY;

    const directionX = (clickX - rect.left) / rect.width;
    const directionY = (clickY - rect.top) / rect.height;

    this.velocity.x = directionX * 10;  // Customize speed multiplier here
    this.velocity.y = directionY * 10;

    this.isReleased = true;
    this.applyPhysics();
  }
}
