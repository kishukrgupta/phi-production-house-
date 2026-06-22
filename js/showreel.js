/* ============================================
   PHI PRODUCTION HOUSE — Showreel Interaction
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initShowreel();
});

function initShowreel() {
  const cards = document.querySelectorAll('.showreel-card');
  const hero = document.querySelector('.hero');

  // Category gradient colors
  const categoryGradients = {
    'color-grading': 'radial-gradient(ellipse at 30% 50%, rgba(255, 165, 0, 0.08) 0%, transparent 60%)',
    'vfx': 'radial-gradient(ellipse at 70% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 60%)',
    'motion': 'radial-gradient(ellipse at 50% 30%, rgba(0, 229, 255, 0.08) 0%, transparent 60%)',
    'cinematography': 'radial-gradient(ellipse at 50% 70%, rgba(255, 0, 128, 0.08) 0%, transparent 60%)'
  };

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const category = card.dataset.category;
      const gradient = categoryGradients[category];

      // Apply ambient background gradient
      if (hero && gradient) {
        hero.style.setProperty('--ambient-bg', gradient);

        // Add ambient overlay if not already present
        let ambient = hero.querySelector('.hero-ambient');
        if (!ambient) {
          ambient = document.createElement('div');
          ambient.className = 'hero-ambient';
          ambient.style.cssText = `
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          `;
          hero.appendChild(ambient);
        }
        ambient.style.background = gradient;
      }

      // Scale up the hovered card, dim others
      cards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.style.opacity = '0.5';
          otherCard.style.transform = 'scale(0.97)';
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      // Reset ambient
      const ambient = hero.querySelector('.hero-ambient');
      if (ambient) {
        ambient.style.background = 'transparent';
      }

      // Reset other cards
      cards.forEach(otherCard => {
        otherCard.style.opacity = '1';
        otherCard.style.transform = '';
      });
    });

    // Click to "play" showreel
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      const categoryName = card.querySelector('.showreel-card-label').textContent;
      showToast(`🎬 ${categoryName} showreel coming soon!`);
    });
  });
}
