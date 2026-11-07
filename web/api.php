<?php
require __DIR__ . '/config.php';
ob_start();

// Session 安全配置
session_start([
    'cookie_httponly' => true,
    'cookie_secure'   => true,
    'cookie_samesite' => 'Lax',
]);

error_reporting(0);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/php_error.log');
if (!is_dir(__DIR__ . '/logs')) { @mkdir(__DIR__ . '/logs', 0750, true); }

// 设备端（手表）请求带 fmt=text 时返回 text/plain，Vela 的 fetch 才能拿到原始 JSON 文本
$isDeviceFmt = isset($_GET['fmt']) && $_GET['fmt'] === 'text';
header("Content-Type: " . ($isDeviceFmt ? 'text/plain' : 'application/json') . "; charset=UTF-8");
$allowed_origins = ['https://txcn.top', 'https://www.txcn.top', 'https://txcn.asia', 'https://www.txcn.asia', 'http://localhost', 'http://localhost:3000', 'http://localhost:5173'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header("Access-Control-Allow-Origin: " . (in_array($origin, $allowed_origins) ? $origin : 'https://txcn.asia'));
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Referrer-Policy: strict-origin-when-cross-origin");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$action = isset($input['action']) ? $input['action'] : (isset($_GET['action']) ? $_GET['action'] : '');


/* ============================================================
   ★ 配置（优先读取环境变量，fallback 为默认值）
   ============================================================ */
define('BREVO_API_KEY',  CFG_BREVO_API_KEY);
define('MAIL_FROM',      CFG_MAIL_FROM);
define('MAIL_FROM_NAME', CFG_MAIL_FROM_NAME);
define('CODE_EXPIRE',   5);
define('CODE_COOLDOWN', 60);
define('LOGIN_MAX_ATTEMPTS', 10);
define('LOGIN_LOCKOUT_SECS', 900);

/* ═══════════════════════════════════════════
   验证码
   ═══════════════════════════════════════════ */
if ($action === 'captcha') {
    $code = '';
    $chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    for ($i = 0; $i < 4; $i++) {
        $code .= $chars[random_int(0, strlen($chars) - 1)];
    }
    $_SESSION['captcha_code'] = strtolower($code);

    ob_end_clean();
    ob_start();

    if (function_exists('imagecreatetruecolor') && function_exists('imagepng')) {
        $w = 120; $h = 42;
        $img = @imagecreatetruecolor($w, $h);
        if ($img) {
            $bg = imagecolorallocate($img, 245, 245, 245);
            imagefill($img, 0, 0, $bg);
            for ($i = 0; $i < 6; $i++) {
                $c = imagecolorallocate($img, rand(160, 220), rand(160, 220), rand(160, 220));
                imageline($img, rand(0, $w), rand(0, $h), rand(0, $w), rand(0, $h), $c);
            }
            for ($i = 0; $i < 40; $i++) {
                $c = imagecolorallocate($img, rand(180, 230), rand(180, 230), rand(180, 230));
                imagesetpixel($img, rand(0, $w), rand(0, $h), $c);
            }
            for ($i = 0; $i < 4; $i++) {
                $tc = imagecolorallocate($img, rand(30, 100), rand(30, 100), rand(30, 100));
                imagestring($img, 5, 16 + $i * 25, rand(10, 18), $code[$i], $tc);
            }
            header('Content-Type: image/png');
            header('Cache-Control: no-store, no-cache, must-revalidate');
            imagepng($img);
            imagedestroy($img);
            ob_end_flush();
            exit;
        }
    }

    header('Content-Type: image/svg+xml');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    $colors = ['#D32F2F','#7B1FA2','#1565C0','#2E7D32','#E65100','#00838F','#4E342E'];
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="42">';
    $svg .= '<rect width="120" height="42" fill="#f5f5f5"/>';
    for ($i = 0; $i < 6; $i++) {
        $c = sprintf('#%06x', rand(0xbbbbbb, 0xeeeeee));
        $svg .= '<line x1="'.rand(0,120).'" y1="'.rand(0,42).'" x2="'.rand(0,120).'" y2="'.rand(0,42).'" stroke="'.$c.'"/>';
    }
    for ($i = 0; $i < 4; $i++) {
        $fill = $colors[array_rand($colors)];
        $x = 18 + $i * 25 + rand(-2, 2);
        $y = 28 + rand(-3, 3);
        $rot = rand(-15, 15);
        $ch = htmlspecialchars($code[$i], ENT_XML1, 'UTF-8');
        $svg .= '<text x="'.$x.'" y="'.$y.'" font-size="20" font-family="monospace" font-weight="bold" fill="'.$fill.'" transform="rotate('.$rot.','.($x+6).','.($y-6).')">'.$ch.'</text>';
    }
    $svg .= '</svg>';
    echo $svg;
    ob_end_flush();
    exit;
}

/* ═══════════════════════════════════════════
   数据库连接 + 版本迁移
   ═══════════════════════════════════════════ */
function getDB($exitOnFail = true) {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $db_host = CFG_DB_HOST;
    $db_user = CFG_DB_USER;
    $db_pass = CFG_DB_PASS;
    $db_name = CFG_DB_NAME;
    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 2,
            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true
        ]);
        migrateDB($pdo);
        return $pdo;
    } catch (PDOException $e) {
        if ($exitOnFail) {
            echo json_encode(["success" => false, "message" => "云端数据连接失败"]);
            exit;
        }
        return null;
    }
}

