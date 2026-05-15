// src/pages/AIchat.js
export const AIchatPage = () => {
  return `
    <div class="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-3xl bg-white border-4 border-black shadow-[20px_20px_00px_0px_rgba(0,0,0,1)] flex flex-col h-[80vh]">
        
        <div class="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
          <h2 class="font-black uppercase italic tracking-tighter text-xl">
            BITIRON <span class="text-red-600">AI COACH</span>
          </h2>
          <button onclick="window.location.href='/'" class="text-xs font-bold hover:text-red-600 uppercase underline">
            Volver a la Home
          </button>
        </div>

        <div id="chat-messages" class="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50 font-bold uppercase text-xs">
          <div class="bg-black text-white p-4 self-start max-w-[80%] border-l-8 border-red-600">
            SYSTEM INITIALIZED. I AM YOUR PERFORMANCE AI. WRITE "PLAN" OR YOUR DOUBT TO START.
          </div>
        </div>

        <div class="p-4 border-t-4 border-black bg-white">
          <form id="chat-form" class="flex gap-2">
            <input type="text" id="chat-input" 
              class="flex-1 border-4 border-black p-4 outline-none focus:bg-black focus:text-white transition-all font-black uppercase text-sm"
              placeholder="WRITE YOUR COMMAND HERE..." autocomplete="off">
            <button type="submit" class="bg-red-600 text-white px-8 font-black uppercase italic border-4 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_black] transition-all">
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
};