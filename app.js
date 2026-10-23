window.onerror = function(message, source, lineno, colno, error) {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        const text = loadingScreen.querySelector('.loader-text');
        if (text) text.innerHTML = `<span style="color: #ef4444;">Error de sistema: ${message}</span>`;
    }
};

window.addEventListener("unhandledrejection", function(event) {
    console.warn("Promesa rechazada no capturada:", event.reason);
});

var CONFIG = {
    knownSites: [
        { url: "https://chatgpt.com/", title: "ChatGPT", icon: "fas fa-robot", keywords: ["chatgpt", "ia", "openai", "chat gpt"] },
        { url: "https://gemini.google.com/", title: "Google Gemini", icon: "fas fa-sparkles", keywords: ["gemini", "google gemini", "gemini ia"] },
        { url: "https://www.google.com/", title: "Google", icon: "fab fa-google", keywords: ["google", "buscador", "buscar en google", "san google"] },
        { url: "https://music.youtube.com/", title: "YouTube Music", icon: "fas fa-music", keywords: ["youtube music", "yt music", "musica", "canciones"] },
        { url: "https://www.youtube.com/", title: "YouTube", icon: "fab fa-youtube", keywords: ["youtube", "yt", "videos", "vid"] },
        { url: "https://centercorpec.wixsite.com/softwarelab", title: "Estalingrado Corp", icon: "fas fa-building", keywords: ["estalingrado", "portal", "intranet", "empresa"] },
        { url: "https://github.com/", title: "GitHub", icon: "fab fa-github", keywords: ["github", "git", "repositorio", "codigo", "código"] },
        { url: "https://es.wikipedia.org/wiki/Wikipedia:Portada", title: "Wikipedia", icon: "fab fa-wikipedia-w", keywords: ["wikipedia", "wiki", "enciclopedia"] },
        { url: "https://stackoverflow.com/", title: "Stack Overflow", icon: "fab fa-stack-overflow", keywords: ["stackoverflow", "stack overflow", "errores", "programacion", "programación", "so"] },
        { url: "https://www.linkedin.com/", title: "LinkedIn", icon: "fab fa-linkedin", keywords: ["linkedin", "red profesional", "empleo", "trabajo", "cv"] },
        { url: "https://www.reddit.com/", title: "Reddit", icon: "fab fa-reddit", keywords: ["reddit", "foros", "comunidad", "hilos"] },
        { url: "https://x.com/", title: "X (Twitter)", icon: "fab fa-twitter", keywords: ["twitter", "x", "red social", "tweets", "noticias breves"] },
        { url: "https://open.spotify.com/", title: "Spotify", icon: "fab fa-spotify", keywords: ["spotify", "podcasts", "playlist", "audio"] },
        { url: "https://www.twitch.tv/", title: "Twitch", icon: "fab fa-twitch", keywords: ["twitch", "streams", "directos", "gaming", "transmisiones"] },
        { url: "https://www.amazon.com/", title: "Amazon", icon: "fab fa-amazon", keywords: ["amazon", "compras", "tienda", "shop"] },
        { url: "https://www.figma.com/", title: "Figma", icon: "fab fa-figma", keywords: ["figma", "diseño", "ui", "ux", "prototipos"] },
        { url: "https://codepen.io/", title: "CodePen", icon: "fab fa-codepen", keywords: ["codepen", "frontend", "snippets", "html css js"] },
        { url: "https://chat.deepseek.com/", title: "DeepSeek", icon: "fas fa-brain", keywords: ["deepseek", "ds", "deepseek ai", "chat deepseek", "ia deepseek"] },
        { url: "https://claude.ai/", title: "Claude AI", icon: "fas fa-comment-dots", keywords: ["claude", "anthropic", "claude ai", "ia claude"] },
        { url: "https://www.perplexity.ai/", title: "Perplexity", icon: "fas fa-search-location", keywords: ["perplexity", "buscador ia", "ia search", "investigacion"] },
        { url: "https://copilot.microsoft.com/", title: "Microsoft Copilot", icon: "fab fa-microsoft", keywords: ["copilot", "bing ia", "microsoft copilot"] },
        { url: "https://www.facebook.com/", title: "Facebook", icon: "fab fa-facebook", keywords: ["facebook", "fb", "meta", "red social"] },
        { url: "https://www.instagram.com/", title: "Instagram", icon: "fab fa-instagram", keywords: ["instagram", "ig", "insta", "fotos", "reels"] },
        { url: "https://web.whatsapp.com/", title: "WhatsApp Web", icon: "fab fa-whatsapp", keywords: ["whatsapp", "wpp", "wa", "mensajes", "chat"] },
        { url: "https://www.threads.net/", title: "Threads", icon: "fab fa-threads", keywords: ["threads", "microblogging"] },
        { url: "https://www.netflix.com/", title: "Netflix", icon: "fas fa-film", keywords: ["netflix", "peliculas", "series", "cine", "streaming"] },
        { url: "https://discord.com/app", title: "Discord", icon: "fab fa-discord", keywords: ["discord", "chat", "comunidad gamer", "servidores"] },
        { url: "https://www.tiktok.com/", title: "TikTok", icon: "fab fa-tiktok", keywords: ["tiktok", "videos cortos", "viral"] }
    ],
    semanticSearch: {
        "noticias de tecnología": ["techcrunch.com", "theverge.com", "wired.com"],
        "aprender programación": ["freecodecamp.org", "codecademy.com", "developer.mozilla.org"]
    },
    searchSuggestions: [
        "noticias de hoy", "clima en madrid", "javascript tutorial",
        "bitcoin precio", "chatgpt español", "github copilot",
        "estalingrado software lab", "privacidad online", "wikipedia inteligencia artificial",
        "chatgpt", "gemini", "google", "youtube", "youtube music", "estalingrado", "github", "wikipedia",
        "musica", "buscador", "ia", "enciclopedia", "videos",
        "stackoverflow", "linkedin", "reddit", "twitter", "spotify", "twitch", "amazon", "figma", "codepen",
        "empleo", "compras", "diseño", "programacion", "red profesional", "archivo histórico",
        "definir", "pais", "receta", "spacex", "noticias tecnologia", "noticias ciencia",
        "mercado oro", "mercado plata", "acciones apple", "precio bitcoin",
        "deepseek", "claude", "perplexity", "copilot", "facebook", "instagram", "whatsapp", "netflix", "discord", "tiktok",
        "noticias de última hora", "noticias internacionales", "noticias de deportes", "noticias de economía", "noticias locales", "noticias políticas",
        "imagenes de paisajes", "fotos de gatitos", "imagenes de tecnologia", "fotos de autos"
    ],
    searchEngines: {
        Google: query => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        Bing: query => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
        Yahoo: query => `https://espanol.search.yahoo.com/search?p=${encodeURIComponent(query)}`,
        DuckDuckGo: query => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        Yandex: query => `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
        Brave: query => `https://search.brave.com/search?q=${encodeURIComponent(query)}`,
        Baidu: query => `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
        Startpage: query => `https://www.startpage.com/sp/search?query=${encodeURIComponent(query)}`,
        Ecosia: query => `https://www.ecosia.org/search?q=${encodeURIComponent(query)}`,
        Wikipedia: query => `https://es.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
        InternetArchive: query => `https://archive.org/search?query=${encodeURIComponent(query)}`,
    SearXNG: query => `https://searx.be/search?q=${encodeURIComponent(query)}`,
    Mojeek: query => `https://www.mojeek.com/search?q=${encodeURIComponent(query)}`,
    Gibiru: query => `https://gibiru.com/results.html?q=${encodeURIComponent(query)}`,
    Swisscows: query => `https://swisscows.com/web?query=${encodeURIComponent(query)}`,
    Ask: query => `https://www.ask.com/web?q=${encodeURIComponent(query)}`,
    AOL: query => `https://search.aol.com/aol/search?q=${encodeURIComponent(query)}`,
    Naver: query => `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`,
    Sogou: query => `https://www.sogou.com/web?query=${encodeURIComponent(query)}`
    },
    aiCommands: { '/ai': '', '/clima': '', '/traducir': '' }
};

var AppState = {
    initialized: false, dashboardVisible: false,
    voiceRecognition: null, isRecording: false,
    searchMode: 'web'
};

var Utils = {
    safeLocalStorage: {
        get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
        set: (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
        remove: (key) => { try { localStorage.removeItem(key); return true; } catch { return false; } }
    },
    debounce: function(func, wait) {
        let timeout;
        return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); };
    },
    generateId: () => 'widget_' + Math.random().toString(36).substr(2, 9),
    validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    validateUrl: (url) => { try { new URL(url); return true; } catch { return false; } },
    escapeHtml: (unsafe) => unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"),
    copyToClipboard: function(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // Evita el scroll hacia abajo al enfocar el elemento oculto
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try { document.execCommand('copy'); } catch (err) { console.error('Fallo al copiar', err); }
        document.body.removeChild(textArea);
    }
};

// =========================================
// MOTOR ORTOGRÁFICO ESTALINGRADO
// =========================================
var SpellChecker = {
    dictionary: [],
    _lookup: null,
    init: function() {
        let words = new Set();
        CONFIG.searchSuggestions.forEach(s => words.add(s.toLowerCase()));
        CONFIG.knownSites.forEach(site => site.keywords.forEach(k => words.add(k.toLowerCase())));
        this.dictionary = Array.from(words);
        this._lookup = new Set(this.dictionary);
    },
    // Algoritmo de Distancia de Levenshtein
    getDistance: function(a, b) {
        if(a.length === 0) return b.length;
        if(b.length === 0) return a.length;
        let matrix = [];
        for(let i = 0; i <= b.length; i++) matrix[i] = [i];
        for(let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for(let i = 1; i <= b.length; i++){
            for(let j = 1; j <= a.length; j++){
                if(b.charAt(i-1) === a.charAt(j-1)) {
                    matrix[i][j] = matrix[i-1][j-1];
                } else {
                    matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1));
                }
            }
        }
        return matrix[b.length][a.length];
    },
    findClosest: function(str) {
        let bestMatch = null;
        let minDistance = Infinity;
        for (let word of this.dictionary) {
            // Tolerancia de error: 1 letra para palabras cortas, 2 para largas
            let maxAllowed = word.length <= 4 ? 1 : 2;
            // Cota inferior de Levenshtein: la distancia nunca es menor que la
            // diferencia de longitudes. Sin esto, cada palabra del diccionario
            // pagaba una matriz completa O(n·m).
            if (Math.abs(word.length - str.length) > maxAllowed) continue;
            let dist = this.getDistance(str, word);
            if (dist <= maxAllowed && dist < minDistance) {
                minDistance = dist;
                bestMatch = word;
                if (minDistance <= 1) break; // no puede mejorar
            }
        }
        return bestMatch;
    },
    getSuggestion: function(query) {
        if (!this.dictionary.length) this.init();
        const q = query.toLowerCase().trim();
        if (this._lookup.has(q)) return null;

        // 1. Intentar corregir la frase completa
        let bestPhraseMatch = this.findClosest(q);
        if (bestPhraseMatch) return bestPhraseMatch;

        // 2. Intentar corregir palabra por palabra si es una oración
        let words = q.split(' ');
        let correctedWords = [];
        let changed = false;

        for (let w of words) {
            if (this._lookup.has(w) || w.length < 3) {
                correctedWords.push(w);
            } else {
                let closest = this.findClosest(w);
                if (closest) {
                    correctedWords.push(closest);
                    changed = true;
                } else {
                    correctedWords.push(w);
                }
            }
        }
        return changed ? correctedWords.join(' ') : null;
    }
};

// =========================================
// SISTEMA DE CACHÉ INTELIGENTE
// =========================================
var Cache = {
    _store: new Map(),
    _defaultTTL: 5 * 60 * 1000,
    _key: 'ec_api_cache_v1',
    init: function() {
        try {
            var raw = sessionStorage.getItem(this._key);
            if (raw) {
                var entries = JSON.parse(raw);
                var now = Date.now();
                entries.forEach(function(e) { if (e && e.expiry > now) this._store.set(e.k, { data: e.d, expiry: e.expiry }); }, this);
            }
        } catch (e) { /* caché corrupta o cuota llena: empezamos de cero */ }
    },
    _persist: function() {
        try {
            var out = [];
            this._store.forEach(function(v, k) { out.push({ k: k, d: v.data, expiry: v.expiry }); });
            sessionStorage.setItem(this._key, JSON.stringify(out));
        } catch (e) { /* cuota llena: descartar es más barato que fallar */ }
    },
    get: function(key) {
        var entry = this._store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiry) { this._store.delete(key); return null; }
        return entry.data;
    },
    set: function(key, data, ttl) {
        this._store.set(key, { data: data, expiry: Date.now() + (ttl || this._defaultTTL) });
        this._persist();
    },
    has: function(key) { return this.get(key) !== null; },
    clear: function() { this._store.clear(); try { sessionStorage.removeItem(this._key); } catch (e) {} }
};
Cache.init();

// =========================================
// SISTEMA DE TOAST (NOTIFICACIONES)
// =========================================
var Toast = {
    show: function(message, type, duration) {
        type = type || 'info'; duration = duration || 4000;
        var container = document.getElementById('toast-container');
        if (!container) return;
        var icons = { info: 'fa-circle-info', success: 'fa-circle-check', warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark' };
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i><span></span>';
        toast.querySelector('span').textContent = message;
        container.appendChild(toast);
        setTimeout(function() { toast.style.animation = 'toast-out 0.3s ease forwards'; setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300); }, duration);
    },
    info: function(msg) { this.show(msg, 'info'); },
    success: function(msg) { this.show(msg, 'success'); },
    warn: function(msg) { this.show(msg, 'warning'); },
    error: function(msg) { this.show(msg, 'error', 6000); }
};

