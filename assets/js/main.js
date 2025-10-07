'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  const root = document.getElementById('examples');
  if (!root) {
    return;
  }

  const track = root.querySelector('.track');
  const slides = track ? Array.from(track.children) : [];
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const dots = Array.from(document.querySelectorAll('.dot'));

  if (!track || slides.length === 0 || !prev || !next || dots.length === 0) {
    return;
  }

  const getIndex = () => Math.round(track.scrollLeft / root.clientWidth);
  const goTo = (index) => {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: target * root.clientWidth, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => goTo(getIndex() - 1));
  next.addEventListener('click', () => goTo(getIndex() + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));

  const observer = new IntersectionObserver(
    (entries) => {
      const best = entries.reduce((acc, entry) =>
        acc.intersectionRatio > entry.intersectionRatio ? acc : entry
      );
      const index = slides.indexOf(best.target);
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.setAttribute('aria-current', String(isActive));
        dot.setAttribute('aria-selected', String(isActive));
      });
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    },
    { root: track, threshold: [0.5, 0.75, 1] }
  );

  slides.forEach((slide) => observer.observe(slide));

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      goTo(getIndex() + 1);
    }
    if (event.key === 'ArrowLeft') {
      goTo(getIndex() - 1);
    }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => goTo(getIndex()), 120);
  });
});
