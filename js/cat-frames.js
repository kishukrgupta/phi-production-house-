/* ═══════════════════════════════════════
   Cat Frame-by-Frame — Cursor Tracking
   ═══════════════════════════════════════
   The cat's face follows the cursor anywhere on the page.
   Mouse Y relative to the cat's center determines which frame to show.
   Cursor above cat → cat looks up (early frames)
   Cursor level with cat → cat looks straight (frame 1)
   Cursor below cat → cat looks down (last frames)
*/
(function () {
  'use strict';

  const TOTAL_FRAMES = 80;
  const FRAME_PATH   = 'cat/frames/ezgif-frame-';
  const canvas       = document.getElementById('catCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const frames = [];
  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame  = 0;
  let rafId = null;

  /* ── Preload all frames ── */
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const num = String(i).padStart(3, '0');
    img.src = FRAME_PATH + num + '.jpg';
    img.onload = function () {
      loadedCount++;
      if (loadedCount === 1) {
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        drawFrame(0);
      }
      if (loadedCount === TOTAL_FRAMES) {
        drawFrame(currentFrame);
      }
    };
    frames.push(img);
  }

  /* ── Draw a specific frame ── */
  function drawFrame(index) {
    var img = frames[index];
    if (!img || !img.complete) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  /* ── Smooth interpolation loop ── */
  function animate() {
    // Lerp towards target for smooth motion
    var diff = targetFrame - currentFrame;
    if (Math.abs(diff) < 0.5) {
      currentFrame = targetFrame;
      drawFrame(Math.round(currentFrame));
      rafId = null;
      return;
    }
    // Smooth easing — move 15% of the gap each frame
    currentFrame += diff * 0.15;
    drawFrame(Math.round(currentFrame));
    rafId = requestAnimationFrame(animate);
  }

  function setTarget(frame) {
    targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, frame));
    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  }

  /* ── Get the cat canvas center in viewport coords ── */
  function getCatCenter() {
    var rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  /* ── Map cursor position to frame ──
     Cursor LEFT of cat  → cat looks one way (frame 0)
     Cursor CENTER        → cat looks straight (frame 40 = middle)
     Cursor RIGHT of cat → cat looks other way (frame 79)
  */
  function cursorToFrame(mouseX, mouseY) {
    var center = getCatCenter();
    var dx = mouseX - center.x;
    // How far left or right as a ratio of viewport width
    var viewW = window.innerWidth;
    var ratio = dx / (viewW * 0.5); // -1 (far left) to +1 (far right)
    ratio = Math.max(-1, Math.min(1, ratio));

    // Map -1..+1 → frame 0..79
    var frame = (ratio + 1) / 2 * (TOTAL_FRAMES - 1);
    return Math.round(frame);
  }

  /* ── Listen for mouse movement on the ENTIRE document ── */
  document.addEventListener('mousemove', function (e) {
    var frame = cursorToFrame(e.clientX, e.clientY);
    setTarget(frame);
  });

  /* ── Touch support ── */
  document.addEventListener('touchmove', function (e) {
    var touch = e.touches[0];
    var frame = cursorToFrame(touch.clientX, touch.clientY);
    setTarget(frame);
  }, { passive: true });

  /* ── When mouse leaves the window, slowly return to neutral ── */
  document.addEventListener('mouseleave', function () {
    setTarget(Math.round((TOTAL_FRAMES - 1) / 2));
  });

  /* ── Mobile auto-animation fallback ── */
  var isMobile = window.matchMedia('(max-width: 899px)').matches;
  var autoDir = 1;
  var autoVal = 0;
  var autoTimer = null;

  function autoAnimate() {
    if (!isMobile) return;
    autoVal += autoDir * 1;
    if (autoVal >= TOTAL_FRAMES - 1) { autoVal = TOTAL_FRAMES - 1; autoDir = -1; }
    if (autoVal <= 0) { autoVal = 0; autoDir = 1; }
    targetFrame = autoVal;
    currentFrame = autoVal;
    drawFrame(Math.round(autoVal));
    autoTimer = setTimeout(function () {
      requestAnimationFrame(autoAnimate);
    }, 80);
  }

  function stopAutoAnimate() {
    isMobile = false;
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
  }

  document.addEventListener('touchstart', stopAutoAnimate, { once: true });

  window.matchMedia('(max-width: 899px)').addEventListener('change', function (e) {
    isMobile = e.matches;
    if (isMobile && !autoTimer) {
      autoVal = Math.round(currentFrame);
      requestAnimationFrame(autoAnimate);
    }
  });

  window.addEventListener('load', function () {
    if (isMobile) {
      requestAnimationFrame(autoAnimate);
    }
  });
})();
