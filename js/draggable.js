export class Draggable {
  constructor(element) {
    this.element = element;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.isReleased = false;
    this.animationFrame = null;

    // Ensure absolute positioning
    this.element.style.position = 'absolute';

    // Center the element in the viewport
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

    // Calculate initial offset
    this.offset = {
      x: e.clientX - this.element.offsetLeft,
      y: e.clientY - this.element.offsetTop
    };

    cancelAnimationFrame(this.animationFrame);
  }

  drag(e) {
    if (!this.isDragging) return;

    // Calculate new position with some smoothing for better control
    const newX = e.clientX - this.offset.x;
    const newY = e.clientY - this.offset.y;

    // Store velocity for release physics
    this.velocity.x = (newX - this.element.offsetLeft) * 1.5;
    this.velocity.y = (newY - this.element.offsetTop) * 1.5;

    // Apply the position to the element
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

      // Apply friction
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      // Get module dimensions
      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;

      // Viewport boundaries: Ensure full element stays on screen
      const minX = 0;
      const minY = 0;
      const maxX = window.innerWidth - elementWidth;  // Fix: element width should not go offscreen
      const maxY = window.innerHeight - elementHeight; // Fix: element height should not go offscreen

      // Correct the position if the element reaches the boundary
      if (newLeft < minX) {
        newLeft = minX;
        this.velocity.x *= -0.4;  // Bounce off left side
      }
      if (newLeft > maxX) {
        newLeft = maxX;
        this.velocity.x *= -0.4;  // Bounce off right side
      }
      if (newTop < minY) {
        newTop = minY;
        this.velocity.y *= -0.4;  // Bounce off top side
      }
      if (newTop > maxY) {
        newTop = maxY;
        this.velocity.y *= -0.4;  // Bounce off bottom side
      }

      // Apply the corrected position to the element
      this.element.style.left = `${newLeft}px`;
      this.element.style.top = `${newTop}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
