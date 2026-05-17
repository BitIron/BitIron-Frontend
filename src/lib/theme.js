// src/lib/theme.js
// Gestor del Modo Oscuro (Dark Mode) para BitIron
// Almacena la preferencia del usuario en localStorage y manipula la clase 'dark' en document.documentElement.

/**
 * Inicializa el tema leyendo el localStorage o la preferencia del sistema.
 * Debe llamarse inmediatamente en la carga de la página para evitar parpadeos visuales.
 */
export const initTheme = () => {
  const savedTheme = localStorage.getItem('bitiron_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Alterna entre tema claro y oscuro y lo guarda en localStorage.
 * Retorna true si queda en modo oscuro, false si queda en claro.
 */
export const toggleTheme = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('bitiron_theme', 'light');
    
    // Disparar evento personalizado para sincronizar múltiples componentes si es necesario
    dispatchThemeEvent('light');
    return false;
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('bitiron_theme', 'dark');
    
    dispatchThemeEvent('dark');
    return true;
  }
};

/**
 * Devuelve si el modo oscuro está activo actualmente.
 */
export const isDarkMode = () => {
  return document.documentElement.classList.contains('dark');
};

/**
 * Lanza un evento global indicando el cambio de tema para que el UI pueda reaccionar en tiempo real.
 */
const dispatchThemeEvent = (theme) => {
  const event = new CustomEvent('theme_changed', { detail: { theme } });
  document.dispatchEvent(event);
};
