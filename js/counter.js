/* ============================================
   PHI PRODUCTION HOUSE — Animated Stats Counter
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
});

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateAllCounters();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsSection = document.getElementById('stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateAllCounters() {
    counters.forEach((counter, index) => {
      // Stagger the start of each counter
      setTimeout(() => {
        animateCounter(counter);
      }, index * 200);
    });
  }

  function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2500; // ms
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const currentValue = Math.floor(easedProgress * target);
      element.textContent = formatNumber(currentValue);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = formatNumber(target);
      }
    }

    requestAnimationFrame(update);
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  }
}