function migrateDB($pdo) {
    $pdo->exec("CREATE TABLE IF NOT EXISTS db_migrations (
        version INT PRIMARY KEY
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $row = $pdo->query("SELECT MAX(version) as v FROM db_migrations")->fetch();
    $ver = ($row && $row['v'] !== null) ? (int)$row['v'] : 0;

    if ($ver < 1) {
        try { $pdo->exec("ALTER TABLE todos ADD COLUMN priority INT DEFAULT 2"); } catch (Exception $e) { error_log('migrate v1.1: ' . $e->getMessage()); }
        try { $pdo->exec("ALTER TABLE todos ADD COLUMN is_pinned INT DEFAULT 0"); } catch (Exception $e) { error_log('migrate v1.2: ' . $e->getMessage()); }
        try { $pdo->exec("ALTER TABLE todos ADD COLUMN category_id INT DEFAULT NULL"); } catch (Exception $e) { error_log('migrate v1.3: ' . $e->getMessage()); }
        try { $pdo->exec("ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"); } catch (Exception $e) { error_log('migrate v1.4: ' . $e->getMessage()); }
        $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, name VARCHAR(50) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        $pdo->exec("CREATE TABLE IF NOT EXISTS focus_logs (
            id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, duration INT NOT NULL,
            type VARCHAR(20) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        $pdo->exec("CREATE TABLE IF NOT EXISTS calendar_events (
            id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL,
            title VARCHAR(100) NOT NULL, event_date DATE NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (1)");
    }

    if ($ver < 2) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS user_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL,
            token VARCHAR(64) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL, UNIQUE KEY uk_token (token),
            INDEX idx_user_id (user_id), INDEX idx_expires (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (2)");
    }

    if ($ver < 3) {
        try { $pdo->exec("ALTER TABLE users ADD COLUMN email VARCHAR(255) DEFAULT ''"); } catch (Exception $e) { error_log('migrate v3: ' . $e->getMessage()); }
        $pdo->exec("CREATE TABLE IF NOT EXISTS email_codes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            code VARCHAR(10) NOT NULL,
            used TINYINT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (3)");
    }

    if ($ver < 4) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS login_attempts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ip VARCHAR(45) NOT NULL,
            attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_ip (ip),
            INDEX idx_attempted (attempted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (4)");
    }

    if ($ver < 5) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS notices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL DEFAULT '',
            content TEXT NOT NULL,
            is_active TINYINT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (5)");
    }

    if ($ver < 6) {
        // 手表/设备短码绑定：网页端生成 6 位码，手表输入换 token
        $pdo->exec("CREATE TABLE IF NOT EXISTS device_codes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            code VARCHAR(10) NOT NULL,
            used TINYINT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL,
            UNIQUE KEY uk_code (code),
            INDEX idx_user_id (user_id),
            INDEX idx_expires (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (6)");
    }

    if ($ver < 7) {
        // todos 表增加创建时间（供手表端显示）
        try { $pdo->exec("ALTER TABLE todos ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"); } catch (Exception $e) { error_log('migrate v7: ' . $e->getMessage()); }
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (7)");
    }

    if ($ver < 8) {
        // todos 表增加截止时间（绝对毫秒时间戳，0=无截止）
        try { $pdo->exec("ALTER TABLE todos ADD COLUMN due_date BIGINT NOT NULL DEFAULT 0"); } catch (Exception $e) { error_log('migrate v8: ' . $e->getMessage()); }
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (8)");
    }

    if ($ver < 9) {
        // user_tokens 表增加设备唯一标识（手表端生成上传，设备管理/去重用）
        try { $pdo->exec("ALTER TABLE user_tokens ADD COLUMN device_id VARCHAR(64) DEFAULT NULL"); } catch (Exception $e) { error_log('migrate v9: ' . $e->getMessage()); }
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (9)");
    }

    // ⚠️ 便签迁移：幂等无条件执行，勿用版本号门控——旧库 db_migrations 可能已是更高版本，
    //    门控会导致 note 列缺失 → SELECT ... note 报 Unknown column → 500
    $noteCols = $pdo->query("SHOW COLUMNS FROM todos LIKE 'note'")->fetchAll();
    if (empty($noteCols)) {
        try { $pdo->exec("ALTER TABLE todos ADD COLUMN note TEXT"); } catch (Exception $e) { error_log('migrate notes.1: ' . $e->getMessage()); }
    }
    $pdo->exec("CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (10)");

    if ($ver < 11) {
        // 头像系统：users 表存相对路径（uploads/avatars/av_<uid>_<rand>.jpg）
        try { $pdo->exec("ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT ''"); } catch (Exception $e) { error_log('migrate v11: ' . $e->getMessage()); }
        $pdo->exec("INSERT IGNORE INTO db_migrations (version) VALUES (11)");
    }
}

/* ═══════════════════════════════════════════
   ★ Brevo 发送邮件（HTTPS）
   ═══════════════════════════════════════════ */
function sendVerificationEmail($to, $code, $purpose = 'register') {
    $desc = $purpose === 'reset'
        ? '你正在重置 TXCN STUDIO 账户密码，验证码如下：'
        : '你正在注册 TXCN STUDIO 账户，验证码如下：';

    $html = '<div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;padding:32px 24px;background:#fafafa;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:11px;font-weight:700;letter-spacing:4px;color:#7c3aed;">TXCN STUDIO</span>
        </div>
        <h2 style="text-align:center;color:#1a1a2e;font-size:20px;margin:0 0 16px;">邮箱验证码</h2>
        <p style="font-size:14px;color:#555;line-height:1.7;text-align:center;">' . $desc . '</p>
        <div style="background:#f0ebff;border-radius:12px;padding:20px;text-align:center;margin:20px 0;">
            <span style="font-size:36px;font-weight:900;color:#7c3aed;letter-spacing:8px;">' . $code . '</span>
        </div>
        <p style="font-size:13px;color:#888;text-align:center;">验证码 ' . CODE_EXPIRE . ' 分钟内有效，请勿泄露给他人。</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="font-size:11px;color:#bbb;text-align:center;">如非本人操作，请忽略此邮件。</p>
    </div>';

    $data = [
        'sender'      => ['name' => MAIL_FROM_NAME, 'email' => MAIL_FROM],
        'to'          => [['email' => $to]],
        'subject'     => '【TXCN STUDIO】邮箱验证码',
        'htmlContent' => $html
    ];

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'accept: application/json',
            'content-type: application/json',
            'api-key: ' . BREVO_API_KEY
        ],
        CURLOPT_POSTFIELDS => json_encode($data, JSON_UNESCAPED_UNICODE)
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 201) {
        error_log('Brevo 邮件发送失败: HTTP ' . $httpCode . ' | ' . $response);
        return false;
    }

    return true;
}

/* ═══════════════════════════════════════════
   ★ Cloudflare Turnstile 人机验证
   ═══════════════════════════════════════════ */
function verifyTurnstile($token) {
    if ($token === '') return false;
    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_POSTFIELDS     => http_build_query([
            'secret'   => CFG_TURNSTILE_SECRET,
            'response' => $token,
            'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
        ]),
    ]);
    $resp = curl_exec($ch);
    curl_close($ch);
    if ($resp === false) { error_log('Turnstile 验证请求失败'); return false; }
    $j = json_decode($resp, true);
    return !empty($j['success']);
}

/* ═══════════════════════════════════════════
   ★ 登录频率限制
   ═══════════════════════════════════════════ */
function checkLoginRateLimit($pdo) {
    $ip = $_SERVER['REMOTE_ADDR'];
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND attempted_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)");
        $stmt->execute([$ip]);
        $count = (int)$stmt->fetchColumn();
        if ($count >= LOGIN_MAX_ATTEMPTS) {
            echo json_encode(["success" => false, "message" => "登录尝试过于频繁，请15分钟后再试"]);
            exit;
        }
    } catch (Exception $e) { /* 表不存在时静默 */ }
}
function recordLoginAttempt($pdo) {
    $ip = $_SERVER['REMOTE_ADDR'];
    try {
        $stmt = $pdo->prepare("INSERT INTO login_attempts (ip) VALUES (?)");
        $stmt->execute([$ip]);
    } catch (Exception $e) {}
}
function clearLoginAttempts($pdo) {
    $ip = $_SERVER['REMOTE_ADDR'];
    try {
        $stmt = $pdo->prepare("DELETE FROM login_attempts WHERE ip = ?");
        $stmt->execute([$ip]);
    } catch (Exception $e) {}
}

