# TechSolutions - Sitio Web de Servicios Tecnológicos

Sitio web estático para promocionar servicios tecnológicos con páginas de inicio, listado de servicios, detalle de servicio, autenticación y un panel de administración.

- Demo local: abre [index.html](index.html)
- Panel de administración: [admin.html](admin.html)
- Login: [login.html](login.html)

## Características

- Landing con carrusel estilo slider.
- Catálogo de servicios con páginas de detalle.
- Carga de Header y Footer vía templates HTML.
- Autenticación básica en cliente con bloqueo por intentos.
- Panel de administración (UI) para gestionar servicios.

## Estructura del proyecto

- Páginas principales:
  - [index.html](index.html)
  - [servicios.html](servicios.html)
  - [login.html](login.html)
  - [admin.html](admin.html)
  - Detalles: detalles-servicio1.html … detalles-servicio8.html

- Templates:
  - Header: [templates/header.html](templates/header.html)
  - Footer: [templates/footer.html](templates/footer.html)

- Estilos:
  - Base: [assets/css/main.css](assets/css/main.css)
  - Componentes (navbar): [assets/css/components.css](assets/css/components.css)
  - Secciones (servicios, detalle, footer): [assets/css/styles.css](assets/css/styles.css)
  - Autenticación: [assets/css/auth.css](assets/css/auth.css)
  - Admin: [assets/css/admin.css](assets/css/admin.css)

- Scripts:
  - Carga de header: [assets/js/load-header.js](assets/js/load-header.js)
  - Carga de footer: [assets/js/load-footer.js](assets/js/load-footer.js)
  - Autenticación: [assets/js/auth.js](assets/js/auth.js)
  - Utilidades/animaciones (opcional): [assets/js/animations.js](assets/js/animations.js), [assets/js/main.js](assets/js/main.js)
  - Sistema alterno de templates (no usado por defecto): [assets/js/template-config.js](assets/js/template-config.js), [assets/js/template-loader.js](assets/js/template-loader.js)

## Cómo ejecutar el sitio localmente

El sitio es estático. Usa una de estas opciones:

- Python 3
  - Windows PowerShell:
    - cd "C:\Users\juand\Desktop\Web_TechSolutions"
    - python -m http.server 8000
  - Navega a http://localhost:8000

- Node.js (http-server)
  - npm install -g http-server
  - cd "C:\Users\juand\Desktop\Web_TechSolutions"
  - http-server
  - Abre la URL indicada (p. ej. http://localhost:8080)

- VS Code (Live Server)
  - Instala la extensión "Live Server"
  - Abre el proyecto y ejecuta “Open with Live Server” sobre [index.html](index.html)

- XAMPP/WAMP
  - Copia el proyecto a htdocs/www y abre http://localhost/Web_TechSolutions

## Páginas y navegación

- Inicio: [index.html](index.html) con carrusel e invitación a servicios.
- Servicios: [servicios.html](servicios.html) listado con tarjetas.
- Detalles: páginas detalles-servicioX.html (1–8).
- Login: [login.html](login.html) con formulario y recordatorio.
- Admin: [admin.html](admin.html) tabla de servicios y modal para agregar/editar.

El header y footer se inyectan dinámicamente:
- Header: [assets/js/load-header.js](assets/js/load-header.js) → [templates/header.html](templates/header.html)
- Footer: [assets/js/load-footer.js](assets/js/load-footer.js) → [templates/footer.html](templates/footer.html)

Nota: Estas cargas usan contenedores con id="header-container" y id="footer-container" presentes en las páginas.

## Autenticación (demo)

Implementada en cliente solo para demostración en [assets/js/auth.js](assets/js/auth.js).

- Usuarios demo:
  - admin / admin123
  - usuario / user123
  - techsolutions / tech2024
- Intentos máximos: 3. Bloqueo temporal de 5 minutos.
- Recuerda sesión con localStorage/sessionStorage.
- Tras login exitoso, redirige a [admin.html](admin.html).

## Panel de Administración

UI en [admin.html](admin.html) con:
- Tabla de servicios.
- Modal “Agregar/Editar” con preview de imagen.
- Botones de acción por fila.

## Templates: opción alterna

Existen utilidades más avanzadas para carga de templates:
- Config: [assets/js/template-config.js](assets/js/template-config.js)
- Loader: [assets/js/template-loader.js](assets/js/template-loader.js)

Actualmente las páginas usan “header-container/footer-container”. Si deseas usar este sistema alterno:
1) Cambia los contenedores a id="header" y id="footer".
2) Incluye ambos scripts en las páginas antes del cierre de body.
3) Opcional: ajusta TemplateConfig.settings y pageTemplates.

## Contribuir

1) Crea una rama feature/nombre-feature
2) Commit con mensajes claros
3) Pull Request con descripción y capturas
