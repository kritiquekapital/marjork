export class Bounceable {
  constructor(element) {
    this.element = element;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.animationFrame = null;
    this.clickCount = 0;
    this.isFree = false;

    // Initialize click event for kiss button
    this.element.addEventListener('click', this.handleKissButtonClick.bind(this));
  }

  // Handle the kiss button click behavior
  handleKissButtonClick(e) {
    if (!this.isFree) {
      this.clickCount++;
      if (this.clickCount >= 10) {
        this.isFree = true;
        this.velocity = { x: 0, y: 0 }; // Reset velocity once free
      } else {
        return;
      }
    }

    // Move in the opposite direction of the click
    this.moveOppositeDirection(e.clientX, e.clientY);
  }

  // Method to move the kiss button in the opposite direction of the click
  moveOppositeDirection(x, y) {
    this.velocity.x = (this.element.offsetLeft - x) * 0.5;
    this.velocity.y = (this.element.offsetTop - y) * 0.5;
    this.applyBouncePhysics();
  }

  // Apply the bouncing physics for the kiss button
  applyBouncePhysics() {
    const animate = () => {
      // Check if velocity is small enough to stop animation
      if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
        cancelAnimationFrame(this.animationFrame);
        return;
      }

      // Apply friction to reduce velocity over time
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      const elementWidth = this.element.offsetWidth;
      const elementHeight = this.element.offsetHeight;

      // Define boundaries for the kiss button
      const minX = 100;
      const minY = 150;
      const maxX = document.documentElement.clientWidth - 100;
      const maxY = document.documentElement.clientHeight - 150;

      // Bounce off the edges of the viewport
      if (newLeft < minX || newLeft > maxX) {
        this.velocity.x *= -1;
      }
      if (newTop < minY || newTop > maxY) {
        this.velocity.y *= -1;
      }

      // Update element position
      this.element.style.left = `${Math.min(maxX, Math.max(minX, newLeft))}px`;
      this.element.style.top = `${Math.min(maxY, Math.max(minY, newTop))}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
