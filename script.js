// script.js
const TMDB_API_KEY = '5cc919b4e7456ccbe70bfa3f80c6ed98'; 
const BASE_URL = 'https://themoviedb.org'; 
const IMAGE_URL = 'https://tmdb.org'; 

// Catalogue de secours avec de vraies images directes et stables (Unsplash)
const backupMovies = [
    { id: 27205, title: "Inception", overview: "Dom Cobb est un voleur expérimenté dans l'art périlleux de l'extraction : sa spécialité consiste à s'approprier les secrets les plus précieux d'un individu pendant qu'il rêve.", poster_path: "https://unsplash.com", release_date: "2010-07-16", vote_average: 8.4 },
    { id: 157336, title: "Interstellar", overview: "Un groupe d'explorateurs utilise une faille récemment découverte dans l'espace-temps afin de repousser les limites humaines et partir à la conquête des distances astronomiques.", poster_path: "https://unsplash.com", release_date: "2014-11-05", vote_average: 8.4 },
    { id: 155, title: "The Dark Knight", overview: "Avec l'aide du lieutenant de police Jim Gordon et du procureur Harvey Dent, Batman entreprend de démanteler les dernières organisations criminelles qui infestent les rues de Gotham.", poster_path: "https://unsplash.com", release_date: "2008-07-18", vote_average: 8.5 },
    { id: 496243, title: "Parasite", overview: "Toute la famille de Ki-taek est au chômage et s'intéresse fortement au train de vie de la richissime famille Park.", poster_path: "https://unsplash.com", release_date: "2019-05-30", vote_average: 8.5 },
    { id: 299534, title: "Avengers: Endgame", overview: "Thanos ayant détruit la moitié de l'univers, les Avengers restants resserrent les rangs pour sauter dans le temps et réparer ses méfaits.", poster_path: "https://unsplash.com", release_date: "2019-04-24", vote_average: 8.3 },
    { id: 603, title: "Matrix", overview: "Un programmeur informatique découvre que la réalité n'est qu'une simulation virtuelle contrôlée par des machines intelligentes.", poster_path: "https://unsplash.com", release_date: "1999-03-30", vote_average: 8.2 }
];

let favorites = JSON.parse(localStorage.getItem('movie_explorer_favorites')) || [];
let showOnlyFavorites = false;
let currentMoviesList = [];

let currentPage = 1;
let currentQuery = '';
let isLoading = false;
let hasMorePages = true;

const grid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search');
const toggleFavBtn = document.getElementById('toggle-favorites');
const scrollAnchor = document.getElementById('scroll-anchor');

const modal = document.getElementById('movie-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalMeta = document.getElementById('modal-meta');
const modalOverview = document.getElementById('modal-overview');
const trailerContainer = document.getElementById('trailer-container');
const trailerVideo = document.getElementById('trailer-video');

// Initialisation au chargement de la page
fetchMovies();

async function fetchMovies(resetList = false) {
    if (isLoading || showOnlyFavorites) return;
    isLoading = true;

    if (resetList) {
        currentPage = 1;
        currentMoviesList = [];
        grid.innerHTML = '';
        hasMorePages = true;
    }

    let url = `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=${currentPage}`;
    if (currentQuery) {
        url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(currentQuery)}&language=fr-FR&page=${currentPage}`;
    }

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Clé API restreinte ou invalide");
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
            currentMoviesList = [...currentMoviesList, ...data.results];
            appendMovies(data.results);
            currentPage++;
        } else {
            if (currentMoviesList.length === 0) loadBackupCatalog();
        }
    } catch (err) {
        if (currentMoviesList.length === 0) {
            loadBackupCatalog();
        }
    } finally {
        isLoading = false;
    }
}

function loadBackupCatalog() {
    currentMoviesList = backupMovies;
    grid.innerHTML = '';
    appendMovies(backupMovies);
    hasMorePages = false; 
}

function appendMovies(movies) {
    movies.forEach(movie => {
        const isFav = favorites.some(f => f.id === movie.id);
        
        let poster = "https://unsplash.com";
        if (movie.poster_path) {
            if (movie.poster_path.startsWith('http')) {
                poster = movie.poster_path;
            } else {
                poster = `${IMAGE_URL}${movie.poster_path}`;
            }
        }
        
        const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <button class="btn-fav">${isFav ? '❤️' : '🤍'}</button>
            <img class="movie-poster" src="${poster}" alt="${movie.title}">
            <div class="movie-info">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <div class="movie-meta">
                    <span>📅 ${year}</span>
                    <span class="movie-rating">⭐ ${rating}</span>
                </div>
            </div>
        `;
        
        card.querySelector('.btn-fav').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie, card.querySelector('.btn-fav'));
        });
        
        card.addEventListener('click', () => openModal(movie));
        grid.appendChild(card);
    });
}

