/* ============================================
   PHI PRODUCTION HOUSE — Progress Tracker
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initProgressTracker();
});

function initProgressTracker() {
  const dashboardSection = document.getElementById('dashboard');
  if (!dashboardSection) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateProgress();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(dashboardSection);
}

function animateProgress() {
  // Animate circular progress ring
  animateProgressRing();

  // Animate progress bars (staggered)
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  progressBars.forEach((bar, index) => {
    setTimeout(() => {
      const targetWidth = bar.dataset.width;
      bar.style.width = targetWidth + '%';
    }, 300 + index * 200);
  });

  // Animate skill badges with pop-in effect
  animateSkillBadges();
}

function animateProgressRing() {
  const circle = document.getElementById('progress-circle');
  const percentText = document.getElementById('progress-percent');
  if (!circle || !percentText) return;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const targetPercent = 67; // 4 out of 6 courses

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  // Animate the ring
  setTimeout(() => {
    const offset = circumference - (targetPercent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }, 500);

  // Animate the number
  animateNumber(percentText, 0, targetPercent, 2000, '%');
}

function animateNumber(element, start, end, duration, suffix = '') {
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);

    const currentValue = Math.floor(start + (end - start) * easedProgress);
    element.textContent = currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = end + suffix;
    }
  }

  requestAnimationFrame(update);
}

function animateSkillBadges() {
  const badges = document.querySelectorAll('.skill-badge');

  badges.forEach((badge, index) => {
    badge.style.opacity = '0';
    badge.style.transform = 'scale(0.5)';
    badge.style.transition = `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${600 + index * 150}ms`;

    setTimeout(() => {
      badge.style.opacity = badge.classList.contains('locked') ? '0.4' : '1';
      badge.style.transform = 'scale(1)';
    }, 100);
  });

  // Add hover interaction to unlocked badges
  badges.forEach(badge => {
    if (badge.classList.contains('unlocked')) {
      badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.08)';
        badge.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.2)';
      });

      badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1)';
        badge.style.boxShadow = '';
      });
    }

    if (badge.classList.contains('locked')) {
      badge.addEventListener('click', () => {
        // Shake animation for locked badges
        badge.style.animation = 'none';
        badge.offsetHeight; // trigger reflow
        badge.style.animation = 'shake 0.5s ease';
        showToast('🔒 Complete more courses to unlock this badge!');
      });
    }
  });
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);
