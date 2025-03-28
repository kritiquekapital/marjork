export class Draggable {
  constructor(element, getTheme) {
    this.element = element;
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92; // Default friction
    this.isReleased = false;
    this.animationFrame = null;
    this.getTheme = getTheme; // Function to retrieve the current theme

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

    // Periodically check for theme changes
    setInterval(() => this.updateThemeEffects(), 500); // Check for theme every 500ms
  }

  updateThemeEffects() {
    const currentTheme = this.getTheme();
    console.log('Current theme in Draggable:', currentTheme);  // Log to verify the correct theme
    if (currentTheme === 'space') {
      this.friction = 1.0; // Remove friction for "space" theme
    } else {
      this.friction = 0.92; // Normal friction for other themes
    }
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

    // Make dragging movement slightly slower for better control
    const newX = this.element.offsetLeft + (e.clientX - this.offset.x - this.element.offsetLeft) * 0.5;
    const newY = this.element.offsetTop + (e.clientY - this.offset.y - this.element.offsetTop) * 0.5;

    // Store velocity for release power boost
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
      if (this.friction !== 1.0 && Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
        cancelAnimationFrame(this.animationFrame);
        return;
      }

      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      // Get module dimensions
      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;

      // Correct viewport boundaries (entire module stays in bounds)
      const minX = 0;
      const minY = 0;
      const maxX = window.innerWidth - elementWidth;
      const maxY = window.innerHeight - elementHeight;

      if (newLeft < minX) {
        newLeft = minX;
        this.velocity.x *= -0.4;
      }
      if (newLeft > maxX) {
        newLeft = maxX;
        this.velocity.x *= -0.4;
      }
      if (newTop < minY) {
        newTop = minY;
        this.velocity.y *= -0.4;
      }
      if (newTop > maxY) {
        newTop = maxY;
        this.velocity.y *= -0.4;
      }

      this.element.style.left = `${newLeft}px`;
      this.element.style.top = `${newTop}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}

// Initialize Draggable with the correct theme function
const draggableElement = document.querySelector('.theme-space');
const draggable = new Draggable(draggableElement, getCurrentTheme);
