/* =====================================================
   ScholarPath - Scholarships Module  (Ali Muhammad)
   Day 2: load data + render cards + dropdowns
   Day 3: search, filters, reset, empty state, Show More
   Day 4: days-left badges + favorite (heart) button
===================================================== */

// ---------- Global variables ----------
let allScholarships = [];        // every scholarship from the JSON file
let filteredScholarships = [];   // the ones that match the current search/filters
const CARDS_PER_PAGE = 6;        // how many cards "Show More" adds each time
let visibleCount = CARDS_PER_PAGE;


/* =====================================================
   Favorites helpers
   js/main.js (Hassan) provides the real functions. The README names them
   isFavorite / toggleFavorite, but main.js currently defines them as
   isfavorite / togglefavorites (all lowercase). These two small wrappers work
   with either spelling, so this page does not break if Hassan renames them.
===================================================== */
function safeIsFavorite(type, id) {
    if (typeof isFavorite === "function") return isFavorite(type, id);
    if (typeof isfavorite === "function") return isfavorite(type, id);
    console.warn("Favorites functions not found in js/main.js");
    return false;
}

function safeToggleFavorite(type, id) {
    if (typeof toggleFavorite === "function") return toggleFavorite(type, id);
    if (typeof togglefavorites === "function") return togglefavorites(type, id);
    console.warn("Favorites functions not found in js/main.js");
}


/* =====================================================
   Date helpers
===================================================== */

// Number of days from today until the deadline.
// 0 = last day is today, negative = already expired.
// Both dates are compared at local midnight so the time of day and the
// timezone never change the answer.
function daysLeft(deadline) {
    const parts = String(deadline).split("-");          // "YYYY-MM-DD"
    const end = new Date(parts[0], parts[1] - 1, parts[2]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Math.round((end - today) / (1000 * 60 * 60 * 24));
}

// "2026-12-15" -> "15 Dec 2026"
function formatDate(deadline) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const parts = String(deadline).split("-");
    if (parts.length !== 3) return deadline;
    return Number(parts[2]) + " " + months[parts[1] - 1] + " " + parts[0];
}

// Decide the badge text and colour class for a number of days.
function getDeadlineBadge(days) {
    if (isNaN(days)) return { text: "Deadline not available", cls: "badge-normal" };
    if (days < 0)    return { text: "Expired", cls: "badge-expired" };
    if (days === 0)  return { text: "Last day today", cls: "badge-urgent" };
    if (days < 7)    return { text: days + (days === 1 ? " day left" : " days left"), cls: "badge-urgent" };
    if (days <= 30)  return { text: days + " days left", cls: "badge-soon" };
    return { text: days + " days left", cls: "badge-normal" };
}


/* =====================================================
   1. Fetch scholarship data from JSON
===================================================== */
async function loadScholarships() {

    try {

        const response = await fetch("data/scholarships.json");

        if (!response.ok) {
            throw new Error("Failed to fetch scholarship data");
        }

        allScholarships = await response.json();

        console.log("Scholarships loaded:", allScholarships.length);

        // Fill the country and field dropdowns, then show everything
        populateCountryDropdown();
        populateFieldDropdown();
        applyFilters();

    }

    catch (error) {

        console.error("Error loading scholarships:", error);

        const container = document.getElementById("scholarship-cards");
        container.innerHTML = "";

        const message = document.createElement("p");
        message.className = "load-error";
        message.textContent = "Could not load scholarships. Please open the site with " +
            "VS Code Live Server (not by double-clicking the file) and check data/scholarships.json.";
        container.appendChild(message);

    }

}


/* =====================================================
   2. Create ONE scholarship card (returns the card element)
===================================================== */
function createCard(scholarship) {

    const days = daysLeft(scholarship.deadline);
    const badgeInfo = getDeadlineBadge(days);

    const card = document.createElement("div");
    card.classList.add("scholarship-card");
    if (days < 0) card.classList.add("expired");

    // --- Top row: name + heart button ---
    const top = document.createElement("div");
    top.classList.add("card-top");

    const name = document.createElement("h3");
    name.textContent = scholarship.name;

    const heart = document.createElement("button");
    heart.type = "button";
    heart.classList.add("fav-btn");
    heart.setAttribute("aria-label", "Save " + scholarship.name + " to favorites");

    // Check saved state EVERY time a card is built, so hearts stay correct
    // after search, filters, reset, Show More and page refresh.
    setHeart(heart, safeIsFavorite("scholarship", scholarship.id));

    heart.addEventListener("click", function () {
        safeToggleFavorite("scholarship", scholarship.id);
        setHeart(heart, safeIsFavorite("scholarship", scholarship.id));
    });

    top.appendChild(name);
    top.appendChild(heart);

    // --- Days left badge ---
    const badge = document.createElement("span");
    badge.classList.add("badge", badgeInfo.cls);
    badge.textContent = badgeInfo.text;

    // --- Detail lines ---
    card.appendChild(top);
    card.appendChild(badge);
    card.appendChild(makeLine("Country: ", scholarship.country));
    card.appendChild(makeLine("Level: ", scholarship.level));
    card.appendChild(makeLine("Field: ", scholarship.field));
    card.appendChild(makeLine("Eligibility: ", scholarship.eligibility));
    card.appendChild(makeLine("Deadline: ", formatDate(scholarship.deadline)));

    return card;
}

