/**
 * ============================================================
 * VIETJET TRAVEL - SQLITE DATABASE MANAGEMENT MODULE (sql.js)
 * Nạp dữ liệu trực tiếp từ file sqlite/db.db và đồng bộ LocalStorage
 * ============================================================
 */

const DB_CONFIG = {
    wasmUrl: 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm',
    dbFilePath: 'sqlite/db.db',
    storageKey: 'vietjet_sqlite_db_cache'
};

let db = null;
let SQL = null;
let isDbReady = false;
const dbReadyCallbacks = [];

/**
 * Đăng ký callback khi DB sẵn sàng
 */
function onDatabaseReady(callback) {
    if (isDbReady && db) {
        callback(db);
    } else {
        dbReadyCallbacks.push(callback);
    }
}

/**
 * Khởi tạo cơ sở dữ liệu SQLite
 */
async function initDatabase() {
    try {
        console.log('🔄 Đang khởi tạo SQLite WebAssembly...');
        
        // 1. Tải thư viện sql.js
        if (!window.initSqlJs) {
            throw new Error('Thư viện sql.js chưa được nạp. Hãy kiểm tra thẻ script.');
        }

        SQL = await window.initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        // 2. Kiểm tra bộ nhớ cache trong LocalStorage
        const cachedDbBase64 = localStorage.getItem(DB_CONFIG.storageKey);
        
        if (cachedDbBase64) {
            try {
                const binaryString = atob(cachedDbBase64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                db = new SQL.Database(bytes);
                console.log('✅ Khôi phục SQLite từ LocalStorage thành công!');
            } catch (err) {
                console.warn('Lỗi đọc cache DB, tải lại từ file...', err);
                db = null;
            }
        }

        // 3. Nếu chưa có DB, tải từ file sqlite/db.db
        if (!db) {
            try {
                console.log(`📥 Đang tải file cơ sở dữ liệu từ ${DB_CONFIG.dbFilePath}...`);
                const response = await fetch(DB_CONFIG.dbFilePath);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const arrayBuffer = await response.arrayBuffer();
                db = new SQL.Database(new Uint8Array(arrayBuffer));
                saveDatabaseToStorage();
                console.log('✅ Đã nạp thành công database từ sqlite/db.db!');
            } catch (fetchErr) {
                console.warn('Không thể fetch trực tiếp file db.db (có thể do mở file:// trực tiếp). Đang khởi tạo DB dự phòng...');
                await initFallbackDatabase();
            }
        }

        isDbReady = true;
        console.log('🚀 Cơ sở dữ liệu Vietjet SQLite đã sẵn sàng phục vụ!');

        // Kích hoạt tất cả callback đã đăng ký
        dbReadyCallbacks.forEach(cb => {
            try { cb(db); } catch (e) { console.error(e); }
        });
        dbReadyCallbacks.length = 0;

        return db;
    } catch (error) {
        console.error('❌ Lỗi khởi tạo SQLite:', error);
        // Khởi tạo DB trắng dự phòng
        await initFallbackDatabase();
        return db;
    }
}

/**
 * Lưu trạng thái DB hiện tại vào LocalStorage
 */
function saveDatabaseToStorage() {
    if (!db) return;
    try {
        const exportedData = db.export();
        let binary = '';
        const len = exportedData.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(exportedData[i]);
        }
        const base64 = btoa(binary);
        localStorage.setItem(DB_CONFIG.storageKey, base64);
    } catch (e) {
        console.warn('Không thể lưu DB vào LocalStorage (có thể do dung lượng vượt mức 5MB):', e);
    }
}

/**
 * Reset database về dữ liệu ban đầu
 */
async function resetDatabaseToDefault() {
    localStorage.removeItem(DB_CONFIG.storageKey);
    isDbReady = false;
    db = null;
    await initDatabase();
    window.location.reload();
}

/**
 * Thực thi câu lệnh SQL trả về danh sách Objects [{col: val}]
 */
function queryObjects(sql, params = []) {
    if (!db) {
        console.error('Database chưa sẵn sàng để thực thi query:', sql);
        return [];
    }
    try {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    } catch (e) {
        console.error('Lỗi thực thi SQL:', sql, params, e);
        return [];
    }
}

