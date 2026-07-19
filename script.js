(function() {
  // --- Cek apakah berada di halaman fitur (ada elemen poster) ---
  const poster = document.getElementById('poster');
  if (!poster) return;

  // --- Elemen ---
  const productDisplay = document.getElementById('productNameDisplay');
  const addressDisplay = document.getElementById('addressDisplay');
  const priceDisplay = document.getElementById('priceDisplay');

  const productInput = document.getElementById('productInput');
  const addressInput = document.getElementById('addressInput');
  const priceInput = document.getElementById('priceInput');
  const widthInput = document.getElementById('widthInput');
  const heightInput = document.getElementById('heightInput');

  const bgButtons = document.querySelectorAll('[data-bg]');
  const fileInput = document.getElementById('bgFileInput');
  const resetBgBtn = document.getElementById('resetBgBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const presetBtns = document.querySelectorAll('.preset-grid button');

  // --- Elemen Fitur Sebelumnya ---
  const titleColor = document.getElementById('titleColor');
  const addressColor = document.getElementById('addressColor');
  const priceColor = document.getElementById('priceColor');
  const fontSelect = document.getElementById('fontSelect');
  const alignBtns = document.querySelectorAll('.align-btn');

  const blurRange = document.getElementById('blurRange');
  const brightnessRange = document.getElementById('brightnessRange');
  const contrastRange = document.getElementById('contrastRange');
  const grayscaleRange = document.getElementById('grayscaleRange');
  const blurValue = document.getElementById('blurValue');
  const brightnessValue = document.getElementById('brightnessValue');
  const contrastValue = document.getElementById('contrastValue');
  const grayscaleValue = document.getElementById('grayscaleValue');

  // --- Elemen Gradient Baru ---
  const gradientBtns = document.querySelectorAll('.gradient-btn');
  const gradientCustom = document.getElementById('gradientCustom');
  const applyGradientBtn = document.getElementById('applyGradientBtn');

  // --- Elemen Watermark ---
  const watermarkInput = document.getElementById('watermarkInput');
  const watermarkColor = document.getElementById('watermarkColor');
  const watermarkOpacity = document.getElementById('watermarkOpacity');
  const watermarkOpacityValue = document.getElementById('watermarkOpacityValue');
  const watermarkPosition = document.getElementById('watermarkPosition');
  const removeWatermarkBtn = document.getElementById('removeWatermarkBtn');
  const watermarkDisplay = document.getElementById('watermarkDisplay');

  // --- Elemen Palet ---
  const paletteBtns = document.querySelectorAll('.palette-btn');

  // --- Elemen Mode ---
  const focusToggle = document.getElementById('focusToggle');
  const guideToggle = document.getElementById('guideToggle');
  const guideModal = document.getElementById('guideModal');
  const guideClose = document.getElementById('guideClose');
  const guideCloseBtn = document.getElementById('guideCloseBtn');

  // --- Auto Save ---
  let autoSaveTimer = null;
  let isSaving = false;

  // --- Toast ---
  const toastContainer = document.getElementById('toastContainer');

  // --- update teks ---
  function updateTexts() {
    productDisplay.textContent = productInput.value.trim() || 'Nama Produk';
    addressDisplay.textContent = addressInput.value.trim() || 'Alamat lengkap';
    priceDisplay.textContent = priceInput.value.trim() || 'Rp 0';

    if (typeof saveHistory === 'function') {
      saveHistory({
        product: productDisplay.textContent,
        address: addressDisplay.textContent,
        price: priceDisplay.textContent
      });
    }

    triggerAutoSave();
  }

  // --- update ukuran ---
  function updateSize() {
    let w = parseInt(widthInput.value, 10);
    let h = parseInt(heightInput.value, 10);
    if (isNaN(w) || w < 20) w = 700;
    if (isNaN(h) || h < 20) h = 840;
    if (w > 3000) w = 3000;
    if (h > 4000) h = 4000;
    widthInput.value = w;
    heightInput.value = h;
    poster.style.width = w + 'px';
    poster.style.height = h + 'px';
    poster.style.aspectRatio = 'auto';
    triggerAutoSave();
  }

  // --- background ---
  function setBackgroundFromURL(url) {
    if (!url) return;
    // Hapus gradient jika ada
    poster.style.backgroundImage = `url('${url}')`;
    // Reset active gradient buttons
    gradientBtns.forEach(btn => btn.classList.remove('active'));
    triggerAutoSave();
  }

  function resetBackground() {
    poster.style.backgroundImage = 'none';
    poster.style.backgroundColor = '#2b2b2b';
    fileInput.value = '';
    gradientBtns.forEach(btn => btn.classList.remove('active'));
    triggerAutoSave();
  }

  // --- GRADIENT FUNCTIONS ---
  function applyGradient(gradientValue) {
    if (!gradientValue || gradientValue === 'none') {
      // Jika ada gambar background, pertahankan
      if (poster.style.backgroundImage && poster.style.backgroundImage !== 'none') {
        // biarkan
      } else {
        poster.style.backgroundImage = 'none';
        poster.style.backgroundColor = '#2b2b2b';
      }
      gradientBtns.forEach(btn => btn.classList.remove('active'));
      return;
    }

    poster.style.backgroundImage = gradientValue;
    poster.style.backgroundColor = 'transparent';
    gradientBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-gradient') === gradientValue);
    });
    triggerAutoSave();
  }

  function applyCustomGradient() {
    const value = gradientCustom.value.trim();
    if (!value) {
      showToast('Peringatan', 'Masukkan nilai gradient CSS terlebih dahulu.', 'warning');
      return;
    }
    // Validasi sederhana
    if (!value.includes('gradient')) {
      showToast('Peringatan', 'Format gradient tidak valid. Gunakan: linear-gradient(...) atau radial-gradient(...)', 'warning');
      return;
    }
    applyGradient(value);
    gradientCustom.value = '';
    showToast('Berhasil', 'Gradient kustom berhasil diterapkan.', 'success');
  }

  // --- update warna teks ---
  function updateColors() {
    productDisplay.style.color = titleColor.value;
    addressDisplay.style.color = addressColor.value;
    priceDisplay.style.color = priceColor.value;
    triggerAutoSave();
  }

  // --- update font ---
  function updateFont() {
    const font = fontSelect.value;
    productDisplay.style.fontFamily = font;
    addressDisplay.style.fontFamily = font;
    priceDisplay.style.fontFamily = font;
    triggerAutoSave();
  }

  // --- update posisi teks ---
  function updateAlignment(align) {
    productDisplay.style.textAlign = align;
    addressDisplay.style.textAlign = align;
    priceDisplay.style.textAlign = align;
    triggerAutoSave();
  }

  // --- update filter efek ---
  function updateFilters() {
    const blur = blurRange.value;
    const brightness = brightnessRange.value;
    const contrast = contrastRange.value;
    const grayscale = grayscaleRange.value;
    poster.style.filter = `
      blur(${blur}px)
      brightness(${brightness})
      contrast(${contrast})
      grayscale(${grayscale}%)
    `;
    blurValue.textContent = blur;
    brightnessValue.textContent = brightness;
    contrastValue.textContent = contrast;
    grayscaleValue.textContent = grayscale + '%';
    triggerAutoSave();
  }

  // --- update watermark ---
  function updateWatermark() {
    const text = watermarkInput.value.trim();
    const color = watermarkColor.value;
    const opacity = parseFloat(watermarkOpacity.value);
    const position = watermarkPosition.value;

    watermarkOpacityValue.textContent = opacity.toFixed(2);

    if (text) {
      watermarkDisplay.textContent = text;
      watermarkDisplay.style.color = color;
      watermarkDisplay.style.opacity = opacity;
      watermarkDisplay.style.display = 'block';

      const posMap = {
        'top-left': { top: '20px', left: '20px', bottom: 'auto', right: 'auto', transform: 'none' },
        'top-right': { top: '20px', right: '20px', bottom: 'auto', left: 'auto', transform: 'none' },
        'bottom-left': { bottom: '20px', left: '20px', top: 'auto', right: 'auto', transform: 'none' },
        'bottom-right': { bottom: '20px', right: '20px', top: 'auto', left: 'auto', transform: 'none' },
        'center': { top: '50%', left: '50%', bottom: 'auto', right: 'auto', transform: 'translate(-50%, -50%)' }
      };
      const pos = posMap[position] || posMap['bottom-right'];
      Object.assign(watermarkDisplay.style, pos);
    } else {
      watermarkDisplay.style.display = 'none';
    }
    triggerAutoSave();
  }

  // --- remove watermark ---
  function removeWatermark() {
    watermarkInput.value = '';
    watermarkDisplay.style.display = 'none';
    triggerAutoSave();
  }

  // --- apply palette ---
  function applyPalette(title, address, price) {
    titleColor.value = title;
    addressColor.value = address;
    priceColor.value = price;
    updateColors();
  }

  // --- AUTO SAVE ---
  function getCurrentState() {
    return {
      product: productInput.value,
      address: addressInput.value,
      price: priceInput.value,
      titleColor: titleColor.value,
      addressColor: addressColor.value,
      priceColor: priceColor.value,
      font: fontSelect.value,
      align: document.querySelector('.align-btn.active')?.getAttribute('data-align') || 'left',
      width: widthInput.value,
      height: heightInput.value,
      blur: blurRange.value,
      brightness: brightnessRange.value,
      contrast: contrastRange.value,
      grayscale: grayscaleRange.value,
      watermark: watermarkInput.value,
      watermarkColor: watermarkColor.value,
      watermarkOpacity: watermarkOpacity.value,
      watermarkPosition: watermarkPosition.value,
      background: poster.style.backgroundImage || '',
      gradient: poster.style.backgroundImage || '',
    };
  }

  function saveStateToLocalStorage() {
    try {
      const state = getCurrentState();
      localStorage.setItem('poster_autosave', JSON.stringify(state));
      updateSaveIndicator('saved');
    } catch (e) {
      console.warn('Auto save failed:', e);
    }
  }

  function loadStateFromLocalStorage() {
    try {
      const data = localStorage.getItem('poster_autosave');
      if (!data) return false;
      const state = JSON.parse(data);

      productInput.value = state.product || 'Nama Produk';
      addressInput.value = state.address || 'Alamat lengkap';
      priceInput.value = state.price || 'Rp 0';
      titleColor.value = state.titleColor || '#ffffff';
      addressColor.value = state.addressColor || '#f0f0f0';
      priceColor.value = state.priceColor || '#ffd966';
      fontSelect.value = state.font || "'Segoe UI', Roboto, sans-serif";
      widthInput.value = state.width || 700;
      heightInput.value = state.height || 840;
      blurRange.value = state.blur || 0;
      brightnessRange.value = state.brightness || 1.0;
      contrastRange.value = state.contrast || 1.0;
      grayscaleRange.value = state.grayscale || 0;
      watermarkInput.value = state.watermark || '';
      watermarkColor.value = state.watermarkColor || '#ffffff';
      watermarkOpacity.value = state.watermarkOpacity || 0.5;
      watermarkPosition.value = state.watermarkPosition || 'bottom-right';

      const align = state.align || 'left';
      alignBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-align') === align);
      });

      // Restore background/gradient
      if (state.background && state.background !== '') {
        poster.style.backgroundImage = state.background;
        // Cek apakah background adalah gradient
        if (state.background.includes('gradient')) {
          gradientBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-gradient') === state.background);
          });
        }
      }

      updateTexts();
      updateSize();
      updateColors();
      updateFont();
      updateFilters();
      updateWatermark();
      const activeAlign = document.querySelector('.align-btn.active');
      if (activeAlign) {
        updateAlignment(activeAlign.getAttribute('data-align'));
      }

      return true;
    } catch (e) {
      console.warn('Load auto save failed:', e);
      return false;
    }
  }

  function updateSaveIndicator(status) {
    const dot = document.getElementById('saveDot');
    const statusText = document.getElementById('saveStatus');
    if (!dot || !statusText) return;

    if (status === 'saving') {
      dot.className = 'save-dot saving';
      statusText.textContent = 'Menyimpan...';
    } else {
      dot.className = 'save-dot saved';
      statusText.textContent = 'Otomatis tersimpan';
    }
  }

  function triggerAutoSave() {
    if (isSaving) return;
    isSaving = true;
    updateSaveIndicator('saving');

    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      saveStateToLocalStorage();
      isSaving = false;
      updateSaveIndicator('saved');
    }, 500);
  }

  // --- TOAST / NOTIFICATION ---
  function showToast(title, message, type = 'info') {
    if (!toastContainer) return;

    const types = {
      success: { icon: 'success', color: '#4a8a4a' },
      error: { icon: 'error', color: '#d04a4a' },
      warning: { icon: 'warning', color: '#d4a020' },
      info: { icon: 'info', color: '#4a7ad4' }
    };

    const t = types[type] || types.info;

    const icons = {
      success: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${t.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
      error: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${t.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      warning: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${t.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>`,
      info: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${t.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('toast-removing');
        setTimeout(() => {
          if (toast.parentNode) toast.remove();
        }, 300);
      }
    }, 5000);
  }

  // Expose toast ke global
  window.showToast = showToast;

  // --- FOCUS MODE ---
  focusToggle.addEventListener('click', function() {
    document.body.classList.toggle('focus-mode');
    const isFocus = document.body.classList.contains('focus-mode');
    this.innerHTML = isFocus
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
    if (isFocus) {
      showToast('Mode Fokus', 'Sidebar disembunyikan. Fokus pada pratinjau.', 'info');
    } else {
      showToast('Mode Normal', 'Sidebar ditampilkan kembali.', 'info');
    }
  });

  // --- GUIDE MODAL ---
  guideToggle.addEventListener('click', function() {
    guideModal.classList.add('active');
  });

  guideClose.addEventListener('click', function() {
    guideModal.classList.remove('active');
  });

  guideCloseBtn.addEventListener('click', function() {
    guideModal.classList.remove('active');
  });

  guideModal.addEventListener('click', function(e) {
    if (e.target === this) {
      guideModal.classList.remove('active');
    }
  });

  // --- event listeners ---
  productInput.addEventListener('input', updateTexts);
  addressInput.addEventListener('input', updateTexts);
  priceInput.addEventListener('input', updateTexts);

  widthInput.addEventListener('input', updateSize);
  heightInput.addEventListener('input', updateSize);

  titleColor.addEventListener('input', updateColors);
  addressColor.addEventListener('input', updateColors);
  priceColor.addEventListener('input', updateColors);

  fontSelect.addEventListener('change', updateFont);

  alignBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      alignBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      updateAlignment(this.getAttribute('data-align'));
    });
  });

  blurRange.addEventListener('input', updateFilters);
  brightnessRange.addEventListener('input', updateFilters);
  contrastRange.addEventListener('input', updateFilters);
  grayscaleRange.addEventListener('input', updateFilters);

  // --- Gradient events ---
  gradientBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const gradient = this.getAttribute('data-gradient');
      applyGradient(gradient);
      if (gradient && gradient !== 'none') {
        showToast('Gradient', 'Gradient background berhasil diterapkan.', 'success');
      } else {
        showToast('Gradient', 'Gradient dihapus.', 'info');
      }
    });
  });

  applyGradientBtn.addEventListener('click', applyCustomGradient);
  gradientCustom.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      applyCustomGradient();
    }
  });

  // --- watermark events ---
  watermarkInput.addEventListener('input', updateWatermark);
  watermarkColor.addEventListener('input', updateWatermark);
  watermarkOpacity.addEventListener('input', updateWatermark);
  watermarkPosition.addEventListener('change', updateWatermark);
  removeWatermarkBtn.addEventListener('click', removeWatermark);

  // --- palette events ---
  paletteBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const title = this.getAttribute('data-title');
      const address = this.getAttribute('data-address');
      const price = this.getAttribute('data-price');
      if (title && address && price) {
        applyPalette(title, address, price);
        showToast('Palet', 'Palet warna berhasil diterapkan.', 'success');
      }
    });
  });

  // --- preset ukuran ---
  presetBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const w = this.getAttribute('data-w');
      const h = this.getAttribute('data-h');
      if (w && h) {
        widthInput.value = w;
        heightInput.value = h;
        updateSize();
        showToast('Ukuran', `Ukuran diubah ke ${w}×${h} px.`, 'info');
      }
    });
  });

  // --- background ---
  bgButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const bgUrl = this.getAttribute('data-bg');
      if (bgUrl) {
        setBackgroundFromURL(bgUrl);
        fileInput.value = '';
        showToast('Background', 'Gambar background berhasil diterapkan.', 'success');
      }
    });
  });

  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      const dataUrl = ev.target.result;
      if (dataUrl) {
        poster.style.backgroundImage = `url('${dataUrl}')`;
        gradientBtns.forEach(btn => btn.classList.remove('active'));
        triggerAutoSave();
        showToast('Background', 'Gambar berhasil diupload sebagai background.', 'success');
      }
    };
    reader.readAsDataURL(file);
  });

  resetBgBtn.addEventListener('click', function() {
    resetBackground();
    fileInput.value = '';
    showToast('Background', 'Background direset ke default.', 'info');
  });

  // --- DOWNLOAD PNG ---
  downloadBtn.addEventListener('click', function() {
    updateSize();
    showToast('Mengunduh', 'Sedang memproses gambar...', 'info');
    html2canvas(poster, {
      scale: 2.0,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      width: parseInt(poster.style.width, 10),
      height: parseInt(poster.style.height, 10),
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'poster-banner.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Berhasil', 'Poster berhasil diunduh!', 'success');

      if (typeof trackDownload === 'function') {
        trackDownload();
      }
    }).catch((err) => {
      console.warn('Export error:', err);
      showToast('Error', 'Gagal mengunduh poster. Pastikan gambar background mendukung CORS.', 'error');
    });
  });

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleHome = document.getElementById('themeToggleHome');

  function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    showToast('Tema', isLight ? 'Mode terang diaktifkan.' : 'Mode gelap diaktifkan.', 'info');
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleHome) themeToggleHome.addEventListener('click', toggleTheme);

  // Load theme preference
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }

  // --- History Modal ---
  const historyModal = document.getElementById('historyModal');
  const historyClose = document.getElementById('historyClose');
  const historyCloseBtn = document.getElementById('historyCloseBtn');
  const historyClear = document.getElementById('historyClear');

  window.openHistoryModal = function() {
    historyModal.classList.add('active');
    if (typeof renderHistory === 'function') {
      renderHistory();
    }
  };

  if (historyClose) historyClose.addEventListener('click', function() {
    historyModal.classList.remove('active');
  });

  if (historyCloseBtn) historyCloseBtn.addEventListener('click', function() {
    historyModal.classList.remove('active');
  });

  if (historyModal) historyModal.addEventListener('click', function(e) {
    if (e.target === this) {
      historyModal.classList.remove('active');
    }
  });

  if (historyClear) historyClear.addEventListener('click', function() {
    if (confirm('Hapus semua riwayat?')) {
      if (typeof clearHistory === 'function') {
        clearHistory();
        renderHistory();
        showToast('Riwayat', 'Semua riwayat telah dihapus.', 'warning');
      }
    }
  });

  // --- Tambah tombol history di footer ---
  const footer = document.querySelector('.main-footer');
  if (footer) {
    const historyBtn = document.createElement('button');
    historyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      Riwayat
    `;
    historyBtn.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: 1px solid #33335a;
      color: #8a8aaa;
      padding: 6px 16px;
      border-radius: 30px;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.2s;
      margin-top: 8px;
    `;
    historyBtn.addEventListener('mouseenter', function() {
      this.style.borderColor = '#7a7af0';
      this.style.color = '#d0d0f0';
    });
    historyBtn.addEventListener('mouseleave', function() {
      this.style.borderColor = '#33335a';
      this.style.color = '#8a8aaa';
    });
    historyBtn.addEventListener('click', function() {
      if (typeof window.openHistoryModal === 'function') {
        window.openHistoryModal();
      }
    });
    footer.appendChild(historyBtn);
  }

  // --- Load Auto Save ---
  const hasSaved = loadStateFromLocalStorage();

  // --- Inisialisasi ---
  if (!hasSaved) {
    updateTexts();
    updateSize();
    updateColors();
    updateFont();
    updateFilters();
    updateWatermark();
    document.querySelector('.align-btn[data-align="left"]')?.classList.add('active');
    updateAlignment('left');
  }

  // --- Auto save setiap 30 detik ---
  setInterval(() => {
    if (!isSaving) {
      saveStateToLocalStorage();
    }
  }, 30000);

  // --- Tampilkan toast selamat datang ---
  setTimeout(() => {
    showToast('Selamat Datang!', 'Mulai buat poster Anda sekarang. Gunakan panduan jika perlu bantuan.', 'info');
  }, 800);

})();