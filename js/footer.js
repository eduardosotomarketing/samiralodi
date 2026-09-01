fetch('components/footer.html?v=1.0.8')
.then(response => response.text())
.then(data => {
  document.getElementById('footer').innerHTML = data;
});