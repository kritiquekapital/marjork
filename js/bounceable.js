export class Bounceable {
    static instances = []; // Track all bounceable elements

    constructor(element) {
        this.element = element;
        this.velocity = { x: 0, y: 0 };
        this.friction = 0.92;
        this.clickCount = 0;
        this.isFree = false;
        this.animationFrame = null;
        this.radius = Math.max(element.offsetWidth, element.offsetHeight) / 2;
        Bounceable.instances.push(this);
        
        this.initialPosition = { left: element.offsetLeft, top: element.offsetTop };
        this.element.style.position = 'absolute';
        this.element.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(e) {
        if (!this.isFree) {
            this.clickCount++;
            if (this.clickCount >= 20) {
                this.isFree = true;
                this.velocity = { x: 0, y: 0 };
                this.element.classList.add('free');
                const rect = this.element.getBoundingClientRect();
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
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dirX = centerX - clickX;
        const dirY = centerY - clickY;
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        this.velocity.x = (dirX / length) * 25;
        this.velocity.y = (dirY / length) * 25;
        this.applyBouncePhysics();
    }

    applyBouncePhysics() {
        if (!this.isFree) return;

        Bounceable.instances.forEach(other => {
            if (other !== this && this.isColliding(other)) {
                this.resolveCollision(other);
            }
        });

        const animate = () => {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;

            let newLeft = parseFloat(this.element.style.left) + this.velocity.x;
            let newTop = parseFloat(this.element.style.top) + this.velocity.y;

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

            this.element.style.left = `${newLeft}px`;
            this.element.style.top = `${newTop}px`;

            if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    isColliding(other) {
        const rect1 = this.element.getBoundingClientRect();
        const rect2 = other.element.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    resolveCollision(other) {
        const rect1 = this.element.getBoundingClientRect();
        const rect2 = other.element.getBoundingClientRect();
        
        const dx = (rect1.left + rect1.width / 2) - (rect2.left + rect2.width / 2);
        const dy = (rect1.top + rect1.height / 2) - (rect2.top + rect2.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = this.radius + other.radius;

        if (distance < minDistance) {
            const nx = dx / distance;
            const ny = dy / distance;
            const rvx = other.velocity.x - this.velocity.x;
            const rvy = other.velocity.y - this.velocity.y;
            const speed = rvx * nx + rvy * ny;
            const impulse = 2 * speed / (1 + 1);

            this.velocity.x += impulse * nx;
            this.velocity.y += impulse * ny;
            other.velocity.x -= impulse * nx;
            other.velocity.y -= impulse * ny;

            const overlap = minDistance - distance;
            this.element.style.left = `${parseFloat(this.element.style.left) + nx * overlap / 2}px`;
            this.element.style.top = `${parseFloat(this.element.style.top) + ny * overlap / 2}px`;
            other.element.style.left = `${parseFloat(other.element.style.left) - nx * overlap / 2}px`;
            other.element.style.top = `${parseFloat(other.element.style.top) - ny * overlap / 2}px`;
        }
    }
}
