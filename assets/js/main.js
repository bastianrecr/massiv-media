import { updateFooterYear } from "../../blocks/Footer/Footer.js";

// Carrusel móvil ligero (usa el mismo <ul>)
(function () {
  const list = document.getElementById("services-list");
  if (!list) return;

  const controls = document.querySelector(".services__controls");
  const buttons = controls?.querySelectorAll("[data-dir]");

  const isMobile = () => window.matchMedia("(max-width: 640px)").matches;

  let slide = 0;
  function updateControls() {
    if (!controls) return;
    controls.style.display = isMobile() ? "flex" : "none";
  }

  function slideWidth() {
    const items = list.querySelectorAll(".services__item");
    if (!items.length) return 0;
    const r1 = items[0].getBoundingClientRect();
    if (items[1]) {
      const r2 = items[1].getBoundingClientRect();
      return r2.left - r1.left; // width + gap
    }
    return r1.width;
  }

  function go(dir) {
    if (!isMobile()) return;
    slide += dir;
    const max = list.children.length - 1;
    if (slide < 0) slide = 0;
    if (slide > max) slide = max;
    list.scrollTo({ left: slide * slideWidth(), behavior: "smooth" });
  }

  buttons?.forEach((b) =>
    b.addEventListener("click", () => go(parseInt(b.dataset.dir, 10)))
  );
  list.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  });

  updateControls();
  addEventListener("resize", updateControls);

  // Hook opcional para abrir el demo (reemplaza con tu modal)
  list.addEventListener("click", (e) => {
    const a = e.target.closest(".service-card");
    if (!a) return;
    const src = a.dataset.demo;
    if (src) console.info("Abrir demo:", src);
    e.preventDefault();
  });
})();
// ---- Sticky nav (solo desktop). En móvil ya es fixed por CSS.
(function () {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const page = document.querySelector(".page");
  if (!header || !nav || !page) return;

  const mq = window.matchMedia("(max-width: 720px)");
  let io = null; // guardaremos aquí el observer para poder limpiarlo

  function setSpacer(on) {
    if (!on) {
      page.classList.remove("page--nav-fixed");
      return;
    }
    const h = nav.getBoundingClientRect().height || 64;
    document.documentElement.style.setProperty("--nav-h", `${h}px`);
    page.classList.add("page--nav-fixed");
  }

  function enableDesktopSticky() {
    // Limpia por si ya existía
    if (io) {
      io.disconnect();
      io = null;
    }

    // En desktop usamos IntersectionObserver para “pegar” la nav al salir el header.
    io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          nav.classList.remove("nav--fixed");
          setSpacer(false);
        } else {
          nav.classList.add("nav--fixed");
          requestAnimationFrame(() => setSpacer(true));
        }
      },
      { root: null, threshold: 0 }
    );
    io.observe(header);
  }

  function disableSticky() {
    // En móvil NO usamos JS: la nav ya es fixed por CSS
    if (io) {
      io.disconnect();
      io = null;
    }
    nav.classList.remove("nav--fixed");
    setSpacer(false);
  }

  function applyMode(e) {
    if (e.matches) {
      // ≤720px (móvil)
      disableSticky();
    } else {
      // >720px (desktop)
      enableDesktopSticky();
    }
  }

  // Ejecuta una vez al cargar
  applyMode(mq);
  // Y vuelve a aplicar si cambias el tamaño de ventana
  mq.addEventListener("change", applyMode);

  // Recalcula el espaciador si cambia la altura de la nav estando fixed
  addEventListener("resize", () => {
    if (nav.classList.contains("nav--fixed")) setSpacer(true);
  });
})();

// --- Menú hamburguesa móvil + bloqueo scroll
(function () {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const panel = document.getElementById("nav-panel");
  const page = document.querySelector(".page");

  if (!nav || !toggle || !panel || !page) return;

  function openMenu() {
    nav.classList.add("nav--open");
    toggle.setAttribute("aria-expanded", "true");
    page.classList.add("page--lock");
  }
  function closeMenu() {
    nav.classList.remove("nav--open");
    toggle.setAttribute("aria-expanded", "false");
    page.classList.remove("page--lock");
  }
  function isOpen() {
    return nav.classList.contains("nav--open");
  }

  toggle.addEventListener("click", () => (isOpen() ? closeMenu() : openMenu()));

  // Cierra al hacer click en un link del panel
  panel.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeMenu();
  });

  // Cierra con Escape
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  // Si se cambia a desktop en vivo, asegúrate de cerrar
  addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 721px)").matches && isOpen())
      closeMenu();
  });
})();

// --- Botón volver al inicio
(function () {
  const btn = document.getElementById("toTop");
  if (!btn) return;

  const SHOW_AT = 400; // px
  function onScroll() {
    if (window.scrollY > SHOW_AT) {
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

// --- Actualiza el año del footer
updateFooterYear();
