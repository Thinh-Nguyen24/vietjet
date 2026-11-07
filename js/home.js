/**
 * ============================================================
 * VIETJET TRAVEL - HOME PAGE JAVASCRIPT (js/home.js)
 * Xử lý: Search Box, Render 8 Tour nổi bật, Render Hãng bay
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    setupTripTypeToggle();
    setupSearchForm();

    // Chờ SQLite sẵn sàng rồi nạp dữ liệu
    onDatabaseReady(() => {
        renderFeaturedTours();
        renderAirlinesSection();
    });
});

/**
 * Xử lý toggle giữa Khứ hồi và Một chiều
 */
function setupTripTypeToggle() {
    const tripRadios = document.querySelectorAll('input[name="trip_type"]');
    const returnDateInput = document.getElementById('return-date');

    tripRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'mot_chieu') {
                returnDateInput.disabled = true;
                returnDateInput.value = '';
            } else {
                returnDateInput.disabled = false;
            }
        });
    });

    // Mặc định thiết lập ngày đi là ngày mai, ngày về là 4 ngày sau
    const departureDateInput = document.getElementById('departure-date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnDay = new Date(today);
    returnDay.setDate(returnDay.getDate() + 5);

    if (departureDateInput) {
        departureDateInput.value = tomorrow.toISOString().split('T')[0];
        departureDateInput.min = today.toISOString().split('T')[0];
    }
    if (returnDateInput) {
        returnDateInput.value = returnDay.toISOString().split('T')[0];
        returnDateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

/**
 * Xử lý sự kiện bấm Tìm Kiếm Chuyến Bay
 */
function setupSearchForm() {
    const searchBtn = document.getElementById('btn-search-flights');
    if (!searchBtn) return;

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const tripType = document.querySelector('input[name="trip_type"]:checked')?.value || 'khu_hoi';
        const fromCity = document.getElementById('origin-city')?.value || 'SGN';
        const toCity = document.getElementById('dest-city')?.value || 'HAN';
        const depDate = document.getElementById('departure-date')?.value || '';
        const retDate = document.getElementById('return-date')?.value || '';

        if (fromCity === toCity) {
            showToast('Điểm đi và điểm đến không được trùng nhau!', 'warning');
            return;
        }

        // Chuyển hướng sang trang flights.html kèm query params
        const params = new URLSearchParams({
            trip_type: tripType,
            from: fromCity,
            to: toCity,
            dep_date: depDate,
            ret_date: retDate
        });

        window.location.href = `flights.html?${params.toString()}`;
    });
}

/**
 * Render 8 Tour du lịch nổi bật từ SQLite
 */
function renderFeaturedTours() {
    const container = document.getElementById('featured-tours-list');
    if (!container) return;

    const tours = getFeaturedTours();

    if (!tours || tours.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #999;">Không có tour nổi bật nào.</p>`;
        return;
    }

    container.innerHTML = tours.map(tour => `
        <article class="tour-card">
            <div class="tour-thumb-wrap">
                <img src="${tour.thumbnail}" alt="${tour.tour_name}" class="tour-thumb" loading="lazy" />
                <span class="tour-duration-badge">⏱ ${tour.duration_days}</span>
                <span class="tour-airline-badge">✈ ${tour.airline_name}</span>
            </div>
            <div class="tour-body">
                <div class="tour-organizer">${tour.organizer}</div>
                <h3 class="tour-name">
                    <a href="tour-detail.html?id=${tour.id}" title="${tour.tour_name}">
                        ${tour.tour_name}
                    </a>
                </h3>
                <div class="tour-services">
                    <span>✨ ${tour.services}</span>
                </div>
                <div class="tour-footer">
                    <div class="tour-price-row">
                        <div class="tour-price-box">
                            <span class="tour-price-label">Giá trọn gói từ</span>
                            <span class="tour-price">${formatCurrency(tour.price)}</span>
                        </div>
                        <span style="font-size: 12px; color: #10b981; font-weight: 700; background: #ecfdf5; padding: 2px 8px; border-radius: 999px;">★ 4.9</span>
                    </div>
                    <a href="tour-detail.html?id=${tour.id}" class="tour-action-btn">
                        <span>Xem Chi Tiết Tour</span>
                        <span>→</span>
                    </a>
                </div>
            </div>
        </article>
    `).join('');
}

/**
 * Render các Hãng hàng không đối tác và click để lọc chuyến bay
 */
function renderAirlinesSection() {
    const container = document.getElementById('airlines-list');
    if (!container) return;

    const airlines = getAllAirlines();

    if (!airlines || airlines.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = airlines.map(airline => `
        <div class="airline-card" onclick="goToAirlinesFlights('${encodeURIComponent(airline.name)}')">
            <img src="${airline.logo}" alt="${airline.name}" title="${airline.name}" />
            <div class="airline-name">${airline.name}</div>
            <span class="airline-hint">Xem chuyến bay →</span>
        </div>
    `).join('');
}

/**
 * Chuyển hướng sang trang flights.html khi click vào Logo hãng bay
 */
function goToAirlinesFlights(airlineName) {
    window.location.href = `flights.html?airline_name=${airlineName}`;
}
