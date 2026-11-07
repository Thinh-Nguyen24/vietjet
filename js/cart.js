/**
 * ============================================================
 * VIETJET TRAVEL - CART & CHECKOUT JAVASCRIPT (js/cart.js)
 * Quản lý giỏ hàng, xóa item, form đăng ký, thông báo hoàn thành & gửi email từ nvthinh@gmail.com
 * ============================================================
 */

let cartItems = [];
let subtotalAmount = 0;
let vatAmount = 0;
let finalTotalAmount = 0;

document.addEventListener('DOMContentLoaded', () => {
    onDatabaseReady(() => {
        loadAndRenderCart();
    });

    setupCheckoutForm();
    setupClearCartButton();
});

/**
 * Tải và hiển thị danh sách giỏ hàng từ SQLite
 */
function loadAndRenderCart() {
    cartItems = getCartItems();
    const cartContainer = document.getElementById('cart-items-body');
    const emptyState = document.getElementById('cart-empty-state');
    const cartContentWrap = document.getElementById('cart-content-wrapper');

    if (!cartItems || cartItems.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (cartContentWrap) cartContentWrap.style.display = 'none';
        updateCartBadge();
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (cartContentWrap) cartContentWrap.style.display = 'grid';

    subtotalAmount = 0;

    cartContainer.innerHTML = cartItems.map(item => {
        const itemTotal = item.unit_price * item.quantity;
        subtotalAmount += itemTotal;

        const iconType = item.item_type === 'flight' ? '✈️ Chuyến Bay' : '🏝️ Tour Trọn Gói';

        return `
            <tr>
                <td>
                    <div style="font-size: 11px; font-weight: 700; color: var(--primary); text-transform: uppercase;">
                        ${iconType} &nbsp;•&nbsp; ${item.airline_name || 'VietJet Air'}
                    </div>
                    <div class="cart-item-name">${item.item_name}</div>
                    <div class="cart-item-sub">
                        Hạng: <strong style="color: var(--primary);">${item.ticket_class}</strong> &nbsp;|&nbsp; 
                        Ngày đi: <strong>${item.travel_date}</strong> &nbsp;|&nbsp; 
                        Máy bay: <strong>${item.aircraft_type || 'A321'}</strong>
                    </div>
                </td>
                <td style="font-weight: 700; color: var(--text-main);">
                    ${formatCurrency(item.unit_price)}
                </td>
                <td style="text-align: center; font-weight: 700;">
                    ${item.quantity}
                </td>
                <td style="font-weight: 800; color: var(--primary);">
                    ${formatCurrency(itemTotal)}
                </td>
                <td style="text-align: right;">
                    <button type="button" class="cart-remove-btn" onclick="handleRemoveCartItem(${item.id})">
                        🗑 Xóa
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Tính toán thuế & tổng cộng
    vatAmount = Math.round(subtotalAmount * 0.08); // 8% VAT
    finalTotalAmount = subtotalAmount + vatAmount;

    // Cập nhật số liệu hiển thị
    document.getElementById('summary-subtotal').textContent = formatCurrency(subtotalAmount);
    document.getElementById('summary-vat').textContent = formatCurrency(vatAmount);
    document.getElementById('summary-grand-total').textContent = formatCurrency(finalTotalAmount);

    updateCartBadge();
}

/**
 * Xóa một mục khỏi giỏ hàng
 */
function handleRemoveCartItem(id) {
    if (confirm('Bạn có chắc chắn muốn xóa mục này khỏi giỏ hàng?')) {
        removeFromCart(id);
        showToast('Đã xóa dịch vụ khỏi giỏ hàng!', 'info');
        loadAndRenderCart();
    }
}

/**
 * Xóa toàn bộ giỏ hàng
 */
function setupClearCartButton() {
    const clearBtn = document.getElementById('btn-clear-cart');
    if (!clearBtn) return;

    clearBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng không?')) {
            clearCart();
            showToast('Đã dọn sạch toàn bộ giỏ hàng!', 'info');
            loadAndRenderCart();
        }
    });
}

/**
 * Xử lý Form đăng ký đặt vé & gửi email từ nvthinh@gmail.com
 */
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return;

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            showToast('Giỏ hàng đang trống. Vui lòng chọn vé hoặc tour!', 'warning');
            return;
        }

        const fullName = document.getElementById('cust-name').value.trim();
        const phone = document.getElementById('cust-phone').value.trim();
        const email = document.getElementById('cust-email').value.trim();
        const idCard = document.getElementById('cust-idcard').value.trim();
        const note = document.getElementById('cust-note')?.value.trim() || '';

        if (!fullName || !phone || !email || !idCard) {
            showToast('Vui lòng điền đầy đủ các thông tin bắt buộc (*)!', 'error');
            return;
        }

        // Tạo đơn đặt chỗ trong SQLite
        const bookingData = {
            customer_name: fullName,
            customer_phone: phone,
            customer_email: email,
            customer_id_card: idCard,
            note: note,
            total_amount: finalTotalAmount,
            items: cartItems
        };

        const bookingCode = createBooking(bookingData);

        if (bookingCode) {
            // Mở Modal thông báo hoàn thành & xem nội dung email xác nhận
            showBookingSuccessModal(bookingCode, bookingData);
            // Refresh lại giỏ hàng (đã được clear trong createBooking)
            loadAndRenderCart();
        } else {
            showToast('Đã có lỗi xảy ra khi lưu đơn đặt chỗ. Vui lòng thử lại!', 'error');
        }
    });
}

/**
 * Hiển thị Modal Thông Báo Hoàn Thành Đặt Vé & Mẫu Email gửi từ nvthinh@gmail.com
 */
function showBookingSuccessModal(bookingCode, data) {
    const modal = document.getElementById('success-modal');
    if (!modal) return;

    // Gán dữ liệu vào modal
    document.getElementById('modal-booking-code').textContent = bookingCode;
    document.getElementById('modal-cust-name').textContent = data.customer_name;
    document.getElementById('modal-cust-email').textContent = data.customer_email;
    document.getElementById('modal-total-amount').textContent = formatCurrency(data.total_amount);

    // Render danh sách tóm tắt vé
    const itemsListHtml = data.items.map(item => `
        <li style="padding: 6px 0; border-bottom: 1px dashed #e5e7eb; display: flex; justify-content: space-between;">
            <span>${item.item_name} (${item.ticket_class}) x ${item.quantity}</span>
            <strong style="color: var(--primary);">${formatCurrency(item.unit_price * item.quantity)}</strong>
        </li>
    `).join('');

    document.getElementById('modal-items-list').innerHTML = itemsListHtml;

    // Gán thông tin Email Simulator gửi từ nvthinh@gmail.com
    document.getElementById('email-sender').textContent = 'nvthinh@gmail.com';
    document.getElementById('email-recipient').textContent = data.customer_email;
    document.getElementById('email-pnr').textContent = bookingCode;
    document.getElementById('email-name').textContent = data.customer_name;
    document.getElementById('email-total').textContent = formatCurrency(data.total_amount);

    modal.classList.add('active');
}

/**
 * Đóng Modal
 */
function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}
