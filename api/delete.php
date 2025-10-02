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

// Đọc input
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Validate
if (!isset($input['id']) || !is_numeric($input['id'])) {
    http_response_code(422);
    jsonResponse(false, 'ID không hợp lệ');
    exit;
}

$id = (int)$input['id'];

// Đọc dữ liệu
$tasks = loadData();

// Tìm và xóa
$found = false;
$tasks = array_filter($tasks, function ($task) use ($id, &$found) {
    if ($task['id'] === $id) {
        $found = true;
        return false; // Loại bỏ
    }
    return true;
});

if (!$found) {
    http_response_code(404);
    jsonResponse(false, 'Không tìm thấy công việc');
    exit;
}

// Lưu lại
if (saveData(array_values($tasks))) {
    jsonResponse(true, 'Xóa thành công');
} else {
    http_response_code(500);
    jsonResponse(false, 'Lỗi lưu dữ liệu');
}