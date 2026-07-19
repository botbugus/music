// ============================================
// TOAST / NOTIFICATION MODULE
// ============================================

(function() {
  // Buat container jika belum ada
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
      width: 100%;
    `;
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a8a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d04a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4a020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>`,
    info: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a7ad4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  function showToast(title, message, type = 'info', duration = 5000) {
    const types = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };

    const t = types[type] || types.info;

    const toast = document.createElement('div');
    toast.className = `toast toast-${t}`;
    toast.style.cssText = `
      background: #1a1a2e;
      border: 1px solid #33335a;
      border-radius: 16px;
      padding: 16px 20px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
      animation: slideInRight 0.4s ease;
      backdrop-filter: blur(8px);
      transition: all 0.3s ease;
      width: 100%;
      border-left: 4px solid ${t === 'success' ? '#4a8a4a' : t === 'error' ? '#d04a4a' : t === 'warning' ? '#d4a020' : '#4a7ad4'};
    `;

    if (document.body.classList.contains('light-mode')) {
      toast.style.background = '#f0f0f8';
      toast.style.borderColor = '#c0c0d0';
    }

    toast.innerHTML = `
      <div class="toast-icon" style="flex-shrink:0; margin-top:2px;">${icons[t] || icons.info}</div>
      <div class="toast-content" style="flex:1;">
        <div class="toast-title" style="font-weight:600; font-size:0.9rem; color:#e8e8f0; margin-bottom:2px;">${title}</div>
        <div class="toast-message" style="font-size:0.8rem; color:#8a8aaa; line-height:1.4;">${message}</div>
      </div>
      <button class="toast-close" style="background:none; border:none; color:#6a6a8a; cursor:pointer; padding:4px; flex-shrink:0; transition:color 0.2s;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    if (document.body.classList.contains('light-mode')) {
      const titleEl = toast.querySelector('.toast-title');
      const msgEl = toast.querySelector('.toast-message');
      const closeEl = toast.querySelector('.toast-close');
      if (titleEl) titleEl.style.color = '#1a1a2e';
      if (msgEl) msgEl.style.color = '#5a5a7a';
      if (closeEl) closeEl.style.color = '#8a8aaa';
    }

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
      removeToast(toast);
    });

    container.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(toast);
    }, duration);

    return toast;
  }

  function removeToast(toast) {
    if (!toast.parentNode) return;
    toast.classList.add('toast-removing');
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 300);
  }

  // Inject animations if not exist
  if (!document.getElementById('toastStyles')) {
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        to { transform: translateX(120%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Ekspos ke global
  window.showToast = showToast;
})();