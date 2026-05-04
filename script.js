document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll('.slim-sidebar nav a');

    async function loadPage(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMain = doc.querySelector('main.content');
            const newTitle = doc.querySelector('title');

            if (newMain) {
                const currentMain = document.querySelector('main.content');

                // Remplace le contenu et les classes
                currentMain.innerHTML = newMain.innerHTML;
                currentMain.className = newMain.className;

                // Met à jour le titre de l'onglet
                if (newTitle) {
                    document.title = newTitle.textContent;
                }

                // Relance l'animation d'apparition
                currentMain.style.animation = 'none';
                currentMain.offsetHeight; /* Force le recalcul du navigateur */
                currentMain.style.animation = 'slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            }
        } catch (error) {
            // En cas d'erreur, recharge la page normalement
            window.location.href = url;
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');

            // Évite de recharger si on clique sur la page actuelle
            if (window.location.pathname.endsWith(targetUrl) || targetUrl === '#') return;

            e.preventDefault();

            // Met à jour l'URL dans la barre du navigateur sans recharger
            window.history.pushState({}, '', targetUrl);

            // Gère l'affichage du bouton jaune actif
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Charge le nouveau contenu
            loadPage(targetUrl);
        });
    });

    // Gère le comportement des boutons "Précédent" et "Suivant" du navigateur
    window.addEventListener('popstate', () => {
        window.location.reload();
    });
});