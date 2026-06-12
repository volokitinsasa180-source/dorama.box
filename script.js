const fs = require('fs');

// 1. Ссылка на API видеобалансера Kodik
// Этот запрос просит выдать последние 50 обновленных сериалов с жанром "дорама"
const API_URL = "https://kodikapi.com/list?token=8667dc994f30508cb56d091e70e95a94&types=anime-serial,serial&genres=дорама&with_material_data=true&limit=50";

async function fetchNewDoramas() {
    try {
        console.log("Запрос к базе данных дорам...");
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            console.log("Новых дорам не найдено.");
            return;
        }

        // 2. Трансформируем полученные от API данные под формат нашего сайта
        const freshDoramas = data.results.map(item => {
            // Проверяем, есть ли расширенная информация (постер, описание)
            const info = item.material_data || {};

            return {
                id: item.id,
                title: item.title || info.title || "Без названия",
                orig_title: item.title_orig  info.title_en  "",
                year: item.year || info.year || 2026,
                // Если жанров нет, ставим дефолтное значение
                genre: info.genres || ["Дорама"],
                // Берем постер, если его нет — ставим заглушку
                poster: info.poster_url || "https://placehold.co/300x450/2f2f2f/fff?text=No+Poster",
                description: info.description || "Описание временно отсутствует...",
                // Это готовая ссылка на плеер со всеми сериями и озвучками
                player_url: item.link
            };
        });

        // 3. Перезаписываем наш файл movies.json новыми данными
        fs.writeFileSync('movies.json', JSON.stringify(freshDoramas, null, 2));
        console.log(Успешно обновлено! В базу записано ${freshDoramas.length} дорам.);

    } catch (error) {
        console.error("Ошибка при работе робота-парсера:", error);
        // Заставляем GitHub Actions выдать ошибку, если что-то пошло не так
        process.exit(1); 
    }
}

// Запускаем процесс
fetchNewDoramas();