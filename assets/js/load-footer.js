// assets/js/load-footer.js
document.addEventListener("DOMContentLoaded", function () {
  fetch("templates/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-container").innerHTML = data;
    })
    .catch(error => console.error("Error al cargar el footer:", error));
});
