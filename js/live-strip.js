/* ============================================================
   ESTALINGRADO BUSCADOR · FRANJA EN VIVO (index.html)
   Tres transmisiones destacadas arriba de ECNews.
   Arranque automático y mudo, con controles discretos y pausa
   automática cuando la franja sale de pantalla. Reutiliza
   js/live-player.js.
   ============================================================ */

const renderLiveStripCard = (ch) => `
    <div class="live-card flex flex-col bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-[0_10px_35px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_10px_35px_rgb(0,0,0,0.35)] transition-all duration-300 group hover:-translate-y-0.5">
        <div class="live-stage relative aspect-video bg-black overflow-hidden" data-index="${ch.__index}">
            <div class="live-poster absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white">
                <i class="fas fa-play-circle text-4xl text-red-500"></i>
                <span class="text-xs font-medium">Conectando con el directo...</span>
            </div>
            <span class="live-badge absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[8px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm">
                <span class="live-dot"></span> En Vivo
            </span>
            ${ch.hls ? '<span class="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded bg-black/60 text-white/90 text-[7px] font-bold uppercase tracking-wider backdrop-blur-sm">HLS</span>' : ''}
        </div>
        <div class="p-3.5 flex flex-col">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-snug mb-2">${ch.name}</h4>
            <div class="flex items-center justify-between pt-2.5 mt-auto border-t border-slate-100 dark:border-slate-700/50">
                <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <i class="fas fa-globe mr-1"></i>${ch.country}
                </span>
                <a href="https://nicotips27.github.io/ECnews/envivo.html" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center text-[8px] font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider">
                    IR → <i class="fas fa-arrow-up-right ml-0.5"></i>
                </a>
            </div>
        </div>
    </div>
`;

const loadLiveStrip = () => {
    const container = document.getElementById('live-strip-grid');
    if (!container || typeof LIVE_CONFIG === 'undefined' || typeof LIVE_STRIP === 'undefined') return;

    const all = [...LIVE_CONFIG.es, ...LIVE_CONFIG.en];
    const channels = LIVE_STRIP
        .map(entry => all.find(c => c.name === entry.name))
        .filter(Boolean)
        .map((c, idx) => ({ ...c, __index: idx }));

    if (!channels.length) return;

    container.innerHTML = channels.map(renderLiveStripCard).join('');

    const stages = [...container.querySelectorAll('.live-stage')];

    stages.forEach(stage => {
        const ch = channels[Number(stage.dataset.index)];

        stage.dataset.playing = '1';
        startPlayback(stage, ch, { controls: false });

        stage.addEventListener('click', () => {
            toggleStagePlayback(stage);
        });
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.15);
            stages.forEach(stage => {
                const video = stage.querySelector('video');
                if (!video) return;
                if (visible && stage.dataset.userPaused !== '1') {
                    video.play().catch(() => { });
                    setStageControlIcon(stage, true);
                } else if (!visible) {
                    video.pause();
                }
            });
        }, { threshold: 0.15 });
        observer.observe(container);
    }
};

document.addEventListener('DOMContentLoaded', loadLiveStrip);