/* ═══════════════════════════════════════════
   ★ CSRF Token
   ═══════════════════════════════════════════ */
function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}
function validateCsrf() {
    global $input;
    $token = $input['csrf_token'] ?? '';
    if (empty($token) || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        echo json_encode(["success" => false, "message" => "请求无效，请刷新页面重试"]);
        exit;
    }
}

/* ═══════════════════════════════════════════
   ★ 密码验证兼容（支持旧用户 SHA-256 哈希迁移）
   ═══════════════════════════════════════════ */
function verifyPasswordCompat($input, $stored) {
    // 新用户：明文密码直接验证
    if (password_verify($input, $stored)) return true;
    // 旧用户：密码经过前端 SHA-256 后存储，兼容验证
    $legacy = hash('sha256', $input);
    if ($legacy !== $input && password_verify($legacy, $stored)) return true;
    return false;
}

/* ═══════════════════════════════════════════
   ★ 发送邮箱验证码 - 注册（需图片验证码）
   ═══════════════════════════════════════════ */
if ($action === 'send_email_code' && $method === 'POST') {
    $email   = isset($input['email'])   ? trim($input['email'])   : '';
    $captcha = isset($input['captcha']) ? strtolower(trim($input['captcha'])) : '';
    $cfToken = isset($input['cf_turnstile']) ? trim($input['cf_turnstile']) : '';

    // 注册页使用 Cloudflare Turnstile（与 login/register 一致）；忘记密码页仍走图片验证码
    if ($cfToken !== '') {
        if (!verifyTurnstile($cfToken)) {
            echo json_encode(["success" => false, "message" => "人机验证未通过，请重试"]); exit;
        }
    } elseif (empty($_SESSION['captcha_code']) || $captcha !== $_SESSION['captcha_code']) {
        echo json_encode(["success" => false, "message" => "人机验证失败或已过期"]);
        unset($_SESSION['captcha_code']); exit;
    } else {
        unset($_SESSION['captcha_code']);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "邮箱格式不正确"]);
        exit;
    }

    $pdo = getDB();

    /* 检查邮箱是否已被注册 */
    $stmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?)");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "该邮箱已被注册"]);
        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT 1 FROM email_codes WHERE email = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? SECOND) ORDER BY id DESC LIMIT 1"
    );
    $stmt->execute([$email, CODE_COOLDOWN]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "发送过于频繁，请稍后再试"]);
        exit;
    }

    $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    $stmt = $pdo->prepare("INSERT INTO email_codes (email, code) VALUES (?, ?)");
    $stmt->execute([$email, $code]);

    $sent = sendVerificationEmail($email, $code, 'register');

    if ($sent) {
        echo json_encode(["success" => true, "message" => "验证码已发送，" . CODE_EXPIRE . " 分钟内有效"]);
    } else {
        echo json_encode(["success" => false, "message" => "邮件发送失败，请检查邮箱地址或稍后重试"]);
    }
    exit;
}

/* ═══════════════════════════════════════════
   忘记密码 - 发送验证码（无需登录）
   ═══════════════════════════════════════════ */
if ($method === 'POST' && $action === 'forgot_password') {
    $email   = isset($input['email'])   ? trim($input['email'])   : '';
    $captcha = isset($input['captcha']) ? strtolower(trim($input['captcha'])) : '';

    if (empty($_SESSION['captcha_code']) || $captcha !== $_SESSION['captcha_code']) {
        echo json_encode(["success" => false, "message" => "验证码错误或已过期"]);
        unset($_SESSION['captcha_code']);
        exit;
    }
    unset($_SESSION['captcha_code']);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "邮箱格式不正确"]);
        exit;
    }

    $pdo = getDB();

    $stmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?)");
    $stmt->execute([$email]);
    if (!$stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "该邮箱未注册"]);
        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT 1 FROM email_codes WHERE email = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? SECOND) ORDER BY id DESC LIMIT 1"
    );
    $stmt->execute([$email, CODE_COOLDOWN]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "发送过于频繁，请稍后再试"]);
        exit;
    }

    $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $stmt = $pdo->prepare("INSERT INTO email_codes (email, code) VALUES (?, ?)");
    $stmt->execute([$email, $code]);

    $sent = sendVerificationEmail($email, $code, 'reset');

    if ($sent) {
        echo json_encode(["success" => true, "message" => "验证码已发送，" . CODE_EXPIRE . " 分钟内有效"]);
    } else {
        echo json_encode(["success" => false, "message" => "邮件发送失败，请稍后重试"]);
    }
    exit;
}

