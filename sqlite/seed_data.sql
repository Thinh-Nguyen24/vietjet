-- ============================================================
-- DỮ LIỆU MẪU (SEED DATA) CHO DỰ ÁN VIETJET TRAVEL (SQLite)
-- Thư mục: sqlite/seed_data.sql
-- ============================================================

-- 1. CHÈN DỮ LIỆU CÁC HÃNG HÀNG KHÔNG ĐỐI TÁC
INSERT INTO airlines (id, code, name, logo, country, description) VALUES
(1, 'VJ', 'VietJet Air', 'Images/VietJet-Air-logo.png', 'Việt Nam', 'Hãng hàng không thế hệ mới, tiên phong mang lại cơ hội bay tiết kiệm cho mọi người.'),
(2, 'VN', 'Vietnam Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vietnam_Airlines_logo.svg/320px-Vietnam_Airlines_logo.svg.png', 'Việt Nam', 'Hãng hàng không Quốc gia Việt Nam chuẩn 4 sao quốc tế.'),
(3, 'QH', 'Bamboo Airways', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Bamboo_Airways_logo.svg/320px-Bamboo_Airways_logo.svg.png', 'Việt Nam', 'Hãng hàng không dịch vụ định hướng 5 sao với lòng hiếu khách tận tâm.'),
(4, 'SQ', 'Singapore Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png', 'Singapore', 'Hãng hàng không 5 sao hàng đầu thế giới với phi đội hiện đại bậc nhất.'),
(5, 'QR', 'Qatar Airways', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png', 'Qatar', 'Hãng hàng không tốt nhất thế giới Skytrax với khoang thương gia Qsuite đẳng cấp.');

-- 2. CHÈN DỮ LIỆU 8 TOUR DU LỊCH NỔI BẬT (Ảnh Thumbnail chuẩn 600x400)
INSERT INTO tours (id, tour_name, organizer, thumbnail, duration_days, price, departure_city, destination_city, departure_date, departure_time, departure_period, airline_id, aircraft_type, flight_duration, services, itinerary_json, rating, is_featured) VALUES
(
    1,
    'Tour Đà Nẵng - Hội An - Bà Nà Hills Cầu Vàng', 
    'Vietjet Travel Holidays', 
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop', 
    '4 Ngày 3 Đêm', 
    4990000, 
    'TP. Hồ Chí Minh', 
    'Đà Nẵng', 
    '2026-11-20', 
    '07:15', 
    'sang',
    1, 
    'Airbus A321neo', 
    '1h 20m', 
    'Khách sạn 4 sao biển Mỹ Khê, Vé cáp treo Bà Nà Hills, Xe VIP đưa đón, Hướng dẫn viên suốt tuyến',
    '[
        {"day": 1, "title": "TP.HCM - Đà Nẵng - Bán Đảo Sơn Trà", "desc": "Đón đoàn tại sân bay Tân Sơn Nhất, bay chuyến VJ-620 đến Đà Nẵng. Viếng Chùa Linh Ứng Bãi Bụt ngắm tượng Phật Bà 67m, tắm biển Mỹ Khê và thưởng thức đặc sản bánh tráng cuốn thịt heo hai đầu da."},
        {"day": 2, "title": "Bà Nà Hills - Cầu Vàng - Fantasy Park", "desc": "Trải nghiệm hệ thống cáp treo đạt 4 kỷ lục thế giới. Check-in Cầu Vàng lừng danh nằm giữa mây trời, vui chơi không giới hạn tại Fantasy Park và thưởng thức buffet trưa quốc tế tại Làng Pháp."},
        {"day": 3, "title": "Ngũ Hành Sơn - Phố Cổ Hội An Lung Linh", "desc": "Khám phá danh thắng Non Nước Ngũ Hành Sơn, thăm làng đá mỹ nghệ 300 năm. Buổi chiều bách bộ phố cổ Hội An, thả đèn hoa đăng lung linh trên sông Hoài và ăn tối cao lầu."},
        {"day": 4, "title": "Chợ Hàn Đà Nẵng - Mua Quà Lưu Niệm - TP.HCM", "desc": "Tự do mua sắm đặc sản chả bò, mực rim me tại chợ Hàn. Xe đưa đoàn ra sân bay quốc tế Đà Nẵng làm thủ tục đáp chuyến bay về lại TP.HCM."}
    ]',
    4.9,
    1
),
(
    2,
    'Tour Đảo Ngọc Phú Quốc - Sunset Town & Cáp Treo Hòn Thơm', 
    'Vietjet Vacations', 
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop', 
    '3 Ngày 2 Đêm', 
    3890000, 
    'Hà Nội', 
    'Phú Quốc', 
    '2026-11-22', 
    '08:45', 
    'sang',
    1, 
    'Airbus A320', 
    '2h 05m', 
    'Resort 5 sao có bãi biển riêng, Vé cáp treo Hòn Thơm, Cano 4 đảo lặn ngắm san hô, Buffet hải sản',
    '[
        {"day": 1, "title": "Hà Nội - Phú Quốc - Thị Trấn Hoàng Hôn Sunset Town", "desc": "Đáp chuyến bay VJ-451 hạ cánh đảo ngọc. Nhận phòng resort 5 sao, chiều check-in Cầu Hôn Kiss Bridge và chiêm ngưỡng hoàng hôn rực rỡ nhất Việt Nam."},
        {"day": 2, "title": "Cano Cao Tốc 4 Đảo - Cáp Treo Vượt Biển Hòn Thơm", "desc": "Lên cano tham quan Hòn Mây Rút, Hòn Gầm Ghì lặn ngắm san hô tự nhiên, chụp ảnh flycam. Trải nghiệm cáp treo 3 dây vượt biển dài nhất thế giới về lại Nam Đảo."},
        {"day": 3, "title": "Grand World Thành Phố Không Ngủ - Hà Nội", "desc": "Khám phá sông Venice thu nhỏ, bảo tàng Gấu Teddy Bear. Thưởng thức bún quậy Kiến Xây nức tiếng trước khi xe đưa ra sân bay Phú Quốc về Nội Bài."}
    ]',
    4.95,
    1
),
(
    3,
    'Tour Nha Trang Biển Xanh - VinWonders & Vịnh San Hô', 
    'Việt Travel Group', 
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=400&fit=crop', 
    '4 Ngày 3 Đêm', 
    4250000, 
    'Hà Nội', 
    'Nha Trang', 
    '2026-11-25', 
    '09:30', 
    'sang',
    2, 
    'Boeing 787 Dreamliner', 
    '1h 50m', 
    'Khách sạn 4 sao mặt biển Trần Phú, Vé trọn gói VinWonders đảo Hòn Tre, Tắm bùn khoáng nóng',
    '[
        {"day": 1, "title": "Hà Nội - Cam Ranh - Nha Trang Phố Biển", "desc": "Bay máy bay thân rộng Boeing 787 tới sân bay Cam Ranh. Xe đưa dọc cung đường đèo biển tuyệt đẹp về khách sạn. Thưởng thức nem nướng Đặng Văn Quyên."},
        {"day": 2, "title": "Thiên Đường Giải Trí VinWonders Hòn Tre", "desc": "Trải nghiệm cáp treo vượt biển tới VinWonders, vui chơi công viên nước, vịnh phao nổi khổng lồ, bánh xe bầu trời và thưởng ngoạn show thực cảnh Tata Show."},
        {"day": 3, "title": "Du Ngoạn Vịnh Nha Trang - Lặn Ngắm Vịnh San Hô", "desc": "Tàu gỗ đưa quý khách ra Vịnh San Hô, Bãi Tranh tắm biển lặn ngắm san hô. Dùng tiệc BBQ hải sản tươi sống ngay trên bè nổi."},
        {"day": 4, "title": "Tháp Bà Ponagar - Tắm Bùn I-Resort - Hà Nội", "desc": "Chiêm ngưỡng kiến trúc Chăm Pa cổ kính tại Tháp Bà, ngâm bùn khoáng nóng thiên nhiên phục hồi năng lượng trước khi ra sân bay Cam Ranh về Hà Nội."}
    ]',
    4.85,
    1
),
(
    4,
    'Tour Khám Phá Xứ Chùa Vàng Bangkok - Pattaya', 
    'Vietjet Global Holidays', 
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', 
    '5 Ngày 4 Đêm', 
    6890000, 
    'TP. Hồ Chí Minh', 
    'Bangkok', 
    '2026-11-28', 
    '11:15', 
    'sang',
    1, 
    'Airbus A321neo', 
    '1h 35m', 
    'Bay thẳng Vietjet Air, Khách sạn 4 sao quốc tế, Buffet tòa nhà 86 tầng Baiyoke Sky, Du thuyền Chao Phraya',
    '[
        {"day": 1, "title": "TP.HCM - Bangkok Suvarnabhumi - Thành Phố Pattaya", "desc": "Chuyến bay thẳng VJ-803 hạ cánh sân bay Bangkok. Khởi hành về thành phố biển Pattaya, thưởng thức chương trình Alcazar Cabaret Show hoành tráng."},
        {"day": 2, "title": "Đảo San Hô Koh Larn - Trân Bảo Phật Sơn Khau Chee Chan", "desc": "Đi cano cao tốc tắm biển tại đảo San Hô, viếng tượng Phật Thích Ca dát vàng 9999 trên vách núi đá, dạo chợ nổi 4 miền Thái Lan."},
        {"day": 3, "title": "Pattaya - Bangkok - Tiệc Du Thuyền Sông Chao Phraya", "desc": "Trở về thủ đô Bangkok, ghé trung tâm nghiên cứu rắn hoàng gia, ăn tối du thuyền ngắm chùa Wat Arun lung linh trong đêm."},
        {"day": 4, "title": "Đại Trung Tâm IconSiam - Chùa Thuyền Wat Yannawa", "desc": "Chiêm bái chùa Thuyền xá lợi phật linh thiêng, mua sắm và thưởng thức ẩm thực đường phố tại trung tâm thương mại triệu đô IconSiam."},
        {"day": 5, "title": "Chùa Phật Vàng Wat Traimit - Big C - TP.HCM", "desc": "Chiêm ngưỡng tượng Phật bằng vàng ròng nặng 5.5 tấn, tự do mua sắm tại Big C Pratunam trước khi bay về Tân Sơn Nhất."}
    ]',
    4.9,
    1
),
(
    5,
    'Tour Đảo Quốc Sư Tử Singapore - Universal Studios Sentosa', 
    'ASEAN Discovery', 
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', 
    '4 Ngày 3 Đêm', 
    9990000, 
    'TP. Hồ Chí Minh', 
    'Singapore', 
    '2026-12-01', 
    '13:40', 
    'chieu',
    4, 
    'Boeing 777-300ER', 
    '2h 00m', 
    'Bay Singapore Airlines tiêu chuẩn 5 sao, Khách sạn trung tâm Orchard Road, Vé Universal Studios',
    '[
        {"day": 1, "title": "TP.HCM - Sân Bay Changi Jewel - Công Viên Sư Tử Biển Merlion", "desc": "Chuyến bay SQ-177 đưa quý khách tới sân bay Changi, chụp ảnh thác nước trong nhà Rain Vortex. Chiều check-in biểu tượng Merlion Park bên vịnh Marina."},
        {"day": 2, "title": "Kỳ Quan Gardens By The Bay - Đảo Sentosa", "desc": "Tham quan khu rừng siêu cây Supertree Grove, nhà kính Flower Dome. Di chuyển sang đảo Sentosa vui chơi và xem biểu diễn nhạc nước Wings of Time."},
        {"day": 3, "title": "Thế Giới Phim Trường Universal Studios Singapore", "desc": "Trọn ngày trải nghiệm các trò chơi cảm giác mạnh: Tàu lượn siêu tốc Battlestar Galactica, Xác ướp Ai Cập Revenge of the Mummy, Transformer 3D."},
        {"day": 4, "title": "Chùa Răng Phật Chinatown - Phố Haji Lane - TP.HCM", "desc": "Viếng chùa Răng Phật linh thiêng, chụp ảnh tranh tường nghệ thuật tại con phố cổ Haji Lane, mua quà Merlion trước khi bay về TP.HCM."}
    ]',
    4.92,
    1
),
(
    6,
    'Tour Cung Đường Vàng Nhật Bản: Tokyo - Núi Phú Sĩ - Cố Đô Kyoto', 
    'Sakura Travel Vietjet', 
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop', 
    '6 Ngày 5 Đêm', 
    26990000, 
    'Hà Nội', 
    'Tokyo', 
    '2026-12-05', 
    '00:30', 
    'sang_som',
    1, 
    'Airbus A330 Widebody', 
    '5h 15m', 
    'Bay tàu bay thân rộng Vietjet, Trải nghiệm tàu siêu tốc Shinkansen 300km/h, Tắm suối khoáng nóng Onsen Nhật Bản',
    '[
        {"day": 1, "title": "Hà Nội - Tokyo Narita - Khám Phá Trái Tim Tokyo", "desc": "Chuyến bay đêm thẳng tới Tokyo Narita. Thăm ngôi chùa cổ nhất thủ đô Asakusa Kannon, chụp ảnh tháp truyền hình Tokyo Skytree."},
        {"day": 2, "title": "Biểu Tượng Núi Phú Sĩ - Làng Cổ Bình Yên Oshino Hakkai", "desc": "Xe đưa đoàn lên trạm số 5 Núi Phú Sĩ chiêm ngưỡng tuyết trắng vĩnh cửu. Dạo bước làng cổ Oshino Hakkai, tối trải nghiệm tắm suối khoáng nóng Onsen truyền thống."},
        {"day": 3, "title": "Tàu Siêu Tốc Shinkansen - Cố Đô Kyoto Ngàn Năm", "desc": "Trải nghiệm cảm giác lướt đi trên con tàu viên đạn Shinkansen đến Kyoto. Chiêm ngưỡng Chùa Vàng Kinkaku-ji soi bóng lung linh trên mặt hồ."},
        {"day": 4, "title": "Rừng Trúc Arashiyama - Hàng Ngàn Cổng Đỏ Fushimi Inari", "desc": "Tản bộ giữa rừng trúc bạt ngàn Arashiyama, khoác trang phục Kimono chụp ảnh tại con đường vạn cổng Torii Fushimi Inari."},
        {"day": 5, "title": "Thành Phố Osaka - Lâu Đài Osaka - Mua Sắm Dotonbori", "desc": "Khám phá lâu đài cổ Osaka, thưởng thức bánh bạch tuộc Takoyaki và bò Kobe nướng tại khu phố mua sắm náo nhiệt Shinsaibashi."},
        {"day": 6, "title": "Sân Bay Quốc Tế Kansai - Hà Nội Nội Bài", "desc": "Đoàn ra sân bay Kansai đáp chuyến bay thẳng về Hà Nội, khép lại hành trình khám phá Xứ sở Hoa Anh Đào đầy cảm xúc."}
    ]',
    4.98,
    1
),
(
    7,
    'Tour Seoul - Đảo Nami - Công Viên Lotte World Hàn Quốc Mùa Lễ Hội', 
    'K-Tour Explorer', 
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&h=400&fit=crop', 
    '5 Ngày 4 Đêm', 
    14500000, 
    'TP. Hồ Chí Minh', 
    'Seoul', 
    '2026-12-10', 
    '02:20', 
    'sang_som',
    1, 
    'Airbus A321neo', 
    '5h 25m', 
    'Bay thẳng Vietjet Air, Khách sạn 4 sao Seoul, Vé trọn gói Lotte World, Mặc đồ Hanbok check-in hoàng cung',
    '[
        {"day": 1, "title": "TP.HCM - Incheon - Cung Điện Hoàng Gia Gyeongbokgung", "desc": "Đến Seoul buổi sáng tinh mơ, mặc trang phục cổ trang Hanbok dạo bước trong Cung Cảnh Phúc và Bảo tàng Dân gian Quốc gia Hàn Quốc."},
        {"day": 2, "title": "Đảo Nami Thơ Mộng - Phim Trường Bản Tình Ca Mùa Đông", "desc": "Tàu đưa sang đảo Nami lãng mạn dưới hai hàng cây ngân hạnh, thưởng thức món gà xào cay Chuncheon đặc sản trứ danh."},
        {"day": 3, "title": "Công Viên Trong Nhà Lotte World - Tháp N Seoul", "desc": "Vui chơi thả ga tại khu giải trí phức hợp Lotte World, lên đỉnh tháp truyền hình N Seoul gắn móc khóa tình yêu."},
        {"day": 4, "title": "Lớp Học Làm Kimchi - Thiên Đường Mỹ Phẩm Myeongdong", "desc": "Trải nghiệm văn hóa muối kim chi truyền thống, mua sắm mỹ phẩm cao cấp và sâm chính phủ tại phố đi bộ Myeongdong."},
        {"day": 5, "title": "Seoul Incheon - TP. Hồ Chí Minh Tân Sơn Nhất", "desc": "Tự do mua sắm đồ khô tại siêu thị Ponglim trước khi ra sân bay Incheon đáp chuyến bay về lại TP.HCM."}
    ]',
    4.88,
    1
),
(
    8,
    'Tour Thiên Đường Nhiệt Đới Bali - Cổng Trời Lempuyang Huyền Ảo', 
    'Paradise Holidays', 
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop', 
    '4 Ngày 3 Đêm', 
    8990000, 
    'TP. Hồ Chí Minh', 
    'Bali', 
    '2026-12-12', 
    '08:05', 
    'sang',
    1, 
    'Airbus A320', 
    '3h 50m', 
    'Bay thẳng Vietjet Air tới Bali, Resort 4 sao Ubud & Kuta, Xích đu mạo hiểm Bali Swing, Tiệc BBQ bãi biển',
    '[
        {"day": 1, "title": "TP.HCM - Đảo Bali Indonesia - Hoàng Hôn Vịnh Jimbaran", "desc": "Bay thẳng tới Denpasar Bali. Xe đưa về khách sạn nhận phòng, chiều thưởng thức bữa tối tiệc nướng hải sản ngắm hoàng hôn lãng mạn trên bãi biển Jimbaran."},
        {"day": 2, "title": "Cổng Trời Đền Lempuyang - Cung Điện Nước Tirta Gangga", "desc": "Chụp bức ảnh ngàn like phản chiếu mây trời tại Cổng Trời Lempuyang, tản bộ ngắm đàn cá Koi bơi lội trong hồ nước hoàng gia Tirta Gangga."},
        {"day": 3, "title": "Thác Nước Kanto Lampo - Bay Trên Xích Đu Bali Swing", "desc": "Check-in thác nước kỳ vĩ ẩn mình trong rừng nhiệt đới, trải nghiệm bay bổng trên chiếc xích đu Bali Swing giữa thung lũng lúa bậc thang Tegalalang."},
        {"day": 4, "title": "Chợ Nghệ Thuật Ubud - Sân Bay Bali Về Lại TP.HCM", "desc": "Mua sắm quà lưu niệm dệt thổ cẩm, đồ gỗ mỹ nghệ tinh xảo tại chợ Ubud, xe đưa ra sân bay Ngurah Rai làm thủ tục về TP.HCM."}
    ]',
    4.94,
    1
);

