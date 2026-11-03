<?php
// TXCN 云端代理（cURL 版）
// 自适应：先直接转发 api.php；若被 InfinityFree JS 挑战拦截，
// 再用 openssl 解挑战（AES-128-CBC / slowAES mode 2）带 cookie 重试。
// 部署：上传到服务器与 api.php 同目录，手表 API_BASE 改为 https://txcn.top/proxy.php

error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=UTF-8');

function httpFetch($url, $method = 'GET', $body = null, $cookie = '') {
    $ch = curl_init($url);
    $headers = [
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept: */*',
    ];
    if ($cookie !== '') $headers[] = 'Cookie: ' . $cookie;
    if ($method === 'POST' || $method === 'PUT') $headers[] = 'Content-Type: application/json';
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    $resp = curl_exec($ch);
    if ($resp === false) {
        $err = curl_error($ch);
        curl_close($ch);
        return 'ERR:' . $err;
    }
    curl_close($ch);
    return $resp;
}

function isChallengePage($html) {
    return is_string($html) && strpos($html, 'aes.js') !== false && strlen($html) < 3000;
}

function solveChallenge() {
    $html = httpFetch('https://txcn.top/checklist');
    if (!is_string($html) || strpos($html, 'ERR:') === 0) return null;
    if (!preg_match('/var a=toNumbers\("([0-9a-f]+)"\),b=toNumbers\("([0-9a-f]+)"\),c=toNumbers\("([0-9a-f]+)"\)/', $html, $m)) return null;
    $plain = openssl_decrypt(hex2bin($m[3]), 'AES-128-CBC', hex2bin($m[1]), OPENSSL_RAW_DATA, hex2bin($m[2]));
    if ($plain === false) return null;
    return '__test=' . bin2hex($plain);
}

$url = 'https://txcn.top/api.php';
if (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '') {
    $url .= '?' . $_SERVER['QUERY_STRING'];
}
$method = $_SERVER['REQUEST_METHOD'];
$body = null;
if ($method === 'POST' || $method === 'PUT') {
    $body = file_get_contents('php://input');
}

$resp = httpFetch($url, $method, $body, '');

// 被挑战拦截 → 解挑战重试
if (strpos($resp, 'ERR:') === 0 || isChallengePage($resp)) {
    $cookie = solveChallenge();
    if ($cookie !== null) {
        $resp = httpFetch($url, $method, $body, $cookie);
    }
}

echo $resp;
