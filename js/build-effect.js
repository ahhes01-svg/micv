/*
 * Efecto "la web se diseña sola" al hacer scroll.
 * Cada bloque pasa por tres fases ligadas al scroll:
 *   1. --draw : se dibuja el contorno y el wireframe (esqueleto calcado del contenido real)
 *   2. --wipe : una línea de escaneo "pinta" el diseño final de izquierda a derecha
 *   3. --done : desaparecen las guías del editor (asas y etiqueta)
 * Si se vuelve a subir, el bloque se des-construye. Respeta prefers-reduced-motion.
 */
(() => {
  const TARGETS = [
    // Hero: se construye al cargar, pieza por pieza
    ".hero__copy > .eyebrow", ".hero__copy > .kicker", ".hero__copy > h1", ".hero__copy > .hero__role",
    ".hero__copy > .hero__summary", ".hero__copy > .quick-info", ".hero__copy > .hero__actions",
    ".profile-frame", ".technology-strip",
    // Resto de secciones: se construyen con el scroll
    ".section-heading", ".expertise-card", ".stats-grid > article", ".timeline-date", ".timeline-card",
    ".project-card", ".skill-group", ".soft-skills", ".education-card", ".contact-info", ".contact-form"
  ];
  const PIECES = "img,svg,h1,h2,h3,h4,p,li,.btn,button,input,textarea,select,.tag,.chip,strong,label";
  const MAX_PIECES = 14, MAX_LINES = 3;
  const BUILD_EVENT = "buildprogress";

  window.initBuildEffect = function () {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !window.gsap || !window.ScrollTrigger) return new Set();
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("bp-on");

    const targets = [...new Set(TARGETS.flatMap(selector => [...document.querySelectorAll(selector)]))]
      .filter(el => el.getClientRects().length && !el.closest("[hidden]"));
    const handled = new Set(targets);
    const builds = new Map();

    targets.forEach(el => {
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.classList.add("bp-target");
      const overlay = createOverlay(el);
      builds.set(el, { overlay, progress: 0 });
      gsap.set(el, { "--draw": 0, "--wipe": 0, "--done": 0 });
    });
    layoutAll();

    const timelineFor = el => gsap.timeline({ paused: true })
      .to(el, { "--draw": 1, duration: .38, ease: "power1.out" })
      .to(el, { "--wipe": 1, duration: .5, ease: "power2.inOut" })
      .to(el, { "--done": 1, duration: .12, ease: "none" });

    const setProgress = (el, value) => {
      const build = builds.get(el);
      build.progress = value;
      el.classList.toggle("bp-built", value >= .999);
      el.classList.toggle("bp-building", value > .001 && value < .999);
      document.dispatchEvent(new CustomEvent(BUILD_EVENT, { detail: { el } }));
    };

    // Los bloques visibles al cargar se construyen solos (intro); el resto con el scroll.
    const fold = innerHeight * .88;
    let introIndex = 0;
    targets.forEach(el => {
      const tl = timelineFor(el);
      tl.eventCallback("onUpdate", () => setProgress(el, tl.progress()));
      const inIntro = el.getBoundingClientRect().top < fold && scrollY < 40;
      if (inIntro) {
        gsap.to(tl, { progress: 1, duration: 1.15, ease: "none", delay: .35 + introIndex++ * .14 });
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: "top 96%",
          end: () => `top ${el.offsetHeight > innerHeight * .6 ? 30 : 52}%`,
          scrub: .6,
          animation: tl
        });
      }
    });

    sectionGrids();
    buildHud(builds);

    // El layout del wireframe se recalcula cuando cambia el tamaño, el idioma o cargan fuentes.
    let layoutFrame = 0;
    const queueLayout = () => { cancelAnimationFrame(layoutFrame); layoutFrame = requestAnimationFrame(layoutAll); };
    ScrollTrigger.addEventListener("refresh", queueLayout);
    document.addEventListener("languagechange", () => setTimeout(() => { queueLayout(); ScrollTrigger.refresh(); }, 60));
    document.fonts?.ready.then(queueLayout);
    addEventListener("load", queueLayout, { once: true });

    function layoutAll() {
      builds.forEach(({ overlay }, el) => {
        if (!el.contains(overlay)) el.append(overlay); // las traducciones pueden reescribir el contenido
        layoutOverlay(el, overlay);
      });
    }

    return handled;
  };

  function createOverlay(el) {
    const overlay = document.createElement("div");
    overlay.className = "bp";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="bp__sheet"><div class="bp__pieces"></div></div>' +
      '<svg class="bp__outline" preserveAspectRatio="none"><rect pathLength="1" x=".5" y=".5" width="0" height="0"/></svg>' +
      '<span class="bp__scan"></span>' +
      '<span class="bp__h bp__h--tl"></span><span class="bp__h bp__h--tr"></span>' +
      '<span class="bp__h bp__h--bl"></span><span class="bp__h bp__h--br"></span>' +
      `<span class="bp__tag">${tagName(el)}<b></b></span>`;
    el.append(overlay);
    return overlay;
  }

  function tagName(el) {
    const tag = el.tagName.toLowerCase();
    const cls = [...el.classList].find(name => !/^(reveal|bp-|magnetic|is-)/.test(name));
    return cls ? `${tag}.${cls}` : tag;
  }

  // Calca la estructura real del bloque: barras por cada línea de texto y cajas para imágenes/controles.
  function layoutOverlay(el, overlay) {
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const style = getComputedStyle(el);
    const radius = parseFloat(style.borderTopLeftRadius) || 0;
    const rect = overlay.querySelector(".bp__outline rect");
    rect.setAttribute("width", Math.max(box.width - 1, 0));
    rect.setAttribute("height", Math.max(box.height - 1, 0));
    const r = Math.min(radius, box.height / 2, box.width / 2);
    rect.setAttribute("rx", r);
    rect.setAttribute("ry", r);
    overlay.classList.toggle("bp--compact", box.height < 56);
    overlay.querySelector(".bp__outline").setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    overlay.querySelector(".bp__tag b").textContent = `${Math.round(box.width)} × ${Math.round(box.height)}`;

    const picked = [];
    for (const node of el.querySelectorAll(PIECES)) {
      if (picked.length >= MAX_PIECES) break;
      if (overlay.contains(node) || picked.some(parent => parent.contains(node))) continue;
      if (!node.getClientRects().length || node.closest("[hidden]")) continue;
      picked.push(node);
    }

    const fragments = [];
    let order = 0;
    const add = (kind, r) => {
      const x = r.left - box.left, y = r.top - box.top;
      if (r.width < 4 || r.height < 3 || x > box.width || y > box.height) return;
      const w = Math.min(r.width, box.width - x), h = Math.min(r.height, box.height - y);
      fragments.push(`<i class="bp__p bp__p--${kind}" style="--x:${x}px;--y:${y}px;--w:${w}px;--h:${h}px;--i:${order++}"></i>`);
    };

    picked.forEach(node => {
      const tag = node.tagName.toLowerCase();
      if (tag === "img" || tag === "svg") return add("media", node.getBoundingClientRect());
      if (/^(input|textarea|select|button)$/.test(tag) || node.classList.contains("btn") || node.classList.contains("tag") || node.classList.contains("chip")) {
        return add("control", node.getBoundingClientRect());
      }
      textLines(node).slice(0, MAX_LINES).forEach(line => add(/^h\d$/.test(tag) ? "title" : "text", line));
    });

    // Textos sueltos (p. ej. el h1 del hero): el propio bloque es la pieza.
    if (!picked.length) {
      const tag = el.tagName.toLowerCase();
      textLines(el).slice(0, MAX_LINES).forEach(line => add(/^h\d$/.test(tag) ? "title" : "text", line));
    }
    overlay.querySelector(".bp__pieces").innerHTML = fragments.join("");
  }

  // Une los rectángulos de texto en líneas para dibujar una barra por renglón.
  function textLines(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const lines = [];
    for (const r of range.getClientRects()) {
      if (r.width < 2 || r.height < 2) continue;
      const line = lines.find(l => Math.abs(l.top - r.top) < r.height * .5);
      if (line) { line.left = Math.min(line.left, r.left); line.right = Math.max(line.right, r.right); line.bottom = Math.max(line.bottom, r.bottom); }
      else lines.push({ top: r.top, left: r.left, right: r.right, bottom: r.bottom });
    }
    range.detach?.();
    return lines.map(l => {
      const h = l.bottom - l.top, pad = h * .22;
      return { left: l.left, top: l.top + pad, width: l.right - l.left, height: h - pad * 2 };
    });
  }

  // Cuadrícula de plano que aparece en cada sección mientras se está construyendo.
  function sectionGrids() {
    document.querySelectorAll("main > section[id]:not(#inicio), main > .stats-section").forEach(section => {
      const grid = document.createElement("div");
      grid.className = "bp-grid";
      grid.setAttribute("aria-hidden", "true");
      grid.innerHTML = `<span class="bp-grid__label">&lt;section${section.id ? ` id="${section.id}"` : ""}&gt;</span>`;
      section.prepend(grid);
      section.classList.add("bp-section");
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top 95%", end: "bottom 55%", scrub: .6 } })
        .fromTo(grid, { opacity: 0 }, { opacity: 1, duration: .25, ease: "none" })
        .to(grid, { opacity: 1, duration: .35 })
        .to(grid, { opacity: 0, duration: .4, ease: "none" });
    });
  }

  // Indicador flotante: "Construyendo · Proyectos 64%".
  function buildHud(builds) {
    const hud = document.createElement("div");
    hud.className = "bp-hud";
    hud.setAttribute("aria-hidden", "true");
    hud.innerHTML = '<span class="bp-hud__dot"></span><span class="bp-hud__label"></span><span class="bp-hud__bar"><i></i></span><span class="bp-hud__pct"></span>';
    document.body.append(hud);
    const label = hud.querySelector(".bp-hud__label"), bar = hud.querySelector(".bp-hud__bar i"), pct = hud.querySelector(".bp-hud__pct");

    const sectionName = section => {
      const link = document.querySelector(`.nav-links a[href="#${section?.id}"]`);
      return link?.textContent.trim() || (window.currentLanguage === "en" ? "Overview" : "Resumen");
    };

    let frame = 0, hideTimer = 0;
    const render = () => {
      frame = 0;
      const middle = innerHeight * .55;
      const active = [...document.querySelectorAll("main > section")].find(section => {
        const r = section.getBoundingClientRect();
        return r.top <= middle && r.bottom >= middle;
      });
      const items = [...builds.entries()].filter(([el]) => el.closest("main > section") === active);
      if (!items.length) { hud.classList.remove("is-visible"); return; }
      const value = items.reduce((sum, [, b]) => sum + b.progress, 0) / items.length;
      const done = value >= .995;
      const en = window.currentLanguage === "en";
      label.textContent = `${done ? (en ? "Built" : "Listo") : (en ? "Building" : "Construyendo")} · ${sectionName(active)}`;
      bar.style.transform = `scaleX(${value})`;
      pct.textContent = `${Math.round(value * 100)}%`;
      hud.classList.toggle("is-done", done);
      clearTimeout(hideTimer);
      if (value > .01 && !document.getElementById("site-update")) hud.classList.add("is-visible");
      if (done) hideTimer = setTimeout(() => hud.classList.remove("is-visible"), 1100);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(render); };
    document.addEventListener(BUILD_EVENT, queue);
    addEventListener("scroll", queue, { passive: true });
    document.addEventListener("languagechange", queue);
  }
})();
