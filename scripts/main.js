/* =============================================
   DOM 3D — main.js
   ============================================= */

/* === HEADER SCROLL === */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* === MOBILE MENU === */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* === SVG ICONS === */
const ICONS = {
  cortador: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <rect x="6" y="6" width="36" height="36" rx="6"/>
    <path d="M14 24 C14 18 20 14 24 14 C28 14 34 18 34 24 C34 30 28 34 24 34 C20 34 14 30 14 24Z"/>
    <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/>
  </svg>`,
  carimbo: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <circle cx="24" cy="24" r="17"/>
    <circle cx="24" cy="24" r="9"/>
    <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none"/>
    <line x1="24" y1="4" x2="24" y2="7"/>
    <line x1="24" y1="41" x2="24" y2="44"/>
    <line x1="4" y1="24" x2="7" y2="24"/>
    <line x1="41" y1="24" x2="44" y2="24"/>
  </svg>`,
  kits: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <polygon points="24,4 29,17 43,17 32,26 36,40 24,32 12,40 16,26 5,17 19,17"/>
  </svg>`,
  utensilios: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <path d="M8 38 L24 10 L40 38 Z"/>
    <line x1="13" y1="28" x2="35" y2="28"/>
    <circle cx="24" cy="22" r="4"/>
  </svg>`,
  kawaii: `<svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <path d="M10 36 C10 36 7 26 7 20 C7 12.8 14 7 22 7 C22 7 20 15 24 19 C28 23 38 21 38 21 C38 21 42 28 37 36 C32 42 22 44 17 41 C12 38 10 36 10 36Z"/>
    <circle cx="24" cy="26" r="5"/>
  </svg>`,
};

/* === RENDER HELPERS === */
function renderStars(n) {
  return '★'.repeat(n);
}

function updateLojaLinks(lojas) {
  document.querySelectorAll('[data-loja="shopee"]').forEach(el => {
    el.href = lojas.shopee.url;
  });
  document.querySelectorAll('[data-loja="ml"]').forEach(el => {
    el.href = lojas.mercadoLivre.url;
  });
}

function renderTopProdutos(produtos) {
  const grid = document.getElementById('topProdutosGrid');
  if (!grid) return;
  grid.innerHTML = produtos.map(p => `
    <article class="top-card">
      <div class="top-card-img">
        <img src="${p.imagem}" alt="${p.imagemAlt}" loading="lazy">
        <span class="top-rank">#${p.rank}</span>
      </div>
      <div class="top-card-body">
        <span class="top-category">${p.categoria}</span>
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <div class="top-card-ctas">
          <a href="${p.shopeeUrl}" class="btn btn-shopee btn-sm" target="_blank" rel="noopener noreferrer">Ver na Shopee</a>
          <a href="${p.mercadoLivreUrl}" class="btn btn-ml btn-sm" target="_blank" rel="noopener noreferrer">Ver no ML</a>
        </div>
      </div>
    </article>
  `).join('');
}

function renderProdutos(produtos) {
  const grid = document.getElementById('produtosGrid');
  if (!grid) return;
  grid.innerHTML = produtos.map(p => `
    <article class="product-card${p.maisVendido ? ' product-card--featured' : ''}">
      ${p.maisVendido ? '<div class="product-badge-top">Mais Vendido</div>' : ''}
      <div class="product-icon">${ICONS[p.icone] || ''}</div>
      <h3>${p.nome}</h3>
      <p>${p.descricao}</p>
      <ul class="product-tags">
        ${p.tags.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </article>
  `).join('');
}

function renderDepoimentos(depoimentos) {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  track.innerHTML = depoimentos.map(d => `
    <article class="dep-card">
      <div class="stars" aria-label="${d.avaliacao} estrelas">${renderStars(d.avaliacao)}</div>
      <blockquote>"${d.texto}"</blockquote>
      <figure class="dep-photo">
        <img src="${d.foto}" alt="${d.fotoAlt}" loading="lazy">
      </figure>
      <footer class="dep-author">
        <div class="avatar">${d.autorIniciais}</div>
        <div><strong>${d.autorNome}</strong><span>${d.autorPerfil}</span></div>
      </footer>
    </article>
  `).join('');
}

/* === FADE-IN ON SCROLL === */
function initFadeObserver() {
  const fadeTargets = document.querySelectorAll('.diferencial-card.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeTargets.forEach(el => observer.observe(el));
  } else {
    fadeTargets.forEach(el => el.classList.add('visible'));
  }
}

/* === TESTIMONIALS CAROUSEL === */
function initCarousel() {
  const viewport = document.getElementById('carouselViewport');
  const track    = document.getElementById('carouselTrack');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('carouselDots');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.dep-card'));
  const total = cards.length;
  let current = 0;
  let cardWidth = 0;
  let gap = 0;
  let visibleCount = 1;
  let maxIndex = 0;

  function buildDots() {
    dotsWrap.innerHTML = '';
    const dotCount = maxIndex + 1;
    for (let i = 0; i < dotCount; i++) {
      const btn = document.createElement('button');
      btn.className = 'dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Ir para depoimento ' + (i + 1));
      btn.setAttribute('role', 'tab');
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function measure() {
    const vpWidth = viewport.offsetWidth;
    gap = parseInt(getComputedStyle(track).gap) || 24;

    if (window.innerWidth >= 1024) {
      visibleCount = 3;
    } else if (window.innerWidth >= 768) {
      visibleCount = 2;
    } else {
      visibleCount = 1;
    }

    cardWidth = (vpWidth - gap * (visibleCount - 1)) / visibleCount;
    cards.forEach(c => { c.style.width = cardWidth + 'px'; });

    maxIndex = Math.max(0, total - visibleCount);
    if (current > maxIndex) current = maxIndex;

    buildDots();
    updateDots();
    applyTransform(false);

    const controls = document.querySelector('.carousel-controls');
    if (controls) {
      controls.style.display = maxIndex === 0 ? 'none' : 'flex';
    }
  }

  function applyTransform(animate = true) {
    if (!animate) track.style.transition = 'none';
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
    if (!animate) {
      track.offsetHeight;
      track.style.transition = '';
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex));
    applyTransform();
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  measure();
  window.addEventListener('resize', () => {
    clearTimeout(window._carouselResizeTimer);
    window._carouselResizeTimer = setTimeout(measure, 120);
  });
}

/* === BOOT === */
async function init() {
  let cfg;
  try {
    const res = await fetch('./config.json');
    if (!res.ok) throw new Error(res.status);
    cfg = await res.json();
  } catch (e) {
    console.error('Dom 3D: falha ao carregar config.json', e);
    return;
  }

  updateLojaLinks(cfg.lojas);
  renderTopProdutos(cfg.topProdutos);
  renderProdutos(cfg.produtos);
  renderDepoimentos(cfg.depoimentos);

  initFadeObserver();
  initCarousel();
}

init();
