<?php
require_once 'storage.php';

// Chỉ cho phép GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    jsonResponse(false, 'Method không hỗ trợ');
    exit;
}

// Đọc dữ liệu
$tasks = loadData();

// Sắp xếp theo ID giảm dần (mới nhất trên cùng)
usort($tasks, function ($a, $b) {
    return $b['id'] - $a['id'];
});

jsonResponse(true, 'Lấy danh sách thành công', $tasks);