/**
 * Thực thi câu lệnh Insert / Update / Delete
 */
function executeSql(sql, params = []) {
    if (!db) return false;
    try {
        db.run(sql, params);
        saveDatabaseToStorage();
        return true;
    } catch (e) {
        console.error('Lỗi executeSql:', sql, params, e);
        return false;
    }
}

// ============================================================
// CÁC HÀM TRUY VẤN NGHIỆP VỤ (API REPOSITORY)
// ============================================================

/**
 * Lấy danh sách Hãng hàng không
 */
function getAllAirlines() {
    return queryObjects(`SELECT * FROM airlines ORDER BY id ASC`);
}

/**
 * Lấy danh sách chuyến bay có lọc
 */
function getFlights(filters = {}) {
    let sql = `
        SELECT f.*, a.name as airline_name, a.logo as airline_logo 
        FROM flights f 
        JOIN airlines a ON f.airline_id = a.id 
        WHERE 1=1
    `;
    const params = [];

    if (filters.origin_code) {
        sql += ` AND f.origin_code = ?`;
        params.push(filters.origin_code);
    }
    if (filters.destination_code) {
        sql += ` AND f.destination_code = ?`;
        params.push(filters.destination_code);
    }
    if (filters.flight_date) {
        sql += ` AND f.flight_date = ?`;
        params.push(filters.flight_date);
    }
    if (filters.airline_id) {
        sql += ` AND f.airline_id = ?`;
        params.push(filters.airline_id);
    }
    if (filters.airline_name) {
        sql += ` AND a.name LIKE ?`;
        params.push(`%${filters.airline_name}%`);
    }
    if (filters.trip_type && filters.trip_type !== 'tat_ca') {
        sql += ` AND f.trip_type = ?`;
        params.push(filters.trip_type);
    }
    if (filters.flight_type && filters.flight_type !== 'tat_ca') {
        sql += ` AND f.flight_type = ?`;
        params.push(filters.flight_type);
    }
    if (filters.departure_period && filters.departure_period !== 'tat_ca') {
        sql += ` AND f.departure_period = ?`;
        params.push(filters.departure_period);
    }

    // Sắp xếp
    if (filters.sort === 'price_asc') {
        sql += ` ORDER BY f.price_eco ASC`;
    } else if (filters.sort === 'price_desc') {
        sql += ` ORDER BY f.price_eco DESC`;
    } else {
        sql += ` ORDER BY f.departure_time ASC`;
    }

    return queryObjects(sql, params);
}

/**
 * Lấy chi tiết chuyến bay theo ID
 */
function getFlightById(id) {
    const list = queryObjects(`
        SELECT f.*, a.name as airline_name, a.logo as airline_logo, a.country as airline_country
        FROM flights f 
        JOIN airlines a ON f.airline_id = a.id 
        WHERE f.id = ?
    `, [id]);
    return list.length > 0 ? list[0] : null;
}

/**
 * Lấy 8 tour nổi bật trang chủ
 */
function getFeaturedTours() {
    return queryObjects(`
        SELECT t.*, a.name as airline_name, a.logo as airline_logo 
        FROM tours t 
        JOIN airlines a ON t.airline_id = a.id 
        WHERE t.is_featured = 1 
        LIMIT 8
    `);
}

/**
 * Lấy danh sách tour có lọc
 */
function getTours(filters = {}) {
    let sql = `
        SELECT t.*, a.name as airline_name, a.logo as airline_logo 
        FROM tours t 
        JOIN airlines a ON t.airline_id = a.id 
        WHERE 1=1
    `;
    const params = [];

    if (filters.airline_id) {
        sql += ` AND t.airline_id = ?`;
        params.push(filters.airline_id);
    }
    if (filters.departure_period && filters.departure_period !== 'tat_ca') {
        sql += ` AND t.departure_period = ?`;
        params.push(filters.departure_period);
    }

    // Sắp xếp
    if (filters.sort === 'price_asc') {
        sql += ` ORDER BY t.price ASC`;
    } else if (filters.sort === 'price_desc') {
        sql += ` ORDER BY t.price DESC`;
    } else {
        sql += ` ORDER BY t.id ASC`;
    }

    return queryObjects(sql, params);
}

