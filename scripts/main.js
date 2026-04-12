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

// Close nav when a link is clicked
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* === FADE-IN ON SCROLL (IntersectionObserver) === */
const fadeTargets = document.querySelectorAll('.diferencial-card.fade-in');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger each card slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeTargets.forEach(el => observer.observe(el));
} else {
  // Fallback: show all immediately
  fadeTargets.forEach(el => el.classList.add('visible'));
}

/* === TESTIMONIALS CAROUSEL === */
(function initCarousel() {
  const viewport  = document.getElementById('carouselViewport');
  const track     = document.getElementById('carouselTrack');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  const dotsWrap  = document.getElementById('carouselDots');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.dep-card'));
  const total = cards.length;
  let current = 0;
  let cardWidth = 0;
  let gap = 0;
  let visibleCount = 1;
  let maxIndex = 0;

  /* Build dots */
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

    // Hide controls when all cards fit
    const controls = document.querySelector('.carousel-controls');
    if (controls) {
      controls.style.display = maxIndex === 0 ? 'none' : 'flex';
    }
  }

  function applyTransform(animate = true) {
    if (!animate) track.style.transition = 'none';
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
    if (!animate) {
      // Force reflow then restore transition
      track.offsetHeight; // eslint-disable-line no-unused-expressions
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

  // Swipe support (touch)
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

  // Init
  measure();
  window.addEventListener('resize', () => {
    clearTimeout(window._carouselResizeTimer);
    window._carouselResizeTimer = setTimeout(measure, 120);
  });
})();
