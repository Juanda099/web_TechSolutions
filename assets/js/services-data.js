// Sistema de datos para servicios
class ServicesDataManager {
    constructor() {
        this.services = [];
        this.loadServicesFromStorage();
    }

    // Cargar servicios desde localStorage o datos por defecto
    loadServicesFromStorage() {
        const storedServices = localStorage.getItem('techsolutions_services');
        if (storedServices) {
            this.services = JSON.parse(storedServices);
        } else {
            // Datos por defecto basados en tu estructura actual
            this.services = [
                {
                    id: 1,
                    name: "Desarrollo de sitios Web",
                    price: 300,
                    image: "assets/img/servicios/Img1.jpg",
                    description: "Creamos sitios web modernos, responsivos y optimizados para todos los dispositivos. Ya sea una página institucional, un portafolio o una landing page, garantizamos diseño atractivo, navegación intuitiva y código limpio. Ideal para empresas que quieren presencia profesional en línea.",
                    quantity: 1,
                    active: true
                },
                {
                    id: 2,
                    name: "Aplicaciones móviles",
                    price: 600,
                    image: "assets/img/servicios/img2.jpg",
                    description: "Desarrollamos aplicaciones móviles nativas y multiplataforma para Android e iOS. Con interfaces intuitivas, rendimiento optimizado y funcionalidades avanzadas que conectan tu negocio con tus clientes en cualquier momento y lugar.",
                    quantity: 1,
                    active: true
                },
                {
                    id: 3,
                    name: "E-commerce",
                    price: 1000,
                    image: "assets/img/servicios/img3.jpg",
                    description: "Plataformas de comercio electrónico completas con carrito de compras, pasarelas de pago seguras, gestión de inventario y panel administrativo. Perfectas para llevar tu negocio al mundo digital.",
                    quantity: 1,
                    active: true
                },
                {
                    id: 4,
                    name: "Análisis de Datos",
                    price: 1200,
                    image: "assets/img/servicios/img4.jpg",
                    description: "Servicios de análisis de datos, visualización de información y business intelligence. Transformamos tus datos en insights valiosos para la toma de decisiones estratégicas.",
                    quantity: 1,
                    active: true
                },
                {
                    id: 5,
                    name: "DevOps y CI/CD",
                    price: 500,
                    image: "assets/img/servicios/img5.jpg",
                    description: "Implementación de prácticas DevOps, automatización de despliegues, integración continua y monitoreo de aplicaciones para optimizar el desarrollo y mantenimiento de software.",
                    quantity: 1,
                    active: true
                },
                {
                    id: 6,
                    name: "Automatización QA",
                    price: 1600,
                    image: "assets/img/servicios/img6.jpg",
                    description: "Servicios de automatización de pruebas, testing de software y control de calidad para garantizar la excelencia y confiabilidad de tus aplicaciones.",
                    quantity: 1,
                    active: true
                },
                {
                    id: 7,
                    name: "API y Microservicios",
                    price: 1000,
                    image: "assets/img/servicios/img7.jpg",
                    description: "Desarrollo de APIs REST y GraphQL, arquitectura de microservicios escalables y sistemas distribuidos para aplicaciones empresariales robustas.",
                    quantity: 1,
                    active: true
                },
                {
                    id: 8,
                    name: "Ciberseguridad",
                    price: 750,
                    image: "assets/img/servicios/img8.jpg",
                    description: "Servicios de ciberseguridad, auditorías de seguridad, implementación de medidas de protección y consultoría en seguridad informática para proteger tu infraestructura digital.",
                    quantity: 1,
                    active: true
                }
            ];
            this.saveServicesToStorage();
        }
    }

    // Guardar servicios en localStorage
    saveServicesToStorage() {
        localStorage.setItem('techsolutions_services', JSON.stringify(this.services));
    }

    // Obtener todos los servicios activos
    getAllActiveServices() {
        return this.services.filter(service => service.active);
    }

    // Obtener todos los servicios (para admin)
    getAllServices() {
        return this.services;
    }

    // Obtener servicio por ID
    getServiceById(id) {
        // Convertir a número para comparación
        const numericId = parseInt(id);
        return this.services.find(service => service.id === numericId);
    }

    // Agregar nuevo servicio
    addService(serviceData) {
        const newId = Math.max(...this.services.map(s => s.id), 0) + 1;
        const newService = {
            id: newId,
            ...serviceData,
            active: true
        };
        this.services.push(newService);
        this.saveServicesToStorage();
        return newService;
    }

    // Actualizar servicio
    updateService(id, serviceData) {
        const index = this.services.findIndex(service => service.id === parseInt(id));
        if (index !== -1) {
            this.services[index] = { ...this.services[index], ...serviceData };
            this.saveServicesToStorage();
            return this.services[index];
        }
        return null;
    }

    // Eliminar servicio (marcar como inactivo)
    deleteService(id) {
        const index = this.services.findIndex(service => service.id === parseInt(id));
        if (index !== -1) {
            this.services[index].active = false;
            this.saveServicesToStorage();
            return true;
        }
        return false;
    }

    // Eliminar servicio permanentemente
    permanentDeleteService(id) {
        const index = this.services.findIndex(service => service.id === parseInt(id));
        if (index !== -1) {
            this.services.splice(index, 1);
            this.saveServicesToStorage();
            return true;
        }
        return false;
    }
}

// Crear instancia global
window.servicesManager = new ServicesDataManager();