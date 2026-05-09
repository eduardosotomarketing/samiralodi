fetch('components/header.html')
.then(response => response.text())
.then(data => {
  document.getElementById('header').innerHTML = data;

  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-menu');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
});