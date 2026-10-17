// Mobile navigation toggle
(function () {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');

  function toggleMenu(open) {
    if (!mobileNavOverlay || !menuToggle) return;
    const shouldOpen = open !== undefined ? open : !mobileNavOverlay.classList.contains('is-open');
    menuToggle.classList.toggle('is-active', shouldOpen);
    mobileNavOverlay.classList.toggle('is-open', shouldOpen);
    menuToggle.setAttribute('aria-expanded', shouldOpen);
    mobileNavOverlay.setAttribute('aria-hidden', !shouldOpen);
    document.body.classList.toggle('nav-locked', shouldOpen);
  }

  if (menuToggle && mobileNavOverlay) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    mobileNavOverlay.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) toggleMenu(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavOverlay.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// Video sources are intentionally not added here. Add only owner-approved links to
// the matching [data-video-slot] elements when they are supplied.
