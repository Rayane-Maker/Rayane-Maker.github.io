import Point from './point.js';

export default class Line {
  constructor(parentUI, start, end, thickness) {
    this.parentUI = parentUI;
    this.start = new Point(start.x, start.y);
    this.end = new Point(end.x, end.y);

    // Ensure this.start.x is less than this.end.x for consistency
    if (this.start.x > this.end.x) {
      [this.start, this.end] = [this.end, this.start];
    }

    // Calculate differences
    let deltaX = this.end.x - this.start.x;
    let deltaY = this.end.y - this.start.y;

    // Calculate length and angle
    this.length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    this.angle = Math.atan2(deltaY, deltaX);

    // UI Element
    let color = '#7cabf7';
    this.element = document.createElement('div');
    this.element.style.backgroundColor = color;
    this.element.style.position = 'absolute';
    this.element.style.width = `${this.length}px`;
    this.element.style.height = `${thickness}px`;
    this.element.style.transformOrigin = '0% 50%';

    // Correct translation and rotation
    this.element.style.transform = `translate(${this.start.x}px, ${this.start.y}px) rotate(${this.angle}rad)`;

    this.parentUI.appendChild(this.element);
  }



  render(start, end){
    if (this.element == undefined) {return;}

    this.start = new Point(start.x, start.y);
    this.end = new Point(end.x, end.y);

    // Ensure this.start.x is less than this.end.x for consistency
    if (this.start.x > this.end.x) {
      [this.start, this.end] = [this.end, this.start];
    }

    // Calculate differences
    let deltaX = this.end.x - this.start.x;
    let deltaY = this.end.y - this.start.y;

    // Calculate length and angle
    this.length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    this.angle = Math.atan2(deltaY, deltaX);

    // UI Element
    this.element.style.position = 'absolute';
    this.element.style.width = `${this.length}px`;
    this.element.style.transformOrigin = '0% 50%';

    // Correct translation and rotation
    this.element.style.transform = `translate(${this.start.x}px, ${this.start.y}px) rotate(${this.angle}rad)`;
  }

  clearRender(){
    if (this.element == undefined) {return;}
    this.element.remove();
  }

}
