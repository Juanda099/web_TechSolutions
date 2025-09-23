
const TemplateConfig = {
    // Configuración general
    settings: {
        debug: true,  // false en producción
        fallbackToJquery: true,
        autoLoad: true  // Auto-cargar templates al cargar el DOM
    },

    // Definición de templates comunes
    templates: {
        header: {
            elementId: 'header',
            templatePath: 'templates/header.html',
            callback: function(element, html) {
                // Opcional: código a ejecutar después de cargar el header
                console.log('Header loaded, initializing navigation...');
                // Aquí puedes agregar lógica específica del header
            }
        },
        footer: {
            elementId: 'footer',
            templatePath: 'templates/footer.html',
            callback: function(element, html) {
                // Opcional: código a ejecutar después de cargar el footer
                console.log('Footer loaded, current year updated...');
                // Actualizar año actual en el footer si es necesario
                const yearSpan = element.querySelector('.current-year');
                if (yearSpan) {
                    yearSpan.textContent = new Date().getFullYear();
                }
            }
        }
    },

    // Templates específicos por página
    pageTemplates: {
        'index.html': ['header', 'footer'],
        'servicios.html': ['header', 'footer'],
        'login.html': ['header', 'footer'],
        'admin.html': ['header', 'footer']
    },

    // Método de conveniencia para obtener templates de la página actual
    getTemplatesForCurrentPage: function() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        return this.pageTemplates[currentPage] || ['header', 'footer'];
    }
};

// Hacer disponible globalmente
window.TemplateConfig = TemplateConfig;