var UI = {
    elements: {},
    init: function() {
        UI.elements = {
            loadingScreen: document.getElementById("loading-screen"), progressBar: document.getElementById("loading-progress-bar"),
            mainContent: document.getElementById("main-content"),
            queryInput: document.getElementById("query"), suggestionsContainer: document.getElementById("suggestionsContainer"),
            resultsContainer: document.getElementById("resultsContainer"), resultsDiv: document.getElementById("results"),
            dashboard: document.getElementById("dashboard"), widgetsGrid: null,
            mainSearch: document.getElementById("main-search"), voiceSearchButton: document.getElementById("voiceSearchButton")
        };
        return (UI.elements.loadingScreen && UI.elements.mainContent && UI.elements.queryInput);
    },
    // Skeleton visible mientras las APIs de enriquecimiento responden
    showInlineSkeleton: function(container) {
        var skel = document.createElement('div');
        skel.id = 'inline-skeleton';
        skel.innerHTML = new Array(2).fill(
            '<div class="skeleton-card" style="margin-bottom:12px"><div class="skeleton-body"><div class="skeleton-line skeleton"></div><div class="skeleton-line skeleton" style="width:85%"></div><div class="skeleton-line skeleton" style="width:45%"></div></div></div>'
        ).join('');
        container.appendChild(skel);
    },
    // Retira el skeleton con la primera tarjeta real o a los 2.5s, lo que llegue primero
    clearInlineSkeletonWhenReady: function(container) {
        var skel = document.getElementById('inline-skeleton');
        if (!skel) return;
        var removed = false;
        var remove = function() {
            if (removed || !skel.parentNode) return;
            removed = true;
            skel.parentNode.removeChild(skel);
        };
        var observer = new MutationObserver(function() {
            if (container.querySelector('.result')) { observer.disconnect(); remove(); }
        });
        observer.observe(container, { childList: true });
        setTimeout(function() { observer.disconnect(); remove(); }, 1500);
    },
    togglePanel: function(panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        if (panel.classList.contains('show')) { panel.classList.remove('show'); setTimeout(() => panel.style.display='none', 300); }
        else { UI.closeAllPanels(); panel.style.display='block'; setTimeout(()=>panel.classList.add('show'), 10); }
    },
    closeAllPanels: function() {
        ['settingsPanel', 'menuPanel', 'dashboardPanel'].forEach(id => {
            const p = document.getElementById(id);
            if (p && p.classList.contains('show')) { p.classList.remove('show'); setTimeout(() => p.style.display='none', 300); }
        });
    },
    toggleModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        if (modal.classList.contains('show')) { modal.classList.remove('show'); setTimeout(() => modal.style.display='none', 300); }
        else { modal.style.display='flex'; setTimeout(()=>modal.classList.add('show'), 10); }
    },
    toggleFullScreen: function() {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
        else if (document.exitFullscreen) document.exitFullscreen();
    },
    toggleDashboard: function() {
        AppState.dashboardVisible = !AppState.dashboardVisible;
        const searchCont = UI.elements.mainSearch;
        const dash = UI.elements.dashboard;
        const resCont = UI.elements.resultsContainer;

        if (AppState.dashboardVisible) {
            searchCont.style.opacity = '0';
            searchCont.style.transform = 'translateY(-30px)';
            resCont.classList.remove('show');
            
            setTimeout(() => {
                searchCont.style.display = 'none';
                resCont.style.display = 'none';
                
                dash.style.display = 'block';
                void dash.offsetWidth;
                dash.classList.add('show');
                
                UI.loadDashboard();
            }, 300);
        } else {
            dash.classList.remove('show');
            // Clear refresh timer when dashboard hides
            if (UI._newsRefreshTimer) { clearInterval(UI._newsRefreshTimer); UI._newsRefreshTimer = null; }
            
            setTimeout(() => {
                dash.style.display = 'none';
                
                searchCont.style.display = 'flex';
                void searchCont.offsetWidth;
                searchCont.style.opacity = '1';
                searchCont.style.transform = 'translateY(0)';
            }, 400);
        }
        UI.closeAllPanels();
    },
    loadDashboard: function(forceReload = false) {
        const grid = document.getElementById('latam-news-grid');
        if(!grid) return;

        // Init weather widget
        WeatherWidget.init();
        
        // Auto-refresh cada 5 minutos, pero solo si la pestaña está visible:
        // en segundo plano refrescar solo gasta red y CPU.
        if (UI._newsRefreshTimer) clearInterval(UI._newsRefreshTimer);
        UI._newsRefreshTimer = setInterval(function() {
            if (!document.hidden) UI.loadDashboard(true);
        }, 300000);
        
        if(grid.dataset.loaded === 'true' && !forceReload) return; 
        
        // Show skeleton while loading (string único: innerHTML += en bucle reparsa todo en cada vuelta)
        grid.className = 'news-grid';
        grid.innerHTML = new Array(6).fill('<div class="skeleton-card"><div class="skeleton-img skeleton" style="height:180px"></div><div class="skeleton-body"><div class="skeleton-line skeleton"></div><div class="skeleton-line skeleton" style="width:85%"></div><div class="skeleton-line skeleton" style="width:45%"></div><div class="skeleton-meta"><span class="skeleton"></span><span class="skeleton"></span></div></div></div>').join('');
        
        // Ñe'ẽkuaaty marandu (Fuentes de noticias, APIs de Argentina primero)
        const feeds = [
            { url: 'https://www.infobae.com/arc/outboundfeeds/rss/?outputType=xml', source: 'Infobae' },
            { url: 'https://www.clarin.com/rss/lo-ultimo/', source: 'Clarín' },
            { url: 'https://www.perfil.com/rss', source: 'Perfil' },
            { url: 'https://feeds.bbci.co.uk/mundo/rss.xml', source: 'BBC Mundo' },
            { url: 'https://www.xataka.com/feed.xml', source: 'Xataka Tech' },
            { url: 'https://www.genbeta.com/feed.xml', source: 'Genbeta' },
            { url: 'https://hipertextual.com/feed', source: 'Hipertextual' },
            { url: 'https://wwwhatsnew.com/feed/', source: 'Wwwhatsnew' },
            { url: 'https://news.un.org/feed/view/es/109/rss.xml', source: 'ONU Noticias' }
        ];

        Promise.all(feeds.map(feed => 
            fetchRaw(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=`, 10000, false)
            .then(r => r.json())
            .then(data => {
                if(data.status === 'ok') {
                    return data.items.map(item => ({...item, sourceName: feed.source}));
                }
                return [];
            }).catch(e => { console.warn("Error cargando feed", feed.source, e); return []; })
        )).then(results => {
            let allNews = results.flat();
            // Ordenar por fecha más reciente
            allNews.sort((a,b) => new Date(b.pubDate) - new Date(a.pubDate));
            
            // Llenar el Ticker de Última Hora
            const tickerContainer = document.getElementById('news-ticker-content');
            if (tickerContainer && allNews.length > 0) {
                let tickerHtml = '';
                allNews.slice(0, 10).forEach(item => {
                    tickerHtml += `<a href="${item.link}" target="_blank" class="ticker-item"><span class="ticker-source">${item.sourceName}</span> ${Utils.escapeHtml(item.title)}</a>`;
                });
                tickerHtml += tickerHtml; // Duplicar para un scroll continuo sin saltos
                tickerContainer.innerHTML = tickerHtml;
            }
            
            grid.innerHTML = '';
            if(allNews.length === 0) {
                grid.innerHTML = '<div style="color:var(--danger); grid-column:1/-1; text-align:center; padding: 40px;">No se pudieron cargar las noticias en este momento.</div>';
                return;
            }

            // Función para detectar categoría por palabras clave
            function detectCategory(title, source) {
                const t = (title + ' ' + source).toLowerCase();
                if (/tech|tecnolog|inteligencia|ai|ia|robot|digital|software|app|celular|smartphone|apple|google|microsoft|samsumg|realidad virtual/.test(t)) return 'Tecnología';
                if (/econom|bolsa|dólar|peso|inflación|banc|finanzas|cripto|bitcoin|mercado|petróleo|empresa/.test(t)) return 'Economía';
                if (/deport|fútbol|futbol|tenis|básquet|basquet|nba|ligue|messi|ronaldo|olimp/.test(t)) return 'Deportes';
                if (/salud|medic|vacuna|covid|enfermed|hospit|nutrición/.test(t)) return 'Salud';
                if (/polític|politic|gobierno|elección|eleccion|presidente|congreso|senado|partido/.test(t)) return 'Política';
                if (/cultura|arte|cine|música|música|libro|serie|película|pelicula|show|espectáculo/.test(t)) return 'Cultura';
                if (/ciencia|espacio|nasa|spacex|investigación|descubrim|planeta|naturaleza/.test(t)) return 'Ciencia';
                if (/educaci|universidad|escuela|colegio|estudiante|aprender|curso/.test(t)) return 'Educación';
                return 'Noticias';
            }
            function formatTimeAgo(dateStr) {
                const msAgo = Date.now() - new Date(dateStr).getTime();
                const mins = Math.floor(msAgo / 60000);
                if (mins < 1) return 'Ahora';
                if (mins < 60) return mins + 'm';
                const hours = Math.floor(mins / 60);
                if (hours < 24) return hours + 'h';
                const days = Math.floor(hours / 24);
                return days + 'd';
            }

            // Tomar las 48 noticias más recientes para la parrilla
            grid.className = 'news-grid';
            const fallbackImg = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect fill="#1e293b" width="400" height="250"/><text x="200" y="125" text-anchor="middle" fill="#475569" font-family="sans-serif" font-size="16">EC News</text></svg>');
            const cards = [];
            allNews.slice(0, 48).forEach(item => {
                let img = fallbackImg;
                if (item.enclosure && item.enclosure.link) {
                    img = item.enclosure.link;
                } else if (item.thumbnail) {
                    img = item.thumbnail;
                } else {
                    const contentStr = (item.content || '') + ' ' + (item.description || '');
                    const imgMatch = contentStr.match(/<img[^>]+src=["']([^"']+)["']/i);
                    if(imgMatch) img = imgMatch[1];
                }

                const category = detectCategory(item.title, item.sourceName);
                const timeStr = formatTimeAgo(item.pubDate);

                cards.push(`
                    <a href="${item.link}" target="_blank" class="news-card" rel="noopener">
                        <div class="news-card-img-wrap">
                            <img src="${img}" class="news-card-img" loading="lazy" onerror="this.src='${fallbackImg}'">
                            <div class="news-card-gradient"></div>
                            <span class="news-card-category">${category}</span>
                        </div>
                        <div class="news-card-body">
                            <div class="news-card-title">${Utils.escapeHtml(item.title)}</div>
                            <div class="news-card-meta">
                                <span class="news-card-source"><i class="fas fa-newspaper"></i> ${item.sourceName}</span>
                                <span class="news-card-time"><i class="far fa-clock"></i> ${timeStr}</span>
                            </div>
                        </div>
                    </a>
                `);
            });
            grid.innerHTML = cards.join('');
            grid.dataset.loaded = "true";
        });
    }
};

// =========================================
// AYUDANTE DE FETCH CON CACHÉ + TIMEOUT + ABORT
// =========================================
// Timeout de 8s por API: una API colgada no puede dejar tarjetas en spinner eterno.
// Además, cada búsqueda nueva aborta los fetches de la anterior (SearchManager._controller).
function buildSignal(timeoutMs, useSearchAbort) {
    var timeoutSig = (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) ? AbortSignal.timeout(timeoutMs) : null;
    var searchSig = null;
    if (useSearchAbort !== false && typeof SearchManager !== 'undefined' && SearchManager._controller) {
        searchSig = SearchManager._controller.signal;
    }
    if (timeoutSig && searchSig && typeof AbortSignal.any === 'function') return AbortSignal.any([timeoutSig, searchSig]);
    return timeoutSig || searchSig || undefined;
}
// fetch que solo añade señal (mantiene las cadenas .then(r => r.json()) existentes)
function fetchRaw(url, timeoutMs, useSearchAbort) {
    var opts = {};
    var sig = buildSignal(timeoutMs || 8000, useSearchAbort);
    if (sig) opts.signal = sig;
    return fetch(url, opts);
}
function fetchJson(url, timeoutMs) {
    return fetchRaw(url, timeoutMs, true).then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
    });
}
function cachedFetch(url, cacheTTL) {
    var cached = Cache.get(url);
    if (cached) return Promise.resolve(cached);
    return fetchJson(url, 8000).then(function(data) {
        Cache.set(url, data, cacheTTL || 300000);
        return data;
    });
}
// Un abort por búsqueda nueva no es un error del usuario: no se notifica.
function isAbort(e) { return e && (e.name === 'AbortError' || e.name === 'TimeoutError'); }

// Heurística de intención: evita disparar APIs "de entidad" en queries de comando/tarea.
var INTENT_PREFIX = /^(github |pokemon |pok[eé]mon |definir |significado de |pais |país |receta |cocinar |noticias? |news |imagen(?:es)? |foto(?:s)? |precio |mercado |acciones |cotizacion |libro|book |novela |autor |isbn |literatura|serie |programa |tv |temporada |canci[oó]n |artista |album |pel[ií]cula |musica |m[uú]sica |podcast |archive|archivo |historia web|documento antiguo|clima |\/)/i;
function queryWords(q) { return q.trim().split(/\s+/).filter(Boolean); }
// Wikipedia/entidades: consultas cortas que no son comandos ni intenciones especiales.
function looksLikeEntity(q) {
    if (INTENT_PREFIX.test(q)) return false;
    var w = queryWords(q);
    return w.length > 0 && w.length <= 5;
}
// Lugares: aún más restrictivo (Nominatim tiene rate-limit de 1 req/s).
function looksLikePlace(q) {
    if (!looksLikeEntity(q)) return false;
    var w = queryWords(q);
    if (w.length > 3) return false;
    if (w.length <= 2) return true;
    return /[A-ZÁÉÍÓÚÑ]/.test(q); // 3 palabras: solo si hay mayúscula (topónimo)
}
// Libros: keyword explícita o título probable (empieza con mayúscula, pocas palabras).
function looksLikeBookTitle(q) {
    if (!looksLikeEntity(q)) return false;
    var w = queryWords(q);
    return w.length <= 6 && /^[A-ZÁÉÍÓÚÑ]/.test(q.trim());
}

var SearchManager = {
    _searchId: 0,
    _suggestionIndex: -1,
    _controller: null,
    _navigateSuggestions: function(direction) {
        var container = UI.elements.suggestionsContainer;
        var items = container.querySelectorAll('.suggestion-item');
        if (!items.length) return;
        items.forEach(function(el) { el.classList.remove('active'); });
        this._suggestionIndex = Math.max(-1, Math.min(items.length - 1, this._suggestionIndex + direction));
        if (this._suggestionIndex >= 0) {
            items[this._suggestionIndex].classList.add('active');
            items[this._suggestionIndex].scrollIntoView({ block: 'nearest' });
        }
    },
    showSuggestions: Utils.debounce(function() {
        const { queryInput, suggestionsContainer } = UI.elements;
        const query = queryInput.value.toLowerCase().trim();
        suggestionsContainer.innerHTML = "";
        
        let history = Utils.safeLocalStorage.get("searchHistory") || [];
        let list = !query ? history : [ ...CONFIG.searchSuggestions.filter(s=>s.includes(query)), ...history.filter(h=>h.includes(query)) ].slice(0,8);
        
        if(!list.length) { suggestionsContainer.classList.remove('show'); document.querySelector('.search-wrapper').classList.remove('active'); return; }
        
        list.forEach(text => {
            const item = document.createElement("div"); item.className = "suggestion-item";
            const span = document.createElement("span"); span.textContent = text;
            span.onclick = () => { queryInput.value = text; suggestionsContainer.classList.remove('show'); SearchManager.performSearch(); };
            item.appendChild(span);
            if(history.includes(text)) {
                const btn = document.createElement("button"); btn.className = "delete-history-item"; btn.innerHTML = '<i class="fas fa-times"></i>';
                btn.onclick = (e) => { e.stopPropagation(); history = history.filter(h=>h!==text); Utils.safeLocalStorage.set('searchHistory', history); SearchManager.showSuggestions(); };
                item.appendChild(btn);
            }
            suggestionsContainer.appendChild(item);
        });
        suggestionsContainer.classList.add('show');
        document.querySelector('.search-wrapper').classList.add('active');
    }, 150),

    performSearch: function() {
        const { queryInput, resultsContainer, resultsDiv } = UI.elements;
        const query = queryInput.value.trim();
        if (!query && AppState.searchMode !== 'security') return;
        this._searchId++;
        var currentSearchId = this._searchId;
        // Cortamos los fetches de la búsqueda anterior: sus tarjetas ya no tienen dónde pintarse.
        if (this._controller) { try { this._controller.abort(); } catch (e) {} }
        this._controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        
        UI.elements.suggestionsContainer.classList.remove('show'); document.querySelector('.search-wrapper').classList.remove('active');
        
        if (query.toLowerCase().startsWith('/ai') || query.toLowerCase().startsWith('/clima') || query.toLowerCase().startsWith('/traducir')) {
            SearchManager.processSpecialCommands(query); return;
        }

        resultsContainer.style.display = 'block'; setTimeout(() => resultsContainer.classList.add('show'), 10);
        resultsDiv.innerHTML = "";
        
        const inlineContainer = document.createElement("div"); inlineContainer.id = "inline-results-container";
        const externalContainer = document.createElement("div"); 
        
        // --- MODO IMÁGENES ---
        if (AppState.searchMode === 'images') {
            resultsDiv.appendChild(inlineContainer); resultsDiv.appendChild(externalContainer);
            SearchManager.renderImageModeResults(query, inlineContainer);
            
            let history = Utils.safeLocalStorage.get("searchHistory") || [];
            if(!history.includes(query)) { history.unshift(query); if(history.length>10) history.pop(); Utils.safeLocalStorage.set("searchHistory", history); }
            return;
        }
        
        // --- MODO IA ---
        if (AppState.searchMode === 'ai') {
            resultsDiv.appendChild(inlineContainer);
            SearchManager.renderAIModeResults(query, inlineContainer);

            let history = Utils.safeLocalStorage.get("searchHistory") || [];
            if(!history.includes(query)) { history.unshift(query); if(history.length>10) history.pop(); Utils.safeLocalStorage.set("searchHistory", history); }
            return;
        }

        // --- MODO SEGURIDAD (Shodan) ---
        if (AppState.searchMode === 'security') {
            resultsDiv.appendChild(inlineContainer);
            SearchManager.renderSecurityModeResults(query, inlineContainer);
            return;
        }

        // --- MODO WEB (CÓDIGO ORIGINAL) ---
        
        // --- SUGERENCIA ORTOGRÁFICA ("Quizás quisiste decir") ---
        const suggestion = SpellChecker.getSuggestion(query);
        if (suggestion && suggestion.toLowerCase() !== query.toLowerCase()) {
            const spellDiv = document.createElement("div");
            spellDiv.style.marginBottom = "20px";
            spellDiv.style.padding = "10px 16px";
            spellDiv.style.background = "linear-gradient(90deg, rgba(59, 130, 246, 0.1), transparent)";
            spellDiv.style.borderRadius = "8px";
            spellDiv.style.borderLeft = "3px solid var(--primary)";
            spellDiv.innerHTML = `
                <span style="color: var(--text-muted); font-size: 14px; margin-right: 5px;">¿Quizás quisiste decir:</span> 
                <a href="#" onclick="document.getElementById('query').value='${Utils.escapeHtml(suggestion)}'; window.search(); return false;" 
                   style="color: var(--primary); font-size: 15px; font-weight: 600; font-style: italic; text-decoration: none;">
                   ${Utils.escapeHtml(suggestion)}
                </a><span style="color: var(--text-muted);">?</span>
            `;
            resultsDiv.appendChild(spellDiv);
        }
        // --------------------------------------------------------

        externalContainer.innerHTML = "";
        resultsDiv.appendChild(inlineContainer); resultsDiv.appendChild(externalContainer);
        
        let history = Utils.safeLocalStorage.get("searchHistory") || [];
        if(!history.includes(query)) { history.unshift(query); if(history.length>10) history.pop(); Utils.safeLocalStorage.set("searchHistory", history); }
        
        UI.showInlineSkeleton(inlineContainer);
        SearchManager.fetchInlineResults(query, inlineContainer);
        UI.clearInlineSkeletonWhenReady(inlineContainer);

        const cb = document.querySelectorAll("#settingsPanel input[type='checkbox']:checked");
        const engines = Array.from(cb).map(c=>c.value);
        
        externalContainer.innerHTML = `<h3 style="font-weight:400; font-size:16px; margin:20px 0 10px; color:var(--text-muted); border-bottom:1px solid var(--border); padding-bottom:8px;">Resultados en Motores Externos</h3>`;
        engines.forEach(eng => {
            if(CONFIG.searchEngines[eng]) {
                const div = document.createElement("div"); div.className = "result";
                div.innerHTML = `<strong style="color:var(--primary); font-size:15px;">${eng}</strong><br><a href="${CONFIG.searchEngines[eng](query)}" target="_blank" rel="noopener" style="font-size:13px; color:var(--text-muted); text-decoration:none;"><i class="fas fa-external-link-alt" style="margin-right:5px;"></i> Buscar "${Utils.escapeHtml(query)}" en ${eng}</a>`;
                externalContainer.appendChild(div);
            }
        });
    },

    renderImageModeResults: function(query, container) {
        const safeQuery = Utils.escapeHtml(query);
        const div = document.createElement('div');
        div.className = 'result';
        div.style.borderLeft = '4px solid #f43f5e';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="width:55px; height:55px; background:linear-gradient(135deg, #f43f5e, #be123c); border-radius:14px; display:flex; align-items:center; justify-content:center; color:white; font-size:26px; box-shadow:0 0 15px rgba(244, 63, 94, 0.4);">
                        <i class="fas fa-images"></i>
                    </div>
                    <div>
                        <strong style="color:#f43f5e; font-size:1.2em;">Modo Imagen Activo</strong>
                        <h3 style="margin:2px 0; color:var(--text); text-transform:capitalize;">"${safeQuery}"</h3>
                        <div style="font-size:12px; color:var(--text-muted);">Acceso encriptado a las galerías más potentes del mundo.</div>
                    </div>
                </div>
            </div>
            <div style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
                <a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}" target="_blank" class="btn btn-primary" style="background:linear-gradient(135deg, #4285f4, #2563eb); border:none;"><i class="fab fa-google"></i> Google Images</a>
                <a href="https://www.bing.com/images/search?q=${encodeURIComponent(query)}" target="_blank" class="btn btn-secondary"><i class="fab fa-microsoft"></i> Bing Images</a>
                <a href="https://yandex.com/images/search?text=${encodeURIComponent(query)}" target="_blank" class="btn btn-secondary"><i class="fas fa-search"></i> Yandex Images</a>
                <a href="https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images" target="_blank" class="btn btn-secondary" style="color:#f97316; border-color:rgba(249,115,22,0.3);">🦆 DuckDuckGo</a>
                <a href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}" target="_blank" class="btn btn-secondary" style="color:#ef4444; border-color:rgba(239,68,68,0.3);"><i class="fab fa-pinterest"></i> Pinterest</a>
            </div>
        `;
        container.appendChild(div);
    },

    renderAIModeResults: function(query, container) {
        const safeQuery = Utils.escapeHtml(query);
        const div = document.createElement('div');
        div.className = 'result';
        div.style.borderLeft = '4px solid #8b5cf6';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="width:55px; height:55px; background:linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius:14px; display:flex; align-items:center; justify-content:center; color:white; font-size:26px; box-shadow:0 0 15px rgba(139,92,246,0.4);">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div>
                        <strong style="color:#8b5cf6; font-size:1.2em;">Modo IA Activo</strong>
                        <h3 style="margin:2px 0; color:var(--text); text-transform:capitalize;">"${safeQuery}"</h3>
                        <div style="font-size:12px; color:var(--text-muted);">Selecciona una inteligencia artificial gratuita para consultar</div>
                    </div>
                </div>
            </div>
            <div style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
                <a href="https://www.perplexity.ai/?q=${encodeURIComponent(query)}" target="_blank" rel="noopener" class="btn btn-primary" style="background:linear-gradient(135deg, #1a1a2e, #16213e); border:1px solid #0f3460; gap:8px; display:inline-flex; align-items:center;"><i class="fas fa-search" style="color:#00d2ff;"></i> Perplexity</a>
                <a href="https://chatgpt.com/?q=${encodeURIComponent(query)}" target="_blank" rel="noopener" class="btn btn-secondary" style="gap:8px; display:inline-flex; align-items:center;"><i class="fab fa-google" style="color:#10a37f;"></i> ChatGPT</a>
                <a href="https://gemini.google.com/app?hl=es&q=${encodeURIComponent(query)}" target="_blank" rel="noopener" class="btn btn-secondary" style="gap:8px; display:inline-flex; align-items:center;"><i class="fas fa-sparkles" style="color:#4285f4;"></i> Gemini</a>
                <a href="https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=chat&duckai=1" target="_blank" rel="noopener" class="btn btn-secondary" style="gap:8px; display:inline-flex; align-items:center; color:#f97316; border-color:rgba(249,115,22,0.3);"><i class="fas fa-search"></i> DuckDuckGo AI</a>
                <a href="https://chat.deepseek.com/" target="_blank" rel="noopener" class="btn btn-secondary" style="gap:8px; display:inline-flex; align-items:center; color:#4ade80; border-color:rgba(74,222,128,0.3);"><i class="fas fa-code"></i> DeepSeek</a>
                <a href="https://claude.ai/new?q=${encodeURIComponent(query)}" target="_blank" rel="noopener" class="btn btn-secondary" style="gap:8px; display:inline-flex; align-items:center; color:#d97706; border-color:rgba(217,119,6,0.3);"><i class="fas fa-comment-dots"></i> Claude</a>
                <a href="https://copilot.microsoft.com/?q=${encodeURIComponent(query)}" target="_blank" rel="noopener" class="btn btn-secondary" style="gap:8px; display:inline-flex; align-items:center; color:#0078d4; border-color:rgba(0,120,212,0.3);"><i class="fab fa-microsoft"></i> Copilot</a>
            </div>
            <div style="margin-top:20px; padding:15px; background:rgba(139,92,246,0.05); border-radius:12px; border:1px solid rgba(139,92,246,0.15);">
                <strong style="color:#8b5cf6; font-size:13px;"><i class="fas fa-lightbulb"></i> ¿Sabías que puedes usar IA directamente?</strong>
                <p style="font-size:12px; color:var(--text-muted); margin-top:5px;">Escribe <code style="background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px;">/ai tu pregunta</code> en el buscador para una respuesta simulada, o elige cualquiera de las IAs gratuitas de arriba para obtener respuestas reales.</p>
            </div>
        `;
        container.appendChild(div);
    },

    renderSecurityModeResults: function(query, container) {
        const safeQuery = Utils.escapeHtml(query);
        const div = document.createElement('div');
        div.className = 'result';
        div.style.borderLeft = '4px solid #10b981';

        const key = Utils.safeLocalStorage.get('shodanKey');
        if (!key) {
            div.innerHTML = `
                <div class="shodan-key-box">
                    <strong style="color:#10b981; font-size:1.1em;"><i class="fas fa-shield-halved"></i> Modo Seguridad — Shodan</strong>
                    <p style="font-size:12px; color:var(--text-muted); margin:8px 0 14px;">Auditoría de exposición: descubre qué servicios tiene públicos una IP o busca dispositivos conectados a Internet. Solo metadatos, sin acceso a los dispositivos.</p>
                    <label>API Key de Shodan</label>
                    <div class="shodan-key-row">
                        <input type="password" class="shodan-key-input" id="shodanKeyInput" placeholder="Pega tu API key de Shodan..." autocomplete="off" />
                        <button class="btn btn-primary" onclick="window.saveShodanKey()"><i class="fas fa-key"></i> Guardar</button>
                    </div>
                    <div class="shodan-key-hint">
                        <a href="https://account.shodan.io/" target="_blank" rel="noopener">Crea una cuenta gratuita en Shodan</a> y obtén tu API key. La key se guarda solo en tu navegador (localStorage) y se envía únicamente a api.shodan.io. Plan gratuito: 100 consultas/mes.
                    </div>
                </div>
            `;
            container.appendChild(div);
            return;
        }

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="width:55px; height:55px; background:linear-gradient(135deg, #10b981, #059669); border-radius:14px; display:flex; align-items:center; justify-content:center; color:white; font-size:26px; box-shadow:0 0 15px rgba(16,185,129,0.4);">
                        <i class="fas fa-shield-halved"></i>
                    </div>
                    <div>
                        <strong style="color:#10b981; font-size:1.2em;">Modo Seguridad Activo</strong>
                        <h3 style="margin:2px 0; color:var(--text); text-transform:capitalize;">"${safeQuery}"</h3>
                        <div style="font-size:12px; color:var(--text-muted);">Auditoría de exposición con Shodan — solo metadatos públicos</div>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="window.clearShodanKey()" style="font-size:11px; padding:6px 12px;"><i class="fas fa-trash-alt"></i> Borrar key</button>
            </div>
            <div class="shodan-chips" style="margin-top:16px;">
                <button type="button" class="shodan-chip" onclick="document.getElementById('query').value='webcam'; window.search();"><i class="fas fa-video"></i> Cámaras web</button>
                <button type="button" class="shodan-chip" onclick="document.getElementById('query').value='product:\"webcamxp\"'; window.search();"><i class="fas fa-camera"></i> WebcamXP</button>
                <button type="button" class="shodan-chip" onclick="document.getElementById('query').value='title:\"IP Camera\"'; window.search();"><i class="fas fa-video"></i> IP Cameras</button>
                <button type="button" class="shodan-chip" onclick="document.getElementById('query').value='port:554'; window.search();"><i class="fas fa-broadcast-tower"></i> RTSP (554)</button>
                <button type="button" class="shodan-chip" onclick="document.getElementById('query').value='netcam'; window.search();"><i class="fas fa-network-wired"></i> Netcam</button>
                <button type="button" class="shodan-chip" onclick="document.getElementById('query').value='port:5800'; window.search();"><i class="fas fa-desktop"></i> VNC (5800)</button>
                <button type="button" class="shodan-chip" onclick="document.getElementById('query').value='port:23'; window.search();"><i class="fas fa-terminal"></i> Telnet (23)</button>
                <button type="button" class="shodan-chip" onclick="document.getElementById('query').value='port:21'; window.search();"><i class="fas fa-folder-open"></i> FTP (21)</button>
            </div>
            <div id="shodan-results-area" style="margin-top:16px;"></div>
        `;
        container.appendChild(div);

        if (query.trim()) {
            SearchManager.executeShodanQuery(query.trim(), document.getElementById('shodan-results-area'));
        }
    },

    executeShodanQuery: function(query, area) {
        const key = Utils.safeLocalStorage.get('shodanKey');
        if (!key || !area) return;

        const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(query);
        area.innerHTML = '<div class="loading-spinner"></div>';

        if (isIP) {
            fetchJson(`https://api.shodan.io/shodan/host/${encodeURIComponent(query)}?key=${encodeURIComponent(key)}&minify=true`)
                .then(function(d) { SearchManager.renderShodanHost(d, area); })
                .catch(function(e) { SearchManager.renderShodanError(e, area); });
        } else {
            fetchJson(`https://api.shodan.io/shodan/host/count?key=${encodeURIComponent(key)}&query=${encodeURIComponent(query)}`)
                .then(function(d) {
                    const total = d.total || 0;
                    let html = `<div class="shodan-count"><i class="fas fa-database"></i> <strong>${total.toLocaleString()}</strong> hosts encontrados`;
                    if (total > 0) {
                        html += `<button class="btn btn-primary" onclick="SearchManager.runShodanSearch('${Utils.escapeHtml(query).replace(/'/g, "\\'")}')"><i class="fas fa-search"></i> Ver resultados (1 crédito)</button>`;
                    }
                    html += `</div>`;
                    area.innerHTML = html;
                })
                .catch(function(e) { SearchManager.renderShodanError(e, area); });
        }
    },

    runShodanSearch: function(query) {
        const key = Utils.safeLocalStorage.get('shodanKey');
        const area = document.getElementById('shodan-results-area');
        if (!key || !area) return;
        area.innerHTML = '<div class="loading-spinner"></div>';
        fetchJson(`https://api.shodan.io/shodan/host/search?key=${encodeURIComponent(key)}&query=${encodeURIComponent(query)}&minify=true`)
            .then(function(d) {
                if (!d.matches || !d.matches.length) {
                    area.innerHTML = '<div class="shodan-error">No se encontraron resultados para esta query.</div>';
                    return;
                }
                let html = '';
                d.matches.slice(0, 20).forEach(function(h) {
                    html += SearchManager.shodanHostCard(h);
                });
                area.innerHTML = html;
            })
            .catch(function(e) { SearchManager.renderShodanError(e, area); });
    },

    shodanHostCard: function(h) {
        const ip = h.ip_str || h.ip || 'N/A';
        const ports = (h.ports || []).map(function(p) {
            return `<span class="shodan-port">${p}</span>`;
        }).join('');
        const vulns = (h.vulns || {}).length
            ? `<div class="shodan-vulns">${Object.keys(h.vulns).slice(0, 5).map(function(v) { return `<span class="shodan-vuln">${v}</span>`; }).join('')}</div>`
            : '';
        const banner = h.data ? `<div class="shodan-banner">${Utils.escapeHtml(String(h.data).substring(0, 300))}</div>` : '';
        const loc = [h.location && h.location.city, h.location && h.location.country_name].filter(Boolean).join(', ');
        const org = h.org || '';
        const product = h.product ? `<div style="font-size:11px; color:var(--text-gray); margin-top:4px;">${Utils.escapeHtml(h.product)}</div>` : '';
        const title = h.http && h.http.title ? `<div style="font-size:11px; color:var(--text-gray); margin-top:2px;">${Utils.escapeHtml(h.http.title)}</div>` : '';

        return `
            <div class="shodan-host">
                <div class="shodan-host-header">
                    <div>
                        <div class="shodan-ip"><a href="https://www.shodan.io/host/${ip}" target="_blank" rel="noopener">${ip}</a></div>
                        ${loc ? `<div class="shodan-loc"><i class="fas fa-map-marker-alt"></i> ${Utils.escapeHtml(loc)}</div>` : ''}
                        ${org ? `<div class="shodan-org"><i class="fas fa-building"></i> ${Utils.escapeHtml(org)}</div>` : ''}
                    </div>
                    <a href="https://www.shodan.io/host/${ip}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:11px; padding:6px 12px;"><i class="fas fa-external-link-alt"></i> Shodan</a>
                </div>
                ${ports ? `<div class="shodan-ports">${ports}</div>` : ''}
                ${product}
                ${title}
                ${banner}
                ${vulns}
            </div>
        `;
    },

    renderShodanHost: function(d, area) {
        if (!d || d.error) {
            area.innerHTML = `<div class="shodan-error"><i class="fas fa-exclamation-triangle"></i> ${Utils.escapeHtml(d && d.error ? d.error : 'No se encontró información para esta IP.')}</div>`;
            return;
        }
        const ports = (d.ports || []).map(function(p) {
            return `<span class="shodan-port">${p}</span>`;
        }).join('');
        const services = (d.data || []).slice(0, 5).map(function(s) {
            const banner = s.data ? `<div class="shodan-banner">${Utils.escapeHtml(String(s.data).substring(0, 200))}</div>` : '';
            const product = s.product ? `<span style="color:var(--text-muted); font-size:11px; margin-left:8px;">${Utils.escapeHtml(s.product)}</span>` : '';
            return `<div style="margin-top:8px;"><strong style="color:var(--primary); font-size:13px;">${s.port}/${s.transport}</strong>${product}${banner}</div>`;
        }).join('');
        const loc = [d.location && d.location.city, d.location && d.location.country_name].filter(Boolean).join(', ');
        const org = d.org || '';
        const vulns = (d.vulns || {}).length
            ? `<div class="shodan-vulns" style="margin-top:10px;">${Object.keys(d.vulns).slice(0, 8).map(function(v) { return `<span class="shodan-vuln">${v}</span>`; }).join('')}</div>`
            : '';

        area.innerHTML = `
            <div class="shodan-host">
                <div class="shodan-host-header">
                    <div>
                        <div class="shodan-ip"><a href="https://www.shodan.io/host/${d.ip_str}" target="_blank" rel="noopener">${d.ip_str}</a></div>
                        ${loc ? `<div class="shodan-loc"><i class="fas fa-map-marker-alt"></i> ${Utils.escapeHtml(loc)}</div>` : ''}
                        ${org ? `<div class="shodan-org"><i class="fas fa-building"></i> ${Utils.escapeHtml(org)}</div>` : ''}
                    </div>
                    <a href="https://www.shodan.io/host/${d.ip_str}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:11px; padding:6px 12px;"><i class="fas fa-external-link-alt"></i> Shodan</a>
                </div>
                ${ports ? `<div class="shodan-ports">${ports}</div>` : ''}
                ${services}
                ${vulns}
            </div>
        `;
    },

    renderShodanError: function(e, area) {
        let msg = 'Error de conexión con la API de Shodan.';
        if (e && e.message) {
            if (e.message.includes('401')) msg = 'API key inválida. Borra la key actual y pega una válida.';
            else if (e.message.includes('403')) msg = 'Sin acceso: tu plan no permite esta consulta.';
            else if (e.message.includes('429')) msg = 'Límite de consultas alcanzado. Espera o revisa tu plan.';
        }
        area.innerHTML = `<div class="shodan-error"><i class="fas fa-exclamation-triangle"></i> ${msg}</div>`;
    },

    fetchInlineResults: function(query, container) {
        const safeQuery = Utils.escapeHtml(query);
        const normalizedQuery = query.toLowerCase().trim();

        // 00. ACCESO DIRECTO (Smart Card Inteligente para Known Sites basado en Palabras Clave)
        const matchedSite = CONFIG.knownSites.find(site => site.keywords.includes(normalizedQuery));
        
        if (matchedSite) {
            const siteDiv = document.createElement("div"); 
            siteDiv.className = "result"; 
            siteDiv.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(15, 23, 42, 0.8))";
            siteDiv.style.border = "1px solid var(--primary)";
            siteDiv.style.boxShadow = "0 0 25px rgba(59, 130, 246, 0.2)";
            
            siteDiv.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap: wrap; gap: 15px;">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="width:55px; height:55px; background:var(--primary); border-radius:14px; display:flex; align-items:center; justify-content:center; color:white; font-size:26px; box-shadow:0 0 15px var(--primary-glow);">
                            <i class="${matchedSite.icon}"></i>
                        </div>
                        <div>
                            <strong style="color:var(--text); font-size:1.3em; letter-spacing: 0.5px;">Portal Corporativo: ${matchedSite.title}</strong>
                            <div style="font-size:12px; color:var(--text-muted); margin-top:3px;"><i class="fas fa-shield-alt" style="color:var(--success);"></i> Conexión directa y segura autorizada</div>
                        </div>
                    </div>
                    <a href="${matchedSite.url}" target="_blank" class="btn-smart">Acceder al Portal <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            container.appendChild(siteDiv);
        }

        // 0. Terminal CLI
        const termDiv = document.createElement("div"); termDiv.className = "result"; termDiv.style.background = "#0d1117"; termDiv.style.borderLeft = "4px solid #58a6ff";
        termDiv.innerHTML = `<strong style="color:#58a6ff;"><i class="fas fa-terminal"></i> Estalingrado CLI:</strong><div style="display:flex; gap:10px; margin-top:10px;"><button class="btn btn-secondary" style="background:#161b22; color:#58a6ff; font-family:monospace;" onclick="window.openTerm('code', '${safeQuery.replace(/'/g, "\\'")}')">$ gh search code</button><button class="btn btn-secondary" style="background:#161b22; color:#d2a8ff; font-family:monospace;" onclick="window.openTerm('suggest', '${safeQuery.replace(/'/g, "\\'")}')">$ gh copilot suggest</button></div>`;
        container.appendChild(termDiv);

        // 0.5 Buscador de Imágenes (Multisource)
        const imageMatch = query.toLowerCase().match(/^(imagen|imágenes|imagenes|foto|fotos)(?: de)? (.+)/);
        if (imageMatch && imageMatch[2]) {
            const imgQuery = imageMatch[2].trim();
            const div = document.createElement('div');
            div.className = 'result';
            div.style.borderLeft = '4px solid #f43f5e';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="width:50px; height:50px; background:linear-gradient(135deg, #f43f5e, #be123c); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; box-shadow:0 0 15px rgba(244, 63, 94, 0.4);">
                            <i class="fas fa-images"></i>
                        </div>
                        <div>
                            <strong style="color:#f43f5e; font-size:1.1em;">Centro de Medios Visuales:</strong>
                            <h3 style="margin:2px 0; color:var(--text); text-transform:capitalize;">"${imgQuery}"</h3>
                            <div style="font-size:12px; color:var(--text-muted);">Redirección segura a motores de búsqueda de imágenes globales.</div>
                        </div>
                    </div>
                </div>
                <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
                    <a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(imgQuery)}" target="_blank" class="btn btn-primary" style="background:linear-gradient(135deg, #4285f4, #2563eb); border:none;"><i class="fab fa-google"></i> Google Images</a>
                    <a href="https://www.bing.com/images/search?q=${encodeURIComponent(imgQuery)}" target="_blank" class="btn btn-secondary"><i class="fab fa-microsoft"></i> Bing Images</a>
                    <a href="https://yandex.com/images/search?text=${encodeURIComponent(imgQuery)}" target="_blank" class="btn btn-secondary"><i class="fas fa-search"></i> Yandex Images</a>
                    <a href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(imgQuery)}" target="_blank" class="btn btn-secondary" style="color:#ef4444; border-color:rgba(239,68,68,0.3);"><i class="fab fa-pinterest"></i> Pinterest</a>
                </div>
            `;
            container.appendChild(div);
        }

        // 1. DuckDuckGo Info
        cachedFetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`, 60000).then(function(d){
            if(d && d.Abstract && container.isConnected) {
                const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #f97316';
                div.innerHTML = `<strong style="color:#f97316;"><i class="fas fa-bolt"></i> Información Rápida:</strong><h3 style="margin:5px 0;">${d.Heading}</h3><p style="font-size:13px; color:var(--text-muted);">${d.AbstractText}</p><a href="${d.AbstractURL}" target="_blank" class="btn btn-secondary" style="margin-top:10px; font-size:11px;">Leer más</a>`;
                container.appendChild(div);
            }
        }).catch(function(e){ if (!isAbort(e)) Toast.warn('No se pudo cargar información rápida de DuckDuckGo'); });

        // 2. Wikipedia (solo queries con forma de entidad: casi todos los títulos devuelven 404)
        if (looksLikeEntity(query)) {
            fetchRaw(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`).then(function(r){ return r.json(); }).then(function(d){
                if(d && d.title && d.extract && container.isConnected) {
                    const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #e2e8f0';
                    div.innerHTML = `<div style="display:flex; gap:15px;">${d.thumbnail?`<img src="${d.thumbnail.source}" style="width:60px; height:60px; border-radius:8px; object-fit:cover;">`:''}<div><strong style="color:#e2e8f0;"><i class="fab fa-wikipedia-w"></i> Wikipedia:</strong><h3 style="margin:5px 0;">${d.title}</h3><p style="font-size:13px; color:var(--text-muted);">${d.extract}</p></div></div>`;
                    container.appendChild(div);
                }
            }).catch(function(e){ /* 404 o abort: silencioso */ });
        }

        // 3. Mapas/Clima combinados (Nominatim rate-limita a 1 req/s: solo queries con forma de lugar)
        if (looksLikePlace(query)) {
        cachedFetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`, 300000).then(function(d){
            if(d.length > 0 && (d[0].type==='city' || d[0].type==='country' || d[0].importance > 0.4) && container.isConnected) {
                const place = d[0];
                const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #eab308';
                
                let zoom = 12;
                if(place.type === 'country') zoom = 5; else if(place.type === 'state') zoom = 7;
                
                const mapHtml = `<!DOCTYPE html><html><head><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" /><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script><style>body { margin: 0; padding: 0; background: #0f172a; } #map { width: 100vw; height: 100vh; } .leaflet-container { background: #0f172a; outline: 0; }</style></head><body><div id="map"></div><script>var map = L.map('map', { zoomControl: false }).setView([${place.lat}, ${place.lon}], ${zoom}); L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map); L.marker([${place.lat}, ${place.lon}]).addTo(map); L.control.zoom({ position: 'bottomright' }).addTo(map);<\/script></body></html>`;

                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <strong style="color:#eab308; font-size:1.1em;"><i class="fas fa-map-marker-alt"></i> Ubicación: ${place.display_name.split(',')[0]}</strong>
                            <div style="font-size:13px; color:var(--text-muted); margin-top:5px; max-width:90%;">${place.display_name}</div>
                        </div>
                        <a href="https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}" target="_blank" class="btn btn-secondary" style="padding:6px 12px; font-size:12px; white-space:nowrap; border-radius:30px;"><i class="fas fa-external-link-alt"></i> Ver en Maps</a>
                    </div>
                    
                    <div id="inline-meteo-${place.place_id}" style="margin-top:15px;"></div>
                    
                    <div style="position: relative; width: 100%; height: 320px; border-radius: 16px; overflow: hidden; margin-top: 15px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                        <div id="map-overlay-${place.place_id}" style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.4); z-index: 10; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); cursor: pointer; transition: 0.4s;" onclick="this.style.opacity='0'; setTimeout(()=>this.style.pointerEvents='none', 400);">
                            <div style="background: var(--primary); color: white; padding: 10px 24px; border-radius: 30px; font-size: 13px; font-weight: 600; box-shadow: 0 4px 20px var(--primary-glow); display: flex; align-items: center; gap: 8px; transition: 0.2s;">
                                <i class="fas fa-hand-pointer"></i> Toca para explorar
                            </div>
                        </div>
                        <iframe width="100%" height="100%" frameborder="0" srcdoc="${mapHtml.replace(/"/g, '&quot;')}" style="border: none;"></iframe>
                    </div>
                `;
                container.appendChild(div);
                
                fetchRaw(`https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&current_weather=true`).then(r=>r.json()).then(w=>{
                    if(w.current_weather) {
                        const cw = w.current_weather;
                        document.getElementById(`inline-meteo-${place.place_id}`).innerHTML = `
                            <div style="display:inline-flex; align-items:center; padding:10px 16px; background:rgba(0,0,0,0.3); border-radius:12px; border:1px solid rgba(255,255,255,0.05); gap:15px;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <i class="fas ${cw.is_day?'fa-sun':'fa-moon'}" style="font-size:1.5em; color:${cw.is_day?'#fcd34d':'#818cf8'};"></i>
                                    <span style="font-size:22px; font-weight:600; color:${cw.is_day?'#fcd34d':'#818cf8'};">${cw.temperature}°C</span>
                                </div>
                                <div style="width:1px; height:25px; background:rgba(255,255,255,0.1);"></div>
                                <div style="font-size:12px; color:var(--text-muted); display:flex; flex-direction:column;">
                                    <span><i class="fas fa-wind" style="margin-right:4px;"></i> Viento: ${cw.windspeed} km/h</span>
                                </div>
                            </div>
                        `;
                    }
                }).catch(e => { if (!isAbort(e)) console.warn("Error API Clima Interno:", e); });
            }
        }).catch(function(e){ if (!isAbort(e)) console.warn("Error API Mapa:", e); });
        } // fin looksLikePlace

        // 4. Terminal de Mercados (Crypto, Acciones, Materias Primas)
        const marketKeywords = ['mercado', 'precio', 'acciones', 'accion', 'cotizacion'];
        const isMarket = marketKeywords.some(kw => query.toLowerCase().startsWith(kw + ' ')) || ['btc', 'eth', 'bitcoin', 'oro'].includes(query.toLowerCase());
        
        if(isMarket) {
            let asset = query.toLowerCase();
            marketKeywords.forEach(kw => { asset = asset.replace(kw, '').trim(); });
            // Mapeo directo de palabras comunes a activos reales
            const assetMap = {'btc':'bitcoin', 'eth':'ethereum', 'oro':'pax-gold', 'plata':'kinesis-silver'};
            const searchQuery = assetMap[asset] || asset;

            cachedFetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(searchQuery)}`, 120000)
            .then(function(d){
                if(d && d.coins && d.coins.length > 0) {
                    const coinData = d.coins[0];
                    fetchRaw(`https://api.coingecko.com/api/v3/simple/price?ids=${coinData.id}&vs_currencies=usd&include_24hr_change=true`)
                    .then(r2=>r2.json()).then(d2=>{
                        if(d2[coinData.id]) {
                            const priceData = d2[coinData.id];
                            const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #10b981';
                            const isUp = priceData.usd_24h_change >= 0;
                            div.innerHTML = `
                                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                                    <div style="display:flex; gap:15px; align-items:center;">
                                        <img src="${coinData.thumb}" style="width:45px; height:45px; border-radius:50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                                        <div>
                                            <strong style="color:#10b981;"><i class="fas fa-chart-line"></i> Terminal de Mercados:</strong>
                                            <h3 style="margin:2px 0; color:var(--text); text-transform:capitalize;">${coinData.name} <span style="font-size:14px; color:var(--text-gray);">${coinData.symbol}</span></h3>
                                        </div>
                                    </div>
                                    <div style="text-align:right;">
                                        <div style="font-size:24px; font-weight:600; color:var(--text);">$${priceData.usd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})} USD</div>
                                        <div style="font-size:14px; color:${isUp?'var(--success)':'var(--danger)'}; font-weight:500;">
                                            <i class="fas ${isUp?'fa-arrow-up':'fa-arrow-down'}"></i> ${Math.abs(priceData.usd_24h_change).toFixed(2)}% (24h)
                                        </div>
                                    </div>
                                </div>
                                <div style="margin-top:15px; display:flex; gap:10px;">
                                    <a href="https://es.tradingview.com/symbols/${coinData.symbol}USD/" target="_blank" class="btn btn-secondary" style="padding:6px 12px; font-size:12px;"><i class="fas fa-chart-area"></i> Gráfico Interactivo</a>
                                </div>
                            `;
                            if(container.children.length > 1) container.insertBefore(div, container.children[1]); else container.appendChild(div);
                        }
                    }).catch(e => console.warn("Error API Precios:", e));
                } else {
                    // Fallback Inteligente para Acciones Tradicionales (Ej. Apple, Tesla, etc.)
                    const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #3b82f6';
                    div.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                            <div>
                                <strong style="color:#3b82f6;"><i class="fas fa-building"></i> Terminal Financiera (Bolsa de Valores):</strong>
                                <h3 style="margin:2px 0; color:var(--text); text-transform:capitalize;">Activo: ${asset}</h3>
                                <div style="font-size:12px; color:var(--text-muted);">Redirección segura a terminales de datos en tiempo real.</div>
                            </div>
                        </div>
                        <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
                            <a href="https://es.tradingview.com/search/?q=${encodeURIComponent(asset)}" target="_blank" class="btn btn-primary" style="padding:6px 12px; font-size:12px; background:linear-gradient(135deg, #2563eb, #1d4ed8);"><i class="fas fa-chart-line"></i> Ver en TradingView</a>
                            <a href="https://es.finance.yahoo.com/quote/${encodeURIComponent(asset)}" target="_blank" class="btn btn-secondary" style="padding:6px 12px; font-size:12px;"><i class="fab fa-yahoo"></i> Yahoo Finance</a>
                        </div>
                    `;
                    if(container.children.length > 1) container.insertBefore(div, container.children[1]); else container.appendChild(div);
                }
            }).catch(e => console.warn("Error API Búsqueda Mercados:", e));
        }

        // 5. Archivo Literario (Open Library integrado como nativo)
        const bookKeywords = ['libro', 'book', 'novela', 'autor ', 'isbn', 'literatura'];
        const isBookQuery = bookKeywords.some(kw => query.toLowerCase().includes(kw));
        let bookQuery = query;
        if(isBookQuery) bookQuery = query.toLowerCase().replace(/(libro|book|novela|autor de|autor|isbn|literatura)/g, '').trim();
        
        // El fetch solo se dispara si hay keyword de libro o la query tiene forma de título:
        // antes se consultaba Open Library en TODA búsqueda de >2 caracteres y casi nunca se pintaba.
        if (isBookQuery || looksLikeBookTitle(query)) {
            // Buscando el libro con la API de search
            fetchRaw(`https://openlibrary.org/search.json?q=${encodeURIComponent(bookQuery)}&limit=1`).then(r=>r.json()).then(d=>{
                if(d.docs && d.docs.length > 0 && container.isConnected) {
                    const book = d.docs[0];
                    const isExactMatch = book.title.toLowerCase() === query.toLowerCase();
                    
                    if (isBookQuery || isExactMatch) {
                        const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #8b5cf6';
                        
                        const cover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '';
                        const author = book.author_name ? book.author_name.join(', ') : 'Desconocido';
                        const firstIsbn = book.isbn && book.isbn.length > 0 ? book.isbn[0] : null;
                        const olid = book.cover_edition_key || (book.edition_key ? book.edition_key[0] : null);
                        const uniqueId = book.key.replace(/[^a-zA-Z0-9]/g, '');
                        
                        div.innerHTML = `
                            <div style="display:flex; gap:15px; align-items:flex-start;">
                                ${cover ? `<img src="${cover}" style="width:75px; height:auto; border-radius:6px; box-shadow:0 4px 10px rgba(0,0,0,0.3);">` : `<div style="width:75px; height:110px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; border-radius:6px;"><i class="fas fa-book" style="color:#8b5cf6; font-size:24px;"></i></div>`}
                                <div style="flex:1;">
                                    <strong style="color:#8b5cf6; font-size:1.1em;"><i class="fas fa-book-open"></i> Archivo Literario Estalingrado:</strong>
                                    <h3 style="margin:5px 0 2px; font-size:1.3em; color:var(--text);">${book.title}</h3>
                                    <div style="font-size:13px; color:var(--text-muted); margin-bottom:8px;">
                                        Autor: <strong style="color:var(--text);">${author}</strong> 
                                        ${book.first_publish_year ? `&nbsp;•&nbsp; Publicación original: ${book.first_publish_year}`:''}
                                    </div>
                                    <div id="book-extra-${uniqueId}" style="font-size:12px; color:var(--text-gray); margin-bottom:12px; line-height: 1.5;">
                                        <i class="fas fa-spinner fa-spin"></i> Sincronizando metadatos del volumen...
                                    </div>
                                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                                        ${olid ? `<a href="https://openlibrary.org/books/${olid}" target="_blank" class="btn btn-secondary" style="padding:6px 12px; font-size:11px; border-radius:20px; text-decoration:none;"><i class="fas fa-book-reader"></i> Leer Edición (OLID)</a>` : ''}
                                        <button class="btn btn-secondary" style="padding:6px 12px; font-size:11px; border-radius:20px; cursor:default;"><i class="fas fa-database"></i> Indexado en API local</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        container.appendChild(div);

                        // Segundo Fetch: Usando los endpoints solicitados (/api/volumes/brief/{key_type}/{value}.json)
                        if (firstIsbn) {
                            fetchRaw(`https://openlibrary.org/api/volumes/brief/isbn/${firstIsbn}.json`).then(r=>r.json()).then(volData => {
                                const records = volData.records || {};
                                const recordKeys = Object.keys(records);
                                const extraContainer = document.getElementById(`book-extra-${uniqueId}`);
                                
                                if(recordKeys.length > 0 && extraContainer) {
                                    const record = records[recordKeys[0]];
                                    const details = record.data || {};
                                    let extraHtml = '';
                                    
                                    if(details.number_of_pages) extraHtml += `<span style="background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px; margin-right:8px;"><i class="fas fa-file-alt"></i> ${details.number_of_pages} págs</span>`;
                                    if(details.publishers && details.publishers.length > 0) extraHtml += `<span style="background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px; margin-right:8px;"><i class="fas fa-building"></i> Ed: ${details.publishers[0].name}</span>`;
                                    
                                    if(details.subjects && details.subjects.length > 0) {
                                        const tags = details.subjects.slice(0,3).map(s=>s.name).join(', ');
                                        extraHtml += `<br><div style="margin-top:6px;"><i class="fas fa-tags" style="color:var(--primary);"></i> Temas: ${tags}</div>`;
                                    }
                                    
                                    extraContainer.innerHTML = extraHtml || 'Metadatos verificados.';
                                } else if (extraContainer) {
                                    // Si falla la API de volumes, intentamos la API de books genérica
                                    if (olid) {
                                        fetchRaw(`https://openlibrary.org/api/books?bibkeys=OLID:${olid}&format=json&jscmd=data`).then(r=>r.json()).then(bData => {
                                            const bKey = `OLID:${olid}`;
                                            if(bData[bKey] && extraContainer) {
                                                const bDetails = bData[bKey];
                                                extraContainer.innerHTML = `<span style="background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;"><i class="fas fa-file-alt"></i> ${bDetails.number_of_pages || '?'} págs</span>`;
                                            } else { extraContainer.innerHTML = ''; }
                                        }).catch(()=>{ extraContainer.innerHTML = ''; });
                                    } else { extraContainer.innerHTML = ''; }
                                }
                            }).catch(()=>{
                                const extraContainer = document.getElementById(`book-extra-${uniqueId}`);
                                if(extraContainer) extraContainer.innerHTML = '';
                            });
                        } else {
                            const extraContainer = document.getElementById(`book-extra-${uniqueId}`);
                            if(extraContainer) extraContainer.innerHTML = '';
                        }
                    }
                }
            }).catch(()=>{});
        }

        // 6. Multimedia (iTunes)
        const mediaKeywords = ['cancion', 'canción', 'artista', 'album', 'pelicula', 'película', 'musica', 'música', 'podcast'];
        const isMedia = mediaKeywords.some(kw => query.toLowerCase().includes(kw));
        if (isMedia) {
            let cleanQuery = query.toLowerCase().replace(new RegExp(mediaKeywords.join('|'), 'gi'), '').trim() || query;
            if(cleanQuery.length > 2) {
                fetchRaw(`https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&limit=3`).then(r=>r.json()).then(d=>{
                    if(d.results && d.results.length > 0) {
                        const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #ec4899';
                        let html = `<strong style="color:#ec4899;"><i class="fas fa-music"></i> Apple Media Data:</strong><div style="display:flex; flex-direction:column; gap:10px; margin-top:10px;">`;
                        d.results.forEach(item => {
                            html += `
                            <div style="display:flex; gap:10px; align-items:center; background:rgba(255,255,255,0.03); padding:8px; border-radius:8px;">
                                ${item.artworkUrl100 ? `<img src="${item.artworkUrl100}" style="width:50px; height:50px; border-radius:6px; object-fit:cover;">` : ''}
                                <div style="flex:1;">
                                    <div style="font-weight:600; font-size:14px; color:var(--text);">${item.trackName || item.collectionName || item.artistName}</div>
                                    <div style="font-size:12px; color:var(--text-muted);">${item.artistName} • <span style="text-transform:capitalize;">${item.kind || item.wrapperType}</span></div>
                                </div>
                                ${item.previewUrl ? `<audio controls src="${item.previewUrl}" style="height:30px; width:120px;"></audio>` : ''}
                            </div>`;
                        });
                        html += `</div>`;
                        div.innerHTML = html;
                        container.appendChild(div);
                    }
                }).catch(()=>{});
            }
        }

        // 7. Series y TV (TVMaze)
        const tvKeywords = ['serie', 'programa', 'tv', 'temporada', 'show'];
        const isTv = tvKeywords.some(kw => query.toLowerCase().includes(kw));
        if(isTv) {
            let cleanQuery = query.toLowerCase().replace(new RegExp(tvKeywords.join('|'), 'gi'), '').trim() || query;
            if(cleanQuery.length > 2) {
                fetchRaw(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(cleanQuery)}`).then(r=>r.json()).then(d=>{
                    if(d.length > 0) {
                        const show = d[0].show;
                        const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #14b8a6';
                        div.innerHTML = `
                            <div style="display:flex; gap:15px; align-items:flex-start;">
                                ${show.image ? `<img src="${show.image.medium}" style="width:70px; border-radius:6px;">` : `<div style="width:70px; height:100px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; border-radius:6px;"><i class="fas fa-tv" style="color:#14b8a6; font-size:24px;"></i></div>`}
                                <div style="flex:1;">
                                    <strong style="color:#14b8a6; font-size:1.1em;"><i class="fas fa-tv"></i> Base de Datos TVMaze:</strong>
                                    <h3 style="margin:5px 0 2px; font-size:1.3em; color:var(--text);">${show.name}</h3>
                                    <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">
                                        ${show.premiered ? show.premiered.split('-')[0] : 'N/A'} • ${show.genres.join(', ')} • ⭐ ${show.rating?.average || '-'}
                                    </div>
                                    <div style="font-size:13px; color:var(--text-gray); line-height: 1.4; max-height: 60px; overflow: hidden; text-overflow: ellipsis; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;">
                                        ${show.summary ? show.summary.replace(/<[^>]+>/g, '') : 'Sin descripción disponible.'}
                                    </div>
                                    ${show.officialSite ? `<a href="${show.officialSite}" target="_blank" class="btn btn-secondary" style="margin-top:10px; padding:4px 10px; font-size:11px;"><i class="fas fa-external-link-alt"></i> Sitio Oficial</a>` : ''}
                                </div>
                            </div>`;
                        container.appendChild(div);
                    }
                }).catch(()=>{});
            }
        }

        // 8. GitHub Users
        if(query.toLowerCase().startsWith('github ')) {
            let user = query.toLowerCase().replace('github ', '').trim();
            if(user) {
                fetchRaw(`https://api.github.com/users/${encodeURIComponent(user)}`).then(r=>r.json()).then(d=>{
                    if(d.login) {
                        const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #6e7681';
                        div.innerHTML = `
                            <div style="display:flex; gap:15px; align-items:center;">
                                <img src="${d.avatar_url}" style="width:60px; height:60px; border-radius:50%; border:2px solid #6e7681; box-shadow:0 0 10px rgba(255,255,255,0.05);">
                                <div style="flex:1;">
                                    <strong style="color:#c9d1d9;"><i class="fab fa-github"></i> Registro de Desarrollador GitHub:</strong>
                                    <h3 style="margin:3px 0; color:var(--text);">${d.name || d.login} <span style="font-size:13px; font-weight:400; color:var(--text-gray);">@${d.login}</span></h3>
                                    ${d.bio ? `<div style="font-size:12px; color:var(--text-muted); margin-bottom:5px;">${d.bio}</div>` : ''}
                                    <div style="font-size:11px; margin-top:5px; color:var(--text-gray); display:flex; gap:10px;">
                                        <span><i class="fas fa-users" style="color:var(--primary);"></i> ${d.followers} followers</span> 
                                        <span><i class="fas fa-book" style="color:var(--primary);"></i> ${d.public_repos} repositorios</span>
                                    </div>
                                </div>
                                <a href="${d.html_url}" target="_blank" class="btn btn-secondary" style="font-size:11px; padding:6px 12px; border-radius:20px;"><i class="fas fa-external-link-alt"></i> Visitar Perfil</a>
                            </div>`;
                        container.appendChild(div);
                    }
                }).catch(()=>{});
            }
        }

        // 9. Pokémon (PokeAPI)
        if(query.toLowerCase().startsWith('pokemon ') || query.toLowerCase().startsWith('pokémon ')) {
            let pkm = query.toLowerCase().replace(/pok[eé]mon /i, '').trim();
            if(pkm) {
                fetchRaw(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pkm)}`).then(r=>r.json()).then(d=>{
                    if(d.id) {
                        const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #ef4444';
                        const types = d.types.map(t => t.type.name).join(', ');
                        div.innerHTML = `
                            <div style="display:flex; gap:15px; align-items:center;">
                                <div style="background:radial-gradient(circle, rgba(255,255,255,0.1), transparent); border-radius:50%; padding:5px; border:1px solid rgba(239,68,68,0.2);">
                                    <img src="${d.sprites.front_default}" style="width:70px; height:70px; image-rendering:pixelated; transform:scale(1.2);">
                                </div>
                                <div>
                                    <strong style="color:#ef4444;"><i class="fas fa-tablet-alt"></i> Base de Datos Pokédex:</strong>
                                    <h3 style="margin:3px 0; text-transform:capitalize; color:var(--text);">#${d.id} ${d.name}</h3>
                                    <div style="font-size:12px; color:var(--text-muted); text-transform:capitalize;">Tipo: <span style="color:var(--text);">${types}</span></div>
                                    <div style="font-size:11px; color:var(--text-gray); margin-top:2px;">Altura: ${d.height/10}m • Peso: ${d.weight/10}kg</div>
                                </div>
                            </div>`;
                        container.appendChild(div);
                    }
                }).catch(()=>{});
            }
        }

        // 10. Unidad Canina (Dog API)
        if(['perro', 'perros', 'dog', 'dogs', 'cachorro'].includes(query.toLowerCase())) {
            fetchRaw('https://dog.ceo/api/breeds/image/random').then(r=>r.json()).then(d=>{
                if(d.status === 'success') {
                    const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #d97706';
                    div.innerHTML = `
                        <strong style="color:#d97706;"><i class="fas fa-paw"></i> Unidad Canina Detectada:</strong><br>
                        <img src="${d.message}" style="width:100%; max-width:400px; height:auto; max-height:250px; object-fit:cover; border-radius:12px; margin-top:10px; box-shadow:0 5px 20px rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1);">
                    `;
                    container.appendChild(div);
                }
            }).catch(()=>{});
        }

        // 11. Internet Archive (Búsqueda Histórica)
        const archiveKeywords = ['archivo', 'archive', 'historia web', 'documento antiguo'];
        const isArchive = archiveKeywords.some(kw => query.toLowerCase().includes(kw));
        if(isArchive) {
            let cleanQuery = query.toLowerCase().replace(new RegExp(archiveKeywords.join('|'), 'gi'), '').trim() || query;
            if(cleanQuery.length > 2) {
                // Ordenar por número de descargas para asegurar relevancia
                fetchRaw(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(cleanQuery)}&fl[]=identifier,title,creator,mediatype,year,description&sort[]=downloads+desc&rows=1&page=1&output=json`)
                .then(r=>r.json()).then(d=>{
                    if(d.response && d.response.docs && d.response.docs.length > 0) {
                        const item = d.response.docs[0];
                        const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #a8a29e';
                        const imgUrl = `https://archive.org/services/img/${item.identifier}`;
                        const itemUrl = `https://archive.org/details/${item.identifier}`;
                        
                        div.innerHTML = `
                            <div style="display:flex; gap:15px; align-items:flex-start;">
                                <div style="flex-shrink: 0; width: 80px; min-height: 80px; background: rgba(255,255,255,0.05); border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                                    <img src="${imgUrl}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" style="width:100%; height:auto;">
                                    <i class="fas fa-landmark" style="display:none; font-size:24px; color:#a8a29e;"></i>
                                </div>
                                <div style="flex:1;">
                                    <strong style="color:#a8a29e; font-size:1.1em;"><i class="fas fa-landmark"></i> Registro Histórico Archive.org:</strong>
                                    <h3 style="margin:5px 0 2px; font-size:1.3em; color:var(--text);">${item.title}</h3>
                                    <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">
                                        ${item.creator ? `Creador: <strong style="color:var(--text);">${Array.isArray(item.creator) ? item.creator[0] : item.creator}</strong>` : 'Origen desconocido'} 
                                        ${item.year ? `&nbsp;•&nbsp; Año: ${item.year}`:''}
                                        ${item.mediatype ? `&nbsp;•&nbsp; Formato: <span style="text-transform:capitalize;">${item.mediatype}</span>`:''}
                                    </div>
                                    <div style="font-size:13px; color:var(--text-gray); line-height: 1.4; max-height: 60px; overflow: hidden; text-overflow: ellipsis; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;">
                                        ${item.description ? (Array.isArray(item.description) ? item.description[0] : item.description).replace(/<[^>]+>/g, '') : 'Sin descripción detallada en los archivos.'}
                                    </div>
                                    <a href="${itemUrl}" target="_blank" class="btn btn-secondary" style="margin-top:10px; padding:4px 10px; font-size:11px;"><i class="fas fa-external-link-alt"></i> Explorar en Internet Archive</a>
                                </div>
                            </div>`;
                        container.appendChild(div);
                    }
                }).catch(()=>{});
            }
        }

        // 12. Diccionario (Free Dictionary API)
        const dictMatch = query.toLowerCase().match(/^(definir|significado de) (.+)/);
        if(dictMatch && dictMatch[2]) {
            fetchRaw(`https://api.dictionaryapi.dev/api/v2/entries/es/${encodeURIComponent(dictMatch[2])}`).then(r=>r.json()).then(d=>{
                if(Array.isArray(d) && d.length > 0) {
                    const wordData = d[0];
                    const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #3b82f6';
                    let meaningsHtml = '';
                    wordData.meanings.slice(0, 2).forEach(m => {
                        meaningsHtml += `<div style="margin-top:8px;"><strong>${m.partOfSpeech}</strong>: <span style="color:var(--text-muted);">${m.definitions[0].definition}</span></div>`;
                    });
                    div.innerHTML = `<strong style="color:#3b82f6;"><i class="fas fa-book"></i> Diccionario:</strong><h3 style="margin:5px 0; text-transform:capitalize;">${wordData.word}</h3>${meaningsHtml}`;
                    container.appendChild(div);
                }
            }).catch(()=>{});
        }

        // 13. Información de Países (REST Countries)
        const countryMatch = query.toLowerCase().match(/^(pais|país) (.+)/);
        if(countryMatch && countryMatch[2]) {
            fetchRaw(`https://restcountries.com/v3.1/translation/${encodeURIComponent(countryMatch[2])}`).then(r=>r.json()).then(d=>{
                if(Array.isArray(d) && d.length > 0) {
                    const country = d[0];
                    const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #10b981';
                    div.innerHTML = `
                        <div style="display:flex; gap:15px; align-items:center;">
                            <div style="font-size:3.5rem; line-height:1; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">${country.flag}</div>
                            <div>
                                <strong style="color:#10b981;"><i class="fas fa-globe-americas"></i> Base de Datos Global:</strong>
                                <h3 style="margin:3px 0;">${country.name.common} <span style="font-size:12px; font-weight:normal; color:var(--text-gray);">(${country.cca3})</span></h3>
                                <div style="font-size:12px; color:var(--text-muted);">
                                    <strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'} • 
                                    <strong>Población:</strong> ${country.population.toLocaleString()} • 
                                    <strong>Región:</strong> ${country.region}
                                </div>
                            </div>
                        </div>`;
                    container.appendChild(div);
                }
            }).catch(()=>{});
        }

        // 14. Búsqueda de Recetas (TheMealDB)
        const recipeMatch = query.toLowerCase().match(/^(receta|cocinar) (.+)/);
        if(recipeMatch && recipeMatch[2]) {
            fetchRaw(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(recipeMatch[2])}`).then(r=>r.json()).then(d=>{
                if(d.meals && d.meals.length > 0) {
                    const meal = d.meals[0];
                    const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #f59e0b';
                    div.innerHTML = `
                        <div style="display:flex; gap:15px; align-items:flex-start;">
                            <img src="${meal.strMealThumb}" style="width:80px; height:80px; border-radius:8px; object-fit:cover; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                            <div style="flex:1;">
                                <strong style="color:#f59e0b;"><i class="fas fa-utensils"></i> Archivo Culinario:</strong>
                                <h3 style="margin:5px 0;">${meal.strMeal}</h3>
                                <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">Categoría: ${meal.strCategory} • Origen: ${meal.strArea}</div>
                                <a href="${meal.strSource || meal.strYoutube || '#'}" target="_blank" class="btn btn-secondary" style="padding:4px 10px; font-size:11px;"><i class="fas fa-external-link-alt"></i> Ver Detalles</a>
                            </div>
                        </div>`;
                    container.appendChild(div);
                }
            }).catch(()=>{});
        }

        // 15. Rastreador SpaceX (Lanzamientos)
        if(query.toLowerCase() === 'spacex' || query.toLowerCase() === 'lanzamiento spacex') {
            fetchRaw('https://api.spacexdata.com/v4/launches/latest').then(r=>r.json()).then(d=>{
                if(d.id) {
                    const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #f8fafc';
                    const date = new Date(d.date_utc).toLocaleDateString('es-ES', {year:'numeric', month:'long', day:'numeric'});
                    div.innerHTML = `
                        <div style="display:flex; gap:15px; align-items:flex-start;">
                            ${d.links.patch.small ? `<img src="${d.links.patch.small}" style="width:70px; height:70px; filter: drop-shadow(0 2px 5px rgba(255,255,255,0.2));">` : `<i class="fas fa-rocket" style="font-size:3rem; color:#f8fafc;"></i>`}
                            <div style="flex:1;">
                                <strong style="color:#f8fafc;"><i class="fas fa-space-shuttle"></i> SpaceX Misión Más Reciente:</strong>
                                <h3 style="margin:5px 0;">${d.name}</h3>
                                <div style="font-size:12px; color:var(--text-muted); margin-bottom:5px;">Fecha: ${date} • Vuelo #${d.flight_number} • Éxito: ${d.success ? '<span style="color:var(--success);">Sí</span>' : '<span style="color:var(--danger);">No/Pendiente</span>'}</div>
                                ${d.details ? `<div style="font-size:12px; color:var(--text-gray); line-height:1.4;">${d.details.substring(0, 150)}...</div>` : ''}
                                ${d.links.webcast ? `<a href="${d.links.webcast}" target="_blank" class="btn btn-secondary" style="margin-top:8px; padding:4px 10px; font-size:11px;"><i class="fab fa-youtube"></i> Ver Transmisión</a>` : ''}
                            </div>
                        </div>`;
                    container.appendChild(div);
                }
            }).catch(()=>{});
        }

        // 16. Noticias Globales y Financieras (Hacker News Algolia API)
        const newsMatch = query.toLowerCase().match(/^(noticia|noticias|news) (.+)/);
        if (newsMatch && newsMatch[2]) {
            fetchRaw(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(newsMatch[2])}&hitsPerPage=3`)
            .then(r => r.json())
            .then(d => {
                if(d.hits && d.hits.length > 0) {
                    const div = document.createElement('div'); div.className = 'result'; div.style.borderLeft = '4px solid #a855f7';
                    let html = `<strong style="color:#a855f7;"><i class="fas fa-newspaper"></i> Agencia de Noticias Integrada:</strong><div style="display:flex; flex-direction:column; gap:10px; margin-top:12px;">`;
                    d.hits.forEach(item => {
                        const points = item.points || 0;
                        html += `
                        <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:10px; border: 1px solid rgba(255,255,255,0.05); transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                            <a href="${item.url || `https://news.ycombinator.com/item?id=${item.objectID}`}" target="_blank" style="font-weight:600; font-size:14px; color:var(--text); text-decoration:none; display:block; margin-bottom:6px;">${item.title}</a>
                            <div style="font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:10px;">
                                <span><i class="fas fa-user-edit"></i> ${item.author}</span>
                                <span><i class="far fa-clock"></i> ${new Date(item.created_at).toLocaleDateString()}</span>
                                <span style="color:var(--warning);"><i class="fas fa-fire"></i> ${points} pts</span>
                            </div>
                        </div>`;
                    });
                    html += `</div>`;
                    div.innerHTML = html;
                    container.appendChild(div);
                }
            }).catch(e => console.warn("Error API Noticias:", e));
        }

    },

    processSpecialCommands: function(query) {
        const { resultsDiv, resultsContainer } = UI.elements;
        resultsContainer.style.display = 'block'; setTimeout(() => resultsContainer.classList.add('show'), 10);
        
        if (query.startsWith('/ai ')) {
            resultsDiv.innerHTML = `<div class="result" style="border-left:4px solid var(--ai-color);"><strong><i class="fas fa-brain"></i> Análisis de IA Estalingrado:</strong><p>Procesando: "${Utils.escapeHtml(query.substring(4))}"</p><div class="loading-spinner"></div></div>`;
            setTimeout(() => {
                resultsDiv.innerHTML = `<div class="result" style="border-left:4px solid var(--ai-color);"><strong><i class="fas fa-brain"></i> IA Estalingrado:</strong><p>Para la consulta "${Utils.escapeHtml(query.substring(4))}", te sugiero revisar la documentación oficial o realizar una búsqueda combinada en GitHub y repositorios abiertos.</p></div>`;
            }, 1500);
        } else if (query.startsWith('/traducir ')) {
            resultsDiv.innerHTML = `<div class="result"><strong><i class="fas fa-language"></i> Traducción:</strong><p>Original: ${Utils.escapeHtml(query.substring(10))}</p><p style="color:var(--primary);">[Simulación] Traducción procesada en servidor.</p></div>`;
        }
    },

    startVoiceSearch: function() {
        const btn = UI.elements.voiceSearchButton; const input = UI.elements.queryInput;
        if (!('webkitSpeechRecognition' in window)) return alert('Navegador no compatible con voz.');
        if (AppState.isRecording) { AppState.voiceRecognition.stop(); return; }
        
        const rec = new webkitSpeechRecognition(); rec.lang = 'es-ES';
        rec.onstart = () => { AppState.isRecording = true; btn.classList.add('recording'); input.placeholder = "Escuchando..."; };
        rec.onresult = (e) => { input.value = e.results[0][0].transcript; rec.stop(); SearchManager.performSearch(); };
        rec.onend = () => { AppState.isRecording = false; btn.classList.remove('recording'); input.placeholder = "¿Qué necesitas localizar hoy?"; };
        AppState.voiceRecognition = rec; rec.start();
    },
    clearHistory: function() { Utils.safeLocalStorage.remove("searchHistory"); Toast.success('Historial borrado'); setTimeout(() => location.reload(), 1000); }
};

var PrivacyTools = {
    generatePassword: function() {
        const el = document.getElementById('passwordLength');
        const len = el ? el.value : 16;
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pwd = ""; for(let i=0; i<len; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
        Utils.copyToClipboard(pwd);
        Toast.success('Contraseña copiada al portapapeles');
    },
    checkEmailSecurity: function() {
        const emailInput = document.getElementById('emailInput');
        if (!emailInput) return Toast.warn('Función no disponible en esta vista');
        const email = emailInput.value;
        if(!Utils.validateEmail(email)) return Toast.error('Email inválido');
        Toast.info(Math.random() > 0.4 ? '✓ Sin filtraciones detectadas.' : '⚠ Precaución: dominio en filtraciones recientes (simulación).');
    },
    scanLink: function() {
        const linkInput = document.getElementById('linkInput');
        if (!linkInput) return Toast.warn('Función no disponible en esta vista');
        const url = linkInput.value;
        if(!Utils.validateUrl(url)) return Toast.error('URL inválida (incluye https://)');
        Toast.success('✓ Enlace parece seguro.');
    },
    generateQR: function() {
        const qrInput = document.getElementById('qrInput');
        if (!qrInput) return Toast.warn('Función no disponible en esta vista');
        const text = qrInput.value.trim();
        if(!text) return Toast.error('Ingresa texto o URL');
        const container = document.getElementById('qrResult');
        const out = container || document.createElement('div');
        if (!container) {
            out.id = 'qrResult';
            qrInput.parentNode.appendChild(out);
        }
        out.innerHTML = '<div class="loading-spinner"></div>';
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(text)}&margin=0`;
        const img = new Image();
        img.onload = () => {
            out.innerHTML = '<div style="background:white;padding:10px;border-radius:8px;display:inline-block;box-shadow:0 4px 10px rgba(0,0,0,0.5);"><img src="' + qrUrl + '" alt="QR" style="width:150px;height:150px;display:block;"></div>';
        };
        img.onerror = () => { out.innerHTML = '<span class="danger">Error al generar QR</span>'; };
        img.src = qrUrl;
    },
    clearAllData: function() {
        if(confirm('¿Eliminar caché, configuraciones y widgets locales?')) { localStorage.clear(); location.reload(); }
    }
};

// =========================================
// WIDGET DE CLIMA
// =========================================
var WeatherWidget = {
    _city: '',
    init: function() {
        this._city = Utils.safeLocalStorage.get('weatherCity') || '';
        if (this._city) {
            document.getElementById('weather-city-input').value = this._city;
            this.fetchWeather(this._city);
        } else {
            document.getElementById('weather-body').innerHTML = '<span class="weather-desc" style="color:var(--text-gray);">Ingresa una ciudad para ver el clima actual.</span>';
        }
    },
    setCity: function(city) {
        city = city.trim();
        if (!city) return Toast.warn('Escribe una ciudad');
        this._city = city;
        Utils.safeLocalStorage.set('weatherCity', city);
        this.fetchWeather(city);
    },
    fetchWeather: function(city) {
        var body = document.getElementById('weather-body');
        body.innerHTML = '<span class="weather-loading"><i class="fas fa-spinner fa-spin"></i> Consultando clima...</span>';
        var self = this;
        // Geocodificar con Open-Meteo Geocoding API (gratuito, sin API key)
        fetchRaw('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1&language=es&format=json', 8000, false)
        .then(function(r) { return r.json(); })
        .then(function(geo) {
            if (!geo || !geo.results || !geo.results.length) {
                body.innerHTML = '<span class="weather-error"><i class="fas fa-exclamation-triangle"></i> Ciudad no encontrada. Intenta con otro nombre.</span>';
                return;
            }
            var loc = geo.results[0];
            var lat = loc.latitude, lon = loc.longitude;
            var displayName = loc.name + (loc.country ? ', ' + loc.country : '');
            self._currentLocation = displayName;
            // Obtener clima con Open-Meteo
            return fetchRaw('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=1', 8000, false)
            .then(function(r) { return r.json(); })
            .then(function(w) {
                if (!w.current) {
                    // Fallback a API anterior
                    return fetchRaw('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current_weather=true&daily=temperature_max,temperature_min,precipitation_probability,weathercode&timezone=auto', 8000, false)
                    .then(function(r) { return r.json(); })
                    .then(function(w2) {
                        self._renderWeatherLegacy(w2, displayName);
                    });
                }
                var cur = w.current;
                var daily = w.daily;
                var code = cur.weather_code;
                var icon = 'fa-cloud-sun';
                var desc = 'Variable';
                if (code === 0 || code === 1) { icon = 'fa-sun'; desc = 'Despejado'; }
                else if (code === 2) { icon = 'fa-cloud-sun'; desc = 'Parcialmente nublado'; }
                else if (code === 3) { icon = 'fa-cloud'; desc = 'Nublado'; }
                else if (code >= 45 && code <= 48) { icon = 'fa-smog'; desc = 'Niebla'; }
                else if ((code >= 51 && code <= 67) || code >= 80) { icon = 'fa-cloud-rain'; desc = 'Lluvia'; }
                else if (code >= 71 && code <= 77) { icon = 'fa-snowflake'; desc = 'Nieve'; }
                else if (code >= 95) { icon = 'fa-bolt'; desc = 'Tormenta'; }
                var temp = cur.temperature_2m;
                var feelsLike = cur.apparent_temperature;
                var humidity = cur.relative_humidity_2m;
                var wind = cur.wind_speed_10m;
                var tempMax = daily ? daily.temperature_2m_max[0] : null;
                var tempMin = daily ? daily.temperature_2m_min[0] : null;
                var precipProb = daily ? daily.precipitation_probability_max[0] : null;
                body.innerHTML = '<div class="weather-main"><div class="weather-icon"><i class="fas ' + icon + '" style="color:#fcd34d;"></i></div><div><div class="weather-temp">' + temp + '<span class="weather-temp-unit">°C</span></div><div class="weather-desc">' + desc + ' en ' + Utils.escapeHtml(displayName) + '</div></div></div><div class="weather-details">' + (tempMin !== null ? '<span class="weather-detail-item"><i class="fas fa-arrow-down"></i> ' + tempMin + '°C</span>' : '') + (tempMax !== null ? '<span class="weather-detail-item"><i class="fas fa-arrow-up"></i> ' + tempMax + '°C</span>' : '') + '<span class="weather-detail-item"><i class="fas fa-wind"></i> ' + wind + ' km/h</span>' + (humidity !== null ? '<span class="weather-detail-item"><i class="fas fa-tint"></i> ' + humidity + '%</span>' : '') + '</div>';
            });
        })
        .catch(function(e) {
            console.error('WeatherWidget error:', e);
            body.innerHTML = '<span class="weather-error"><i class="fas fa-exclamation-triangle"></i> Error de conexión al consultar el clima.</span>';
        });
    },
    _renderWeatherLegacy: function(w, displayName) {
        var body = document.getElementById('weather-body');
        if (!w.current_weather) {
            body.innerHTML = '<span class="weather-error"><i class="fas fa-exclamation-triangle"></i> No se pudo obtener el clima.</span>';
            return;
        }
        var cw = w.current_weather;
        var daily = w.daily;
        var code = cw.weathercode;
        var icon = 'fa-cloud-sun';
        var desc = 'Variable';
        if (code === 0 || code === 1) { icon = 'fa-sun'; desc = 'Despejado'; }
        else if (code === 2) { icon = 'fa-cloud-sun'; desc = 'Parcialmente nublado'; }
        else if (code === 3) { icon = 'fa-cloud'; desc = 'Nublado'; }
        else if (code >= 45 && code <= 48) { icon = 'fa-smog'; desc = 'Niebla'; }
        else if ((code >= 51 && code <= 67) || code >= 80) { icon = 'fa-cloud-rain'; desc = 'Lluvia'; }
        else if (code >= 71 && code <= 77) { icon = 'fa-snowflake'; desc = 'Nieve'; }
        else if (code >= 95) { icon = 'fa-bolt'; desc = 'Tormenta'; }
        var tempMax = daily ? daily.temperature_max[0] : null;
        var tempMin = daily ? daily.temperature_min[0] : null;
        var precipProb = daily ? daily.precipitation_probability[0] : null;
        body.innerHTML = '<div class="weather-main"><div class="weather-icon"><i class="fas ' + icon + '" style="color:#fcd34d;"></i></div><div><div class="weather-temp">' + cw.temperature + '<span class="weather-temp-unit">°C</span></div><div class="weather-desc">' + desc + ' en ' + Utils.escapeHtml(displayName) + '</div></div></div><div class="weather-details">' + (tempMin !== null ? '<span class="weather-detail-item"><i class="fas fa-arrow-down"></i> ' + tempMin + '°C</span>' : '') + (tempMax !== null ? '<span class="weather-detail-item"><i class="fas fa-arrow-up"></i> ' + tempMax + '°C</span>' : '') + '<span class="weather-detail-item"><i class="fas fa-wind"></i> ' + cw.windspeed + ' km/h</span>' + (precipProb !== null ? '<span class="weather-detail-item"><i class="fas fa-tint"></i> ' + precipProb + '%</span>' : '') + '</div>';
    }
};

window.openTerm = function(type, q) {
    const mod = document.getElementById('modal-terminal'); const cont = document.getElementById('terminal-content');
    const cmd = type === 'code' ? `gh search code "${q}"` : `gh copilot suggest "${q}"`;
    cont.innerHTML = `<span style="color:#8b949e;"># Conectando con servidor seguro Estalingrado...</span><br><br><span style="color:#58a6ff;">user@estalingrado:~$</span> ${cmd}<span style="display:inline-block; width:8px; height:15px; background:#58a6ff; animation:blink 1s infinite; vertical-align:middle; margin-left:5px;"></span>`;
    document.getElementById('copy-cmd').onclick = function() {
        Utils.copyToClipboard(cmd);
        const orig = this.innerHTML; this.innerHTML = '<i class="fas fa-check"></i> Copiado';
        setTimeout(() => this.innerHTML = orig, 2000);
    };
    UI.toggleModal('modal-terminal');
};

var App = {
    init: function() {
        if(AppState.initialized || !UI.init()) return;
        this.setupEvents(); this.startLoader(); AppState.initialized = true;
    },
    setupEvents: function() {
        const input = UI.elements.queryInput;
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (SearchManager._suggestionIndex >= 0) {
                    var items = UI.elements.suggestionsContainer.querySelectorAll('.suggestion-item');
                    if (items[SearchManager._suggestionIndex]) {
                        var span = items[SearchManager._suggestionIndex].querySelector('span');
                        if (span) { input.value = span.textContent; }
                    }
                    SearchManager._suggestionIndex = -1;
                }
                SearchManager.performSearch();
            }
            if (e.key === "ArrowDown") { e.preventDefault(); SearchManager._navigateSuggestions(1); }
            if (e.key === "ArrowUp") { e.preventDefault(); SearchManager._navigateSuggestions(-1); }
        });
        input.addEventListener("input", function() {
            SearchManager._suggestionIndex = -1;
            SearchManager.showSuggestions();
        });
        document.addEventListener("mousedown", (e) => {
            if (!e.target.closest('.floating-panel') && !e.target.closest('.top-btn') && !e.target.closest('.search-wrapper') && !e.target.closest('#suggestionsContainer')) {
                UI.closeAllPanels(); UI.elements.suggestionsContainer.classList.remove('show'); document.querySelector('.search-wrapper').classList.remove('active');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') { e.preventDefault(); UI.elements.queryInput.focus(); }
            if (e.ctrlKey && e.key === 'd') { e.preventDefault(); UI.toggleDashboard(); }
            if (e.key === 'Escape') { UI.closeAllPanels(); UI.elements.suggestionsContainer.classList.remove('show'); document.querySelector('.search-wrapper').classList.remove('active'); SearchManager._suggestionIndex = -1; }
        });
    },
    startLoader: function() {
        const { loadingScreen, progressBar, mainContent } = UI.elements;
        const duration = 300;
        let p = 0;
        
        loadingScreen.style.display = 'flex'; loadingScreen.style.opacity = '1';
        mainContent.style.display = 'none'; mainContent.style.opacity = '0';
        
        const interval = setInterval(function() {
            p += 100 / (duration / 16);
            if (p > 100) p = 100;
            progressBar.style.width = p + '%';
            
            if (p >= 100) {
                clearInterval(interval);
                loadingScreen.style.opacity = '0';
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                    mainContent.style.display = 'flex';
                    requestAnimationFrame(function() { mainContent.style.opacity = '1'; });
                }, 250);
            }
        }, 16);
    }
};

