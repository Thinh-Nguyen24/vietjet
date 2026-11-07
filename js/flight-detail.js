/**
 * ============================================================
 * VIETJET TRAVEL - FLIGHT DETAIL JAVASCRIPT (js/flight-detail.js)
 * Hiển thị chi tiết chuyến bay, chọn hạng vé Phổ thông / Thương gia & Thêm vào giỏ
 * ============================================================
 */

let currentFlight = null;
let selectedTicketClass = 'Phổ Thông';
let currentPrice = 0;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = getUrlParams();
    const flightId = urlParams.id || 1;

    onDatabaseReady(() => {
        loadFlightDetail(flightId);
    });

    setupClassSelectionEvents();
    setupAddToCartButton();
});

/**
 * Tải chi tiết chuyến bay từ SQLite
 */
function loadFlightDetail(id) {
    currentFlight = getFlightById(id);

    if (!currentFlight) {
        document.getElementById('flight-detail-content').innerHTML = `
            <div style="text-align: center; padding: 48px; background: #fff; border-radius: 12px;">
                <h2>Không tìm thấy thông tin chuyến bay!</h2>
                <a href="flights.html" class="btn btn-primary" style="margin-top: 16px;">Quay lại danh sách chuyến bay</a>
            </div>
        `;
        return;
    }

    currentPrice = currentFlight.price_eco;

    // Render thông tin lộ trình & máy bay
    document.getElementById('flight-number-display').textContent = currentFlight.flight_number;
    document.getElementById('flight-airline-name').textContent = currentFlight.airline_name;
    document.getElementById('flight-airline-logo').src = currentFlight.airline_logo;
    document.getElementById('flight-airline-logo').alt = currentFlight.airline_name;

    document.getElementById('flight-aircraft-type').textContent = currentFlight.aircraft_type;
    document.getElementById('flight-duration').textContent = currentFlight.duration;
    document.getElementById('flight-date-display').textContent = currentFlight.flight_date;

    document.getElementById('origin-name').textContent = currentFlight.origin_city;
    document.getElementById('origin-code').textContent = currentFlight.origin_code;
    document.getElementById('origin-time').textContent = currentFlight.departure_time;

    document.getElementById('dest-name').textContent = currentFlight.destination_city;
    document.getElementById('dest-code').textContent = currentFlight.destination_code;
    document.getElementById('dest-time').textContent = currentFlight.arrival_time;

    // Cập nhật giá vé 2 hạng
    document.getElementById('price-eco').textContent = formatCurrency(currentFlight.price_eco);
    document.getElementById('price-business').textContent = formatCurrency(currentFlight.price_business);
    
    // Cập nhật tổng tiền thanh toán hiển thị
    updateSummaryPrice();
}

/**
 * Xử lý click chọn hạng vé Phổ thông hoặc Thương gia
 */
function setupClassSelectionEvents() {
    const ecoCard = document.getElementById('card-class-eco');
    const businessCard = document.getElementById('card-class-business');

    if (ecoCard) {
        ecoCard.addEventListener('click', () => {
            selectedTicketClass = 'Phổ Thông';
            ecoCard.classList.add('selected');
            businessCard.classList.remove('selected');
            currentPrice = currentFlight.price_eco;
            updateSummaryPrice();
        });
    }

    if (businessCard) {
        businessCard.addEventListener('click', () => {
            selectedTicketClass = 'Thương Gia';
            businessCard.classList.add('selected');
            ecoCard.classList.remove('selected');
            currentPrice = currentFlight.price_business;
            updateSummaryPrice();
        });
    }
}

/**
 * Cập nhật tổng tiền trên box xác nhận
 */
function updateSummaryPrice() {
    const summaryClassEl = document.getElementById('summary-selected-class');
    const summaryPriceEl = document.getElementById('summary-total-price');

    if (summaryClassEl) summaryClassEl.textContent = selectedTicketClass;
    if (summaryPriceEl) summaryPriceEl.textContent = formatCurrency(currentPrice);
}

/**
 * Xử lý thêm chuyến bay vào giỏ hàng
 */
function setupAddToCartButton() {
    const addToCartBtn = document.getElementById('btn-add-flight-to-cart');
    if (!addToCartBtn) return;

    addToCartBtn.addEventListener('click', () => {
        if (!currentFlight) return;

        const cartItem = {
            item_type: 'flight',
            item_id: currentFlight.id,
            item_name: `Chuyến bay ${currentFlight.flight_number} (${currentFlight.origin_code} ✈ ${currentFlight.destination_code})`,
            ticket_class: selectedTicketClass,
            unit_price: currentPrice,
            quantity: 1,
            travel_date: currentFlight.flight_date,
            airline_name: currentFlight.airline_name,
            aircraft_type: currentFlight.aircraft_type,
            details_json: JSON.stringify({
                departure_time: currentFlight.departure_time,
                arrival_time: currentFlight.arrival_time,
                duration: currentFlight.duration
            })
        };

        const success = addToCart(cartItem);
        if (success) {
            updateCartBadge();
            showToast(`Đã thêm chuyến bay ${currentFlight.flight_number} (${selectedTicketClass}) vào Giỏ Hàng!`, 'success');
            
            // Chuyển sang giỏ hàng sau 1 giây
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1000);
        } else {
            showToast('Không thể thêm vào giỏ hàng. Vui lòng thử lại!', 'error');
        }
    });
}
