/* ============================================
   PHI PRODUCTION HOUSE — Courses & Portfolio
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  renderCourses();
  initPortfolioFilters();
  initCourseFilters();
  initEnrollModal();
});

/* ── Portfolio Data ── */
const portfolioItems = [
  {
    id: 1,
    title: 'Tech Review Channel Rebrand',
    category: 'youtube',
    image: 'assets/port-youtube.png',
    views: '2.4M views',
    duration: '12:30'
  },
  {
    id: 2,
    title: 'Rahul & Priya — Wedding Film',
    category: 'wedding',
    image: 'assets/port-wedding.png',
    views: '850K views',
    duration: '28:45'
  },
  {
    id: 3,
    title: 'Luxe Automotive — Brand Film',
    category: 'commercial',
    image: 'assets/port-commercial.png',
    views: '1.8M views',
    duration: '2:00'
  },
  {
    id: 4,
    title: 'Cyberpunk City — VFX Breakdown',
    category: 'vfx',
    image: 'assets/port-vfx.png',
    views: '3.1M views',
    duration: '8:20'
  },
  {
    id: 5,
    title: 'Travel Vlog — Cinematic Edit',
    category: 'youtube',
    image: 'assets/port-commercial.png',
    views: '1.2M views',
    duration: '15:00'
  },
  {
    id: 6,
    title: 'Summer Wedding — Highlight Reel',
    category: 'wedding',
    image: 'assets/port-wedding.png',
    views: '620K views',
    duration: '6:45'
  }
];

/* ── Course Data ── */
const coursesData = [
  {
    id: 1,
    title: 'Color Grading Mastery',
    description: 'Master the art of cinematic color grading using DaVinci Resolve. From basic corrections to advanced looks.',
    image: 'assets/course-color.png',
    category: 'editing',
    difficulty: 'Intermediate',
    difficultyColor: 'amber',
    lessons: 42,
    duration: '18h 30m',
    rating: 4.9,
    ratingCount: 1240,
    price: 79,
    originalPrice: 149,
    popular: true
  },
  {
    id: 2,
    title: 'VFX & Compositing Fundamentals',
    description: 'Learn visual effects from scratch — green screen keying, tracking, rotoscoping, and particle systems.',
    image: 'assets/course-vfx.png',
    category: 'vfx',
    difficulty: 'Advanced',
    difficultyColor: 'magenta',
    lessons: 56,
    duration: '24h 15m',
    rating: 4.8,
    ratingCount: 890,
    price: 99,
    originalPrice: 199,
    popular: true
  },
  {
    id: 3,
    title: 'Motion Graphics Pro',
    description: 'Create stunning motion graphics and kinetic typography. Animate logos, titles, and infographics like a pro.',
    image: 'assets/course-motion.png',
    category: 'vfx',
    difficulty: 'Intermediate',
    difficultyColor: 'amber',
    lessons: 38,
    duration: '16h 45m',
    rating: 4.7,
    ratingCount: 670,
    price: 69,
    originalPrice: 129,
    popular: false
  },
  {
    id: 4,
    title: 'Premiere Pro Masterclass',
    description: 'The complete Premiere Pro course — from importing footage to exporting a polished final cut. All workflows covered.',
    image: 'assets/course-premiere.png',
    category: 'editing',
    difficulty: 'Beginner',
    difficultyColor: 'green',
    lessons: 64,
    duration: '28h 00m',
    rating: 4.9,
    ratingCount: 2150,
    price: 49,
    originalPrice: 99,
    popular: true
  },
  {
    id: 5,
    title: 'Sound Design & Audio Mixing',
    description: 'Professional audio post-production — foley, ambient sound, dialogue mixing, and music scoring for video.',
    image: 'assets/course-sound.png',
    category: 'audio',
    difficulty: 'Intermediate',
    difficultyColor: 'amber',
    lessons: 30,
    duration: '12h 20m',
    rating: 4.6,
    ratingCount: 430,
    price: 59,
    originalPrice: 119,
    popular: false
  },
  {
    id: 6,
    title: 'Cinematic Filmmaking',
    description: 'Shoot like a filmmaker — camera movement, lighting, lens choice, and directing. Theory meets practice.',
    image: 'assets/course-cinema.png',
    category: 'editing',
    difficulty: 'Beginner',
    difficultyColor: 'green',
    lessons: 48,
    duration: '20h 10m',
    rating: 4.8,
    ratingCount: 980,
    price: 89,
    originalPrice: 169,
    popular: false
  }
];

