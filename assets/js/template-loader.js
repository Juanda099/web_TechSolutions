
class TemplateLoader {
    constructor(options = {}) {
        this.debug = options.debug || false;
        this.fallbackToJquery = options.fallbackToJquery !== false;
    }

    /**
     * Carga un template HTML y lo inyecta en un elemento
     * @param {string} elementId - ID del elemento donde cargar el template
     * @param {string} templatePath - Ruta del archivo template
     * @param {function} callback - Función opcional a ejecutar después de cargar
     */
    async loadTemplate(elementId, templatePath, callback = null) {
        const element = document.getElementById(elementId);
        
        if (!element) {
            console.error(`Element with ID '${elementId}' not found`);
            return false;
        }

        try {
            const response = await fetch(templatePath);
            
            if (response.ok) {
                const html = await response.text();
                element.innerHTML = html;
                
                if (this.debug) {
                    console.log(`✅ Template '${templatePath}' loaded successfully into '#${elementId}'`);
                }
                
                // Ejecutar callback si se proporciona
                if (callback && typeof callback === 'function') {
                    callback(element, html);
                }
                
                return true;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`❌ Error loading template '${templatePath}':`, error.message);
            
            // Fallback a jQuery si está disponible y está habilitado
            if (this.fallbackToJquery && typeof $ !== 'undefined') {
                return this.loadTemplateWithJquery(elementId, templatePath, callback);
            }
            
            return false;
        }
    }

    /**
     * Método fallback usando jQuery
     * @param {string} elementId - ID del elemento
     * @param {string} templatePath - Ruta del template
     * @param {function} callback - Callback opcional
     */
    loadTemplateWithJquery(elementId, templatePath, callback = null) {
        if (this.debug) {
            console.log(`🔄 Using jQuery fallback for '${templatePath}'`);
        }

        $(`#${elementId}`).load(templatePath, (response, status, xhr) => {
            if (status === "error") {
                console.error(`❌ jQuery fallback failed: ${xhr.status} ${xhr.statusText}`);
                return false;
            } else {
                if (this.debug) {
                    console.log(`✅ jQuery loaded '${templatePath}' successfully`);
                }
                
                if (callback && typeof callback === 'function') {
                    const element = document.getElementById(elementId);
                    callback(element, response);
                }
                
                return true;
            }
        });
    }

    /**
     * Carga múltiples templates de una vez
     * @param {Array} templates - Array de objetos {elementId, templatePath, callback}
     */
    async loadMultipleTemplates(templates) {
        const promises = templates.map(template => 
            this.loadTemplate(template.elementId, template.templatePath, template.callback)
        );
        
        try {
            const results = await Promise.all(promises);
            const successful = results.filter(result => result === true).length;
            
            if (this.debug) {
                console.log(`📊 Loaded ${successful}/${templates.length} templates successfully`);
            }
            
            return results;
        } catch (error) {
            console.error('❌ Error loading multiple templates:', error);
            return false;
        }
    }

    /**
     * Método de conveniencia para cargar header y footer
     */
    async loadCommonTemplates() {
        return this.loadMultipleTemplates([
            { elementId: 'header', templatePath: 'templates/header.html' },
            { elementId: 'footer', templatePath: 'templates/footer.html' }
        ]);
    }
}

// Crear una instancia global para uso fácil
const templateLoader = new TemplateLoader({ 
    debug: true,  // Cambiar a false en producción
    fallbackToJquery: true 
});

// Auto-inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing template loader...');
    
    // Usar configuración si está disponible
    if (typeof TemplateConfig !== 'undefined' && TemplateConfig.settings.autoLoad) {
        const templateNames = TemplateConfig.getTemplatesForCurrentPage();
        const templates = templateNames.map(name => TemplateConfig.templates[name]).filter(t => t);
        
        if (templates.length > 0) {
            templateLoader.loadMultipleTemplates(templates);
        } else {
            // Fallback a los templates comunes
            templateLoader.loadCommonTemplates();
        }
    } else {
        // Sin configuración, usar método por defecto
        templateLoader.loadCommonTemplates();
    }
});

// Exportar para uso en otros scripts (si se necesita)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateLoader;
}