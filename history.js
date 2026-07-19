// ============================================
// HISTORY MODULE - Menyimpan riwayat perubahan
// ============================================

const HISTORY_KEY = 'poster_history';
const MAX_HISTORY = 50;

// Ambil history dari localStorage
function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Simpan history ke localStorage
function setHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// Tambahkan entri baru ke history
function saveHistory(data) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    time: new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    timestamp: Date.now(),
    data: { ...data }
  };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) {
    history.pop();
  }
  setHistory(history);
}

// Hapus semua history
function clearHistory() {
  setHistory([]);
}

// Render history ke modal
function renderHistory() {
  const container = document.getElementById('historyList');
  if (!container) return;

  const history = getHistory();

  if (history.length === 0) {
    container.innerHTML = `
      <p style="color:#6a6a8a; text-align:center; padding:20px 0;">
        Belum ada riwayat perubahan.
      </p>
    `;
    return;
  }

  let html = '';
  history.forEach((entry, index) => {
    html += `
      <div class="history-item">
        <span class="history-time">#${index + 1} · ${entry.time}</span>
        <div class="history-detail">
          <strong>${entry.data.product || 'Nama Produk'}</strong>
          <span style="color:#6a6a8a; margin:0 6px;">·</span>
          ${entry.data.address || 'Alamat'}
          <span style="color:#6a6a8a; margin:0 6px;">·</span>
          ${entry.data.price || 'Rp 0'}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Ekspos fungsi ke global
window.saveHistory = saveHistory;
window.clearHistory = clearHistory;
window.renderHistory = renderHistory;
window.getHistory = getHistory;