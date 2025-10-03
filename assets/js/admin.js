// Administración de servicios
class AdminManager {
    constructor() {
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.loadServicesTable();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listener para el formulario
        document.getElementById('serviceForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveService();
        });

        // Event listener para la imagen
        document.getElementById('serviceImage')?.addEventListener('change', (e) => {
            this.previewImage(e.target.files[0]);
        });

        // Event listener para el modal
        document.getElementById('serviceModal')?.addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });
    }

    // Cargar tabla de servicios
    loadServicesTable() {
        const tableBody = document.getElementById('servicesTableBody');
        if (!tableBody) return;

        const services = window.servicesManager.getAllServices();
        
        tableBody.innerHTML = services.map(service => `
            <tr class="service-row ${!service.active ? 'table-secondary' : ''}">
                <td class="ps-4">
                    <div class="service-image">
                        <img src="${service.image}" alt="${service.name}">
                    </div>
                </td>
                <td class="align-middle">
                    <h6 class="service-name mb-0">${service.name}</h6>
                    ${!service.active ? '<small class="text-muted">(Inactivo)</small>' : ''}
                </td>
                <td class="align-middle">
                    <span class="service-price">$${service.price}</span>
                </td>
                <td class="text-center align-middle">
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-edit me-2" onclick="adminManager.editService(${service.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${service.active ? `
                            <button class="btn btn-sm btn-outline-danger me-2" onclick="adminManager.toggleService(${service.id})" title="Desactivar">
                                <i class="fas fa-eye-slash"></i>
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-outline-success me-2" onclick="adminManager.toggleService(${service.id})" title="Activar">
                                <i class="fas fa-eye"></i>
                            </button>
                        `}
                        <button class="btn btn-sm btn-outline-danger" onclick="adminManager.deleteService(${service.id})" title="Eliminar Permanentemente">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Editar servicio
    editService(id) {
        const service = window.servicesManager.getServiceById(id);
        if (!service) return;

        this.currentEditingId = id;
        
        // Llenar el formulario
        document.getElementById('serviceId').value = service.id;
        document.getElementById('serviceName').value = service.name;
        document.getElementById('servicePrice').value = service.price;
        document.getElementById('serviceDescription').value = service.description || '';

        // Mostrar imagen actual
        if (service.image) {
            document.getElementById('imagePreview').src = service.image;
            document.getElementById('imagePreviewContainer').style.display = 'block';
        }

        // Cambiar título del modal
        document.getElementById('serviceModalLabel').textContent = 'Editar Servicio';
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        modal.show();
    }

    // Guardar servicio (crear o actualizar)
    saveService() {
        const formData = new FormData(document.getElementById('serviceForm'));
        const serviceData = {
            name: formData.get('serviceName'),
            price: parseInt(formData.get('servicePrice')),
            description: formData.get('serviceDescription')
        };

        // Manejar imagen
        const imageFile = formData.get('serviceImage');
        if (imageFile && imageFile.size > 0) {
            // En un entorno real, aquí subirías la imagen al servidor
            // Por ahora, creamos una URL temporal
            serviceData.image = URL.createObjectURL(imageFile);
        } else if (this.currentEditingId) {
            // Si estamos editando y no hay imagen nueva, mantener la actual
            const currentService = window.servicesManager.getServiceById(this.currentEditingId);
            serviceData.image = currentService.image;
        } else {
            // Imagen por defecto para nuevos servicios
            serviceData.image = 'assets/img/servicios/default.jpg';
        }

        try {
            if (this.currentEditingId) {
                // Actualizar servicio existente
                window.servicesManager.updateService(this.currentEditingId, serviceData);
                this.showAlert('Servicio actualizado exitosamente', 'success');
            } else {
                // Crear nuevo servicio
                window.servicesManager.addService(serviceData);
                this.showAlert('Servicio creado exitosamente', 'success');
            }

            // Cerrar modal y recargar tabla
            const modal = bootstrap.Modal.getInstance(document.getElementById('serviceModal'));
            modal.hide();
            this.loadServicesTable();

        } catch (error) {
            this.showAlert('Error al guardar el servicio: ' + error.message, 'danger');
        }
    }

    // Activar/Desactivar servicio
    toggleService(id) {
        const service = window.servicesManager.getServiceById(id);
        if (!service) return;

        const newStatus = !service.active;
        window.servicesManager.updateService(id, { active: newStatus });
        
        this.showAlert(`Servicio ${newStatus ? 'activado' : 'desactivado'} exitosamente`, 'success');
        this.loadServicesTable();
    }

    // Eliminar servicio permanentemente
    deleteService(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este servicio permanentemente? Esta acción no se puede deshacer.')) {
            window.servicesManager.permanentDeleteService(id);
            this.showAlert('Servicio eliminado exitosamente', 'success');
            this.loadServicesTable();
        }
    }

    // Resetear formulario
    resetForm() {
        document.getElementById('serviceForm').reset();
        document.getElementById('serviceId').value = '';
        document.getElementById('imagePreviewContainer').style.display = 'none';
        document.getElementById('serviceModalLabel').textContent = 'Agregar Nuevo Servicio';
        this.currentEditingId = null;
    }

    // Vista previa de imagen
    previewImage(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('imagePreview').src = e.target.result;
                document.getElementById('imagePreviewContainer').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    // Mostrar alertas
    showAlert(message, type = 'info') {
        // Crear elemento de alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto-remove después de 5 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('servicesTableBody')) {
        window.adminManager = new AdminManager();
    }
});

// Funciones globales para compatibilidad
function editService(id) {
    window.adminManager?.editService(id);
}

function deleteService(id) {
    window.adminManager?.deleteService(id);
}

function saveService() {
    window.adminManager?.saveService();
}