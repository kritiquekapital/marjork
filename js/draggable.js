applyPhysics() {
    if (!this.isReleased) return;

    const animate = () => {
      if (Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
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

      // Corrected viewport boundaries (fully contained within the window)
      const minX = 0;
      const minY = 0;
      const maxX = document.documentElement.clientWidth - elementWidth;  // Use clientWidth for the actual available width
      const maxY = document.documentElement.clientHeight - elementHeight; // Use clientHeight for the actual available height

      // Adjust boundaries to ensure the element stays fully within the viewport
      if (newLeft < minX) {
        newLeft = minX;
        this.velocity.x *= -0.4;  // Bounce off left side
      }
      if (newLeft > maxX) {
        newLeft = maxX;
        this.velocity.x *= -0.4;  // Bounce off right side
      }
      if (newTop < minY) {
        newTop = minY;
        this.velocity.y *= -0.4;  // Bounce off top side
      }
      if (newTop > maxY) {
        newTop = maxY;
        this.velocity.y *= -0.4;  // Bounce off bottom side
      }

      this.element.style.left = `${newLeft}px`;
      this.element.style.top = `${newTop}px`;

      this.animationFrame = requestAnimationFrame(animate);
    };

    this.animationFrame = requestAnimationFrame(animate);
}
