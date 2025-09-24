// ===== ADMIN PANEL JAVASCRIPT =====

// Verificar autenticación antes de cargar el admin
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuthentication()) {
        return; // No continuar si no está autenticado
    }
    initializeAdmin();
    setupEventListeners();
});

// ===== FUNCIONES DE AUTENTICACIÓN =====

function checkAuthentication() {
    const sessionData = getSessionData();
    
    if (!sessionData) {
        showAuthError('No hay una sesión activa. Redirigiendo al login...');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    
    // Verificar si la sesión ha expirado
    const loginTime = new Date(sessionData.loginTime);
    const now = new Date();
    const sessionDuration = now - loginTime;
    const maxSessionTime = sessionData.remember ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
    
    if (sessionDuration >= maxSessionTime) {
        clearSession();
        showAuthError('Su sesión ha expirado. Redirigiendo al login...');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return false;
    }
    
    // Mostrar información del usuario
    displayUserInfo(sessionData);
    setupLogoutButton();
    
    return true;
}

function getSessionData() {
    let sessionData = localStorage.getItem('userSession');
    if (!sessionData) {
        sessionData = sessionStorage.getItem('userSession');
    }
    return sessionData ? JSON.parse(sessionData) : null;
}

function clearSession() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
}

function showAuthError(message) {
    document.body.innerHTML = `
        <div class="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div class="text-center">
                <div class="mb-4">
                    <i class="fas fa-lock fa-4x text-danger mb-3"></i>
                    <h2 class="text-danger">Acceso Denegado</h2>
                    <p class="text-muted">${message}</p>
                </div>
                <a href="login.html" class="btn btn-primary">
                    <i class="fas fa-sign-in-alt me-2"></i>
                    Ir al Login
                </a>
            </div>
        </div>
    `;
}

function displayUserInfo(sessionData) {
    // Agregar información del usuario en el navbar
    const navbar = document.querySelector('.navbar .container');
    if (navbar) {
        const userInfo = document.createElement('div');
        userInfo.className = 'navbar-text ms-auto me-3';
        userInfo.innerHTML = `
            <span class="text-muted">Bienvenido, </span>
            <strong>${sessionData.username}</strong>
        `;
        navbar.appendChild(userInfo);
    }
}

function setupLogoutButton() {
    // Agregar botón de logout
    const navbar = document.querySelector('.navbar .container');
    if (navbar) {
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-outline-danger btn-sm ms-2';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt me-1"></i> Cerrar Sesión';
        logoutBtn.onclick = handleLogout;
        navbar.appendChild(logoutBtn);
    }
}

function handleLogout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        clearSession();
        showNotification('Sesión cerrada correctamente', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// Datos mock para los servicios (en el futuro se conectará a una API)
let services = [
    {
        id: 1,
        name: 'Desarrollo de sitios Web',
        price: 300,
        description: 'Desarrollo de sitios web profesionales con tecnologías modernas',
        image: 'assets/img/servicios/Img1.jpg'
    },
    {
        id: 2,
        name: 'Aplicaciones Móviles',
        price: 600,
        description: 'Desarrollo de aplicaciones móviles nativas e híbridas',
        image: 'assets/img/servicios/img2.jpg'
    },
    {
        id: 3,
        name: 'E-comerse',
        price: 1000,
        description: 'Plataformas de comercio electrónico completas y escalables',
        image: 'assets/img/servicios/img3.jpg'
    }
];

// Variables globales
let currentEditingId = null;

// ===== FUNCIONES DE INICIALIZACIÓN =====

function initializeAdmin() {
    console.log('Inicializando panel de administración...');
    loadServices();
    setupImagePreview();
}

function setupEventListeners() {
    // Event listener para el formulario
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveService();
        });
    }

    // Event listener para reset del modal
    const serviceModal = document.getElementById('serviceModal');
    if (serviceModal) {
        serviceModal.addEventListener('hidden.bs.modal', function() {
            resetForm();
        });
    }

    // Event listener para el input de archivo
    const imageInput = document.getElementById('serviceImage');
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
    }
}

// ===== FUNCIONES CRUD =====

function loadServices() {
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    services.forEach(service => {
        const row = createServiceRow(service);
        tbody.appendChild(row);
    });

    // Agregar animación a las filas
    setTimeout(() => {
        document.querySelectorAll('.service-row').forEach((row, index) => {
            row.style.animationDelay = `${index * 0.1}s`;
            row.classList.add('fade-in');
        });
    }, 100);
}

