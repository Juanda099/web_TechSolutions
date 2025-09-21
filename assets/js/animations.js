// Animaciones específicas del sitio
$(document).ready(function() {
    // Animación para las cards al aparecer en el viewport
    function animateCards() {
        $('.service-card').each(function() {
            var position = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            
            if (scroll + windowHeight - 100 > position) {
                $(this).addClass('animate__fadeInUp');
            }
        });
    }
    
    // Ejecutar al cargar y al hacer scroll
    animateCards();
    $(window).scroll(animateCards);
    
    // Animación para elementos con la clase "animate-on-scroll"
    function animateOnScroll() {
        $('.animate-on-scroll').each(function() {
            var position = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            
            if (scroll + windowHeight - 150 > position) {
                $(this).addClass('animated');
            }
        });
    }
    
    animateOnScroll();
    $(window).scroll(animateOnScroll);
});