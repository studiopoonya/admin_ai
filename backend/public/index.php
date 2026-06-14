<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// [DEVOPS FIX]: Paksa Laravel menganggap request ini meminta JSON API
// Ini mencegah Laravel melakukan redirect 301/302 ke halaman /login jika auth/validasi gagal
if (
    (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/api/') !== false) || 
    (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 7080)
) {
    $_SERVER['HTTP_ACCEPT'] = 'application/json';
}

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());