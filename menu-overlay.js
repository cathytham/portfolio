/* ── MENU OVERLAY ── */
async function initMenuOverlay() {
    try {
        const response = await fetch('global-overlay.html');
        const html = await response.text();
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
        const navLinks = menuOverlay.querySelectorAll('.menu-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        function closeMenu() {
            menuOverlay.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        }

    } catch (error) {
        console.error('Failed to load menu overlay:', error);
    }
}

initMenuOverlay();