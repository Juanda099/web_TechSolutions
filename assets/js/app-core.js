/**
 * =====================================================
 * APP-CORE.JS - Funcionalidades Principales del Sitio
 * =====================================================
 * Consolida: load-header.js, load-footer.js, main.js, animations.js
 * Funcionalidades: Templates, navegación, animaciones básicas
 */

class TechSolutionsApp {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.isLoading = false;
        this._intersectionObserver = null;
        this.init();
    }

    // ===== INICIALIZACIÓN =====
    init() {
        this.setupEventListeners();
        this.loadTemplates();
        this.initAnimations();
    }

    setupEventListeners() {
        // Cargar cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }

        // Manejar cambios de página
        window.addEventListener('beforeunload', () => this.onPageUnload());
        window.addEventListener('scroll', () => this.onScroll());
    }

    onDOMReady() {
        this.loadTemplates();
        this.initAnimations();
        this.setupNavigation();
    }

    onPageUnload() {
        // Limpiar recursos si es necesario
    }

    onScroll() {
        // Animaciones en scroll (si son necesarias)
        this.animateOnScroll();
    }

    // ===== GESTIÓN DE TEMPLATES =====
    async loadTemplates() {
        const templates = [
            { id: 'header-container', path: 'templates/header.html', callback: () => this.setupNavigation() },
            { id: 'footer-container', path: 'templates/footer.html', callback: () => this.updateFooterYear() }
        ];

        for (const template of templates) {
            await this.loadTemplate(template.id, template.path, template.callback);
        }
    }

    async loadTemplate(elementId, templatePath, callback = null) {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            const response = await fetch(templatePath);
            if (response.ok) {
                const html = await response.text();
                element.innerHTML = html;
                
                // Ejecutar callback si existe
                if (callback && typeof callback === 'function') {
                    callback();
                }
            } else {
                console.error(`Error loading ${templatePath}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error loading template ${templatePath}:`, error);
        }
    }

    // ===== NAVEGACIÓN =====
    setupNavigation() {
        this.activateCurrentLink();
        this.setupMobileMenu();
    }

    activateCurrentLink() {
        const links = document.querySelectorAll(".navbar-nav .nav-link");
        const currentPath = this.currentPage;

        links.forEach(link => {
            const linkPath = link.getAttribute("href");
            if (linkPath === currentPath) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    setupMobileMenu() {
        // Cerrar menú móvil al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }

    // ===== ANIMACIONES =====
    initAnimations() {
        this.setupIntersectionObserver();
        this.animateCards();
    }

    setupIntersectionObserver() {
        // Reutiliza un solo observer para toda la app
        if (!this._intersectionObserver) {
            this._intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        // Una vez animado, deja de observarlo para ahorrar recursos
                        this._intersectionObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
        }

        // Observar elementos iniciales presentes en el DOM
        this.observeElements(document);
    }

    // Expone una utilidad pública para observar elementos dinámicos insertados luego
    observeElements(root = document) {
        if (!this._intersectionObserver) return;
        root.querySelectorAll('.servicio-item, .card, .hero-text').forEach(el => {
            // Evita observar elementos ya animados
            if (!el.classList.contains('animate-in')) {
                this._intersectionObserver.observe(el);
            }
        });
    }

    animateCards() {
        // Agregar clase CSS para animaciones suaves
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .servicio-item,
            .card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    animateOnScroll() {
        // Animación simple para elementos en scroll
        const elements = document.querySelectorAll('.servicio-item:not(.animate-in)');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                element.classList.add('animate-in');
            }
        });
    }

    // ===== UTILIDADES =====
    getCurrentPage() {
        return window.location.pathname.split("/").pop() || 'index.html';
    }

    updateFooterYear() {
        const yearElements = document.querySelectorAll('.current-year, .footer-year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }

    // ===== LOADING STATES =====
    showLoading(container = document.body) {
        this.isLoading = true;
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-border spinner-border-corporate" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        `;
        container.appendChild(spinner);
    }

    hideLoading() {
        this.isLoading = false;
        const spinners = document.querySelectorAll('.loading-spinner');
        spinners.forEach(spinner => spinner.remove());
    }

    // ===== NOTIFICACIONES =====
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getIconForType(type)} me-2"></i>
                ${message}
                <button class="btn-close-notification" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Estilos para notificaciones
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    padding: 15px 20px;
                    border-radius: 5px;
                    color: white;
                    min-width: 300px;
                    animation: slideInRight 0.3s ease-out;
                }
                
                .notification-info { background-color: var(--info-color); }
                .notification-success { background-color: var(--success-color); }
                .notification-warning { background-color: var(--warning-color); }
                .notification-error { background-color: var(--danger-color); }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .btn-close-notification {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 10px;
                }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto-remove
        if (duration > 0) {
            setTimeout(() => {
                notification.remove();
            }, duration);
        }
    }

    getIconForType(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    // ===== DEBUGGING =====
    log(message, data = null) {
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
            console.log(`[TechSolutions] ${message}`, data || '');
        }
    }

    // ===== API PÚBLICA =====
    static getInstance() {
        if (!window.techSolutionsApp) {
            window.techSolutionsApp = new TechSolutionsApp();
        }
        return window.techSolutionsApp;
    }
}

// ===== FUNCIONES GLOBALES PARA COMPATIBILIDAD =====
function loadTemplate(elementId, templatePath) {
    return TechSolutionsApp.getInstance().loadTemplate(elementId, templatePath);
}

function showNotification(message, type, duration) {
    return TechSolutionsApp.getInstance().showNotification(message, type, duration);
}

// ===== INICIALIZACIÓN AUTOMÁTICA =====
window.TechSolutionsApp = TechSolutionsApp;
TechSolutionsApp.getInstance();