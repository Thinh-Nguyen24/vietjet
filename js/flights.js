/**
 * ============================================================
 * VIETJET TRAVEL - FLIGHTS LISTING JAVASCRIPT (js/flights.js)
 * Bộ lọc đa tiêu chí bên trái & Render danh sách vé chuyến bay bên phải
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Đọc tham số từ URL nếu có (từ ô search trang chủ hoặc click logo hãng)
    const urlParams = getUrlParams();
    applyUrlParamsToFilters(urlParams);

    // Lắng nghe sự kiện thay đổi của các bộ lọc
    setupFilterListeners();

    // Chờ SQLite sẵn sàng rồi nạp dữ liệu
    onDatabaseReady(() => {
        loadFlightAirlinesFilter();
        renderFlightResults();
    });
});

/**
 * Đưa các tham số trên URL vào giao diện bộ lọc ban đầu
 */
function applyUrlParamsToFilters(params) {
    if (params.trip_type) {
        const radio = document.querySelector(`input[name="filter_trip_type"][value="${params.trip_type}"]`);
        if (radio) radio.checked = true;
    }
    if (params.sort) {
        const radio = document.querySelector(`input[name="filter_sort"][value="${params.sort}"]`);
        if (radio) radio.checked = true;
    }
}

/**
 * Nạp danh sách checkbox hãng hàng không vào sidebar
 */
function loadFlightAirlinesFilter() {
    const container = document.getElementById('airline-filter-list');
    if (!container) return;

    const airlines = getAllAirlines();
    const urlParams = getUrlParams();
    const selectedAirlineName = urlParams.airline_name ? decodeURIComponent(urlParams.airline_name) : '';

    container.innerHTML = airlines.map(airline => {
        const isChecked = selectedAirlineName && airline.name.toLowerCase().includes(selectedAirlineName.toLowerCase());
        return `
            <label class="filter-option">
                <input type="checkbox" name="filter_airline" value="${airline.id}" ${isChecked ? 'checked' : ''}>
                <span>${airline.name}</span>
            </label>
        `;
    }).join('');

    // Đăng ký sự kiện change cho các checkbox vừa tạo
    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => renderFlightResults());
    });
}

/**
 * Đăng ký sự kiện cho tất cả các điều khiển trong bộ lọc
 */
function setupFilterListeners() {
    const filterInputs = document.querySelectorAll(
        'input[name="filter_sort"], input[name="filter_trip_type"], input[name="filter_flight_type"], input[name="filter_period"], input[name="filter_class"]'
    );
    filterInputs.forEach(input => {
        input.addEventListener('change', () => renderFlightResults());
    });

    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetAllFilters();
        });
    }
}

/**
 * Reset toàn bộ bộ lọc về mặc định
 */
function resetAllFilters() {
    // Reset Sort
    const defaultSort = document.querySelector('input[name="filter_sort"][value="price_asc"]');
    if (defaultSort) defaultSort.checked = true;

    // Reset Trip Type
    const defaultTrip = document.querySelector('input[name="filter_trip_type"][value="tat_ca"]');
    if (defaultTrip) defaultTrip.checked = true;

    // Reset Flight Type
    const defaultFlightType = document.querySelector('input[name="filter_flight_type"][value="tat_ca"]');
    if (defaultFlightType) defaultFlightType.checked = true;

    // Reset Period
    const defaultPeriod = document.querySelector('input[name="filter_period"][value="tat_ca"]');
    if (defaultPeriod) defaultPeriod.checked = true;

    // Reset Airline Checkboxes
    document.querySelectorAll('input[name="filter_airline"]').forEach(cb => cb.checked = false);

    // Xóa query param trên URL
    window.history.replaceState({}, document.title, window.location.pathname);

    renderFlightResults();
}

/**
 * Thu thập giá trị lọc và render danh sách chuyến bay
 */
