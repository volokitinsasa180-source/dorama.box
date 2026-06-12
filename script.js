const fs = require('fs');

// Используем публичный рабочий токен Kodik для теста
const API_URL = "https://api.kodik-storage.com/list?token=8667dc994f30508cb56d091e70e95a94&types=serial&genres=дорама&with_material_data=true&limit=50";

async function fetchNewDoramas() {
    try {
        console.log("Связываемся с базой данных Kodik...");
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            console.log("База данных вернула пустой список.");
            return;
        }

        const freshDoramas = data.results.map(item => {
            const info = item.material_data || {};
            return {
                id: item.id,
                title: item.title || info.title || "Без названия",
                orig_title: item.title_orig || info.title_en || "",
                year: item.year || info.year || 2024,
                genre: info.genres || ["Дорама"],
                poster: info.poster_url || "https://placehold.co/300x450/2f2f2f/fff?text=No+Poster",
                description: info.description || "Описание скоро появится...",
                player_url: item.link
            };
        });

        // Записываем данные в файл
        fs.writeFileSync('./movies.json', JSON.stringify(freshDoramas, null, 2));
        console.log(`Успешно! В movies.json сохранено ${freshDoramas.length} дорам.`);

    } catch (error) {
        console.error("Ошибка парсера:", error);
        process.exit(1);
    }
}

fetchNewDoramas();
