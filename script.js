// ============================================================
//  LOGIKA UTAMA — dengan penanganan CORS & error
// ============================================================
(function() {
    'use strict';

    // ---- DOM refs ----
    const burger       = document.getElementById('burgerBtn');
    const overlay      = document.getElementById('drawerOverlay');
    const drawer       = document.getElementById('drawer');
    const closeBtn     = document.getElementById('drawerCloseBtn');
    const urlInput     = document.getElementById('urlInput');
    const fetchBtn     = document.getElementById('fetchBtn');
    const placeholder  = document.getElementById('placeholder');
    const resultContent = document.getElementById('resultContent');

    // ---- state ----
    let currentFeature = 'tiktok';

    // ---- drawer ----
    function openDrawer() {
        overlay.classList.add('open');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        overlay.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    burger.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // ---- switch fitur ----
    function setActiveFeature(feature) {
        currentFeature = feature;

        document.querySelectorAll('.drawer-menu-item').forEach(el => {
            el.classList.toggle('active', el.dataset.feature === feature);
        });

        document.querySelectorAll('.feature-card').forEach(el => {
            el.classList.toggle('active', el.dataset.feature === feature);
        });

        const example = CONFIG.EXAMPLES[feature] || '';
        urlInput.placeholder = `Masukkan URL ${feature.charAt(0).toUpperCase() + feature.slice(1)}...`;
        if (!urlInput.value || urlInput.value === CONFIG.EXAMPLES[Object.keys(CONFIG.EXAMPLES).find(k => k !== feature)]) {
            urlInput.value = example;
        }

        placeholder.style.display = 'flex';
        resultContent.style.display = 'none';
        placeholder.innerHTML = `
            <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 2v4M16 2v4"/></svg>
            <span>Pilih URL ${feature} dan klik Ambil</span>
        `;

        closeDrawer();
    }

    document.querySelectorAll('.drawer-menu-item').forEach(el => {
        el.addEventListener('click', () => setActiveFeature(el.dataset.feature));
    });

    document.querySelectorAll('.feature-card').forEach(el => {
        el.addEventListener('click', () => setActiveFeature(el.dataset.feature));
    });

    // ---- render hasil ----
    function renderResult(data) {
        placeholder.style.display = 'none';
        resultContent.style.display = 'block';

        if (!data) {
            resultContent.innerHTML = `<span style="color:#f28b82;">⚠️ Data kosong atau tidak valid.</span>`;
            return;
        }

        // Cek berbagai kemungkinan struktur response
        const d = data.data || data.result || data;
        const title = d.title || d.name || d.judul || 'Tanpa judul';
        const author = d.author || d.artist || d.creator || 'Tidak diketahui';
        const thumbnail = d.thumbnail || d.cover || d.thumb || '';
        let links = d.links || d.download || d.url || [];

        if (typeof links === 'string') links = [links];
        if (!Array.isArray(links)) links = [];

        let html = `<div class="meta">
            <div><strong>Judul</strong> ${title}</div>
            <div><strong>Kreator</strong> ${author}</div>
        </div>`;

        if (thumbnail) {
            html += `<img class="thumbnail" src="${thumbnail}" alt="thumbnail" loading="lazy" onerror="this.style.display='none'">`;
        }

        if (links.length > 0) {
            html += `<div class="link-list">`;
            links.forEach((link, idx) => {
                if (!link || link === '/') return;
                let label = `Tautan ${idx+1}`;
                if (typeof link === 'string') {
                    if (link.includes('play.google.com')) label = 'Google Play';
                    else if (link.includes('rapidcdn') || link.includes('.mp4') || link.includes('.mp3')) label = 'Unduh';
                    else if (link.includes('youtube.com') || link.includes('youtu.be')) label = 'Tonton di YouTube';
                }
                html += `<a href="${link}" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    ${label}
                </a>`;
            });
            html += `</div>`;
        } else {
            html += `<div style="color:#7a8aa8; margin-top:0.6rem;">Tidak ada tautan tersedia.</div>`;
        }

        // Tampilkan juga raw data jika ada info tambahan
        if (d.description || d.caption) {
            html += `<div style="margin-top:0.8rem; color:#8aa0c0; font-size:0.8rem; border-top:1px solid rgba(255,255,255,0.04); padding-top:0.6rem;">${d.description || d.caption}</div>`;
        }

        resultContent.innerHTML = html;
    }

    // ---- fetch data dengan CORS handling ----
    async function fetchData() {
        const rawUrl = urlInput.value.trim();
        if (!rawUrl) {
            placeholder.style.display = 'block';
            resultContent.style.display = 'none';
            placeholder.innerHTML = `
                <div style="color:#f28b82; display:flex; gap:10px; align-items:center;">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="#f28b82" stroke-width="1.8" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>Masukkan URL terlebih dahulu.</span>
                </div>
            `;
            return;
        }

        const endpoint = CONFIG.ENDPOINTS[currentFeature];
        if (!endpoint) {
            placeholder.style.display = 'block';
            resultContent.style.display = 'none';
            placeholder.innerHTML = `<span style="color:#f28b82;">⚠️ Fitur ${currentFeature} belum didukung.</span>`;
            return;
        }

        const encoded = encodeURIComponent(rawUrl);
        let fullUrl = `${CONFIG.BASE_URL}${endpoint}?url=${encoded}`;

        // Gunakan CORS proxy jika diperlukan
        if (CONFIG.USE_CORS_PROXY) {
            fullUrl = `${CONFIG.CORS_PROXY_URL}${encodeURIComponent(fullUrl)}`;
        }

        // Tampilkan loader
        placeholder.style.display = 'block';
        resultContent.style.display = 'none';
        placeholder.innerHTML = `
            <div class="loader">
                <svg class="spinner-svg" viewBox="0 0 24 24"><path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.34 17.66l-2.83 2.83M17.66 6.34l2.83-2.83M4.93 19.07l2.83-2.83"/></svg>
                <span>Memproses · Randa</span>
            </div>
        `;

        try {
            const headers = {
                'Accept': 'application/json'
            };

            // Tambahkan API key jika tersedia
            if (CONFIG.API_KEY && CONFIG.API_KEY.length > 0) {
                headers['X-API-Key'] = CONFIG.API_KEY;
            }

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: headers,
                // mode: 'cors', // default
                // credentials: 'omit'
            });

            if (!response.ok) {
                // Coba baca pesan error dari body
                let errorMsg = `HTTP ${response.status}`;
                try {
                    const errData = await response.json();
                    if (errData.message) errorMsg = errData.message;
                    else if (errData.error) errorMsg = errData.error;
                } catch (_) {}
                throw new Error(errorMsg);
            }

            const json = await response.json();
            
            // Cek berbagai kemungkinan status sukses
            if (json.status === true || json.statusCode === 200 || json.success === true) {
                renderResult(json);
            } else {
                throw new Error(json.message || json.error || 'Status tidak ok');
            }

        } catch (err) {
            placeholder.style.display = 'block';
            resultContent.style.display = 'none';
            
            let errorMessage = err.message;
            // Deteksi error CORS
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                errorMessage = 'Gagal terhubung ke API (CORS/Network). Coba aktifkan USE_CORS_PROXY di config.js atau gunakan VPN/browser extension CORS.';
            }
            
            placeholder.innerHTML = `
                <div style="color:#f28b82; display:flex; gap:10px; align-items:flex-start; flex-wrap:wrap;">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="#f28b82" stroke-width="1.8" fill="none" style="flex-shrink:0; margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <div>
                        <strong style="display:block;">Error:</strong>
                        <span>${errorMessage}</span>
                        <div style="margin-top:0.5rem; font-size:0.75rem; color:#6a7f9f;">
                            Tips: 
                            • Pastikan URL benar dan bisa diakses
                            • Jika pakai API key, cek kembali di config.js
                            • Coba aktifkan USE_CORS_PROXY = true di config.js
                            • Atau install extension CORS di browser
                        </div>
                    </div>
                </div>
            `;
            console.warn('[Randa] fetch error:', err);
        }
    }

    // ---- event binding ----
    fetchBtn.addEventListener('click', fetchData);
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') fetchData();
    });

    // ---- inisialisasi ----
    setActiveFeature('tiktok');

})();        });
    });

    // Event listeners untuk feature cards
    document.querySelectorAll('.feature-card').forEach(el => {
        el.addEventListener('click', () => {
            setActiveFeature(el.dataset.feature);
        });
    });

    // ---- fetch & render ----
    function renderResult(data) {
        placeholder.style.display = 'none';
        resultContent.style.display = 'block';

        if (!data || !data.data) {
            resultContent.innerHTML = `<span style="color:#f28b82;">⚠️ Data tidak lengkap atau terjadi kesalahan.</span>`;
            return;
        }

        const d = data.data;
        const title = d.title || d.name || 'Tanpa judul';
        const author = d.author || d.artist || 'Tidak diketahui';
        const thumbnail = d.thumbnail || d.cover || '';
        const links = d.links || d.download || [];

        let html = `<div class="meta">
            <div><strong>Judul</strong> ${title}</div>
            <div><strong>Kreator</strong> ${author}</div>
        </div>`;

        if (thumbnail) {
            html += `<img class="thumbnail" src="${thumbnail}" alt="thumbnail" loading="lazy" onerror="this.style.display='none'">`;
        }

        if (links && links.length > 0) {
            html += `<div class="link-list">`;
            links.forEach((link, idx) => {
                if (link === '/') return;
                const label = typeof link === 'string' && link.includes('play.google.com') ? 'Google Play' :
                              typeof link === 'string' && link.includes('rapidcdn') ? 'Unduh' :
                              `Tautan ${idx+1}`;
                html += `<a href="${link}" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    ${label}
                </a>`;
            });
            html += `</div>`;
        } else {
            html += `<div style="color:#7a8aa8; margin-top:0.6rem;">Tidak ada tautan tersedia.</div>`;
        }

        resultContent.innerHTML = html;
    }

    async function fetchData() {
        const rawUrl = urlInput.value.trim();
        if (!rawUrl) {
            placeholder.style.display = 'block';
            resultContent.style.display = 'none';
            placeholder.innerHTML = `
                <div style="color:#f28b82; display:flex; gap:10px; align-items:center;">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="#f28b82" stroke-width="1.8" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>Masukkan URL terlebih dahulu.</span>
                </div>
            `;
            return;
        }

        const endpoint = CONFIG.ENDPOINTS[currentFeature];
        if (!endpoint) {
            placeholder.style.display = 'block';
            resultContent.style.display = 'none';
            placeholder.innerHTML = `<span style="color:#f28b82;">⚠️ Fitur ${currentFeature} belum didukung.</span>`;
            return;
        }

        const encoded = encodeURIComponent(rawUrl);
        const fullUrl = `${endpoint}?url=${encoded}`;

        // Tampilkan loader
        placeholder.style.display = 'block';
        resultContent.style.display = 'none';
        placeholder.innerHTML = `
            <div class="loader">
                <svg class="spinner-svg" viewBox="0 0 24 24"><path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.34 17.66l-2.83 2.83M17.66 6.34l2.83-2.83M4.93 19.07l2.83-2.83"/></svg>
                <span>Memproses · Randa</span>
            </div>
        `;

        try {
            const response = await fetch(fullUrl, {
                headers: {
                    'Accept': 'application/json',
                    'X-API-Key': CONFIG.API_KEY
                }
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const json = await response.json();
            if (json.status === true || json.statusCode === 200) {
                renderResult(json);
            } else {
                throw new Error(json.message || 'Status tidak ok');
            }
        } catch (err) {
            placeholder.style.display = 'block';
            resultContent.style.display = 'none';
            placeholder.innerHTML = `
                <div style="color:#f28b82; display:flex; gap:10px; align-items:center;">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="#f28b82" stroke-width="1.8" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>Gagal: ${err.message}</span>
                </div>
            `;
            console.warn('[Randa] fetch error:', err);
        }
    }

    // ---- event binding ----
    fetchBtn.addEventListener('click', fetchData);
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') fetchData();
    });

    // ---- inisialisasi ----
    setActiveFeature('tiktok');

})();
