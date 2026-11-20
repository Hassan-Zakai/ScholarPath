console.log("ScholarPath loaded");
const STORAGE_KEY = 'scholarpathFavorites';

function getFavorites() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function isFavorite(type, id) {
    const favorites = getFavorites();
    return favorites.some(item => item.type === type && item.id === id);
}

function toggleFavorite(type, id) {
    let favorites = getFavorites();
    const index = favorites.findIndex(item => item.type === type && item.id === id);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ type, id });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return favorites;
}

const menuToggle = document.getElementById('menu-toggle');
const navbar = document.querySelector('.navbar');

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', function () {
        navbar.classList.toggle('open');
    });
}