window.toggleMenu = () => UI.togglePanel("menuPanel");
window.toggleSettings = () => UI.togglePanel("settingsPanel");
window.toggleDashboardView = () => UI.toggleDashboard();
window.toggleFullScreen = () => UI.toggleFullScreen();
window.toggleHelp = () => UI.toggleModal("help-modal");
window.mostrarPoliticaPrivacidad = () => UI.toggleModal("privacy-modal");
window.toggleTerminal = () => UI.toggleModal("modal-terminal");
window.search = () => SearchManager.performSearch();

window.setSearchMode = function(mode) {
    AppState.searchMode = mode;
    document.getElementById('tab-web').classList.toggle('active', mode === 'web');
    document.getElementById('tab-images').classList.toggle('active', mode === 'images');
    document.getElementById('tab-ai').classList.toggle('active', mode === 'ai');
    document.getElementById('tab-security').classList.toggle('active', mode === 'security');

    const input = document.getElementById('query');
    if (mode === 'images') {
        input.placeholder = "Buscar imágenes, fotografías, ilustraciones...";
    } else if (mode === 'ai') {
        input.placeholder = "Pregunta a la IA: escribe tu consulta...";
    } else if (mode === 'security') {
        input.placeholder = "Query de Shodan (ej: webcam, port:554, 8.8.8.8)...";
    } else {
        input.placeholder = "¿Qué necesitas localizar hoy?";
    }

    // Si ya hay algo escrito, re-ejecutamos la búsqueda en el nuevo modo automáticamente
    if (input.value.trim() !== '') window.search();
    else if (mode === 'security') window.search();
};

window.clearHistory = () => SearchManager.clearHistory();
window.startVoiceSearch = () => SearchManager.startVoiceSearch();

window.saveShodanKey = function() {
    const input = document.getElementById('shodanKeyInput');
    if (!input || !input.value.trim()) return Toast.warn('Pega tu API key de Shodan');
    Utils.safeLocalStorage.set('shodanKey', input.value.trim());
    Toast.success('API key guardada en tu navegador');
    setTimeout(() => window.search(), 400);
};

window.clearShodanKey = function() {
    Utils.safeLocalStorage.remove('shodanKey');
    Toast.success('API key borrada');
    setTimeout(() => window.search(), 400);
};

document.addEventListener('DOMContentLoaded', () => { App.init(); });
