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
        this.applyBouncePhysics();

        // After breakout, set the element to absolute and preserve its last position
        this.element.classList.add('free');
        this.setElementPosition();
      }
    } else {
      this.moveOppositeDirection(e.clientX, e.clientY);
    }
  }

  setElementPosition() {
    // Set the element's position relative to the viewport
    const rect = this.element.getBoundingClientRect();
    this.element.style.left = `${rect.left}px`;
    this.element.style.top = `${rect.top}px`;
  }

  moveOppositeDirection(x, y) {
    const rect = this.element.getBoundingClientRect();

    // Increase force for a stronger push
    this.velocity.x = (rect.left - x) * 0.3; 
    this.velocity.y = (rect.top - y) * 0.3; 

    this.applyBouncePhysics();
  }

  applyBouncePhysics() {
    if (!this.isFree) return;

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

      // Bounce off edges
      if (newLeft < minX || newLeft > maxX) {
        this.velocity.x *= -1;
      }
      if (newTop < minY || newTop > maxY) {
        this.velocity.y *= -1;
      }

      // Apply the updated position, ensuring the element stays within the viewport
      this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
      this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
