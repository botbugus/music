// ============================================================
//  KONFIGURASI API SYNOX CLOUD
//  Ganti API_KEY dengan key permanen dari @lordsaurus
// ============================================================
const CONFIG = {
    // API Key — kosongkan jika tidak punya (beberapa endpoint gratis)
    API_KEY: '',  // Isi dengan key permanen jika punya

    // Base URL API
    BASE_URL: 'https://api.synoxcloud.xyz',

    // Endpoint download
    ENDPOINTS: {
        tiktok:    '/download/tiktok',
        youtube:   '/download/youtube',
        instagram: '/download/instagram',
        spotify:   '/download/spotify'
    },

    // Contoh URL untuk setiap fitur
    EXAMPLES: {
        tiktok:    'https://vt.tiktok.com/ZSXe89SB8/',
        youtube:   'https://youtu.be/nNcWorl87h0?si=NTtbJukOHENSn_9W',
        instagram: 'https://www.instagram.com/reel/DZZdzQzxPRM',
        spotify:   'https://open.spotify.com/track/2sULdMKWdBdK2ZtntuFvSb'
    },

    // CORS Proxy — AKTIFKAN jika fetch gagal
    USE_CORS_PROXY: true,
    CORS_PROXY_URL: 'https://api.allorigins.win/raw?url='
};