/* ═══════════════════════════════════════════
   重置密码（无需登录）
   ═══════════════════════════════════════════ */
if ($method === 'POST' && $action === 'reset_password') {
    $email    = isset($input['email'])        ? trim($input['email'])        : '';
    $code     = isset($input['code'])         ? trim($input['code'])         : '';
    $password = isset($input['new_password']) ? trim($input['new_password']) : '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "邮箱格式不正确"]);
        exit;
    }
    if (strlen($code) !== 6 || !ctype_digit($code)) {
        echo json_encode(["success" => false, "message" => "请输入6位数字验证码"]);
        exit;
    }
    if (strlen($password) < 6) {
        echo json_encode(["success" => false, "message" => "新密码至少6位"]);
        exit;
    }

    $pdo = getDB();

    $stmt = $pdo->prepare(
        "SELECT id FROM email_codes WHERE LOWER(email) = LOWER(?) AND code = ? AND used = 0 AND created_at > DATE_SUB(NOW(), INTERVAL ? MINUTE) ORDER BY id DESC LIMIT 1"
    );
    $stmt->execute([$email, $code, CODE_EXPIRE]);
    $validCode = $stmt->fetch();

    if (!$validCode) {
        echo json_encode(["success" => false, "message" => "验证码错误或已过期"]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE email_codes SET used = 1 WHERE id = ?");
    $stmt->execute([$validCode['id']]);

    $stmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?)");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(["success" => false, "message" => "用户不存在"]);
        exit;
    }

    $hashed = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->execute([$hashed, $user['id']]);

    $stmt = $pdo->prepare("DELETE FROM user_tokens WHERE user_id = ?");
    $stmt->execute([$user['id']]);

    echo json_encode(["success" => true, "message" => "密码重置成功，请登录"]);
    exit;
}

/* ═══════════════════════════════════════════
   注册
   ═══════════════════════════════════════════ */
if ($method === 'POST' && $action === 'register') {
    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';
    $email    = isset($input['email'])    ? trim($input['email'])    : '';
    $code     = isset($input['code'])     ? trim($input['code'])     : '';
    $cfToken  = isset($input['cf_turnstile']) ? trim($input['cf_turnstile']) : '';

    if (!verifyTurnstile($cfToken)) {
        echo json_encode(["success" => false, "message" => "人机验证未通过，请重试"]); exit;
    }

    if (strlen($username) < 3 || strlen($password) < 6) {
        echo json_encode(["success" => false, "message" => "账号至少3位，密码至少6位"]); exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "请输入有效的邮箱地址"]); exit;
    }
    if (strlen($code) !== 6 || !ctype_digit($code)) {
        echo json_encode(["success" => false, "message" => "请输入6位数字邮箱验证码"]); exit;
    }

    $pdo = getDB();

    $stmt = $pdo->prepare("SELECT id FROM email_codes WHERE LOWER(email) = LOWER(?) AND code = ? AND used = 0 AND created_at > DATE_SUB(NOW(), INTERVAL ? MINUTE) ORDER BY id DESC LIMIT 1");
    $stmt->execute([$email, $code, CODE_EXPIRE]);
    $validCode = $stmt->fetch();

    if (!$validCode) {
        echo json_encode(["success" => false, "message" => "邮箱验证码错误或已过期"]); exit;
    }

    $stmt = $pdo->prepare("UPDATE email_codes SET used = 1 WHERE id = ?");
    $stmt->execute([$validCode['id']]);

    /* ★ 检查邮箱是否已被注册 */
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "该邮箱已被注册"]);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
        $stmt->execute([$username, $hashed_password, $email]);
        echo json_encode(["success" => true, "message" => "注册成功，快去登录吧！"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "此用户名已被占用"]);
    }
    exit;
}

/* ═══════════════════════════════════════════
   登录
   ═══════════════════════════════════════════ */
if ($method === 'POST' && $action === 'login') {
    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';
    $cfToken  = isset($input['cf_turnstile']) ? trim($input['cf_turnstile']) : '';
    if (!verifyTurnstile($cfToken)) {
        echo json_encode(["success" => false, "message" => "人机验证未通过，请重试"]); exit;
    }
    $pdo = getDB();
    checkLoginRateLimit($pdo);
    $stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if ($user && verifyPasswordCompat($password, $user['password'])) {
        clearLoginAttempts($pdo);
        // 旧用户自动迁移：SHA-256 哈希 → 明文 BCrypt
        if (!password_verify($password, $user['password'])) {
            $stmt2 = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt2->execute([password_hash($password, PASSWORD_BCRYPT), $user['id']]);
        }
        session_regenerate_id(true);
        $stmt = $pdo->prepare("DELETE FROM user_tokens WHERE user_id = ? AND expires_at < NOW()");
        $stmt->execute([$user['id']]);
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + 30 * 86400);
        $stmt = $pdo->prepare("INSERT INTO user_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$user['id'], $token, $expiresAt]);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $username;
        $_SESSION['login_token'] = $token;
        echo json_encode(["success" => true, "username" => $username, "token" => $token, "csrf_token" => generateCsrfToken()]);
    } else {
        recordLoginAttempt($pdo);
        echo json_encode(["success" => false, "message" => "账号或密码错误"]);
    }
    exit;
}

/* ★ 提供 CSRF Token 给前端 */
if ($action === 'get_csrf') {
    echo json_encode(["success" => true, "csrf_token" => generateCsrfToken()]);
    exit;
}

/* ═══════════════════════════════════════════
   Token 自动登录
   ═══════════════════════════════════════════ */
