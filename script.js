(function() {
    'use strict';

    // ===== DRAWER CONTROL =====
    const burger = document.getElementById('burgerBtn');
    const overlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('drawer');
    const closeBtn = document.getElementById('drawerCloseBtn');

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

    // ===== FITUR SWITCH =====
    let currentFeature = 'tiktok';
    const urlInput = document.getElementById('urlInput');
    const fetchBtn = document.getElementById('fetchBtn');
    const placeholder = document.getElementById('placeholder');
    const resultContent = document.getElementById('resultContent');

    // Event listener untuk drawer menu
    document.querySelectorAll('.drawer-menu-item').forEach(el => {
        el.addEventListener('click', function() {
            const feature = this.dataset.feature;
            setActiveFeature(feature);
        });
    });

    // Event listener untuk feature cards
    document.querySelectorAll('.feature-card').forEach(el => {
        el.addEventListener('click', function() {
            const feature = this.dataset.feature;
            setActiveFeature(feature);
        });
    });

    function setActiveFeature(feature) {
        currentFeature = feature;

        // Update drawer menu
        document.querySelectorAll('.drawer-menu-item').forEach(el => {
            el.classList.toggle('active', el.dataset.feature === feature);
        });

        // Update feature cards
        document.querySelectorAll('.feature-card').forEach(el => {
            el.classList.toggle('active', el.dataset.feature === feature);
        });

        // Update placeholder URL
        const example = CONFIG.EXAMPLES[feature] || '';
        const labels = {
            tiktok: 'https://vt.tiktok.com/ZSXe89SB8/',
            youtube: 'https://youtu.be/nNcWorl87h0',
            instagram: 'https://www.instagram.com/reel/DZZdzQzxPRM',
            spotify: 'https://open.spotify.com/track/2sULdMKWdBdK2ZtntuFvSb'
        };
        urlInput.placeholder = labels[feature] || 'Masukkan URL...';
        if (!urlInput.value || urlInput.value === CONFIG.EXAMPLES[Object.keys(CONFIG.EXAMPLES).find(k => k !== feature)]) {
            urlInput.value = example;
        }

        // Reset result
        placeholder.style.display = 'flex';
        resultContent.style.display = 'none';
        placeholder.innerHTML = `
            <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 2v4M16 2v4"/></svg>
            <span>Masukkan URL ${feature} dan klik Ambil</span>
        `;

        closeDrawer();
    }

    // ===== RENDER HASIL =====
    function renderResult(data) {
        placeholder.style.display = 'none';
        resultContent.style.display = 'block';

        if (!data) {
            resultContent.innerHTML = `<span style="color:#f28b82;">⚠️ Data kosong atau tidak valid.</span>`;
            return;
        }

        // Ambil data dari berbagai kemungkinan struktur
        let d = data.data || data.result || data;
        if (Array.isArray(d)) d = d[0] || {};

        // Cek error
        const errorMsg = d.message || d.error || d.msg || '';
        const isError = data.status === false || data.success === false || (errorMsg && errorMsg.toLowerCase().includes('gagal'));

        const title = d.title || d.name || d.judul || 'Tanpa judul';
        const author = d.author || d.artist || d.creator || d.publisher || 'Tidak diketahui';
        const thumbnail = d.thumbnail || d.cover || d.thumb || d.picture || '';
        let links = d.links || d.download || d.url || d.urls || [];

        if (typeof links === 'string') links = [links];
        if (!Array.isArray(links)) links = [];
        links = links.filter(l => l && l !== '/');

        let html = '';

        // Tampilkan peringatan jika error
        if (isError) {
            html += `
                <div style="background:rgba(255,200,50,0.06); border:1px solid rgba(255,200,50,0.1); border-radius:14px; padding:1rem; margin-bottom:1rem;">
                    <div style="display:flex; align-items:center; gap:10px; color:#f0c050;">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#f0c050" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span style="font-weight:500;">${errorMsg || 'Gagal mendapatkan link download'}</span>
                    </div>
                    <div style="margin-top:0.4rem; color:#8a9aaf; font-size:0.8rem;">
                        ${currentFeature === 'spotify' ? 'Spotify memerlukan API key premium. Hubungi @lordsaurus untuk mendapatkan key.' : ''}
                        ${currentFeature === 'instagram' ? 'Pastikan link Reels/Postingan benar dan publik.' : ''}
                        ${currentFeature === 'tiktok' ? 'Pastikan link TikTok benar dan bisa diakses publik.' : ''}
                        ${currentFeature === 'youtube' ? 'Pastikan link YouTube benar dan bisa diakses publik.' : ''}
                    </div>
                </div>
            `;
        }

        // Metadata
        html += `<div class="meta">
            <div><strong>Judul</strong> ${title}</div>
            <div><strong>Kreator</strong> ${author}</div>
        </div>`;

        // Thumbnail
        if (thumbnail && thumbnail !== '') {
            html += `<img class="thumbnail" src="${thumbnail}" alt="thumbnail" loading="lazy" onerror="this.style.display='none'">`;
        }

        // Link download
        if (links.length > 0) {
            html += `<div class="link-list">`;
            links.forEach((link, idx) => {
                let label = `Tautan ${idx+1}`;
                if (typeof link === 'string') {
                    if (link.includes('play.google.com')) label = '📱 Google Play';
                    else if (link.includes('rapidcdn') || link.includes('.mp4') || link.includes('.mp3') || link.includes('.m4a')) label = '⬇️ Download';
                    else if (link.includes('youtube.com') || link.includes('youtu.be')) label = '▶️ Tonton';
                    else if (link.includes('open.spotify.com')) label = '🎵 Buka Spotify';
                }
                html += `<a href="${link}" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    ${label}
                </a>`;
            });
            html += `</div>`;
        } else if (!isError) {
            html += `<div style="color:#7a8aa8; margin-top:0.6rem; padding:0.8rem; background:rgba(255,255,255,0.02); border-radius:12px;">
                Tidak ada tautan download tersedia.
                ${currentFeature === 'spotify' ? 'Coba gunakan link lagu yang berbeda atau pastikan API key premium aktif.' : ''}
            </div>`;
        }

        // Tampilkan input URL
        if (d.input) {
            html += `<div style="margin-top:0.8rem; color:#5a6f8f; font-size:0.65rem; border-top:1px solid rgba(255,255,255,0.03); padding-top:0.5rem; word-break:break-all;">🔗 ${d.input}</div>`;
        }

        // Tips Spotify
        if (currentFeature === 'spotify' && isError) {
            html += `
                <div style="margin-top:1rem; padding:1rem; background:rgba(30,144,255,0.04); border:1px solid rgba(30,144,255,0.06); border-radius:14px;">
                    <div style="display:flex; align-items:center; gap:10px; color:#7ac7ff;">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="#7ac7ff" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                        <span style="font-weight:500;">Butuh API Key Premium?</span>
                    </div>
                    <div style="margin-top:0.4rem; color:#8a9aaf; font-size:0.8rem; line-height:1.6;">
                        Spotify download memerlukan API key premium dari Synox Cloud.<br>
                        Hubungi <strong style="color:#d4e0f5;">@lordsaurus</strong> di Telegram untuk mendapatkan key permanen (Rp15.000 sekali bayar).<br>
                        Setelah punya key, masukkan di <code style="background:rgba(255,255,255,0.04); padding:0.1rem 0.4rem; border-radius:4px; color:#90b4f0;">config.js</code> pada variabel <code style="background:rgba(255,255,255,0.04); padding:0.1rem 0.4rem; border-radius:4px; color:#90b4f0;">API_KEY</code>.
                    </div>
                </div>
            `;
        }

        resultContent.innerHTML = html;
    }

    // ===== FETCH DATA =====
    async function fetchData() {
        let rawUrl = urlInput.value.trim();
        if (!rawUrl) {
            placeholder.style.display = 'flex';
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
            placeholder.style.display = 'flex';
            resultContent.style.display = 'none';
            placeholder.innerHTML = `<span style="color:#f28b82;">⚠️ Fitur ${currentFeature} belum didukung.</span>`;
            return;
        }

        const encoded = encodeURIComponent(rawUrl);
        let fullUrl = `${CONFIG.BASE_URL}${endpoint}?url=${encoded}`;

        if (CONFIG.USE_CORS_PROXY) {
            fullUrl = `${CONFIG.CORS_PROXY_URL}${encodeURIComponent(fullUrl)}`;
        }

        // Loader
        placeholder.style.display = 'flex';
        resultContent.style.display = 'none';
        placeholder.innerHTML = `
            <div class="loader">
                <svg class="spinner-svg" viewBox="0 0 24 24"><path d="M12 2v4M12 22v-4M4 12H2M22 12h-2M19.07 4.93l-2.83 2.83M6.34 17.66l-2.83 2.83M17.66 6.34l2.83-2.83M4.93 19.07l2.83-2.83"/></svg>
                <span>Memproses · Randa</span>
            </div>
        `;

        try {
            const headers = { 'Accept': 'application/json' };
            if (CONFIG.API_KEY && CONFIG.API_KEY.length > 0) {
                headers['X-API-Key'] = CONFIG.API_KEY;
            }

            const response = await fetch(fullUrl, { method: 'GET', headers: headers });

            if (!response.ok) {
                let errorMsg = `HTTP ${response.status}`;
                try {
                    const errData = await response.json();
                    errorMsg = errData.message || errData.error || errorMsg;
                } catch (_) {}
                throw new Error(errorMsg);
            }

            const json = await response.json();

            // Cek status — termasuk status false dengan data result (Spotify)
            if (json.status === true || json.statusCode === 200 || json.success === true) {
                renderResult(json);
            } else if (json.status === false && json.result) {
                // Kasus Spotify: status false tapi ada data result
                renderResult(json);
            } else {
                throw new Error(json.message || json.error || 'API merespons dengan status gagal');
            }

        } catch (err) {
            placeholder.style.display = 'flex';
            resultContent.style.display = 'none';

            let errorMessage = err.message;
            if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
                errorMessage = 'Gagal terhubung ke API. Coba aktifkan USE_CORS_PROXY = true di config.js';
            }

            placeholder.innerHTML = `
                <div style="color:#f28b82; display:flex; gap:10px; align-items:center;">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="#f28b82" stroke-width="1.8" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>Gagal: ${errorMessage}</span>
                </div>
            `;
            console.warn('[Randa] fetch error:', err);
        }
    }

    // ===== EVENT BINDING =====
    fetchBtn.addEventListener('click', fetchData);
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') fetchData();
    });

    // ===== INISIALISASI =====
    setActiveFeature('tiktok');

})();
