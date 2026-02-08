const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function initReveal() {
  const sections = qsa(".container");
  sections.forEach((section) => section.classList.add("reveal"));

  const staggerGroups = qsa(
    ".scroll-steps, .gallery-grid, .specs-grid, .overview-stats, .hero-chips, .cards, .product-grid"
  );
  staggerGroups.forEach((group) => group.classList.add("reveal", "stagger"));

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("in-view"));
    staggerGroups.forEach((group) => group.classList.add("in-view"));
    return;
  }

  const revealTargets = Array.from(new Set([...sections, ...staggerGroups]));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((section) => observer.observe(section));
}

function initMotionBackground() {
  const stage = qs(".motion-bg");
  if (!stage) return;

  const orbs = qsa(".orb", stage);
  if (!orbs.length) return;

  const motions = [
    { el: orbs[0], x: 140, y: 200, r: 12 },
    { el: orbs[1], x: -180, y: 140, r: -10 },
    { el: orbs[2], x: 120, y: -160, r: 8 },
    { el: orbs[3], x: -120, y: -200, r: 6 },
  ].filter((item) => item.el);

  const applyMotion = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    const drift = progress - 0.5;

    motions.forEach((item) => {
      const x = drift * item.x;
      const y = drift * item.y;
      const r = drift * item.r;
      item.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`;
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      applyMotion();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  applyMotion();
}

function initScrollStory() {
  const section = qs(".scroll-story");
  if (!section) return;

  const image = qs("#scrollImage", section);
  const bar = qs("#scrollBar", section);
  const items = qsa(".scroll-item", section);
  if (!image || !items.length) return;

  let swapTimer = null;
  const total = items.length;

  const swapImage = (nextSrc, nextAlt) => {
    if (!nextSrc || image.dataset.src === nextSrc) return;
    image.classList.add("is-swapping");
    image.dataset.src = nextSrc;
    if (swapTimer) {
      window.clearTimeout(swapTimer);
    }
    swapTimer = window.setTimeout(() => {
      image.onload = () => {
        image.classList.remove("is-swapping");
      };
      image.src = nextSrc;
      image.alt = nextAlt;
      if (image.complete) {
        image.classList.remove("is-swapping");
      }
    }, 120);
  };

  const setActive = (item, index) => {
    items.forEach((node) => node.classList.remove("is-active"));
    item.classList.add("is-active");
    const nextSrc = item.dataset.image;
    const nextAlt = item.dataset.alt || item.querySelector("h3")?.textContent || "Atlas highlight";
    const nextAccent = item.dataset.accent;
    if (nextAccent) {
      section.style.setProperty("--scroll-accent", nextAccent);
    }
    swapImage(nextSrc, nextAlt);
    if (bar) {
      bar.style.height = `${Math.round(((index + 1) / total) * 100)}%`;
    }
  };

  setActive(items[0], 0);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = items.indexOf(entry.target);
        if (index === -1) return;
        setActive(entry.target, index);
      });
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: 0.2 }
  );

  items.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initMotionBackground();
  initScrollStory();
});
