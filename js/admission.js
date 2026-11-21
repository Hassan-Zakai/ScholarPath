/* =====================================================
   ScholarPath - Admission Requirements Checklist  (Shahzaib Ahmed)
   - General checklist of 8 common tasks, or one specific to a university
     (university requirements come from data/universities.json).
   - Ticks are saved in localStorage under "scholarpathChecklist":
       { "general": [0, 2], "3": [1] }   (indexes of ticked items per list)
===================================================== */

const CHECKLIST_KEY = "scholarpathChecklist";

// The 8 common tasks shown by default
const GENERAL_ITEMS = [
    "Valid CNIC or passport",
    "Academic transcripts and certificates",
    "English proficiency test result (IELTS / TOEFL)",
    "Admission or entrance test result",
    "Personal statement or motivation letter",
    "Updated CV / resume",
    "Recommendation letters",
    "Application fee payment and passport-size photographs"
];

let universities = [];       // loaded from JSON (stays empty if loading fails)
let savedTicks = {};         // { listId: [ticked indexes] }

const listBox = document.getElementById("admission-checklist");
const select = document.getElementById("uni-select");
const progressLabel = document.getElementById("progress-label");
const progressFill = document.getElementById("progress-fill");
const progressTrack = document.getElementById("progress-track");


/* ---------- saving and loading ticks ---------- */
function loadTicks() {
    try {
        return JSON.parse(localStorage.getItem(CHECKLIST_KEY)) || {};
    } catch (error) {
        return {};
    }
}

function saveTicks() {
    try {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(savedTicks));
    } catch (error) {
        console.warn("Could not save checklist");
    }
}


/* ---------- which items to show for the selected list ---------- */
function getItems() {

    const university = universities.find(function (u) {
        return String(u.id) === select.value;
    });

    if (!university) return GENERAL_ITEMS;

    // The university's own requirements, plus two documents every application needs
    return university.requirements.concat([
        "Application fee payment receipt",
        "Passport-size photographs"
    ]);

}


/* ---------- draw the checklist and the progress bar ---------- */
function renderChecklist() {

    const items = getItems();
    const ticked = new Set(savedTicks[select.value] || []);

    listBox.innerHTML = "";

    items.forEach(function (text, index) {

        const label = document.createElement("label");
        label.className = "check-item";
        label.classList.toggle("done", ticked.has(index));

        const box = document.createElement("input");
        box.type = "checkbox";
        box.checked = ticked.has(index);

        const span = document.createElement("span");
        span.textContent = text;

        box.addEventListener("change", function () {
            toggleItem(index, box.checked);
        });

        label.appendChild(box);
        label.appendChild(span);
        listBox.appendChild(label);

    });

    updateProgress(ticked.size, items.length);

}

function toggleItem(index, isChecked) {

    const ticked = new Set(savedTicks[select.value] || []);
    if (isChecked) ticked.add(index); else ticked.delete(index);

    savedTicks[select.value] = Array.from(ticked);
    saveTicks();
    renderChecklist();

}

function updateProgress(done, total) {

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    progressLabel.textContent = done + " of " + total + " completed" +
        (done === total && total > 0 ? " - ready to apply!" : "");
    progressFill.style.width = percent + "%";
    progressTrack.setAttribute("aria-valuenow", percent);

}


/* ---------- start ---------- */
async function startChecklist() {

    savedTicks = loadTicks();

    // The general checklist works even if the university data fails to load
    try {

        const response = await fetch("data/universities.json");
        if (!response.ok) throw new Error("Failed to fetch university data");
        universities = await response.json();

        universities.forEach(function (u) {
            const option = document.createElement("option");
            option.value = u.id;
            option.textContent = u.name;
            select.appendChild(option);
        });

        // admissions.html?uni=3 opens that university's list (links from the Universities page)
        const wanted = new URLSearchParams(window.location.search).get("uni");
        if (wanted && universities.some(function (u) { return String(u.id) === wanted; })) {
            select.value = wanted;
        }

    } catch (error) {
        console.error("Error loading universities:", error);
    }

    renderChecklist();

}

select.addEventListener("change", function () {
    // keep the address bar in sync so the page can be shared or refreshed
    const url = select.value === "general" ? "admissions.html" : "admissions.html?uni=" + select.value;
    history.replaceState(null, "", url);
    renderChecklist();
});

document.getElementById("reset-checklist").addEventListener("click", function () {
    delete savedTicks[select.value];
    saveTicks();
    renderChecklist();
});

startChecklist();
