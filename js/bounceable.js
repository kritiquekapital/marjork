export class Bounceable {
  static instances = [];

  static modes = {
    NORMAL: 'normal',
    RETRO: 'retro',
    ZERO_GRAVITY: 'zero-gravity',
    GLITCH: 'glitch'
  };

  constructor(element) {
    this.element = element;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92;
    this.glitchFriction = 0.84;
    this.isFree = false;
    this.isLockedInHole = false;
    this.animationFrame = null;
    this.ignoreHoleDetection = false;
    this.currentMode = Bounceable.modes.NORMAL;

    this.radius = Math.max(element.offsetWidth, element.offsetHeight) / 2;
    this.strokeCount = 0;

    this.nextGlitchJumpAt = performance.now() + this.getNextGlitchDelay();

    this.snapRadius = 34;
    this.lockSnapDistance = 6;
    this.slipSpeed = 3.5;

    Bounceable.instances.push(this);

    this.element.style.position = 'absolute';

    this.createHole();
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  createHole() {
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.style.position = 'fixed';
    hole.style.width = '120px';
    hole.style.height = '120px';
    hole.style.borderRadius = '50%';
    hole.style.backgroundColor = '#333';
    hole.style.zIndex = '1';
    document.body.appendChild(hole);

    this.hole = hole;
    this.holeRadius = hole.offsetWidth / 2;

    const rect = this.element.getBoundingClientRect();
    this.holePosition = {
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2
    };

    hole.style.left = `${this.holePosition.left - this.holeRadius}px`;
    hole.style.top = `${this.holePosition.top - this.holeRadius}px`;
  }

  handleClick(e) {
    this.strokeCount++;

    if (this.isLockedInHole) {
      this.ejectFromHole();
      return;
    }

    if (!this.isFree) {
      this.isFree = true;
      this.velocity = { x: 0, y: 0 };
      this.element.classList.add('free');

      const rect = this.element.getBoundingClientRect();
      this.element.style.position = 'fixed';
      this.element.style.left = `${rect.left}px`;
      this.element.style.top = `${rect.top}px`;
      this.element.style.zIndex = '99999';
    }

    this.moveOppositeDirection(e.clientX, e.clientY);
    this.resetGlitchTimer();

    this.ignoreHoleDetection = true;
    setTimeout(() => {
      this.ignoreHoleDetection = false;
    }, 120);
  }

  getCenterRect() {
    const rect = this.element.getBoundingClientRect();
    return {
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2
    };
  }

  getClickVectorAndPower(clickX, clickY) {
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = centerX - clickX;
    let dy = centerY - clickY;
    let length = Math.hypot(dx, dy);

    if (length < 0.001) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      length = 1;
    }

    const nx = dx / length;
    const ny = dy / length;

    const maxRelevantDistance = this.radius;
    const clampedDistance = Math.min(length, maxRelevantDistance);
    const powerRatio = clampedDistance / maxRelevantDistance;

    return { nx, ny, powerRatio };
  }

  moveOppositeDirection(clickX, clickY) {
    const { nx, ny, powerRatio } = this.getClickVectorAndPower(clickX, clickY);

    const minSpeed = 6;
    const maxSpeed = 50;
    const curvedPower = Math.pow(powerRatio, 2.6);
    const speed = minSpeed + (maxSpeed - minSpeed) * curvedPower;

    this.velocity.x = nx * speed;
    this.velocity.y = ny * speed;

    this.applyMovement();
  }

  ejectFromHole() {
    this.isLockedInHole = false;
    this.element.classList.remove('locked');

    this.element.style.left = `${this.holePosition.left - this.radius}px`;
    this.element.style.top = `${this.holePosition.top - this.radius}px`;

    const angle = Math.random() * Math.PI * 2;
    const speed = 25 + Math.random() * 8;

    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;

    this.resetGlitchTimer();

    this.ignoreHoleDetection = true;
    setTimeout(() => {
      this.ignoreHoleDetection = false;
    }, 180);

    this.applyMovement();
  }

  getHoleDistance() {
    const center = this.getCenterRect();
    const dx = this.holePosition.left - center.left;
    const dy = this.holePosition.top - center.top;
    const distance = Math.hypot(dx, dy);

    return { distance, dx, dy };
  }

  getNextGlitchDelay() {
    return 120 + Math.random() * 360;
  }

  resetGlitchTimer(now = performance.now()) {
    this.nextGlitchJumpAt = now + this.getNextGlitchDelay();
  }

  applyGlitchJump(now) {
    const speed = Math.hypot(this.velocity.x, this.velocity.y);

    if (speed < 7) return;
    if (now < this.nextGlitchJumpAt) return;

    const maxX = window.innerWidth - this.element.offsetWidth;
    const maxY = window.innerHeight - this.element.offsetHeight;
    const currentLeft = parseFloat(this.element.style.left || '0');
    const currentTop = parseFloat(this.element.style.top || '0');

    const jumpTier = Math.random();
    const jumpRange = jumpTier < 0.75 ? 50 : jumpTier < 0.95 ? 110 : 180;

    let nextLeft = currentLeft + (Math.random() * 2 - 1) * jumpRange;
    let nextTop = currentTop + (Math.random() * 2 - 1) * jumpRange;

    nextLeft = Math.max(0, Math.min(maxX, nextLeft));
    nextTop = Math.max(0, Math.min(maxY, nextTop));

    this.element.style.left = `${nextLeft}px`;
    this.element.style.top = `${nextTop}px`;

    this.velocity.x *= 0.72;
    this.velocity.y *= 0.72;
    this.velocity.x += (Math.random() * 2 - 1) * 3;
    this.velocity.y += (Math.random() * 2 - 1) * 3;

    this.resetGlitchTimer(now);
  }

  applyMovement() {
    if (!this.isFree) return;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    let lastFrameTime = 0;

    const animate = (time) => {
      this.animationFrame = requestAnimationFrame(animate);

      if (this.currentMode === Bounceable.modes.RETRO) {
        if (time - lastFrameTime < 1000 / 15) return;
        lastFrameTime = time;
      }

      if (this.isLockedInHole) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
        return;
      }

      let newLeft = parseFloat(this.element.style.left || '0') + this.velocity.x;
      let newTop = parseFloat(this.element.style.top || '0') + this.velocity.y;

      const maxX = window.innerWidth - this.element.offsetWidth;
      const maxY = window.innerHeight - this.element.offsetHeight;

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
        case Bounceable.modes.GLITCH:
          this.applyGlitchMovement(newLeft, newTop, time);
          break;
        default:
          this.applyNormalMovement(newLeft, newTop);
          break;
      }

      if (!this.ignoreHoleDetection) {
        const { distance, dx, dy } = this.getHoleDistance();

        if (distance <= this.snapRadius) {
          if (distance <= this.lockSnapDistance) {
            this.lockIntoHole();
            return;
          }

          const inv = 1 / Math.max(distance, 0.001);
          this.velocity.x = dx * inv * this.slipSpeed;
          this.velocity.y = dy * inv * this.slipSpeed;
          return;
        }
      }

      const speed = Math.hypot(this.velocity.x, this.velocity.y);
      if (
        this.currentMode !== Bounceable.modes.ZERO_GRAVITY &&
        speed < 0.35 &&
        !this.isLockedInHole
      ) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
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
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.element.style.left = `${snappedLeft}px`;
    this.element.style.top = `${snappedTop}px`;
  }

  applyZeroGravityMovement(newLeft, newTop) {
    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;
  }

  applyGlitchMovement(newLeft, newTop, time) {
    this.velocity.x *= this.glitchFriction;
    this.velocity.y *= this.glitchFriction;
    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;
    this.applyGlitchJump(time);
  }

  lockIntoHole() {
    const completedStrokeCount = this.strokeCount;

    this.velocity = { x: 0, y: 0 };
    this.isLockedInHole = true;
    this.ignoreHoleDetection = false;

    this.element.style.left = `${this.holePosition.left - this.radius}px`;
    this.element.style.top = `${this.holePosition.top - this.radius}px`;
    this.element.classList.add('locked');

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    this.element.dispatchEvent(
      new CustomEvent('bounceable:locked-in-hole', {
        detail: {
          strokeCount: completedStrokeCount
        }
      })
    );

    console.log(`Button locked into hole after ${completedStrokeCount} strokes!`);
    this.strokeCount = 0;
  }

  static switchMode(newMode) {
    this.instances.forEach((inst) => {
      inst.currentMode = newMode;
      inst.resetGlitchTimer();
      if (
        (newMode === Bounceable.modes.ZERO_GRAVITY || newMode === Bounceable.modes.GLITCH) &&
        inst.isFree &&
        !inst.isLockedInHole
      ) {
        inst.applyMovement();
      }
    });
  }
}
