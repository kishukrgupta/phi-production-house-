document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

// Video sources are intentionally not added here. Add only owner-approved links to
// the matching [data-video-slot] elements when they are supplied.
