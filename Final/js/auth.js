
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
        showAlert('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('user', JSON.stringify({
            name: user.name,
            email: user.email
        }));
        showAlert('Đăng nhập thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showAlert('Email hoặc mật khẩu không hợp lệ', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        showAlert('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Mật khẩu và xác nhận mật khẩu không trùng khớp', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        showAlert('Email đã được đăng ký', 'error');
        return;
    }
    users.push({
        name: name,
        email: email,
        password: password
    });

    localStorage.setItem('users', JSON.stringify(users));
    showAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
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
