'use strict';

// Native <details>-Navigation funktioniert auch ohne JavaScript.
const navigation = document.querySelector('.navigation');
if (navigation) {
  const summary = navigation.querySelector('summary');
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.open) {
      navigation.open = false;
      summary.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target)) navigation.open = false;
  });
  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => { navigation.open = false; });
  });
}

// Sterne behalten ihre Position; nur ihre Helligkeit verändert sich sanft.
const canvas = document.getElementById('star-canvas-bg');
const context = canvas?.getContext('2d');
if (context) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stars = Array.from({ length: 100 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: 0.4 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2,
  }));
  let width;
  let height;
  let timer;

  function drawStars() {
    context.clearRect(0, 0, width, height);
    const time = reducedMotion.matches ? 0 : performance.now() / 4000;
    for (const star of stars) {
      const alpha = 0.55 + Math.sin(time + star.phase) * 0.2;
      context.beginPath();
      context.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 236, 200, ${alpha})`;
      context.fill();
    }
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawStars();
  }

  function updateAnimation() {
    window.clearInterval(timer);
    drawStars();
    if (!reducedMotion.matches && !document.hidden) {
      timer = window.setInterval(drawStars, 100);
    }
  }

  resizeCanvas();
  updateAnimation();
  window.addEventListener('resize', resizeCanvas);
  reducedMotion.addEventListener('change', updateAnimation);
  document.addEventListener('visibilitychange', updateAnimation);
}
