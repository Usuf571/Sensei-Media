document.getElementById('consultationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы

    // Получаем данные из формы
    const name = document.getElementById('nameInput').value;
    const phone = document.getElementById('phoneInput').value;
    const question = document.getElementById('questionInput').value;
    const accept = document.getElementById('acceptCheckbox').checked;

    // Проверяем, что чекбокс отмечен
    if (!accept) {
        alert('Пожалуйста, согласитесь с условиями обработки персональных данных.');
        return;
    }

    // Форматируем сообщение для WhatsApp
    const phoneNumber = '+996220704009'; // Замените на реальный номер (в формате +996XXXXXXXXX)
    const message = `Имя: ${name}\nТелефон: ${phone}\nВопрос: ${question}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Перенаправляем пользователя на WhatsApp
    window.location.href = whatsappURL;

    // Опционально: добавляем визуальную обратную связь
    const button = document.querySelector('.consultancy-form-button');
    button.classList.add('sending');
    setTimeout(() => {
        button.classList.remove('sending');
    }, 2000); // Убираем анимацию через 2 секунды
});
// Intersection Observer для анимации при прокрутке
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.animate-section');

    const observerOptions = {
        root: null, // Используем viewport как область наблюдения
        rootMargin: '0px',
        threshold: 0.1 // Запускаем анимацию, когда 10% секции видны
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Останавливаем наблюдение после появления
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const body = document.body;

    setTimeout(() => {
        body.classList.add('loaded');
        preloader.classList.add('hidden');
    }, 3000); // Минимальная задержка 2 секунды
});
// Проверка авторизации после загрузки страницы
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const body = document.body;

    setTimeout(() => {
        body.classList.add('loaded');
        preloader.classList.add('hidden');
        checkAuth(); // Проверяем авторизацию после загрузки
    }, 1000); // Задержка для прелоадера
});

// Проверка авторизации
function checkAuth() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const authenticatedUser = localStorage.getItem('authenticatedUser');
    const body = document.body;

    if (authenticatedUser && users.some(user => user.email === authenticatedUser)) {
        body.classList.add('authenticated');
        document.getElementById('authModal').style.display = 'none';
    } else {
        body.classList.remove('authenticated');
        document.getElementById('authModal').style.display = 'flex';
    }
}

// Валидация email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Управление модальным окном
const modal = document.getElementById('authModal');
const closeBtn = document.querySelector('.close-btn');
const tabs = document.querySelectorAll('.tab');
const tabPanes = document.querySelectorAll('.tab-pane');

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        tabPanes.forEach(pane => pane.classList.remove('active'));
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Обработка ссылки "Забыли пароль?"
document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="forgot-password"]').classList.add('active');
    tabPanes.forEach(pane => pane.classList.remove('active'));
    document.getElementById('forgot-password').classList.add('active');
    document.getElementById('forgotEmail').focus();
});

// Обработка формы авторизации
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => (u.email === email || u.username === email) && u.password === password);

    if (!validateEmail(email) && !email.includes('@')) {
        document.getElementById('loginError').textContent = 'Введите корректный email или логин';
        return;
    }

    if (user) {
        localStorage.setItem('authenticatedUser', user.email);
        document.body.classList.add('authenticated');
        modal.style.display = 'none';
        document.getElementById('loginError').textContent = '';
    } else {
        document.getElementById('loginError').textContent = 'Неверный email/логин или пароль';
    }
});

// Обработка формы регистрации
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (!validateEmail(email)) {
        document.getElementById('registerError').textContent = 'Введите корректный email';
        return;
    }

    if (password.length < 6) {
        document.getElementById('registerError').textContent = 'Пароль должен содержать минимум 6 символов';
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('registerError').textContent = 'Пароли не совпадают';
        return;
    }

    if (users.some(user => user.email === email)) {
        document.getElementById('registerError').textContent = 'Пользователь с таким email уже существует';
        return;
    }

    users.push({ email, password, username: email.split('@')[0] });
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('registerError').textContent = 'Регистрация успешна! Теперь войдите.';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('confirmPassword').value = '';
});

// Обработка формы восстановления пароля
document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (!validateEmail(email)) {
        document.getElementById('forgotError').textContent = 'Введите корректный email';
        document.getElementById('forgotSuccess').textContent = '';
        return;
    }

    if (user) {
        // Генерируем новый случайный пароль (для симуляции)
        const newPassword = Math.random().toString(36).slice(-8); // 8 символов
        user.password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('forgotError').textContent = '';
        document.getElementById('forgotSuccess').textContent = `Новый пароль: ${newPassword}. Сохраните его и войдите.`;
    } else {
        document.getElementById('forgotError').textContent = 'Пользователь с таким email не найден';
        document.getElementById('forgotSuccess').textContent = '';
    }
});

// Обработка кнопки выхода
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('authenticatedUser');
    document.body.classList.remove('authenticated');
    modal.style.display = 'flex';
    checkAuth();
});
