/* LivePlayer — reproductor de transmisiones en vivo (HLS nativo + hls.js y YouTube iframe).
   Autoplay muteado por defecto; clic en tarjeta = play/pause; botones de sonido/pausa.
   Compartido por el banner de index.html y envivo.html. */
(function () {
  const HLS_CDN = 'https://cdn.jsdelivr.net/npm/hls.js@latest';

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="' + src + '"]')) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escAttr(t) {
    return esc(t).replace(/'/g, '&#39;');
  }

  window.LivePlayer = class LivePlayer {
    constructor(el, cfg) {
      this.el = el;
      this.id = cfg.id;
      this.title = cfg.title;
      this.source = cfg.source;
      this.type = cfg.type || 'hls';
      this.goUrl = cfg.goUrl || '#';
      this.youtube = cfg.youtube || '#';
      this.desc = cfg.desc || '';
      this.paused = false;
      this.muted = true;
      this.started = false;
      this.hls = null;
      this.video = null;
      this.iframe = null;
      this.render();
      this.bind();
      this.boot();
    }

    render() {
      const isHLS = this.type === 'hls';
      this.el.className = 'live-card';
      this.el.innerHTML =
        '<div class="live-wrap">' +
        '<span class="live-badge"><span class="dot"></span>EN VIVO</span>' +
        (isHLS ? '<span class="type-badge">HLS</span>' : '') +
        '<div class="live-media" id="live-media-' + this.id + '">' +
        (isHLS
          ? '<video class="live-video" muted playsinline autoplay></video>'
          : '<iframe class="live-iframe" src="' + escAttr(this.source) +
            '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>') +
        '<div class="live-overlay" id="live-overlay-' + this.id + '">' +
        '<div class="live-play-hint"><i class="fas fa-play"></i></div>' +
        '</div>' +
        '</div>' +
        '<div class="live-ctrl">' +
        '<button class="live-btn live-sound" title="Activar/desactivar sonido" aria-label="Sonido">🔇</button>' +
        '<button class="live-btn live-pause" title="Pausar/reanudar" aria-label="Pausa">⏸</button>' +
        '</div>' +
        '</div>' +
        '<div class="live-body">' +
        '<div class="live-head"><strong class="live-title">' + esc(this.title) +
        '</strong> <a class="go-live" href="' + escAttr(this.goUrl) +
        '" target="_blank" rel="noopener">IR →</a></div>' +
        '<div class="live-desc">' + esc(this.desc) + '</div>' +
        '<a class="yt-link" href="' + escAttr(this.youtube) + '" target="_blank" rel="noopener">Ver en YouTube</a>' +
        '</div>';
      this.video = this.el.querySelector('.live-video');
      this.iframe = this.el.querySelector('.live-iframe');
      this.overlay = this.el.querySelector('.live-overlay');
    }

    bind() {
      const self = this;
      this.overlay.addEventListener('click', () => self.togglePlay());
      this.el.querySelector('.live-sound').addEventListener('click', (e) => { e.stopPropagation(); self.toggleMute(); });
      this.el.querySelector('.live-pause').addEventListener('click', (e) => { e.stopPropagation(); self.togglePause(); });
    }

    async boot() {
      if (this.type === 'hls') {
        if (!window.Hls) await loadScript(HLS_CDN);
        this.hls = new window.Hls({
          enableWorker: true,
          backBufferLength: 0,
          startLevel: -1,
          autoStartLoad: true,
          capLevelToPlayerSize: false
        });
        this.hls.attachMedia(this.video);
        this.hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          this.started = true;
          this.syncUI();
          this.video.play().catch(() => {});
        });
        this.hls.on(window.Hls.Events.ERROR, () => {
          setTimeout(() => { try { this.hls.startLoad(); } catch (e) { } }, 3000);
        });
        this.hls.loadSource(this.source);
      } else {
        this.started = true;
        this.syncUI();
      }
      try { if (this.video) this.video.play().catch(() => {}); } catch (e) { }
    }

    play() {
      this.paused = false;
      if (this.video) this.video.play().catch(() => {});
      this.syncUI();
    }
    pause() {
      this.paused = true;
      if (this.video) this.video.pause();
      else if (this.iframe) {
        const src = this.iframe.src.replace(/[?&]autoplay=1/, '');
        this.iframe.src = src;
      }
      this.syncUI();
    }
    togglePlay() { if (this.paused || !this.started) this.play(); else this.pause(); }
    toggleMute() { this.muted = !this.muted; if (this.video) this.video.muted = this.muted; this.syncUI(); }
    togglePause() { if (this.paused) this.play(); else this.pause(); }
    syncUI() {
      const cls = this.paused ? 'paused' : 'playing';
      this.el.classList.remove('playing', 'paused');
      this.el.classList.add(cls);
      const btn = this.el.querySelector('.live-pause');
      btn.textContent = this.paused ? '▶' : '⏸';
      btn.title = this.paused ? 'Reanudar' : 'Pausar';
      const snd = this.el.querySelector('.live-sound');
      snd.textContent = this.muted ? '🔇' : '🔊';
    }
  };
})();
