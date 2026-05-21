import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const showToast = (message, type = 'info') => {
  let bg = '#111111'; // Default dark info
  let shadow = '4px 4px 0px 0px rgba(0,0,0,1)';
  let border = '2px solid #000';

  if (type === 'error') {
    bg = '#e62429'; // BitIron red
    shadow = '4px 4px 0px 0px rgba(0,0,0,1)';
  } else if (type === 'success') {
    bg = '#16a34a'; // Green
  }

  // Dark mode adaptations if we are in dark mode
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    shadow = '4px 4px 0px 0px rgba(255,255,255,1)';
    border = '2px solid #fff';
  }

  Toastify({
    text: message,
    duration: 3500,
    gravity: "bottom", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: "font-sans",
    style: {
      background: bg,
      color: "#ffffff",
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontSize: "0.75rem",
      padding: "16px 24px",
      boxShadow: shadow,
      border: border,
      borderRadius: "0", // Brutalist square edges
      zIndex: "9999",
    }
  }).showToast();
};

// Make it globally available for inline onclick attributes (like in ShopCatalog.js)
window.showToast = showToast;
