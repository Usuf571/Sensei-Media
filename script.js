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
    const phoneNumber = '+996220794009'; // Замените на реальный номер (в формате +996XXXXXXXXX)
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
        threshold: 0.4 // Запускаем анимацию, когда 10% секции видны
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
