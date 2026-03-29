
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    const isAuthPage = currentPage.includes('login.html') || currentPage.includes('register.html');
    
    if (!isAuthPage) {
        const user = localStorage.getItem('user');
        if (!user) {
            window.location.href = 'login.html';
        }
    } else {
        const user = localStorage.getItem('user');
        if (user) {
            window.location.href = 'index.html';
        }
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('user', JSON.stringify({
            name: user.name,
            email: user.email
        }));
        showAlert('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showAlert('Invalid email or password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        showAlert('Email already registered', 'error');
        return;
    }
    users.push({
        name: name,
        email: email,
        password: password
    });

    localStorage.setItem('users', JSON.stringify(users));
    showAlert('Registration successful! Please login.', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function showAlert(message, type) {
    const form = document.querySelector('form');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    form.insertBefore(alertDiv, form.firstChild);
    setTimeout(() => alertDiv.remove(), 3000);
}
