# 🎬 MovieExplorer Pro

MovieExplorer Pro est une mini-application web front-end interactive et réactive conçue en HTML5, CSS3 moderne (Dark Mode) et JavaScript natif (ES6+). Elle se connecte à l'API internationale **TMDB (The Movie Database)** pour diffuser un catalogue de films en temps réel et intègre des fonctionnalités avancées d'expérience utilisateur (UX).

## 🚀 Fonctionnalités Clés

*   **Synchro TMDB en Temps Réel :** Récupération automatique du catalogue mondial mis à jour (Films populaires, recherche par mots-clés).
*   **Défilement Infini (*Infinite Scroll*) :** Chargement dynamique et transparent des pages de résultats via l'API `IntersectionObserver` au fil du défilement, éliminant le besoin de pagination manuelle.
*   **Gestionnaire de Favoris Local :** Système de sauvegarde persistante dans le navigateur (`localStorage`). Ajoutez ou retirez des films de vos favoris en un clic, accessible même après fermeture du navigateur.
*   **Modale de Détails Immersive :** Fenêtre modale animée s'ouvrant au clic sur une fiche pour afficher le synopsis complet, les notes et les métadonnées.
*   **Lecteur de Bandes-Annonces Intégré :** Recherche automatique et intégration d'un lecteur vidéo responsive `<iframe>` YouTube de la bande-annonce officielle (Trailer/Teaser) à l'intérieur de la modale.
*   **Performance UX Optimisée :** Interface fluide, barre de recherche avec mécanisme de *Debounce* pour économiser les requêtes API, et design adaptatif (Mobile & Desktop).

## 🛠️ Installation et Utilisation Locale

1.  **Cloner ou télécharger** les fichiers du projet (`index.html`, `styles.css`, `app.js`).
2.  **Obtenir une clé API** gratuite sur le site officiel de [The Movie Database (TMDB)](https://www.themoviedb.org/).
3.  Ouvrir le fichier `app.js` et remplacer la variable à la ligne 2 par votre clé :
    ```javascript
    const TMDB_API_KEY = 'VOTRE_CLE_API_TMDB';
    ```
4.  Lancez le fichier `index.html` directement dans votre navigateur ou via une extension d'environnement de serveur local (comme *Live Server* sur VS Code).

## 📦 Structure du Projet

```text
├── index.html       # Structure HTML5 et conteneur de la modale
├── styles.css       # Design System (Dark theme, Grille fluide, lecteur responsive)
└── app.js           # Logique JavaScript (Fetch API, IntersectionObserver, LocalStorage)
```

## ✒️ Technologies Utilisées

*   **HTML5** / **CSS3 Variables & Grid**
*   **JavaScript Vanille (ES6+)**
*   **API TMDB V3**
*   **Navigateur Web LocalStorage & Intersection Observer API**
