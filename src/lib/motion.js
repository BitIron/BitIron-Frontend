// src/lib/motion.js
// Animaciones de entrada del Hero usando Motion (antes Motion One)
// Cada elemento entra en secuencia para crear el efecto cinematográfico

import { animate } from "motion";

/**
 * Animaciones de entrada del Hero.
 * Los elementos empiezan con opacity-0 en el HTML y aquí los animamos.
 * Se ejecutan en cascada (delay escalonado) para el efecto de presentación.
 */
export const initHeroAnimations = () => {

  // 1. Label rojo ("Iron Forged Nutrition") — cae desde arriba
  animate(
    '#hero-label',
    { opacity: [0, 1], y: [-20, 0] },
    { duration: 0.8, delay: 0.3, easing: 'ease-out' }
  );

  // 2. LEGACY — sube desde abajo con escala (impacto brutal)
  animate(
    '#hero-title',
    { opacity: [0, 1], y: [50, 0] },
    { duration: 1.0, delay: 0.6, easing: [0.16, 1, 0.3, 1] }
  );

  // 3. Tagline — aparece suavemente
  animate(
    '#hero-subtitle',
    { opacity: [0, 1], y: [15, 0] },
    { duration: 0.8, delay: 1.0, easing: 'ease-out' }
  );

  // 4. Botón CTA — aparece con ligero desplazamiento
  animate(
    '#hero-cta',
    { opacity: [0, 1], y: [15, 0] },
    { duration: 0.8, delay: 1.2, easing: 'ease-out' }
  );

  // 5. Scroll indicator — fundido al final
  animate(
    '#hero-scroll',
    { opacity: [0, 1] },
    { duration: 1.0, delay: 1.7, easing: 'ease-out' }
  );
};

// ─── PHILOSOPHY SECTION ANIMATIONS ─────────────────

/**
 * Animacin de entrada de la seccin Philosophy.
 * Se activa mediante IntersectionObserver para que salte al hacer scroll.
 */
export const animatePhilosophySection = () => {
  const quote = document.querySelector('#philosophy-quote');
  const pillars = document.querySelectorAll('.philosophy-pillar, [id^="pillar-"]');

  if (!quote) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 1. Frase central enorme
        animate(
          quote,
          { opacity: [0, 1], y: [40, 0] },
          { duration: 1.0, easing: 'ease-out' }
        );

        // 2. Pilares en cascada
        pillars.forEach((pillar, i) => {
          animate(
            pillar,
            { opacity: [0, 1], y: [30, 0] },
            { 
              duration: 0.8, 
              delay: 0.3 + (i * 0.15), 
              easing: 'ease-out' 
            }
          );
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(document.querySelector('#philosophy'));
};

// ─── SHOP CATALOG ANIMATIONS ───────────────────────

/**
 * Animacin de entrada del header y filtros del catǭlogo.
 */
export const animateCatalogEntrance = () => {
  const header = document.querySelector('#catalog-header');
  const filters = document.querySelector('#catalog-filters');

  if (header) {
    animate(
      header,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.8, easing: 'ease-out' }
    );
  }

  if (filters) {
    animate(
      filters,
      { opacity: [0, 1], y: [15, 0] },
      { duration: 0.8, delay: 0.2, easing: 'ease-out' }
    );
  }
};

/**
 * Revelado escalonado de las tarjetas de producto.
 */
export const animateCardReveal = (selector) => {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card, i) => {
    animate(
      card,
      { opacity: [0, 1], scale: [0.95, 1], y: [20, 0] },
      { 
        duration: 0.5, 
        delay: i * 0.05, 
        easing: 'ease-out' 
      }
    );
  });
};

/**
 * Animaciones de scroll (scroll-triggered) — para las secciones de presentación.
 * Se usarán en features futuras (productos, asesoría, etc.)
 */
export const animations = {};
