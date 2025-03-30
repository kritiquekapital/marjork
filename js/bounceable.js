export class Bounceable {
  constructor(element) {
    this.element = element;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.95; // Slightly higher friction for smoother movement
    this.animationFrame = null;
    this.clickCount = 0;
    this.isFree = false;

    // Ensure absolute positioning but use its computed initial position
    this.element.style.position = "absolute"; 
    const rect = this.element.getBoundingClientRect();
    this.element.style.left = `${rect.left}px`;
    this.element.style.top = `${rect.top}px`;

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
    this.velocity.x = (this.element.offsetLeft - x) * 0.1; // Reduced for less extreme movement
    this.velocity.y = (this.element.offsetTop - y) * 0.1;
    this.applyBouncePhysics();
  }

  // Apply bouncing physics
  applyBouncePhysics() {
    if (!this.isFree) return; // Ensure physics only runs after freeing

    const animate = () => {
      if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
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

      // Define viewport boundaries dynamically
      const minX = 0;
      const minY = 0;
      const maxX = window.innerWidth - elementWidth;
      const maxY = window.innerHeight - elementHeight;

      // Bounce off edges
      if (newLeft < minX || newLeft > maxX) {
        this.velocity.x *= -1;
      }
      if (newTop < minY || newTop > maxY) {
        this.velocity.y *= -1;
      }

      // Apply new position, ensuring it stays within bounds
      this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
      this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
