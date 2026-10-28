# 📝 Spécifications Techniques — MovieExplorer Pro

Ce document définit les exigences fonctionnelles, l'architecture logicielle et les choix techniques retenus pour le développement de l'application **MovieExplorer Pro**.

## 1. Objectifs Généraux
L'application doit permettre à un utilisateur de parcourir le catalogue mondial du cinéma, de rechercher des œuvres spécifiques, d'en consulter les fiches détaillées (incluant la vidéo de la bande-annonce) et de gérer une liste personnelle de favoris accessible hors-ligne.

## 2. Spécifications Fonctionnelles

### 2.1 Écran Principal & Catalogue
*   **Affichage Initial :** Chargement automatique de la liste des films populaires du moment depuis TMDB (Page 1).
*   **Architecture des Fiches (Cards) :** Chaque fiche affiche l'affiche du film (Poster), son titre, son année de sortie, sa note moyenne sur 10 ainsi qu'un bouton d'action rapide pour les favoris (Cœur).
*   **Défilement Infini :** Dès que l'utilisateur atteint le bas de la grille de films, l'application détecte la proximité de la sentinelle et charge de manière incrémentale la page suivante (`page++`) de l'API.

### 2.2 Système de Recherche
*   **Saisie Prédictive :** Un champ de texte permet de filtrer le catalogue par titre en temps réel.
*   **Mécanisme de Debounce :** Un délai d'attente de 300 millisecondes est appliqué à la saisie pour éviter de surcharger et de bloquer l'API TMDB à chaque caractère tapé.

### 2.3 Espace Favoris
*   **Bascule d'Écran :** Un bouton "Voir mes favoris" permet de masquer le catalogue général et d'afficher exclusivement les films mémorisés.
*   **Persistance :** Les données d'identification des films favoris sont sérialisées en JSON et conservées localement via l'API standard `localStorage`.

### 2.4 Visionneuse & Lecteur (Modale)
*   **Événement :** Le clic sur le corps d'une carte d'un film ouvre une fenêtre modale au premier plan avec un arrière-plan flouté (*backdrop-filter*).
*   **Ressources Vidéo :** L'application interroge l'endpoint des vidéos du film et sélectionne en priorité une vidéo YouTube catégorisée comme "Trailer" ou "Teaser". Si la version française n'est pas disponible, un fallback automatique interroge la version originale.
*   **Nettoyage mémoire :** À la fermeture de la modale, le flux de l'Iframe YouTube est vidé pour couper instantanément la lecture audio/vidéo en arrière-plan.

## 3. Spécifications Techniques

*   **Dépendances Externes :** Zéro framework (Ni React, ni Vue, ni jQuery). JavaScript natif pour garantir un temps de chargement ultra-rapide.
*   **Gestion API :** Utilisation exclusive de l'API moderne globale `fetch` combinée aux mots-clés `async/await` pour la gestion asynchrone.
*   **Design :** Approche *Mobile-First* avec l'utilisation des CSS Grid adaptatifs et des Media Queries pour basculer la structure de la modale en colonne sur petit écran.
