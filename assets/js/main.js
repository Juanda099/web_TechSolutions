// Función para cargar templates usando fetch
async function loadTemplate(elementId, templatePath) {
    try {
        const response = await fetch(templatePath);
        if (response.ok) {
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
        } else {
            console.error(`Error loading ${templatePath}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${templatePath}:`, error);
        // Fallback: usar jQuery si está disponible
        if (typeof $ !== 'undefined') {
            $(`#${elementId}`).load(templatePath);
        }
    }
}

// Funcionalidades generales del sitio
$(document).ready(function() {
    // Efecto de desplazamiento suave para los enlaces
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = this.hash;
        var $target = $(target);
        $('html, body').animate({
            'scrollTop': $target.offset().top
        }, 800, 'swing');
    });
    
    // Tooltip de Bootstrap
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Popover de Bootstrap
    $('[data-bs-toggle="popover"]').popover();
});