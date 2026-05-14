// src/layouts/MainLayout.js
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';

/**
 * El Layout principal actúa como un contenedor.
 * Recibe el 'content' (HTML en string) y lo inyecta en la estructura común.
 */
export const MainLayout = (content) => {
  return `
    <div class="min-h-screen flex flex-col bg-white">
      ${Navbar()}
      <main class="flex-grow">
        ${content}
      </main>
      ${Footer()}
    </div>
  `;
};
