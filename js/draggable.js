export class Draggable {
  constructor(element) {
    if (!element) {
      throw new Error("Element is required to initialize Draggable.");
    }

    this.element = element;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92; // For normal mode
    this.isReleased = false;
    this.animationFrame = null;
    this.isZeroGravity = false;

    // Ensure absolute positioning
    this.element.style.position = 'absolute';

    // Center the element in the viewport
    this.centerElementInViewport();

    // Initialize event listeners
    this.init();
  }

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

    const newX = e.clientX - this.offset.x;
    const newY = e.clientY - this.offset.y;

    this.velocity.x = (newX - this.element.offsetLeft) * 0.5;
    this.velocity.y = (newY - this.element.offsetTop) * 0.5;

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
      if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1 && !this.isZeroGravity) {
        cancelAnimationFrame(this.animationFrame);
        return;
      }

      if (!this.isZeroGravity) {
        // Apply friction for normal mode
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
      }

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;

      const minX = 155;
      const minY = 200;
      const maxX = document.documentElement.clientWidth - 155;
      const maxY = document.documentElement.clientHeight - 200;

      if (this.isZeroGravity) {
        // In zero gravity mode, it will bounce off the edges and continue indefinitely
        if (newLeft < minX || newLeft > maxX) {
          this.velocity.x *= -1;  // Bounce off horizontal edges
        }
        if (newTop < minY || newTop > maxY) {
          this.velocity.y *= -1;  // Bounce off vertical edges
        }
      } else {
        // Normal physics: bounce off edges with friction
        if (newLeft < minX) {
          newLeft = minX;
          this.velocity.x *= -1;  // Reverse horizontal velocity
        }
        if (newLeft > maxX) {
          newLeft = maxX;
          this.velocity.x *= -1;  // Reverse horizontal velocity
        }
        if (newTop < minY) {
          newTop = minY;
          this.velocity.y *= -1;  // Reverse vertical velocity
        }
        if (newTop > maxY) {
          newTop = maxY;
          this.velocity.y *= -1;  // Reverse vertical velocity
        }
      }

      this.element.style.left = `${newLeft}px`;
      this.element.style.top = `${newTop}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
