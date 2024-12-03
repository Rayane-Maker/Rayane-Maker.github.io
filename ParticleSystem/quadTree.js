import popAt from './utils.js';
import Point from './point.js';

export default class QuadTree {
  
    constructor(position, width, height, parent=null, depth=0, index=0, maxDepth=2, collisionDist) {
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
      this.collisionDist = collisionDist;
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
            if (Math.sqrt(d) <= this.collisionDist){
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
        this.childs[i] = new QuadTree(position, width, height, this, this.depth + 1, i, this.maxDepth, this.collisionDist);
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
  

  