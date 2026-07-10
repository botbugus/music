// ============================================================
//  KONFIGURASI API SYNOX CLOUD
//  Ganti API_KEY dengan key permanen dari @lordsaurus
//  (Rp15.000 sekali bayar, atau gunakan tanpa key untuk API gratis)
// ============================================================
const CONFIG = {
    // Jika tidak punya API key, kosongkan saja (gunakan "")
    // Beberapa endpoint mungkin tetap jalan tanpa key
    API_KEY: '',  // <-- ISI DENGAN API KEY ANDA (atau biarkan kosong)

    // Base URL API
    BASE_URL: 'https://api.synoxcloud.xyz',

    ENDPOINTS: {
        tiktok:    '/download/tiktok',
        youtube:   '/download/youtube',
        instagram: '/download/instagram',
        spotify:   '/download/spotify'
    },

    // Contoh URL untuk setiap fitur (placeholder)
    EXAMPLES: {
        tiktok:    'https://vt.tiktok.com/ZSXe89SB8/',
        youtube:   'https://youtu.be/nNcWorl87h0?si=NTtbJukOHENSn_9W',
        instagram: 'https://www.instagram.com/reel/DZZdzQzxPRM',
        spotify:   'https://open.spotify.com/track/xxxx'
    },

    // Opsi CORS — jika fetch gagal, coba gunakan mode 'no-cors' (terbatas)
    // atau gunakan proxy CORS seperti https://corsproxy.io/
    USE_CORS_PROXY: false,  // set true jika perlu proxy
    CORS_PROXY_URL: 'https://api.allorigins.win/raw?url='
};
