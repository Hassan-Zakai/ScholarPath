/* =====================================================
   ScholarPath - Scholarships Module  (Ali Muhammad)
   Day 2: load data + render cards + dropdowns
   Day 3: search, filters, reset, empty state, Show More
   Day 4: days-left badges + favorite (heart) button
   Final: "Apply Now" button linking to the official website
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

        // Links like scholarships.html?q=Chevening pre-fill the search box
        const q = new URLSearchParams(window.location.search).get("q");
        if (q) {
            document.getElementById("search-input").value = q;
            updateClearButton();
        }

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

// Small inline icons (fixed strings written by us, not user data)
const ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
const ICON_CALENDAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';

// Small helper: create an element with a class and text
function makeEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

function createCard(scholarship) {

    const days = daysLeft(scholarship.deadline);
    const badgeInfo = getDeadlineBadge(days);

    const card = makeEl("div", "scholarship-card");
    if (days < 0) card.classList.add("expired");

    // --- Picture area: image + days-left badge + heart on top of it ---
    const media = makeEl("div", "card-media");

    if (scholarship.image) {
        const img = document.createElement("img");
       img.src = scholarship.image.replace("images/scholarships/", "scholarships/");
        img.alt = "Illustration for " + scholarship.name;
        img.loading = "lazy";
        // If the picture file is missing, just remove it (the blue background stays)
        img.addEventListener("error", function () { img.remove(); });
        media.appendChild(img);
    }

    media.appendChild(makeEl("span", "badge " + badgeInfo.cls, badgeInfo.text));

    const heart = makeEl("button", "fav-btn");
    heart.type = "button";
    heart.setAttribute("aria-label", "Save " + scholarship.name + " to favorites");

    // Check saved state EVERY time a card is built, so hearts stay correct
    // after search, filters, reset, Show More and page refresh.
    setHeart(heart, safeIsFavorite("scholarship", scholarship.id));

    heart.addEventListener("click", function () {
        safeToggleFavorite("scholarship", scholarship.id);
        setHeart(heart, safeIsFavorite("scholarship", scholarship.id));
    });
    media.appendChild(heart);

    // --- Text area ---
    const body = makeEl("div", "card-body");

    const title = makeEl("div", "card-title");
    title.appendChild(makeEl("h3", "", scholarship.name));
    const country = makeEl("p", "card-country");
    country.innerHTML = ICON_PIN;
    country.appendChild(document.createTextNode(scholarship.country));
    title.appendChild(country);

    const chips = makeEl("div", "chips");
    chips.appendChild(makeEl("span", "chip chip-level", scholarship.level));
    chips.appendChild(makeEl("span", "chip chip-field", scholarship.field));

    const eligibility = makeEl("div", "eligibility");
    eligibility.appendChild(makeEl("span", "label", "WHO CAN APPLY"));
    eligibility.appendChild(makeEl("p", "", scholarship.eligibility));

    const footer = makeEl("div", "card-footer");
    const deadline = makeEl("div", "deadline");
    deadline.innerHTML = ICON_CALENDAR;
    const deadlineText = makeEl("div");
    deadlineText.appendChild(makeEl("small", "", "Deadline"));
    deadlineText.appendChild(makeEl("strong", "", formatDate(scholarship.deadline)));
    deadline.appendChild(deadlineText);
    footer.appendChild(deadline);

    // Apply Now: opens the official scholarship website in a new tab
    if (scholarship.applyLink) {
        const apply = makeEl("a", "apply-btn", "Apply Now");
        apply.href = scholarship.applyLink;
        apply.target = "_blank";
        apply.rel = "noopener noreferrer";
        apply.setAttribute("aria-label", "Apply now for " + scholarship.name + " (opens the official website in a new tab)");
        footer.appendChild(apply);
    }

    body.appendChild(title);
    body.appendChild(chips);
    body.appendChild(eligibility);
    body.appendChild(footer);

    card.appendChild(media);
    card.appendChild(body);

    return card;
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

// Show the little x in the search bar only when there is text
function updateClearButton() {
    const hasText = document.getElementById("search-input").value !== "";
    document.getElementById("search-clear").hidden = !hasText;
}

function resetFilters() {

    document.getElementById("search-input").value = "";
    document.getElementById("level-filter").value = "";
    document.getElementById("country-filter").value = "";
    document.getElementById("field-filter").value = "";

    updateClearButton();
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
    document.getElementById("search-input").addEventListener("input", function () {
        updateClearButton();
        applyFilters();
    });

    // The x button inside the search bar
    document.getElementById("search-clear").addEventListener("click", function () {
        document.getElementById("search-input").value = "";
        updateClearButton();
        applyFilters();
        document.getElementById("search-input").focus();
    });

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
