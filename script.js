// script.js

// Catalogue utilisant vos propres images locales enregistrées dans votre dossier
const backupMovies = [
    { 
        id: 27205, 
        title: "Inception", 
        overview: "Dom Cobb est un voleur expérimenté dans l'art périlleux de l'extraction : sa spécialité consiste à s'approprier les secrets les plus précieux d'un individu pendant qu'il rêve.", 
        poster_path: "inception.jpeg", 
        release_date: "2010-07-16", 
        vote_average: 8.4 
    },
    { 
        id: 157336, 
        title: "Interstellar", 
        overview: "Un groupe d'explorateurs utilise une faille récemment découverte dans l'espace-temps afin de repousser les limites humaines et partir à la conquête des distances astronomiques.", 
        poster_path: "interstellar.jpeg", 
        release_date: "2014-11-05", 
        vote_average: 8.4 
    },
    { 
        id: 155, 
        title: "The Dark Knight", 
        overview: "Avec l'aide du lieutenant de police Jim Gordon et du procureur Harvey Dent, Batman entreprend de démanteler les dernières organisations criminelles qui infestent les rues de Gotham.", 
        poster_path: "darkknight.jpeg", 
        release_date: "2008-07-18", 
        vote_average: 8.5 
    },
    { 
        id: 496243, 
        title: "Parasite", 
        overview: "Toute la famille de Ki-taek est au chômage et s'intéresse fortement au train de vie de la richissime famille Park.", 
        poster_path: "parasite.jpeg", 
        release_date: "2019-05-30", 
        vote_average: 8.5 
    },
    { 
        id: 299534, 
        title: "Avengers: Endgame", 
        overview: "Thanos ayant détruit la moitié de l'univers, les Avengers restants resserrent les rangs pour sauter dans le temps et réparer ses méfaits.", 
        poster_path: "avengers.jpeg", 
        release_date: "2019-04-24", 
        vote_average: 8.3 
    },
    { 
        id: 603, 
        title: "Matrix", 
        overview: "Un programmeur informatique découvre que la réalité n'est qu'une simulation virtuelle contrôlée par des machines intelligentes.", 
        poster_path: "matrix.jpeg", 
        release_date: "1999-03-30", 
        vote_average: 8.2 
    }
];

let favorites = JSON.parse(localStorage.getItem('movie_explorer_favorites')) || [];
let showOnlyFavorites = false;

const grid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search');
const toggleFavBtn = document.getElementById('toggle-favorites');

const modal = document.getElementById('movie-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalMeta = document.getElementById('modal-meta');
const modalOverview = document.getElementById('modal-overview');
const trailerContainer = document.getElementById('trailer-container');
const trailerVideo = document.getElementById('trailer-video');

// Affichage initial du catalogue stable
displayMovies(backupMovies);

function displayMovies(movies) {
    grid.innerHTML = '';
    
    if (movies.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 50px; font-size: 1.2rem;">Aucun film disponible.</p>`;
        return;
    }

    movies.forEach(movie => {
        const isFav = favorites.some(f => f.id === movie.id);
        const poster = movie.poster_path;
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
    if (showOnlyFavorites) displayMovies(favorites);
}

function openModal(movie) {
    modalPoster.src = movie.poster_path;
    modalTitle.innerText = movie.title;
    
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
    
    modalMeta.innerHTML = `<span>📅 Sortie : ${year}</span> <span class="movie-rating">⭐ ${rating}/10</span>`;
    modalOverview.innerText = movie.overview || "Aucun synopsis disponible pour ce film.";
    
    trailerContainer.style.display = 'none';
    trailerVideo.src = '';
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
    trailerVideo.src = '';
}

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// Filtrage de recherche dynamique en local
searchInput.addEventListener('input', (e) => {
    if (showOnlyFavorites) return;
    const text = e.target.value.toLowerCase();
    const filtered = backupMovies.filter(m => m.title.toLowerCase().includes(text));
    displayMovies(filtered);
});

toggleFavBtn.addEventListener('click', () => {
    showOnlyFavorites = !showOnlyFavorites;
    toggleFavBtn.classList.toggle('active', showOnlyFavorites);
    toggleFavBtn.innerText = showOnlyFavorites ? "🎬 Voir tout le catalogue" : "❤️ Voir mes favoris";
    searchInput.style.display = showOnlyFavorites ? 'none' : 'block';
    displayMovies(showOnlyFavorites ? favorites : backupMovies);
});
