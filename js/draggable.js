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
    this.initialPosition = { x: 0, y: 0 }; // To track initial position

    this.init();
  }

  init() {
    this.handle.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));

    // Set the initial position of the element
    const rect = this.element.getBoundingClientRect();
    this.initialPosition.x = rect.left;
    this.initialPosition.y = rect.top;

    // Set the element's position to "absolute" for drag to work
    this.element.style.position = 'absolute';
    this.element.style.left = `${this.initialPosition.x}px`;
    this.element.style.top = `${this.initialPosition.y}px`;
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

    // Calculate new position during drag
    const deltaX = e.clientX - this.offset.x;
    const deltaY = e.clientY - this.offset.y;
    
    this.element.style.left = `${deltaX}px`;
    this.element.style.top = `${deltaY}px`;

    // Update velocity based on the current drag movement
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

        // Update the element's position based on velocity
        this.element.style.left = `${parseFloat(this.element.style.left || 0) + this.velocity.x}px`;
        this.element.style.top = `${parseFloat(this.element.style.top || 0) + this.velocity.y}px`;
      }, 16);  // roughly 60fps
    }
  }
}
