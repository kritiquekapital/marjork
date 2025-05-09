export class Bounceable {
  static instances = [];
  static trailLayer = null;

  // Define mode states
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
    this.radius = Math.max(element.offsetWidth, element.offsetHeight) / 2;
    Bounceable.instances.push(this);

    this.initialPosition = { left: element.offsetLeft, top: element.offsetTop };
    this.element.style.position = 'absolute';
    this.element.addEventListener('click', this.handleClick.bind(this));

    // Default mode is NORMAL
    this.currentMode = Bounceable.modes.NORMAL;
  }

  handleClick(e) {
    if (!this.isFree) {
      this.isFree = true;
      this.velocity = { x: 0, y: 0 };
      this.element.classList.add('free');
      const rect = this.element.getBoundingClientRect();
      this.element.style.position = 'fixed';
      this.element.style.left = `${rect.left + window.scrollX}px`;
      this.element.style.top = `${rect.top + window.scrollY}px`;

      // Set z-index to 99999 when free
      this.element.style.zIndex = '99999';  // Makes the kiss button appear on top

      // Apply inertia based on click position
      this.moveOppositeDirection(e.clientX, e.clientY);
    } else {
      this.moveOppositeDirection(e.clientX, e.clientY); // Continue movement in the opposite direction
    }
  }

  moveOppositeDirection(clickX, clickY) {
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dirX = centerX - clickX;
    const dirY = centerY - clickY;
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    this.velocity.x = (dirX / length) * 25; // Inverse velocity based on click position
    this.velocity.y = (dirY / length) * 25; // Inverse velocity based on click position
    this.applyMovement();
  }

  applyMovement() {
    if (!this.isFree) return;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    let lastFrameTime = 0;

    const animate = (time) => {
      this.animationFrame = requestAnimationFrame(animate);

      if (time - lastFrameTime < 1000 / 15) return; // Adjust the framerate
      lastFrameTime = time;

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      const maxX = window.innerWidth - this.element.offsetWidth;
      const maxY = window.innerHeight - this.element.offsetHeight;

      // Handle boundaries for normal and retro modes
      if (newLeft < 0) {
        newLeft = 0;
        this.velocity.x *= -0.9;
      }
      if (newLeft > maxX) {
        newLeft = maxX;
        this.velocity.x *= -0.9;
      }
      if (newTop < 0) {
        newTop = 0;
        this.velocity.y *= -0.9;
      }
      if (newTop > maxY) {
        newTop = maxY;
        this.velocity.y *= -0.9;
      }

      // Apply logic based on the active mode
      switch (this.currentMode) {
        case Bounceable.modes.RETRO:
          this.applyRetroMovement(newLeft, newTop);
          break;
        case Bounceable.modes.ZERO_GRAVITY:
          this.applyZeroGravityMovement(newLeft, newTop);
          break;
        case Bounceable.modes.NORMAL:
          this.applyNormalMovement(newLeft, newTop);
          break;
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  applyNormalMovement(newLeft, newTop) {
    // Normal mode - Apply friction
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;
  }

  applyRetroMovement(newLeft, newTop) {
    // Retro Mode - Apply glitchy effect, snapping, and pixelation
    const snappedLeft = Math.round(newLeft / 4) * 4;
    const snappedTop = Math.round(newTop / 4) * 4;
    this.element.style.left = `${snappedLeft}px`;
    this.element.style.top = `${snappedTop}px`;
    Bounceable.createTrailDot(this.element, snappedLeft, snappedTop);
  }

  applyZeroGravityMovement(newLeft, newTop) {
    // Zero Gravity Mode - No friction, move freely
    this.velocity.x *= 1; // No friction, maintain velocity
    this.velocity.y *= 1;
    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;
  }

  static createTrailDot(sourceEl, left, top) {
    // Only create trail in retro theme
    if (!document.body.classList.contains('theme-retro')) return;

    if (!Bounceable.trailLayer) {
      Bounceable.trailLayer = document.createElement('div');
      Bounceable.trailLayer.className = 'bounce-trail';
      Object.assign(Bounceable.trailLayer.style, {
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '9998' // One layer below the kiss button
      });
      document.body.appendChild(Bounceable.trailLayer);
    }

    const dot = document.createElement('div');
    dot.className = 'bounce-dot';

    Object.assign(dot.style, {
      width: `${sourceEl.offsetWidth}px`,
      height: '6px',
      position: 'fixed',
      backgroundColor: 'teal',
      opacity: '0.6',
      borderRadius: '1px',
      left: `${left}px`,
      top: `${top + sourceEl.offsetHeight / 2 - 3}px`,
      zIndex: '9998', // Ensure the dot is below the kiss button
      pointerEvents: 'none'
    });

    // Ensure the bounceable button (like kiss) stays visually on top
    sourceEl.style.zIndex = '99999';

    Bounceable.trailLayer.appendChild(dot);
    setTimeout(() => dot.remove(), 500);
  }

  // To switch between modes (normal, retro, zero-gravity)
  static switchMode(newMode) {
    this.currentMode = newMode;
  }
}
