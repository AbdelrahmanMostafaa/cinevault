# CineVault

Description
- CineVault is a demo site focused on movies and simple browsing. It includes a hero area, a featured carousel, movie detail pages and a contact form.

What’s included
- HTML pages: `index.html`, `movies.html`, `details.html`, `favorites.html`, `contact.html`.
- `css/` with `style.css` and `css/themes/theme-cinevault.css`.
- `data/items.js` contains the demo movies and poster information.
- `js/script.js` contains rendering logic and favorites storage in `localStorage`.

How to run
1. Open `index.html` in a browser for a quick demo.
2. Or start a local web server (recommended) with Python in PowerShell:
  ```powershell
  cd c:\Users\CONNECT\Desktop\Websites\cinevault
  python -m http.server 8001
  ```
3. Open http://localhost:8001

Images
- When `assets/images/` is empty the site uses Unsplash CDN for hero / poster images.
- To use local images instead, download them to `assets/images/` and update `data/items.js` and `index.html` hero image.

Code & Implementation
- Uses Bootstrap 5 from CDN.
- `data/items.js` exports a `MOVIES` array which `js/script.js` renders as cards.
- `movies.html` and `index.html` reference movie posters from `data/items.js`.

Customization tips
- To change themes, edit `css/themes/theme-cinevault.css`.
- To change or add movies, update `MOVIES` in `data/items.js`.

License & Notes
- Unsplash images are used when `assets/images/` does not contain files and are not guaranteed to be identical between reloads.
