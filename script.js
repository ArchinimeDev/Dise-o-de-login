/* ═══════════════════════════════════════════════════════════
   SISTEMA DE AUTENTICACIÓN
   - Registro e inicio de sesión con localStorage
   - Validaciones claras y mensajes de error
   - Botones de login social (demo)
═══════════════════════════════════════════════════════════ */

/* ---------- REFERENCIAS AL DOM ---------- */
const wrapper       = document.querySelector('.wrapper');

const loginForm     = document.getElementById('loginForm');
const registerForm  = document.getElementById('registerForm');

const loginMessage  = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');

/* Botones y enlaces para cambiar de vista */
const goToRegisterBtns = [
    document.querySelector('.register-link'),
    document.querySelector('.register-btn')
];
const goToLoginBtns = [
    document.querySelector('.login-link'),
    document.querySelector('.login-btn')
];

/* ═══════════════════════════════════════════
   1. NAVEGACIÓN ENTRE FORMULARIOS
═══════════════════════════════════════════ */
goToRegisterBtns.forEach(btn =>
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('active');
        clearMessages();
    })
);

goToLoginBtns.forEach(btn =>
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.remove('active');
        clearMessages();
    })
);

/* ═══════════════════════════════════════════
   2. UTILIDADES
═══════════════════════════════════════════ */

/** Muestra un mensaje en el formulario indicado */
function showMessage(element, text, type = 'error') {
    element.textContent = text;
    element.className = 'message ' + type;
}

/** Limpia los mensajes de ambos formularios */
function clearMessages() {
    loginMessage.textContent = '';
    registerMessage.textContent = '';
}

/** Devuelve el array de usuarios guardados */
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

/** Guarda el array de usuarios */
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/** Valida formato de correo */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ═══════════════════════════════════════════
   3. REGISTRO
═══════════════════════════════════════════ */
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // --- Recoger valores ---
    const name     = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const terms    = document.getElementById('regTerms').checked;

    // --- Validaciones ---
    if (name.length < 3) {
        return showMessage(registerMessage, 'El nombre debe tener al menos 3 caracteres.', 'error');
    }
    if (!isValidEmail(email)) {
        return showMessage(registerMessage, 'Ingresa un correo electrónico válido.', 'error');
    }
    if (password.length < 6) {
        return showMessage(registerMessage, 'La contraseña debe tener mínimo 6 caracteres.', 'error');
    }
    if (!terms) {
        return showMessage(registerMessage, 'Debes aceptar los términos y condiciones.', 'error');
    }

    // --- Evitar duplicados ---
    const users = getUsers();
    if (users.some(u => u.email === email)) {
        return showMessage(registerMessage, 'Este correo ya está registrado.', 'error');
    }

    // --- Guardar usuario ---
    users.push({ name, email, password, createdAt: new Date().toISOString() });
    saveUsers(users);

    showMessage(registerMessage, '¡Registro exitoso! Te llevamos al login...', 'success');
    registerForm.reset();

    // --- Redirigir al login ---
    setTimeout(() => {
        wrapper.classList.remove('active');
        document.getElementById('loginEmail').value = email;
        showMessage(loginMessage, 'Ingresa tu contraseña para continuar.', 'success');
    }, 1400);
});

/* ═══════════════════════════════════════════
   4. INICIO DE SESIÓN
═══════════════════════════════════════════ */
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        return showMessage(loginMessage, 'Completa todos los campos.', 'error');
    }

    const user = getUsers().find(u => u.email === email && u.password === password);

    if (!user) {
        return showMessage(loginMessage, 'Correo o contraseña incorrectos.', 'error');
    }

    showMessage(loginMessage, `¡Bienvenido, ${user.name}!`, 'success');

    setTimeout(() => {
        alert(`Sesión iniciada\n\nNombre: ${user.name}\nCorreo: ${user.email}`);
        loginForm.reset();
        loginMessage.textContent = '';
    }, 700);
});

/* ═══════════════════════════════════════════
   5. LOGIN SOCIAL (demo)
═══════════════════════════════════════════ */
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const provider = btn.dataset.provider;
        const form = btn.closest('form');
        const messageEl = form.id === 'loginForm' ? loginMessage : registerMessage;

        // Aquí conectarías con la API real de cada proveedor
        // (Google OAuth, Facebook SDK, LinkedIn, GitHub OAuth)
        showMessage(messageEl, `Conectando con ${provider}...`, 'success');

        setTimeout(() => {
            showMessage(
                messageEl,
                `Demo: integración con ${provider} pendiente de configurar.`,
                'success'
            );
        }, 1000);
    });
});