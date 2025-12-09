// js/script.js
// Very friendly and simple functions to show and manage movies + favorites
// Uses a global variable MOVIES from data/items.js

// Helpers
const FAVORITES_KEY = 'cinevault_favorites';

function byId(id) { return document.getElementById(id); }

// LOCAL STORAGE simple helpers (faves)
function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}
function saveFavorites(arr) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr));
}
function toggleFavorite(movieId) {
  const arr = getFavorites();
  const index = arr.indexOf(movieId);
  if (index === -1) {
    arr.push(movieId);
  } else {
    arr.splice(index, 1);
  }
  saveFavorites(arr);
  // Update UI if needed (button text)
  document.querySelectorAll(`[data-fav-id="${movieId}"]`).forEach(btn => {
    btn.innerText = arr.includes(movieId) ? 'Remove' : 'Add to Favorites';
  });
  return arr.includes(movieId);
}

// Render movies into container (default movies.html)
function renderMovies(containerId = 'moviesGrid', items = MOVIES) {
  const container = byId(containerId);
  if (!container) return;
  container.innerHTML = ''; // clear
  if (!items.length) {
    container.innerHTML = '<div class="alert alert-info">No results found.</div>';
    return;
  }

  const favList = getFavorites();
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'movie-card card shadow-sm';
    card.innerHTML = `
      <img src="${item.poster}" class="card-img-top" alt="${item.title}">
      <div class="card-body">
        <h5 class="card-title">${item.title}</h5>
        <p class="text-muted small">${item.genre} • ${item.year}</p>
        <p class="card-text text-truncate">${item.plot}</p>
        <div class="d-flex gap-2">
          <a href="details.html?id=${item.id}" class="btn btn-outline-primary btn-sm">Details</a>
          <button data-fav-id="${item.id}" class="btn btn-primary btn-sm">
            ${favList.includes(item.id) ? 'Remove' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    `;
    // handle favorites button
    card.querySelector('button').addEventListener('click', () => {
      toggleFavorite(item.id);
      renderFavoriteCount(); // update anywhere we show count
    });

    container.appendChild(card);
  });
}

// Filter and search
function setupSearchAndFilter(inputId = 'searchInput', selectId = 'genreSelect', containerId = 'moviesGrid') {
  const input = byId(inputId);
  const select = byId(selectId);
  if (!input || !select) return;
  function applyFilter() {
    const q = input.value.trim().toLowerCase();
    const g = select.value;
    const filtered = MOVIES.filter(m => {
      return (g === 'all' || m.genre === g) && (m.title.toLowerCase().includes(q) || m.plot.toLowerCase().includes(q));
    });
    renderMovies(containerId, filtered);
  }
  input.addEventListener('input', applyFilter);
  select.addEventListener('change', applyFilter);
  // Init
  applyFilter();
}

// DETAILS page
function renderDetails(containerId = 'detailsContainer') {
  const container = byId(containerId);
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    container.innerHTML = '<div class="alert alert-danger">No movie specified.</div>';
    return;
  }
  const movie = MOVIES.find(m => m.id === id);
  if (!movie) {
    container.innerHTML = '<div class="alert alert-danger">Movie not found.</div>';
    return;
  }
  container.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <img src="${movie.poster}" class="img-fluid rounded" alt="${movie.title}">
      </div>
      <div class="col-md-8">
        <h2>${movie.title}</h2>
        <p class="text-muted">${movie.genre} • ${movie.year}</p>
        <p>${movie.plot}</p>
        <p><strong>Cast:</strong> ${movie.cast.join(', ')}</p>
        <div>
          <button id="favDetailBtn" class="btn btn-primary">${getFavorites().includes(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
          <a href="movies.html" class="btn btn-outline-secondary">Back to Movies</a>
        </div>
      </div>
    </div>
  `;
  byId('favDetailBtn').addEventListener('click', () => {
    toggleFavorite(movie.id);
    byId('favDetailBtn').innerText = getFavorites().includes(movie.id) ? 'Remove from Favorites' : 'Add to Favorites';
  });
}

// FAVORITES page
function renderFavoritesList(containerId = 'favoritesContainer') {
  const container = byId(containerId);
  if (!container) return;
  const fav = getFavorites();
  if (!fav.length) {
    container.innerHTML = '<div class="alert alert-info">You have no favorites yet. Add some from the Movies page.</div>';
    return;
  }
  const items = MOVIES.filter(m => fav.includes(m.id));
  // Reuse render logic but keep simple
  container.innerHTML = items.map(m => `
    <div class="card mb-3">
      <div class="row g-0 align-items-center">
        <div class="col-md-2"><img src="${m.poster}" class="img-fluid rounded-start" alt="${m.title}"></div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${m.title}</h5>
            <p class="text-muted small">${m.genre}</p>
            <p class="card-text text-truncate">${m.plot}</p>
          </div>
        </div>
        <div class="col-md-2 text-end pe-3">
          <button data-fav-id="${m.id}" class="btn btn-danger btn-sm">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
  // add listeners to remove buttons
  container.querySelectorAll('button[data-fav-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleFavorite(btn.getAttribute('data-fav-id'));
      renderFavoritesList(containerId);
    });
  });
}

// Show a simple favorites count badge if needed
function renderFavoriteCount(badgeId = 'favCount') {
  const el = byId(badgeId);
  if (!el) return;
  el.textContent = getFavorites().length;
}

/* To be called on pages with specific needs:
  - movies.html: renderMovies(); setupSearchAndFilter();
  - details.html: renderDetails();
  - favorites.html: renderFavoritesList();
*/
