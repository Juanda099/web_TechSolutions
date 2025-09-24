// ===== AUTHENTICATION JAVASCRIPT =====

// Credenciales de demostración (en producción esto debe estar en el servidor)
const DEMO_CREDENTIALS = {
    admin: 'admin123',
    usuario: 'user123',
    techsolutions: 'tech2024'
};

// Variables globales
let loginAttempts = 0;
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutos

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeAuth();
        setupEventListeners();
        checkExistingSession();
    } catch (error) {
        console.error('Auth.js: Error durante la inicialización:', error);
    }
});

// Marcar que el script se ha cargado

// ===== FUNCIONES DE INICIALIZACIÓN =====

function initializeAuth() {
    // Verificar si está bloqueado
    checkLockoutStatus();
    
    // Aplicar animaciones
    setTimeout(() => {
        document.querySelector('.login-card').classList.add('fade-in');
    }, 100);
}

function setupEventListeners() {
    // Event listener para el formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Event listeners para los inputs
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) {
        usernameInput.addEventListener('input', clearErrors);
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('password').focus();
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', clearErrors);
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        });
    }

    // Event listener para recordar sesión
    const rememberCheckbox = document.getElementById('rememberMe');
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', function() {
            localStorage.setItem('rememberLogin', this.checked);
        });
    }
}

// ===== FUNCIONES DE AUTENTICACIÓN =====

async function handleLogin(event) {
    event.preventDefault();
    
    // Verificar si está bloqueado
    if (isLockedOut()) {
        showAlert('Cuenta bloqueada temporalmente. Intente más tarde.', 'error');
        return;
    }
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validaciones básicas
    if (!username || !password) {
        showAlert('Por favor complete todos los campos', 'error');
        return;
    }
    
    // Mostrar loading
    setLoadingState(true);
    
    try {
        // Simular delay de red (en producción esto sería una llamada real al servidor)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verificar credenciales
        if (validateCredentials(username, password)) {
            loginSuccess(username, rememberMe);
        } else {
            loginFailure();
        }
        
    } catch (error) {
        console.error('Error durante el login:', error);
        showAlert('Error de conexión. Intente nuevamente.', 'error');
    } finally {
        setLoadingState(false);
    }
}

function validateCredentials(username, password) {
    // En producción, esto se haría con una API
    return DEMO_CREDENTIALS[username] === password;
}

function loginSuccess(username, rememberMe) {
    // Guardar sesión
    const sessionData = {
        username: username,
        loginTime: new Date().toISOString(),
        remember: rememberMe
    };
    
    if (rememberMe) {
        localStorage.setItem('userSession', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('userSession', JSON.stringify(sessionData));
    }
    
    // Resetear intentos
    loginAttempts = 0;
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');
    
    // Mostrar mensaje de éxito
    showAlert('¡Bienvenido! Redirigiendo...', 'success');
    
    // Redirigir al panel de administración
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 2000);
}

function loginFailure() {
    loginAttempts++;
    localStorage.setItem('loginAttempts', loginAttempts);
    
    if (loginAttempts >= MAX_ATTEMPTS) {
        // Bloquear cuenta
        const lockoutTime = new Date().getTime() + LOCKOUT_TIME;
        localStorage.setItem('lockoutTime', lockoutTime);
        showAlert(`Demasiados intentos fallidos. Cuenta bloqueada por ${MAX_ATTEMPTS} minutos.`, 'error');
        setLoadingState(false);
        return;
    }
    
    const remainingAttempts = MAX_ATTEMPTS - loginAttempts;
    showAlert(`Credenciales incorrectas. ${remainingAttempts} intentos restantes.`, 'error');
    
    // Limpiar formulario parcialmente
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

// ===== FUNCIONES DE SESIÓN =====

function checkExistingSession() {
    const sessionData = getSessionData();
    
    if (sessionData) {
        // Verificar si la sesión es válida
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const sessionDuration = now - loginTime;
        const maxSessionTime = sessionData.remember ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000; // 30 días vs 8 horas
        
        if (sessionDuration < maxSessionTime) {
            // Sesión válida, preguntar si quiere continuar
            if (confirm(`Ya tiene una sesión activa como ${sessionData.username}. ¿Desea continuar?`)) {
                window.location.href = 'admin.html';
                return;
            } else {
                clearSession();
            }
        } else {
            // Sesión expirada
            clearSession();
            showAlert('Su sesión ha expirado. Por favor inicie sesión nuevamente.', 'error');
        }
    }
    
    // Auto-llenar usuario si se recuerda
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
        document.getElementById('password').focus();
    }
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
    localStorage.removeItem('rememberedUser');
}

