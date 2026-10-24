/* LiveStrip — renderiza la franja "En Vivo Ahora" de index.html y gestiona
   pausa/reanudación con IntersectionObserver (threshold 15%). CSS inyectado
   una sola vez; también usado por envivo.html para compartir estilos. */
(function () {
  const CSS = `
.live-banner{margin:18px 0 2px}
.live-banner .live-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}
.live-banner .live-head h3{margin:0;font-size:17px;font-weight:800;letter-spacing:.3px;color:var(--secondary,#58a6ff)}
.live-banner .live-sub{margin:0;font-size:12px;color:var(--text-muted,#8b949e)}
.live-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;padding:8px 0}
.live-card{display:flex;flex-direction:column;background:#161b22;border:1px solid #30363d;border-radius:10px;overflow:hidden;min-height:320px}
.live-wrap{position:relative;height:168px;background:#000;overflow:hidden}
.live-badge{position:absolute;top:8px;left:8px;z-index:3;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.65);padding:3px 8px;border-radius:4px;border:1px solid rgba(255,255,255,.25)}
.dot{width:8px;height:8px;border-radius:50%;background:#ff0000;box-shadow:0 0 7px #ff0000,0 0 14px #ff0000;animation:pulse 2s infinite}
.type-badge{position:absolute;top:8px;right:8px;z-index:3;font-size:10px;font-weight:800;color:#000;background:#00d084;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:.5px}
.live-media{position:relative;width:100%;height:100%}
.live-video,.live-iframe{width:100%;height:100%;object-fit:cover;display:block}
.live-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(0,0,0,.35);transition:opacity .2s;z-index:2}
.live-card.paused .live-overlay,.live-card:not(.playing) .live-overlay{opacity:1}
.live-card.playing .live-overlay{opacity:0}
.live-play-hint{display:flex;align-items:center;justify-content:center;width:56px;height:56px;background:rgba(255,255,255,.15);border-radius:50%;color:#fff;font-size:26px;backdrop-filter:blur(3px)}
.live-ctrl{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:4;background:rgba(0,0,0,.55);padding:4px 9px;border-radius:20px;backdrop-filter:blur(5px)}
.live-btn{background:rgba(255,255,255,.92);border:none;border-radius:50%;width:30px;height:30px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.live-body{padding:10px 12px;flex:1;display:flex;flex-direction:column}
.live-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
.live-title{font-weight:800;font-size:14.5px;color:#c9d1d9}
.go-live{color:#58a6ff;text-decoration:none;font-weight:800;font-size:13px;margin-left:8px}
.go-live:hover{text-decoration:underline}
.live-desc{font-size:12px;color:#8b949e;line-height:1.4;margin-bottom:8px}
.yt-link{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#58a6ff;text-decoration:none;margin-top:auto}
.yt-link:hover{text-decoration:underline}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
`;
  function injectCSS() {
    if (document.getElementById('live-strip-style')) return;
    const s = document.createElement('style');
    s.id = 'live-strip-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  const CHANNELS = [
    {
      id: 'dw', title: 'DW Español',
      source: 'https://dwamdstream104.akamaized.net/hls/live/2033394/dw-spanish/index.m3u8',
      type: 'hls',
      youtube: 'https://www.youtube.com/@DWEspañol/live',
      desc: 'Noticias y documentales de Alemania en español, en directo.'
    },
    {
      id: 'ln', title: 'La Nación · LN+',
      source: 'https://www.youtube.com/embed/FEWZjXJ7M0c?autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0',
      type: 'youtube',
      youtube: 'https://www.youtube.com/watch?v=FEWZjXJ7M0c',
      desc: 'Noticias en vivo desde Buenos Aires, Argentina.'
    },
    {
      id: 'aja', title: 'Al Jazeera English',
      source: 'https://live-hls-apps-aja-fa.getaj.net/index.m3u8',
      type: 'hls',
      youtube: 'https://www.youtube.com/@aljazeera/live',
      desc: 'Noticias internacionales en inglés, señal en directo.'
    }
  ];

  function renderGrid(container, PlayerClass) {
    CHANNELS.forEach((c) => {
      const card = document.createElement('div');
      container.appendChild(card);
      new PlayerClass(card, c);
    });
  }

  function init() {
    injectCSS();
    const strip = document.getElementById('live-strip');
    const grid = document.getElementById('live-grid');
    const Player = window.LivePlayer;
    if (!Player) {
      console.warn('LivePlayer no cargado aún');
      return;
    }
    const players = [];
    const target = strip || grid;
    if (!target) return;
    renderGrid(target, Player);

    if (strip) {
      const obs = new IntersectionObserver((entries) => {
        const visible = entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.15);
        players.forEach((p) => (visible ? p.play() : p.pause()));
      }, { threshold: 0.15 });
      obs.observe(strip);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
