// Modify bounceable.js to detect draggable elements
import { Draggable } from "./draggable.js";

export class Bounceable {
    static instances = []; // Track all bounceable elements
    static draggableInstances = []; // Track draggable elements

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
        this.element.style.position = "absolute";
        this.element.addEventListener("click", this.handleClick.bind(this));
    }

    static registerDraggable(draggable) {
        Bounceable.draggableInstances.push(draggable);
    }

    applyBouncePhysics() {
        if (!this.isFree) return;

        [...Bounceable.instances, ...Bounceable.draggableInstances].forEach(other => {
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

            if (newLeft < 0 || newLeft > maxX) {
                this.velocity.x *= -0.9;
                newLeft = Math.max(0, Math.min(maxX, newLeft));
            }
            if (newTop < 0 || newTop > maxY) {
                this.velocity.y *= -0.9;
                newTop = Math.max(0, Math.min(maxY, newTop));
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
        return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    }

    resolveCollision(other) {
        const dx = this.element.offsetLeft - other.element.offsetLeft;
        const dy = this.element.offsetTop - other.element.offsetTop;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = this.radius + (other.radius || Math.max(other.element.offsetWidth, other.element.offsetHeight) / 2);

        if (distance < minDistance) {
            const nx = dx / distance;
            const ny = dy / distance;
            this.velocity.x += nx * 5;
            this.velocity.y += ny * 5;
            other.velocity.x -= nx * 5;
            other.velocity.y -= ny * 5;
        }
    }
}