// ===== FUNCIONES DE BLOQUEO =====

function checkLockoutStatus() {
    const lockoutTime = localStorage.getItem('lockoutTime');
    const attempts = localStorage.getItem('loginAttempts');
    
    if (lockoutTime) {
        const now = new Date().getTime();
        if (now < parseInt(lockoutTime)) {
            const remainingTime = Math.ceil((parseInt(lockoutTime) - now) / (60 * 1000));
            showAlert(`Cuenta bloqueada. Tiempo restante: ${remainingTime} minutos`, 'error');
            disableForm(true);
            return true;
        } else {
            // Limpiar bloqueo expirado
            localStorage.removeItem('lockoutTime');
            localStorage.removeItem('loginAttempts');
            loginAttempts = 0;
        }
    }
    
    if (attempts) {
        loginAttempts = parseInt(attempts);
    }
    
    return false;
}

function isLockedOut() {
    const lockoutTime = localStorage.getItem('lockoutTime');
    if (lockoutTime) {
        return new Date().getTime() < parseInt(lockoutTime);
    }
    return false;
}

// ===== FUNCIONES DE UI =====

function setLoadingState(loading) {
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    
    loginBtn.disabled = loading;
    
    if (loading) {
        btnText.classList.add('d-none');
        btnLoading.classList.remove('d-none');
    } else {
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
    }
}

function disableForm(disabled) {
    const inputs = document.querySelectorAll('#loginForm input, #loginForm button');
    inputs.forEach(input => {
        input.disabled = disabled;
    });
}

function clearErrors() {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
}

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertClass = type === 'error' ? 'alert-error' : type === 'success' ? 'alert-success' : 'alert-info';
    const iconClass = type === 'error' ? 'fa-exclamation-triangle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    
    const alertHtml = `
        <div class="alert-custom ${alertClass}">
            <i class="fas ${iconClass} me-2"></i>
            ${message}
        </div>
    `;
    
    alertContainer.innerHTML = alertHtml;
    
    // Auto-ocultar después de 5 segundos (excepto errores críticos)
    if (type !== 'error' || !message.includes('bloqueada')) {
        setTimeout(() => {
            if (alertContainer.innerHTML.includes(message)) {
                alertContainer.innerHTML = '';
            }
        }, 5000);
    }
}

// ===== FUNCIONES AUXILIARES =====

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function showForgotPassword() {
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    modal.show();
}

// ===== FUNCIONES DE SEGURIDAD =====

function detectSuspiciousActivity() {
    // Detectar múltiples pestañas
    const tabId = Date.now() + Math.random();
    localStorage.setItem('currentTab', tabId);
    
    // Monitorear cambios
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentTab' && e.newValue !== tabId) {
            console.warn('Múltiples pestañas detectadas');
        }
    });
}

// ===== EXPORT PARA DEBUGGING =====
if (typeof window !== 'undefined') {
    window.authDebug = {
        clearSession,
        checkSession: getSessionData,
        resetAttempts: () => {
            loginAttempts = 0;
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lockoutTime');
        },
        credentials: DEMO_CREDENTIALS
    };
}

// Inicializar detección de actividad sospechosa
detectSuspiciousActivity();

// Marcar que el archivo se cargó completamente
window.authJsLoaded = true;
