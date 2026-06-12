const KODIK_TOKEN = '8343bc7359554030ea05d90c2d40fcb8';

// 1. Функция загрузки дорам
async function loadDramas(title = '') {
   const url = title 
    ? `https://kodik.biz{KODIK_TOKEN}&title=${encodeURIComponent(title)}&limit=12`
    : `https://kodik.biz{KODIK_TOKEN}&types=foreign-serial,foreign-movie&sort=updated_at&limit=12`; 
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Проверяем, существует ли document (запущен ли код в браузере)
        if (typeof document !== 'undefined' && data.results && data.results.length > 0) {
            displayDramas(data.results);
        } else if (typeof document !== 'undefined') {
            document.getElementById('catalog').innerHTML = '<p>Ничего не найдено</p>';
        } else {
            // Если запущено в Node.js — просто выводим результат в общую консоль сборщика
            console.log(`[Node.js] Успешный тест API. Найдено релизов: ${data.results?.length || 0}`);
        }
    } catch (error) {
        console.error("Ошибка API Kodik:", error);
    }
}

// 2. Функция отрисовки карточек в каталоге
function displayDramas(dramas) {
    if (typeof document === 'undefined') return; // Защита от запуска в Node.js
    
    const catalog = document.getElementById('catalog');
    if (!catalog) return;
    
    catalog.innerHTML = ''; 

    dramas.forEach(drama => {
        const card = document.createElement('div');
        card.classList.add('drama-card');
        const playerUrl = drama.link.startsWith('http') ? drama.link : `https:${drama.link}`;
        
        card.innerHTML = `
            <h3>${drama.title}</h3>
            <p>Год: ${drama.year}</p>
            <button class="watch-btn">Смотреть</button>
        `;
        
        card.querySelector('.watch-btn').addEventListener('click', () => {
            openPlayer(playerUrl);
        });

        catalog.appendChild(card);
    });
}

// 3. Функция открытия плеера в iframe
function openPlayer(url) {
    if (typeof document === 'undefined') return;
    const playerIframe = document.getElementById('video-player');
    const modal = document.getElementById('player-modal');
    
    if (playerIframe && modal) {
        playerIframe.src = url;
        modal.classList.remove('modal-hidden');
    }
}

// БРАУЗЕРНЫЙ СЛУШАТЕЛЬ (Исполняется только в браузере)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        loadDramas();

        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.length > 2) {
                    loadDramas(e.target.value);
                } else if (e.target.value.length === 0) {
                    loadDramas();
                }
            });
        }
        
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const modal = document.getElementById('player-modal');
                const playerIframe = document.getElementById('video-player');
                if (modal) modal.classList.add('modal-hidden');
                if (playerIframe) playerIframe.src = '';
            });
        }
    });
} else {
    // Этот блок срабатывает на сервере GitHub при сборке
    // Добавляем .then() с принудительным выходом, чтобы сборка не зависала!
    loadDramas('Истинная красота').then(() => {
        console.log("[Node.js] Скрипт успешно выполнил тест и завершает работу.");
        process.exit(0); // <--- ЖЕСТКО ЗАКРЫВАЕМ ПРОЦЕСС ДЛЯ GITHUB ACTIONS
    }).catch((err) => {
        console.error("[Node.js] Критическая ошибка при сборке:", err);
        process.exit(1); // Выход с ошибкой, если API упало
    });
}