if ($action === 'token_login') {
    $client_token = isset($input['token']) ? trim($input['token']) : '';
    if (empty($client_token)) {
        echo json_encode(["success" => false, "message" => "缺少token"]); exit;
    }
    $pdo = getDB();
    $stmt = $pdo->prepare("SELECT ut.user_id, u.username FROM user_tokens ut JOIN users u ON ut.user_id = u.id WHERE ut.token = ? AND ut.expires_at > NOW()");
    $stmt->execute([$client_token]);
    $tokenRow = $stmt->fetch();
    if ($tokenRow) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $tokenRow['user_id'];
        $_SESSION['username'] = $tokenRow['username'];
        $_SESSION['login_token'] = $client_token;
        echo json_encode(["success" => true, "username" => $tokenRow['username'], "csrf_token" => generateCsrfToken()]);
    } else {
        echo json_encode(["success" => false, "message" => "登录已过期，请重新登录"]);
    }
    exit;
}

/* ═══════════════════════════════════════════
   手表短码绑定：6 位码换 token（无需登录）
   ═══════════════════════════════════════════ */
if ($action === 'device_bind') {
    $code = isset($input['code']) ? strtoupper(trim($input['code'])) : '';
    if (empty($code)) {
        echo json_encode(["success" => false, "message" => "缺少绑定码"]); exit;
    }
    $pdo = getDB(false);
    if (!$pdo) {
        echo json_encode(["success" => false, "message" => "数据库不可用"]); exit;
    }
    $stmt = $pdo->prepare("SELECT user_id FROM device_codes WHERE code = ? AND used = 0 AND expires_at > NOW() LIMIT 1");
    $stmt->execute([$code]);
    $row = $stmt->fetch();
    if (!$row) {
        echo json_encode(["success" => false, "message" => "绑定码无效或已过期"]); exit;
    }
    // 标记已用，生成 30 天 token
    $stmt = $pdo->prepare("UPDATE device_codes SET used = 1 WHERE code = ?");
    $stmt->execute([$code]);
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + 30 * 86400);
    // 手表端设备唯一标识（device_bind 请求体带 device_id，用于设备区分/去重）
    $deviceId = isset($input['device_id']) ? trim(substr($input['device_id'], 0, 64)) : null;
    $stmt = $pdo->prepare("INSERT INTO user_tokens (user_id, token, device_id, expires_at) VALUES (?, ?, ?, ?)");
    $stmt->execute([$row['user_id'], $token, $deviceId, $expiresAt]);
    echo json_encode(["success" => true, "token" => $token]);
    exit;
}

/* ═══════════════════════════════════════════
   登出
   ═══════════════════════════════════════════ */
if ($action === 'logout') {
    $uid = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
    $pdo = getDB(false);
    if ($pdo && $uid) {
        // 退出登录 = 撤销该用户全部设备（含手表）token，实现"网页退出后所有设备下线"
        $stmt = $pdo->prepare("DELETE FROM user_tokens WHERE user_id = ?");
        $stmt->execute([$uid]);
    }
    session_destroy();
    echo json_encode(["success" => true]);
    exit;
}

/* ═══════════════════════════════════════════
   热歌榜缓存（无需登录）
   ═══════════════════════════════════════════ */
if ($action === 'get_hotboard') {
    session_write_close(); // 出站请求前释放会话锁，避免拖慢其他请求
    $cacheDir  = __DIR__ . '/cache';
    $cacheFile = $cacheDir . '/hotboard_netease.json';
    $refresh   = isset($_GET['refresh']) && $_GET['refresh'] === '1';
    if (!is_dir($cacheDir)) { @mkdir($cacheDir, 0755, true); }
    if (!$refresh && file_exists($cacheFile)) {
        header('Content-Type: application/json; charset=utf-8');
        readfile($cacheFile);
        exit;
    }
    $apiUrl = 'https://uapis.cn/api/v1/misc/hotboard?type=netease-music';
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $apiUrl, CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20, CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);
    if ($httpCode === 200 && $response) {
        $json = json_decode($response);
        if ($json && isset($json->list) && is_array($json->list)) {
            file_put_contents($cacheFile, $response, LOCK_EX);
            header('Content-Type: application/json; charset=utf-8');
            echo $response;
            exit;
        }
    }
    if (file_exists($cacheFile)) {
        header('Content-Type: application/json; charset=utf-8');
        header('X-Cache: stale');
        readfile($cacheFile);
        exit;
    }
    http_response_code(502);
    echo json_encode(['error' => '热歌榜数据暂不可用，请稍后重试', 'detail' => $curlErr ?: "HTTP $httpCode"]);
    exit;
}

/* ═══════════════════════════════════════════
   公告（无需登录）
   ═══════════════════════════════════════════ */
if ($action === 'get_notices') {
    $pdo = getDB(false);
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT id, title, content, updated_at FROM notices WHERE is_active = 1 ORDER BY id DESC");
            echo json_encode($stmt->fetchAll());
        } catch (Exception $e) { echo json_encode([]); }
    } else { echo json_encode([]); }
    exit;
}

/* ═══════════════════════════════════════════
   以下接口需要登录
   认证方式：
   1. 网页端：PHP Session（cookie）
   2. 设备端（手表/快应用）：token 认证——请求带 token（body 的 token 字段、
      GET 的 token 参数、或 X-Auth-Token 请求头，三选一），查 user_tokens 表验证，
      不依赖 session/cookie
   ═══════════════════════════════════════════ */
$auth_user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$auth_via_session = ($auth_user_id !== null);
if (!$auth_user_id) {
    $client_token = isset($input['token']) ? trim($input['token']) : '';
    if ($client_token === '' && isset($_GET['token'])) { $client_token = trim($_GET['token']); }
    if ($client_token === '' && isset($_SERVER['HTTP_X_AUTH_TOKEN'])) { $client_token = trim($_SERVER['HTTP_X_AUTH_TOKEN']); }
    if ($client_token !== '') {
        $pdo2 = getDB(false);
        if ($pdo2) {
            $stmt = $pdo2->prepare("SELECT user_id FROM user_tokens WHERE token = ? AND expires_at > NOW()");
            $stmt->execute([$client_token]);
            $row = $stmt->fetch();
            if ($row) { $auth_user_id = $row['user_id']; }
        }
    }
}
if (!$auth_user_id) {
    http_response_code(401);
    echo json_encode(["error" => "未登录"]);
    exit;
}

