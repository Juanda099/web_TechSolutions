/**
 * =====================================================
 * APP-SERVICES.JS - Sistema de Servicios Consolidado  
 * =====================================================
 * Consolida: services-renderer.js + funcionalidades de servicios
 * Funcionalidades: Renderizado, contratación, servicios relacionados
 */

class ServicesRenderer {
    constructor() {
        this.currentServiceId = null;
        this.init();
    }

    // ===== INICIALIZACIÓN =====
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onReady());
        } else {
            this.onReady();
        }
    }

    onReady() {
        // Verificar que las dependencias estén cargadas
        if (!window.servicesManager) {
            console.warn('ServicesDataManager no está disponible. Reintentando en 100ms...');
            setTimeout(() => this.onReady(), 100);
            return;
        }

        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'servicios.html') {
            this.renderServicesPage();
        } else if (currentPage === 'detalles-servicio.html') {
            this.renderServiceDetails();
        }
    }

    // ===== RENDERIZADO DE PÁGINAS =====
    renderServicesPage() {
        const container = document.querySelector('.servicios-container');
        if (!container) return;

        const services = window.servicesManager?.getAllActiveServices() || [];
        
        if (services.length === 0) {
            container.innerHTML = this.getEmptyServicesHTML();
            // Asegurar que los elementos dinámicos se observen/animen
            window.TechSolutionsApp?.getInstance()?.observeElements(container);
            return;
        }

        container.innerHTML = services.map(service => this.getServiceCardHTML(service)).join('');
        // Observar los nuevos elementos para animación/visibilidad
        window.TechSolutionsApp?.getInstance()?.observeElements(container);
    }

    renderServiceDetails() {
        const container = document.getElementById('detalles-servicios-container');
        if (!container) return;

        const serviceId = new URLSearchParams(window.location.search).get('id');
        
        if (!serviceId) {
            container.innerHTML = this.getServiceNotFoundHTML();
            return;
        }

        const service = window.servicesManager?.getServiceById(serviceId);
        
        if (!service || !service.active) {
            container.innerHTML = this.getServiceNotFoundHTML();
            return;
        }

        this.currentServiceId = serviceId;
        this.updatePageTitle(service.name);
        this.updateBreadcrumb(service.name);
        
        container.innerHTML = this.getServiceDetailsHTML(service);
        // Observar tarjetas e Items recién insertados
        window.TechSolutionsApp?.getInstance()?.observeElements(container);
        this.loadRelatedServices(serviceId);
    }

    // ===== TEMPLATES HTML =====
    getServiceCardHTML(service) {
        return `
            <div class="servicio-item" data-service-id="${service.id}">
                <img src="${service.image}" alt="${service.name}" loading="lazy">
                <h3>${service.name}</h3>
                <p>Desde <strong>$${service.price.toLocaleString()}</strong></p>
                <a href="detalles-servicio.html?id=${service.id}">
                    <button>Ver Detalles</button>
                </a>
            </div>
        `;
    }

    getServiceDetailsHTML(service) {
        return `
            <div class="row">
                <!-- Imagen del servicio -->
                <div class="col-lg-6 mb-4">
                    <div class="card card-corporate h-100">
                        <img src="${service.image}" alt="${service.name}" class="card-img-top" 
                             style="height: 400px; object-fit: cover;" loading="lazy">
                    </div>
                </div>
                
                <!-- Información del servicio -->
                <div class="col-lg-6 mb-4">
                    <div class="card card-corporate h-100">
                        <div class="card-body d-flex flex-column">
                            <h1 class="card-title h2 mb-4 text-corporate">${service.name}</h1>
                            
                            <div class="mb-4">
                                <h3 class="h4 text-corporate mb-2">Desde $${service.price.toLocaleString()}</h3>
                                <p class="text-corporate-light mb-0">
                                    <i class="fas fa-check-circle text-success me-2"></i>
                                    Disponible (${service.quantity || 1} ${service.quantity === 1 ? 'unidad' : 'unidades'})
                                </p>
                            </div>

                            ${this.getServiceFeaturesHTML()}

                            <div class="d-grid gap-2">
                                <button class="btn-corporate btn-lg w-100" onclick="servicesRenderer.contractService(${service.id})">
                                    <i class="fas fa-shopping-cart me-2"></i>
                                    Contratar Servicio
                                </button>
                                <button class="btn-corporate-outline w-100" onclick="history.back()">
                                    <i class="fas fa-arrow-left me-2"></i>
                                    Volver Atrás
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Descripción detallada -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card card-corporate">
                        <div class="card-header">
                            <h3 class="card-title h4 mb-0">
                                <i class="fas fa-info-circle me-2"></i>
                                Descripción Detallada
                            </h3>
                        </div>
                        <div class="card-body">
                            <p class="lead text-corporate-light mb-0">${service.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Servicios relacionados -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card card-corporate">
                        <div class="card-header">
                            <h3 class="card-title h4 mb-0">
                                <i class="fas fa-lightbulb me-2"></i>
                                Otros Servicios que te Podrían Interesar
                            </h3>
                        </div>
                        <div class="card-body">
                            <div id="related-services-container">
                                <div class="text-center p-3">
                                    <div class="spinner-border spinner-border-corporate spinner-border-sm" role="status">
                                        <span class="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getServiceFeaturesHTML() {
        return `
            <div class="mb-4 flex-grow-1">
                <h4 class="h5 mb-3 text-corporate">Características principales:</h4>
                <div class="row g-3">
                    <div class="col-6">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-star text-warning me-2"></i>
                            <small class="text-corporate-light">Calidad Premium</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-clock text-corporate me-2"></i>
                            <small class="text-corporate-light">Entrega Rápida</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-headset text-corporate me-2"></i>
                            <small class="text-corporate-light">Soporte 24/7</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-shield-alt text-success me-2"></i>
                            <small class="text-corporate-light">Garantía Incluida</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getEmptyServicesHTML() {
        return `
            <div class="text-center p-5">
                <div class="card card-corporate mx-auto" style="max-width: 400px;">
                    <div class="card-body">
                        <i class="fas fa-exclamation-circle text-warning fa-3x mb-3"></i>
                        <h4 class="text-corporate">No hay servicios disponibles</h4>
                        <p class="text-corporate-light">En este momento no hay servicios activos.</p>
                        <a href="index.html" class="btn-corporate text-decoration-none">Volver al Inicio</a>
                    </div>
                </div>
            </div>
        `;
    }

    getServiceNotFoundHTML() {
        return `
            <div class="text-center py-5">
                <div class="card card-corporate mx-auto" style="max-width: 500px;">
                    <div class="card-body">
                        <i class="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
                        <h4 class="card-title text-corporate">Servicio no encontrado</h4>
                        <p class="card-text text-corporate-light">El servicio que buscas no está disponible o no existe.</p>
                        <div class="d-grid gap-2">
                            <a href="servicios.html" class="btn-corporate text-center text-decoration-none">
                                <i class="fas fa-arrow-left me-2"></i>
                                Volver a Servicios
                            </a>
                            <a href="index.html" class="btn-corporate-outline text-center text-decoration-none">
                                <i class="fas fa-home me-2"></i>
                                Ir al Inicio
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== SERVICIOS RELACIONADOS =====
    loadRelatedServices(currentServiceId) {
        const container = document.getElementById('related-services-container');
        if (!container) return;

        const allServices = window.servicesManager?.getAllActiveServices() || [];
        const relatedServices = allServices
            .filter(service => service.id !== parseInt(currentServiceId))
            .slice(0, 3);

        if (relatedServices.length === 0) {
            container.innerHTML = '<p class="text-corporate-light">No hay otros servicios disponibles en este momento.</p>';
            return;
        }

        container.innerHTML = `
            <div class="row g-3">
                ${relatedServices.map(service => `
                    <div class="col-md-4">
                        <div class="card card-corporate h-100">
                            <img src="${service.image}" alt="${service.name}" class="card-img-top" 
                                 style="height: 150px; object-fit: cover;" loading="lazy">
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title text-corporate">${service.name}</h6>
                                <p class="text-corporate fw-bold mb-2">Desde $${service.price.toLocaleString()}</p>
                                <div class="mt-auto">
                                    <a href="detalles-servicio.html?id=${service.id}" class="btn-corporate-outline w-100 text-center text-decoration-none">
                                        Ver Detalles
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        // Observar elementos relacionados insertados
        window.TechSolutionsApp?.getInstance()?.observeElements(container);
    }

    // ===== CONTRATACIÓN DE SERVICIOS =====
    contractService(serviceId) {
        const service = window.servicesManager?.getServiceById(serviceId);
        if (!service) return;

        this.showContractModal(service);
    }

    showContractModal(service) {
        // Remover modal existente
        const existingModal = document.getElementById('contractModal');
        if (existingModal) existingModal.remove();

        const modalHTML = this.getContractModalHTML(service);
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById('contractModal'));
        modal.show();
        // Observar contenido del modal (por si aplica animación en .card dentro)
        window.TechSolutionsApp?.getInstance()?.observeElements(document.getElementById('contractModal'));
    }

    getContractModalHTML(service) {
        return `
            <div class="modal fade" id="contractModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header" style="background-color: var(--primary-color); color: white;">
                            <h5 class="modal-title">
                                <i class="fas fa-handshake me-2"></i>
                                Contratar: ${service.name}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-corporate">
                                <i class="fas fa-info-circle me-2"></i>
                                <strong>Precio:</strong> $${service.price.toLocaleString()}
                            </div>
                            
                            <form id="contractForm">
                                <div class="mb-3">
                                    <label for="clientName" class="form-label text-corporate">Nombre Completo *</label>
                                    <input type="text" class="form-control" id="clientName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="clientEmail" class="form-label text-corporate">Correo Electrónico *</label>
                                    <input type="email" class="form-control" id="clientEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="clientPhone" class="form-label text-corporate">Teléfono</label>
                                    <input type="tel" class="form-control" id="clientPhone">
                                </div>
                                <div class="mb-3">
                                    <label for="clientMessage" class="form-label text-corporate">Mensaje Adicional</label>
                                    <textarea class="form-control" id="clientMessage" rows="3" 
                                        placeholder="Cuéntanos más sobre tu proyecto..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-corporate-outline" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn-corporate" onclick="servicesRenderer.submitContract(${service.id})">
                                <i class="fas fa-paper-plane me-2"></i>
                                Enviar Solicitud
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    submitContract(serviceId) {
        const form = document.getElementById('contractForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const service = window.servicesManager?.getServiceById(serviceId);
        const formData = this.getFormData(service);

        // Guardar contrato
        this.saveContract(formData);

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('contractModal'));
        modal.hide();

        // Mostrar confirmación
        this.showConfirmation(formData);
    }

    getFormData(service) {
        return {
            serviceName: service.name,
            servicePrice: service.price,
            clientName: document.getElementById('clientName').value,
            clientEmail: document.getElementById('clientEmail').value,
            clientPhone: document.getElementById('clientPhone').value,
            clientMessage: document.getElementById('clientMessage').value,
            timestamp: new Date().toISOString()
        };
    }

    saveContract(contractData) {
        const contracts = JSON.parse(localStorage.getItem('service_contracts') || '[]');
        contracts.push(contractData);
        localStorage.setItem('service_contracts', JSON.stringify(contracts));
    }

    showConfirmation(contractData) {
        if (window.TechSolutionsApp) {
            window.TechSolutionsApp.getInstance().showNotification(
                `¡Gracias ${contractData.clientName}! Tu solicitud para "${contractData.serviceName}" ha sido enviada.`,
                'success',
                8000
            );
        }
    }

    // ===== UTILIDADES =====
    updatePageTitle(serviceName) {
        document.title = `${serviceName} - TechSolutions`;
    }

    updateBreadcrumb(serviceName) {
        const breadcrumb = document.getElementById('breadcrumb-service');
        if (breadcrumb) {
            breadcrumb.textContent = serviceName;
        }
    }
}

// ===== FUNCIONES GLOBALES PARA COMPATIBILIDAD =====
function contratarServicio(serviceId) {
    window.servicesRenderer?.contractService(serviceId);
}

function submitContract(serviceId) {
    window.servicesRenderer?.submitContract(serviceId);
}

// ===== INICIALIZACIÓN =====
window.servicesRenderer = new ServicesRenderer();