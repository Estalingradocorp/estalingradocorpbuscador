/* ============================================================
   ESTALINGRADO BUSCADOR · LIVE PLAYER (compartido)
   Motor de transmisiones en vivo usado por:
   - index.html   (js/live-strip.js)  → franja "En Vivo Ahora"
   - envivo.html  (js/envivo.js)      → grid completo

   Fuente principal: stream HLS directo (.m3u8) con CORS abierto.
   Respaldo: embed de YouTube.
   ============================================================ */

const HLS_JS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';

let hlsLibPromise = null;

const loadHlsLib = () => {
  if (hlsLibPromise) return hlsLibPromise;
  hlsLibPromise = new Promise((resolve, reject) => {
    if (window.Hls) return resolve(window.Hls);
    const script = document.createElement('script');
    script.src = HLS_JS_URL;
    script.onload = () => (window.Hls ? resolve(window.Hls) : reject(new Error('Hls no disponible')));
    script.onerror = () => reject(new Error('No se pudo cargar hls.js'));
    document.head.appendChild(script);
  });
  return hlsLibPromise;
};

// Auto-reparación de la URL HLS vía índice de iptv-org
const IPTV_INDEX_URL = 'https://iptv-org.github.io/api/streams.json';
const IPTV_CACHE_KEY = 'estalingrado-iptv-streams';
const IPTV_TTL = 6 * 60 * 60 * 1000;

const wantedChannelIds = () => {
  const ids = new Set();
  if (typeof LIVE_CONFIG === 'undefined') return ids;
  [...LIVE_CONFIG.es, ...LIVE_CONFIG.en].forEach((ch) => {
    if (ch.channel) ids.add(ch.channel);
  });
  return ids;
};

const fetchIptvIndex = async () => {
  const wanted = wantedChannelIds();
  try {
    const cached = JSON.parse(sessionStorage.getItem(IPTV_CACHE_KEY));
    if (cached && Date.now() - cached.ts < IPTV_TTL) return cached.map;
  } catch (e) { /* sin almacenamiento */ }
  try {
    const res = await fetch(IPTV_INDEX_URL);
    if (!res.ok) return null;
    const data = await res.json();
    const map = {};
    data.forEach((s) => {
      if (wanted.has(s.channel) && s.url && /\.m3u8(\?|$)/i.test(s.url)) {
        if (!map[s.channel]) map[s.channel] = [];
        map[s.channel].push(s.url);
      }
    });
    try { sessionStorage.setItem(IPTV_CACHE_KEY, JSON.stringify({ ts: Date.now(), map })); } catch (e) { }
    return map;
  } catch (e) { return null; }
};

const repairStreamUrl = async (ch) => {
  if (!ch || !ch.channel) return null;
  const map = await fetchIptvIndex();
  if (!map || !map[ch.channel] || !map[ch.channel].length) return null;
  const candidates = map[ch.channel];
  return candidates.find((u) => u !== ch.hls) || candidates[0];
};

