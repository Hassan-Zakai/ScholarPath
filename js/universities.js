let universities = [];

const uniGrid = document.getElementById("uniGrid");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const programFilter = document.getElementById("programFilter");

// Load university data from JSON
async function loadUniversities() {
    try {
        const response = await fetch("data/universities.json");
        if (!response.ok) {
            throw new Error("Failed to fetch universities");
        }
        universities = await response.json();
        displayUniversities(universities);
    } catch (error) {
        console.error("Error loading universities:", error);
        uniGrid.innerHTML = "<p>Unable to load university data.</p>";
    }
}

// Render university cards
function displayUniversities(list) {
    if (list.length === 0) {
        uniGrid.innerHTML = "<p>No universities found.</p>";
        return;
    }

    uniGrid.innerHTML = list.map(u => {
        const saved = isFavorite("university", u.id);
        return `
            <div class="card">
                <h3>${u.name}</h3>
                <p><strong>City:</strong> ${u.city}</p>
                <p><strong>Type:</strong> ${u.type}</p>
                <p><strong>Programs:</strong> ${u.programs.join(", ")}</p>
                <p><strong>Fee:</strong> ${u.fee}</p>
                <p>${u.details}</p>
                <button class="btn fav-btn" data-id="${u.id}">
                    ${saved ? "★ Saved" : "☆ Favorite"}
                </button>
            </div>
        `;
    }).join("");

    // Attach click events to favorite buttons
    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const id = Number(this.getAttribute("data-id"));
            toggleFavorite("university", id);
            applyFilters();
        });
    });
}

// Apply search, type, and program filters together
function applyFilters() {
    const searchText = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedProgram = programFilter.value;

    const filtered = universities.filter(u => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchText) ||
            u.city.toLowerCase().includes(searchText) ||
            u.programs.join(" ").toLowerCase().includes(searchText);

        const matchesType = !selectedType || u.type === selectedType;
        const matchesProgram = !selectedProgram || u.programs.includes(selectedProgram);

        return matchesSearch && matchesType && matchesProgram;
    });

    displayUniversities(filtered);
}

// Event listeners
searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
programFilter.addEventListener("change", applyFilters);

// Start
loadUniversities();
