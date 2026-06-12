// Публичный рабочий токен Kodik
const KODIK_TOKEN = '8343bc7359554030ea05d90c2d40fcb8';

// Функция для загрузки дорам по названию
async function loadDramas(title) {
    const url = `https://kodik-api.com{KODIK_TOKEN}&title=${encodeURIComponent(title)}&types=foreign-movie,foreign-serial&limit=10`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            console.log("Дорамы успешно загружены:", data.results);
            displayDramas(data.results); // Вызов функции отрисовки на сайте
        } else {
            console.log("Ничего не найдено.");
        }
    } catch (error) {
        console.error("Ошибка при запросе к Kodik API:", error);
    }
}

// Пример функции вывода дорам в HTML (адаптируйте под свой дизайн)
function displayDramas(dramas) {
    const container = document.getElementById('dramas-container'); // ID вашего блока на сайте
    if (!container) return;
    
    container.innerHTML = ''; // Очищаем контейнер

    dramas.forEach(drama => {
        const dramaElement = document.createElement('div');
        dramaElement.classList.add('drama-card');
        
        // Создаем iframe с плеером (Kodik отдает относительную ссылку, добавляем https:)
        const playerUrl = drama.link.startsWith('http') ? drama.link : `https:${drama.link}`;
        
        dramaElement.innerHTML = `
            <h3>${drama.title} (${drama.year})</h3>
            <p>Перевод: ${drama.translation.title}</p>
            <iframe src="${playerUrl}" width="610" height="370" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>
        `;
        container.appendChild(dramaElement);
    });
}

// Запустить поиск при загрузке страницы (например, дорама "Истинная красота")
document.addEventListener('DOMContentLoaded', () => {
    loadDramas('Истинная красота');
});
