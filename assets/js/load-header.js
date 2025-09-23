// assets/js/load-header.js
document.addEventListener("DOMContentLoaded", function () {
  fetch("templates/header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;
      activarLinkActual();
    })
    .catch(error => console.error("Error al cargar el header:", error));
});

function activarLinkActual() {
  const links = document.querySelectorAll(".navbar-nav .nav-link");
  const currentPath = window.location.pathname.split("/").pop(); // Ej: "servicios.html"

  links.forEach(link => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

