// src/lib/aichat.js
import api from './api.js';


export const initAICoach = () => {
    // 1. Floating Button Logic (Redirection)
    const trigger = document.querySelector('#ai-coach-trigger');
    if (trigger) {
        trigger.addEventListener('click', () => {
            window.location.href = '/advisor.html';
        });
    }

    // 2. Chat Page Logic (Smart Form)
    const chatForm = document.querySelector('#chat-form');
    const chatInput = document.querySelector('#chat-input');
    const chatMessages = document.querySelector('#chat-messages');

    if (!chatForm) return;

    // Object following Backend guidelines (TipoPlan, PrecioMensual)
    let asesoriaData = {
        TipoPlan: '',
        PrecioMensual: 0,
        FechaInicio: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
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
            case 0: // Plan Selection
                if (input.includes("BASIC") || input.includes("ELITE") || input.includes("PRO")) {
                    asesoriaData.TipoPlan = input;
                    // Pricing based on plan
                    asesoriaData.PrecioMensual = input.includes("PRO") ? 150 : input.includes("ELITE") ? 90 : 50;

                    addMessage(`${asesoriaData.TipoPlan} PLAN REGISTERED. THE MONTHLY PRICE IS ${asesoriaData.PrecioMensual}€. DO YOU WANT TO CONFIRM THE REGISTRATION? (YES/NO)`);
                    currentStep = 1;
                } else {
                    addMessage("PLEASE CHOOSE A VALID PLAN: BASIC, ELITE OR PRO.");
                }
                break;

            case 1: // Confirmation and Backend Submission
                if (input.includes("YES") || input.includes("CONFIRM")) {
                    sendToBackend();
                } else {
                    addMessage("OPERATION CANCELED. WANT A DIFFERENT PLAN? TYPE THE PLAN NAME.");
                    currentStep = 0;
                }
                break;
        }
    };

    const sendToBackend = async () => {
        addMessage("CONNECTING TO BIT-IRON SERVER... FORGING DATABASE ENTRY.");

        try {
            // Call to our central API client (handles JWT automatically)
            const response = await api.post('/asesorias', asesoriaData);
            const result = response.data;

            if (result) {
                addMessage(`ADVISORY CREATED! REGISTRATION ID: ${result.id}. WELCOME TO THE ELITE.`);
                setTimeout(() => window.location.href = '/', 4000);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // Error handling based on our Express validator or auth
                addMessage(`VALIDATION ERROR: ${error.response.data.detalles ? error.response.data.detalles[0].mensaje : error.response.data.error || 'SYSTEM FAILURE'}`);
            } else {
                addMessage("CRITICAL ERROR: COULD NOT CONTACT THE BACKEND.");
            }
        }
    };

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim().toUpperCase();
        if (!text) return;

        addMessage(text, true);
        chatInput.value = '';

        // Simulate AI processing time
        setTimeout(() => processStep(text), 600);
    });
};