function renderFlightResults() {
    const container = document.getElementById('flights-list-container');
    const countElement = document.getElementById('flights-count');
    if (!container) return;

    // Lấy tiêu chí lọc
    const sort = document.querySelector('input[name="filter_sort"]:checked')?.value || 'price_asc';
    const tripType = document.querySelector('input[name="filter_trip_type"]:checked')?.value || 'tat_ca';
    const flightType = document.querySelector('input[name="filter_flight_type"]:checked')?.value || 'tat_ca';
    const period = document.querySelector('input[name="filter_period"]:checked')?.value || 'tat_ca';

    // Lấy các airline đã chọn
    const selectedAirlines = Array.from(document.querySelectorAll('input[name="filter_airline"]:checked')).map(cb => cb.value);

    // Lấy params điểm đi / đến nếu có trên URL
    const urlParams = getUrlParams();
    const originCode = urlParams.from || '';
    const destCode = urlParams.to || '';

    // Lấy tất cả chuyến bay
    let flights = getFlights({
        sort: sort,
        trip_type: tripType,
        flight_type: flightType,
        departure_period: period,
        origin_code: originCode,
        destination_code: destCode
    });

    // Lọc theo mảng hãng bay nếu có chọn
    if (selectedAirlines.length > 0) {
        flights = flights.filter(f => selectedAirlines.includes(f.airline_id.toString()));
    }

    if (countElement) {
        countElement.textContent = flights.length;
    }

    if (!flights || flights.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 48px 20px; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;">
                <div style="font-size: 48px; margin-bottom: 16px;">🛫</div>
                <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Không tìm thấy chuyến bay phù hợp</h3>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">Vui lòng thử điều chỉnh lại bộ lọc hoặc chọn một ngày bay khác.</p>
                <button type="button" onclick="resetAllFilters()" class="btn btn-outline btn-sm">Đặt lại bộ lọc</button>
            </div>
        `;
        return;
    }

    container.innerHTML = flights.map(flight => {
        const flightTypeBadge = flight.flight_type === 'bay_thang' 
            ? '<span style="color: #10b981; font-weight: 700; font-size: 12px;">Bay thẳng</span>' 
            : '<span style="color: #f59e0b; font-weight: 700; font-size: 12px;">Quá cảnh</span>';

        return `
            <div class="flight-card">
                <!-- Thông tin hãng bay -->
                <div class="flight-airline-info">
                    <img src="${flight.airline_logo}" alt="${flight.airline_name}" class="flight-airline-logo" />
                    <div class="flight-airline-name">${flight.airline_name}</div>
                    <span class="flight-number-tag">Số hiệu: ${flight.flight_number}</span>
                    <span style="font-size: 11px; color: #6b7280;">Máy bay: <strong>${flight.aircraft_type}</strong></span>
                </div>

                <!-- Lịch trình & giờ bay -->
                <div class="flight-schedule-info">
                    <div class="time-box">
                        <div class="time-display">${flight.departure_time}</div>
                        <div class="city-code">${flight.origin_code} (${flight.origin_city})</div>
                    </div>

                    <div class="flight-route-line">
                        <span class="duration-tag">⏱ ${flight.duration}</span>
                        <div class="route-arrow">
                            <span>✈</span>
                        </div>
                        <div class="plane-type-tag">${flightTypeBadge}</div>
                    </div>

                    <div class="time-box">
                        <div class="time-display">${flight.arrival_time}</div>
                        <div class="city-code">${flight.destination_code} (${flight.destination_city})</div>
                    </div>
                </div>

                <!-- Giá vé & nút chọn -->
                <div class="flight-pricing-box">
                    <span class="flight-price-from">Giá chỉ từ</span>
                    <div class="flight-main-price">${formatCurrency(flight.price_eco)}</div>
                    <span style="font-size: 12px; color: #10b981; font-weight: 600;">✓ ${flight.services_eco || '7kg xách tay'}</span>
                    <a href="flight-detail.html?id=${flight.id}" class="btn btn-primary btn-sm" style="margin-top: 8px; width: 100%;">
                        Chọn Chuyến Bay →
                    </a>
                </div>
            </div>
        `;
    }).join('');
}