function displayFavoritesOnly() {
    grid.innerHTML = '';
    if (favorites.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 50px; font-size: 1.2rem;">Vous n'avez pas encore de favoris.</p>`;
        return;
    }
    appendMovies(favorites);
}

function toggleFavorite(movie, buttonElement) {
    const index = favorites.findIndex(f => f.id === movie.id);
    if (index === -1) {
        favorites.push(movie);
        buttonElement.innerText = '❤️';
    } else {
        favorites.splice(index, 1);
        buttonElement.innerText = '🤍';
    }
    localStorage.setItem('movie_explorer_favorites', JSON.stringify(favorites));
    if (showOnlyFavorites) displayFavoritesOnly();
}

async function openModal(movie) {
    let poster = 'https://unsplash.com';
    if (movie.poster_path) {
        poster = movie.poster_path.startsWith('http') ? movie.poster_path : `${IMAGE_URL}${movie.poster_path}`;
    }
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

    modalPoster.src = poster;
    modalTitle.innerText = movie.title;
    modalMeta.innerHTML = `<span>📅 Sortie : ${year}</span> <span class="movie-rating">⭐ ${rating}/10</span>`;
    modalOverview.innerText = movie.overview || "Aucun synopsis disponible pour ce film.";
    
    trailerContainer.style.display = 'none';
    trailerVideo.src = '';
    modal.classList.add('show');

    try {
        const res = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`);
        let data = await res.json();
        if ((!data.results || data.results.length === 0) && res.ok) {
            const resEn = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`);
            data = await resEn.json();
        }
        if (data.results && data.results.length > 0) {
            const trailer = data.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || data.results[0];
            if (trailer && trailer.key) {
                trailerVideo.src = `https://youtube.com{trailer.key}`;
                trailerContainer.style.display = 'block';
            }
        }
    } catch (err) {
        console.log("Mode local ou erreur : recherche de bande-annonce ignorée.");
    }
}

function closeModal() {
    modal.classList.remove('show');
    trailerVideo.src = '';
}

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

let searchTimeout;
searchInput.addEventListener('input', (e) => {
    if (showOnlyFavorites) return;
    clearTimeout(searchTimeout);
    currentQuery = e.target.value;
    searchTimeout = setTimeout(() => fetchMovies(true), 300);
});

toggleFavBtn.addEventListener('click', () => {
    showOnlyFavorites = !showOnlyFavorites;
    toggleFavBtn.classList.toggle('active', showOnlyFavorites);
    toggleFavBtn.innerText = showOnlyFavorites ? "🎬 Voir tout le catalogue" : "❤️ Voir mes favoris";
    searchInput.style.display = showOnlyFavorites ? 'none' : 'block';
    
    if (showOnlyFavorites) {
        displayFavoritesOnly();
    } else if (hasMorePages === false) {
        loadBackupCatalog();
    } else {
        fetchMovies(true);
    }
});

const observer = new IntersectionObserver((entries) => {
    if (entries.isIntersecting && !showOnlyFavorites && !isLoading && hasMorePages) {
        fetchMovies();
    }
}, { rootMargin: '100px' });

if (scrollAnchor) {observer.observe(scrollAnchor);
}
