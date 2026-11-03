<?php
// 敏感配置模板（脱敏版）—— 真实值仅保存在服务器与本地私有环境，不进公开仓库
// 部署时将本文件放于 api.php 同目录，并填入真实值
define('CFG_DB_HOST', '<REDACTED>');
define('CFG_DB_USER', '<REDACTED>');
define('CFG_DB_PASS', '<REDACTED>');
define('CFG_DB_NAME', '<REDACTED>');
define('CFG_BREVO_API_KEY', '<REDACTED>');
define('CFG_MAIL_FROM', 'txcn727@gmail.com');
define('CFG_MAIL_FROM_NAME', 'TXCN STUDIO');
define('CFG_ADMIN_PASS', '<REDACTED>');
define('CFG_TURNSTILE_SECRET', '<REDACTED>');
