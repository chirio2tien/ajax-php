# đoạn README do AI Viết đó thầy e kêu nó up lên git tự tạo cho e luôn e lười viết lại README mới
# Todo List Ajax - PHP

Ứng dụng quản lý danh sách công việc đơn giản sử dụng PHP, JavaScript Ajax và JSON để lưu trữ dữ liệu.

## 🚀 Tính năng

- ✅ Thêm công việc mới
- ✅ Đánh dấu công việc hoàn thành/chưa hoàn thành
- ✅ Xóa công việc
- ✅ Giao diện responsive
- ✅ Sử dụng Ajax không reload trang
- ✅ Lưu trữ dữ liệu bằng JSON

## 📁 Cấu trúc dự án

```
todo-ajax/
├── index.html          # Giao diện chính
├── script.js           # JavaScript xử lý Ajax
├── style.css           # CSS styling
├── api/                # Backend PHP API
│   ├── add.php         # API thêm công việc
│   ├── delete.php      # API xóa công việc
│   ├── list.php        # API lấy danh sách
│   ├── storage.php     # Class quản lý storage
│   └── toggle.php      # API toggle trạng thái
└── data/
    └── todos.json      # File lưu trữ dữ liệu
```

## 🛠️ Cài đặt và chạy

### Yêu cầu hệ thống
- PHP 7.0 hoặc cao hơn
- Web server (Apache, Nginx, hoặc PHP built-in server)

### Hướng dẫn cài đặt

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/todo-ajax.git
   cd todo-ajax
   ```

2. **Cấp quyền ghi file:**
   ```bash
   chmod 755 data/
   chmod 666 data/todos.json
   ```

3. **Chạy với PHP built-in server:**
   ```bash
   php -S localhost:8000
   ```

4. **Hoặc copy vào thư mục web server:**
   - Copy toàn bộ files vào `htdocs` (XAMPP) hoặc `www` (WAMP)
   - Truy cập: `http://localhost/todo-ajax`

## 💻 Sử dụng

1. Mở trình duyệt và truy cập ứng dụng
2. Nhập công việc mới vào ô input
3. Click "Thêm" hoặc nhấn Enter
4. Click vào checkbox để đánh dấu hoàn thành
5. Click nút "Xóa" để xóa công việc

## 🔧 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/list.php` | Lấy danh sách công việc |
| POST | `/api/add.php` | Thêm công việc mới |
| POST | `/api/toggle.php` | Toggle trạng thái công việc |
| POST | `/api/delete.php` | Xóa công việc |

## 📝 Ví dụ API Request

### Thêm công việc mới
```javascript
fetch('api/add.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'demo-token-12345'
    },
    body: JSON.stringify({
        task: 'Học JavaScript'
    })
})
```

### Toggle trạng thái
```javascript
fetch('api/toggle.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: 1
    })
})
```

## 🎨 Giao diện

- Responsive design hoạt động tốt trên mobile và desktop
- Animations CSS mượt mà
- Màu sắc hiện đại và dễ nhìn
- Loading indicators cho trải nghiệm người dùng tốt hơn

## 🔒 Bảo mật

- CSRF token validation
- Input sanitization
- JSON response format
- Error handling

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 👨‍💻 Tác giả

Được tạo bởi [Your Name]

## 🐛 Báo lỗi

Nếu bạn tìm thấy lỗi, vui lòng tạo issue trên GitHub hoặc liên hệ trực tiếp.
