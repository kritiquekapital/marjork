export class Bounceable {
  constructor(element) {
    this.element = element;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.animationFrame = null;
    this.clickCount = 0;
    this.isFree = false;

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
    this.velocity.x = (this.element.offsetLeft - x) * 0.5;
    this.velocity.y = (this.element.offsetTop - y) * 0.5;
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

      // Define viewport boundaries
      const minX = 100;
      const minY = 150;
      const maxX = document.documentElement.clientWidth - 100;
      const maxY = document.documentElement.clientHeight - 150;

      // Bounce off edges
      if (newLeft < minX || newLeft > maxX) {
        this.velocity.x *= -1;
      }
      if (newTop < minY || newTop > maxY) {
        this.velocity.y *= -1;
      }

      // Apply new position
      this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
      this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
