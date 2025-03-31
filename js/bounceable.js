export class Bounceable {
  constructor(element, { isInteractive = false } = {}) {
    this.element = element;
    this.isInteractive = isInteractive;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.clickCount = 0;
    this.isFree = false;
    this.animationFrame = null;
    this.radius = Math.max(element.offsetWidth, element.offsetHeight) / 2;

    // Static properties initialization
    if (!Bounceable.instances) Bounceable.instances = [];
    if (typeof Bounceable.running === 'undefined') Bounceable.running = false;
    
    Bounceable.instances.push(this);

    // Initialize non-interactive elements (music player)
    if (!this.isInteractive) {
      this.isFree = true;
      this.element.style.position = 'fixed';
      this.startPhysics();
    }

    // Start global animation loop
    if (!Bounceable.running) {
      Bounceable.running = true;
      this.globalAnimate();
    }

    // Add click listener only for interactive elements
    if (this.isInteractive) {
      this.element.style.position = 'absolute';
      this.element.addEventListener('click', this.handleClick.bind(this));
    }
  }

  // Global animation loop
  globalAnimate() {
    Bounceable.instances.forEach(instance => {
      if (instance.isFree) instance.applyBouncePhysics();
    });
    requestAnimationFrame(() => this.globalAnimate());
  }

  // Unified collision detection method
  isColliding(other) {
    const a = this.element.getBoundingClientRect();
    const b = other.element.getBoundingClientRect();
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  handleClick(e) {
    if (!this.isInteractive) return;

    if (!this.isFree) {
      this.clickCount++;
      if (this.clickCount >= 5) {
        this.activateFreeMode();
      }
    } else {
      this.applyForce(e.clientX, e.clientY);
    }
  }

  activateFreeMode() {
    this.isFree = true;
    const rect = this.element.getBoundingClientRect();
    this.element.classList.add('free');
    this.element.style.position = 'fixed';
    this.element.style.left = `${rect.left + window.scrollX}px`;
    this.element.style.top = `${rect.top + window.scrollY}px`;
    this.startPhysics();
  }

  applyForce(x, y) {
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dirX = centerX - x;
    const dirY = centerY - y;
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    
    this.velocity.x = (dirX / length) * 25;
    this.velocity.y = (dirY / length) * 25;
    this.applyBouncePhysics();
  }

  applyBouncePhysics() {
    if (!this.isFree) return;

    const animate = () => {
      // Update physics
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      let newX = parseFloat(this.element.style.left) + this.velocity.x;
      let newY = parseFloat(this.element.style.top) + this.velocity.y;

      // Boundary checks
      const maxX = window.innerWidth - this.element.offsetWidth;
      const maxY = window.innerHeight - this.element.offsetHeight;

      [newX, this.velocity.x] = this.handleBoundaryCollision(newX, maxX, this.velocity.x);
      [newY, this.velocity.y] = this.handleBoundaryCollision(newY, maxY, this.velocity.y);

      // Update position
      this.element.style.left = `${newX}px`;
      this.element.style.top = `${newY}px`;

      // Check collisions with other instances
      Bounceable.instances.forEach(other => {
        if (other !== this && this.isColliding(other)) {
          this.resolveCollision(other);
        }
      });

      if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  handleBoundaryCollision(value, max, velocity) {
    if (value < 0) return [0, velocity * -0.9];
    if (value > max) return [max, velocity * -0.9];
    return [value, velocity];
  }

  resolveCollision(other) {
    const rect1 = this.element.getBoundingClientRect();
    const rect2 = other.element.getBoundingClientRect();
    
    const dx = (rect1.left + rect1.width/2) - (rect2.left + rect2.width/2);
    const dy = (rect1.top + rect1.height/2) - (rect2.top + rect2.height/2);
    const distance = Math.sqrt(dx*dx + dy*dy);
    const minDistance = this.radius + other.radius;

    if (distance < minDistance) {
      const nx = dx / distance;
      const ny = dy / distance;
      const relativeVelocity = {
        x: other.velocity.x - this.velocity.x,
        y: other.velocity.y - this.velocity.y
      };
      
      const speed = relativeVelocity.x * nx + relativeVelocity.y * ny;
      const impulse = (2 * speed) / (1 + 1);

      // Update velocities
      this.velocity.x += impulse * nx;
      this.velocity.y += impulse * ny;
      other.velocity.x -= impulse * nx;
      other.velocity.y -= impulse * ny;

      // Position correction
      const overlap = (minDistance - distance) / 2;
      this.element.style.left = `${parseFloat(this.element.style.left) + nx * overlap}px`;
      this.element.style.top = `${parseFloat(this.element.style.top) + ny * overlap}px`;
      other.element.style.left = `${parseFloat(other.element.style.left) - nx * overlap}px`;
      other.element.style.top = `${parseFloat(other.element.style.top) - ny * overlap}px`;
    }
  }
}