function createServiceRow(service) {
    const row = document.createElement('tr');
    row.className = 'service-row';
    row.innerHTML = `
        <td class="ps-4">
            <div class="service-image">
                <img src="${service.image}" alt="${service.name}" class="img-thumbnail">
            </div>
        </td>
        <td class="align-middle">
            <h6 class="service-name mb-0">${service.name}</h6>
        </td>
        <td class="align-middle">
            <span class="service-price">$${service.price}</span>
        </td>
        <td class="text-center align-middle">
            <div class="action-buttons">
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editService(${service.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteService(${service.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

function saveService() {
    const form = document.getElementById('serviceForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const serviceData = {
        name: formData.get('serviceName'),
        price: parseInt(formData.get('servicePrice')),
        description: formData.get('serviceDescription') || '',
        image: getImageUrl(formData.get('serviceImage'))
    };

    if (currentEditingId) {
        // Actualizar servicio existente
        updateService(currentEditingId, serviceData);
        showNotification('Servicio actualizado correctamente', 'success');
    } else {
        // Crear nuevo servicio
        const newId = Math.max(...services.map(s => s.id)) + 1;
        serviceData.id = newId;
        addService(serviceData);
        showNotification('Servicio agregado correctamente', 'success');
    }

    closeModal();
    loadServices();
}

function addService(serviceData) {
    services.push(serviceData);
    console.log('Servicio agregado:', serviceData);
}

function updateService(id, serviceData) {
    const index = services.findIndex(s => s.id === id);
    if (index !== -1) {
        services[index] = { ...services[index], ...serviceData };
        console.log('Servicio actualizado:', services[index]);
    }
}

function editService(id) {
    const service = services.find(s => s.id === id);
    if (!service) {
        showNotification('Servicio no encontrado', 'error');
        return;
    }

    currentEditingId = id;
    populateForm(service);
    
    // Cambiar título del modal
    document.getElementById('serviceModalLabel').textContent = 'Editar Servicio';
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
}

function deleteService(id) {
    const service = services.find(s => s.id === id);
    if (!service) {
        showNotification('Servicio no encontrado', 'error');
        return;
    }

    // Mostrar confirmación
    if (confirm(`¿Estás seguro de que quieres eliminar "${service.name}"?`)) {
        services = services.filter(s => s.id !== id);
        loadServices();
        showNotification('Servicio eliminado correctamente', 'success');
    }
}

// ===== FUNCIONES DEL FORMULARIO =====

function populateForm(service) {
    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name;
    document.getElementById('servicePrice').value = service.price;
    document.getElementById('serviceDescription').value = service.description || '';
    
    // Mostrar imagen actual si existe
    if (service.image) {
        const preview = document.getElementById('imagePreview');
        const container = document.getElementById('imagePreviewContainer');
        preview.src = service.image;
        container.style.display = 'block';
    }
}

function resetForm() {
    const form = document.getElementById('serviceForm');
    form.reset();
    
    currentEditingId = null;
    
    // Resetear título del modal
    document.getElementById('serviceModalLabel').textContent = 'Agregar Nuevo Servicio';
    
    // Ocultar vista previa de imagen
    document.getElementById('imagePreviewContainer').style.display = 'none';
}

function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('serviceModal'));
    if (modal) {
        modal.hide();
    }
}

// ===== FUNCIONES DE IMAGEN =====

function setupImagePreview() {
    const imageInput = document.getElementById('serviceImage');
    if (imageInput) {
        imageInput.addEventListener('change', handleImagePreview);
    }
}

function handleImagePreview(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    const container = document.getElementById('imagePreviewContainer');

    if (file) {
        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            showNotification('Por favor selecciona una imagen válida (JPG, PNG, GIF)', 'error');
            event.target.value = '';
            return;
        }

        // Validar tamaño (2MB máximo)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            showNotification('La imagen debe ser menor a 2MB', 'error');
            event.target.value = '';
            return;
        }

        // Mostrar vista previa
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            container.style.display = 'block';
            container.classList.add('slide-up');
        };
        reader.readAsDataURL(file);
    } else {
        container.style.display = 'none';
    }
}

function getImageUrl(file) {
    if (!file || !file.name) {
        return currentEditingId ? services.find(s => s.id === currentEditingId)?.image || '' : '';
    }
    
    // En un entorno real, aquí subirías la imagen al servidor y retornarías la URL
    // Por ahora, usamos una URL placeholder
    return `assets/img/servicios/${file.name}`;
}

// ===== FUNCIONES DE UTILIDAD =====

function showNotification(message, type = 'info') {
    // Crear notificación toast
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    // Crear contenedor si no existe
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Agregar toast al contenedor
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Mostrar toast
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });
    
    toast.show();
    
    // Remover element después de que se oculte
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

// ===== FUNCIONES DE BÚSQUEDA Y FILTRADO (para futuras mejoras) =====

function searchServices(query) {
    const filteredServices = services.filter(service => 
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase())
    );
    renderFilteredServices(filteredServices);
}

function renderFilteredServices(filteredServices) {
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    filteredServices.forEach(service => {
        const row = createServiceRow(service);
        tbody.appendChild(row);
    });
}

// ===== EXPORT PARA DEBUGGING =====
if (typeof window !== 'undefined') {
    window.adminDebug = {
        services,
        addService,
        updateService,
        deleteService,
        loadServices
    };
}