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
      this.velocity = { x: 0, y: 0 };
      this.element.classList.add('free');

      // Get current position relative to viewport
      const rect = this.element.getBoundingClientRect(); // <-- Add this back
      
      // Switch to fixed positioning with scroll compensation
      this.element.style.position = 'fixed';
      this.element.style.left = `${rect.left + window.scrollX}px`;
      this.element.style.top = `${rect.top + window.scrollY}px`;
    }
  } else {
    this.moveOppositeDirection(e.clientX, e.clientY);
  }
}

moveOppositeDirection(clickX, clickY) {
  const rect = this.element.getBoundingClientRect();
  
  // Calculate click position relative to button center
  const centerX = rect.left + rect.width/2;
  const centerY = rect.top + rect.height/2;
  
  // Calculate direction vector from click to center
  const dirX = centerX - clickX;
  const dirY = centerY - clickY;
  
  // Normalize vector and apply force
  const length = Math.sqrt(dirX*dirX + dirY*dirY);
  this.velocity.x = (dirX/length) * 25; // Force multiplier
  this.velocity.y = (dirY/length) * 25;

  this.applyBouncePhysics();
}

applyBouncePhysics() {
  if (!this.isFree) return;

  const animate = () => {
    // Apply friction
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    // Update position
    let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
    let newTop = parseFloat(this.element.style.top) + this.velocity.y;

    // Viewport boundaries
    const maxX = window.innerWidth - this.element.offsetWidth;
    const maxY = window.innerHeight - this.element.offsetHeight;

    // Bounce physics with energy preservation
    if (newLeft < 0) {
      newLeft = 0;
      this.velocity.x *= -0.9; // Reverse direction with slight energy loss
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

    this.element.style.left = `${newLeft}px`;
    this.element.style.top = `${newTop}px`;

    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
  }
}
