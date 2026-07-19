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

  // --- Elemen Gradient ---
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

  // ============================================
  // UPDATE UKURAN - PERBAIKAN UTAMA
  // ============================================
  function updateSize() {
    let w = parseInt(widthInput.value, 10);
    let h = parseInt(heightInput.value, 10);

    // Validasi
    if (isNaN(w) || w < 20) w = 700;
    if (isNaN(h) || h < 20) h = 840;
    if (w > 3000) w = 3000;
    if (h > 4000) h = 4000;

    // Set nilai input ke yang valid
    widthInput.value = w;
    heightInput.value = h;

    // TERAPKAN UKURAN KE POSTER
    poster.style.width = w + 'px';
    poster.style.height = h + 'px';
    poster.style.aspectRatio = 'auto';

    // Update juga wrapper agar tidak membatasi
    const mainArea = document.querySelector('.main-area');
    if (mainArea) {
      mainArea.style.overflow = 'auto';
    }

    // Paksa reflow agar perubahan langsung terlihat
    poster.style.display = 'flex';
    poster.style.flexShrink = '0';

    triggerAutoSave();

    // Tampilkan notifikasi perubahan ukuran
    if (typeof showToast === 'function') {
      showToast('Ukuran', `Poster diubah menjadi ${w}×${h} px.`, 'info');
    }
  }

  // ============================================
  // DOWNLOAD PNG - PERBAIKAN
  // ============================================
  function downloadPoster() {
    // Pastikan ukuran terupdate sebelum download
    updateSize();

    // Tampilkan loading
    if (typeof showToast === 'function') {
      showToast('Mengunduh', 'Sedang memproses gambar...', 'info');
    }

    // Dapatkan ukuran sebenarnya dari poster
    const w = parseInt(poster.style.width, 10) || 700;
    const h = parseInt(poster.style.height, 10) || 840;

    // Gunakan html2canvas dengan opsi yang tepat
    html2canvas(poster, {
      scale: 2.0, // Resolusi tinggi untuk cetak
      useCORS: true, // Izinkan gambar dari URL eksternal
      allowTaint: false,
      backgroundColor: null, // Biarkan background sesuai
      logging: false,
      width: w,
      height: h,
      onclone: function(doc) {
        // Pastikan semua elemen ter-clone dengan benar
        const clonedPoster = doc.getElementById('poster');
        if (clonedPoster) {
          clonedPoster.style.width = w + 'px';
          clonedPoster.style.height = h + 'px';
        }
      }
    }).then((canvas) => {
      // Buat link download
      const link = document.createElement('a');
      link.download = 'poster-banner.png';
      link.href = canvas.toDataURL('image/png', 1.0);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Notifikasi sukses
      if (typeof showToast === 'function') {
        showToast('Berhasil!', 'Poster berhasil diunduh ke galeri.', 'success');
      }

      // Track download di analytics
      if (typeof trackDownload === 'function') {
        trackDownload();
      }
    }).catch((err) => {
      console.error('Export error:', err);
      if (typeof showToast === 'function') {
        showToast('Gagal', 'Gagal mengunduh poster. Periksa koneksi atau coba ulang.', 'error');
      } else {
        alert('Gagal mengunduh poster. Pastikan gambar background mendukung CORS.');
      }
    });
  }

  // ============================================
  // UPDATE TEKS
  // ============================================
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

  // ============================================
  // BACKGROUND
  // ============================================
  function setBackgroundFromURL(url) {
    if (!url) return;
    poster.style.backgroundImage = `url('${url}')`;
    poster.style.backgroundColor = 'transparent';
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

  // ============================================
  // GRADIENT
  // ============================================
  function applyGradient(gradientValue) {
    if (!gradientValue || gradientValue === 'none') {
      if (poster.style.backgroundImage && poster.style.backgroundImage !== 'none' && !poster.style.backgroundImage.includes('gradient')) {
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
      if (typeof showToast === 'function') {
        showToast('Peringatan', 'Masukkan nilai gradient CSS terlebih dahulu.', 'warning');
      }
      return;
    }
    if (!value.includes('gradient')) {
      if (typeof showToast === 'function') {
        showToast('Peringatan', 'Format gradient tidak valid. Gunakan: linear-gradient(...) atau radial-gradient(...)', 'warning');
      }
      return;
    }
    applyGradient(value);
    gradientCustom.value = '';
    if (typeof showToast === 'function') {
      showToast('Berhasil', 'Gradient kustom berhasil diterapkan.', 'success');
    }
  }

  // ============================================
  // WARNA TEKS
  // ============================================
  function updateColors() {
    productDisplay.style.color = titleColor.value;
    addressDisplay.style.color = addressColor.value;
    priceDisplay.style.color = priceColor.value;
    triggerAutoSave();
  }

  // ============================================
  // FONT
  // ============================================
  function updateFont() {
    const font = fontSelect.value;
    productDisplay.style.fontFamily = font;
    addressDisplay.style.fontFamily = font;
    priceDisplay.style.fontFamily = font;
    triggerAutoSave();
  }

  // ============================================
  // POSISI TEKS
  // ============================================
  function updateAlignment(align) {
    productDisplay.style.textAlign = align;
    addressDisplay.style.textAlign = align;
    priceDisplay.style.textAlign = align;
    triggerAutoSave();
  }

  // ============================================
  // FILTER EFEK
  // ============================================
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

  // ============================================
  // WATERMARK
  // ============================================
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

  function removeWatermark() {
    watermarkInput.value = '';
    watermarkDisplay.style.display = 'none';
    triggerAutoSave();
  }

  // ============================================
  // PALET
  // ============================================
  function applyPalette(title, address, price) {
    titleColor.value = title;
    addressColor.value = address;
    priceColor.value = price;
    updateColors();
  }

  // ============================================
  // AUTO SAVE
  // ============================================
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

      if (state.background && state.background !== '') {
        poster.style.backgroundImage = state.background;
        if (state.background.includes('gradient')) {
          gradientBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-gradient') === state.background);
          });
        }
      }

      // Update semua
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

  // ============================================
  // FOCUS MODE
  // ============================================
  if (focusToggle) {
    focusToggle.addEventListener('click', function() {
      document.body.classList.toggle('focus-mode');
      const isFocus = document.body.classList.contains('focus-mode');
      this.innerHTML = isFocus
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
      if (typeof showToast === 'function') {
        showToast('Mode Fokus', isFocus ? 'Sidebar disembunyikan.' : 'Sidebar ditampilkan kembali.', 'info');
      }
    });
  }

  // ============================================
  // GUIDE MODAL
  // ============================================
  if (guideToggle) {
    guideToggle.addEventListener('click', function() {
      if (guideModal) guideModal.classList.add('active');
    });
  }

  if (guideClose) {
    guideClose.addEventListener('click', function() {
      if (guideModal) guideModal.classList.remove('active');
    });
  }

  if (guideCloseBtn) {
    guideCloseBtn.addEventListener('click', function() {
      if (guideModal) guideModal.classList.remove('active');
    });
  }

  if (guideModal) {
    guideModal.addEventListener('click', function(e) {
      if (e.target === this) {
        guideModal.classList.remove('active');
      }
    });
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  // --- Teks ---
  productInput.addEventListener('input', updateTexts);
  addressInput.addEventListener('input', updateTexts);
  priceInput.addEventListener('input', updateTexts);

  // --- Ukuran ---
  widthInput.addEventListener('input', function() {
    // Update langsung saat input berubah
    updateSize();
  });
  heightInput.addEventListener('input', function() {
    updateSize();
  });

  // --- Warna ---
  titleColor.addEventListener('input', updateColors);
  addressColor.addEventListener('input', updateColors);
  priceColor.addEventListener('input', updateColors);

  // --- Font ---
  fontSelect.addEventListener('change', updateFont);

  // --- Alignment ---
  alignBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      alignBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      updateAlignment(this.getAttribute('data-align'));
    });
  });

  // --- Filter ---
  blurRange.addEventListener('input', updateFilters);
  brightnessRange.addEventListener('input', updateFilters);
  contrastRange.addEventListener('input', updateFilters);
  grayscaleRange.addEventListener('input', updateFilters);

  // --- Gradient ---
  gradientBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const gradient = this.getAttribute('data-gradient');
      applyGradient(gradient);
      if (gradient && gradient !== 'none' && typeof showToast === 'function') {
        showToast('Gradient', 'Gradient background berhasil diterapkan.', 'success');
      }
    });
  });

  if (applyGradientBtn) {
    applyGradientBtn.addEventListener('click', applyCustomGradient);
  }

  if (gradientCustom) {
    gradientCustom.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        applyCustomGradient();
      }
    });
  }

  // --- Watermark ---
  if (watermarkInput) watermarkInput.addEventListener('input', updateWatermark);
  if (watermarkColor) watermarkColor.addEventListener('input', updateWatermark);
  if (watermarkOpacity) watermarkOpacity.addEventListener('input', updateWatermark);
  if (watermarkPosition) watermarkPosition.addEventListener('change', updateWatermark);
  if (removeWatermarkBtn) removeWatermarkBtn.addEventListener('click', removeWatermark);

  // --- Palet ---
  paletteBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const title = this.getAttribute('data-title');
      const address = this.getAttribute('data-address');
      const price = this.getAttribute('data-price');
      if (title && address && price) {
        applyPalette(title, address, price);
        if (typeof showToast === 'function') {
          showToast('Palet', 'Palet warna berhasil diterapkan.', 'success');
        }
      }
    });
  });

  // --- Preset Ukuran ---
  presetBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const w = this.getAttribute('data-w');
      const h = this.getAttribute('data-h');
      if (w && h) {
        widthInput.value = w;
        heightInput.value = h;
        updateSize();
        if (typeof showToast === 'function') {
          showToast('Ukuran', `Ukuran diubah ke ${w}×${h} px.`, 'info');
        }
      }
    });
  });

  // --- Background ---
  bgButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const bgUrl = this.getAttribute('data-bg');
      if (bgUrl) {
        setBackgroundFromURL(bgUrl);
        if (fileInput) fileInput.value = '';
        if (typeof showToast === 'function') {
          showToast('Background', 'Gambar background berhasil diterapkan.', 'success');
        }
      }
    });
  });

  if (fileInput) {
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(ev) {
        const dataUrl = ev.target.result;
        if (dataUrl) {
          poster.style.backgroundImage = `url('${dataUrl}')`;
          poster.style.backgroundColor = 'transparent';
          gradientBtns.forEach(btn => btn.classList.remove('active'));
          triggerAutoSave();
          if (typeof showToast === 'function') {
            showToast('Background', 'Gambar berhasil diupload sebagai background.', 'success');
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (resetBgBtn) {
    resetBgBtn.addEventListener('click', function() {
      resetBackground();
      if (fileInput) fileInput.value = '';
      if (typeof showToast === 'function') {
        showToast('Background', 'Background direset ke default.', 'info');
      }
    });
  }

  // --- DOWNLOAD PNG ---
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadPoster);
  }

  // ============================================
  // THEME TOGGLE
  // ============================================
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleHome = document.getElementById('themeToggleHome');

  function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    if (typeof showToast === 'function') {
      showToast('Tema', isLight ? 'Mode terang diaktifkan.' : 'Mode gelap diaktifkan.', 'info');
    }
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleHome) themeToggleHome.addEventListener('click', toggleTheme);

  // Load theme preference
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }

  // ============================================
  // HISTORY MODAL
  // ============================================
  const historyModal = document.getElementById('historyModal');
  const historyClose = document.getElementById('historyClose');
  const historyCloseBtn = document.getElementById('historyCloseBtn');
  const historyClear = document.getElementById('historyClear');

  window.openHistoryModal = function() {
    if (historyModal) historyModal.classList.add('active');
    if (typeof renderHistory === 'function') {
      renderHistory();
    }
  };

  if (historyClose) {
    historyClose.addEventListener('click', function() {
      if (historyModal) historyModal.classList.remove('active');
    });
  }

  if (historyCloseBtn) {
    historyCloseBtn.addEventListener('click', function() {
      if (historyModal) historyModal.classList.remove('active');
    });
  }

  if (historyModal) {
    historyModal.addEventListener('click', function(e) {
      if (e.target === this) {
        historyModal.classList.remove('active');
      }
    });
  }

  if (historyClear) {
    historyClear.addEventListener('click', function() {
      if (confirm('Hapus semua riwayat?')) {
        if (typeof clearHistory === 'function') {
          clearHistory();
          renderHistory();
          if (typeof showToast === 'function') {
            showToast('Riwayat', 'Semua riwayat telah dihapus.', 'warning');
          }
        }
      }
    });
  }

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

  // ============================================
  // INISIALISASI
  // ============================================

  // Load Auto Save
  const hasSaved = loadStateFromLocalStorage();

  if (!hasSaved) {
    // Default values
    updateTexts();
    updateSize();
    updateColors();
    updateFont();
    updateFilters();
    updateWatermark();
    document.querySelector('.align-btn[data-align="left"]')?.classList.add('active');
    updateAlignment('left');
  }

  // Auto save setiap 30 detik
  setInterval(() => {
    if (!isSaving) {
      saveStateToLocalStorage();
    }
  }, 30000);

  // Tampilkan toast selamat datang
  setTimeout(() => {
    if (typeof showToast === 'function') {
      showToast('Selamat Datang!', 'Mulai buat poster Anda sekarang. Gunakan panduan jika perlu bantuan.', 'info');
    }
  }, 800);

  // Ekspos fungsi download ke global untuk debugging
  window.downloadPoster = downloadPoster;

})();
