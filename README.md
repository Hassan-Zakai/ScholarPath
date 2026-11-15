# ScholarPath

A student portal to discover scholarships, compare universities, and track admission deadlines.

## Features
* **Home Page (`index.html`):** Overview hero section with quick navigation cards for Scholarships, Universities, and Admissions.
* **Saved Favorites (`js/main.js`):** Persistent bookmarking system powered by browser `localStorage` (`scholarpathFavorites`).
* **Responsive Layout (`css/style.css`):** Shared header, navigation bar, card grids, and page-specific styles for filtering and search.

## Folder Structure
* `index.html` — Main landing page
* `scholarships.html` — Browse and filter scholarships
* `universities.html` — Explore and compare universities
* `admissions.html` — Admission schedules and requirements
* `css/style.css` — Global and page-specific stylesheets
* `js/main.js` — Core favorites logic and shared utilities

## Team Guidelines
* **Navbar Links:** Keep consistent across all pages (`Home`, `Scholarships`, `Universities`, `Admissions`).
* **Script Load Order:** Load `js/main.js` first before any page-specific JavaScript files.
* **Favorites Functions:**
  * `getFavorites()` — Returns the saved array of favorites.
  * `isFavorite(type, id)` — Checks if an item is already saved.
  * `toggleFavorite(type, id)` — Adds or removes an item from favorites.
