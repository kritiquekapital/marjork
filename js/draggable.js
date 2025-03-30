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

    // Boundaries similar to other draggable elements (calculated dynamically)
    this.boundaries = this.calculateBoundaries();

    // Ensure absolute positioning
    this.element.style.position = 'absolute';

    // Initialize event listeners
    this.init();
  }

  // Function to toggle zero-gravity mode
  setZeroGravityMode(isZeroGravity) {
    this.isZeroGravity = isZeroGravity;
  }

  // Calculate the boundaries dynamically based on the element's dimensions
  calculateBoundaries() {
    const elementWidth = this.element.offsetWidth;
    const elementHeight = this.element.offsetHeight;
    const minX = 160;
    const minY = 220;
    const maxX = document.documentElement.clientWidth - elementWidth - 160;
    const maxY = document.documentElement.clientHeight - elementHeight - 220;

    return { minX, minY, maxX, maxY };
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

      // Apply boundaries to the element
      if (newLeft < this.boundaries.minX || newLeft > this.boundaries.maxX) {
        this.velocity.x *= -1;
      }
      if (newTop < this.boundaries.minY || newTop > this.boundaries.maxY) {
        this.velocity.y *= -1;
      }

      this.element.style.left = `${Math.min(this.boundaries.maxX, Math.max(this.boundaries.minX, newLeft))}px`;
      this.element.style.top = `${Math.min(this.boundaries.maxY, Math.max(this.boundaries.minY, newTop))}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
