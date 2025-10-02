// ==================== CẤU HÌNH ====================
const API_BASE = 'api/';
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').content;

// ==================== KHỞI TẠO ====================
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    
    // Enter để thêm task
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// ==================== HIỂN THỊ TRẠNG THÁI ====================
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// ==================== HIỂN THỊ/ẨN LOADING ====================
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// ==================== TẢI DANH SÁCH ====================
function loadTasks() {
    showLoading(true);
    
    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', API_BASE + 'list.php', true);
    
    xhr.onload = function() {
        showLoading(false);
        
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    renderTasks(response.data);
                } else {
                    showStatus('Lỗi: ' + response.message, 'error');
                }
            } catch (e) {
                showStatus('Lỗi parse JSON', 'error');
                console.error('Parse error:', e);
            }
        } else {
            showStatus('Lỗi kết nối: ' + xhr.status, 'error');
        }
    };
    
    xhr.onerror = function() {
        showLoading(false);
        showStatus('Lỗi mạng, kiểm tra kết nối', 'error');
    };
    
    xhr.send();
}

// ==================== RENDER DANH SÁCH ====================
function renderTasks(tasks) {
    const listElement = document.getElementById('todoList');
    
    if (!tasks || tasks.length === 0) {
        listElement.innerHTML = '<div class="empty-state">📭 Chưa có công việc nào</div>';
        return;
    }
    
    listElement.innerHTML = tasks.map(task => `
        <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${task.id})"
            >
            <span class="todo-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Xóa</button>
        </li>
    `).join('');
}

// ==================== THÊM CÔNG VIỆC ====================
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    // Validate
    if (!text) {
        showStatus('Vui lòng nhập nội dung công việc', 'error');
        input.focus();
        return;
    }
    
    if (text.length > 100) {
        showStatus('Nội dung quá dài (tối đa 100 ký tự)', 'error');
        return;
    }
    
    // Disable button khi đang gửi
    const addBtn = document.getElementById('addBtn');
    addBtn.disabled = true;
    addBtn.textContent = 'Đang thêm...';
    
    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', API_BASE + 'add.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRF-Token', CSRF_TOKEN);
    
    xhr.onload = function() {
        addBtn.disabled = false;
        addBtn.textContent = 'Thêm';
        
        if (xhr.status === 201 || xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    showStatus('✓ Đã thêm công việc', 'success');
                    input.value = '';
                    loadTasks(); // Tải lại danh sách
                } else {
                    showStatus('Lỗi: ' + response.message, 'error');
                }
            } catch (e) {
                showStatus('Lỗi parse JSON', 'error');
            }
        } else {
            showStatus('Lỗi HTTP: ' + xhr.status, 'error');
        }
    };
    
    xhr.onerror = function() {
        addBtn.disabled = false;
        addBtn.textContent = 'Thêm';
        showStatus('Lỗi mạng', 'error');
    };
    
    const data = JSON.stringify({ text: text });
    xhr.send(data);
}

// ==================== XÓA CÔNG VIỆC ====================
function deleteTask(id) {
    if (!confirm('Bạn có chắc muốn xóa công việc này?')) {
        return;
    }
    
    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', API_BASE + 'delete.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRF-Token', CSRF_TOKEN);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    showStatus('✓ Đã xóa công việc', 'success');
                    loadTasks();
                } else {
                    showStatus('Lỗi: ' + response.message, 'error');
                }
            } catch (e) {
                showStatus('Lỗi parse JSON', 'error');
            }
        } else {
            showStatus('Lỗi HTTP: ' + xhr.status, 'error');
        }
    };
    
    xhr.onerror = function() {
        showStatus('Lỗi mạng', 'error');
    };
    
    xhr.send(JSON.stringify({ id: id }));
}

// ==================== ĐÁNH DẤU HOÀN THÀNH ====================
function toggleTask(id) {
    const xhr = new XMLHttpRequest();
    
    xhr.open('POST', API_BASE + 'toggle.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRF-Token', CSRF_TOKEN);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    // Không reload, chỉ update trạng thái local
                    const item = document.querySelector(`[data-id="${id}"]`);
                    if (item) {
                        item.classList.toggle('completed');
                    }
                } else {
                    showStatus('Lỗi: ' + response.message, 'error');
                    loadTasks(); // Reload nếu có lỗi
                }
            } catch (e) {
                showStatus('Lỗi parse JSON', 'error');
            }
        } else {
            showStatus('Lỗi HTTP: ' + xhr.status, 'error');
        }
    };
    
    xhr.onerror = function() {
        showStatus('Lỗi mạng', 'error');
    };
    
    xhr.send(JSON.stringify({ id: id }));
}

// ==================== ESCAPE HTML (bảo mật XSS) ====================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}