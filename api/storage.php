<?php
// File lưu trữ dữ liệu
define('DATA_FILE', __DIR__ . '/../data/todos.json');

// Đảm bảo thư mục data tồn tại
if (!file_exists(__DIR__ . '/../data')) {
    mkdir(__DIR__ . '/../data', 0755, true);
}

// Đọc dữ liệu
function loadData()
{
    if (!file_exists(DATA_FILE)) {
        return [];
    }

    $json = file_get_contents(DATA_FILE);
    $data = json_decode($json, true);

    return is_array($data) ? $data : [];
}

// Lưu dữ liệu
function saveData($data)
{
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    return file_put_contents(DATA_FILE, $json) !== false;
}

// Tạo ID mới
function generateId($tasks)
{
    if (empty($tasks)) {
        return 1;
    }

    $maxId = max(array_column($tasks, 'id'));
    return $maxId + 1;
}

// Validate CSRF token (đơn giản hóa)
function validateCSRF()
{
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    // Trong thực tế nên dùng session token
    if ($token !== 'demo-token-12345') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'CSRF token không hợp lệ'
        ]);
        exit;
    }
}

// Trả về JSON response
function jsonResponse($success, $message, $data = null)
{
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
}