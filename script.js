// ============================================================
//  LOGIKA UTAMA
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
    let currentFeature = 'tiktok'; // default

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
        urlInput.placeholder = `Masukkan URL ${feature.charAt(0).toUpperCase() + feature.slice(1)}...`;
        if (!urlInput.value || urlInput.value === CONFIG.EXAMPLES[Object.keys(CONFIG.EXAMPLES).find(k => k !== feature)]) {
            urlInput.value = example;
        }

        // Clear result
        placeholder.style.display = 'flex';
        resultContent.style.display = 'none';
        placeholder.innerHTML = `
            <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 2v4M16 2v4"/></svg>
            <span>Pilih URL ${feature} dan klik Ambil</span>
        `;

        // Tutup drawer setelah pilih (opsional)
        closeDrawer();
    }

    // Event listeners untuk drawer menu
    document.querySelectorAll('.drawer-menu-item').forEach(el => {
        el.addEventListener('click', () => {
            setActiveFeature(el.dataset.feature);
        });
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
