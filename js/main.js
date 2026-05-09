const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav-menu');

if(toggle){
  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

const newsletterForm = document.getElementById('newsletter-form');

if(newsletterForm){
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    alert('Gracias por suscribirte.');
  });
}