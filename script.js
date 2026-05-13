// ── STAR CURSOR ──────────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function loop() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(loop);
})();

// ── SPARKLES EFFECT ──────────────────────────────────────────────────────────
let lastSparkleTime = 0;
const sparkleInterval = 30;

document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSparkleTime > sparkleInterval) {
    createSparkle(e.clientX, e.clientY);
    lastSparkleTime = now;
  }
});

function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 40 + 20;
  sparkle.style.left = x + 'px';
  sparkle.style.top = y + 'px';
  sparkle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
  sparkle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 600);
}

function createClickSparkles(x, y) {
  for (let i = 0; i < 8; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 20;
    createSparkle(x + Math.cos(angle) * 4, y + Math.sin(angle) * 4);
  }
}

document.addEventListener('mousedown', e => {
  createClickSparkles(e.clientX, e.clientY);
});

function injectStarOverlayStyles() {
  if (document.getElementById('star-overlay-styles')) return;
  const basePath = window.location.href.includes('/projects/') ? '../' : './';
  const style = document.createElement('style');
  style.id = 'star-overlay-styles';
  style.textContent = `
    .star-overlay {
      position:fixed;inset:0;pointer-events:none;z-index:999999;overflow:hidden;
    }
    .star-overlay .star-burst {
    position:absolute;width:30px;height:30px;
      background-image:url('${basePath}images/star.png');
      background-size:contain;background-repeat:no-repeat;
      opacity:0;transform:translate(-50%,-50%) scale(1);
      animation:starBurst 0.9s ease-out forwards;
    }
    @keyframes starBurst {
      0% { opacity:1; transform:translate(-50%,-50%) scale(1.3); }
      60% { opacity:1; }
      100% { opacity:0; transform:translate(calc(var(--dx) * 1px - 50%), calc(var(--dy) * 1px - 50%)) scale(0.6); }
    }
  `;
  document.head.appendChild(style);
}

function createStarBounceOverlay() {
  injectStarOverlayStyles();
  const overlay = document.createElement('div');
  overlay.className = 'star-overlay';
  const count = 12;
  for (let i = 0; i < count; i += 1) {
    const star = document.createElement('div');
    star.className = 'star-burst';
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 120 + 50;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    star.style.left = `${10 + (i * 80) / (count - 1)}%`;
    star.style.top = '18px';
    star.style.setProperty('--dx', dx);
    star.style.setProperty('--dy', dy);
    overlay.appendChild(star);
  }
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 950);
}

function attachNavigationStarEffect() {
  const links = document.querySelectorAll('a[href]:not([href="#"]):not([href^="mailto:"]):not([target="_blank"])');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http')) return;

    link.addEventListener('click', e => {
      createStarBounceOverlay();
      if (href.startsWith('#')) {
        e.preventDefault();
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, null, href);
          } else {
            location.hash = href;
          }
        }, 420);
      } else {
        e.preventDefault();
        setTimeout(() => { window.location.href = href; }, 420);
      }
    });
  });
}

attachNavigationStarEffect();

// ── CURSOR HOVER STATES ───────────────────────────────────────────────────────
document.querySelectorAll('a, button, .proj-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('big');
    ring.style.width = '56px';
    ring.style.height = '56px';
    ring.style.borderColor = 'var(--b600)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('big');
    ring.style.width = '40px';
    ring.style.height = '40px';
    ring.style.borderColor = 'var(--b400)';
  });
});

// ── INTERACTIVE CANVAS DRAWING — main.html only ───────────────────────────────
const canvas = document.getElementById('drawing-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let lastX = 0, lastY = 0;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  canvas.addEventListener('mousedown', e => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });
  canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = 'rgba(30, 82, 134, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });
  canvas.addEventListener('mouseup', () => { drawing = false; });
  canvas.addEventListener('mouseleave', () => { drawing = false; });

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    drawing = true;
    lastX = t.clientX - rect.left;
    lastY = t.clientY - rect.top;
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!drawing) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(30, 82, 134, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastX = x; lastY = y;
  }, { passive: false });
  canvas.addEventListener('touchend', () => { drawing = false; });
}

// ── CLEAR CANVAS BUTTON — main.html only ─────────────────────────────────────
const clearBtn = document.getElementById('clear-canvas');
if (clearBtn && canvas) {
  clearBtn.addEventListener('click', () => {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  });
}

// ── SKILL BARS (intersection observer) ───────────────────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');
if (skillFills.length) {
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        e.target.style.transform = `scaleX(${e.target.dataset.width})`;
    });
  }, { threshold: .3 });
  skillFills.forEach(f => skillObs.observe(f));
}

// ── AVAILABLE DOT — main.html only ───────────────────────────────────────────
const avail = document.getElementById('avail');
if (avail) {
  window.addEventListener('scroll', () => {
    avail.style.opacity = window.scrollY > 120 ? '0' : '1';
  }, { passive: true });
}

// ── PROJ-GRID HORIZONTAL DRAG SCROLL ─────────────────────────────────────────
document.querySelectorAll('.proj-grid').forEach(grid => {
  let isDown = false;
  let startX;
  let scrollLeft;
  let isDragging = false;

  grid.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragging = false;
    startX = e.pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
  });

  grid.addEventListener('mouseleave', () => {
    isDown = false;
  });

  grid.addEventListener('mouseup', () => {
    isDown = false;
  });

  grid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - grid.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    if (Math.abs(walk) > 5) {
      isDragging = true;
    }
    grid.scrollLeft = scrollLeft - walk;
  });

  // Prevent default drag behaviors on links and images inside the grid
  grid.querySelectorAll('a, img').forEach(el => {
    el.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // Prevent click if we were dragging
  grid.addEventListener('click', (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture: true });
});

// ── GLOBAL FOOTER ────────────────────────────────────────────────────────────
const globalFooterContainer = document.getElementById('global-footer');
if (globalFooterContainer) {
  const isProjectPage = window.location.pathname.includes('/projects/');
  const root = isProjectPage ? '../' : './';

  globalFooterContainer.innerHTML = `
    <footer>
        <span class="footer-name">Cathy Tham</span>
        <div class="footer-links">
            <a class="footer-link" href="${root}main.html#work">Work</a>
            <a class="footer-link" href="${root}side-work.html">Side Work</a>
            <a class="footer-link" href="${root}about.html">About</a>
            <a class="footer-link" href="${root}main.html#contact">Contact</a>
        </div>
        <span class="footer-copy">© 2026</span>
    </footer>
  `;
  
  if (typeof attachNavigationStarEffect === 'function') attachNavigationStarEffect(globalFooterContainer);
  if (typeof bindCursorHoverStates === 'function') bindCursorHoverStates(globalFooterContainer);
}
