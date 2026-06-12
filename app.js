let doramaData = [];

// 1. Загружаем данные из movies.json
fetch('./movies.json')
    .then(response => response.json())
    .then(data => {
        doramaData = data;
        displayDoramas(doramaData);
    });

// Функция вывода карточек на экран
function displayDoramas(list) {
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = ''; 

    if (list.length === 0) {
        catalog.innerHTML = '<p style="padding: 20px;">Дорамы не найдены.</p>';
        return;
    }

    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Внимательно посмотри: здесь используются именно косые кавычки `
        card.innerHTML = `
            <img src="${item.poster}" alt="${item.title}">
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.year} | ${item.genre.join(', ')}</p>
            </div>
        `;
        
        card.addEventListener('click', () => openPlayer(item));
        catalog.appendChild(card);
    });
}

// 3. Открытие плеера
function openPlayer(item) {
    document.getElementById('modal-title').innerText = item.title;
    document.getElementById('video-player').src = item.player_url;
    document.getElementById('player-modal').classList.remove('hidden');
}

// 4. Закрытие плеера
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('player-modal').classList.add('hidden');
    document.getElementById('video-player').src = ''; // Сбрасываем видео, чтобы звук не шел на фоне
});

// 5. Живой поиск
document.getElementById('search').addEventListener('input', (e) => {
    const text = e.target.value.toLowerCase();
    const filtered = doramaData.filter(item => 
        item.title.toLowerCase().includes(text) || 
        item.orig_title.toLowerCase().includes(text)
    );
    displayDoramas(filtered);
});
