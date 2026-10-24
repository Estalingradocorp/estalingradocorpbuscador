/* ============================================================
   ESTALINGRADO BUSCADOR · EN VIVO
   Reproductores HLS directos (hls.js) con click-to-play.
   Fuente principal: stream .m3u8 con CORS abierto.
   Autoreparación vía índice de iptv-org. Respaldo: YouTube.
   ============================================================ */

const renderLiveCard = (ch, idx) => `
    <article class="live-card flex flex-col bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-[0_10px_35px_rgb(0,0,0,0.1)] dark:hover:shadow-[0_10px_35px_rgb(0,0,0,0.4)] transition-all duration-300">
        <div class="live-stage relative aspect-video bg-black overflow-hidden cursor-pointer group/stage" data-index="${idx}" role="button" tabindex="0" aria-label="Reproducir ${ch.name} en directo">
            <div class="live-poster absolute inset-0 flex flex-col items-center justify-center gap-2 text-white transition-opacity group-hover/stage:opacity-80">
                <i class="fas fa-play-circle text-5xl text-red-500"></i>
                <span class="text-sm font-medium">Reproducir en directo</span>
            </div>
            <span class="live-badge absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[8px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm">
                <span class="live-dot"></span> En Vivo
            </span>
            ${ch.hls ? '<span class="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded bg-black/60 text-white/90 text-[7px] font-bold uppercase tracking-wider backdrop-blur-sm">HLS</span>' : ''}
        </div>
        <div class="p-4 flex flex-col">
            <div class="flex items-start justify-between gap-2 mb-2">
                <h4 class="font-bold text-sm sm:text-[15px] text-slate-900 dark:text-white leading-snug">${ch.name}</h4>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest"
                      style="background:#dbeafe; color:#1d4ed8; border:1px solid #93c5fd;">
                    <span class="inline-block h-1.5 w-1.5 rounded-full mr-1" style="background:${biasDotColor(ch.bias)}"></span>
                    ${biasLabelMap[ch.bias] || 'Centro'}
                </span>
            </div>
            <div class="flex items-center justify-between pt-2.5 mt-auto border-t border-slate-100 dark:border-slate-700/50">
                <span class="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <i class="fas fa-globe mr-1"></i>${ch.country}
                </span>
                <a href="https://nicotips27.github.io/ECnews/envivo.html" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center text-[9px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider">
                    IR → <i class="fas fa-arrow-up-right ml-1"></i>
                </a>
            </div>
        </div>
    </article>
`;

const loadLiveGrid = (containerId, channels) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = channels.map((ch, idx) => renderLiveCard(ch, idx)).join('');
    container.querySelectorAll('.live-stage').forEach(stage => {
        const index = Number(stage.dataset.index);
        const ch = channels[index];
        const activate = () => {
            if (stage.dataset.playing === '1') return;
            stage.dataset.playing = '1';
            startPlayback(stage, ch);
        };
        stage.addEventListener('click', activate);
        stage.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof LIVE_CONFIG !== 'undefined') {
        loadLiveGrid('grid-envivo-es', LIVE_CONFIG.es);
        loadLiveGrid('grid-envivo-en', LIVE_CONFIG.en);
    }
});
