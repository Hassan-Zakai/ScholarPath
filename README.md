# ScholarPath

A student portal to discover scholarships, compare universities, and track admission requirements.

**Course:** Information and Communication Technology
**University:** National University of Computer & Emerging Sciences (FAST-NUCES), Karachi Campus

## Team Members

| Name | Roll No. | Files |
|---|---|---|
| Muhammad Hassan Zakai | 26K-0966 | `index.html`, `css/style.css`, `js/main.js`, `js/home.js`, `README.md` |
| Ali Muhammad | 26K-0985 | `scholarships.html`, `js/scholarships.js`, `data/scholarships.json`, `scholarships/` images |
| Shahzaib Ahmed | 26K-1070 | `universities.html`, `admissions.html`, `contact.html`, `js/universities.js`, `js/admission.js`, `js/contact.js`, `data/universities.json`, `css/universities.css`, `css/admissions.css`, `css/contact.css` |

## What it has

- **Home:** hero, links to every section, and a "Your saved items" list.
- **Scholarships:** picture cards, search, level/country/field filters, "days left" and "Expired" badges, Show More, favorites, and an Apply Now button that opens the official website.
- **Universities:** search, type and program filters, "Saved only", favorites, and a link to each university's requirements.
- **Admissions:** tick-off checklist (general, or specific to one university, with different requirements for Pakistani and international universities) and a progress bar saved in the browser.
- **Contact:** team details and a feedback form saved in the browser.
- **Favorites:** saved in `localStorage` under the key `scholarpathFavorites`.

## Technologies

HTML, CSS, JavaScript, JSON, localStorage

## Folder structure

```
index.html  scholarships.html  universities.html  admissions.html  contact.html
css/    style.css  universities.css  admissions.css  contact.css
js/     main.js  home.js  scholarships.js  universities.js  admission.js  contact.js
data/   scholarships.json  universities.json
scholarships/   illustrations used on the scholarship cards
```

## How to run

Clone the repository:

```
git clone https://github.com/Hassan-Zakai/ScholarPath
```

Then open the folder in VS Code and run `index.html` with the Live Server extension. Do not double-click the HTML files, because the JSON data will not load without a server.

## Note

All scholarship and university details (deadlines, fees, requirements) are sample data for a class project. Please confirm them on the official websites before applying.