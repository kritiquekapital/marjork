// draggable.js
export class Draggable {
  constructor(element) {
    this.element = element;
    this.handle = element.querySelector(handleSelector);
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.gravity = 0.2;  // Gravity effect (constant acceleration)
    this.dragCoefficient = 0.98;  // Simulate drag
    this.friction = 0.98;  // Friction or resistance when moving
    this.isReleased = false;  // Track if the item has been released

    // Make sure the element is positioned absolutely for correct dragging behavior
    this.element.style.position = 'absolute';

    this.init();
  }

  init() {
    // Set event listeners for drag actions
    this.handle.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));

    // Get the initial position of the element
    const rect = this.element.getBoundingClientRect();
    this.initialPosition = { x: rect.left, y: rect.top };

    // Set initial position correctly
    this.element.style.left = `${this.initialPosition.x}px`;
    this.element.style.top = `${this.initialPosition.y}px`;
  }

  startDrag(e) {
    this.isDragging = true;

    // Set the offset relative to the current mouse position and element's position
    this.offset = {
      x: e.clientX - this.element.offsetLeft,
      y: e.clientY - this.element.offsetTop
    };

    // Reset velocity when starting to drag
    this.velocity = { x: 0, y: 0 };
  }

  drag(e) {
    if (!this.isDragging) return;

    // Calculate new position based on the mouse movement
    const deltaX = e.clientX - this.offset.x;
    const deltaY = e.clientY - this.offset.y;

    // Update the position of the element during drag
    this.element.style.left = `${deltaX}px`;
    this.element.style.top = `${deltaY}px`;

    // Track the velocity during drag to simulate inertia later
    this.velocity = { x: deltaX - this.element.offsetLeft, y: deltaY - this.element.offsetTop };
  }

  stopDrag() {
    this.isDragging = false;
    this.isReleased = true;
    this.applyPhysics();
  }

  applyPhysics() {
    if (this.isReleased) {
      // Apply gravity and drag to simulate inertia after release
      const movementInterval = setInterval(() => {
        if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
          clearInterval(movementInterval);
          return; // Stop when velocity becomes too small
        }

        // Apply gravity (acceleration in the y-direction)
        this.velocity.y += this.gravity;

        // Apply drag resistance to slow down the movement
        this.velocity.x *= this.dragCoefficient;
        this.velocity.y *= this.dragCoefficient;

        // Apply friction to slow the velocity gradually
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Update the element's position based on its velocity
        this.element.style.left = `${parseFloat(this.element.style.left || 0) + this.velocity.x}px`;
        this.element.style.top = `${parseFloat(this.element.style.top || 0) + this.velocity.y}px`;
      }, 16); // approximately 60fps
    }
  }
}
