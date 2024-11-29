import * as Common from './common.js';



  
// if (window.location.pathname === '/about.html') {
//   // Action à exécuter uniquement sur about.html
//   console.log("Vous êtes sur la page About !");
//   // Vous pouvez également ajouter d'autres actions ici
//   alert("Bienvenue sur la page À propos !");
// }

// // Si vous voulez faire quelque chose sur la page d'accueil
// if (window.location.pathname === 'index.html') {
//   console.log("Vous êtes sur la page d'accueil !");
//   // Autres actions pour la page d'accueil
// }


// Sidebar and sandwich button
const sidebarButton = document.querySelector("#sidebar-button");
const sidebar = document.querySelector('#sidebar');


sidebarButton.addEventListener('click', function () {
sidebarButton.classList.toggle('active');
sidebar.classList.toggle('active');
})

Common.goToSection2("contact-button", "contact-footer", "index.html#title-5");

  