import * as Common from './scripts/common.js';
import QuadTree from './scripts/particleSystem/quadTree.js';
import Particle from './scripts/particleSystem/particle.js';
import Point from './scripts/particleSystem/point.js';
import loadGridData from './scripts/fileHandling/jsonLoader.js'



/********************** NAVBAR **************************** */

const navbarButton = document.querySelector("#menu-button");
const navbar = document.querySelector('nav');

navbarButton.addEventListener('click', function () {
  navbarButton.classList.toggle('active');
  navbar.classList.toggle('active');
})
const navbarHeight = document.querySelector('nav').offsetHeight;


// Home
Common.goToSection('home-link', 'header', navbarHeight);


// Projects
Common.goToSection('section1-link', 'project-section', navbarHeight);


// Work experiences
Common.goToSection('section2-link', 'work-section', navbarHeight);

// CV
Common.goToURL('about-link', "resume/resume.pdf");


/************************ HERO PARTICLE SYSTEM ****************************** */

let particleCount = 25;
let collisionDist = 180;
let maxDepth = 2;
let maxInitialAccelMagnitude = 0.3;
const parent = document.querySelector('#hero-background');
let quadTree = new QuadTree(new Point(0,0), parent.offsetWidth, parent.offsetHeight, null, 0, 0, maxDepth, collisionDist);
//quadTree.render(parent);

for (let i=0; i < particleCount; i++ ){
  new Particle('#hero-background', 'media/images/miscs/neuron.png', 6, 6, quadTree, maxInitialAccelMagnitude, collisionDist);
}


/********************* Project Grid ********************** */
loadGridData("projects-grid", "project-cell-template");



/**********************  Form  ************************ */
