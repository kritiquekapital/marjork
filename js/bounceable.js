export class Bounceable {
  constructor(element) {
    this.element = element;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.85; // Higher friction for slower movement
    this.animationFrame = null;
    this.clickCount = 0;
    this.isFree = false;

    // Ensure absolute positioning, using current position instead of `getBoundingClientRect()`
    this.element.style.position = "absolute"; 
    this.element.style.left = `${this.element.offsetLeft}px`;
    this.element.style.top = `${this.element.offsetTop}px`;

    // Attach click event directly inside the class
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

  // Handle the click event
  handleClick(e) {
    if (!this.isFree) {
      this.clickCount++;
      if (this.clickCount >= 10) {
        this.isFree = true;
        this.velocity = { x: 0, y: 0 }; // Reset velocity when breaking free
        this.applyBouncePhysics(); // Start physics immediately
      }
    } else {
      // Move in the opposite direction
      this.moveOppositeDirection(e.clientX, e.clientY);
    }
  }

  // Move in the opposite direction of the click
  moveOppositeDirection(x, y) {
    this.velocity.x = (this.element.offsetLeft - x) * 0.05; // Reduce intensity
    this.velocity.y = (this.element.offsetTop - y) * 0.05;
    this.applyBouncePhysics();
  }

  // Apply bouncing physics
  applyBouncePhysics() {
    if (!this.isFree) return; // Ensure physics only runs after freeing

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

      // Get element size for proper bounding
      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;

      // Define viewport boundaries dynamically (keeping within screen)
      const minX = 0;
      const minY = 0;
      const maxX = window.innerWidth - elementWidth;
      const maxY = window.innerHeight - elementHeight;

      // Bounce off edges and slow down bounce effect
      if (newLeft < minX || newLeft > maxX) {
        this.velocity.x *= -0.8; // Reduce velocity loss on bounce
      }
      if (newTop < minY || newTop > maxY) {
        this.velocity.y *= -0.8;
      }

      // Apply new position, ensuring it stays within bounds
      this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
      this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