// CSRF：仅对 session(cookie) 认证的写操作强制校验；token 认证（手表等设备）非 ambient credential，天然免疫 CSRF
if ($auth_via_session && in_array($method, ['POST', 'DELETE'], true)) {
    validateCsrf();
}

$user_id = $auth_user_id;
$pdo = getDB();

if ($method === 'GET') {
    if (empty($action)) {
        $stmt = $pdo->prepare("SELECT id, text, completed, priority, is_pinned, category_id, note, due_date, UNIX_TIMESTAMP(created_at) as created_ts FROM todos WHERE user_id = ? ORDER BY is_pinned DESC, priority DESC, id DESC");
        $stmt->execute([$user_id]); echo json_encode($stmt->fetchAll());
    } elseif ($action === 'get_categories') {
        $stmt = $pdo->prepare("SELECT id, name FROM categories WHERE user_id = ?");
        $stmt->execute([$user_id]); echo json_encode($stmt->fetchAll());
    } elseif ($action === 'get_focus_stats') {
        $stmt = $pdo->prepare("SELECT SUM(duration) as total FROM focus_logs WHERE user_id = ?");
        $stmt->execute([$user_id]); $total = $stmt->fetchColumn();
        $stmt = $pdo->prepare("SELECT SUM(duration) as today FROM focus_logs WHERE user_id = ? AND DATE(created_at) = CURRENT_DATE");
        $stmt->execute([$user_id]); $today = $stmt->fetchColumn();
        echo json_encode(["today_duration" => $today ? (int)$today : 0, "total_duration" => $total ? (int)$total : 0]);
    } elseif ($action === 'get_calendar_events') {
        $stmt = $pdo->prepare("SELECT id, title, event_date FROM calendar_events WHERE user_id = ? ORDER BY event_date ASC");
        $stmt->execute([$user_id]); echo json_encode($stmt->fetchAll());
    } elseif ($action === 'get_user_profile') {
        $stmt = $pdo->prepare("SELECT username, email, avatar, created_at, UNIX_TIMESTAMP(created_at) as created_ts FROM users WHERE id = ?");
        $stmt->execute([$user_id]); $user = $stmt->fetch();
        echo json_encode(["username" => $user['username'], "email" => $user['email'], "avatar" => $user['avatar'] ?? '', "created_at" => $user['created_at'], "created_ts" => (int)$user['created_ts']]);
    } elseif ($action === 'get_devices') {
        // 设备管理：列出该用户全部 token（device_id 区分设备，created_ts 绝对时间戳）
        $stmt = $pdo->prepare("SELECT id, device_id, LEFT(token, 8) as token_pre, UNIX_TIMESTAMP(created_at) as created_ts, expires_at FROM user_tokens WHERE user_id = ? ORDER BY id DESC");
        $stmt->execute([$user_id]); echo json_encode($stmt->fetchAll());
    } elseif ($action === 'get_notes') {
        $stmt = $pdo->prepare("SELECT id, content, UNIX_TIMESTAMP(created_at) as created_ts FROM notes WHERE user_id = ? ORDER BY id DESC");
        $stmt->execute([$user_id]); echo json_encode($stmt->fetchAll());
    }
}