// <p><strong>label</strong> value</p>  (textContent is used, so no HTML injection)
function makeLine(label, value) {
    const p = document.createElement("p");
    const strong = document.createElement("span");
    strong.classList.add("label");
    strong.textContent = label;
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    return p;
}

// Change the heart between empty (♡) and filled (♥)
function setHeart(button, saved) {
    button.textContent = saved ? "♥" : "♡";
    button.classList.toggle("saved", saved);
    button.setAttribute("aria-pressed", saved ? "true" : "false");
    button.title = saved ? "Remove from favorites" : "Save to favorites";
}


/* =====================================================
   3. Render scholarship cards (only the first `visibleCount`)
===================================================== */
function renderCards(list) {

    const container = document.getElementById("scholarship-cards");
    const resultCount = document.getElementById("result-count");
    const emptyState = document.getElementById("empty-state");
    const loadMore = document.getElementById("load-more-container");
    const showMoreBtn = document.getElementById("show-more");

    // Clear previous cards
    container.innerHTML = "";

    // Total number of matching scholarships (not only the visible ones)
    resultCount.textContent = list.length;

    // Empty state: show when nothing matches, hide otherwise
    emptyState.hidden = list.length > 0;

    if (list.length === 0) {
        loadMore.hidden = true;
        return;
    }

    // Show Cards 1..visibleCount
    list.slice(0, visibleCount).forEach(function (scholarship) {
        container.appendChild(createCard(scholarship));
    });

    // Show More button: visible only if there are hidden cards left
    const remaining = list.length - visibleCount;
    loadMore.hidden = remaining <= 0;
    if (remaining > 0) {
        showMoreBtn.textContent = "Show More (" + remaining + " left)";
    }

}


/* =====================================================
   4. Populate dropdowns with unique values from the JSON
===================================================== */
function populateDropdown(dropdownId, key) {

    const dropdown = document.getElementById(dropdownId);

    const values = new Set(
        allScholarships.map(function (scholarship) {
            return scholarship[key];
        })
    );

    Array.from(values).sort().forEach(function (value) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });

}

function populateCountryDropdown() {
    populateDropdown("country-filter", "country");
}

function populateFieldDropdown() {
    populateDropdown("field-filter", "field");
}


/* =====================================================
   5. Search + filters (all four are checked together)
===================================================== */
function applyFilters() {

    const search = document.getElementById("search-input").value.trim().toLowerCase();
    const level = document.getElementById("level-filter").value;
    const country = document.getElementById("country-filter").value;
    const field = document.getElementById("field-filter").value;

    filteredScholarships = allScholarships.filter(function (scholarship) {

        // Search looks in name, country and field
        const matchesSearch =
            search === "" ||
            scholarship.name.toLowerCase().includes(search) ||
            scholarship.country.toLowerCase().includes(search) ||
            scholarship.field.toLowerCase().includes(search);

        // An empty dropdown value means "All"
        const matchesLevel = level === "" || scholarship.level === level;
        const matchesCountry = country === "" || scholarship.country === country;
        const matchesField = field === "" || scholarship.field === field;

        return matchesSearch && matchesLevel && matchesCountry && matchesField;

    });

    // A new search/filter always starts again from the first 6 cards
    visibleCount = CARDS_PER_PAGE;
    renderCards(filteredScholarships);

}

function resetFilters() {

    document.getElementById("search-input").value = "";
    document.getElementById("level-filter").value = "";
    document.getElementById("country-filter").value = "";
    document.getElementById("field-filter").value = "";

    applyFilters();

}

function showMore() {
    visibleCount += CARDS_PER_PAGE;
    renderCards(filteredScholarships);
}


/* =====================================================
   6. Connect events and start the page
===================================================== */
document.addEventListener("DOMContentLoaded", function () {

    // Search box: run on every key press
    document.getElementById("search-input").addEventListener("input", applyFilters);

    // Dropdowns: run when the selection changes
    ["level-filter", "country-filter", "field-filter"].forEach(function (id) {
        document.getElementById(id).addEventListener("change", applyFilters);
    });

    // Both reset buttons (top bar and empty state)
    document.getElementById("reset-filters").addEventListener("click", resetFilters);
    document.getElementById("empty-reset").addEventListener("click", resetFilters);

    // Show More
    document.getElementById("show-more").addEventListener("click", showMore);

    // If favorites change in another tab, redraw the hearts here too
    window.addEventListener("storage", function () {
        renderCards(filteredScholarships);
    });

    loadScholarships();

});
