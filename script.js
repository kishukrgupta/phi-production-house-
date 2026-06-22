/* ======================================
   PHI Production House — Interactive JS
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Cursor Glow Effect ---
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // --- Navbar Scroll ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);

    // --- Hero Particles ---
    const particlesContainer = document.getElementById('heroParticles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = 0.2 + Math.random() * 0.5;
        particlesContainer.appendChild(particle);
    }

    // --- Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    function animateCounters() {
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.round(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // Trigger counter when hero is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counterAnimated = true;
                setTimeout(animateCounters, 600);
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) heroObserver.observe(heroSection);

    // --- Portfolio Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // --- Testimonial Slider ---
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
        currentSlide = index;
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        document.querySelectorAll('.slider-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
    });

    // Auto-slide
    let slideInterval = setInterval(() => {
        goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
    }, 5000);

    // Pause on hover
    const slider = document.getElementById('testimonialsSlider');
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
        }, 5000);
    });

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll(
        '.about-card, .service-card, .portfolio-item, .video-card, .process-step, .contact-item, .cta-card, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stagger service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Stagger about cards
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Stagger process steps
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.15}s`;
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
        `;
        submitBtn.style.pointerEvents = 'none';

        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = `
                <span>Message Sent!</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            submitBtn.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.35)';

            contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.style.boxShadow = '';
                submitBtn.style.pointerEvents = '';
            }, 3000);
        }, 1500);
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Tilt Effect on Service Cards (Desktop Only) ---
    if (window.matchMedia('(min-width: 768px)').matches) {
        const tiltCards = document.querySelectorAll('.service-card, .about-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }

});

// --- Open Video in Lightbox Modal ---
function toggleVideo(videoId, overlayId) {
    const video = document.getElementById(videoId);
    if (!video) return;
    
    // Get the video source (remove #t=3 fragment for clean playback)
    const source = video.querySelector('source');
    const videoSrc = source ? source.getAttribute('src').split('#')[0] : '';
    
    // Get the title from the card
    const card = video.closest('.video-card');
    const title = card ? card.querySelector('h3').textContent : '';
    
    // Open lightbox
    openLightbox(videoSrc, title);
}

function openLightbox(videoSrc, title) {
    const lightbox = document.getElementById('videoLightbox');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxSource = document.getElementById('lightboxSource');
    const lightboxTitle = document.getElementById('lightboxTitle');
    
    if (!lightbox || !lightboxVideo) return;
    
    // Set video source and title
    lightboxSource.setAttribute('src', videoSrc);
    lightboxVideo.load();
    lightboxTitle.textContent = title;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Auto-play after a short delay
    setTimeout(() => {
        lightboxVideo.play().catch(() => {});
    }, 300);
}

function closeLightbox() {
    const lightbox = document.getElementById('videoLightbox');
    const lightboxVideo = document.getElementById('lightboxVideo');
    
    if (!lightbox || !lightboxVideo) return;
    
    // Pause and reset video
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    
    // Hide lightbox
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Close lightbox on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// --- Auto-generate video thumbnails from frame ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.video-player, .portfolio-video-bg').forEach(video => {
        video.addEventListener('loadeddata', function() {
            // Seek to 3 seconds for thumbnail
            if (this.duration > 3) {
                this.currentTime = 3;
            }
        }, { once: true });
    });
});
