export class Bounceable {
  static instances = [];
  static modes = {
    NORMAL: 'normal',
    RETRO: 'retro',
    ZERO_GRAVITY: 'zero-gravity'
  };

  constructor(element) {
    this.element = element;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.isFree = false;
    this.animationFrame = null;

    // Button radius
    this.radius = Math.max(element.offsetWidth, element.offsetHeight) / 2;

    Bounceable.instances.push(this);

    // Initial position
    this.initialPosition = { left: element.offsetLeft, top: element.offsetTop };
    this.element.style.position = 'absolute';

    // Stroke count for mini-golf style logging
    this.strokeCount = 0;

    // Event listener
    this.element.addEventListener('click', this.handleClick.bind(this));

    // Create hole
    this.createHole();

    // Default mode
    this.currentMode = Bounceable.modes.NORMAL;
    this.ignoreHoleDetection = false;
  }

  createHole() {
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.style.position = 'absolute';
    hole.style.width = '120px';
    hole.style.height = '120px';
    hole.style.borderRadius = '50%';
    hole.style.backgroundColor = '#333';
    hole.style.zIndex = '1';
    document.body.appendChild(hole);

    // Hole position at button center
    this.holeRadius = hole.offsetWidth / 2;
    this.holePosition = {
      left: this.initialPosition.left + this.element.offsetWidth / 2,
      top: this.initialPosition.top + this.element.offsetHeight / 2
    };

    // Center hole visually
    hole.style.left = `${this.holePosition.left - this.holeRadius}px`;
    hole.style.top = `${this.holePosition.top - this.holeRadius}px`;
  }

  handleClick(e) {
    this.strokeCount++;

    if (!this.isFree) {
      this.isFree = true;
      this.velocity = { x: 0, y: 0 };
      this.element.classList.add('free');

      const rect = this.element.getBoundingClientRect();
      this.element.style.position = 'fixed';
      this.element.style.left = `${rect.left}px`;
      this.element.style.top = `${rect.top}px`;
      this.element.style.zIndex = '99999';

      this.moveOppositeDirection(e.clientX, e.clientY);

      this.ignoreHoleDetection = true;
      setTimeout(() => { this.ignoreHoleDetection = false; }, 2000);
    } else {
      this.moveOppositeDirection(e.clientX, e.clientY);
    }
  }

  moveOppositeDirection(clickX, clickY) {
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = centerX - clickX;
    const dy = centerY - clickY;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Apply inverse velocity
    const speed = 25;
    this.velocity.x = (dx / length) * speed;
    this.velocity.y = (dy / length) * speed;

    this.applyMovement();
  }

  applyMovement() {
    if (!this.isFree) return;

    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);

    let lastFrameTime = 0;

    const animate = (time) => {
      this.animationFrame = requestAnimationFrame(animate);

      if (this.currentMode === Bounceable.modes.RETRO) {
        if (time - lastFrameTime < 1000 / 15) return;
        lastFrameTime = time;
      }

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      const maxX = window.innerWidth - this.element.offsetWidth;
      const maxY = window.innerHeight - this.element.offsetHeight;

      // Bounce off edges
      if (newLeft < 0) { newLeft = 0; this.velocity.x *= -0.9; }
      if (newLeft > maxX) { newLeft = maxX; this.velocity.x *= -0.9; }
      if (newTop < 0) { newTop = 0; this.velocity.y *= -0.9; }
      if (newTop > maxY) { newTop = maxY; this.velocity.y *= -0.9; }

      // Movement modes
      switch (this.currentMode) {
        case Bounceable.modes.RETRO:
          this.applyRetroMovement(newLeft, newTop);
          break;
        case Bounceable.modes.ZERO_GRAVITY:
          this.applyZeroGravityMovement(newLeft, newTop);
          break;
        default:
          this.applyNormalMovement(newLeft, newTop);
      }

      // Hole detection
      if (!this.ignoreHoleDetection && this.isInHole(newLeft, newTop)) {
        this.lockIntoHole();
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  applyNormalMovement(newLeft, newTop) {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;
  }

  applyRetroMovement(newLeft, newTop) {
    const snappedLeft = Math.round(newLeft / 4) * 4;
    const snappedTop = Math.round(newTop / 4) * 4;
    this.element.style.left = `${snappedLeft}px`;
    this.element.style.top = `${snappedTop}px`;
  }

  applyZeroGravityMovement(newLeft, newTop) {
    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;
  }

  isInHole(newLeft, newTop) {
    const distance = Math.hypot(
      newLeft + this.radius - this.holePosition.left,
      newTop + this.radius - this.holePosition.top
    );
    return distance < this.holeRadius + this.radius;
  }

  lockIntoHole() {
    this.velocity = { x: 0, y: 0 };
    this.element.style.left = `${this.holePosition.left - this.radius}px`;
    this.element.style.top = `${this.holePosition.top - this.radius}px`;
    this.element.classList.add('locked');
    console.log(`Button locked into hole after ${this.strokeCount} strokes!`);
    this.strokeCount = 0;
  }

  static switchMode(newMode) {
    this.instances.forEach(inst => {
      inst.currentMode = newMode;
      if (newMode === Bounceable.modes.ZERO_GRAVITY && inst.isFree) inst.applyMovement();
    });
  }
}
