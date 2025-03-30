class Draggable {
  constructor(element, isKissButton = false) {
    if (!element) {
      throw new Error("Element is required to initialize Draggable.");
    }

    this.element = element;
    this.isKissButton = isKissButton; // Track if this is the kiss button
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.isReleased = false;
    this.animationFrame = null;
    this.isZeroGravity = false;  // New property to track zero-gravity mode
    this.clickCount = 0;  // Track the number of clicks

    // Ensure absolute positioning
    this.element.style.position = 'absolute';

    // No need to center the kiss button, we will leave its position as is
    if (!this.isKissButton) {
      this.centerElementInViewport();  // Only center music player
    }

    // Initialize event listeners
    this.init();
  }

  // Function to toggle physics mode based on theme
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

  // Start drag is only for music player, for kiss button it's click to shoot
  startDrag(e) {
    if (this.isKissButton) {
      this.shootAway(e);
      return;
    }
    
    this.isDragging = true;
    this.isReleased = false;

    this.offset = {
      x: e.clientX - this.element.offsetLeft,
      y: e.clientY - this.element.offsetTop
    };

    cancelAnimationFrame(this.animationFrame);
  }

  // When clicked, the kiss button will shoot away in a direction
  shootAway(e) {
    this.isReleased = false; // We're not releasing it yet, it's in motion
    const speed = 10; // Define the speed of movement
    const targetX = e.clientX; // X position of the mouse
    const targetY = e.clientY; // Y position of the mouse

    const distanceX = targetX - this.element.offsetLeft;
    const distanceY = targetY - this.element.offsetTop;

    // Normalize the direction to ensure consistent movement speed
    const length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const directionX = (distanceX / length) * speed;
    const directionY = (distanceY / length) * speed;

    this.velocity = { x: directionX, y: directionY }; // Set velocity

    cancelAnimationFrame(this.animationFrame);
    this.applyPhysics(); // Start the physics after shoot
  }

  drag(e) {
    if (!this.isDragging) return;

    // Calculate new position with a smoothing factor
    const newX = this.element.offsetLeft + (e.clientX - this.offset.x - this.element.offsetLeft) * 0.5;
    const newY = this.element.offsetTop + (e.clientY - this.offset.y - this.element.offsetTop) * 0.5;

    // Update velocity but only when the element is being dragged
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
      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;

      let minX, minY, maxX, maxY;

      // Set boundaries for both the music player and kiss button
      if (this.isKissButton) {
        minX = 50;
        minY = 50;
        maxX = document.documentElement.clientWidth - 50;
        maxY = document.documentElement.clientHeight - 50;
      } else {
        minX = 160;
        minY = 220;
        maxX = document.documentElement.clientWidth - 160;
        maxY = document.documentElement.clientHeight - 220;
      }

      // Apply friction for normal gravity physics
      if (!this.isZeroGravity) {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Boundary checks and bounce (for both kiss button and music player)
        if (newLeft < minX || newLeft > maxX) {
          this.velocity.x *= -1; // Reverse velocity to simulate bounce
        }
        if (newTop < minY || newTop > maxY) {
          this.velocity.y *= -1; // Reverse velocity to simulate bounce
        }
      }

      // Update position
      this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
      this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

      // Stop the animation when the velocity is low enough
      if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
        cancelAnimationFrame(this.animationFrame);
        this.velocity.x = 0; // Stop further movement
        this.velocity.y = 0;
        return;
      }

      this.animationFrame = requestAnimationFrame(animate);
    };

    // Start the animation loop if it's not already running
    if (!this.animationFrame) {
      this.animationFrame = requestAnimationFrame(animate);
    }
  }
}
