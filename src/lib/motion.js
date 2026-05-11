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

/**
 * Animaciones de scroll (scroll-triggered) — para las secciones de presentación.
 * Se usarán en features futuras (productos, asesoría, etc.)
 */
export const animations = {};
