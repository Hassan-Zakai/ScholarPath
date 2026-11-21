# ScholarPath

A student portal to discover scholarships, compare universities, and track admission deadlines.
BCS-1L, FAST-NUCES Karachi: Muhammad Hassan Zakai (26K-0966), Ali Muhammad (26K-0985), Shahzaib Ahmed (26K-1070).

## How to run
The pages load JSON files with `fetch()`, so open the folder in VS Code and use **Live Server**
(right-click `index.html` -> Open with Live Server). Double-clicking the HTML files will not load the data.

## Features
* **Home (`index.html`)**: hero, quick links to each section, and a "Your saved items" list.
* **Scholarships (`scholarships.html`)**: picture cards, search, level/country/field filters, "days left" / "Expired" badges, Show More, favorites, and an **Apply Now** button on every card that opens the official scholarship website in a new tab.
* **Universities (`universities.html`)**: search, type and program filters, "Saved only", favorites, link to each university's checklist.
* **Admissions (`admissions.html`)**: tick-off checklist (general or per university) with a progress bar that is saved in the browser.
* **Favorites**: `localStorage` key `scholarpathFavorites`, items stored as `{ type: "scholarship" | "university", id }`.

## Folder structure
```
index.html  scholarships.html  universities.html  admissions.html
css/   style.css (Hassan)  universities.css, admissions.css (Shahzaib)
js/    main.js, home.js (Hassan)  scholarships.js (Ali)  universities.js, admission.js (Shahzaib)
data/  scholarships.json (Ali)  universities.json (Shahzaib)
images/scholarships/  12 illustrations used by the scholarship cards
```

## Who built what
| Member | Files |
|---|---|
| Hassan | `index.html`, `css/style.css`, `js/main.js`, `js/home.js`, `README.md` |
| Ali | `scholarships.html`, `js/scholarships.js`, `data/scholarships.json`, `images/` |
| Shahzaib | `universities.html`, `admissions.html`, `js/universities.js`, `js/admission.js`, `data/universities.json`, `css/universities.css`, `css/admissions.css` |

## Team guidelines
* Keep the navbar labels the same on every page (`Home`, `Scholarships`, `Universities`, `Admissions`).
* Load `js/main.js` first, then the page's own script.
* Favorites functions (in `js/main.js`): `getFavorites()`, `isFavorite(type, id)`, `toggleFavorite(type, id)`.
* Only Hassan edits `css/style.css`. Page-specific CSS goes in the page's own file.

## Apply links
Each scholarship in `data/scholarships.json` has an `applyLink` field with the official website of that scholarship.
The **Apply Now** button on the card opens it in a new tab (`target="_blank"` with `rel="noopener noreferrer"`).
To change a link, edit `applyLink` in the JSON file. No code change is needed. If a scholarship has no `applyLink`, its card simply shows no button.

## Design notes
Cards have no hover animation (no lift, shadow or image zoom). Interactive elements such as buttons and links still change colour on hover.

## Sample data
Scholarship and university details (deadlines, fees, requirements) are illustrative sample data for a class project.
Always confirm them on the official websites before relying on them.
