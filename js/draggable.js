export class Draggable {
  constructor(element, handleSelector = '.ipod-screen') { // Changed to entire screen
    this.element = element;
    this.handle = element.querySelector(handleSelector);
    this.isDragging = false;
    this.offset = { x: 0, y: 0 };

    this.init();
  }

  init() {
    if (this.handle) {
      this.handle.addEventListener('mousedown', this.startDrag.bind(this));
    }
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));
  }

  startDrag(e) {
    if (!this.isDragging) {
      this.isDragging = true;
      this.offset = {
        x: e.clientX - this.element.offsetLeft,
        y: e.clientY - this.element.offsetTop
      };
    }
  }

  drag(e) {
    if (!this.isDragging) return;
    this.element.style.left = `${e.clientX - this.offset.x}px`;
    this.element.style.top = `${e.clientY - this.offset.y}px`;
  }

  stopDrag() {
    this.isDragging = false;
  }
}
