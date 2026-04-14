/* ── MENU OVERLAY ── */
async function initMenuOverlay() {
    try {
        const isProject = window.location.pathname.includes('/projects/');
        const prefix = isProject ? '../' : '';

        const response = await fetch(prefix + 'global-overlay.html');
        let html = await response.text();

        if (isProject) {
            html = html.replace(/href="main\.html/g, 'href="../main.html');
            html = html.replace(/href="side-work\.html/g, 'href="../side-work.html');
            html = html.replace(/href="about\.html/g, 'href="../about.html');
            html = html.replace(/href="\.\/cv\//g, 'href="../cv/');
        }

        document.body.insertAdjacentHTML('afterbegin', html);

        const menuBtn = document.getElementById('menu-btn');
        const menuOverlay = document.getElementById('menu-overlay');
        const menuClose = document.getElementById('menu-close');

        // Open menu
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.add('open');
            menuBtn.setAttribute('aria-expanded', 'true');
        });

        // Close menu
        menuClose.addEventListener('click', closeMenu);

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOverlay.classList.contains('open')) {
                closeMenu();
            }
        });

        // Close menu when clicking navigation links
        const navLinks = menuOverlay.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        function closeMenu() {
            // Add a slight delay to allow native click actions (navigation) to complete
            // before `pointer-events: none` takes effect.
            setTimeout(() => {
                menuOverlay.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            }, 50);
        }

    } catch (error) {
        console.error('Failed to load menu overlay:', error);
    }
}

initMenuOverlay();