// src/lib/aichat.js

export const initAICoach = () => {
    // 1. Lógica del Botón Flotante (Redirección)
    const trigger = document.querySelector('#ai-coach-trigger');
    if (trigger) {
        trigger.addEventListener('click', () => {
            window.location.href = '/aichat';
        });
    }

    // 2. Lógica de la Página de Chat (Formulario Inteligente)
    const chatForm = document.querySelector('#chat-form');
    const chatInput = document.querySelector('#chat-input');
    const chatMessages = document.querySelector('#chat-messages');

    if (!chatForm) return;

    // Objeto que sigue las pautas de tu Backend (IdCliente, TipoPlan, PrecioMensual)
    let asesoriaData = {
        IdCliente: 1, // En producción se sacaría del JWT o sesión
        TipoPlan: '',
        PrecioMensual: 0,
        FechaInicio: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        PagadoAlDia: false
    };

    let currentStep = 0;

    const addMessage = (text, isUser = false) => {
        const div = document.createElement('div');
        div.className = isUser
            ? "bg-red-600 text-white p-4 self-end max-w-[80%] ml-auto border-r-8 border-black shadow-md"
            : "bg-black text-white p-4 self-start max-w-[80%] border-l-8 border-red-600 shadow-md";
        div.innerText = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const processStep = (input) => {
        switch (currentStep) {
            case 0: // Selección de Plan
                if (input.includes("BASIC") || input.includes("ELITE") || input.includes("PRO")) {
                    asesoriaData.TipoPlan = input;
                    // Asignamos precios según el plan (ajusta según necesites)
                    asesoriaData.PrecioMensual = input.includes("PRO") ? 150 : input.includes("ELITE") ? 90 : 50;

                    addMessage(`PLAN ${asesoriaData.TipoPlan} REGISTRADO. EL PRECIO MENSUAL ES DE ${asesoriaData.PrecioMensual}€. ¿DESEAS CONFIRMAR LA INSCRIPCIÓN? (SÍ/NO)`);
                    currentStep = 1;
                } else {
                    addMessage("POR FAVOR, ELIGE UN PLAN VÁLIDO: BASIC, ELITE O PRO.");
                }
                break;

            case 1: // Confirmación y Envío al Backend
                if (input.includes("SI") || input.includes("SÍ") || input.includes("CONFIRMAR")) {
                    sendToBackend();
                } else {
                    addMessage("OPERACIÓN CANCELADA. ¿DIFERENTE PLAN? ESCRIBE EL NOMBRE DEL PLAN.");
                    currentStep = 0;
                }
                break;
        }
    };

    const sendToBackend = async () => {
        addMessage("CONECTANDO CON EL SERVIDOR BIT-IRON... FORJANDO ENTRADA EN DB.");

        try {
            // Llamada a tu ruta de Express
            const response = await fetch('http://localhost:3000/api/asesorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(asesoriaData)
            });

            const result = await response.json();

            if (response.ok) {
                addMessage(`¡ASESORÍA CREADA! ID DE REGISTRO: ${result.id}. BIENVENIDO A LA ÉLITE.`);
                setTimeout(() => window.location.href = '/', 4000);
            } else {
                // Manejo de errores basado en tu validator de Express
                addMessage(`ERROR DE VALIDACIÓN: ${result.detalles ? result.detalles[0].mensaje : 'FALLO EN EL SISTEMA'}`);
            }
        } catch (error) {
            addMessage("ERROR CRÍTICO: NO SE PUDO CONTACTAR CON EL BACKEND.");
        }
    };

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim().toUpperCase();
        if (!text) return;

        addMessage(text, true);
        chatInput.value = '';

        // Simular tiempo de procesamiento de la IA
        setTimeout(() => processStep(text), 600);
    });
};