// Escena de error con respaldo a YouTube
const showStageError = (stage, ch, message) => {
  stage.innerHTML = `
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center bg-black/80">
      <i class="fas fa-warning text-3xl text-amber-400"></i>
      <p class="text-xs sm:text-sm font-medium text-slate-300">${message}</p>
      <a href="${ch.youtube ? `https://www.youtube.com/watch?v=${ch.youtube}` : '#'}" target="_blank" rel="noopener noreferrer"
         class="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:underline">
        Ver en YouTube <i class="fas fa-arrow-up-right ml-1"></i>
      </a>
    </div>`;
};

const appendLiveBadge = (stage) => {
  const badge = document.createElement('span');
  badge.className = 'live-badge absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[8px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-sm';
  badge.innerHTML = '<span class="live-dot"></span> EN VIVO';
  stage.appendChild(badge);
};

// Controles de reproducción
const setStageControlIcon = (stage, playing) => {
  const btn = stage.querySelector('.live-control-btn');
  if (!btn) return;
  btn.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
};

const toggleStagePlayback = (stage) => {
  const video = stage.querySelector('video');
  if (video) {
    if (video.paused) {
      video.play().catch(() => { });
      setStageControlIcon(stage, true);
      stage.dataset.playing = '1';
      stage.dataset.userPaused = '0';
      return true;
    }
    video.pause();
    setStageControlIcon(stage, false);
    stage.dataset.playing = '0';
    stage.dataset.userPaused = '1';
    return false;
  }
  const frame = stage.querySelector('iframe');
  if (frame) {
    const playing = frame.dataset.playing === '1';
    try {
      const url = new URL(frame.src);
      url.searchParams.set('autoplay', playing ? '0' : '1');
      frame.dataset.playing = playing ? '0' : '1';
      frame.src = url.toString();
    } catch (e) { }
    setStageControlIcon(stage, !playing);
    stage.dataset.playing = playing ? '0' : '1';
    stage.dataset.userPaused = playing ? '1' : '0';
    return !playing;
  }
  return false;
};

const appendStageControl = (stage) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'live-control-btn absolute bottom-2 right-2 z-20 h-6 w-6 rounded-full bg-black/60 text-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-black/90 transition-colors';
  btn.setAttribute('aria-label', 'Pausar o reanudar la transmisión');
  btn.innerHTML = '<i class="fas fa-pause"></i>';
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStagePlayback(stage);
  });
  stage.appendChild(btn);
};

const appendStageAudio = (stage) => {
  const video = stage.querySelector('video');
  if (!video) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'live-audio-btn absolute bottom-2 right-10 z-20 h-6 w-6 rounded-full bg-black/60 text-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-black/90 transition-colors';
  btn.setAttribute('aria-label', 'Activar o silenciar el sonido');
  btn.innerHTML = `<i class="fas ${video.muted ? 'fa-volume-mute' : 'fa-volume-up'}"></i>`;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    btn.innerHTML = `<i class="fas ${video.muted ? 'fa-volume-mute' : 'fa-volume-up'}"></i>`;
  });
  stage.appendChild(btn);
};

const mountHlsPlayer = async (stage, ch, url, opts = {}) => {
  stage.innerHTML = '';
  let hlsInstance = null;

  const video = document.createElement('video');
  video.className = 'absolute inset-0 w-full h-full bg-black';
  video.controls = opts.controls !== false;
  video.playsInline = true;
  video.autoplay = true;
  video.muted = true;
  video.setAttribute('playsinline', '');
  stage.appendChild(video);
  appendLiveBadge(stage);
  appendStageControl(stage);
  if (opts.controls === false) appendStageAudio(stage);
  setStageControlIcon(stage, true);

  const onFatal = async () => {
    try { if (hlsInstance) hlsInstance.destroy(); } catch (e) { }
    const repaired = await repairStreamUrl(ch);
    if (repaired && repaired !== url) {
      mountHlsPlayer(stage, ch, repaired, opts);
      return;
    }
    showStageError(stage, ch, 'La señal no está disponible en este momento');
  };

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  } else {
    let Hls;
    try {
      Hls = await loadHlsLib();
    } catch (e) {
      showStageError(stage, ch, 'No se pudo cargar el reproductor');
      return;
    }
    if (!Hls.isSupported()) {
      video.src = url;
    } else {
      hlsInstance = new Hls({
        maxBufferLength: 20,
        enableWorker: true,
        startLevel: 0,
        capLevelToPlayerSize: true,
        abrEwmaDefaultEstimate: 500000
      });
      hlsInstance.on(Hls.Events.ERROR, (_evt, data) => {
        if (data && data.fatal) onFatal();
      });
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(video);
    }
  }

  video.addEventListener('error', () => {
    if (video.networkState === video.NETWORK_NO_SOURCE) onFatal();
  });
};

const mountYouTubePlayer = (stage, ch) => {
  const embed = `https://www.youtube.com/embed/${ch.youtube}?autoplay=1&mute=1&playsinline=1`;
  stage.innerHTML = `
    <iframe src="${embed}" title="${ch.name}" loading="lazy"
            class="absolute inset-0 w-full h-full bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen frameborder="0"></iframe>`;
  const frame = stage.querySelector('iframe');
  if (frame) frame.dataset.playing = '1';
  appendLiveBadge(stage);
  appendStageControl(stage);
  setStageControlIcon(stage, true);
};

const startPlayback = (stage, ch, opts = {}) => {
  const poster = stage.querySelector('.live-poster');
  if (poster) poster.remove();
  if (ch.hls) {
    mountHlsPlayer(stage, ch, ch.hls, opts);
  } else {
    mountYouTubePlayer(stage, ch);
  }
};
