
async function renderizarCarruselDesdeDB() {
    const carruselContainer = document.querySelector('.carousel');
    if (!carruselContainer) return;

    try {
        const response = await fetch('http://localhost:3000/api/productos');
        const result = await response.json();

        if (!result.success) throw new Error("Error en la respuesta de la API");

        const productos = result.data; // O donde el backend guarde el array

        // Limpiamos el contenido estático
        carruselContainer.innerHTML = "";

        // Solo mostramos los primeros 5 productos en el carrusel del Hero
        productos.slice(0, 5).forEach((prod, index) => {
            const slide = `
                <div id="slide${index}" class="carousel-item relative w-full">
                    <img src="${prod.ImagenURL || 'src/imagenes/gym.jpg'}" class="w-full object-cover" alt="${prod.Nombre}" />
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-10">
                        <h3 class="text-4xl font-black italic text-white uppercase tracking-tighter">${prod.Nombre}</h3>
                        <p class="text-bit-cyan font-bold tracking-widest mt-2">${prod.Precio}€ - DISPONIBLE AHORA</p>
                    </div>
                </div>
            `;
            carruselContainer.innerHTML += slide;
        });

    } catch (error) {
        console.error("Error al conectar con la base de datos de BitIron:", error);
    }
}

document.addEventListener('DOMContentLoaded', renderizarCarruselDesdeDB);