/* ── Render Portfolio ── */
function renderPortfolio(filter = 'all') {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  const filtered = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  grid.innerHTML = filtered.map((item, index) => `
    <div class="portfolio-card reveal" data-category="${item.category}" style="transition-delay: ${index * 100}ms;">
      <div class="portfolio-thumb">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="play-overlay">
          <div class="play-icon"></div>
        </div>
        <span class="portfolio-category-tag badge badge-cyan">${item.category}</span>
      </div>
      <div class="portfolio-info">
        <h3 class="portfolio-title">${item.title}</h3>
        <div class="portfolio-meta">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.7 7.6 1 12a11.8 11.8 0 0022 0c-1.7-4.4-6-7.5-11-7.5zM12 17a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"/></svg>
            ${item.views}
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            ${item.duration}
          </span>
        </div>
      </div>
    </div>
  `).join('');

  // Re-init scroll reveal for new elements
  setTimeout(() => {
    const newReveals = grid.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    newReveals.forEach(el => observer.observe(el));
  }, 50);
}

/* ── Render Courses ── */
function renderCourses(filter = 'all') {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? coursesData
    : coursesData.filter(c => c.category === filter);

  grid.innerHTML = filtered.map((course, index) => {
    const stars = '★'.repeat(Math.floor(course.rating)) + (course.rating % 1 >= 0.5 ? '½' : '');
    const discount = Math.round((1 - course.price / course.originalPrice) * 100);

    return `
      <div class="course-card reveal" data-category="${course.category}" data-course-id="${course.id}" style="transition-delay: ${index * 100}ms;">
        <div class="course-thumb">
          <img src="${course.image}" alt="${course.title}" loading="lazy">
          <span class="course-difficulty badge badge-${course.difficultyColor}">${course.difficulty}</span>
          ${course.popular ? '<span class="course-popular badge badge-magenta">🔥 Popular</span>' : ''}
        </div>
        <div class="course-body">
          <h3 class="course-title">${course.title}</h3>
          <p class="course-desc">${course.description}</p>
          <div class="course-meta">
            <span class="course-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              ${course.lessons} Lessons
            </span>
            <span class="course-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" stroke-width="2"/></svg>
              ${course.duration}
            </span>
            <span class="course-meta-item">
              <span style="color: var(--amber);">★</span>
              ${course.rating} (${course.ratingCount.toLocaleString()})
            </span>
          </div>
          <div class="course-footer">
            <div class="course-price">
              <span class="course-price-current">$${course.price}</span>
              <span class="course-price-original">$${course.originalPrice}</span>
              <span class="badge badge-green">${discount}% OFF</span>
            </div>
            <button class="btn btn-primary btn-sm enroll-btn" data-course-id="${course.id}">Enroll Now</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-init scroll reveal for new elements
  setTimeout(() => {
    const newReveals = grid.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    newReveals.forEach(el => observer.observe(el));
  }, 50);

  // Re-bind enroll buttons
  bindEnrollButtons();
}

/* ── Portfolio Filters ── */
function initPortfolioFilters() {
  const tabs = document.querySelectorAll('#portfolio-tabs .tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPortfolio(tab.dataset.filter);
    });
  });
}

/* ── Course Filters ── */
function initCourseFilters() {
  const tabs = document.querySelectorAll('#course-tabs .tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCourses(tab.dataset.filter);
    });
  });
}

/* ── Enrollment Modal ── */
function initEnrollModal() {
  const modal = document.getElementById('enroll-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const confirmBtn = document.getElementById('enroll-confirm-btn');

  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Confirm enrollment
  confirmBtn.addEventListener('click', () => {
    const email = document.getElementById('enroll-email').value;
    if (!email) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    const title = document.getElementById('modal-course-title').textContent;
    modal.classList.remove('active');
    showToast(`🎉 Enrolled in "${title}"! Check your email for access.`, 'success');
    document.getElementById('enroll-email').value = '';
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });

  bindEnrollButtons();
}

function bindEnrollButtons() {
  const enrollBtns = document.querySelectorAll('.enroll-btn');
  const modal = document.getElementById('enroll-modal');

  enrollBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const courseId = parseInt(btn.dataset.courseId);
      const course = coursesData.find(c => c.id === courseId);

      if (course) {
        document.getElementById('modal-course-title').textContent = course.title;
        document.getElementById('modal-course-desc').textContent = course.description;
        document.getElementById('modal-price').textContent = `$${course.price}`;
        modal.classList.add('active');
      }
    });
  });
}
