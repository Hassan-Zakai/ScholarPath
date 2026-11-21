/* =====================================================
   ScholarPath - Universities Module  (Shahzaib Ahmed)
   Data comes from data/universities.json.
   Favorites use the shared functions in js/main.js.
===================================================== */

let universities = [];              // every university from the JSON file

const grid = document.getElementById("uniGrid");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const programFilter = document.getElementById("programFilter");
const savedOnly = document.getElementById("savedOnly");


/* ---------- favorites helpers (work with either spelling used in main.js) ---------- */
function safeIsFavorite(type, id) {
    if (typeof isFavorite === "function") return isFavorite(type, id);
    if (typeof isfavorite === "function") return isfavorite(type, id);
    return false;
}

function safeToggleFavorite(type, id) {
    if (typeof toggleFavorite === "function") return toggleFavorite(type, id);
    if (typeof togglefavorites === "function") return togglefavorites(type, id);
}

function setHeart(button, saved) {
    button.textContent = saved ? "♥" : "♡";
    button.classList.toggle("saved", saved);
    button.setAttribute("aria-pressed", saved ? "true" : "false");
    button.title = saved ? "Remove from favorites" : "Save to favorites";
}


/* ---------- small helper: create an element with a class and text ---------- */
function makeEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}


/* =====================================================
   1. Load the data
===================================================== */
async function loadUniversities() {

    try {

        const response = await fetch("data/universities.json");
        if (!response.ok) throw new Error("Failed to fetch university data");

        universities = await response.json();

        fillProgramDropdown();

        // Links like universities.html?q=Oxford pre-fill the search box
        const q = new URLSearchParams(window.location.search).get("q");
        if (q) searchInput.value = q;

        applyFilters();

    }

    catch (error) {

        console.error("Error loading universities:", error);
        grid.innerHTML = "";
        grid.appendChild(makeEl("p", "",
            "Could not load universities. Please open the site with VS Code Live Server " +
            "(not by double-clicking the file)."));

    }

}


/* Fill the program dropdown with every program found in the data */
function fillProgramDropdown() {

    const programs = new Set();
    universities.forEach(function (u) {
        u.programs.forEach(function (p) { programs.add(p); });
    });

    Array.from(programs).sort().forEach(function (program) {
        const option = document.createElement("option");
        option.value = program;
        option.textContent = program;
        programFilter.appendChild(option);
    });

}


/* =====================================================
   2. Create ONE university card
===================================================== */
function createUniCard(u) {

    const card = makeEl("div", "card uni-card");

    card.appendChild(makeEl("h3", "", u.name));
    card.appendChild(makeEl("p", "uni-location", u.location + ", " + u.country));

    // Type + program chips
    const chips = makeEl("div", "chips");
    chips.appendChild(makeEl("span", "chip chip-type", u.type));
    u.programs.forEach(function (program) {
        chips.appendChild(makeEl("span", "chip", program));
    });
    card.appendChild(chips);

    card.appendChild(makeEl("p", "", u.details));

    // Footer: link to the checklist + heart button
    const actions = makeEl("div", "card-actions");

    const link = makeEl("a", "btn-ghost", "View requirements");
    link.href = "admissions.html?uni=" + encodeURIComponent(u.id);

    const heart = makeEl("button", "fav-btn");
    heart.type = "button";
    heart.setAttribute("aria-label", "Save " + u.name + " to favorites");
    setHeart(heart, safeIsFavorite("university", u.id));     // check saved state every time a card is built
    heart.addEventListener("click", function () {
        safeToggleFavorite("university", u.id);
        setHeart(heart, safeIsFavorite("university", u.id));
    });

    actions.appendChild(link);
    actions.appendChild(heart);
    card.appendChild(actions);

    return card;

}


/* =====================================================
   3. Search + filters (all four are checked together)
===================================================== */
function applyFilters() {

    const search = searchInput.value.trim().toLowerCase();
    const type = typeFilter.value;
    const program = programFilter.value;

    const filtered = universities.filter(function (u) {

        // Search looks in name, location, country and programs
        const matchesSearch =
            search === "" ||
            u.name.toLowerCase().includes(search) ||
            u.location.toLowerCase().includes(search) ||
            u.country.toLowerCase().includes(search) ||
            u.programs.join(" ").toLowerCase().includes(search);

        const matchesType = type === "" || u.type === type;
        const matchesProgram = program === "" || u.programs.includes(program);
        const matchesSaved = !savedOnly.checked || safeIsFavorite("university", u.id);

        return matchesSearch && matchesType && matchesProgram && matchesSaved;

    });

    renderUniversities(filtered);

}

function renderUniversities(list) {

    grid.innerHTML = "";
    document.getElementById("uni-count").textContent = list.length;
    document.getElementById("uni-empty").hidden = list.length > 0;

    list.forEach(function (u) {
        grid.appendChild(createUniCard(u));
    });

}

function resetFilters() {
    searchInput.value = "";
    typeFilter.value = "";
    programFilter.value = "";
    savedOnly.checked = false;
    applyFilters();
}


/* =====================================================
   4. Connect events and start
===================================================== */
searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
programFilter.addEventListener("change", applyFilters);
savedOnly.addEventListener("change", applyFilters);
document.getElementById("uni-reset").addEventListener("click", resetFilters);
document.getElementById("uni-empty-reset").addEventListener("click", resetFilters);

// A favorite changed in another tab: redraw so hearts stay correct
window.addEventListener("storage", applyFilters);

loadUniversities();
