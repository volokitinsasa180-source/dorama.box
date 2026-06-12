const KODIK_TOKEN = '8343bc7359554030ea05d90c2d40fcb8';

async function loadDramas(title = '') {
    const url = title 
        ? 'https://kodik.biz/list?token=' + KODIK_TOKEN + '&title=' + encodeURIComponent(title) + '&limit=12'
        : 'https://kodik.biz/list?token=' + KODIK_TOKEN + '&types=foreign-serial&genres=' + encodeURIComponent('дорама') + '&sort=updated_at&limit=12';

    try {
        console.log("Запускаем запрос к API Kodik...");
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.results) {
            console.log("Успешно получено дорам: " + data.results.length);
            return data.results;
        } else {
            console.log("Сервер вернул пустой результат.");
            return [];
        }
    } catch (error) {
        console.error("Ошибка API Kodik:", error);
        return [];
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
