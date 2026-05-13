// src/main.js
import './styles/global.css';
import { MainLayout } from './layouts/MainLayout.js';
import { Hero } from './components/Hero.js';
import { ProductCard } from './components/ProductCard.js';
import { initHeroAnimations } from './lib/motion.js';

let allProducts = [];


const renderProducts = (productsList) => {
  const container = document.querySelector('#product-grid');
  if (!container) return;

  if (productsList.length === 0) {
    container.innerHTML = `
      <p class="text-white/20 uppercase font-black italic col-span-full text-center py-20">
        No products found in the arsenal
      </p>`;
    return;
  }

  container.innerHTML = productsList.map(p => ProductCard(p)).join('');
};


const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/productos');
    allProducts = await response.json();

    renderProducts(allProducts);
  } catch (error) {
    console.error("Database connection error:", error);
    allProducts = [
      { name: "Whey Protein ISO", price: 49.99, image: "protein.jpg" },
      { name: "Creatine Monohydrate", price: 29.99, image: "creatine.jpg" }
    ];
    renderProducts(allProducts);
  }
};


const initApp = () => {
  const app = document.querySelector('#app');

  const catalogHTML = `
    <section id="catalog" class="py-20 px-4 lg:px-12 bg-black min-h-screen">
      <h2 class="text-4xl font-black italic tracking-tighter text-white mb-10 underline decoration-red-600 decoration-4">
        THE ARSENAL
      </h2>
      <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <!-- Products will be injected here -->
      </div>
    </section>
  `;

  app.innerHTML = MainLayout(Hero() + catalogHTML);

  fetchProducts();
  initHeroAnimations();
};

document.addEventListener('DOMContentLoaded', initApp);

document.addEventListener('input', (e) => {
  if (e.target.id === 'search-input') {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );

    renderProducts(filtered);
  }
});