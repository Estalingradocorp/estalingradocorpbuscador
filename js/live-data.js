/* ============================================================
   ESTALINGRADO BUSCADOR · FUENTE ÚNICA DE DATOS EN VIVO
   Directorio de transmenciones en vivo usado por:
   - index.html   (js/live-strip.js)  → franja "En Vivo Ahora"
   - envivo.html  (js/envivo.js)      → grid completo de canales

   Cada canal declara:
     hls      → stream .m3u8 con CORS abierto (fuente principal).
     channel  → id de canal en iptv-org (autoreparación).
     youtube  → video/canal de YouTube como respaldo y enlace.
     accent/bias/country → metadatos de la tarjeta.
   ============================================================ */

const biasLabelMap = {
    'left': 'Izquierda',
    'center-left': 'Centroizquierda',
    'center': 'Centro',
    'center-right': 'Centroderecha',
    'right': 'Derecha',
};

const biasDotColor = (bias) => {
    if (bias === 'left' || bias === 'center-left') return '#3b82f6';
    if (bias === 'right' || bias === 'center-right') return '#ef4444';
    return '#64748b';
};

const isVideoId = (v) => v && /^[A-Za-z0-9_-]{11}$/.test(v);

const liveTargetUrl = (ch) => {
    if (!ch || !ch.youtube) return '#';
    return isVideoId(ch.youtube)
        ? `https://www.youtube.com/watch?v=${ch.youtube}`
        : `https://www.youtube.com/channel/${ch.youtube}/live`;
};

const LIVE_CONFIG = {
    es: [
        { name: 'DW Español', hls: 'https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/master.m3u8', channel: 'DW.de', youtube: 'UCT4Jg8h03dD0iN3Pb5L0PMA', accent: 'blue', bias: 'center', country: 'Alemania' },
        { name: 'La Nación · LN+', hls: null, channel: 'LaNacionPlus.ar', youtube: 'FEWZjXJ7M0c', accent: 'blue', bias: 'center', country: 'Argentina' },
    ],
    en: [
        { name: 'Al Jazeera English', hls: 'https://live-hls-apps-aja-fa.getaj.net/AJA/index.m3u8', channel: 'AlJazeera.qa', youtube: 'UCNye-wNBqNL5ZzHSJj3l8Bg', accent: 'indigo', bias: 'center', country: 'Catar' },
    ],
};

const LIVE_STRIP = [
    { name: 'DW Español' },
    { name: 'La Nación · LN+' },
    { name: 'Al Jazeera English' },
];