/**
 * Lấy chi tiết tour theo ID
 */
function getTourById(id) {
    const list = queryObjects(`
        SELECT t.*, a.name as airline_name, a.logo as airline_logo 
        FROM tours t 
        JOIN airlines a ON t.airline_id = a.id 
        WHERE t.id = ?
    `, [id]);
    return list.length > 0 ? list[0] : null;
}

/**
 * Lấy tất cả items trong giỏ hàng
 */
function getCartItems() {
    return queryObjects(`SELECT * FROM cart ORDER BY id DESC`);
}

/**
 * Đếm tổng số lượng item trong giỏ hàng
 */
function getCartCount() {
    const res = queryObjects(`SELECT SUM(quantity) as total FROM cart`);
    return (res.length > 0 && res[0].total) ? res[0].total : 0;
}

/**
 * Thêm một mục vào giỏ hàng
 */
function addToCart(item) {
    // Kiểm tra xem item cùng loại, cùng ID và cùng hạng vé đã có chưa
    const existing = queryObjects(`
        SELECT id, quantity FROM cart 
        WHERE item_type = ? AND item_id = ? AND ticket_class = ?
    `, [item.item_type, item.item_id, item.ticket_class || 'Phổ Thông']);

    if (existing.length > 0) {
        const newQty = existing[0].quantity + (item.quantity || 1);
        executeSql(`UPDATE cart SET quantity = ? WHERE id = ?`, [newQty, existing[0].id]);
    } else {
        executeSql(`
            INSERT INTO cart (item_type, item_id, item_name, ticket_class, unit_price, quantity, travel_date, airline_name, aircraft_type, details_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            item.item_type,
            item.item_id,
            item.item_name,
            item.ticket_class || 'Phổ Thông',
            item.unit_price,
            item.quantity || 1,
            item.travel_date || '',
            item.airline_name || '',
            item.aircraft_type || '',
            item.details_json || '{}'
        ]);
    }
    return true;
}

/**
 * Xóa một mục khỏi giỏ hàng
 */
function removeFromCart(cartId) {
    return executeSql(`DELETE FROM cart WHERE id = ?`, [cartId]);
}

/**
 * Xóa toàn bộ giỏ hàng
 */
function clearCart() {
    return executeSql(`DELETE FROM cart`);
}

/**
 * Tạo mới đơn đặt chỗ (Booking)
 */
function createBooking(data) {
    const bookingCode = 'VJBK-' + Math.floor(100000 + Math.random() * 900000);
    const success = executeSql(`
        INSERT INTO bookings (booking_code, customer_name, customer_phone, customer_email, customer_id_card, note, total_amount, sender_email, items_summary, payment_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'nvthinh@gmail.com', ?, 'Confirmed')
    `, [
        bookingCode,
        data.customer_name,
        data.customer_phone,
        data.customer_email,
        data.customer_id_card,
        data.note || '',
        data.total_amount,
        JSON.stringify(data.items || [])
    ]);

    if (success) {
        clearCart();
        return bookingCode;
    }
    return null;
}

/**
 * Lấy thông tin đơn đặt chỗ theo mã
 */
function getBookingByCode(code) {
    const res = queryObjects(`SELECT * FROM bookings WHERE booking_code = ?`, [code]);
    return res.length > 0 ? res[0] : null;
}

/**
 * Khởi tạo dữ liệu dự phòng nếu không fetch được file binary
 */
async function initFallbackDatabase() {
    console.log('⚡ Đang nạp cơ sở dữ liệu dự phòng từ seed script...');
    db = new SQL.Database();
    
    // Nạp schema
    db.run(`
        CREATE TABLE IF NOT EXISTS airlines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            logo TEXT NOT NULL,
            country TEXT DEFAULT 'Việt Nam',
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS flights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flight_number TEXT NOT NULL,
            airline_id INTEGER NOT NULL,
            origin_city TEXT NOT NULL,
            origin_code TEXT NOT NULL,
            destination_city TEXT NOT NULL,
            destination_code TEXT NOT NULL,
            departure_time TEXT NOT NULL,
            arrival_time TEXT NOT NULL,
            flight_date TEXT NOT NULL,
            duration TEXT NOT NULL,
            aircraft_type TEXT NOT NULL,
            flight_type TEXT NOT NULL DEFAULT 'bay_thang',
            trip_type TEXT NOT NULL DEFAULT 'khu_hoi',
            departure_period TEXT NOT NULL DEFAULT 'sang',
            price_eco INTEGER NOT NULL,
            price_business INTEGER NOT NULL,
            services_eco TEXT DEFAULT '7kg hành lý xách tay, Nước lọc miễn phí',
            services_business TEXT DEFAULT '14kg xách tay + 30kg ký gửi, Phòng chờ VIP, Ưu tiên check-in, Suất ăn nóng',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tours (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tour_name TEXT NOT NULL,
            organizer TEXT NOT NULL,
            thumbnail TEXT NOT NULL,
            duration_days TEXT NOT NULL,
            price INTEGER NOT NULL,
            departure_city TEXT NOT NULL,
            destination_city TEXT NOT NULL,
            departure_date TEXT NOT NULL,
            departure_time TEXT NOT NULL,
            departure_period TEXT NOT NULL DEFAULT 'sang',
            airline_id INTEGER NOT NULL,
            aircraft_type TEXT NOT NULL,
            flight_duration TEXT NOT NULL,
            services TEXT NOT NULL,
            itinerary_json TEXT NOT NULL,
            rating REAL DEFAULT 4.9,
            is_featured INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_type TEXT NOT NULL,
            item_id INTEGER NOT NULL,
            item_name TEXT NOT NULL,
            ticket_class TEXT DEFAULT 'Phổ Thông',
            unit_price INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            travel_date TEXT NOT NULL,
            airline_name TEXT,
            aircraft_type TEXT,
            details_json TEXT,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            booking_code TEXT UNIQUE NOT NULL,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_id_card TEXT NOT NULL,
            note TEXT,
            total_amount INTEGER NOT NULL,
            sender_email TEXT DEFAULT 'nvthinh@gmail.com',
            items_summary TEXT NOT NULL,
            payment_status TEXT DEFAULT 'Confirmed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Chèn dữ liệu mẫu
    db.run(`
        INSERT INTO airlines (id, code, name, logo, country, description) VALUES
        (1, 'VJ', 'VietJet Air', 'Images/VietJet-Air-logo.png', 'Việt Nam', 'Hãng hàng không thế hệ mới, vé tiết kiệm'),
        (2, 'VN', 'Vietnam Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vietnam_Airlines_logo.svg/320px-Vietnam_Airlines_logo.svg.png', 'Việt Nam', 'Hãng hàng không Quốc gia chuẩn 4 sao'),
        (3, 'QH', 'Bamboo Airways', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Bamboo_Airways_logo.svg/320px-Bamboo_Airways_logo.svg.png', 'Việt Nam', 'Hơn cả một chuyến bay'),
        (4, 'SQ', 'Singapore Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png', 'Singapore', 'Hãng hàng không 5 sao thế giới'),
        (5, 'QR', 'Qatar Airways', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png', 'Qatar', 'Hãng hàng không tốt nhất thế giới Skytrax');
    `);

    // 8 tour nổi bật (600x400)
    db.run(`
        INSERT INTO tours (id, tour_name, organizer, thumbnail, duration_days, price, departure_city, destination_city, departure_date, departure_time, departure_period, airline_id, aircraft_type, flight_duration, services, itinerary_json, rating, is_featured) VALUES
        (1, 'Tour Đà Nẵng - Hội An - Bà Nà Hills Cầu Vàng', 'Vietjet Travel Holidays', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop', '4 Ngày 3 Đêm', 4990000, 'TP. Hồ Chí Minh', 'Đà Nẵng', '2026-11-20', '07:15', 'sang', 1, 'Airbus A321neo', '1h 20m', 'Khách sạn 4 sao biển Mỹ Khê, Vé cáp treo Bà Nà Hills, Xe VIP đưa đón', '[{"day":1,"title":"TP.HCM - Đà Nẵng - Bán Đảo Sơn Trà","desc":"Đón đoàn tại sân bay Tân Sơn Nhất, bay chuyến VJ-620 đến Đà Nẵng. Viếng Chùa Linh Ứng Bãi Bụt ngắm tượng Phật Bà 67m."},{"day":2,"title":"Bà Nà Hills - Cầu Vàng - Fantasy Park","desc":"Trải nghiệm cáp treo 4 kỷ lục thế giới. Check-in Cầu Vàng lừng danh mây trời, vui chơi Fantasy Park."},{"day":3,"title":"Ngũ Hành Sơn - Phố Cổ Hội An Lung Linh","desc":"Khám phá danh thắng Non Nước Ngũ Hành Sơn, bách bộ phố cổ Hội An, thả đèn hoa đăng sông Hoài."},{"day":4,"title":"Chợ Hàn Đà Nẵng - Mua Quà - TP.HCM","desc":"Mua sắm đặc sản chả bò, mực rim me tại chợ Hàn. Xe đưa ra sân bay Đà Nẵng về lại TP.HCM."}]', 4.9, 1),
        (2, 'Tour Đảo Ngọc Phú Quốc - Sunset Town & Cáp Treo Hòn Thơm', 'Vietjet Vacations', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop', '3 Ngày 2 Đêm', 3890000, 'Hà Nội', 'Phú Quốc', '2026-11-22', '08:45', 'sang', 1, 'Airbus A320', '2h 05m', 'Resort 5 sao ven biển, Vé cáp treo Hòn Thơm, Cano 4 đảo lặn ngắm san hô', '[{"day":1,"title":"Hà Nội - Phú Quốc - Sunset Town","desc":"Đáp chuyến bay VJ-451 hạ cánh đảo ngọc. Nhận phòng resort 5 sao, chiều check-in Cầu Hôn Kiss Bridge."},{"day":2,"title":"Cano 4 Đảo - Cáp Treo Vượt Biển Hòn Thơm","desc":"Lên cano tham quan Hòn Mây Rút, Hòn Gầm Ghì lặn ngắm san hô. Trải nghiệm cáp treo 3 dây vượt biển dài nhất thế giới."},{"day":3,"title":"Grand World Thành Phố Không Ngủ - Hà Nội","desc":"Khám phá sông Venice thu nhỏ, bảo tàng Gấu Teddy Bear. Xe đưa ra sân bay Phú Quốc về Nội Bài."}]', 4.95, 1),
        (3, 'Tour Nha Trang Biển Xanh - VinWonders & Vịnh San Hô', 'Việt Travel Group', 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop', '4 Ngày 3 Đêm', 4250000, 'Hà Nội', 'Nha Trang', '2026-11-25', '09:30', 'sang', 2, 'Boeing 787 Dreamliner', '1h 50m', 'Khách sạn 4 sao Trần Phú, Vé VinWonders Hòn Tre, Tắm bùn khoáng nóng', '[{"day":1,"title":"Hà Nội - Cam Ranh - Nha Trang Phố Biển","desc":"Bay máy bay thân rộng Boeing 787 tới Cam Ranh. Thưởng thức nem nướng Ninh Hòa trứ danh."},{"day":2,"title":"Thiên Đường Giải Trí VinWonders Hòn Tre","desc":"Trải nghiệm cáp treo vượt biển tới VinWonders, công viên nước, vịnh phao nổi khổng lồ, Tata Show."},{"day":3,"title":"Du Ngoạn Vịnh Nha Trang - Lặn Ngắm Vịnh San Hô","desc":"Tàu đưa quý khách ra Vịnh San Hô, Bãi Tranh tắm biển lặn ngắm san hô. Dùng tiệc BBQ hải sản tươi sống."},{"day":4,"title":"Tháp Bà Ponagar - Tắm Bùn I-Resort - Hà Nội","desc":"Chiêm ngưỡng kiến trúc Chăm Pa cổ kính, ngâm bùn khoáng nóng phục hồi năng lượng trước khi ra sân bay."}]', 4.85, 1),
        (4, 'Tour Khám Phá Xứ Chùa Vàng Bangkok - Pattaya', 'Vietjet Global Holidays', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', '5 Ngày 4 Đêm', 6890000, 'TP. Hồ Chí Minh', 'Bangkok', '2026-11-28', '11:15', 'sang', 1, 'Airbus A321neo', '1h 35m', 'Bay thẳng Vietjet Air, Khách sạn 4 sao quốc tế, Buffet 86 tầng Baiyoke Sky, Du thuyền Chao Phraya', '[{"day":1,"title":"TP.HCM - Bangkok - Pattaya Phố Biển","desc":"Chuyến bay thẳng VJ-803 hạ cánh Bangkok. Về Pattaya thưởng thức Alcazar Cabaret Show."},{"day":2,"title":"Đảo San Hô Koh Larn - Trân Bảo Phật Sơn","desc":"Tắm biển tại đảo San Hô, viếng tượng Phật dát vàng trên vách núi đá, dạo chợ nổi 4 miền Thái Lan."},{"day":3,"title":"Pattaya - Bangkok - Tiệc Du Thuyền Chao Phraya","desc":"Trở về Bangkok, ăn tối du thuyền ngắm chùa Wat Arun lung linh trong đêm."},{"day":4,"title":"Đại Trung Tâm IconSiam - Chùa Thuyền Wat Yannawa","desc":"Chiêm bái chùa Thuyền xá lợi phật linh thiêng, mua sắm và thưởng thức ẩm thực tại IconSiam."},{"day":5,"title":"Chùa Phật Vàng - Mua Sắm Big C - TP.HCM","desc":"Chiêm ngưỡng tượng Phật bằng vàng ròng 5.5 tấn, tự do mua sắm Big C Pratunam trước khi bay về."}]', 4.9, 1),
        (5, 'Tour Đảo Quốc Sư Tử Singapore - Universal Studios Sentosa', 'ASEAN Discovery', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', '4 Ngày 3 Đêm', 9990000, 'TP. Hồ Chí Minh', 'Singapore', '2026-12-01', '13:40', 'chieu', 4, 'Boeing 777-300ER', '2h 00m', 'Bay Singapore Airlines 5 sao, Khách sạn trung tâm Orchard, Vé Universal Studios', '[{"day":1,"title":"TP.HCM - Changi Jewel - Merlion Park","desc":"SQ-177 đưa quý khách tới Changi, chụp ảnh thác nước Rain Vortex. Check-in Merlion Park."},{"day":2,"title":"Gardens By The Bay - Đảo Sentosa","desc":"Khu rừng siêu cây Supertree Grove, nhà kính Flower Dome. Vui chơi đảo Sentosa, nhạc nước Wings of Time."},{"day":3,"title":"Universal Studios Singapore","desc":"Trọn ngày trải nghiệm: Tàu lượn siêu tốc Battlestar Galactica, Xác ướp Ai Cập, Transformer 3D."},{"day":4,"title":"Chinatown - Phố Cổ Haji Lane - TP.HCM","desc":"Viếng chùa Răng Phật linh thiêng, chụp ảnh bích họa Haji Lane trước khi bay về TP.HCM."}]', 4.92, 1),
        (6, 'Tour Cung Đường Vàng Nhật Bản: Tokyo - Núi Phú Sĩ - Kyoto', 'Sakura Travel Vietjet', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop', '6 Ngày 5 Đêm', 26990000, 'Hà Nội', 'Tokyo', '2026-12-05', '00:30', 'sang_som', 1, 'Airbus A330 Widebody', '5h 15m', 'Bay Vietjet tàu bay thân rộng, Tàu siêu tốc Shinkansen 300km/h, Tắm Onsen', '[{"day":1,"title":"Hà Nội - Tokyo Narita - Khám Phá Tokyo","desc":"Bay đêm thẳng tới Tokyo Narita. Thăm chùa cổ Asakusa Kannon, chụp ảnh Tokyo Skytree."},{"day":2,"title":"Núi Phú Sĩ - Làng Cổ Oshino Hakkai - Tắm Onsen","desc":"Lên trạm 5 Núi Phú Sĩ ngắm tuyết trắng. Dạo làng cổ Oshino Hakkai, tắm khoáng Onsen truyền thống."},{"day":3,"title":"Tàu Siêu Tốc Shinkansen - Cố Đô Kyoto","desc":"Lướt tàu viên đạn Shinkansen đến Kyoto. Chiêm ngưỡng Chùa Vàng Kinkaku-ji soi bóng mặt hồ."},{"day":4,"title":"Rừng Trúc Arashiyama - Cổng Đỏ Fushimi Inari","desc":"Tản bộ rừng trúc Arashiyama, mặc Kimono check-in hàng nghìn cổng Torii Fushimi Inari."},{"day":5,"title":"Thành Phố Osaka - Lâu Đài Osaka - Shinsaibashi","desc":"Khám phá lâu đài cổ Osaka, thưởng thức bánh bạch tuộc Takoyaki và bò Kobe tại Shinsaibashi."},{"day":6,"title":"Kansai Osaka - Hà Nội Nội Bài","desc":"Đoàn ra sân bay Kansai đáp chuyến bay thẳng về Hà Nội, kết thúc chuyến đi tuyệt đẹp."}]', 4.98, 1),
        (7, 'Tour Seoul - Đảo Nami - Lotte World Hàn Quốc Mùa Lễ Hội', 'K-Tour Explorer', 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&h=400&fit=crop', '5 Ngày 4 Đêm', 14500000, 'TP. Hồ Chí Minh', 'Seoul', '2026-12-10', '02:20', 'sang_som', 1, 'Airbus A321neo', '5h 25m', 'Bay thẳng Vietjet Air, Khách sạn 4 sao Seoul, Vé Lotte World, Mặc đồ Hanbok', '[{"day":1,"title":"TP.HCM - Incheon - Cung Điện Gyeongbokgung","desc":"Mặc trang phục Hanbok dạo bước trong Cung Cảnh Phúc và Bảo tàng Dân gian Quốc gia Hàn Quốc."},{"day":2,"title":"Đảo Nami Thơ Mộng - Bản Tình Ca Mùa Đông","desc":"Tàu đưa sang đảo Nami lãng mạn dưới hai hàng cây ngân hạnh, thưởng thức gà xào cay Chuncheon."},{"day":3,"title":"Công Viên Lotte World - Tháp N Seoul","desc":"Vui chơi thả ga tại Lotte World, lên đỉnh tháp truyền hình N Seoul gắn móc khóa tình yêu."},{"day":4,"title":"Học Làm Kimchi - Phố Mua Sắm Myeongdong","desc":"Trải nghiệm muối kim chi truyền thống, mua sắm mỹ phẩm cao cấp tại phố đi bộ Myeongdong."},{"day":5,"title":"Seoul Incheon - TP. Hồ Chí Minh","desc":"Tự do mua sắm tại siêu thị Ponglim trước khi ra sân bay Incheon đáp chuyến bay về lại TP.HCM."}]', 4.88, 1),
        (8, 'Tour Thiên Đường Nhiệt Đới Bali - Cổng Trời Lempuyang', 'Paradise Holidays', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop', '4 Ngày 3 Đêm', 8990000, 'TP. Hồ Chí Minh', 'Bali', '2026-12-12', '08:05', 'sang', 1, 'Airbus A320', '3h 50m', 'Bay thẳng Vietjet Air, Resort 4 sao Ubud, Xích đu Bali Swing, Tiệc BBQ Jimbaran', '[{"day":1,"title":"TP.HCM - Bali - Hoàng Hôn Vịnh Jimbaran","desc":"Bay thẳng tới Denpasar Bali. Thưởng thức tiệc BBQ hải sản ngắm hoàng hôn bãi biển Jimbaran."},{"day":2,"title":"Cổng Trời Lempuyang - Cung Điện Nước Tirta Gangga","desc":"Chụp bức ảnh phản chiếu mây trời tại Cổng Trời Lempuyang, cho cá Koi ăn tại hồ nước hoàng gia."},{"day":3,"title":"Thác Nước Kanto Lampo - Xích Đu Bali Swing","desc":"Check-in thác nước kỳ vĩ trong rừng nhiệt đới, trải nghiệm chiếc xích đu Bali Swing giữa ruộng bậc thang."},{"day":4,"title":"Chợ Nghệ Thuật Ubud - Về Lại TP.HCM","desc":"Mua sắm quà lưu niệm dệt thổ cẩm, đồ gỗ mỹ nghệ tinh xảo trước khi ra sân bay về TP.HCM."}]', 4.94, 1);
    `);

    // Chuyến bay mẫu
    db.run(`
        INSERT INTO flights (flight_number, airline_id, origin_city, origin_code, destination_city, destination_code, departure_time, arrival_time, flight_date, duration, aircraft_type, flight_type, trip_type, departure_period, price_eco, price_business) VALUES
        ('VJ-128', 1, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '05:45', '07:55', '2026-11-15', '2h 10m', 'Airbus A321neo', 'bay_thang', 'khu_hoi', 'sang_som', 1250000, 3450000),
        ('VN-214', 2, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '08:30', '10:40', '2026-11-15', '2h 10m', 'Boeing 787-9', 'bay_thang', 'khu_hoi', 'sang', 1890000, 4800000),
        ('QH-202', 3, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '11:15', '13:25', '2026-11-15', '2h 10m', 'Airbus A321', 'bay_thang', 'mot_chieu', 'sang', 1450000, 3900000),
        ('VJ-166', 1, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '14:20', '16:30', '2026-11-15', '2h 10m', 'Airbus A320', 'bay_thang', 'mot_chieu', 'chieu', 990000, 3100000),
        ('VJ-180', 1, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '19:40', '21:50', '2026-11-15', '2h 10m', 'Airbus A321neo', 'bay_thang', 'khu_hoi', 'toi', 1150000, 3200000),
        ('VJ-624', 1, 'TP. Hồ Chí Minh', 'SGN', 'Đà Nẵng', 'DAD', '07:00', '08:20', '2026-11-15', '1h 20m', 'Airbus A321', 'bay_thang', 'khu_hoi', 'sang', 850000, 2400000),
        ('VN-112', 2, 'TP. Hồ Chí Minh', 'SGN', 'Đà Nẵng', 'DAD', '13:00', '14:20', '2026-11-15', '1h 20m', 'Airbus A350', 'bay_thang', 'mot_chieu', 'chieu', 1350000, 3200000),
        ('VJ-322', 1, 'TP. Hồ Chí Minh', 'SGN', 'Phú Quốc', 'PQC', '09:15', '10:15', '2026-11-16', '1h 00m', 'Airbus A320', 'bay_thang', 'khu_hoi', 'sang', 790000, 2100000),
        ('VN-1822', 2, 'Hà Nội', 'HAN', 'Phú Quốc', 'PQC', '08:45', '10:55', '2026-11-16', '2h 10m', 'Boeing 787-9', 'bay_thang', 'khu_hoi', 'sang', 2150000, 5200000),
        ('SQ-178', 4, 'TP. Hồ Chí Minh', 'SGN', 'Singapore', 'SIN', '12:15', '15:20', '2026-11-16', '2h 05m', 'Boeing 777-300ER', 'bay_thang', 'khu_hoi', 'chieu', 3200000, 8900000),
        ('VJ-803', 1, 'TP. Hồ Chí Minh', 'SGN', 'Bangkok', 'BKK', '11:15', '12:50', '2026-11-17', '1h 35m', 'Airbus A321neo', 'bay_thang', 'khu_hoi', 'sang', 1650000, 3950000),
        ('QR-971', 5, 'Hà Nội', 'HAN', 'Doha', 'DOH', '18:50', '23:15', '2026-11-17', '7h 25m', 'Airbus A350-1000', 'bay_thang', 'khu_hoi', 'toi', 12500000, 35000000);
    `);

    saveDatabaseToStorage();
}

// Tự động khởi tạo khi tải xong script
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
});
