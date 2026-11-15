
/* =====================================
   ScholarPath - Scholarships Module
   Cards Rendering
===================================== */

// Global array to store scholarship data
let allScholarships = [];


// 1. Fetch scholarship data from JSON
async function loadScholarships() {

    try {

        const response = await fetch("data/scholarships.json");

        if (!response.ok) {
            throw new Error("Failed to fetch scholarship data");
        }

        allScholarships = await response.json();

        console.log("Scholarships loaded:", allScholarships);

        // Render scholarship cards
        renderCards(allScholarships);

        // Populate country and field dropdowns
        populateCountryDropdown();
        populateFieldDropdown();

    }

    catch (error) {

        console.error("Error loading scholarships:", error);

    }

}


// 2. Render scholarship cards
function renderCards(list) {

    const container = document.getElementById("scholarship-cards");
    const resultCount = document.getElementById("result-count");

    // Clear previous cards
    container.innerHTML = "";

    // Update result count
    resultCount.textContent = list.length;

    // Display message if no scholarships are available
    if (list.length === 0) {

        container.textContent = "No scholarships found.";
        return;

    }

    // Loop through scholarship list
    list.forEach(function(scholarship) {

        // Create card
        const card = document.createElement("div");
        card.classList.add("scholarship-card");

        // Scholarship name
        const name = document.createElement("h3");
        name.textContent = scholarship.name;

        // Country
        const country = document.createElement("p");
        country.textContent = "Country: " + scholarship.country;

        // Study level
        const level = document.createElement("p");
        level.textContent = "Level: " + scholarship.level;

        // Field
        const field = document.createElement("p");
        field.textContent = "Field: " + scholarship.field;

        // Eligibility
        const eligibility = document.createElement("p");
        eligibility.textContent = "Eligibility: " + scholarship.eligibility;

        // Deadline
        const deadline = document.createElement("p");
        deadline.textContent = "Deadline: " + scholarship.deadline;

        // Add elements to card
        card.appendChild(name);
        card.appendChild(country);
        card.appendChild(level);
        card.appendChild(field);
        card.appendChild(eligibility);
        card.appendChild(deadline);

        // Add card to container
        container.appendChild(card);

    });

    console.log("Scholarship cards rendered successfully!");

}


// 3. Populate country dropdown
function populateCountryDropdown() {

    const dropdown = document.getElementById("country-filter");

    // Get unique countries from JSON
    const countries = new Set(
        allScholarships.map(function(scholarship) {
            return scholarship.country;
        })
    );

    // Add countries to dropdown
    countries.forEach(function(country) {

        const option = document.createElement("option");

        option.value = country;
        option.textContent = country;

        dropdown.appendChild(option);

    });

    console.log("Country dropdown populated!");

}


// 4. Populate field dropdown
function populateFieldDropdown() {

    const dropdown = document.getElementById("field-filter");

    // Get unique fields from JSON
    const fields = new Set(
        allScholarships.map(function(scholarship) {
            return scholarship.field;
        })
    );

    // Add fields to dropdown
    fields.forEach(function(field) {

        const option = document.createElement("option");

        option.value = field;
        option.textContent = field;

        dropdown.appendChild(option);

    });

    console.log("Field dropdown populated!");

}


// 5. Load scholarships when page opens
document.addEventListener("DOMContentLoaded", function() {

    loadScholarships();

});

