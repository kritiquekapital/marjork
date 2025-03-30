export class Draggable {
  constructor(element, maxClicks = 30) {
    if (!element) {
      throw new Error("Element is required to initialize Draggable.");
    }

    this.element = element;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;  // Slower friction for air hockey-like sliding
    this.isReleased = false;
    this.animationFrame = null;
    this.isZeroGravity = false;  // Zero gravity flag
    this.clickCount = 0;  // Track the number of clicks
    this.maxClicks = maxClicks;  // The number of clicks before breaking free

    // Boundaries similar to other draggable elements (calculated dynamically)
    this.boundaries = this.calculateBoundaries();

    // Ensure absolute positioning
    this.element.style.position = 'absolute';

    // Center the element in the viewport initially
    this.centerElementInViewport();

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

    // Add click event listener if it's the kiss button to track clicks
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

    // Air hockey-like sliding effect (small multiplier for drag)
    const newX = this.element.offsetLeft + (e.clientX - this.offset.x - this.element.offsetLeft) * 0.3;
    const newY = this.element.offsetTop + (e.clientY - this.offset.y - this.element.offsetTop) * 0.3;

    this.velocity.x = (newX - this.element.offsetLeft) * 0.5;
    this.velocity.y = (newY - this.element.offsetTop) * 0.5;

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
      // If zero gravity is on, no friction, let it slide indefinitely
      if (!this.isZeroGravity && Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
        cancelAnimationFrame(this.animationFrame);
        return;
      }

      if (!this.isZeroGravity) {
        this.velocity.x *= this.friction;  // Apply friction when not in zero gravity
        this.velocity.y *= this.friction;
      }

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      // Ensure the element respects the predefined boundaries (same as draggable)
      if (newLeft < this.boundaries.minX || newLeft > this.boundaries.maxX) {
        this.velocity.x *= -1;  // Bounce off the left/right boundaries
      }
      if (newTop < this.boundaries.minY || newTop > this.boundaries.maxY) {
        this.velocity.y *= -1;  // Bounce off the top/bottom boundaries
      }

      // Update element position within boundaries
      this.element.style.left = `${Math.min(this.boundaries.maxX, Math.max(this.boundaries.minX, newLeft))}px`;
      this.element.style.top = `${Math.min(this.boundaries.maxY, Math.max(this.boundaries.minY, newTop))}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  breakFree() {
    // Trigger zero-gravity and perpetual motion effect on button break free
    this.setZeroGravityMode(true);  // Enable zero gravity mode
    this.element.style.cursor = 'pointer';  // Change cursor for interaction

    // Set initial velocity based on the position of the click (directional movement)
    const rect = this.element.getBoundingClientRect();
    const clickX = event.clientX;
    const clickY = event.clientY;

    // Direction based on the click relative to the button position
    const directionX = (clickX - rect.left) / rect.width;
    const directionY = (clickY - rect.top) / rect.height;

    // Set initial velocity for perpetual motion
    this.velocity.x = directionX * 10;  // Customize the initial speed multiplier
    this.velocity.y = directionY * 10;

    // After break free, apply the same boundary-based movement
    this.isReleased = true;
    this.applyPhysics();  // Start applying physics after breaking free
  }
}
