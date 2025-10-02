<?php
require_once 'storage.php';

// Chỉ cho phép POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    jsonResponse(false, 'Method không hỗ trợ');
    exit;
}

// Validate CSRF
validateCSRF();

// Đọc dữ liệu JSON
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Validate input
if (!isset($input['text']) || trim($input['text']) === '') {
    http_response_code(422);
    jsonResponse(false, 'Nội dung công việc không được rỗng');
    exit;
}

$text = trim($input['text']);

// Validate độ dài
if (mb_strlen($text) > 100) {
    http_response_code(422);
    jsonResponse(false, 'Nội dung quá dài (tối đa 100 ký tự)');
    exit;
}

// Đọc dữ liệu hiện tại
$tasks = loadData();

// Tạo task mới
$newTask = [
    'id' => generateId($tasks),
    'text' => $text,
    'completed' => false,
    'created_at' => date('Y-m-d H:i:s')
];

// Thêm vào mảng
$tasks[] = $newTask;

// Lưu
if (saveData($tasks)) {
    http_response_code(201);
    jsonResponse(true, 'Thêm công việc thành công', $newTask);
} else {
    http_response_code(500);
    jsonResponse(false, 'Lỗi lưu dữ liệu');
}