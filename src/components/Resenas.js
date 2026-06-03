// src/components/Resenas.js

export const ResenasComponent = () => {
    return `
        <section class="border-4 border-black p-6 mt-12 bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 class="text-3xl font-black uppercase tracking-tight mb-6">Valoraciones</h3>
            
            <form id="formularioResena" class="flex flex-col gap-5">
                <input type="hidden" id="idProductoActual" value="1"> 
                
                <div class="flex flex-col gap-2">
                    <label for="notaResena" class="font-bold uppercase text-sm tracking-wider">Puntuación</label>
                    <select id="notaResena" class="border-2 border-black p-3 font-bold bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer" required>
                        <option value="5">5 - Excelente</option>
                        <option value="4">4 - Muy bueno</option>
                        <option value="3">3 - Normal</option>
                        <option value="2">2 - Flojo</option>
                        <option value="1">1 - Pésimo</option>
                    </select>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="textoResena" class="font-bold uppercase text-sm tracking-wider">Tu comentario</label>
                    <textarea id="textoResena" rows="3" class="border-2 border-black p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y" required placeholder="Escribe tu opinión aquí..."></textarea>
                </div>

                <button type="submit" class="bg-black text-white font-black uppercase tracking-widest py-4 hover:bg-zinc-800 transition-colors border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-zinc-400">
                    Enviar Reseña
                </button>
            </form>
            
            <div id="notificacionExito" class="hidden mt-6 p-4 bg-green-400 text-black border-2 border-black font-bold uppercase text-center flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square" stroke-linejoin="miter"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ¡Valoración publicada con éxito!
            </div>
            
            <div id="contenedorResenas" class="mt-10 flex flex-col gap-4">
            </div>
        </section>
    `;
};




export const initResenasLogic = () => {
    const formulario = document.getElementById('formularioResena');
    
    if (!formulario) return; // Seguridad: si no existe el formulario en esta vista, no hacemos nada

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault(); // Crítico: Evita la recarga de página

        const idProducto = document.getElementById('idProductoActual').value;
        const puntuacion = document.getElementById('notaResena').value;
        const comentario = document.getElementById('textoResena').value;
        const notificacion = document.getElementById('notificacionExito');
        const contenedor = document.getElementById('contenedorResenas');

        // IMPORTANTE: Ajusta la URL base (http://localhost:3000) al puerto de tu backend
        const API_URL = 'http://localhost:3000/api/resenas'; 

        try {
            const respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idProducto: parseInt(idProducto),
                    puntuacion: parseInt(puntuacion),
                    comentario: comentario
                })
            });

            if (respuesta.ok) {
                // 1. Mostrar notificación de éxito
                notificacion.classList.remove('hidden');

                // 2. Construir el HTML de la nueva reseña
                const nuevaResenaHTML = `
                    <article class="border-l-4 border-black pl-4 py-2 mb-4 animate-fade-in">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="bg-black text-white px-2 py-1 font-bold text-sm">NOTA: ${puntuacion}/5</span>
                            <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">Justo ahora</span>
                        </div>
                        <p class="text-lg leading-relaxed text-zinc-800">${comentario}</p>
                    </article>
                `;

                // 3. Insertar al principio de la lista sin borrar lo anterior
                contenedor.insertAdjacentHTML('afterbegin', nuevaResenaHTML);

                // 4. Limpiar el formulario
                formulario.reset();

                // 5. Ocultar la notificación tras 4 segundos
                setTimeout(() => {
                    notificacion.classList.add('hidden');
                }, 4000);
            } else {
                console.error('El servidor devolvió un error:', respuesta.status);
                alert('Hubo un problema al guardar tu valoración.');
            }
        } catch (error) {
            console.error('Fallo de red al intentar conectar con el backend:', error);
            alert('Error de conexión. Asegúrate de que el servidor está encendido.');
        }
    });
};