/* ============================================================
   PHI PRODUCTION HOUSE — INTERACTION & MOTION ENGINE
   Scroll reveals · Parallax · Magnetic buttons · Video hover
   ============================================================ */

(function () {
  'use strict';

  // ========== PAGE LOADER ==========
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('loaded');
    }, 1200);
  });

  // ========== CURSOR GLOW ==========
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = -600, mouseY = -600;
  let glowX = -600, glowY = -600;

  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorGlow.classList.contains('active')) {
        cursorGlow.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ========== NAVBAR ==========
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll background
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== SCROLL REVEAL (Intersection Observer) ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ========== COUNTER ANIMATION ==========
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        let current = 0;
        const increment = target / 60;
        const duration = 1500;
        const stepTime = duration / 60;

        function updateCounter() {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
          } else {
            counter.textContent = Math.floor(current);
            setTimeout(updateCounter, stepTime);
          }
        }
        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ========== MAGNETIC BUTTONS ==========
  const magneticElements = document.querySelectorAll('.btn-primary, .nav-cta');

  if (window.matchMedia('(pointer: fine)').matches) {
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ========== PORTFOLIO VIDEO HOVER PREVIEW ==========
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  portfolioCards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  // ========== VIDEO PLAYER TOGGLE ==========
  window.toggleVideo = function (videoId, overlayId) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);
    if (!video || !overlay) return;

    if (video.paused) {
      // Pause all other videos first
      document.querySelectorAll('.video-player').forEach(v => {
        if (v.id !== videoId && !v.paused) {
          v.pause();
          const otherOverlay = v.closest('.video-wrapper').querySelector('.video-overlay');
          if (otherOverlay) otherOverlay.style.opacity = '1';
        }
      });

      video.play().catch(() => {});
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';

      video.addEventListener('ended', function onEnd() {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        video.removeEventListener('ended', onEnd);
      });
    } else {
      video.pause();
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    }
  };

  // ========== LIGHTBOX ==========
  window.closeLightbox = function () {
    const lightbox = document.getElementById('videoLightbox');
    const video = document.getElementById('lightboxVideo');
    if (lightbox) {
      lightbox.classList.remove('active');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  // Close lightbox on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // ========== CONTACT FORM ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.querySelector('span').textContent;

      btn.querySelector('span').textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      // Simulate form submission
      setTimeout(() => {
        btn.querySelector('span').textContent = 'Message Sent!';
        btn.style.opacity = '1';
        btn.style.background = '#22c55e';

        setTimeout(() => {
          btn.querySelector('span').textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 2500);
      }, 1500);
    });
  }

  // ========== PARALLAX EFFECT ON HERO ORBS ==========
  if (window.matchMedia('(pointer: fine)').matches) {
    const heroOrb1 = document.querySelector('.hero-orb-1');
    const heroOrb2 = document.querySelector('.hero-orb-2');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        if (heroOrb1) heroOrb1.style.transform = `translateY(${scrollY * 0.15}px)`;
        if (heroOrb2) heroOrb2.style.transform = `translateY(${scrollY * -0.1}px)`;
      }
    }, { passive: true });
  }

  // ========== PORTFOLIO CARD CLICK NAVIGATION ==========
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.id;
      let targetSection = '';

      if (id === 'portfolioCard1') targetSection = '#grand-opening';
      else if (id === 'portfolioCard2') targetSection = '#product-launch';
      else if (id === 'portfolioCard3') targetSection = '#car-edits';

      if (targetSection) {
        const target = document.querySelector(targetSection);
        if (target) {
          const navHeight = navbar ? navbar.offsetHeight : 0;
          const pos = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      }
    });
  });

})();
