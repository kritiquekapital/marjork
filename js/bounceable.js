export class Bounceable {
  constructor(element) {
    this.element = element;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.clickCount = 0;
    this.isFree = false;
    this.animationFrame = null;

    // Track the original position of the kiss button
    this.initialPosition = { left: element.offsetLeft, top: element.offsetTop };

    // Set initial absolute positioning of the element in the viewport
    this.element.style.position = 'absolute'; 

    // Attach the click event
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(e) {
    if (!this.isFree) {
      this.clickCount++;

      if (this.clickCount >= 10) {
        this.isFree = true;
        this.velocity = { x: 0, y: 0 }; // Reset velocity on breakout
        this.element.classList.add('free'); // Add the free class when it breaks out

        // Start moving from the original position (no repositioning)
        this.element.style.left = `${this.initialPosition.left}px`;
        this.element.style.top = `${this.initialPosition.top}px`;
      }
    } else {
      this.moveOppositeDirection(e.clientX, e.clientY);
    }
  }

  moveOppositeDirection(x, y) {
    const rect = this.element.getBoundingClientRect();

    // Calculate the opposite direction to push the element
    this.velocity.x = (rect.left - x) * 0.3;
    this.velocity.y = (rect.top - y) * 0.3;

    this.applyBouncePhysics();
  }

  applyBouncePhysics() {
    if (!this.isFree) return;

    const animate = () => {
      // If velocity is too small, stop the animation
      if (Math.abs(this.velocity.x) < 0.5 && Math.abs(this.velocity.y) < 0.5) {
        cancelAnimationFrame(this.animationFrame);
        return;
      }

      // Apply friction to the velocity
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      // Move the button based on velocity
      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      // Get viewport boundaries to keep the button within the screen
      const minX = 0;
      const minY = 0;
      const maxX = window.innerWidth - this.element.offsetWidth;
      const maxY = window.innerHeight - this.element.offsetHeight;

      // Bounce off edges of the viewport
      if (newLeft < minX || newLeft > maxX) {
        this.velocity.x *= -1; // Reverse direction if hitting the sides
      }
      if (newTop < minY || newTop > maxY) {
        this.velocity.y *= -1; // Reverse direction if hitting the top or bottom
      }

      // Set the position, making sure it's within bounds
      this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
      this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
