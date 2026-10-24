/* ============================================================
   ESTALINGRADO BUSCADOR · FUENTE ÚNICA DE DATOS EN VIVO
   Usada por index.html (franja) y envivo.html (grid).
   ============================================================ */

const LIVE_CONFIG = {
  es: [
    { name: 'DW Español', hls: 'https://dwamdstream104.akamaized.net/hls/live/2033394/dw-spanish/index.m3u8', channel: 'DW.de', youtube: 'UCT4Jg8h03dD0iN3Pb5L0PMA', country: 'Alemania' },
    { name: 'La Nación · LN+', hls: null, channel: 'LaNacionPlus.ar', youtube: 'FEWZjXJ7M0c', country: 'Argentina' },
  ],
  en: [
    { name: 'Al Jazeera English', hls: 'https://live-hls-apps-aja-fa.getaj.net/index.m3u8', channel: 'AlJazeera.qa', youtube: 'UCNye-wNBqNL5ZzHSJj3l8Bg', country: 'Catar' },
  ],
};

const LIVE_STRIP = [
  { name: 'DW Español' },
  { name: 'La Nación · LN+' },
  { name: 'Al Jazeera English' },
];
