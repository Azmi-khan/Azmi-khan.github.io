// ==========================================================
// script.js
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initThemeToggle();
  initTicker();
  initMarquee();
  initMobileNav();
  initProjectsDrag();
  initProjectsScrollJack();
  initScrollReveal();
});

/* ---------- Boot-sequence loader ---------- */
function initLoader() {
  const loader = document.getElementById("loader");
  const linesEl = document.getElementById("loader-lines");
  const barFill = document.getElementById("loader-bar-fill");
  if (!loader) return;

  document.body.style.overflow = "hidden";

  const bootLines = [
    "INITIALIZING SYSTEMS...",
    "CALIBRATING SENSORS...",
    "LOADING PORTFOLIO.EXE...",
    "AUTONOMY: ENGAGED",
    "WELCOME — SYSTEMS ONLINE. IT'S AZMI.",
  ];

  let i = 0;
  function nextLine() {
    if (i < bootLines.length) {
      const line = document.createElement("div");
      line.className = "loader-line";
      line.textContent = "> " + bootLines[i];
      linesEl.appendChild(line);
      barFill.style.width = `${Math.round(((i + 1) / bootLines.length) * 100)}%`;
      i++;
      setTimeout(nextLine, 450);
    } else {
      setTimeout(() => {
        loader.classList.add("hidden");
        document.body.style.overflow = "";
        setTimeout(() => loader.remove(), 700);
      }, 500);
    }
  }
  nextLine();
}

/* ---------- Theme toggle (persisted) ---------- */
function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  const saved = localStorage.getItem("theme");
  if (saved) {
    root.setAttribute("data-theme", saved);
    icon.textContent = saved === "dark" ? "☾" : "☀";
  }

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", current);
    icon.textContent = current === "dark" ? "☾" : "☀";
    localStorage.setItem("theme", current);
  });
}

/* ---------- Telemetry ticker (signature element) ---------- */
function initTicker() {
  const metrics = [
    "RAG_ACCURACY <strong>95%</strong>",
    "VISION_FPS <strong>30</strong>",
    "WS_LATENCY <strong>&lt;50ms</strong>",
    "CACHE_SPEEDUP <strong>40%</strong>",
    "DATA_POINTS/SESSION <strong>1,000+</strong>",
    "TELEMETRY_ROWS <strong>100,000+</strong>",
    "CONCURRENT_REQ <strong>50+</strong>",
    "RULE_CHECK_TIME <strong>-80%</strong>",
  ];

  const track = document.getElementById("ticker-track");
  const html = metrics.map(m => `<span>${m}</span>`).join("");
  track.innerHTML = html + html; // duplicate for seamless loop
}

/* ---------- Skills marquee ---------- */
function initMarquee() {
  const devicon = (name, variant = "original") =>
    `https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/${name}/${name}-${variant}.svg`;

  const iconSkills = [
    { name: "Python", icon: devicon("python") },
    { name: "C++", icon: devicon("cplusplus") },
    { name: "React", icon: devicon("react") },
    { name: "HTML", icon: devicon("html5") },
    { name: "Docker", icon: devicon("docker") },
    { name: "Git", icon: devicon("git") },
    { name: "GitHub", icon: devicon("github"), invert: true },
    { name: "Pandas", icon: devicon("pandas") },
    { name: "NumPy", icon: devicon("numpy") },
  ];

  const textSkills = ["FastAPI", "Streamlit", "LangChain", "LangGraph", "n8n", "WebSockets", "REST APIs", "OpenCV", "MediaPipe"];

  const track = document.getElementById("marquee-track");

  const iconHTML = iconSkills
    .map(s => `<span class="skill-chip"><img src="${s.icon}" alt="" loading="lazy" class="${s.invert ? "icon-invert" : ""}" onerror="this.style.display='none'" />${s.name}</span>`)
    .join("");
  const textHTML = textSkills
    .map(s => `<span class="skill-chip">${s}</span>`)
    .join("");

  const full = iconHTML + textHTML;
  track.innerHTML = full + full; // duplicate for seamless loop
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const btn = document.getElementById("nav-mobile-toggle");
  const links = document.getElementById("nav-links");

  btn.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    links.style.display = isOpen ? "flex" : "none";
  });

  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      if (window.innerWidth <= 860) links.style.display = "none";
    });
  });
}

/* ---------- Projects: drag-to-scroll ---------- */
function initProjectsDrag() {
  const track = document.getElementById("projects-track");
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener("mousedown", (e) => {
    isDown = true;
    track.classList.add("dragging");
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  ["mouseleave", "mouseup"].forEach(evt =>
    track.addEventListener(evt, () => {
      isDown = false;
      track.classList.remove("dragging");
    })
  );

  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.2;
    track.scrollLeft = scrollLeft - walk;
  });
}

/* ---------- Projects: scroll-linked horizontal movement (desktop) ---------- */
function initProjectsScrollJack() {
  const outer = document.getElementById("projects-scroll-outer");
  const track = document.getElementById("projects-track");
  if (!outer || !track) return;

  const MIN_WIDTH = 861;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ticking = false;

  function maxTranslate() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }

  function enable() {
    outer.classList.add("js-scrolljack");
    outer.style.height = `${maxTranslate() + window.innerHeight}px`;
  }

  function disable() {
    outer.classList.remove("js-scrolljack");
    outer.style.height = "auto";
    track.style.transform = "none";
  }

  function onScroll() {
    if (prefersReducedMotion || window.innerWidth < MIN_WIDTH) return;
    const total = outer.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const rect = outer.getBoundingClientRect();
    let progress = -rect.top / total;
    progress = Math.min(Math.max(progress, 0), 1);
    track.style.transform = `translateX(-${progress * maxTranslate()}px)`;
  }

  function requestScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  function handleResize() {
    if (prefersReducedMotion) {
      disable();
      return;
    }
    if (window.innerWidth >= MIN_WIDTH) {
      enable();
    } else {
      disable();
    }
    onScroll();
  }

  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", handleResize);
  handleResize();
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".about-card, .timeline-item, .project-card, .skills-cat"
  );

  targets.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(el => observer.observe(el));
}