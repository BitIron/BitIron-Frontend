// src/components/AIchat.js
export const AICoachChat = () => {
    return `
    <div id="ai-coach-trigger" class="fixed bottom-8 right-8 z-[120] cursor-pointer group">
      <div class="flex items-center justify-center w-16 h-16 bg-black text-white rounded-full border-4 border-red-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
        </svg>
      </div>
      <span class="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] px-3 py-1 font-black uppercase border border-red-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        AI Coach Access
      </span>
    </div>
  `;
};