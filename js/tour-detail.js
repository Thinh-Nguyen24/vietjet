/**
 * ============================================================
 * VIETJET TRAVEL - TOUR DETAIL JAVASCRIPT (js/tour-detail.js)
 * Hiển thị chi tiết tour, Timeline lịch trình từng ngày & Thêm vào giỏ hàng
 * ============================================================
 */

let currentTour = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = getUrlParams();
    const tourId = urlParams.id || 1;

    onDatabaseReady(() => {
        loadTourDetail(tourId);
    });

    setupAddTourToCartButton();
});

/**
 * Tải chi tiết tour từ SQLite
 */
function loadTourDetail(id) {
    currentTour = getTourById(id);

    if (!currentTour) {
        document.getElementById('tour-detail-content').innerHTML = `
            <div style="text-align: center; padding: 48px; background: #fff; border-radius: 12px;">
                <h2>Không tìm thấy thông tin tour du lịch!</h2>
                <a href="tours.html" class="btn btn-primary" style="margin-top: 16px;">Quay lại danh sách tour</a>
            </div>
        `;
        return;
    }

    // Gán dữ liệu lên giao diện
    document.getElementById('tour-name-display').textContent = currentTour.tour_name;
    document.getElementById('tour-organizer-display').textContent = currentTour.organizer;
    document.getElementById('tour-duration-display').textContent = currentTour.duration_days;
    document.getElementById('tour-price-display').textContent = formatCurrency(currentTour.price);

    document.getElementById('tour-thumb-img').src = currentTour.thumbnail;
    document.getElementById('tour-thumb-img').alt = currentTour.tour_name;

    document.getElementById('tour-dep-city').textContent = currentTour.departure_city;
    document.getElementById('tour-dest-city').textContent = currentTour.destination_city;
    document.getElementById('tour-dep-date').textContent = currentTour.departure_date;
    document.getElementById('tour-dep-time').textContent = currentTour.departure_time;

    document.getElementById('tour-airline-name').textContent = currentTour.airline_name;
    document.getElementById('tour-airline-logo').src = currentTour.airline_logo;
    document.getElementById('tour-aircraft-type').textContent = currentTour.aircraft_type;
    document.getElementById('tour-flight-duration').textContent = currentTour.flight_duration;

    document.getElementById('tour-services-display').textContent = currentTour.services;

    // Render Timeline Lịch trình chuyến đi (Day-by-Day)
    renderItineraryTimeline(currentTour.itinerary_json);
}

/**
 * Phân giải chuỗi JSON và render Timeline lịch trình chuyến đi
 */
function renderItineraryTimeline(jsonString) {
    const container = document.getElementById('itinerary-timeline-container');
    if (!container) return;

    try {
        const days = JSON.parse(jsonString || '[]');
        if (days.length === 0) {
            container.innerHTML = '<p style="color: #6b7280;">Đang cập nhật lịch trình chi tiết...</p>';
            return;
        }

        container.innerHTML = days.map(item => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-day">Ngày ${item.day}</div>
                <h4 class="timeline-title">${item.title}</h4>
                <p class="timeline-desc">${item.desc}</p>
            </div>
        `).join('');
    } catch (e) {
        console.error('Lỗi parse itinerary_json:', e);
        container.innerHTML = '<p style="color: #6b7280;">Lịch trình theo thỏa thuận.</p>';
    }
}

/**
 * Xử lý thêm Tour vào giỏ hàng
 */
function setupAddTourToCartButton() {
    const btn = document.getElementById('btn-add-tour-to-cart');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!currentTour) return;

        const cartItem = {
            item_type: 'tour',
            item_id: currentTour.id,
            item_name: currentTour.tour_name,
            ticket_class: 'Tour Trọn Gói',
            unit_price: currentTour.price,
            quantity: 1,
            travel_date: currentTour.departure_date,
            airline_name: currentTour.airline_name,
            aircraft_type: currentTour.aircraft_type,
            details_json: JSON.stringify({
                duration: currentTour.duration_days,
                departure_city: currentTour.departure_city,
                destination_city: currentTour.destination_city,
                departure_time: currentTour.departure_time,
                services: currentTour.services
            })
        };

        const success = addToCart(cartItem);
        if (success) {
            updateCartBadge();
            showToast(`Đã thêm tour "${currentTour.tour_name}" vào Giỏ Hàng!`, 'success');

            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1000);
        } else {
            showToast('Không thể thêm tour vào giỏ. Vui lòng thử lại!', 'error');
        }
    });
}
