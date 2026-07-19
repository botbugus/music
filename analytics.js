// ============================================
// ANALYTICS MODULE - Statistik pengguna
// ============================================

const ANALYTICS_KEY = 'poster_analytics';

// Ambil data analytics
function getAnalytics() {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : {
      totalDesigns: 0,
      totalDownloads: 0,
      activeUsers: 0,
      savedProjects: 0,
      lastVisit: null
    };
  } catch {
    return {
      totalDesigns: 0,
      totalDownloads: 0,
      activeUsers: 0,
      savedProjects: 0,
      lastVisit: null
    };
  }
}

// Simpan data analytics
function setAnalytics(data) {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
}

// Track desain baru dibuat
function trackDesign() {
  const analytics = getAnalytics();
  analytics.totalDesigns = (analytics.totalDesigns || 0) + 1;
  analytics.lastVisit = new Date().toISOString();
  setAnalytics(analytics);
  updateDisplay();
}

// Track download
function trackDownload() {
  const analytics = getAnalytics();
  analytics.totalDownloads = (analytics.totalDownloads || 0) + 1;
  setAnalytics(analytics);
  updateDisplay();
}

// Track proyek tersimpan
function trackSavedProject() {
  const analytics = getAnalytics();
  analytics.savedProjects = (analytics.savedProjects || 0) + 1;
  setAnalytics(analytics);
  updateDisplay();
}

// Update tampilan di homepage
function updateDisplay() {
  const analytics = getAnalytics();

  const totalDesignsEl = document.getElementById('totalDesigns');
  const totalDownloadsEl = document.getElementById('totalDownloads');
  const activeUsersEl = document.getElementById('activeUsers');
  const savedProjectsEl = document.getElementById('savedProjects');

  if (totalDesignsEl) totalDesignsEl.textContent = analytics.totalDesigns || 0;
  if (totalDownloadsEl) totalDownloadsEl.textContent = analytics.totalDownloads || 0;
  if (savedProjectsEl) savedProjectsEl.textContent = analytics.savedProjects || 0;

  if (activeUsersEl) {
    const lastVisit = analytics.lastVisit ? new Date(analytics.lastVisit) : null;
    if (lastVisit) {
      const daysDiff = (Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < 7) {
        activeUsersEl.textContent = '1';
      } else {
        activeUsersEl.textContent = '0';
      }
    } else {
      activeUsersEl.textContent = '0';
    }
  }
}

// Inisialisasi analytics di homepage
(function initAnalytics() {
  const analytics = getAnalytics();
  analytics.lastVisit = new Date().toISOString();
  setAnalytics(analytics);
  updateDisplay();
  setInterval(updateDisplay, 30000);
})();

// Ekspos ke global
window.trackDesign = trackDesign;
window.trackDownload = trackDownload;
window.trackSavedProject = trackSavedProject;
window.getAnalytics = getAnalytics;