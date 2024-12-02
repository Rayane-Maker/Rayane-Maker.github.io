import * as Common from './common.js';



const navbarButton = document.querySelector("#menu-button");
const navbar = document.querySelector('nav');


navbarButton.addEventListener('click', function () {
  navbarButton.classList.toggle('active');
  navbar.classList.toggle('active');
})









/************************************************************************************* */

function popAt(arr, item){
  let index = arr.indexOf(item);
  arr.splice(index, 1);
}

class Point {
  constructor(x,y, pairs=new Array(0)) {
    this.x = x;
    this.y = y;
    this.pairs = pairs;
  }
  
}


class Line {
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


class Particle {
  constructor(parentSelector, imageUrl, width, height, quadTree, maxInitialAccelMagnitude=1) {

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

    // Initial kinematics
    this.maxInitialAccelMagnitude =  maxInitialAccelMagnitude;
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
    this.updatePosition(parent);

    // Start moving the neuron
    this.move(parent);
  }

  
  // Function to update the position based on current position and direction
  updatePosition(parent) {
    this.last = performance.now();

    this.parentWidth = parent.offsetWidth;
    this.parentHeight = parent.offsetHeight;

    this.speed.x += this.acceleration.x * this.dt;
    this.speed.y += this.acceleration.y * this.dt;
    
    // Calculate new position based on speed and angle
    this.position.x += this.speed.x * this.dt;
    this.position.y += this.speed.y * this.dt;
    


    // Ensure the ball stays within the container bounds (bouncing logic)
    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;
    
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
  move(parent) {

    // Update position based on direction and speed
    this.updatePosition(parent);
    this.quadTree.add(this.position);
    this.quadTree.remove(this.position);
    //this.quadTree.render(parent);


    // On Exit Collision Handling
    for (let j = 0; j < this.position.pairs.length; j++){
      let deltaX = this.position.x - this.position.pairs[j].x;
      let deltaY = this.position.y - this.position.pairs[j].y;
      let d = deltaX*deltaX + deltaY*deltaY;
      if (Math.sqrt(d) > collisionDist){
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

class QuadTree {

  constructor(position, width, height, parent=null, depth=0, index=0, maxDepth=2) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.index = index;
    this.data = new Array(0);
    this.childs = new Array(4);
    this.neighboords = null;
    this.index = index;
    this.subdivided = false;
    this.isRendering = false;
    this.parent = parent;
    this.maxDepth = maxDepth;
  }


  add(point){

    if (!this.contains(point)){return;}

    if (!this.data.includes(point)){
      this.data.push(point);
    }
  

    if (this.data.length > 1){this.subdivide();}

    if (this.subdivided){
      for (let i = 0; i < this.childs.length; i++){
        this.childs[i].add(point);
      }
    }
    
    // Collision handling
    if (this.data.length > 1 && this.depth == this.maxDepth){
      for (let i = 0; i < this.data.length; i++){
        for (let j = i+1; j < this.data.length; j++){
          let deltaX = this.data[i].x - this.data[j].x;
          let deltaY = this.data[i].y - this.data[j].y;
          let d = deltaX*deltaX + deltaY*deltaY;
          if (Math.sqrt(d) <= collisionDist){
            if (this.data[i].pairs.length > 0){
            if (!this.data[i].pairs.includes(this.data[j])){
              this.data[i].pairs.push(this.data[j]);
            }
          }else{
            this.data[i].pairs.push(this.data[j]);
          }
          }
        }
      }
    }

  }


  remove(point){

    if (!this.data.includes(point)){return;}  

    if (!this.contains(point)){
      popAt(this.data, point);
    }
    
    if (this.data.length == 1){
      this.unify();
    }

    if (this.subdivided){
      for (let i = 0; i < 4; i++){
        this.childs[i].remove(point);
      }
    }
  
  }


  contains(point){
    let x = point.x - this.position.x;
    let y = point.y - this.position.y;
    return 0 <= x && x < this.width && 0 <= y && y < this.height;
  }

  // Check if contained by a child
  childContains(point){
    let x = point.x - this.position.x;
    let y = point.y - this.position.y;
    let index = -1;

    index = Math.floor(x/(this.width/2)) + 2 * Math.floor(y/(this.height/2));

    return index;
  }

  subdivide(){
    if (this.subdivided) {return this.childs;}
    if (this.depth >= this.maxDepth) {return this.childs;}

    for (let i = 0; i < this.childs.length; i++){
      let position = new Point(this.position.x + ((i%2)*this.width/2), this.position.y + Math.floor(i/2)*this.height/2); //Compute absolute position of child
      let width = this.width/2;
      let height = this.height/2;
      this.childs[i] = new QuadTree(position, width, height, this, this.depth + 1, i, this.maxDepth);
    }
    this.subdivided = true;
    return this.childs;
  }


  unify(){
    if (!this.subdivided) {return;}
    this.clearRender();
    for (let i = 0; i < this.childs.length; i++){
      //if (this.childs[i].isRendering){this.childs[i].clearRender();}
      this.childs[i] = null;
    }
    this.subdivided = false;
  }


  render(parentUI, enableBorderOffset=true){
    
    this.borderSize = 0.5;

    // Create the element
    if(!this.isRendering){
      const id = Math.floor(Math.random()*1000);
      //console.log("efez");
      this.rectUI = document.createElement(`div-${id}`);
      parentUI.appendChild(this.rectUI);
    }
    this.isRendering = true;

    this.rectUI.style.position = 'absolute';
    this.rectUI.style.width = `${this.width - 2 * enableBorderOffset * this.borderSize}px`; 
    this.rectUI.style.height = `${this.height - 2 * enableBorderOffset * this.borderSize}px`; 

    let color = '#7cabf7';
    // if (this.index == 1){color = '#ac00aa'}
    // if (this.index == 2){color = '#ac0017'}
    // if (this.index == 3){color = '#0ccb07'}

    this.rectUI.style.border = `${this.borderSize}px solid ${color}`;
    let offset = new Point(0,0);
    if (this.parent != null) {offset.x = -this.parent.position.x; offset.y = -this.parent.position.y;}
    this.rectUI.style.transform = `translate(${this.position.x + offset.x}px, ${this.position.y + offset.y}px)`;

    if (!this.subdivided) {return;}
    for (let i = 0; i < this.childs.length; i++){
      if (this.childs[i] != undefined){
        this.childs[i].render(this.rectUI, false);
      }
    }
  }

  clearRender(){
    if (this.rectUI == undefined) {return;}
    this.rectUI.remove();
    this.isRendering = false;
  }

}

let particleCount = 25;
let collisionDist = 180;
let maxDepth = 2;
let maxInitialAccelMagnitude = 0.3;
let lineThickness = 1;
let particleColor = "";
const parent = document.querySelector('#hero-background');
let quadTree = new QuadTree(new Point(0,0), parent.offsetWidth, parent.offsetHeight, null, 0, 0, maxDepth);
//quadTree.render(parent);


for (let i=0; i < particleCount; i++ ){
  new Particle('#hero-background', 'media/images/miscs/neuron.png', 6, 6, quadTree, maxInitialAccelMagnitude);
}







