# 🗄️ DATABASE ARCHITECTURE & SCHEMA SPECIFICATION (SQLite in Browser)

## 1. GIẢI PHÁP KỸ THUẬT: SQLITE TRÊN TRÌNH DUYỆT (NO-BACKEND)
Vì dự án chạy hoàn toàn bằng **HTML, CSS, JavaScript thuần** không có backend server, chúng ta sử dụng thư viện **`sql.js`** (SQLite được biên dịch sang WebAssembly).
- **Thư viện WebAssembly CDN:**
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js"></script>
  ```
- **Cơ chế lưu trữ (Persistence):**
  - Database SQLite chạy trên RAM của trình duyệt.
  - Khi có cập nhật (Thêm vào giỏ, tạo đơn đặt chỗ), xuất dữ liệu binary của SQLite (`db.export()`) và lưu vào `LocalStorage` hoặc `IndexedDB` dưới dạng Base64/Uint8Array.
  - Khi người dùng tải lại trang hoặc đổi trang, hệ thống đọc lại từ bộ nhớ và khôi phục database tức thì.

---

## 2. LƯỢC ĐỒ CƠ SỞ DỮ LIỆU (DDL SCHEMA)

```sql
-- 1. Bảng Hãng Hàng Không
CREATE TABLE IF NOT EXISTS airlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,             -- VJ, VN, QH, SQ, QR
    name TEXT NOT NULL,                     -- VietJet Air, Vietnam Airlines...
    logo TEXT NOT NULL,                     -- Đường dẫn ảnh logo
    country TEXT DEFAULT 'Việt Nam'
);

-- 2. Bảng Chuyến Bay
CREATE TABLE IF NOT EXISTS flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,           -- VJ-128, VN-214...
    airline_id INTEGER,                     -- Khóa ngoại liên kết bảng airlines
    origin_city TEXT NOT NULL,              -- TP. Hồ Chí Minh
    origin_code TEXT NOT NULL,              -- SGN
    destination_city TEXT NOT NULL,         -- Hà Nội
    destination_code TEXT NOT NULL,         -- HAN
    departure_time TEXT NOT NULL,           -- '06:15', '14:30'...
    arrival_time TEXT NOT NULL,             -- '08:25', '16:40'...
    flight_date TEXT NOT NULL,              -- '2026-11-15'
    duration TEXT NOT NULL,                 -- '2h 10m'
    aircraft_type TEXT NOT NULL,            -- 'Airbus A321neo', 'Boeing 787'...
    flight_type TEXT NOT NULL,              -- 'bay_thang' hoặc 'qua_canh'
    trip_type TEXT NOT NULL,                -- 'mot_chieu' hoặc 'khu_hoi'
    price_eco INTEGER NOT NULL,             -- Giá vé phổ thông (VND)
    price_business INTEGER NOT NULL,        -- Giá vé thương gia (VND)
    services TEXT,                          -- Mô tả dịch vụ: 'Hành lý 7kg, Nước uống, WiFi'
    FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- 3. Bảng Tour Du Lịch
CREATE TABLE IF NOT EXISTS tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_name TEXT NOT NULL,
    organizer TEXT NOT NULL,                -- Vietjet Travel, Saigontourist...
    thumbnail TEXT NOT NULL,                -- Kích thước 600x400
    duration_days TEXT NOT NULL,            -- '4 Ngày 3 Đêm'
    price INTEGER NOT NULL,                 -- Giá tour (VND)
    departure_city TEXT NOT NULL,           -- TP. Hồ Chí Minh
    destination_city TEXT NOT NULL,         -- Đà Nẵng, Phú Quốc, Tokyo...
    departure_date TEXT NOT NULL,           -- '2026-11-20'
    departure_time TEXT NOT NULL,           -- '07:30'
    airline_id INTEGER,                     -- Hãng hàng không bay
    aircraft_type TEXT NOT NULL,            -- Airbus A321 / Boeing 777
    flight_duration TEXT NOT NULL,          -- '1h 20m'
    services TEXT NOT NULL,                 -- 'Khách sạn 4 sao, Xe đưa đón, Ăn uống'
    itinerary_json TEXT NOT NULL,           -- Chuỗi JSON lịch trình từng ngày
    is_featured INTEGER DEFAULT 1,          -- 1: Tour nổi bật trang chủ (8 tour)
    FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- 4. Bảng Giỏ Hàng
CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,                -- 'flight' hoặc 'tour'
    item_id INTEGER NOT NULL,               -- ID chuyến bay hoặc ID tour
    item_name TEXT NOT NULL,
    item_class TEXT,                        -- 'Phổ Thông' hoặc 'Thương Gia'
    unit_price INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    travel_date TEXT NOT NULL,
    details_json TEXT                       -- Lưu chi tiết bổ sung
);

-- 5. Bảng Đơn Đặt Chỗ (Bookings)
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT UNIQUE NOT NULL,     -- Ví dụ: VJBK-89213
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_id_card TEXT NOT NULL,         -- CCCD / Hộ chiếu
    total_amount INTEGER NOT NULL,
    items_summary TEXT NOT NULL,
    status TEXT DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. DỮ LIỆU KHỞI TẠO MẪU (SEED DATA)

```sql
-- Dữ liệu Hãng hàng không
INSERT INTO airlines (code, name, logo, country) VALUES
('VJ', 'VietJet Air', 'Images/VietJet-Air-logo.png', 'Việt Nam'),
('VN', 'Vietnam Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vietnam_Airlines_logo.svg/320px-Vietnam_Airlines_logo.svg.png', 'Việt Nam'),
('QH', 'Bamboo Airways', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Bamboo_Airways_logo.svg/320px-Bamboo_Airways_logo.svg.png', 'Việt Nam'),
('SQ', 'Singapore Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png', 'Singapore'),
('QR', 'Qatar Airways', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png', 'Qatar');

-- Dữ liệu 8 Tour Nổi Bật (Thumbnail 600x400)
INSERT INTO tours (tour_name, organizer, thumbnail, duration_days, price, departure_city, destination_city, departure_date, departure_time, airline_id, aircraft_type, flight_duration, services, itinerary_json, is_featured) VALUES
(
    'Tour Đà Nẵng - Hội An - Bà Nà Hills', 
    'Vietjet Travel Holidays', 
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop', 
    '4 Ngày 3 Đêm', 
    4990000, 
    'TP. Hồ Chí Minh', 
    'Đà Nẵng', 
    '2026-11-20', 
    '07:15', 
    1, 
    'Airbus A321neo', 
    '1h 20m', 
    'Khách sạn 4 sao biển Mỹ Khê, Vé cáp treo Bà Nà, Xe VIP',
    '[{"day":1,"title":"TP.HCM - Đà Nẵng - Bán đảo Sơn Trà","desc":"Đón đoàn tại sân bay Tân Sơn Nhất, bay chuyến VJ-620. Đến Đà Nẵng, viếng chùa Linh Ứng, nhận phòng khách sạn."},{"day":2,"title":"Bà Nà Hills - Cầu Vàng - Fantasy Park","desc":"Trải nghiệm cáp treo đạt kỷ lục thế giới, check-in Cầu Vàng lừng danh thế giới, ăn buffet trưa."},{"day":3,"title":"Ngũ Hành Sơn - Phố cổ Hội An lung linh","desc":"Thăm làng đá mỹ nghệ Non Nước, dạo phố cổ Hội An thả hoa đăng, thưởng thức cao lầu."},{"day":4,"title":"Chợ Hàn Đà Nẵng - TP.HCM","desc":"Mua sắm đặc sản miền Trung, xe đưa đoàn ra sân bay Đà Nẵng về lại TP.HCM."}]',
    1
),
(
    'Tour Đảo Ngọc Phú Quốc - Sunset Town & Cáp Treo Hòn Thơm', 
    'Vietjet Vacations', 
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop', 
    '3 Ngày 2 Đêm', 
    3890000, 
    'Hà Nội', 
    'Phú Quốc', 
    '2026-11-22', 
    '08:45', 
    1, 
    'Airbus A320', 
    '2h 05m', 
    'Resort 5 sao ven biển, Buffet sáng, Vé Hòn Thơm Nature Park',
    '[{"day":1,"title":"Hà Nội - Phú Quốc - Sunset Sanato","desc":"Đáp chuyến bay VJ-451 đến Phú Quốc. Check-in bãi biển ngắm hoàng hôn đẹp nhất Việt Nam."},{"day":2,"title":"Khám phá Nam Đảo - Cáp treo vượt biển Hòn Thơm","desc":"Lặn ngắm san hô 4 đảo bằng cano cao tốc, trải nghiệm cáp treo 3 dây dài nhất thế giới."},{"day":3,"title":"Grand World - Thành phố không ngủ - Trở về Hà Nội","desc":"Khám phá bảo tàng Gấu Teddy, sông Venice, ra sân bay bay về Nội Bài."}]',
    1
),
(
    'Tour Nha Trang Biển Xanh - VinWonders & Vịnh San Hô', 
    'Việt Travel Group', 
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop', 
    '4 Ngày 3 Đêm', 
    4250000, 
    'Hà Nội', 
    'Nha Trang', 
    '2026-11-25', 
    '09:30', 
    2, 
    'Boeing 787 Dreamliner', 
    '1h 50m', 
    'Khách sạn 4 sao Trần Phú, Vé trọn gói VinWonders, Tour cano 3 đảo',
    '[{"day":1,"title":"Hà Nội - Cam Ranh - Nha Trang Phố Biển","desc":"Xe đón về trung tâm phố biển, thưởng thức nem nướng Ninh Hòa trứ danh."},{"day":2,"title":"Oanh tạc Công viên giải trí VinWonders","desc":"Trải nghiệm đu quay khổng lồ, công viên nước và show diễn triệu đô Tata Show."},{"day":3,"title":"Du ngoạn Vịnh Nha Trang - Lặn ngắm San Hô","desc":"Cano đưa tham quan Vịnh San Hô, Bãi Tranh, ngắm đàn cá rực rỡ sắc màu."},{"day":4,"title":"Tháp Bà Ponagar - Tắm bùn khoáng I-Resort","desc":"Thư giãn phục hồi sức khỏe với bùn khoáng nóng thiên nhiên trước khi ra sân bay."}]',
    1
),
(
    'Tour Khám Phá Xứ Chùa Vàng Bangkok - Pattaya', 
    'Vietjet Global Holidays', 
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', 
    '5 Ngày 4 Đêm', 
    6890000, 
    'TP. Hồ Chí Minh', 
    'Bangkok', 
    '2026-11-28', 
    '11:15', 
    1, 
    'Airbus A321neo', 
    '1h 35m', 
    'Bay thẳng Vietjet Air, Khách sạn 4 sao quốc tế, Buffet Baiyoke Sky 86 tầng',
    '[{"day":1,"title":"TP.HCM - Bangkok - Pattaya Phố Biển Không Ngủ","desc":"Đáp chuyến bay VJ-803 tới Suvarnabhumi, di chuyển về Pattaya, xem Alcazar Cabaret Show."},{"day":2,"title":"Đảo San Hô Koh Larn - Trân Bảo Phật Sơn","desc":"Tắm biển tại đảo san hô hoang sơ, chiêm bái tượng Phật dát vàng 9999 trên vách núi."},{"day":3,"title":"Pattaya - Bangkok - Du thuyền sông Chao Phraya","desc":"Trở về Bangkok, viếng Chùa Thuyền Wat Yannawa, ăn tối du thuyền 5 sao trên dòng Chao Phraya."},{"day":4,"title":"Trung tâm thương mại IconSiam - Chùa Phật Vàng","desc":"Tự do mua sắm tại thiên đường IconSiam, chiêm ngưỡng tượng Phật bằng vàng nguyên khối nặng 5.5 tấn."},{"day":5,"title":"Bangkok - Mua sắm Big C Pratunam - TP.HCM","desc":"Mua sắm quà lưu niệm tại Big C, xe đưa ra sân bay làm thủ tục về TP.HCM."}]',
    1
),
(
    'Tour Đảo Quốc Sư Tử Singapore - Universal Studios', 
    'ASEAN Discovery', 
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', 
    '4 Ngày 3 Đêm', 
    9990000, 
    'TP. Hồ Chí Minh', 
    'Singapore', 
    '2026-12-01', 
    '13:40', 
    4, 
    'Boeing 777-300ER', 
    '2h 00m', 
    'Bay Singapore Airlines chuẩn 5 sao quốc tế, Khách sạn trung tâm Orchard',
    '[{"day":1,"title":"TP.HCM - Sân bay Changi - Jewel Thác Nước Rain Vortex","desc":"Đáp chuyến bay SQ-177 đến sân bay đẹp nhất thế giới, check-in thác nước kỳ vĩ."},{"day":2,"title":"Gardens by the Bay - Công viên Sư Tử Biển Merlion","desc":"Thăm siêu cây khổng lồ Supertree, Dome hoa cỏ Flower Dome, chụp ảnh tượng Sư tử biển."},{"day":3,"title":"Đảo Sentosa - Universal Studios Singapore","desc":"Thử thách tàu lượn siêu tốc Battlestar Galactica và công viên hải dương học S.E.A Aquarium."},{"day":4,"title":"Chùa Răng Phật Chinatown - Về lại TP.HCM","desc":"Khám phá văn hóa ẩm thực người Hoa tại Chinatown và làm thủ tục bay về."}]',
    1
),
(
    'Tour Cung Đường Vàng Nhật Bản: Tokyo - Núi Phú Sĩ - Kyoto', 
    'Sakura Travel Vietjet', 
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop', 
    '6 Ngày 5 Đêm', 
    26990000, 
    'Hà Nội', 
    'Tokyo', 
    '2026-12-05', 
    '00:30', 
    1, 
    'Airbus A330 Widebody', 
    '5h 15m', 
    'Vé máy bay Vietjet khứ hồi tàu bay thân rộng, Trải nghiệm tàu Shinkansen, Tắm Onsen',
    '[{"day":1,"title":"Hà Nội - Tokyo Narita - Khám phá thủ đô sầm uất","desc":"Chuyến bay đêm đưa đoàn tới Tokyo, tham quan đền Asakusa Kannon cổ kính nhất thủ đô."},{"day":2,"title":"Núi Phú Sĩ linh thiêng - Làng cổ Oshino Hakkai","desc":"Lên trạm số 5 Núi Phú Sĩ ngắm tuyết trắng, dạo quanh làng cổ thanh bình dưới chân núi."},{"day":3,"title":"Trải nghiệm Tàu Siêu Tốc Shinkansen - Cố đô Kyoto","desc":"Di chuyển bằng tàu siêu tốc 300km/h đến Kyoto, viếng Chùa Vàng Kinkaku-ji."},{"day":4,"title":"Rừng trúc Arashiyama - Cổng Torii Fushimi Inari","desc":"Check-in hàng nghìn cổng Torii đỏ rực, trải nghiệm mặc trang phục Kimono truyền thống."},{"day":5,"title":"Osaka - Lâu đài Osaka uy nghiêm - Phố Shinsaibashi","desc":"Tham quan biểu tượng lịch sử của thành phố Osaka, ăn uống thỏa thích ở Dotonbori."},{"day":6,"title":"Kansai Osaka - Bay về Hà Nội","desc":"Đoàn ra sân bay Kansai đáp chuyến bay thẳng về Nội Bài, kết thúc chuyến đi đáng nhớ."}]',
    1
),
(
    'Tour Seoul - Nami - Lotte World Hàn Quốc Mùa Lễ Hội', 
    'K-Tour Explorer', 
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&h=400&fit=crop', 
    '5 Ngày 4 Đêm', 
    14500000, 
    'TP. Hồ Chí Minh', 
    'Seoul', 
    '2026-12-10', 
    '02:20', 
    1, 
    'Airbus A321neo', 
    '5h 25m', 
    'Bay Vietjet thẳng Incheon, Khách sạn 4 sao Seoul, Vé trọn gói Lotte World',
    '[{"day":1,"title":"TP.HCM - Sân bay Incheon - Cung điện Gyeongbokgung","desc":"Đến Seoul buổi sáng, mặc trang phục Hanbok truyền thống tham quan cung điện hoàng gia."},{"day":2,"title":"Đảo Nami lãng mạn - Phim trường Bản Tình Ca Mùa Đông","desc":"Tản bộ dưới hàng cây lá vàng tuyệt đẹp, thưởng thức món gà xào bắp cải cay Chuncheon."},{"day":3,"title":"Công viên giải trí trong nhà Lotte World - Tháp Namsan","desc":"Vui chơi không giới hạn tại Lotte World, gắn ổ khóa tình yêu trên đỉnh tháp N Seoul."},{"day":4,"title":"Lớp học làm Kimchi - Chợ đêm Myeongdong","desc":"Tự tay muối món kim chi trứ danh, mua sắm mỹ phẩm cao cấp tại chợ đêm Myeongdong."},{"day":5,"title":"Seoul Incheon - TP. Hồ Chí Minh","desc":"Tạm biệt xứ sở Kim Chi, đáp chuyến bay về lại sân bay Tân Sơn Nhất."}]',
    1
),
(
    'Tour Thiên Đường Nhiệt Đới Bali - Cổng Trời Lempuyang', 
    'Paradise Holidays', 
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop', 
    '4 Ngày 3 Đêm', 
    8990000, 
    'TP. Hồ Chí Minh', 
    'Bali', 
    '2026-12-12', 
    '08:05', 
    1, 
    'Airbus A320', 
    '3h 50m', 
    'Resort 4 sao Ubud & Kuta, Xích đu Bali Swing, Bữa tối hải sản bãi biển Jimbaran',
    '[{"day":1,"title":"TP.HCM - Đảo Bali - Hoàng hôn Jimbaran huyền ảo","desc":"Bay thẳng từ Tân Sơn Nhất đến Denpasar Bali, thưởng thức tiệc BBQ hải sản trên cát."},{"day":2,"title":"Check-in Cổng Trời Lempuyang - Cung điện nước Tirta Gangga","desc":"Chụp bức ảnh phản chiếu mây trời ngoạn mục tại Cổng Trời, cho cá Koi ăn tại hồ nước hoàng gia."},{"day":3,"title":"Thác nước Kanto Lampo - Xích đu Bali Swing Ubud","desc":"Trải nghiệm cảm giác bay lượn giữa rừng dừa xanh ngát, check-in tổ chim Bali nổi tiếng."},{"day":4,"title":"Chợ nghệ thuật Ubud - Bay về TP.HCM","desc":"Mua sắm đồ thủ công mỹ nghệ tinh xảo từ bàn tay các nghệ nhân Bali trước khi ra sân bay."}]',
    1
);

-- Dữ liệu Chuyến Bay Mẫu
INSERT INTO flights (flight_number, airline_id, origin_city, origin_code, destination_city, destination_code, departure_time, arrival_time, flight_date, duration, aircraft_type, flight_type, trip_type, price_eco, price_business, services) VALUES
('VJ-128', 1, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '05:45', '07:55', '2026-11-15', '2h 10m', 'Airbus A321neo', 'bay_thang', 'khu_hoi', 1250000, 3450000, '7kg xách tay, Nước suối'),
('VN-214', 2, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '08:30', '10:40', '2026-11-15', '2h 10m', 'Boeing 787-9', 'bay_thang', 'khu_hoi', 1890000, 4800000, '12kg xách tay, 23kg ký gửi, Suất ăn nóng'),
('QH-202', 3, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '11:15', '13:25', '2026-11-15', '2h 10m', 'Airbus A321', 'bay_thang', 'mot_chieu', 1450000, 3900000, '7kg xách tay, 20kg ký gửi, Suất ăn nhẹ'),
('VJ-166', 1, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '14:20', '16:30', '2026-11-15', '2h 10m', 'Airbus A320', 'bay_thang', 'mot_chieu', 990000, 3100000, '7kg xách tay'),
('VJ-180', 1, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '19:40', '21:50', '2026-11-15', '2h 10m', 'Airbus A321neo', 'bay_thang', 'khu_hoi', 1150000, 3200000, '7kg xách tay, Nước suối'),
('VJ-624', 1, 'TP. Hồ Chí Minh', 'SGN', 'Đà Nẵng', 'DAD', '07:00', '08:20', '2026-11-15', '1h 20m', 'Airbus A321', 'bay_thang', 'khu_hoi', 850000, 2400000, '7kg xách tay'),
('VN-112', 2, 'TP. Hồ Chí Minh', 'SGN', 'Đà Nẵng', 'DAD', '13:00', '14:20', '2026-11-15', '1h 20m', 'Airbus A350', 'bay_thang', 'mot_chieu', 1350000, 3200000, '12kg xách tay, 23kg ký gửi'),
('VJ-322', 1, 'TP. Hồ Chí Minh', 'SGN', 'Phú Quốc', 'PQC', '09:15', '10:15', '2026-11-16', '1h 00m', 'Airbus A320', 'bay_thang', 'khu_hoi', 790000, 2100000, '7kg xách tay'),
('SQ-178', 4, 'TP. Hồ Chí Minh', 'SGN', 'Singapore', 'SIN', '12:15', '15:20', '2026-11-16', '2h 05m', 'Boeing 777-300ER', 'bay_thang', 'khu_hoi', 3200000, 8900000, 'Suất ăn cao cấp, WiFi, Màn hình giải trí cá nhân'),
('QR-971', 5, 'Hà Nội', 'HAN', 'Doha', 'DOH', '18:50', '23:15', '2026-11-17', '7h 25m', 'Airbus A350-1000', 'bay_thang', 'khu_hoi', 12500000, 35000000, 'Suất ăn chuẩn 5 sao, Rượu vang thượng hạng, Bộ tiện ích ngủ');
```
