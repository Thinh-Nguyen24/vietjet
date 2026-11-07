/**
 * ============================================================
 * VIETJET TRAVEL - TOURS LISTING JAVASCRIPT (js/tours.js)
 * Bộ lọc tour bên trái & Render danh sách Tour bên phải
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    setupTourFilterListeners();

    onDatabaseReady(() => {
        loadTourAirlinesFilter();
        renderTourResults();
    });
});

/**
 * Nạp danh sách checkbox hãng hàng không vào sidebar tour
 */
function loadTourAirlinesFilter() {
    const container = document.getElementById('tour-airline-filter-list');
    if (!container) return;

    const airlines = getAllAirlines();
    container.innerHTML = airlines.map(airline => `
        <label class="filter-option">
            <input type="checkbox" name="filter_tour_airline" value="${airline.id}">
            <span>${airline.name}</span>
        </label>
    `).join('');

    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => renderTourResults());
    });
}

/**
 * Đăng ký sự kiện thay đổi của các bộ lọc
 */
function setupTourFilterListeners() {
    const filterInputs = document.querySelectorAll(
        'input[name="filter_tour_sort"], input[name="filter_tour_period"]'
    );
    filterInputs.forEach(input => {
        input.addEventListener('change', () => renderTourResults());
    });

    const resetBtn = document.getElementById('btn-reset-tour-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetAllTourFilters();
        });
    }
}

/**
 * Đặt lại bộ lọc tour về mặc định
 */
function resetAllTourFilters() {
    const defaultSort = document.querySelector('input[name="filter_tour_sort"][value="price_asc"]');
    if (defaultSort) defaultSort.checked = true;

    const defaultPeriod = document.querySelector('input[name="filter_tour_period"][value="tat_ca"]');
    if (defaultPeriod) defaultPeriod.checked = true;

    document.querySelectorAll('input[name="filter_tour_airline"]').forEach(cb => cb.checked = false);

    renderTourResults();
}

/**
 * Thu thập giá trị lọc và render danh sách tour
 */
function renderTourResults() {
    const container = document.getElementById('tours-list-container');
    const countElement = document.getElementById('tours-count');
    if (!container) return;

    const sort = document.querySelector('input[name="filter_tour_sort"]:checked')?.value || 'price_asc';
    const period = document.querySelector('input[name="filter_tour_period"]:checked')?.value || 'tat_ca';

    const selectedAirlines = Array.from(document.querySelectorAll('input[name="filter_tour_airline"]:checked')).map(cb => cb.value);

    let tours = getTours({
        sort: sort,
        departure_period: period
    });

    if (selectedAirlines.length > 0) {
        tours = tours.filter(t => selectedAirlines.includes(t.airline_id.toString()));
    }

    if (countElement) {
        countElement.textContent = tours.length;
    }

    if (!tours || tours.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 48px 20px; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;">
                <div style="font-size: 48px; margin-bottom: 16px;">🏝️</div>
                <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Không tìm thấy tour du lịch phù hợp</h3>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">Vui lòng thử điều chỉnh lại bộ lọc giá hoặc chọn lại hãng bay.</p>
                <button type="button" onclick="resetAllTourFilters()" class="btn btn-outline btn-sm">Đặt lại bộ lọc</button>
            </div>
        `;
        return;
    }

    container.innerHTML = tours.map(tour => `
        <div class="flight-card" style="grid-template-columns: 240px 1fr 200px;">
            <!-- Ảnh thumbnail 600x400 -->
            <div style="position: relative; border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 600/400;">
                <img src="${tour.thumbnail}" alt="${tour.tour_name}" style="width: 100%; height: 100%; object-fit: cover;" />
                <span style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 999px;">
                    ⏱ ${tour.duration_days}
                </span>
            </div>

            <!-- Thông tin tour & hành trình bay -->
            <div>
                <span style="font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase;">
                    ✈ ${tour.airline_name} &nbsp;•&nbsp; ${tour.organizer}
                </span>
                <h3 style="font-size: 18px; font-weight: 800; color: var(--text-main); margin: 6px 0 10px 0;">
                    <a href="tour-detail.html?id=${tour.id}">
                        ${tour.tour_name}
                    </a>
                </h3>
                <div style="display: flex; gap: 16px; font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">
                    <span>📍 Khởi hành: <strong>${tour.departure_city}</strong> ➔ <strong>${tour.destination_city}</strong></span>
                    <span>📅 Ngày: <strong>${tour.departure_date}</strong> (${tour.departure_time})</span>
                </div>
                <div style="display: flex; gap: 16px; font-size: 13px; color: var(--text-muted); margin-bottom: 8px;">
                    <span>✈️ Tàu bay: <strong>${tour.aircraft_type}</strong> (Thời gian bay: ${tour.flight_duration})</span>
                </div>
                <div style="font-size: 13px; color: #10b981; font-weight: 600;">
                    ✓ Dịch vụ: ${tour.services}
                </div>
            </div>

            <!-- Giá tiền & nút xem chi tiết -->
            <div class="flight-pricing-box" style="display: flex; flex-direction: column; justify-content: center; min-width: 210px;">
                <span class="flight-price-from" style="font-size: 12px; color: #6b7280; font-weight: 500;">Giá tour trọn gói / khách</span>
                <div class="flight-main-price" style="margin: 4px 0 6px 0;">${formatCurrency(tour.price)}</div>
                <span style="font-size: 12px; color: #10b981; font-weight: 600; margin-bottom: 12px;">✓ Đã gồm vé máy bay khứ hồi</span>
                <a href="tour-detail.html?id=${tour.id}" class="tour-action-btn" style="padding: 12px 18px; font-size: 14px;">
                    <span>Xem Chi Tiết & Đặt Tour</span>
                    <span>→</span>
                </a>
            </div>
        </div>
    `).join('');
}
