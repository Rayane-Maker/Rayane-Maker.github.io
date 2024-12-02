import * as Common from './common.js';
import QuadTree from './ParticleSystem/quadTree.js';
import Particle from './ParticleSystem/particle.js';




/********************** NAVBAR **************************** */

const navbarButton = document.querySelector("#menu-button");
const navbar = document.querySelector('nav');

navbarButton.addEventListener('click', function () {
  navbarButton.classList.toggle('active');
  navbar.classList.toggle('active');
})
const navbarHeight = document.querySelector('nav').offsetHeight;


// // Go to first section via nav button
Common.goToSection('home-link', 'header', navbarHeight);


// // Go to first section via nav button
Common.goToSection('section1-link', 'project-section', navbarHeight);


// // Go to first section via nav button
Common.goToSection('section2-link', 'work-section', navbarHeight);


/************************ HERO PARTICLE SYSTEM ****************************** */

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







