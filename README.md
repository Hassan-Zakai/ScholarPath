# ScholarPath: Scholarship & University Finder

A simple website that helps students find scholarships, explore universities, and track admission requirements.

**Course:** Information and Communication Technology
**University:** National University of Computer & Emerging Sciences (FAST-NUCES), Karachi Campus

## Team Members

| Name | Roll No. | Responsibility |
|---|---|---|
| Muhammad Hassan Zakai | 26K-0966 | Home page, shared CSS, favorites (main.js), integration |
| Ali Muhammad | 26K-0985 | Scholarships page, search and filters, deadlines |
| Shahzaib Ahmed | 26K-1070 | Universities page, admission checklist |

## Features

- **Home page** with project introduction, links to all sections, and a "My Favorites" section
- **Scholarships page** with search, filters (study level, country, field), deadline display and favorite button
- **Universities page** with search, filters (type, program) and favorite button
- **Admission page** with a checklist that students can tick off (progress is saved)
- **Favorites** saved in the browser using localStorage (key: `scholarpathFavorites`)
- **Responsive design** for desktop, tablet and mobile

## Technologies

HTML5, CSS3, JavaScript, JSON, localStorage

## Folder Structure

```
ScholarPath/
├── index.html
├── scholarships.html
├── universities.html
├── admission.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── scholarships.js
│   ├── universities.js
│   └── admission.js
├── data/
│   ├── scholarships.json
│   └── universities.json
└── README.md
```

## How to Run

1. Clone the repository:
   ```
git clone https://github.com/Hassan-Zakai/ScholarPath
   ```
2. Open the `ScholarPath` folder in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html` and choose **Open with Live Server**.

> Do not open the HTML files by double-clicking. The site loads JSON files with `fetch`, which needs a local server (Live Server).

## How Favorites Work

Each favorite is stored as `{ type: "scholarship" | "university", id: number }` in localStorage. The home page reads these entries, finds the matching item in the JSON files and shows it as a card.

## Note

The scholarship, university and admission data is **sample data** for a student project. Please verify details on official websites before applying.