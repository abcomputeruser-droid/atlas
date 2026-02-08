const DATA_URL = "categories.json";

const el = (id) => document.getElementById(id);

async function loadContent() {
  const response = await fetch(DATA_URL);
  return response.json();
}

function initReveal() {
  const sections = document.querySelectorAll(".container");
  sections.forEach((section) => section.classList.add("reveal"));
  document
    .querySelectorAll(".category-grid, .hero-single-inner, .stats")
    .forEach((grid) => grid.classList.add("stagger"));

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

  sections.forEach((section) => observer.observe(section));
}

function renderNav(items) {
  const nav = el("categoryNav");
  nav.innerHTML = "";
  items.forEach((item) => {
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.label;
    nav.appendChild(a);
  });
}

function renderHero(hero) {
  el("heroEyebrow").textContent = hero.eyebrow;
  el("heroTitle").textContent = hero.title;
  el("heroSubtitle").textContent = hero.subtitle;
  const image = el("heroImage");
  image.src = hero.image;
  image.alt = hero.title;
}

function renderCategories(title, items) {
  el("categoryTitle").textContent = title;
  const grid = el("categoryGrid");
  grid.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    const specs = Array.isArray(item.specs) ? item.specs : [];
    card.className = "category";
    card.innerHTML = `
      <div class="category-media">
        <img src="${item.image}" alt="${item.title}" />
      </div>
      <div class="category-body">
        <h3>${item.title}</h3>
        ${item.summary ? `<p>${item.summary}</p>` : ""}
        ${specs.length ? `<ul class="category-specs">${specs.map((spec) => `<li>${spec}</li>`).join("")}</ul>` : ""}
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderHighlight(highlight) {
  el("highlightTitle").textContent = highlight.title;
  el("highlightBody").textContent = highlight.body;
}

function renderStats(items) {
  const grid = el("categoryStats");
  grid.innerHTML = "";
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "stat";
    div.innerHTML = `
      <div class="value">${item.value}</div>
      <div class="label">${item.label}</div>
    `;
    grid.appendChild(div);
  });
}

function renderFooter(footer) {
  const footerContent = el("footerContent");
  footerContent.innerHTML = `
    <div>
      <h4>Atlas</h4>
      <p>${footer.about}</p>
    </div>
    <div>
      <h4>Resources</h4>
      ${footer.resources.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
    </div>
    <div>
      <h4>Follow us</h4>
      ${footer.follow.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
    </div>
    <div>
      <h4>Legal</h4>
      ${footer.legal.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
    </div>
  `;
  el("footerNote").textContent = footer.note;
}

async function init() {
  const data = await loadContent();
  el("brandName").textContent = data.brand.name;
  el("brandTagline").textContent = data.brand.tagline;

  renderNav(data.navigation);
  renderHero(data.hero);
  renderCategories(data.title, data.categories);
  renderHighlight(data.highlight);
  renderStats(data.stats);
  renderFooter(data.footer);
  initReveal();
}

init();
