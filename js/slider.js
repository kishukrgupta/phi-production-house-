/* ============================================
   PHI PRODUCTION HOUSE — Before/After Slider
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initBeforeAfterTabs();
});

function initBeforeAfterSlider() {
  const container = document.getElementById('ba-container');
  const beforeImg = document.getElementById('ba-before-img');
  const line = document.getElementById('ba-line');
  const handle = document.getElementById('ba-handle');

  if (!container) return;

  let isDragging = false;
  let sliderPosition = 50; // percentage

  function updateSlider(percentage) {
    sliderPosition = Math.max(2, Math.min(98, percentage));

    // Update clip path for "before" image (shows left portion)
    beforeImg.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;

    // Update slider line position
    line.style.left = sliderPosition + '%';
    handle.style.left = sliderPosition + '%';
  }

  function getPercentage(clientX) {
    const rect = container.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  // Mouse events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(getPercentage(e.clientX));
    container.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updateSlider(getPercentage(e.clientX));
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'col-resize';
  });

  // Touch events
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(getPercentage(e.touches[0].clientX));
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updateSlider(getPercentage(e.touches[0].clientX));
  }, { passive: false });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Initialize at 50%
  updateSlider(50);
}

function initBeforeAfterTabs() {
  const tabs = document.querySelectorAll('[data-ba]');
  const beforeImg = document.getElementById('ba-before-img');
  const afterImg = document.getElementById('ba-after-img');

  const imageMap = {
    landscape: 'assets/ba-landscape.png',
    wedding: 'assets/ba-wedding.png',
    commercial: 'assets/ba-commercial.png'
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update images with fade transition
      const category = tab.dataset.ba;
      const newSrc = imageMap[category];

      beforeImg.style.opacity = '0';
      afterImg.style.opacity = '0';

      setTimeout(() => {
        beforeImg.src = newSrc;
        afterImg.src = newSrc;
        beforeImg.style.opacity = '1';
        afterImg.style.opacity = '1';
      }, 300);
    });
  });

  // Add transition to images
  if (beforeImg) {
    beforeImg.style.transition = 'opacity 0.3s ease';
    afterImg.style.transition = 'opacity 0.3s ease';
  }
}
