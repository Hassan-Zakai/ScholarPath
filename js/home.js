/* =====================================================
   Home page - "Your saved items" list (favorites)
   Reads the favorites saved by the Scholarships and Universities pages.
===================================================== */

(function () {

    const list = document.getElementById("saved-list");
    if (!list) return;                         // only runs on the home page

    let scholarships = [];
    let universities = [];

    // Work with either spelling of the favorites functions in main.js
    function savedItems() {
        if (typeof getFavorites === "function") return getFavorites();
        if (typeof getfavorites === "function") return getfavorites();
        return [];
    }

    function removeFavorite(type, id) {
        if (typeof toggleFavorite === "function") return toggleFavorite(type, id);
        if (typeof togglefavorites === "function") return togglefavorites(type, id);
    }

    function makeEl(tag, className, text) {
        const e = document.createElement(tag);
        if (className) e.className = className;
        if (text !== undefined) e.textContent = text;
        return e;
    }

    function render() {

        list.innerHTML = "";

        // Match each saved {type, id} with its full record from the JSON data
        const found = savedItems().map(function (fav) {
            const source = fav.type === "scholarship" ? scholarships : universities;
            const record = source.find(function (x) { return x.id === fav.id; });
            return record ? { type: fav.type, record: record } : null;
        }).filter(Boolean);

        if (found.length === 0) {
            list.appendChild(makeEl("li", "saved-empty",
                "Nothing saved yet. Tap the heart on a scholarship or university and it will appear here."));
            return;
        }

        found.forEach(function (item) {

            const li = makeEl("li", "saved-item");

            const text = makeEl("div", "saved-text");
            const isScholarship = item.type === "scholarship";

            const link = makeEl("a", "saved-name", item.record.name);
            link.href = (isScholarship ? "scholarships.html" : "universities.html") +
                "?q=" + encodeURIComponent(item.record.name);
            text.appendChild(link);

            const meta = isScholarship
                ? "Scholarship | " + item.record.country + " | " + item.record.level
                : "University | " + item.record.location + ", " + item.record.country;
            text.appendChild(makeEl("span", "saved-meta", meta));

            const remove = makeEl("button", "saved-remove", "Remove");
            remove.type = "button";
            remove.setAttribute("aria-label", "Remove " + item.record.name + " from saved items");
            remove.addEventListener("click", function () {
                removeFavorite(item.type, item.record.id);
                render();
            });

            li.appendChild(text);
            li.appendChild(remove);
            list.appendChild(li);

        });

    }

    async function load() {

        try {

            const results = await Promise.all([
                fetch("data/scholarships.json").then(function (r) { return r.json(); }),
                fetch("data/universities.json").then(function (r) { return r.json(); })
            ]);
            scholarships = results[0];
            universities = results[1];
            render();

        } catch (error) {

            console.error("Saved items error:", error);
            list.innerHTML = "";
            list.appendChild(makeEl("li", "saved-empty", "Could not load saved items. Open the site with Live Server."));

        }

    }

    // Saved something in another tab? Update this list too.
    window.addEventListener("storage", render);

    document.addEventListener("DOMContentLoaded", load);

})();
