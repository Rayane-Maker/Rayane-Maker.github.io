
export function goToSection(buttonClass, sectionId, navbarHeight) {
  const navbar = document.querySelector('nav');
  const buttons = document.getElementsByClassName(buttonClass);
  const menuButton = document.querySelector("#menu-button");

  Array.from(buttons).forEach(elt => {
    elt.addEventListener('click', function () {
      const section = document.getElementById(sectionId);
      const scrollToPosition = section.offsetTop - navbarHeight;
      window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
      navbar.classList.remove('active');
      menuButton.classList.remove('active');
    });
  });
}

export function goToURL(buttonClass, url) {
  const buttons = document.getElementsByClassName(buttonClass);

  Array.from(buttons).forEach(elt => {
    elt.addEventListener('click', function () {
      //window.location.href = url;
      window.location.assign(url);
    });
  });
}