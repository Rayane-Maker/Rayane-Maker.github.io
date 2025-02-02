import QuadTree from './quadTree.js';
import Point from './point.js';
import Line from './line.js';
import popAt from './utils.js';

let lineThickness = 1;

export default class Particle {
    constructor(parentSelector, imageUrl, width, height, quadTree, maxInitialAccelMagnitude=1, collisionDist) {
  
      // Create the element
      this.element = document.createElement('div');
      this.element.style.position = 'absolute'; // Set absolute positioning
      this.element.style.width = `${width}px`; // Set defined width
      this.element.style.height = `${height}px`; // Set defined height
      
      // Outside shape
      this.outter = document.createElement('div');
      this.outter.style.position = 'absolute'; // Set absolute positioning
      this.element.appendChild(this.outter);
      this.outter.src = imageUrl; // Assign the image URL
      this.outter.style.width = '100%'; // Ensure the image fills the div
      this.outter.style.height = '100%'; // Ensure the image fits the div's height
      this.outter.style.objectFit = 'contain'; // Prevent stretching of the image
      this.outter.style.borderRadius = `${height}px`;
      this.outter.style.backgroundColor = `hsl(${160}, 80%, 70%)` ;
      this.outter.style.transition = 'filter 0.3s ease'; // Smooth transition for filter change
      const randomAlpha = Math.random() * 0.6 + 0.4;     // Apply color filter on the image to make it orange-like
      this.outter.style.opacity = randomAlpha;
      const randomHue = 130 + (Math.random() * 20 - 10); // Orange range: 30deg ±10deg
      this.outter.style.filter = 'sepia(3) saturate(360) hue-rotate(170deg)'; // Apply filter to the outter element
      this.outter.style.display = 'flex'; // Set absolute positioning
      this.outter.style.justifyContent = 'center'; // Set absolute positioning
      this.outter.style.alignItems = 'center'; // Set absolute positioning
  
      // Core
      // this.core = document.createElement('div');
      // this.core.style.position = 'absolute'; // Set absolute positioning
      // this.outter.appendChild(this.core);
      // this.core.src = imageUrl; // Assign the image URL
      // this.core.style.width = '70%'; // Ensure the image fills the div
      // this.core.style.height = '70%'; // Ensure the image fits the div's height
      // this.core.style.borderRadius = `${height}px`;
      // this.core.style.backgroundColor = `hsl(${170}, 100%, 10%)` ;
      // this.core.style.transition = 'filter 0.3s ease'; // Smooth transition for filter change
      // this.core.style.opacity = randomAlpha;
      // this.core.style.filter = 'sepia(3) saturate(360) hue-rotate(170deg)'; // Apply filter to the core element
  
      // Find the parent element
      this.parentUI = document.querySelector(parentSelector);
      this.parentWidth = this.parentUI.offsetWidth;
      this.parentHeight = this.parentUI.offsetHeight;

      // Append the element to the parent container
      this.parentUI.appendChild(this.element);
  
  
      this.quadTree = quadTree;
      this.lines = new Array(0);
  
      this.mass = 5;
      this.dt = 1;
      this.collisionDist = collisionDist;

      // Initial kinematics
      this.maxInitialAccelMagnitude = maxInitialAccelMagnitude;
      this.speedMagnitude = 0;
  
      this.angle = Math.random() * 2 * Math.PI; // random direction in radians (0 to 2π)
      this.accelMagnitude = this.maxInitialAccelMagnitude * Math.random();
  
      this.acceleration = {
        x: this.accelMagnitude * Math.sin(this.angle),
        y: this.accelMagnitude * Math.cos(this.angle),
      };
  
  
  
      this.speed = {
        x: this.speedMagnitude * Math.sin(this.angle),
        y: this.speedMagnitude * Math.cos(this.angle),
      };
  
     
      // Generate random initial position
      this.position = new Point(
        Math.random() * (this.parentWidth - width),
        Math.random() * (this.parentHeight - height)
      );
  
      
      // Set initial position
      this.updatePosition();
  
      // Start moving the neuron
      this.move();
    }
  
    
    // Function to update the position based on current position and direction
    updatePosition() {
      this.last = performance.now();
  
      this.parentWidth = this.parentUI.offsetWidth;
      this.parentHeight = this.parentUI.offsetHeight;
  
      this.speed.x += this.acceleration.x * this.dt;
      this.speed.y += this.acceleration.y * this.dt;
      
      // Calculate new position based on speed and angle
      this.position.x += this.speed.x * this.dt;
      this.position.y += this.speed.y * this.dt;
      
      
       // Bounce off the walls
      let left = this.element.offsetWidth/2;
      let right = this.parentWidth - this.element.offsetWidth/2;
      let isLeft = (this.position.x < left);
      let isRight = (this.position.x > right);
      if (isLeft || isRight) {
        this.position.x = isRight ? right : left;
        this.speed.x = -this.speed.x;
      }
  
      let top = this.element.offsetHeight/2;
      let bottom = this.parentHeight - this.element.offsetHeight/2;
      let isTop = (this.position.y < top);
      let isBottom = (this.position.y > bottom);
      if (isTop || isBottom) {
        this.position.y = isBottom ? bottom : top;
        this.speed.y = -this.speed.y;
      }
      
      // Apply the new position with smooth transition
      this.element.style.transition = `transform ${this.dt}}s linear`;
      this.element.style.transform = `translate(${this.position.x - this.element.offsetWidth/2}px, ${this.position.y - this.element.offsetHeight/2}px)`;
  
  
      this.acceleration.x = 0;
      this.acceleration.y = 0;
  
      //this.dt = (performance.now() - this.last)/1000.0;
      //console.log(this.dt);
    }
  
    // Function to move the ball randomly (accumulating position over time)
    move() {
  
      // Update position based on direction and speed
      this.updatePosition(parent);
      this.quadTree.add(this.position);
      this.quadTree.remove(this.position);
      //kjdv
      //this.quadTree.render(parent);
  
  
      // On Exit Collision Handling
      for (let j = 0; j < this.position.pairs.length; j++){
        let deltaX = this.position.x - this.position.pairs[j].x;
        let deltaY = this.position.y - this.position.pairs[j].y;
        let d = deltaX*deltaX + deltaY*deltaY;
        if (Math.sqrt(d) > this.collisionDist){
            popAt(this.position.pairs, this.position.pairs[j]);
            this.eraseLine(j);
  
        }
        else{
          this.drawLine(this.position, this.position.pairs[j], lineThickness, j);
        }
      }
  
      // Continue moving the ball every frame
      requestAnimationFrame(() => this.move(parent)); // Recursively call to keep moving
    }
  
    drawLine(start, end, thickness, id){
  
      if (this.lines.length <= id){
        let line = new Line(this.parentUI, start, end, thickness)
        this.lines.push(line);
      }
  
  
      this.lines[id].render(start, end);
    }
  
    eraseLine(id){
      if (this.lines.length < 0) {return;}
      if (this.lines[id] == undefined) {return;}
      this.lines[id].clearRender();
      popAt(this.lines, this.lines[id]);
    }
  
  }