if ($method === 'POST') {
    if ($action === 'create_device_code') {
        // 网页端生成手表绑定码（8 位，10 分钟有效）
        // 生成时查重：该码若仍未被使用且未过期则换码，防 UNIQUE 冲突导致 500（最多重试 5 次）
        $code = '';
        for ($i = 0; $i < 5; $i++) {
            $c = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
            $chk = $pdo->prepare("SELECT COUNT(*) FROM device_codes WHERE code = ? AND used = 0 AND expires_at > NOW()");
            $chk->execute([$c]);
            if ((int)$chk->fetchColumn() === 0) { $code = $c; break; }
        }
        if ($code === '') { $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8)); } // 兜底：极小概率仍碰撞，交由 UNIQUE 拒绝
        $stmt = $pdo->prepare("INSERT INTO device_codes (user_id, code, used, expires_at) VALUES (?, ?, 0, DATE_ADD(NOW(), INTERVAL 10 MINUTE))");
        $stmt->execute([$user_id, $code]);
        echo json_encode(["success" => true, "code" => $code]);
    }
    elseif ($action === 'add') {
        $text = isset($input['text']) ? trim($input['text']) : '';
        $priority = isset($input['priority']) ? (int)$input['priority'] : 2;
        $is_pinned = isset($input['is_pinned']) ? ($input['is_pinned'] ? 1 : 0) : 0;
        $category_id = isset($input['category_id']) && $input['category_id'] !== '' ? (int)$input['category_id'] : null;
        $due_date = isset($input['due_date']) && $input['due_date'] !== '' ? (int)$input['due_date'] : 0;
        if (empty($text) || mb_strlen($text, 'UTF-8') > 100) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "任务内容不能为空或超过100字"]);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO todos (user_id, text, completed, priority, is_pinned, category_id, due_date) VALUES (?, ?, 0, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $text, $priority, $is_pinned, $category_id, $due_date]); echo json_encode(["success" => true, "id" => (int)$pdo->lastInsertId()]);
    }
    elseif ($action === 'toggle') {
        $stmt = $pdo->prepare("UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$input['completed'] ? 1 : 0, $input['id'], $user_id]); echo json_encode(["success" => true]);
    }
    elseif ($action === 'update') {
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        $text = isset($input['text']) ? trim($input['text']) : '';
        $priority = isset($input['priority']) ? (int)$input['priority'] : 2;
        $is_pinned = isset($input['is_pinned']) ? ($input['is_pinned'] ? 1 : 0) : 0;
        $category_id = isset($input['category_id']) && $input['category_id'] !== '' ? (int)$input['category_id'] : null;
        if (empty($text) || mb_strlen($text, 'UTF-8') > 100) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "任务内容不能为空或超过100字"]);
            exit;
        }
        // due_date / is_pinned / note 仅在请求显式携带时更新，避免网页端 update 覆盖手表端设置的截止/置顶/备注
        $sql = "UPDATE todos SET text = ?, priority = ?, category_id = ?";
        $params = [$text, $priority, $category_id];
        if (array_key_exists('is_pinned', $input)) {
            $sql .= ", is_pinned = ?";
            $params[] = $input['is_pinned'] ? 1 : 0;
        }
        if (array_key_exists('due_date', $input)) {
            $sql .= ", due_date = ?";
            $params[] = $input['due_date'] !== '' ? (int)$input['due_date'] : 0;
        }
        if (array_key_exists('note', $input)) {
            $note = trim((string)$input['note']);
            if (mb_strlen($note, 'UTF-8') > 500) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "备注不能超过500字"]);
                exit;
            }
            $sql .= ", note = ?";
            $params[] = $note;
        }
        $sql .= " WHERE id = ? AND user_id = ?";
        $params[] = $id; $params[] = $user_id;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params); echo json_encode(["success" => true]);
    }
    elseif ($action === 'revoke_device') {
        // 设备管理：撤销指定设备 token（仅限本人）
        $dev_id = isset($input['id']) ? (int)$input['id'] : 0;
        $stmt = $pdo->prepare("DELETE FROM user_tokens WHERE id = ? AND user_id = ?");
        $stmt->execute([$dev_id, $user_id]); echo json_encode(["success" => true]);
    }
    elseif ($action === 'revoke_all') {
        // 设备管理：撤销该用户全部设备 token（所有设备下线）
        $stmt = $pdo->prepare("DELETE FROM user_tokens WHERE user_id = ?");
        $stmt->execute([$user_id]); echo json_encode(["success" => true]);
    }
    elseif ($action === 'revoke_others') {
        // 设备管理：只下线其它设备，保留当前网页登录
        $cur = isset($_SESSION['login_token']) ? $_SESSION['login_token'] : '';
        if ($cur === '') { echo json_encode(["success" => false, "message" => "无法识别当前设备，请重新登录后再试"]); exit; }
        $stmt = $pdo->prepare("DELETE FROM user_tokens WHERE user_id = ? AND token <> ?");
        $stmt->execute([$user_id, $cur]); echo json_encode(["success" => true]);
    }
    elseif ($action === 'clear_completed') {
        $stmt = $pdo->prepare("DELETE FROM todos WHERE completed = 1 AND user_id = ?");
        $stmt->execute([$user_id]); echo json_encode(["success" => true]);
    }
    elseif ($action === 'add_category') {
        $name = isset($input['name']) ? trim($input['name']) : '';
        if (!empty($name)) {
            $stmt = $pdo->prepare("SELECT id FROM categories WHERE user_id = ? AND name = ?");
            $stmt->execute([$user_id, $name]);
            if ($stmt->fetch()) {
                echo json_encode(["success" => false, "message" => "该分类已存在"]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO categories (user_id, name) VALUES (?, ?)");
                $stmt->execute([$user_id, $name]);
                echo json_encode(["success" => true]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "分类名不能为空"]);
        }
    }
    elseif ($action === 'add_focus_log') {
        $duration = max(1, min(480, (int)($input['duration'] ?? 0)));
        $type = in_array($input['type'] ?? '', ['pomodoro', 'stopwatch']) ? $input['type'] : 'pomodoro';
        $stmt = $pdo->prepare("INSERT INTO focus_logs (user_id, duration, type) VALUES (?, ?, ?)");
        $stmt->execute([$user_id, $duration, $type]); echo json_encode(["success" => true]);
    }
    elseif ($action === 'add_calendar_event') {
        $title = isset($input['title']) ? trim($input['title']) : '';
        $date = isset($input['event_date']) ? $input['event_date'] : '';
        if (!empty($title) && !empty($date)) {
            $stmt = $pdo->prepare("INSERT INTO calendar_events (user_id, title, event_date) VALUES (?, ?, ?)");
            $stmt->execute([$user_id, $title, $date]); echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "标题和日期不能为空"]);
        }
    }
    elseif ($action === 'update_calendar_event') {
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        $title = isset($input['title']) ? trim($input['title']) : '';
        $date = isset($input['event_date']) ? trim($input['event_date']) : '';
        if (!empty($title) && !empty($date)) {
            $stmt = $pdo->prepare("UPDATE calendar_events SET title = ?, event_date = ? WHERE id = ? AND user_id = ?");
            $stmt->execute([$title, $date, $id, $user_id]); echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "标题和日期不能为空"]);
        }
    }
    elseif ($action === 'add_note') {
        $content = isset($input['content']) ? trim($input['content']) : '';
        if (empty($content) || mb_strlen($content, 'UTF-8') > 1000) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "便签内容不能为空或超过1000字"]);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO notes (user_id, content) VALUES (?, ?)");
        $stmt->execute([$user_id, $content]); echo json_encode(["success" => true]);
    }
    elseif ($action === 'update_note') {
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        $content = isset($input['content']) ? trim($input['content']) : '';
        if (empty($content) || mb_strlen($content, 'UTF-8') > 1000) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "便签内容不能为空或超过1000字"]);
            exit;
        }
        $stmt = $pdo->prepare("UPDATE notes SET content = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$content, $id, $user_id]); echo json_encode(["success" => true]);
    }
    elseif ($action === 'upload_avatar') {
        // 头像上传：上限 15MB，服务端居中裁剪为 512x512 JPG 落盘（旧文件自动清理）
        $raw = isset($input['avatar']) ? (string)$input['avatar'] : '';
        if ($raw === '') {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "缺少图片数据"]); exit;
        }
        $b64 = $raw;
        if (strpos($raw, 'base64,') !== false) {
            $head = strtolower(substr($raw, 0, strpos($raw, ',') + 1));
            if (strpos($head, 'data:image/') !== 0) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "不支持的图片格式"]); exit;
            }
            $b64 = substr($raw, strpos($raw, ',') + 1);
        }
        $bin = base64_decode($b64, true);
        if ($bin === false || $bin === '') {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "图片数据无效"]); exit;
        }
        if (strlen($bin) > 15 * 1024 * 1024) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "图片不能超过 15MB"]); exit;
        }
        $info = @getimagesizefromstring($bin);
        if (!$info || $info[0] < 1 || $info[1] < 1) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "不是有效的图片文件"]); exit;
        }
        if ($info[0] > 4096 || $info[1] > 4096) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "图片尺寸过大（最长边不超过 4096px）"]); exit;
        }
        $dir = __DIR__ . '/uploads/avatars';
        if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
        if (!is_dir($dir) || !is_writable($dir)) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "头像目录不可写，请联系管理员"]); exit;
        }
        $fname = 'av_' . $user_id . '_' . substr(bin2hex(random_bytes(10)), 0, 20) . '.jpg';
        $saved = false;
        if (function_exists('imagecreatetruecolor') && function_exists('imagecopyresampled') && function_exists('imagejpeg')) {
            $src = @imagecreatefromstring($bin);
            if ($src) {
                $w = imagesx($src); $h = imagesy($src);
                $side = min($w, $h);
                $sx = (int)(($w - $side) / 2); $sy = (int)(($h - $side) / 2);
                $dst = imagecreatetruecolor(512, 512);
                $white = imagecolorallocate($dst, 255, 255, 255);
                imagefilledrectangle($dst, 0, 0, 511, 511, $white);
                imagecopyresampled($dst, $src, 0, 0, $sx, $sy, 512, 512, $side, $side);
                if (imagejpeg($dst, $dir . '/' . $fname, 88)) { $saved = true; }
                imagedestroy($dst); imagedestroy($src);
            }
        }
        if (!$saved) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "图片处理失败，请换一张图片"]); exit;
        }
        // 删除旧头像文件
        $stmt = $pdo->prepare("SELECT avatar FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $old = $stmt->fetchColumn();
        if ($old && strpos($old, 'uploads/avatars/') === 0) {
            $p = $dir . '/' . basename($old);
            if (is_file($p)) { @unlink($p); }
        }
        $url = 'uploads/avatars/' . $fname;
        $stmt = $pdo->prepare("UPDATE users SET avatar = ? WHERE id = ?");
        $stmt->execute([$url, $user_id]);
        echo json_encode(["success" => true, "avatar" => $url]);
    }
    elseif ($action === 'remove_avatar') {
        $stmt = $pdo->prepare("SELECT avatar FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $old = $stmt->fetchColumn();
        if ($old && strpos($old, 'uploads/avatars/') === 0) {
            $p = __DIR__ . '/uploads/avatars/' . basename($old);
            if (is_file($p)) { @unlink($p); }
        }
        $stmt = $pdo->prepare("UPDATE users SET avatar = '' WHERE id = ?");
        $stmt->execute([$user_id]);
        echo json_encode(["success" => true]);
    }
    elseif ($action === 'change_password') {
        $old = isset($input['old_password']) ? trim($input['old_password']) : '';
        $new = isset($input['new_password']) ? trim($input['new_password']) : '';
        if (empty($old) || empty($new)) {
            echo json_encode(["success" => false, "message" => "请完整填写"]); exit;
        }
        if (strlen($new) < 6) {
            echo json_encode(["success" => false, "message" => "新密码至少6位"]); exit;
        }
        if ($old === $new) {
            echo json_encode(["success" => false, "message" => "新旧密码不能相同"]); exit;
        }
        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();
        if (!$user || !verifyPasswordCompat($old, $user['password'])) {
            echo json_encode(["success" => false, "message" => "当前密码错误"]); exit;
        }
        $hashed = password_hash($new, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$hashed, $user_id]);
        $stmt = $pdo->prepare("DELETE FROM user_tokens WHERE user_id = ?");
        $stmt->execute([$user_id]);
        session_destroy();
        echo json_encode(["success" => true, "message" => "密码修改成功"]);
        exit;
    }
    elseif ($action === 'delete_account') {
        $pwd = isset($input['password']) ? trim($input['password']) : '';
        if (empty($pwd)) {
            echo json_encode(["success" => false, "message" => "请输入密码"]); exit;
        }
        $stmt = $pdo->prepare("SELECT password, email, avatar FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();
        if (!$user || !verifyPasswordCompat($pwd, $user['password'])) {
            echo json_encode(["success" => false, "message" => "密码错误"]); exit;
        }
        // 清理头像文件
        if (!empty($user['avatar']) && strpos($user['avatar'], 'uploads/avatars/') === 0) {
            $ap = __DIR__ . '/uploads/avatars/' . basename($user['avatar']);
            if (is_file($ap)) { @unlink($ap); }
        }
        $tables = ['todos', 'categories', 'focus_logs', 'calendar_events', 'user_tokens', 'notes', 'device_codes'];
        foreach ($tables as $tbl) {
            try {
                $stmt = $pdo->prepare("DELETE FROM $tbl WHERE user_id = ?");
                $stmt->execute([$user_id]);
            } catch (Exception $e) {}
        }
        try {
            $stmt = $pdo->prepare("DELETE FROM email_codes WHERE email = ?");
            $stmt->execute([$user['email']]);
        } catch (Exception $e) {}
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        session_destroy();
        echo json_encode(["success" => true, "message" => "账号已注销"]);
        exit;
    }
}

if ($method === 'DELETE') {
    if (isset($_GET['id']) && $action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM todos WHERE id = ? AND user_id = ?");
        $stmt->execute([$_GET['id'], $user_id]); echo json_encode(["success" => true]);
    } elseif (isset($_GET['id']) && $action === 'delete_category') {
        $stmt = $pdo->prepare("UPDATE todos SET category_id = NULL WHERE category_id = ? AND user_id = ?");
        $stmt->execute([$_GET['id'], $user_id]);
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");
        $stmt->execute([$_GET['id'], $user_id]); echo json_encode(["success" => true]);
    } elseif (isset($_GET['id']) && $action === 'delete_calendar_event') {
        $stmt = $pdo->prepare("DELETE FROM calendar_events WHERE id = ? AND user_id = ?");
        $stmt->execute([$_GET['id'], $user_id]); echo json_encode(["success" => true]);
    } elseif (isset($_GET['id']) && $action === 'delete_note') {
        $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
        $stmt->execute([$_GET['id'], $user_id]); echo json_encode(["success" => true]);
    }
}

ob_end_flush();
?>