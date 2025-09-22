# TechSolutions - Sitio Web de Servicios Tecnológicos

## Descripción

TechSolutions es un sitio web moderno que ofrece servicios tecnológicos de calidad. El sitio incluye páginas para servicios, detalles, autenticación y un panel de administración.


## Cómo Ejecutar el Sitio

### Opción 1: Servidor Web Local (Recomendado)

**Paso 1:** Abre una terminal en el directorio del proyecto
```powershell
cd "C:\Users\juand\Desktop\Web_TechSolutions"
```

**Paso 2:** Ejecuta un servidor web local usando Python

Si tienes Python 3 instalado:
```powershell
python -m http.server 8000
```

Si tienes Python 2:
```powershell
python -m SimpleHTTPServer 8000
```

**Paso 3:** Abre tu navegador y visita:
```
http://localhost:8000
```

### Opción 2: Usando Node.js y http-server

**Paso 1:** Instala http-server globalmente (solo la primera vez)
```powershell
npm install -g http-server
```

**Paso 2:** Navega al directorio del proyecto
```powershell
cd "C:\Users\juand\Desktop\Web_TechSolutions"
```

**Paso 3:** Ejecuta el servidor
```powershell
http-server
```

**Paso 4:** Abre tu navegador en la URL mostrada (generalmente `http://localhost:8080`)

### Opción 3: Usando Live Server (Visual Studio Code)

**Paso 1:** Instala la extensión "Live Server" en VS Code

**Paso 2:** Abre el proyecto en VS Code
```powershell
code "C:\Users\juand\Desktop\Web_TechSolutions"
```

**Paso 3:** Haz clic derecho en `index.html` y selecciona "Open with Live Server"

### Opción 4: Usando XAMPP/WAMP

**Paso 1:** Instala XAMPP o WAMP

**Paso 2:** Copia la carpeta del proyecto a:
- XAMPP: `C:\xampp\htdocs\Web_TechSolutions`
- WAMP: `C:\wamp64\www\Web_TechSolutions`

**Paso 3:** Inicia Apache desde el panel de control

**Paso 4:** Visita: `http://localhost/Web_TechSolutions`

