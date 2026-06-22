/* ============================================
   PHI PRODUCTION HOUSE — Main App Controller
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initMobileNav();
  initTestimonialCarousel();
  initContactForm();
  initCursorGlow();
});

/* ── Navbar Scroll Effect ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('.section[id]');

  window.addEventListener('scroll', () => {
    // Scrolled state
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const sectionName = link.getAttribute('data-section');
      if (sectionName === currentSection || 
          (currentSection === 'home' && sectionName === 'home') ||
          (currentSection === 'before-after' && sectionName === 'showreel')) {
        link.classList.add('active');
      }
    });
  });
}

/* ── Scroll Reveal (Intersection Observer) ── */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ── Mobile Navigation ── */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });
}

function closeMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  hamburger.classList.remove('active');
  mobileNav.classList.remove('active');
  document.body.style.overflow = '';
}

// Make closeMobileNav globally available
window.closeMobileNav = closeMobileNav;

/* ── Testimonial Carousel ── */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  const totalSlides = dots.length;
  let autoPlayInterval;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
      resetAutoPlay();
    });
  });

  function autoPlay() {
    autoPlayInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlay();
  }

  autoPlay();

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      } else if (diff < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
      resetAutoPlay();
    }
    isDragging = false;
  });
}

/* ── Contact Form ── */
function initContactForm() {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const type = document.getElementById('contact-type').value;
    const message = document.getElementById('contact-message').value;

    if (!name || !email) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Simulate sending
    const btn = document.getElementById('contact-submit');
    btn.innerHTML = '<span class="skeleton" style="width: 120px; height: 16px; display: inline-block;"></span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, var(--green), #16a34a)';
      showToast(`Thanks ${name}! We'll get back to you within 24 hours.`, 'success');
      form.reset();

      setTimeout(() => {
        btn.innerHTML = 'Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

/* ── Toast Notification ── */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.borderColor = type === 'error' ? 'var(--red)' : 
                             type === 'success' ? 'var(--green)' : 'var(--border-glow-cyan)';
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Make globally available
window.showToast = showToast;

/* ── Cursor Glow Effect (Hero Only) ── */
function initCursorGlow() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let isInHero = false;

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';

    const heroRect = hero.getBoundingClientRect();
    isInHero = e.clientY >= heroRect.top && e.clientY <= heroRect.bottom;
    glow.style.opacity = isInHero ? '1' : '0';
  });
}
