
export function goToSection(buttonClass, sectionId) {
    const buttons = document.getElementsByClassName(buttonClass);
    const sidebarButton = document.querySelector("#sidebar-button");
  
    Array.from(buttons).forEach(elt => {
      elt.addEventListener('click', function() {
        const section = document.getElementById(sectionId);
        const navbarHeight = document.querySelector('nav').offsetHeight;
        const scrollToPosition = section.offsetTop - navbarHeight;
        window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
        sidebar.classList.remove('active');
        sidebarButton.classList.remove('active');
      });
    });
  }