export class Bounceable {
  constructor(element) {
    this.element = element;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.animationFrame = null;
    this.clickCount = 0;
    this.isFree = false;

    // Set initial position within the grid (relative to the container)
    this.initialLeft = element.offsetLeft;
    this.initialTop = element.offsetTop;
    this.element.style.position = "relative";  // Maintain relative positioning within the grid

    // Attach click event
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

handleClick(e) {
  if (!this.isFree) {
    this.clickCount++;
    if (this.clickCount >= 10) {
      this.isFree = true;
      this.velocity = { x: 0, y: 0 };

      // Track the current position before breaking out
      const rect = this.element.getBoundingClientRect();
      const currentLeft = rect.left;
      const currentTop = rect.top;

      // Set the element's position to absolute, retaining current position
      this.element.style.position = "absolute";
      this.element.style.left = `${currentLeft}px`;
      this.element.style.top = `${currentTop}px`;

      // Start applying the bounce physics
      this.applyBouncePhysics();
    }
  } else {
    // Apply movement when the element is free to move
    this.moveOppositeDirection(e.clientX, e.clientY);
  }
}

applyBouncePhysics() {
  if (!this.isFree) return;

  // Only apply physics after the breakout
  const animate = () => {
    if (Math.abs(this.velocity.x) < 0.5 && Math.abs(this.velocity.y) < 0.5) {
      cancelAnimationFrame(this.animationFrame);
      return;
    }

    // Apply friction
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
    let newTop = parseFloat(this.element.style.top) + this.velocity.y;

    // Get element size
    const elementWidth = this.element.offsetWidth;
    const elementHeight = this.element.offsetHeight;

    // Get viewport boundaries
    const minX = 0;
    const minY = 0;
    const maxX = window.innerWidth - elementWidth;
    const maxY = window.innerHeight - elementHeight;

    // Ensure element bounces off edges of the viewport
    if (newLeft < minX || newLeft > maxX) {
      this.velocity.x *= -1;
    }
    if (newTop < minY || newTop > maxY) {
      this.velocity.y *= -1;
    }

    // Update position while keeping the element within bounds
    this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
    this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

    // Request next frame for smooth animation
    this.animationFrame = requestAnimationFrame(animate);
  };

  // Begin animation
  this.animationFrame = requestAnimationFrame(animate);
  }
}
