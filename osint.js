/* =========================================================
   MODO OSINT — Estalingrado Corp
   Solo fuentes públicas, sin backend y sin API keys.
   No se realizan escaneos activos ni intentos de acceso.
   ========================================================= */
(function () {
    'use strict';

    // ---------- Utilidades ----------
    function esc(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
    function enc(value) { return encodeURIComponent(String(value)); }
    function isAborted(e) {
        return e && (e.name === 'AbortError' || e.name === 'TimeoutError');
    }
    function alive(el) {
        return el && (typeof el.isConnected === 'boolean' ? el.isConnected : document.body.contains(el));
    }
    function list(items, sep) {
        return (items || []).filter(function (x) { return x !== undefined && x !== null && x !== ''; }).join(sep || ' · ');
    }
    function chipList(values, cls) {
        var arr = (values || []).filter(Boolean);
        if (!arr.length) return '';
        return '<div class="osint-chips">' + arr.map(function (v) {
            return '<span class="osint-chip ' + (cls || '') + '">' + esc(v) + '</span>';
        }).join('') + '</div>';
    }
    function kvGrid(items) {
        var rows = items.filter(function (it) {
            return it && ((it.value !== undefined && it.value !== null && it.value !== '') || it.html);
        });
        if (!rows.length) return '';
        return '<div class="osint-grid">' + rows.map(function (it) {
            return '<div class="osint-kv"><label>' + esc(it.label) + '</label><div>' +
                (it.html || esc(it.value)) + '</div></div>';
        }).join('') + '</div>';
    }
    function fmtDate(value) {
        if (!value) return '';
        var d = new Date(value);
        if (isNaN(d.getTime())) return String(value);
        return d.toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // ---------- MD5 (para Gravatar; no se envía el email a nadie) ----------
    function md5(input) {
        function rol(n, c) { return ((n << c) | (n >>> (32 - c))) >>> 0; }
        function add(a, b) { return (a + b) >>> 0; }
        var bytes = new TextEncoder().encode(input);
        var len = bytes.length;
        var total = (((len + 8) >> 6) + 1) * 64;
        var data = new Uint8Array(total);
        data.set(bytes);
        data[len] = 0x80;
        var bits = len * 8;
        data[total - 8] = bits & 0xff;
        data[total - 7] = (bits >>> 8) & 0xff;
        data[total - 6] = (bits >>> 16) & 0xff;
        data[total - 5] = (bits >>> 24) & 0xff;

        var S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
            5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
            4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
            6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
        var K = [];
        for (var k = 0; k < 64; k++) K[k] = Math.floor(Math.abs(Math.sin(k + 1)) * 4294967296) >>> 0;

        var a0 = 0x67452301, b0 = 0xEFCDAB89, c0 = 0x98BADCFE, d0 = 0x10325476;
        for (var off = 0; off < total; off += 64) {
            var M = [];
            for (var j = 0; j < 16; j++) {
                M[j] = (data[off + j * 4] | (data[off + j * 4 + 1] << 8) |
                    (data[off + j * 4 + 2] << 16) | (data[off + j * 4 + 3] << 24)) >>> 0;
            }
            var A = a0, B = b0, C = c0, D = d0;
            for (var i = 0; i < 64; i++) {
                var F, g;
                if (i < 16) { F = (B & C) | (~B & D); g = i; }
                else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
                else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
                else { F = C ^ (B | ~D); g = (7 * i) % 16; }
                F = add(add(add(F, A), K[i]), M[g]);
                A = D; D = C; C = B;
                B = add(B, rol(F, S[i]));
            }
            a0 = add(a0, A); b0 = add(b0, B); c0 = add(c0, C); d0 = add(d0, D);
        }
        function le(x) {
            var s = '';
            for (var i = 0; i < 4; i++) s += ('0' + ((x >>> (i * 8)) & 0xff).toString(16)).slice(-2);
            return s;
        }
        return le(a0) + le(b0) + le(c0) + le(d0);
    }

    // ---------- Detección de tipo ----------
    var TYPES = {
        ip: { label: 'Dirección IP', icon: 'fa-network-wired', color: '#06b6d4' },
        domain: { label: 'Dominio', icon: 'fa-globe', color: '#8b5cf6' },
        email: { label: 'Email', icon: 'fa-envelope', color: '#f59e0b' },
        username: { label: 'Usuario', icon: 'fa-user-secret', color: '#10b981' },
        hash: { label: 'Hash', icon: 'fa-fingerprint', color: '#ef4444' },
        url: { label: 'URL', icon: 'fa-link', color: '#3b82f6' },
        phone: { label: 'Teléfono', icon: 'fa-phone', color: '#14b8a6' },
        query: { label: 'Consulta libre', icon: 'fa-magnifying-glass', color: '#a1a1aa' }
    };

    function detectType(raw) {
        var q = raw.trim();
        if (!q) return 'query';
        if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(q)) return 'ip';
        if (q.indexOf(':') !== -1 && /^[0-9a-f:.]+$/i.test(q) && (q.match(/:/g) || []).length >= 2) return 'ip';
        if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(q)) return 'email';
        if (/^https?:\/\//i.test(q)) return 'url';
        if (/^[a-z0-9.-]+\.[a-z]{2,}[/?#]/i.test(q)) return 'url';
        if (/^[a-f0-9]{32}$/i.test(q) || /^[a-f0-9]{40}$/i.test(q) || /^[a-f0-9]{64}$/i.test(q)) return 'hash';
        if (/^[\d\s()+.-]{7,20}$/.test(q) && (q.match(/\d/g) || []).length >= 7) return 'phone';
        if (/^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(q)) return 'domain';
        if (/^@?[a-z0-9._-]{2,40}$/i.test(q)) return 'username';
        return 'query';
    }

    function normalize(kind, q) {
        if (kind === 'username') return q.replace(/^@/, '');
        if (kind === 'phone') return q.replace(/[^\d+]/g, '');
        if (kind === 'domain') return q.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').toLowerCase();
        if (kind === 'url' && !/^https?:\/\//i.test(q)) return 'https://' + q;
        return q;
    }
    function hashKind(q) {
        if (q.length === 32) return 'MD5';
        if (q.length === 40) return 'SHA-1';
        if (q.length === 64) return 'SHA-256';
        return 'Hash';
    }
    function hostOf(url) {
        try { return new URL(url).hostname.replace(/^www\./i, ''); }
        catch (e) { return ''; }
    }

    // ---------- Fetch con timeout ----------
    function fetchJsonSafe(url, timeout) {
        return fetchJson(url, timeout || 12000);
    }
    function dnsQuery(name, type) {
        return fetchJsonSafe('https://dns.google/resolve?name=' + enc(name) + '&type=' + enc(type), 10000)
            .then(function (d) { return (d && d.Answer) || []; });
    }

    // ---------- Tarjetas de sección ----------
    function addSection(container, title, icon, color) {
        var card = document.createElement('div');
        card.className = 'result osint-section';
        card.innerHTML =
            '<div class="osint-section-head">' +
            '<span><i class="fas ' + icon + '" style="color:' + color + '"></i> ' + esc(title) + '</span>' +
            '<span class="osint-status"><i class="fas fa-spinner fa-spin"></i> consultando</span>' +
            '</div>' +
            '<div class="osint-section-body"><div class="loading-spinner"></div></div>';
        container.appendChild(card);
        return card;
    }
    function finish(card, html, status) {
        if (!alive(card)) return;
        card.querySelector('.osint-section-body').innerHTML = html;
        var st = card.querySelector('.osint-status');
        if (st) st.innerHTML = '<i class="fas fa-circle-check" style="color:var(--success)"></i> ' + esc(status || 'listo');
    }
    function fail(card, message) {
        if (!alive(card)) return;
        card.querySelector('.osint-section-body').innerHTML =
            '<div class="osint-muted"><i class="fas fa-circle-info"></i> ' + esc(message) + '</div>';
        var st = card.querySelector('.osint-status');
        if (st) st.textContent = 'sin datos';
    }
    function sourceError(card, e) {
        if (isAborted(e)) return;
        if (e && e.name === 'TimeoutError') return fail(card, 'La fuente tardó demasiado en responder.');
        fail(card, 'No se pudo consultar esta fuente (límite de uso, CORS o sin datos públicos).');
    }

    // ---------- DNS ----------
    function dnsRow(type, values) {
        if (!values.length) return '';
        return '<div class="osint-dns-row"><span class="osint-dns-type">' + esc(type) + '</span>' +
            '<div class="osint-dns-values">' + values.map(function (v) {
                return '<code>' + esc(v) + '</code>';
            }).join('') + '</div></div>';
    }
    function loadDns(domain, container) {
        var card = addSection(container, 'DNS · Registros públicos', 'fa-network-wired', '#8b5cf6');
        Promise.all([
            dnsQuery(domain, 'A').catch(function () { return []; }),
            dnsQuery(domain, 'AAAA').catch(function () { return []; }),
            dnsQuery(domain, 'MX').catch(function () { return []; }),
            dnsQuery(domain, 'NS').catch(function () { return []; }),
            dnsQuery(domain, 'TXT').catch(function () { return []; }),
            dnsQuery('_dmarc.' + domain, 'TXT').catch(function () { return []; })
        ]).then(function (r) {
            var a = r[0].map(function (x) { return x.data; });
            var aaaa = r[1].map(function (x) { return x.data; });
            var mx = r[2].map(function (x) { return x.data; })
                .sort(function (x, y) { return parseInt(x, 10) - parseInt(y, 10); });
            var ns = r[3].map(function (x) { return x.data; });
            var txt = r[4].map(function (x) { return x.data; });
            var dmarc = r[5].map(function (x) { return x.data; });
            var spf = txt.filter(function (t) { return /^v=spf1/i.test(t); });
            var hasDmarc = dmarc.some(function (t) { return /^v=DMARC1/i.test(t); });

            var html = dnsRow('A', a) + dnsRow('AAAA', aaaa) + dnsRow('MX', mx) +
                dnsRow('NS', ns) + dnsRow('TXT', txt) + dnsRow('DMARC', dmarc);
            if (!html) return finish(card, '<div class="osint-muted">El dominio no devolvió registros DNS públicos.</div>', 'sin registros');

            var badges = '<div class="osint-flags">' +
                '<span class="osint-flag ' + (spf.length ? 'ok' : 'warn') + '"><i class="fas fa-' + (spf.length ? 'check' : 'xmark') + '"></i> SPF ' + (spf.length ? 'presente' : 'ausente') + '</span>' +
                '<span class="osint-flag ' + (hasDmarc ? 'ok' : 'warn') + '"><i class="fas fa-' + (hasDmarc ? 'check' : 'xmark') + '"></i> DMARC ' + (hasDmarc ? 'presente' : 'ausente') + '</span>' +
                '</div>';
            finish(card, html + badges, 'en vivo');
        }).catch(function (e) { sourceError(card, e); });
    }

    // ---------- RDAP / Whois ----------
    function roundVcardName(entity) {
        var arr = entity && entity.vcardArray && entity.vcardArray[1];
        if (Array.isArray(arr)) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i][0] === 'fn' && arr[i][3]) return arr[i][3];
            }
        }
        return (entity && (entity.handle || entity.publicIds && entity.publicIds[0] && entity.publicIds[0].identifier)) || '';
    }
    function loadRdap(domain, container) {
        var card = addSection(container, 'RDAP · Registro del dominio', 'fa-building-columns', '#8b5cf6');
        fetchJsonSafe('https://rdap.org/domain/' + enc(domain), 14000)
            .then(function (d) {
                if (!d || !d.ldhName) return fail(card, 'Este TLD no expone datos RDAP públicos.');
                var events = {};
                (d.events || []).forEach(function (ev) { if (ev && ev.eventAction) events[ev.eventAction] = ev.eventDate; });
                var registrar = (d.entities || []).filter(function (ent) {
                    return (ent.roles || []).indexOf('registrar') !== -1;
                }).map(roundVcardName).filter(Boolean).join(', ');
                var ns = (d.nameservers || []).map(function (n) { return n.ldhName || n.unicodeName; }).filter(Boolean);
                var status = (d.status || []).map(function (s) { return String(s).replace(/-/g, ' '); });

                var html = kvGrid([
                    { label: 'Dominio', value: d.ldhName },
                    { label: 'Registrador', value: registrar },
                    { label: 'Creado', value: fmtDate(events.registration) },
                    { label: 'Actualizado', value: fmtDate(events['last changed']) },
                    { label: 'Expira', value: fmtDate(events.expiration) }
                ]);
                if (ns.length) html += '<div class="osint-subtitle">Nameservers</div>' + chipList(ns);
                if (status.length) html += '<div class="osint-subtitle">Estados</div>' + chipList(status);
                finish(card, html, 'en vivo');
            })
            .catch(function (e) {
                if (isAborted(e)) return;
                fail(card, 'RDAP no devolvió datos para este dominio (TLD sin soporte o límite de consultas).');
            });
    }

    // ---------- Subdominios por Certificate Transparency ----------
    function renderSubdomains(card, domain, names) {
        var unique = {};
        names.forEach(function (n) {
            n = String(n || '').trim().toLowerCase().replace(/^\*\./, '');
            if (n && (n === domain || n.slice(-domain.length - 1) === '.' + domain)) unique[n] = 1;
        });
        var arr = Object.keys(unique).sort();
        if (!arr.length) return finish(card, '<div class="osint-muted">No se encontraron subdominios en los certificados públicos.</div>', 'sin datos');
        var shown = arr.slice(0, 120);
        var html = '<div class="osint-muted">' + arr.length + ' nombre(s) vistos en certificados TLS' +
            (arr.length > shown.length ? ' · mostrando los primeros ' + shown.length : '') + '</div>' +
            '<div class="osint-scroll">' + chipList(shown, 'mono') + '</div>';
        finish(card, html, 'en vivo');
    }
    function loadSubdomains(domain, container) {
        var card = addSection(container, 'Subdominios · Certificate Transparency', 'fa-certificate', '#8b5cf6');
        // Cert Spotter primero (rápido); crt.sh como respaldo si hay límite o CORS.
        fetchJsonSafe('https://api.certspotter.com/v1/issuances?domain=' + enc(domain) +
            '&include_subdomains=true&expand=dns_names', 12000)
            .then(function (rows) {
                if (!Array.isArray(rows)) throw new Error('respuesta inválida');
                var names = [];
                rows.forEach(function (row) { (row.dns_names || []).forEach(function (n) { names.push(n); }); });
                renderSubdomains(card, domain, names);
            })
            .catch(function (e) {
                if (isAborted(e)) return;
                fetchJsonSafe('https://crt.sh/?q=' + enc('%.' + domain) + '&output=json', 20000)
                    .then(function (rows) {
                        if (!Array.isArray(rows)) throw new Error('respuesta inválida');
                        var names = [];
                        rows.forEach(function (row) {
                            String(row.name_value || '').split(/\n+/).forEach(function (n) { names.push(n); });
                        });
                        renderSubdomains(card, domain, names);
                    })
                    .catch(function (e2) {
                        if (isAborted(e2)) return;
                        fail(card, 'Certificate Transparency no respondió. Prueba el enlace directo a crt.sh en las herramientas.');
                    });
            });
    }

    // ---------- Wayback ----------
    function loadWayback(target, container, label) {
        var card = addSection(container, 'Wayback Machine · Histórico', 'fa-clock-rotate-left', '#06b6d4');
        fetchJsonSafe('https://archive.org/wayback/available?url=' + enc(target), 12000)
            .then(function (d) {
                var closest = d && d.archived_snapshots && d.archived_snapshots.closest;
                var link = 'https://web.archive.org/web/*/' + enc(target);
                if (!closest) {
                    return finish(card, '<div class="osint-muted">No hay capturas guardadas.</div>' +
                        '<a class="btn btn-secondary" style="margin-top:10px;" href="' + link + '" target="_blank" rel="noopener"><i class="fas fa-clock-rotate-left"></i> Buscar en Wayback</a>', 'sin capturas');
                }
                var ts = String(closest.timestamp || '');
                var date = ts.length >= 8 ? ts.slice(0, 4) + '-' + ts.slice(4, 6) + '-' + ts.slice(6, 8) : ts;
                var html = kvGrid([
                    { label: label || 'Recurso', value: target },
                    { label: 'Última captura', value: date },
                    { label: 'Estado HTTP', value: closest.status },
                    { label: 'Enlace', html: '<a href="' + esc(closest.url) + '" target="_blank" rel="noopener">Abrir captura</a>' }
                ]);
                html += '<a class="btn btn-secondary" style="margin-top:10px;" href="' + link + '" target="_blank" rel="noopener"><i class="fas fa-list"></i> Ver todas las capturas</a>';
                finish(card, html, 'en vivo');
            })
            .catch(function (e) {
                if (isAborted(e)) return;
                // Wayback a veces falla por CORS/red: dejamos el acceso directo igualmente.
                var direct = 'https://web.archive.org/web/*/' + enc(target);
                finish(card, '<div class="osint-muted">No se pudo consultar el archivo automáticamente (CORS, red o límite de uso).</div>' +
                    '<a class="btn btn-secondary" style="margin-top:10px;" href="' + direct + '" target="_blank" rel="noopener"><i class="fas fa-clock-rotate-left"></i> Abrir Wayback Machine</a>', 'enlace directo');
            });
    }

    // ---------- IP ----------
    function geoHtml(g) {
        var mapLink = (g.lat !== undefined && g.lat !== '' && g.lon !== undefined && g.lon !== '')
            ? '<a href="https://www.openstreetmap.org/?mlat=' + enc(g.lat) + '&mlon=' + enc(g.lon) + '#map=11/' + enc(g.lat) + '/' + enc(g.lon) + '" target="_blank" rel="noopener">Ver en OpenStreetMap</a>'
            : '';
        return kvGrid([
            { label: 'País', value: list([g.country, g.countryCode], ' · ') },
            { label: 'Región', value: g.region },
            { label: 'Ciudad', value: g.city },
            { label: 'ISP / Org', value: g.isp },
            { label: 'ASN', value: g.asn ? 'AS' + g.asn : '' },
            { label: 'Zona horaria', value: g.timezone },
            { label: 'Coordenadas', value: (g.lat !== undefined && g.lon !== undefined) ? g.lat + ', ' + g.lon : '' },
            { label: 'Mapa', html: mapLink }
        ]);
    }
    function loadIpGeo(ip, container) {
        var card = addSection(container, 'Geolocalización y red', 'fa-location-dot', '#06b6d4');
        fetchJsonSafe('https://ipwho.is/' + enc(ip), 12000)
            .then(function (d) {
                if (!d || d.success === false) throw new Error('sin datos');
                finish(card, geoHtml({
                    country: d.country, countryCode: d.country_code, region: d.region, city: d.city,
                    isp: d.connection && d.connection.isp, asn: d.connection && d.connection.asn,
                    timezone: d.timezone && d.timezone.id, lat: d.latitude, lon: d.longitude
                }), 'en vivo · ipwho.is');
            })
            .catch(function (e) {
                if (isAborted(e)) return;
                // Respaldo sin key: ipinfo.io (CORS habilitado, datos básicos)
                fetchJsonSafe('https://ipinfo.io/' + enc(ip) + '/json', 12000)
                    .then(function (d) {
                        if (!d || !d.ip) return fail(card, 'IP sin datos públicos.');
                        var loc = String(d.loc || '').split(',');
                        var asnMatch = String(d.org || '').match(/^AS(\d+)/);
                        finish(card, geoHtml({
                            country: d.country, region: d.region, city: d.city,
                            isp: String(d.org || '').replace(/^AS\d+\s*/, ''),
                            asn: asnMatch ? asnMatch[1] : '',
                            timezone: d.timezone, lat: loc[0], lon: loc[1]
                        }), 'en vivo · ipinfo.io');
                    })
                    .catch(function (e2) {
                        if (isAborted(e2)) return;
                        sourceError(card, e2);
                    });
            });
    }
    function loadInternetDb(ip, container) {
        var card = addSection(container, 'Puertos y vulnerabilidades · InternetDB', 'fa-server', '#06b6d4');
        fetchJsonSafe('https://internetdb.shodan.io/' + enc(ip), 12000)
            .then(function (d) {
                if (!d || !d.ports || !d.ports.length) return fail(card, 'Sin puertos observados en InternetDB.');
                var html = kvGrid([
                    { label: 'Puertos abiertos', value: (d.ports || []).length },
                    { label: 'Hostnames', value: list(d.hostnames, ', ') },
                    { label: 'Etiquetas', value: list(d.tags, ', ') }
                ]);
                html += '<div class="osint-subtitle">Puertos</div>' + chipList((d.ports || []).map(String), 'mono');
                if (d.vulns && d.vulns.length) html += '<div class="osint-subtitle">CVEs</div>' + chipList(d.vulns, 'danger');
                if (d.cpes && d.cpes.length) html += '<div class="osint-subtitle">CPEs</div>' + chipList(d.cpes.slice(0, 15), 'mono');
                html += '<div class="osint-foot">Datos pasivos de Shodan InternetDB · sin créditos ni API key.</div>';
                finish(card, html, 'en vivo');
            })
            .catch(function (e) {
                if (isAborted(e)) return;
                if (e && /404/.test(e.message || '')) return fail(card, 'InternetDB no tiene observaciones para esta IP.');
                sourceError(card, e);
            });
    }

    // ---------- Email ----------
    function loadEmailDomain(email, container) {
        var domain = (email.split('@')[1] || '').toLowerCase();
        if (!domain) return;
        var card = addSection(container, 'Dominio del email · Configuración de correo', 'fa-envelope-open-text', '#f59e0b');
        Promise.all([
            dnsQuery(domain, 'MX').catch(function () { return []; }),
            dnsQuery(domain, 'TXT').catch(function () { return []; }),
            dnsQuery('_dmarc.' + domain, 'TXT').catch(function () { return []; })
        ]).then(function (r) {
            var mx = r[0].map(function (x) { return x.data; });
            var txt = r[1].map(function (x) { return x.data; });
            var dmarc = r[2].map(function (x) { return x.data; });
            var spf = txt.filter(function (t) { return /^v=spf1/i.test(t); });
            var hasDmarc = dmarc.some(function (t) { return /^v=DMARC1/i.test(t); });
            var html = kvGrid([{ label: 'Dominio', value: domain }]);
            html += '<div class="osint-subtitle">Servidores MX</div>' +
                (mx.length ? chipList(mx, 'mono') : '<div class="osint-muted">Sin registros MX: el dominio no recibe correo.</div>');
            html += '<div class="osint-flags">' +
                '<span class="osint-flag ' + (spf.length ? 'ok' : 'warn') + '"><i class="fas fa-' + (spf.length ? 'check' : 'xmark') + '"></i> SPF ' + (spf.length ? 'presente' : 'ausente') + '</span>' +
                '<span class="osint-flag ' + (hasDmarc ? 'ok' : 'warn') + '"><i class="fas fa-' + (hasDmarc ? 'check' : 'xmark') + '"></i> DMARC ' + (hasDmarc ? 'presente' : 'ausente') + '</span>' +
                '</div>';
            finish(card, html, 'en vivo');
        }).catch(function (e) { sourceError(card, e); });
    }
    function loadEmailRep(email, container) {
        var card = addSection(container, 'Huella pública del email', 'fa-fingerprint', '#f59e0b');
        var hash = md5(email.trim().toLowerCase());
        var html =
            '<div class="osint-avatar-wrap">' +
            '<img class="osint-avatar" alt="Gravatar" loading="lazy" src="https://gravatar.com/avatar/' + hash + '?d=404&s=96" ' +
            'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
            '<div class="osint-avatar-fallback" style="display:none;"><i class="fas fa-user"></i></div>' +
            '<div><strong>Gravatar</strong>' +
            '<div class="osint-muted">Hash MD5: <code>' + hash + '</code></div>' +
            '<div class="osint-muted">Si no aparece imagen, el email no tiene avatar público. El email nunca sale del navegador: solo se consulta el hash.</div>' +
            '</div></div>';
        html += '<div class="osint-foot">Para filtraciones usa Have I Been Pwned o Intelligence X desde las herramientas de abajo (requieren verificación o cuenta).</div>';
        finish(card, html, 'local');
    }

    // ---------- Usuario ----------
    function loadGithub(username, container) {
        var card = addSection(container, 'GitHub · Cuenta pública', 'fab fa-github', '#10b981');
        fetchJsonSafe('https://api.github.com/users/' + enc(username), 12000)
            .then(function (u) {
                if (!u || !u.login) return fail(card, 'Sin datos de GitHub.');
                var html = '<div class="osint-avatar-wrap">' +
                    (u.avatar_url ? '<img class="osint-avatar" alt="Avatar de GitHub" loading="lazy" src="' + esc(u.avatar_url) + '">' : '') +
                    '<div><strong>' + esc(u.name || u.login) + '</strong>' +
                    '<div class="osint-muted">@' + esc(u.login) + (u.bio ? ' · ' + esc(u.bio) : '') + '</div>' +
                    '<div class="osint-muted">Repos públicos: ' + esc(u.public_repos || 0) + ' · Seguidores: ' + esc(u.followers || 0) + ' · Creado: ' + esc(fmtDate(u.created_at)) + '</div>' +
                    '<div class="osint-muted"><a href="' + esc(u.html_url) + '" target="_blank" rel="noopener">Abrir perfil en GitHub</a></div>' +
                    '</div></div>';
                if (u.location) html += kvGrid([{ label: 'Ubicación declarada', value: u.location }]);
                finish(card, html, 'en vivo');
            })
            .catch(function (e) {
                if (isAborted(e)) return;
                if (e && /404/.test(e.message || '')) return finish(card, '<div class="osint-muted">No existe una cuenta de GitHub con ese nombre.</div>', 'sin coincidencia');
                sourceError(card, e);
            });
    }
    var USER_PLATFORMS = [
        { name: 'GitHub', icon: 'fab fa-github', url: function (u) { return 'https://github.com/' + u; } },
        { name: 'X (Twitter)', icon: 'fab fa-twitter', url: function (u) { return 'https://x.com/' + u; } },
        { name: 'Instagram', icon: 'fab fa-instagram', url: function (u) { return 'https://www.instagram.com/' + u; } },
        { name: 'Reddit', icon: 'fab fa-reddit', url: function (u) { return 'https://www.reddit.com/user/' + u; } },
        { name: 'TikTok', icon: 'fab fa-tiktok', url: function (u) { return 'https://www.tiktok.com/@' + u; } },
        { name: 'Twitch', icon: 'fab fa-twitch', url: function (u) { return 'https://www.twitch.tv/' + u; } },
        { name: 'YouTube', icon: 'fab fa-youtube', url: function (u) { return 'https://www.youtube.com/@' + u; } },
        { name: 'Telegram', icon: 'fab fa-telegram', url: function (u) { return 'https://t.me/' + u; } },
        { name: 'Keybase', icon: 'fas fa-key', url: function (u) { return 'https://keybase.io/' + u; } },
        { name: 'Hacker News', icon: 'fab fa-hacker-news', url: function (u) { return 'https://news.ycombinator.com/user?id=' + u; } },
        { name: 'Pinterest', icon: 'fab fa-pinterest', url: function (u) { return 'https://www.pinterest.com/' + u; } },
        { name: 'Dev.to', icon: 'fab fa-dev', url: function (u) { return 'https://dev.to/' + u; } }
    ];
    function loadProfiles(username, container) {
        var card = addSection(container, 'Presencia en plataformas', 'fa-user-secret', '#10b981');
        var html = '<div class="osint-muted">Enlaces directos al perfil con ese nombre de usuario. Ábrelos para confirmar si la cuenta existe.</div>' +
            '<div class="osint-link-grid">' + USER_PLATFORMS.map(function (p) {
                return '<a class="osint-link" href="' + esc(p.url(enc(username))) + '" target="_blank" rel="noopener">' +
                    '<i class="' + p.icon + '"></i> ' + esc(p.name) + '</a>';
            }).join('') + '</div>';
        finish(card, html, 'enlaces');
    }

    // ---------- Directorio de herramientas ----------
    var TOOLS = {
        ip: [
            { name: 'Shodan', icon: 'fas fa-server', desc: 'Puertos y servicios', url: function (q) { return 'https://www.shodan.io/host/' + enc(q); } },
            { name: 'VirusTotal', icon: 'fas fa-virus', desc: 'Reputación de la IP', url: function (q) { return 'https://www.virustotal.com/gui/ip-address/' + enc(q); } },
            { name: 'AbuseIPDB', icon: 'fas fa-ban', desc: 'Reportes de abuso', url: function (q) { return 'https://www.abuseipdb.com/check/' + enc(q); } },
            { name: 'IPinfo', icon: 'fas fa-location-dot', desc: 'ASN y geolocalización', url: function (q) { return 'https://ipinfo.io/' + enc(q); } },
            { name: 'Hurricane Electric', icon: 'fas fa-diagram-project', desc: 'BGP y rutas', url: function (q) { return 'https://bgp.he.net/ip/' + enc(q); } },
            { name: 'urlscan.io', icon: 'fas fa-eye', desc: 'Escaneos que mencionan la IP', url: function (q) { return 'https://urlscan.io/ip/' + enc(q); } },
            { name: 'GreyNoise', icon: 'fas fa-wave-square', desc: 'Ruido de Internet', url: function (q) { return 'https://viz.greynoise.io/ip/' + enc(q); } },
            { name: 'Censys', icon: 'fas fa-satellite-dish', desc: 'Superficie expuesta', url: function (q) { return 'https://search.censys.io/hosts/' + enc(q); } }
        ],
        domain: [
            { name: 'VirusTotal', icon: 'fas fa-virus', desc: 'Reputación del dominio', url: function (q) { return 'https://www.virustotal.com/gui/domain/' + enc(q); } },
            { name: 'Shodan', icon: 'fas fa-server', desc: 'Hosts por hostname', url: function (q) { return 'https://www.shodan.io/search?query=' + enc('hostname:' + q); } },
            { name: 'crt.sh', icon: 'fas fa-certificate', desc: 'Certificados y subdominios', url: function (q) { return 'https://crt.sh/?q=' + enc('%.' + q); } },
            { name: 'SecurityTrails', icon: 'fas fa-diagram-project', desc: 'Histórico DNS', url: function (q) { return 'https://securitytrails.com/domain/' + enc(q) + '/dns'; } },
            { name: 'urlscan.io', icon: 'fas fa-eye', desc: 'Escaneos del dominio', url: function (q) { return 'https://urlscan.io/domain/' + enc(q); } },
            { name: 'who.is', icon: 'fas fa-address-card', desc: 'Whois', url: function (q) { return 'https://who.is/whois/' + enc(q); } },
            { name: 'Wayback Machine', icon: 'fas fa-clock-rotate-left', desc: 'Histórico web', url: function (q) { return 'https://web.archive.org/web/*/' + enc(q); } },
            { name: 'Google Safe Browsing', icon: 'fas fa-shield-halved', desc: 'Estado de seguridad', url: function (q) { return 'https://transparencyreport.google.com/safe-browsing/search?url=' + enc(q); } },
            { name: 'MXToolbox', icon: 'fas fa-envelope-open-text', desc: 'Salud del correo', url: function (q) { return 'https://mxtoolbox.com/domain/' + enc(q) + '/'; } },
            { name: 'Cloudflare Radar', icon: 'fas fa-signal', desc: 'Tráfico y rankings', url: function (q) { return 'https://radar.cloudflare.com/domains/domain/' + enc(q); } }
        ],
        email: [
            { name: 'Have I Been Pwned', icon: 'fas fa-shield-halved', desc: 'Filtraciones conocidas', url: function (q) { return 'https://haveibeenpwned.com/'; } },
            { name: 'Epieos', icon: 'fas fa-magnifying-glass', desc: 'Cuentas asociadas', url: function (q) { return 'https://epieos.com/?q=' + enc(q) + '&t=email'; } },
            { name: 'Hunter', icon: 'fas fa-crosshairs', desc: 'Verificador de email', url: function (q) { return 'https://hunter.io/email-verifier/' + enc(q); } },
            { name: 'Intelligence X', icon: 'fas fa-database', desc: 'Búsqueda en filtraciones', url: function (q) { return 'https://intelx.io/?s=' + enc(q); } },
            { name: 'Dehashed', icon: 'fas fa-key', desc: 'Credenciales filtradas (pago)', url: function (q) { return 'https://dehashed.com/search?query=' + enc(q); } },
            { name: 'Gravatar', icon: 'fas fa-user-circle', desc: 'Avatar público', url: function (q) { return 'https://es.gravatar.com/'; } }
        ],
        username: [
            { name: 'WhatsMyName', icon: 'fas fa-user-secret', desc: 'Enumeración de usuarios', url: function () { return 'https://whatsmyname.app/'; } },
            { name: 'Namechk', icon: 'fas fa-check-double', desc: 'Disponibilidad del alias', url: function () { return 'https://namechk.com/'; } },
            { name: 'GitHub Search', icon: 'fab fa-github', desc: 'Buscar usuarios', url: function (q) { return 'https://github.com/search?q=' + enc(q) + '&type=users'; } },
            { name: 'Sherlock', icon: 'fas fa-code', desc: 'CLI open source', url: function () { return 'https://github.com/sherlock-project/sherlock'; } },
            { name: 'Maigret', icon: 'fas fa-code', desc: 'CLI open source', url: function () { return 'https://github.com/soxoj/maigret'; } }
        ],
        hash: [
            { name: 'VirusTotal', icon: 'fas fa-virus', desc: 'Reputación del hash', url: function (q) { return 'https://www.virustotal.com/gui/search/' + enc(q); } },
            { name: 'MalwareBazaar', icon: 'fas fa-bug', desc: 'Muestras de malware', url: function (q) { return 'https://bazaar.abuse.ch/sample/' + enc(q) + '/'; } },
            { name: 'Hybrid Analysis', icon: 'fas fa-flask', desc: 'Análisis dinámico', url: function (q) { return 'https://www.hybrid-analysis.com/search?query=' + enc(q); } },
            { name: 'Triage', icon: 'fas fa-microscope', desc: 'Sandbox público', url: function (q) { return 'https://tria.ge/s?q=' + enc(q); } },
            { name: 'CyberChef', icon: 'fas fa-blender', desc: 'Decodificar y transformar', url: function () { return 'https://gchq.github.io/CyberChef/'; } }
        ],
        url: [
            { name: 'VirusTotal', icon: 'fas fa-virus', desc: 'Reputación de la URL', url: function (q) { return 'https://www.virustotal.com/gui/search/' + enc(q); } },
            { name: 'urlscan.io', icon: 'fas fa-eye', desc: 'Escaneos públicos', url: function (q) { return 'https://urlscan.io/search/#' + enc(q); } },
            { name: 'Live Screenshot', icon: 'fas fa-camera', desc: 'Captura en vivo', url: function (q) { return 'https://urlscan.io/liveshot/?url=' + enc(q); } },
            { name: 'Wayback Machine', icon: 'fas fa-clock-rotate-left', desc: 'Histórico de la URL', url: function (q) { return 'https://web.archive.org/web/*/' + enc(q); } },
            { name: 'archive.today', icon: 'fas fa-box-archive', desc: 'Copia archivada', url: function (q) { return 'https://archive.ph/newest/' + enc(q); } },
            { name: 'Google Safe Browsing', icon: 'fas fa-shield-halved', desc: 'Estado de seguridad', url: function (q) { return 'https://transparencyreport.google.com/safe-browsing/search?url=' + enc(q); } }
        ],
        phone: [
            { name: 'Truecaller', icon: 'fas fa-phone', desc: 'Identificación de llamadas', url: function () { return 'https://www.truecaller.com/'; } },
            { name: 'NumLookup', icon: 'fas fa-magnifying-glass', desc: 'Búsqueda inversa', url: function () { return 'https://www.numlookup.com/'; } },
            { name: 'PhoneInfoga', icon: 'fas fa-code', desc: 'CLI open source', url: function () { return 'https://github.com/sundowndev/phoneinfoga'; } },
            { name: 'Google', icon: 'fab fa-google', desc: 'Buscar el número exacto', url: function (q) { return 'https://www.google.com/search?q=' + enc('"' + q + '"'); } }
        ],
        query: [],
        general: [
            { name: 'OSINT Framework', icon: 'fas fa-sitemap', desc: 'Mapa de herramientas', url: function () { return 'https://osintframework.com/'; } },
            { name: 'Bellingcat Toolkit', icon: 'fas fa-toolbox', desc: 'Investigación abierta', url: function () { return 'https://bellingcat.gitbook.io/toolkit'; } },
            { name: 'IntelTechniques', icon: 'fas fa-user-secret', desc: 'Herramientas OSINT', url: function () { return 'https://inteltechniques.com/tools/'; } },
            { name: 'Google Advanced Search', icon: 'fab fa-google', desc: 'Operadores avanzados', url: function () { return 'https://www.google.com/advanced_search'; } },
            { name: 'Yandex Images', icon: 'fas fa-images', desc: 'Búsqueda inversa', url: function () { return 'https://yandex.com/images/'; } },
            { name: 'TinEye', icon: 'fas fa-magnifying-glass', desc: 'Búsqueda inversa', url: function () { return 'https://tineye.com/'; } },
            { name: 'archive.today', icon: 'fas fa-box-archive', desc: 'Archivo de páginas', url: function () { return 'https://archive.ph/'; } },
            { name: 'CyberChef', icon: 'fas fa-blender', desc: 'Análisis y decodificación', url: function () { return 'https://gchq.github.io/CyberChef/'; } },
            { name: 'Have I Been Pwned', icon: 'fas fa-shield-halved', desc: 'Filtraciones', url: function () { return 'https://haveibeenpwned.com/'; } },
            { name: 'Intelligence X', icon: 'fas fa-database', desc: 'Buscador de filtraciones', url: function () { return 'https://intelx.io/'; } }
        ]
    };

    function renderTools(kind, query, container) {
        var groups = [];
        if (TOOLS[kind] && TOOLS[kind].length) groups.push({ title: TYPES[kind].label, items: TOOLS[kind] });
        groups.push({ title: 'Recursos generales', items: TOOLS.general });

        var card = document.createElement('div');
        card.className = 'result osint-section';
        var html = '<div class="osint-section-head"><span><i class="fas fa-toolbox" style="color:var(--primary)"></i> Herramientas OSINT</span>' +
            '<span class="osint-status">' + (kind === 'query' ? 'directorio' : 'según el tipo detectado') + '</span></div>' +
            '<div class="osint-section-body">';
        groups.forEach(function (group) {
            html += '<div class="osint-subtitle">' + esc(group.title) + '</div><div class="osint-link-grid">' +
                group.items.map(function (t) {
                    return '<a class="osint-tool" href="' + esc(t.url(query)) + '" target="_blank" rel="noopener">' +
                        '<i class="' + t.icon + '"></i><span><strong>' + esc(t.name) + '</strong><small>' + esc(t.desc) + '</small></span></a>';
                }).join('') + '</div>';
        });
        html += '</div>';
        card.innerHTML = html;
        container.appendChild(card);
    }

    // ---------- Dorks ----------
    function buildDorks(query, kind) {
        var dorks = [];
        function add(label, q) { dorks.push({ label: label, q: q }); }
        var exact = '"' + query + '"';
        if (kind === 'domain') {
            add('Todo el sitio', 'site:' + query);
            add('Sin la portada', 'site:' + query + ' -site:www.' + query);
            add('Documentos PDF', 'site:' + query + ' filetype:pdf');
            add('Paneles y login', 'site:' + query + ' (inurl:admin OR inurl:login)');
            add('Archivos expuestos', 'site:' + query + ' (ext:env OR ext:sql OR ext:bak)');
            add('Menciones del dominio', exact + ' -site:' + query);
            add('Emails del dominio', '"@' + query + '"');
        } else if (kind === 'email') {
            add('Email exacto', exact);
            add('En documentos', exact + ' filetype:pdf');
            add('En pastebins', exact + ' site:pastebin.com');
            add('En repositorios', exact + ' site:github.com');
            add('En filtraciones', exact + ' (password OR contraseña OR leak)');
        } else if (kind === 'ip') {
            add('IP exacta', exact);
            add('En pastebins', exact + ' site:pastebin.com');
            add('En reportes', exact + ' (abuse OR malware OR botnet)');
        } else if (kind === 'username') {
            add('Usuario exacto', exact);
            add('En GitHub', exact + ' site:github.com');
            add('En Reddit', exact + ' site:reddit.com');
            add('En foros', exact + ' (forum OR foro OR perfil)');
        } else if (kind === 'url') {
            add('URL exacta', exact);
            if (hostOf(query)) add('Dominio en el texto', exact + ' -site:' + hostOf(query));
        } else if (kind === 'hash') {
            add('Hash exacto', exact);
            add('En reportes de malware', exact + ' (malware OR sample OR IOC)');
        } else if (kind === 'phone') {
            add('Número exacto', exact);
            add('En redes', exact + ' (whatsapp OR telegram OR teléfono)');
        } else {
            add('Frase exacta', exact);
            add('Documentos PDF', exact + ' filetype:pdf');
            add('En GitHub', exact + ' site:github.com');
            add('En pastebins', exact + ' site:pastebin.com');
            add('En Reddit', exact + ' site:reddit.com');
        }
        return dorks;
    }
    function renderDorks(query, kind, container) {
        var dorks = buildDorks(query, kind);
        var card = document.createElement('div');
        card.className = 'result osint-section';
        var rows = dorks.map(function (d) {
            return '<div class="osint-dork">' +
                '<a href="https://www.google.com/search?q=' + enc(d.q) + '" target="_blank" rel="noopener"><i class="fab fa-google"></i> ' + esc(d.label) + '</a>' +
                '<code>' + esc(d.q) + '</code>' +
                '</div>';
        }).join('');
        card.innerHTML = '<div class="osint-section-head"><span><i class="fas fa-filter" style="color:var(--primary)"></i> Google Dorks sugeridos</span>' +
            '<span class="osint-status">abre en Google</span></div>' +
            '<div class="osint-section-body"><div class="osint-muted">Consultas listas para copiar o abrir. Úsalas solo sobre información pública.</div>' +
            rows +
            '<div class="osint-dork-actions">' +
            '<a class="btn btn-secondary" href="https://www.bing.com/search?q=' + enc(query) + '" target="_blank" rel="noopener"><i class="fab fa-microsoft"></i> Bing</a>' +
            '<a class="btn btn-secondary" href="https://duckduckgo.com/?q=' + enc(query) + '" target="_blank" rel="noopener"><i class="fas fa-search"></i> DuckDuckGo</a>' +
            '</div></div>';
        container.appendChild(card);
    }

    // ---------- Cabecera ----------
    function renderHeader(query, kind, container) {
        var meta = TYPES[kind];
        var card = document.createElement('div');
        card.className = 'result';
        card.style.borderLeft = '4px solid ' + meta.color;
        var subtitle = {
            ip: 'Geolocalización, puertos y CVEs observados pasivamente.',
            domain: 'DNS, registro RDAP, subdominios y histórico web.',
            email: 'Huella pública y configuración de correo del dominio.',
            username: 'Cuenta de GitHub y presencia en plataformas.',
            hash: 'Tipo de hash y enlaces a análisis de malware.',
            url: 'Dominio subyacente, histórico y reputación del enlace.',
            phone: 'Enlaces de búsqueda inversa (sin consultas automáticas).',
            query: 'Elige un tipo de dato o consulta las herramientas del directorio.'
        }[kind];
        if (kind === 'query' && query) subtitle = 'No se detectó un tipo concreto. Prueba con un dominio, IP, email o usuario; abajo tienes dorks y herramientas.';

        var html = '<div class="osint-head">' +
            '<div class="osint-head-icon" style="background:linear-gradient(135deg,' + meta.color + ',rgba(0,0,0,0.35))">' +
            '<i class="fas ' + meta.icon + '"></i></div>' +
            '<div style="min-width:0;">' +
            '<strong style="color:' + meta.color + ';font-size:1.15em;">Modo OSINT</strong>' +
            '<h3 style="margin:2px 0;color:var(--text);word-break:break-word;">' + (query ? '"' + esc(query) + '"' : 'Inteligencia de fuentes abiertas') + '</h3>' +
            '<div class="osint-muted">' + esc(subtitle) + '</div>' +
            '</div>' +
            (query ? '<span class="osint-badge" style="border-color:' + meta.color + '55;color:' + meta.color + '">' + esc(meta.label) + '</span>' : '') +
            '</div>' +
            '<div class="osint-notice"><i class="fas fa-scale-balanced"></i> Solo fuentes públicas. No se realizan escaneos activos ni intentos de acceso. Respeta los términos de cada servicio y la privacidad de terceros.</div>';

        if (!query) {
            html += '<div class="osint-muted" style="margin-top:12px;">Escribe una IP, dominio, email, usuario, hash, URL o teléfono para iniciar el análisis. También puedes usar el directorio de abajo sin escribir nada.</div>';
        }
        card.innerHTML = html;
        container.appendChild(card);
    }

    // ---------- Pipeline por tipo ----------
    function enrichDomain(domain, container) {
        loadDns(domain, container);
        loadRdap(domain, container);
        loadSubdomains(domain, container);
        loadWayback(domain, container, 'Dominio');
    }

    function render(query, container) {
        var q = (query || '').trim();
        var kind = detectType(q);
        var value = normalize(kind, q);

        renderHeader(q, kind, container);

        if (!q) {
            renderTools(kind, '', container);
            return;
        }

        try {
            switch (kind) {
                case 'ip':
                    loadIpGeo(value, container);
                    loadInternetDb(value, container);
                    break;
                case 'domain':
                    enrichDomain(value, container);
                    break;
                case 'email':
                    loadEmailRep(value, container);
                    loadEmailDomain(value, container);
                    break;
                case 'username':
                    loadGithub(value, container);
                    loadProfiles(value, container);
                    break;
                case 'hash':
                    var hashCard = document.createElement('div');
                    hashCard.className = 'result osint-section';
                    hashCard.innerHTML = '<div class="osint-section-head"><span><i class="fas fa-fingerprint" style="color:#ef4444"></i> Identificación del hash</span><span class="osint-status">local</span></div>' +
                        '<div class="osint-section-body">' + kvGrid([
                            { label: 'Algoritmo probable', value: hashKind(value) },
                            { label: 'Longitud', value: value.length + ' caracteres hexadecimales' }
                        ]) + '<div class="osint-foot">No se envía el hash a ningún servicio automáticamente. Usa las herramientas para consultarlo.</div></div>';
                    container.appendChild(hashCard);
                    break;
                case 'url':
                    var host = hostOf(value);
                    var urlCard = document.createElement('div');
                    urlCard.className = 'result osint-section';
                    urlCard.innerHTML = '<div class="osint-section-head"><span><i class="fas fa-link" style="color:#3b82f6"></i> Componentes de la URL</span><span class="osint-status">local</span></div>' +
                        '<div class="osint-section-body">' + kvGrid([
                            { label: 'Host', value: host || '(no válido)' },
                            { label: 'Esquema', value: (function () { try { return new URL(value).protocol.replace(':', ''); } catch (e) { return ''; } })() },
                            { label: 'Ruta', value: (function () { try { return new URL(value).pathname + new URL(value).search; } catch (e) { return ''; } })() }
                        ]) + '</div>';
                    container.appendChild(urlCard);
                    if (host && detectType(host) === 'domain') enrichDomain(host, container);
                    loadWayback(value, container, 'URL');
                    break;
                case 'phone':
                    var phoneCard = document.createElement('div');
                    phoneCard.className = 'result osint-section';
                    phoneCard.innerHTML = '<div class="osint-section-head"><span><i class="fas fa-phone" style="color:#14b8a6"></i> Número detectado</span><span class="osint-status">local</span></div>' +
                        '<div class="osint-section-body">' + kvGrid([
                            { label: 'Dígitos', value: value },
                            { label: 'Dígitos totales', value: String((value.match(/\d/g) || []).length) }
                        ]) + '<div class="osint-foot">La búsqueda inversa de teléfonos solo se ofrece como enlace externo: muchos servicios requieren cuenta y tienen límites estrictos.</div></div>';
                    container.appendChild(phoneCard);
                    break;
                default:
                    var hint = document.createElement('div');
                    hint.className = 'result osint-section';
                    hint.innerHTML = '<div class="osint-section-head"><span><i class="fas fa-magnifying-glass" style="color:var(--primary)"></i> Consulta libre</span><span class="osint-status">sugerencias</span></div>' +
                        '<div class="osint-section-body"><div class="osint-muted">No se detectó un tipo de dato concreto. Prueba con un dominio (ej. <code>ejemplo.com</code>), una IP (<code>8.8.8.8</code>), un email o un usuario. Mientras tanto, usa los dorks y el directorio.</div></div>';
                    container.appendChild(hint);
            }

            if (q) renderDorks(value, kind, container);
            renderTools(kind, q, container);
        } catch (e) {
            console.warn('OSINT:', e);
            var errorCard = addSection(container, 'Error', 'fa-triangle-exclamation', '#ef4444');
            fail(errorCard, 'No se pudo procesar la consulta.');
        }
    }

    window.OSINT = {
        render: render,
        detectType: detectType,
        _md5: md5
    };
})();
