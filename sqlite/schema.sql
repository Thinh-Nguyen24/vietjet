-- ============================================================
-- DATABASE SCHEMA CHO DỰ ÁN VIETJET TRAVEL (SQLite)
-- Thư mục: sqlite/schema.sql
-- ============================================================

-- Bật tính năng kiểm tra khóa ngoại trong SQLite
PRAGMA foreign_keys = ON;

-- 1. BẢNG HÃNG HÀNG KHÔNG (airlines)
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS airlines;

CREATE TABLE airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,             -- Mã IATA (VJ, VN, QH, SQ, QR)
    name TEXT NOT NULL,                     -- Tên hãng: VietJet Air, Vietnam Airlines...
    logo TEXT NOT NULL,                     -- Đường dẫn ảnh logo
    country TEXT DEFAULT 'Việt Nam',        -- Quốc gia
    description TEXT                        -- Giới thiệu ngắn
);

-- 2. BẢNG CHUYẾN BAY (flights)
CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,           -- Số hiệu: VJ-128, VN-214...
    airline_id INTEGER NOT NULL,            -- Khóa ngoại liên kết bảng airlines
    origin_city TEXT NOT NULL,              -- TP. Hồ Chí Minh, Hà Nội...
    origin_code TEXT NOT NULL,              -- Mã sân bay đi: SGN, HAN, DAD, PQC...
    destination_city TEXT NOT NULL,         -- Hà Nội, Đà Nẵng, Singapore...
    destination_code TEXT NOT NULL,         -- Mã sân bay đến: HAN, DAD, SIN...
    departure_time TEXT NOT NULL,           -- Giờ cất cánh: '05:45', '14:20'
    arrival_time TEXT NOT NULL,             -- Giờ hạ cánh: '07:55', '16:30'
    flight_date TEXT NOT NULL,              -- Ngày bay: '2026-11-15'
    duration TEXT NOT NULL,                 -- Thời lượng bay: '2h 10m'
    aircraft_type TEXT NOT NULL,            -- Loại máy bay: Airbus A321neo, Boeing 787-9...
    flight_type TEXT NOT NULL DEFAULT 'bay_thang', -- 'bay_thang' (bay thẳng) hoặc 'qua_canh' (quá cảnh)
    trip_type TEXT NOT NULL DEFAULT 'khu_hoi',     -- 'khu_hoi' (khứ hồi) hoặc 'mot_chieu' (một chiều)
    departure_period TEXT NOT NULL DEFAULT 'sang', -- Khoảng thời gian: 'sang_som' (00-06h), 'sang' (06-12h), 'chieu' (12-18h), 'toi' (18-24h)
    price_eco INTEGER NOT NULL,             -- Giá vé Hạng Phổ Thông (VND)
    price_business INTEGER NOT NULL,        -- Giá vé Hạng Thương Gia (VND)
    services_eco TEXT DEFAULT '7kg hành lý xách tay, Nước lọc miễn phí',
    services_business TEXT DEFAULT '14kg xách tay + 30kg ký gửi, Phòng chờ VIP, Ưu tiên check-in, Suất ăn nóng cao cấp',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE
);

-- 3. BẢNG TOUR DU LỊCH (tours)
CREATE TABLE tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_name TEXT NOT NULL,                -- Tên tour du lịch
    organizer TEXT NOT NULL,                -- Hãng lữ hành tổ chức (Vietjet Travel, Saigontourist...)
    thumbnail TEXT NOT NULL,                -- Ảnh đại diện chuẩn tỉ lệ 600x400
    duration_days TEXT NOT NULL,            -- Số ngày/đêm: '4 Ngày 3 Đêm', '3 Ngày 2 Đêm'...
    price INTEGER NOT NULL,                 -- Giá tour trọn gói (VND)
    departure_city TEXT NOT NULL,           -- Điểm xuất phát (TP. Hồ Chí Minh, Hà Nội...)
    destination_city TEXT NOT NULL,         -- Điểm đến (Đà Nẵng, Phú Quốc, Bangkok, Tokyo...)
    departure_date TEXT NOT NULL,           -- Ngày khởi hành
    departure_time TEXT NOT NULL,           -- Giờ cất cánh: '07:15', '08:45'
    departure_period TEXT NOT NULL DEFAULT 'sang', -- 'sang_som', 'sang', 'chieu', 'toi'
    airline_id INTEGER NOT NULL,            -- Hãng hàng không vận chuyển
    aircraft_type TEXT NOT NULL,            -- Loại máy bay: Airbus A321neo, Boeing 787...
    flight_duration TEXT NOT NULL,          -- Thời gian bay dự kiến
    services TEXT NOT NULL,                 -- Dịch vụ bao gồm (Khách sạn 4-5 sao, xe đưa đón, ăn uống...)
    itinerary_json TEXT NOT NULL,           -- Lịch trình chi tiết từng ngày (JSON Array)
    rating REAL DEFAULT 4.9,                -- Đánh giá sao (4.8, 4.9, 5.0)
    is_featured INTEGER DEFAULT 1,          -- 1: Tour nổi bật trang chủ (8 tour), 0: Tour thường
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE
);

-- 4. BẢNG GIỎ HÀNG (cart)
CREATE TABLE cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,                -- 'flight' (chuyến bay) hoặc 'tour' (tour du lịch)
    item_id INTEGER NOT NULL,               -- ID của chuyến bay hoặc tour
    item_name TEXT NOT NULL,                -- Tên chuyến bay (VJ-128 SGN -> HAN) hoặc Tên tour
    ticket_class TEXT DEFAULT 'Phổ Thông',  -- 'Phổ Thông' hoặc 'Thương Gia' (cho chuyến bay)
    unit_price INTEGER NOT NULL,            -- Đơn giá tại thời điểm chọn
    quantity INTEGER DEFAULT 1,             -- Số lượng vé / khách
    travel_date TEXT NOT NULL,              -- Ngày bay / Ngày khởi hành
    airline_name TEXT,                      -- Tên hãng hàng không
    aircraft_type TEXT,                     -- Loại máy bay
    details_json TEXT,                      -- Chi tiết bổ sung (ghế, ghi chú...)
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. BẢNG ĐƠN ĐẶT CHỖ (bookings)
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT UNIQUE NOT NULL,     -- Mã đặt chỗ duy nhất (Ví dụ: VJBK-88912)
    customer_name TEXT NOT NULL,            -- Họ và tên khách hàng
    customer_phone TEXT NOT NULL,           -- Số điện thoại
    customer_email TEXT NOT NULL,           -- Email nhận vé
    customer_id_card TEXT NOT NULL,         -- CCCD hoặc số Hộ chiếu
    note TEXT,                              -- Yêu cầu đặc biệt
    total_amount INTEGER NOT NULL,          -- Tổng số tiền thanh toán (VND)
    sender_email TEXT DEFAULT 'nvthinh@gmail.com', -- Email xác nhận gửi từ nvthinh@gmail.com
    items_summary TEXT NOT NULL,            -- Tóm tắt danh sách vé / tour đã đặt (JSON)
    payment_status TEXT DEFAULT 'Pending',  -- Trạng thái: Pending, Confirmed, Paid
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo Index để tăng tốc độ truy vấn và lọc dữ liệu
CREATE INDEX idx_flights_origin_dest ON flights(origin_code, destination_code);
CREATE INDEX idx_flights_price_eco ON flights(price_eco);
CREATE INDEX idx_flights_airline ON flights(airline_id);
CREATE INDEX idx_tours_featured ON tours(is_featured);
CREATE INDEX idx_tours_price ON tours(price);
CREATE INDEX idx_bookings_code ON bookings(booking_code);
