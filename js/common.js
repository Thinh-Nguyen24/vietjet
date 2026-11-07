/**
 * ============================================================
 * VIETJET TRAVEL - COMMON UTILITY & UI MODULE
 * Quản lý Header Badge, Toast thông báo, Format tiền VND, URL Helpers
 * ============================================================
 */

// Định dạng tiền tệ VND
function formatCurrency(amount) {
    if (isNaN(amount)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(amount);
}

// Cập nhật số lượng hiển thị trên icon Giỏ hàng trên Header
function updateCartBadge() {
    onDatabaseReady(() => {
        const count = getCartCount();
        const badgeElements = document.querySelectorAll('.cart-badge');
        badgeElements.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        });
    });
}

// Hiển thị Toast thông báo nổi góc trên bên phải
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    let icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'info') icon = 'ℹ';
    if (type === 'warning') icon = '⚠';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">${message}</div>
    `;

    container.appendChild(toast);

    // Tự động ẩn sau 3.5 giây
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 400);
    }, 3500);
}

// Lấy tham số từ Query String trên URL (?id=1&airline=Vietjet)
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}

// Highlight menu active tương ứng với trang hiện tại
function setActiveNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Khởi chạy khi DOM load
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavigation();
    updateCartBadge();
});
