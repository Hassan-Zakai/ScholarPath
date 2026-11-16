let universities = [];

const universityList =
    document.getElementById("university-list");


// Load university data
async function loadUniversities() {

    try {

        const response =
            await fetch("data/universities.json");

        universities = await response.json();

        loadCountries();

        displayUniversities();

    }

    catch (error) {

        universityList.innerHTML =
            "<p>Unable to load university data.</p>";

    }

}


// Load countries
function loadCountries() {

    const countries = [
        ...new Set(universities.map(u => u.country))
    ];

    countries.forEach(country => {

        document.getElementById("university-country")
            .add(new Option(country, country));

    });

}


// Display universities
function displayUniversities() {

    const search = document
        .getElementById("university-search")
        .value.toLowerCase();

    const country = document
        .getElementById("university-country")
        .value;


    const filtered = universities.filter(u => {

        return (

            (
                u.name.toLowerCase().includes(search) ||

                u.location.toLowerCase().includes(search) ||

                u.programs.join(" ")
                    .toLowerCase()
                    .includes(search)
            )

            &&

            (!country || u.country === country)

        );

    });


    document.getElementById(
        "university-results-count"
    ).textContent =
        `Showing ${filtered.length} universities`;


    if (filtered.length === 0) {

        universityList.innerHTML =
            "<p>No universities found.</p>";

        return;

    }


    universityList.innerHTML = filtered.map(u => `

        <div class="card">

            <h3>${u.name}</h3>

            <p>
                <strong>Location:</strong>
                ${u.location}
            </p>

            <p>
                <strong>Country:</strong>
                ${u.country}
            </p>

            <p>
                <strong>Programs:</strong>
                ${u.programs.join(", ")}
            </p>

            <p>${u.details}</p>

            ${favoriteButton(
                "university",
                u.id,
                u.name
            )}

        </div>

    `).join("");

}


// Search universities
document.getElementById(
    "university-search"
).addEventListener(
    "input",
    displayUniversities
);


// Filter by country
document.getElementById(
    "university-country"
).addEventListener(
    "change",
    displayUniversities
);


// Update favorites
document.addEventListener(
    "favoritesChanged",
    displayUniversities
);


// Start program
loadUniversities();