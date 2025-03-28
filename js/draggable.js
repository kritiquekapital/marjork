export class Draggable {
  constructor(element) {
    this.element = element;  // The draggable container (the whole music player)
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };  // Current velocity of the player
    this.gravity = 0.2;  // Gravity effect (constant acceleration)
    this.dragCoefficient = 0.98;  // Simulate drag
    this.friction = 0.95;  // Friction to slow down the movement gradually
    this.isReleased = false;  // Track if the item has been released

    // Make sure the element is positioned absolutely for correct dragging behavior
    this.element.style.position = 'absolute';

    // Center the element initially in the viewport
    this.centerElementInViewport();

    // Initialize the element's position
    this.init();
  }

  centerElementInViewport() {
    // Get the viewport's dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get the element's dimensions
    const elementWidth = this.element.offsetWidth;
    const elementHeight = this.element.offsetHeight;

    // Calculate center position in the viewport
    const initialLeft = (viewportWidth - elementWidth) / 2;
    const initialTop = (viewportHeight - elementHeight) / 2;

    // Set the element's initial position (centered in the viewport)
    this.element.style.left = `${initialLeft}px`;
    this.element.style.top = `${initialTop}px`;
  }

  init() {
    // Set event listeners for drag actions
    this.element.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));

    // Set the initial position
    const rect = this.element.getBoundingClientRect();
    this.initialPosition = { x: rect.left, y: rect.top };
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

    // Calculate the change in position based on mouse movement
    const deltaX = e.clientX - this.offset.x;
    const deltaY = e.clientY - this.offset.y;

    // Update the element's position during drag
    this.element.style.left = `${deltaX}px`;
    this.element.style.top = `${deltaY}px`;

    // Track the velocity during the drag to simulate inertia after release
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
          clearInterval(movementInterval);  // Stop when the velocity is small enough
          return;
        }

        // Apply gravity (constant acceleration downward)
        this.velocity.y += this.gravity;

        // Apply drag resistance to slow down the movement
        this.velocity.x *= this.dragCoefficient;
        this.velocity.y *= this.dragCoefficient;

        // Apply friction to slow the velocity gradually
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Update the element's position based on velocity
        let newLeft = parseFloat(this.element.style.left || 0) + this.velocity.x;
        let newTop = parseFloat(this.element.style.top || 0) + this.velocity.y;

        // Check boundaries to prevent the element from going outside the viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Prevent going beyond the right and left edges
        newLeft = Math.max(0, Math.min(viewportWidth - this.element.offsetWidth, newLeft));

        // Prevent going beyond the top and bottom edges
        newTop = Math.max(0, Math.min(viewportHeight - this.element.offsetHeight, newTop));

        // Update the position with boundary constraints
        this.element.style.left = `${newLeft}px`;
        this.element.style.top = `${newTop}px`;

      }, 16);  // approximately 60fps
    }
  }
}
