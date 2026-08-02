// ==========================================================
// script.js
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initThemeToggle();
  initTicker();
  initMarquee();
  initMobileNav();
  initProjectsCarousel();
  initSkillsRadar();
  initScrollReveal();
  initTypewriter();
  initHeroSlideshow(); 
  initClock();
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

/* ---------- Projects: draggable glowing carousel ---------- */
function initProjectsCarousel() {
  const track = document.getElementById("projects-track");
  const dotsWrap = document.getElementById("project-dots");
  const section = document.getElementById("projects");
  const cursor = document.getElementById("ring-cursor");
  if (!track || !section) return;

  const cards = track.querySelectorAll(".project-card");

  /* drag-to-scroll */
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

  /* pagination dots */
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to project ${i + 1}`);
      dot.addEventListener("click", () => {
        cards[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll(".dot");
    let dotTicking = false;

    function updateActiveDot() {
      let closestIndex = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      dots.forEach((d, i) => d.classList.toggle("active", i === closestIndex));
    }

    track.addEventListener("scroll", () => {
      if (!dotTicking) {
        requestAnimationFrame(() => {
          updateActiveDot();
          dotTicking = false;
        });
        dotTicking = true;
      }
    }, { passive: true });
  }

  /* custom ring cursor, scoped to this section only */
  if (cursor && window.matchMedia("(min-width: 861px)").matches) {
    section.addEventListener("mouseenter", () => {
      section.classList.add("cursor-active");
      cursor.classList.add("visible");
    });

    section.addEventListener("mouseleave", () => {
      section.classList.remove("cursor-active");
      cursor.classList.remove("visible");
    });

    section.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    section.querySelectorAll(".project-card, .github-link, .dot").forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
  }
}

/* ---------- Scroll reveal ---------- */
f/* ---------- Scroll Reveal Transitions ---------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  // Set up the observer to watch elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the element crosses into the viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Optional: Stop observing once it has animated in once
        // If you want it to fade in every time you scroll up/down, delete the line below.
        observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.15, // Triggers when 15% of the section is visible on screen
    rootMargin: "0px 0px -50px 0px" // Triggers slightly before the exact bottom of the screen
  });

  // Attach the observer to every element with the 'reveal' class
  revealElements.forEach(el => observer.observe(el));
}

// Make sure to call it when the page loads!
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  // ... your other initializers, like initHeroSlideshow()
});

/* ---------- Skills radar chart ---------- */
function initSkillsRadar() {
  const svg = document.getElementById("skills-radar");
  const tooltip = document.getElementById("radar-tooltip");
  const legendWrap = document.getElementById("radar-legend");
  const wrap = document.querySelector(".radar-wrap");
  if (!svg || !wrap) return;

  const categories = {
    Frontend:  { color: "#FFD43B", dark: "#4a3a00" },
    Backend:   { color: "#51CF66", dark: "#0c3d18" },
    Language:  { color: "#FF6B6B", dark: "#4a0f0f" },
    Data:      { color: "#4DABF7", dark: "#0a2a4a" },
    DevOps:    { color: "#FFA94D", dark: "#4a2a00" },
    "AI/Vision": { color: "#F783AC", dark: "#4a0f2a" },
  };

  const deviconUrl = (name) =>
    `https://cdn.jsdelivr.net/npm/devicon@2.15.1/icons/${name}/${name}-original.svg`;

  const skills = [
    { name: "React",     badge: "RX", category: "Frontend",   value: 65, icon: deviconUrl("react") },
    { name: "HTML",      badge: "HT", category: "Frontend",   value: 80, icon: deviconUrl("html5") },
    { name: "FastAPI",   badge: "FA", category: "Backend",    value: 90, icon: deviconUrl("fastapi") },
    { name: "Streamlit", badge: "SL", category: "Backend",    value: 90, icon: deviconUrl("streamlit") },
    { name: "Python",    badge: "PY", category: "Language",   value: 95, icon: deviconUrl("python") },
    { name: "C++",       badge: "C++", category: "Language",  value: 75, icon: deviconUrl("cplusplus") },
    { name: "Pandas",    badge: "PD", category: "Data",       value: 85, icon: deviconUrl("pandas") },
    { name: "NumPy",     badge: "NP", category: "Data",       value: 80, icon: deviconUrl("numpy") },
    { name: "Plotly",    badge: "PL", category: "Data",       value: 85, icon: deviconUrl("plotly") },
    { name: "Docker",    badge: "DK", category: "DevOps",     value: 80, icon: deviconUrl("docker") },
    { name: "Git",       badge: "GT", category: "DevOps",     value: 85, icon: deviconUrl("git") },
    { name: "n8n",       badge: "N8", category: "DevOps",     value: 75, icon: deviconUrl("n8n") },
    { name: "OpenCV",    badge: "OC", category: "AI/Vision",  value: 85, icon: deviconUrl("opencv") },
    { name: "MediaPipe", badge: "MP", category: "AI/Vision",  value: 85, icon: deviconUrl("mediapipe") },
    { name: "LangChain", badge: "LC", category: "AI/Vision",  value: 85, icon: deviconUrl("langchain") },
  ];

  const size = 520;
  const center = size / 2;
  const maxRadius = 180;
  const labelRadius = maxRadius + 34;
  const n = skills.length;
  const svgNS = "http://www.w3.org/2000/svg";

  function pointFor(index, radius) {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  }

  function el(tag, attrs) {
    const node = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }

  svg.innerHTML = "";

  [0.25, 0.5, 0.75, 1].forEach((level) => {
    const pts = skills.map((_, i) => pointFor(i, maxRadius * level));
    const d = pts.map((p) => `${p.x},${p.y}`).join(" ");
    svg.appendChild(el("polygon", { points: d, class: "radar-grid-ring" }));
  });

  skills.forEach((_, i) => {
    const p = pointFor(i, maxRadius);
    svg.appendChild(
      el("line", { x1: center, y1: center, x2: p.x, y2: p.y, class: "radar-axis-line" })
    );
  });

  const dataPts = skills.map((s, i) => pointFor(i, (s.value / 100) * maxRadius));
  const dataD = dataPts.map((p) => `${p.x},${p.y}`).join(" ");
  svg.appendChild(el("polygon", { points: dataD, class: "radar-data-shape" }));

 // outer axis label badges — real logo with monogram fallback
  const sweepTargets = [];

  skills.forEach((s, i) => {
    const p = pointFor(i, labelRadius);
    const cat = categories[s.category];
    const g = el("g", {});

    const badgeBg = el("circle", {
      cx: p.x, cy: p.y, r: 15,
      class: "radar-axis-badge-bg",
      fill: cat.dark, stroke: cat.color,
    });
    g.appendChild(badgeBg);

    const fallbackText = el("text", {
      x: p.x, y: p.y + 1, class: "radar-axis-badge", fill: cat.color,
    });
    fallbackText.textContent = s.badge;
    fallbackText.style.display = "none";
    g.appendChild(fallbackText);

    const img = el("image", {
      x: p.x - 10, y: p.y - 10, width: 20, height: 20,
      href: s.icon, class: "radar-axis-logo",
    });
    img.addEventListener("error", () => {
      img.style.display = "none";
      fallbackText.style.display = "";
    });
    g.appendChild(img);

    svg.appendChild(g);

    const nameLabel = el("text", {
      x: p.x, y: p.y + 30, class: "radar-name-label", fill: cat.color,
    });
    nameLabel.textContent = s.name.toUpperCase();
    svg.appendChild(nameLabel);

    sweepTargets.push({
      bearing: (i * 360) / n,
      badgeBg,
      nameLabel,
      cat,
      hideTimer: null,
    });
  });

  skills.forEach((s, i) => {
    const p = pointFor(i, (s.value / 100) * maxRadius);
    const cat = categories[s.category];
    const node = el("circle", {
      cx: p.x, cy: p.y, r: 5,
      class: "radar-node",
      fill: cat.color,
    });

    node.addEventListener("mouseenter", (e) => {
      tooltip.textContent = `${s.name.toUpperCase()} ${s.value}%`;
      tooltip.style.borderColor = cat.color;
      tooltip.style.boxShadow = `0 0 16px -2px ${cat.color}`;
      tooltip.classList.add("visible");
    });

    node.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      tooltip.style.left = `${e.clientX - rect.left}px`;
      tooltip.style.top = `${e.clientY - rect.top}px`;
    });

    node.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });

    svg.appendChild(node);
    sweepTargets[i].node = node;
  });

  // legend
  if (legendWrap) {
    legendWrap.innerHTML = "";
    Object.entries(categories).forEach(([name, cat]) => {
      const item = document.createElement("div");
      item.className = "legend-item";
      item.innerHTML = `<span class="legend-dot" style="background:${cat.color}"></span>${name}`;
      legendWrap.appendChild(item);
    });
  }

  // rotating sweep line
  const sweepGroup = el("g", { class: "radar-sweep-group" });
  const sweepColor = "#8FE3D9";
  const outerReach = labelRadius + 4;

  for (let k = 6; k >= 1; k--) {
    sweepGroup.appendChild(
      el("line", {
        x1: 0, y1: 0, x2: 0, y2: -outerReach,
        stroke: sweepColor,
        "stroke-width": 1,
        opacity: (0.28 - k * 0.04).toFixed(2),
        transform: `rotate(${-k * 3})`,
      })
    );
  }

  sweepGroup.appendChild(
    el("line", {
      x1: 0, y1: 0, x2: 0, y2: -outerReach,
      class: "radar-sweep-line",
      stroke: sweepColor,
      "stroke-width": 1.5,
    })
  );

  sweepGroup.setAttribute("transform", `translate(${center},${center}) rotate(0)`);
  svg.appendChild(sweepGroup);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    sweepGroup.style.display = "none";
    return;
  }

  const HIT_THRESHOLD = 3.5;
  const DEGREES_PER_MS = 360 / 9000;
  let currentAngle = 0;
  let lastTime = null;

  function angularDiff(a, b) {
    const diff = Math.abs(a - b) % 360;
    return diff > 180 ? 360 - diff : diff;
  }

  function triggerHit(target) {
    target.badgeBg.style.filter = `drop-shadow(0 0 8px ${target.cat.color})`;
    target.badgeBg.setAttribute("stroke-width", 2);
    if (target.node) {
      target.node.style.filter = `drop-shadow(0 0 6px ${target.cat.color})`;
      target.node.setAttribute("r", 7);
    }
    target.nameLabel.classList.add("visible");

    clearTimeout(target.hideTimer);
    target.hideTimer = setTimeout(() => {
      target.badgeBg.style.filter = "";
      target.badgeBg.setAttribute("stroke-width", 1);
      if (target.node) {
        target.node.style.filter = "";
        target.node.setAttribute("r", 5);
      }
      target.nameLabel.classList.remove("visible");
    }, 900);
  }

  function tick(now) {
    if (lastTime === null) lastTime = now;
    const delta = now - lastTime;
    lastTime = now;

    currentAngle = (currentAngle + delta * DEGREES_PER_MS) % 360;
    sweepGroup.setAttribute("transform", `translate(${center},${center}) rotate(${currentAngle})`);

    sweepTargets.forEach((target) => {
      if (angularDiff(currentAngle, target.bearing) < HIT_THRESHOLD) {
        triggerHit(target);
      }
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
/* ---------- Typewriter Animation ---------- */
function initTypewriter() {
  const textElement = document.getElementById("typewriter-text");
  if (!textElement) return;

  // The phrases you want to cycle through
  const phrases = [
    "Autonomous Vehicle Engineering Student.",
    "Computer Vision Specialist.",
    "Data & Signal Processing Enthusiast.",
    "Python & AI Developer.",
    "Problem Solver."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  // Timing controls (in milliseconds)
  const typingDelay = 80;
  const erasingDelay = 40;
  const newTextDelay = 2000; // How long to pause before erasing

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove a character
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add a character
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    // Determine the typing speed
    let typeSpeed = isDeleting ? erasingDelay : typingDelay;
    
    // Add a slight randomization to typing speed for a more human feel
    if (!isDeleting) {
      typeSpeed += Math.random() * 50; 
    }

    // If word is complete
    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = newTextDelay; // Pause at the end of the phrase
      isDeleting = true;
    } 
    // If word is completely erased
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length; // Move to next phrase
      typeSpeed = 500; // Brief pause before typing the next word
    }

    setTimeout(type, typeSpeed);
  }

  // Start the animation
  setTimeout(type, newTextDelay);
}
/* ---------- Hero Slideshow (3D Stack) ---------- */
function initHeroSlideshow() {
  // Get all slides and convert NodeList to an Array
  let slides = Array.from(document.querySelectorAll('#hero-slideshow .slide'));
  if (slides.length <= 1) return; 

  // Function to apply classes based on the array order
  function updateSlidePositions() {
    slides.forEach((slide, index) => {
      // Strip old position classes
      slide.classList.remove('pos-0', 'pos-1', 'pos-2', 'pos-hidden');
      
      // Assign new position based on current index
      if (index === 0) {
        slide.classList.add('pos-0');
      } else if (index === 1) {
        slide.classList.add('pos-1');
      } else if (index === 2) {
        slide.classList.add('pos-2');
      } else {
        slide.classList.add('pos-hidden');
      }
    });
  }

  // Set initial positions
  updateSlidePositions();

  const timeBetweenSlides = 3000; // 3 seconds

  setInterval(() => {
    // Take the front slide (index 0) and move it to the back of the array
    const frontSlide = slides.shift();
    slides.push(frontSlide);

    // Re-apply the classes to trigger the CSS transition
    updateSlidePositions();
  }, timeBetweenSlides); 
}

/* ---------- Live Clock for Location Panel ---------- */
function initClock() {
  const clockEl = document.getElementById('live-time');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    // Formats as HH:MM:SS
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    clockEl.textContent = timeString;
  }
  
  updateTime(); // Run immediately so there's no 1-second delay
  setInterval(updateTime, 1000); // Update every second
}