-- 3. CHÈN DỮ LIỆU CÁC CHUYẾN BAY MẪU NỘI ĐỊA VÀ QUỐC TẾ
INSERT INTO flights (flight_number, airline_id, origin_city, origin_code, destination_city, destination_code, departure_time, arrival_time, flight_date, duration, aircraft_type, flight_type, trip_type, departure_period, price_eco, price_business, services_eco, services_business) VALUES
(
    'VJ-128', 1, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '05:45', '07:55', '2026-11-15', '2h 10m', 'Airbus A321neo', 'bay_thang', 'khu_hoi', 'sang_som', 
    1250000, 3450000, 
    '7kg hành lý xách tay, Nước suối', 
    '14kg xách tay + 30kg ký gửi, Phòng chờ SkyBoss, Ưu tiên check-in, Suất ăn nóng đặc sắc'
),
(
    'VN-214', 2, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '08:30', '10:40', '2026-11-15', '2h 10m', 'Boeing 787-9', 'bay_thang', 'khu_hoi', 'sang', 
    1890000, 4800000, 
    '12kg hành lý xách tay, 23kg ký gửi, Nước uống', 
    '18kg xách tay + 32kg ký gửi, Phòng chờ Lotus Lounge, Suất ăn thượng hạng, Ghế ngả phẳng 180 độ'
),
(
    'QH-202', 3, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '11:15', '13:25', '2026-11-15', '2h 10m', 'Airbus A321', 'bay_thang', 'mot_chieu', 'sang', 
    1450000, 3900000, 
    '7kg xách tay, 20kg ký gửi, Bữa ăn nhẹ', 
    '14kg xách tay + 40kg ký gửi, Phòng chờ First Lounge, Suất ăn nóng, Ưu tiên soi chiếu an ninh'
),
(
    'VJ-166', 1, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '14:20', '16:30', '2026-11-15', '2h 10m', 'Airbus A320', 'bay_thang', 'mot_chieu', 'chieu', 
    990000, 3100000, 
    '7kg xách tay', 
    '14kg xách tay + 30kg ký gửi, Phòng chờ VIP, Chọn ghế trước miễn phí'
),
(
    'VJ-180', 1, 'TP. Hồ Chí Minh', 'SGN', 'Hà Nội', 'HAN', '19:40', '21:50', '2026-11-15', '2h 10m', 'Airbus A321neo', 'bay_thang', 'khu_hoi', 'toi', 
    1150000, 3200000, 
    '7kg xách tay, Nước suối', 
    '14kg xách tay + 30kg ký gửi, Phòng chờ VIP SkyBoss, Suất ăn nóng'
),
(
    'VJ-624', 1, 'TP. Hồ Chí Minh', 'SGN', 'Đà Nẵng', 'DAD', '07:00', '08:20', '2026-11-15', '1h 20m', 'Airbus A321', 'bay_thang', 'khu_hoi', 'sang', 
    850000, 2400000, 
    '7kg xách tay', 
    '14kg xách tay + 30kg ký gửi, Phòng chờ thương gia'
),
(
    'VN-112', 2, 'TP. Hồ Chí Minh', 'SGN', 'Đà Nẵng', 'DAD', '13:00', '14:20', '2026-11-15', '1h 20m', 'Airbus A350', 'bay_thang', 'mot_chieu', 'chieu', 
    1350000, 3200000, 
    '12kg xách tay, 23kg ký gửi', 
    '18kg xách tay + 32kg ký gửi, Phòng chờ Bông Sen, Suất ăn nhẹ'
),
(
    'VJ-322', 1, 'TP. Hồ Chí Minh', 'SGN', 'Phú Quốc', 'PQC', '09:15', '10:15', '2026-11-16', '1h 00m', 'Airbus A320', 'bay_thang', 'khu_hoi', 'sang', 
    790000, 2100000, 
    '7kg xách tay', 
    '14kg xách tay + 30kg ký gửi, Ưu tiên lên tàu bay'
),
(
    'VN-1822', 2, 'Hà Nội', 'HAN', 'Phú Quốc', 'PQC', '08:45', '10:55', '2026-11-16', '2h 10m', 'Boeing 787-9', 'bay_thang', 'khu_hoi', 'sang', 
    2150000, 5200000, 
    '12kg xách tay, 23kg ký gửi, Suất ăn trưa', 
    '18kg xách tay + 32kg ký gửi, Phòng chờ VIP, Rượu vang thượng hạng'
),
(
    'SQ-178', 4, 'TP. Hồ Chí Minh', 'SGN', 'Singapore', 'SIN', '12:15', '15:20', '2026-11-16', '2h 05m', 'Boeing 777-300ER', 'bay_thang', 'khu_hoi', 'chieu', 
    3200000, 8900000, 
    'Suất ăn nóng quốc tế, WiFi miễn phí, Màn hình giải trí KrisWorld', 
    'Phòng chờ SilverKris, Thực đơn do đầu bếp đạt sao Michelin thiết kế, Ghế giường nằm phẳng hoàn toàn'
),
(
    'VJ-803', 1, 'TP. Hồ Chí Minh', 'SGN', 'Bangkok', 'BKK', '11:15', '12:50', '2026-11-17', '1h 35m', 'Airbus A321neo', 'bay_thang', 'khu_hoi', 'sang', 
    1650000, 3950000, 
    '7kg xách tay, Nước suối', 
    '14kg xách tay + 30kg ký gửi, Phòng chờ SkyBoss, Suất ăn xôi xoài Thái Lan'
),
(
    'QR-971', 5, 'Hà Nội', 'HAN', 'Doha', 'DOH', '18:50', '23:15', '2026-11-17', '7h 25m', 'Airbus A350-1000', 'bay_thang', 'khu_hoi', 'toi', 
    12500000, 35000000, 
    'Suất ăn chuẩn 5 sao, Rượu vang tuyển chọn, Bộ tiện ích ngủ cao cấp', 
    'Khoang Qsuite có cửa đóng riêng tư, Giường đôi, Bữa ăn theo yêu cầu chuẩn 5 sao thế giới'
);
