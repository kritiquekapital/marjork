export class Draggable {
  constructor(element) {
    this.element = element;  
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };  
    this.gravity = 0.5;  // Stronger gravity for a more noticeable effect
    this.friction = 0.98;  // Slows down movement over time
    this.isReleased = false;  
    this.animationFrame = null;  // For smooth physics animation

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
    
    this.offset = {
      x: e.clientX - this.element.offsetLeft,
      y: e.clientY - this.element.offsetTop
    };

    // Stop physics while dragging
    cancelAnimationFrame(this.animationFrame);
  }

  drag(e) {
    if (!this.isDragging) return;

    const newX = e.clientX - this.offset.x;
    const newY = e.clientY - this.offset.y;

    // Calculate velocity based on last movement
    this.velocity.x = newX - this.element.offsetLeft;
    this.velocity.y = newY - this.element.offsetTop;

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

      // Apply gravity
      this.velocity.y += this.gravity;

      // Apply friction to both axes
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      // Update position
      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      // Keep inside viewport bounds
      const maxWidth = window.innerWidth - this.element.offsetWidth;
      const maxHeight = window.innerHeight - this.element.offsetHeight;

      if (newLeft < 0) {
        newLeft = 0;
        this.velocity.x *= -0.5;  // Bounce effect
      }
      if (newLeft > maxWidth) {
        newLeft = maxWidth;
        this.velocity.x *= -0.5;
      }
      if (newTop < 0) {
        newTop = 0;
        this.velocity.y *= -0.5;
      }
      if (newTop > maxHeight) {
        newTop = maxHeight;
        this.velocity.y *= -0.5;
      }

      this.element.style.left = `${newLeft}px`;
      this.element.style.top = `${newTop}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
