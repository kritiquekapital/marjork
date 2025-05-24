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

    // Fix hole position relative to the grid container
    const gridContainer = document.querySelector('.grid-container');
    const containerRect = gridContainer.getBoundingClientRect();

    // Ensure hole is centered on the button (add 60px to center)
    this.holePosition = {
      left: this.initialPosition.left + 60, // Center hole based on button position
      top: this.initialPosition.top + 60
    };

    // Create the hole visually and position it in front of the grid container
    this.createHole();

    // Default mode is NORMAL
    this.currentMode = Bounceable.modes.NORMAL;

    this.ignoreHoleDetection = false; // Start with no hole detection
  }

  // Create the hole (visually fixed and in front of the grid)
  createHole() {
    const hole = document.createElement('div');
    hole.className = 'hole';

    // Position hole centered on the button
    hole.style.position = 'absolute'; // Hole will be placed absolutely in the container
    hole.style.left = `${this.holePosition.left - 30}px`;  // Set the correct left position
    hole.style.top = `${this.holePosition.top - 30}px`;    // Set the correct top position
    hole.style.width = '120px';
    hole.style.height = '120px';
    hole.style.backgroundColor = '#333';
    hole.style.borderRadius = '50%';
    hole.style.zIndex = '3'; // Ensure it's above the grid container but below the button
    document.body.appendChild(hole);  // Hole stays fixed in front of everything
  }

  handleClick(e) {
    if (!this.isFree) {
      this.isFree = true;
      this.velocity = { x: 0, y: 0 };
      this.element.classList.add('free');
      const rect = this.element.getBoundingClientRect();
      this.element.style.position = 'fixed';
      this.element.style.left = `${rect.left}px`;
      this.element.style.top = `${rect.top}px`;

      // Set z-index to 99999 when free
      this.element.style.zIndex = '99999';  // Makes the kiss button appear on top

      // Apply inertia based on click position
      this.moveOppositeDirection(e.clientX, e.clientY);

      // Temporarily disable hole detection for 2 seconds after click
      this.ignoreHoleDetection = true;
      setTimeout(() => {
        this.ignoreHoleDetection = false;
      }, 2000); // 2 seconds timer to ignore hole detection
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

      // Skip frame only for retro mode
      if (this.currentMode === Bounceable.modes.RETRO) {
        if (time - lastFrameTime < 1000 / 15) return;
        lastFrameTime = time;
      }

      let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
      let newTop = parseFloat(this.element.style.top) + this.velocity.y;

      const maxX = window.innerWidth - this.element.offsetWidth;
      const maxY = window.innerHeight - this.element.offsetHeight;

      // Bounce boundaries
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

      // Only check hole detection if the button isn't being freed or released
      if (!this.ignoreHoleDetection && this.isInHole(newLeft, newTop)) {
        this.lockIntoHole(newLeft, newTop);
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
  }

  applyZeroGravityMovement(newLeft, newTop) {
    // Zero Gravity Mode - No friction, move freely
    this.velocity.x *= 1; // No friction, maintain velocity
    this.velocity.y *= 1;
    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;
  }

  // Check if the button is within the hole range
  isInHole(newLeft, newTop) {
    const distance = Math.sqrt(
      Math.pow(newLeft - this.holePosition.left, 2) + Math.pow(newTop - this.holePosition.top, 2)
    );
    return distance < 60;  // Within 60px of the "hole"
  }

  // Lock the button into the hole visually and position it correctly
  lockIntoHole(newLeft, newTop) {
    this.velocity = { x: 0, y: 0 };  // Stop any movement
    this.element.style.left = `${this.holePosition.left - 60}px`;  // Snap to hole's center
    this.element.style.top = `${this.holePosition.top - 60}px`;    // Snap to hole's center
    this.element.classList.add('locked'); // Optionally add a "locked" class for styling
    console.log(`Button locked into hole after ${this.strokeCount} strokes!`);
    this.strokeCount = 0; // Reset stroke count
  }

  static switchMode(newMode) {
    this.instances.forEach(instance => {
      instance.currentMode = newMode;

      if (newMode === Bounceable.modes.ZERO_GRAVITY && instance.isFree) {
        instance.applyMovement();
      }
    });
  }
}
