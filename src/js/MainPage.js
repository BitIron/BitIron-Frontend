let products = [];
let slideIndex = 0;
let interval;

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

async function loadProducts() {

    try {

        const res = await fetch("http://localhost:3000/api/productos?limit=10");
        const json = await res.json();

        products = json.data || [];

        renderCarousel();
        renderFeaturedProducts();
        startAutoSlide();

    } catch (error) {

        console.error("Error loading products:", error);

    }

}

function renderCarousel() {

    const carousel = document.getElementById("product-carousel");

    if (!products.length) return;

    carousel.innerHTML = products.map((p, i) => {

        const prev = i === 0 ? products.length - 1 : i - 1;
        const next = i === products.length - 1 ? 0 : i + 1;

        return `
        <div id="slide${i}" class="carousel-item relative w-full group">

            <img 
                src="${p.Image}" 
                class="w-full h-full object-cover brightness-75 contrast-110 group-hover:scale-105 transition-transform duration-[2s]"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-[#0b021a] via-transparent p-12 flex flex-col justify-end">

                <span class="text-bit-cyan font-black text-xs tracking-widest mb-2">
                    ${p.Brand || "BITIRON"}
                </span>

                <h3 class="text-4xl font-black italic text-white uppercase leading-none">
                    ${p.Name}
                </h3>

                <p class="text-gray-300 text-xs mt-2">
                    €${p.Price}
                </p>

            </div>

            <!-- CONTROLS -->
            <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">

                <a href="#slide${prev}"
                    class="btn btn-circle bg-black/20 border-white/10 text-white hover:bg-bit-cyan hover:text-black">
                    ❮
                </a>

                <a href="#slide${next}"
                    class="btn btn-circle bg-black/20 border-white/10 text-white hover:bg-bit-cyan hover:text-black">
                    ❯
                </a>

            </div>

        </div>
        `;

    }).join("");

}

function startAutoSlide() {

    const carousel = document.getElementById("product-carousel");
    const slides = products.length;

    interval = setInterval(() => {

        slideIndex = (slideIndex + 1) % slides;

        const slide = document.getElementById(`slide${slideIndex}`);

        if (slide && carousel) {

            carousel.scrollTo({
                left: slide.offsetLeft,
                behavior: "smooth"
            });

        }

    }, 6000);

}

function renderFeaturedProducts() {

    const container = document.getElementById("featured-products");

    container.innerHTML = products.slice(0, 3).map(p => `

        <div class="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-bit-cyan/60 hover:scale-[1.02] transition-all duration-300">

            <img src="${p.Image}" class="h-52 w-full object-cover">

            <div class="p-5">

                <h3 class="font-black uppercase text-sm tracking-widest">
                    ${p.Name}
                </h3>

                <p class="text-gray-400 text-xs mt-2">
                    ${p.Brand || "BitIron"}
                </p>

                <div class="mt-4 flex justify-between items-center">

                    <span class="text-bit-cyan font-black">
                        €${p.Price}
                    </span>

                    <a href="store.html" class="text-xs font-bold hover:text-bit-cyan">
                        BUY
                    </a>

                </div>

            </div>

        </div>

    `).join("");

}