const KODIK_TOKEN = '8343bc7359554030ea05d90c2d40fcb8';

// 1. Функция загрузки дорам в каталог
async function loadDramas(title = '') {
    // Если поиск пустой, загружаем список популярных дорам
    const url = title 
        ? `https://kodik-api.com{KODIK_TOKEN}&title=${encodeURIComponent(title)}&types=foreign-movie,foreign-serial&limit=12`
        : `https://kodik-api.com{KODIK_TOKEN}&types=foreign-serial&sort=shikimori_rating&limit=12`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            displayDramas(data.results);
        } else {
            document.getElementById('catalog').innerHTML = '<p>Ничего не найдено</p>';
        }
    } catch (error) {
        console.error("Ошибка API:", error);
    }
}

// 2. Функция отрисовки карточек в <div id="catalog">
function displayDramas(dramas) {
    const catalog = document.getElementById('catalog'); // Используем ваш ID из строки 17
    if (!catalog) return;
    
    catalog.innerHTML = ''; 

    dramas.forEach(drama => {
        const card = document.createElement('div');
        card.classList.add('drama-card'); // Стилизуйте этот класс в CSS
        
        // Ссылка на плеер
        const playerUrl = drama.link.startsWith('http') ? drama.link : `https:${drama.link}`;
        
        // Создаем превью карточки (клик по ней откроет плеер)
        card.innerHTML = `
            <h3>${drama.title}</h3>
            <p>Год: ${drama.year}</p>
            <button class="watch-btn">Смотреть</button>
        `;
        
        // Логика клика: открываем плеер в вашем модальном окне
        card.querySelector('.watch-btn').addEventListener('click', () => {
            openPlayer(playerUrl);
        });

        catalog.appendChild(card);
    });
}

// 3. Функция открытия плеера в <iframe id="video-player">
function openPlayer(url) {
    const playerIframe = document.getElementById('video-player'); // Ваш ID из строки 26
    const modal = document.getElementById('player-modal'); // Ваш ID из строки 19
    
    if (playerIframe && modal) {
        playerIframe.src = url; // Вставляем ссылку в iframe
        modal.classList.remove('modal-hidden'); // Показываем модальное окно
    }
}

// Слушатель для поиска (у вас в строке 13 есть <input id="search">)
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка дорам при старте
    loadDramas();

    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (e.target.value.length > 2) {
                loadDramas(e.target.value);
            } else if (e.target.value.length === 0) {
                loadDramas(); // Возвращаем список, если поиск очищен
            }
        });
    }
    
    // Закрытие модального окна при клике на крестик (строка 21)
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modal = document.getElementById('player-modal');
            const playerIframe = document.getElementById('video-player');
            if (modal) modal.classList.add('modal-hidden');
            if (playerIframe) playerIframe.src = ''; // Останавливаем видео при закрытии
        });
    }
});
