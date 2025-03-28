// draggable.js
export class Draggable {
  constructor(element, handleSelector = '.drag-handle') {
    this.element = element;
    this.handle = element.querySelector(handleSelector);
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.gravity = 0.2;  // Gravity effect (constant acceleration)
    this.dragCoefficient = 0.98;  // Simulate drag
    this.friction = 0.98;  // Friction or resistance when moving
    this.isReleased = false;  // Track if the item has been released

    this.init();
  }

  init() {
    this.handle.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));
  }

  startDrag(e) {
    this.isDragging = true;
    this.offset = {
      x: e.clientX - this.element.offsetLeft,
      y: e.clientY - this.element.offsetTop
    };

    // Reset velocity when starting to drag
    this.velocity = { x: 0, y: 0 };
  }

  drag(e) {
    if (!this.isDragging) return;

    // Update position of the element
    const deltaX = e.clientX - this.offset.x;
    const deltaY = e.clientY - this.offset.y;
    
    this.element.style.left = `${deltaX}px`;
    this.element.style.top = `${deltaY}px`;

    // Update the velocity based on the drag movement
    this.velocity = { x: deltaX - this.element.offsetLeft, y: deltaY - this.element.offsetTop };
  }

  stopDrag() {
    this.isDragging = false;
    this.isReleased = true;
    this.applyPhysics();
  }

  applyPhysics() {
    if (this.isReleased) {
      // Apply gravity and drag to simulate a natural post-release movement
      const movementInterval = setInterval(() => {
        if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
          clearInterval(movementInterval);
          return; // Stop when velocity is small enough
        }

        // Apply gravity effect
        this.velocity.y += this.gravity; // Gravity pulls the element down

        // Apply drag effect (air resistance or friction)
        this.velocity.x *= this.dragCoefficient; 
        this.velocity.y *= this.dragCoefficient; 

        // Apply friction to slow down the movement
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Update the element's position
        this.element.style.left = `${parseFloat(this.element.style.left || 0) + this.velocity.x}px`;
        this.element.style.top = `${parseFloat(this.element.style.top || 0) + this.velocity.y}px`;
      }, 16);  // roughly 60fps
    }
  }
}
