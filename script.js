// app.js
const TMDB_API_KEY = '6f8d2b...votre_vraie_cle_api...'; 
const BASE_URL = 'https://themoviedb.org';
const IMAGE_URL = 'https://tmdb.org';

let favorites = JSON.parse(localStorage.getItem('movie_explorer_favorites')) || [];
let showOnlyFavorites = false;
let currentMoviesList = [];

// États pour la pagination et la recherche
let currentPage = 1;
let currentQuery = '';
let isLoading = false;
let hasMorePages = true;

const grid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search');
const toggleFavBtn = document.getElementById('toggle-favorites');
const scrollAnchor = document.getElementById('scroll-anchor');

// Éléments de la modale
const modal = document.getElementById('movie-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalMeta = document.getElementById('modal-meta');
const modalOverview = document.getElementById('modal-overview');
const trailerContainer = document.getElementById('trailer-container');
const trailerVideo = document.getElementById('trailer-video');

// Initialisation au chargement
fetchMovies();

// Chargement centralisé des films (Défilement Infini ou Recherche)
async function fetchMovies(resetList = false) {
    if (isLoading || showOnlyFavorites || !hasMorePages) return;
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
        const data = await res.json();
        
        if (data.results) {
            currentMoviesList = [...currentMoviesList, ...data.results];
            appendMovies(data.results);
            
            if (currentPage >= data.total_pages || data.results.length === 0) {
                hasMorePages = false;
            } else {
                currentPage++;
            }
        }
    } catch (err) {
        if (currentMoviesList.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">Erreur lors de la récupération des données. Vérifiez votre clé API.</p>`;
        }
    } finally {
        isLoading = false;
    }
}

// Ajoute incrémentiellement les éléments dans la grille de l'interface
function appendMovies(movies) {
    if (currentMoviesList.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">Aucun film trouvé.</p>`;
        return;
    }

    movies.forEach(movie => {
        const isFav = favorites.some(f => f.id === movie.id);
        const poster = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://placeholder.com';
        const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <button class="btn-fav" data-id="${movie.id}">${isFav ? '❤️' : '🤍'}</button>
            <img class="movie-poster" src="${poster}" alt="${movie.title}">
            <div class="movie-info">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <div class="movie-meta">
                    <span>📅 ${year}</span>
                    <span class="movie-rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</span>
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
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">Vous n'avez pas encore de favoris.</p>`;
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
    
    if (showOnlyFavorites) {
        displayFavoritesOnly();
    }
}

// Logique de la fenêtre Modale + Recherche de Bande-Annonce
async function openModal(movie) {
    const poster = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://placeholder.com';
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

    modalPoster.src = poster;
    modalTitle.innerText = movie.title;
    modalMeta.innerHTML = `<span>📅 Sortie : ${year}</span> <span class="movie-rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}/10</span>`;
    modalOverview.innerText = movie.overview || "Aucun synopsis disponible en français pour ce film.";
    
    // Réinitialisation par défaut de la vidéo
    trailerContainer.style.display = 'none';
    trailerVideo.src = '';

    modal.classList.add('show');

    // Récupération dynamique de la bande-annonce
    try {
        const res = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`);
        let data = await res.json();
        
        // Si aucune vidéo en français n'est disponible, chercher en anglais
        if (!data.results || data.results.length === 0) {
            const resEn = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`);
            data = await resEn.json();
        }

        if (data.results && data.results.length > 0) {
            // Filtrer pour obtenir un Trailer ou un Teaser hébergé sur YouTube
            const trailer = data.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || data.results[0];
            if (trailer && trailer.key) {
                trailerVideo.src = `https://youtube.com{trailer.key}`;
                trailerContainer.style.display = 'block';
            }
        }
    } catch (err) {
        console.error("Impossible de charger la bande-annonce", err);
    }
}

function closeModal() {
    modal.classList.remove('show');
    trailerVideo.src = ''; // Stopper la lecture audio/vidéo à la fermeture
}

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Barre de recherche (Gestion par Debounce)
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    if (showOnlyFavorites) return;
    clearTimeout(searchTimeout);
    currentQuery = e.target.value;
    searchTimeout = setTimeout(() => fetchMovies(true), 300);
});

// Gestion du bouton Filtre Favoris
toggleFavBtn.addEventListener('click', () => {
    showOnlyFavorites = !showOnlyFavorites;
    toggleFavBtn.classList.toggle('active', showOnlyFavorites);
    toggleFavBtn.innerText = showOnlyFavorites ? "🎬 Voir tout le catalogue" : "❤️ Voir mes favoris";
    searchInput.style.display = showOnlyFavorites ? 'none' : 'block';
    
    if (showOnlyFavorites) {
        displayFavoritesOnly();
    } else {
        fetchMovies(true);
    }
});

// Configuration de l'Intersection Observer pour le Défilement Infini
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !showOnlyFavorites && !isLoading && hasMorePages) {
        fetchMovies();
    }
}, {
    rootMargin: '200px' // Précharger le contenu avant que l'ancre n'atteigne l'écran
});

observer.observe(scrollAnchor);
