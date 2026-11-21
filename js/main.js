console.log("ScholarPath loaded");
const STORAGE_KEY = 'scholarpathFavorites';

function getFavorites() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function isFavorite(type, id) {
    const favorites = getFavorites();
    return favorites.some(item => item.type === type && Number(item.id) === Number(id));
}

function toggleFavorite(type, id) {
    let favorites = getFavorites();
    const index = favorites.findIndex(item => item.type === type && Number(item.id) === Number(id));

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ type, id: Number(id) });
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
// ===== My Favorites (home page) =====
async function showFavorites() {
    const list = document.getElementById("favorites-list");
    if (!list) return; // sirf home page par chale

    const favs = getFavorites();

    if (favs.length === 0) {
        list.innerHTML = "<p>Abhi koi favorite nahi.</p>";
        return;
    }

    try {
        const [schRes, uniRes] = await Promise.all([
            fetch("data/scholarships.json"),
            fetch("data/universities.json")
        ]);
        const scholarships = await schRes.json();
        const universities = await uniRes.json();

        let html = "";

        favs.forEach(function (fav) {
            if (fav.type === "scholarship") {
                const s = scholarships.find(x => Number(x.id) === Number(fav.id));
                if (!s) return;
                html += `
                <div class="card">
                    <h3>${s.name}</h3>
                    <p>${s.country} | ${s.level} | ${s.field}</p>
                    <p>Deadline: ${s.deadline}</p>
                    <button class="btn remove-fav" data-type="scholarship" data-id="${s.id}">Remove</button>
                </div>`;
            } else if (fav.type === "university") {
                const u = universities.find(x => Number(x.id) === Number(fav.id));
                if (!u) return;
                html += `
                <div class="card">
                    <h3>${u.name}</h3>
                    <p>${u.city} | ${u.type}</p>
                    <p>Programs: ${Array.isArray(u.programs) ? u.programs.join(", ") : u.programs}</p>
                    <button class="btn remove-fav" data-type="university" data-id="${u.id}">Remove</button>
                </div>`;
            }
        });

        list.innerHTML = html || "<p>Abhi koi favorite nahi.</p>";

        list.querySelectorAll(".remove-fav").forEach(function (btn) {
            btn.addEventListener("click", function () {
                toggleFavorite(btn.dataset.type, Number(btn.dataset.id));
                showFavorites();
            });
        });
    } catch (err) {
        list.innerHTML = "<p>Favorites load nahi ho sakay.</p>";
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", showFavorites);