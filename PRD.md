# ✈️ PRODUCT REQUIREMENTS DOCUMENT (PRD) - VIETJET TRAVEL WEBSITE

## 1. TỔNG QUAN DỰ ÁN
- **Tên dự án:** Website Du Lịch & Đặt Vé Vietjet
- **Mục tiêu:** Xây dựng website du lịch trọn gói phục vụ tìm kiếm chuyến bay, tour du lịch, đặt vé và quản lý giỏ hàng trực quan.
- **Công nghệ cốt lõi:** HTML5, CSS3, JavaScript thuần (Vanilla JS), không dùng backend framework.
- **Cơ sở dữ liệu:** SQLite chạy trực tiếp trên trình duyệt bằng thư viện WebAssembly (`sql.js`), đồng bộ bộ nhớ cache (IndexedDB / LocalStorage).
- **Bộ nhận diện thương hiệu:**
  - **Màu chủ đạo (Primary Red):** `#ee1d23` (Đỏ Vietjet đặc trưng).
  - **Màu phụ (Secondary Yellow):** `#ffdd00` (Vàng tươi điểm nhấn).
  - **Màu nền (Background):** Trắng sáng (`#ffffff`) và xám sáng mềm (`#f8f9fa`).
  - **Màu chữ:** Đen xám hiện đại (`#1a1a1a`, `#4a4a4a`, `#717171`).
  - **Phong cách thiết kế:** Hiện đại, tối giản, thanh lịch, chuẩn Responsive (Desktop, Tablet, Mobile).

---

## 2. KIẾN TRÚC CÁC TRANG & TÍNH NĂNG CHI TIẾT

### 2.1. Trang Chủ (`index.html`)
1. **Header & Navigation:**
   - Logo Vietjet (sử dụng file ảnh trong thư mục `Images/`).
   - Menu: Trang Chủ, Chuyến Bay, Tour Du Lịch, Giỏ Hàng (kèm badge đếm số lượng), Liên Hệ.
2. **Hero Banner & Bộ Công Cụ Tìm Chuyến Bay (Booking Widget):**
   - Lựa chọn loại vé: **Khứ hồi** hoặc **Một chiều** (Radio / Pill button).
   - Điểm xuất phát (Dropdown chọn sân bay: SGN, HAN, DAD, PQC, CXR,...).
   - Điểm đến (Dropdown chọn sân bay đến).
   - Ngày khởi hành (Date picker) & Ngày về (Disable nếu chọn "Một chiều").
   - Số lượng hành khách (Người lớn, trẻ em).
   - **Nút "Tìm Kiếm Chuyến Bay":** Khi bấm, chuyển hướng sang `flights.html` kèm tham số tìm kiếm trên URL (hoặc lưu vào Session Storage).
3. **Mục Tour Du Lịch Nổi Bật (8 Tour đặc sắc):**
   - Hiển thị lưới (Grid) 8 tour du lịch chất lượng cao:
     - Hình ảnh thumbnail chuẩn tỉ lệ **600x400**.
     - Tên tour & hãng du lịch tổ chức.
     - Thời lượng (Ví dụ: `4 Ngày 3 Đêm`, `5 Ngày 4 Đêm`).
     - Giá tour (Định dạng VND, ví dụ: `5.990.000 ₫`).
     - Đánh giá sao & nhãn "Hot Deal".
   - Bấm vào tour chuyển hướng sang `tours.html` hoặc `tour-detail.html?id=...`.
4. **Mục Hãng Hàng Không Đối Tác:**
   - Dải logo đối tác nổi tiếng: **Vietjet Air**, **Vietnam Airlines**, **Bamboo Airways**, **Singapore Airlines**, **Qatar Airways**,...
   - Khi người dùng click vào logo một hãng hàng không, hệ thống tự động lọc và chuyển thẳng sang trang `flights.html?airline=VietJet%20Air`.
5. **Footer:**
   - Thông tin liên hệ, cam kết dịch vụ, hỗ trợ khách hàng, các liên kết nhanh và form đăng ký nhận ưu đãi.

---

### 2.2. Trang Chuyến Bay (`flights.html`)
- **Bố cục 2 cột chuyên nghiệp:**
  - **Cột Trái (Sidebar Filters):**
    - Sắp xếp giá: Tăng dần / Giảm dần.
    - Loại hành trình: Vé khứ hồi / Vé một chiều.
    - Kiểu chuyến bay: Bay thẳng / Nhiều thành phố (Quá cảnh).
    - Hãng hàng không: Checkbox chọn (Vietjet Air, Vietnam Airlines, Singapore Airlines,...).
    - Giờ cất cánh: Khoảng thời gian (Sáng sớm: 00:00 - 06:00, Sáng: 06:00 - 12:00, Chiều: 12:00 - 18:00, Tối: 18:00 - 24:00).
    - Hạng dịch vụ: Phổ thông (Eco), Thương gia (SkyBoss / Business).
    - Nút reset bộ lọc.
  - **Cột Phải (Danh Sách Vé Chuyến Bay):**
    - Thẻ chuyến bay (Flight Card) hiển thị:
      - Logo & Tên hãng hàng không.
      - Giờ khởi hành - Giờ hạ cánh, thời gian bay dự kiến.
      - Sân bay đi -> Sân bay đến (Mã IATA: SGN -> HAN).
      - Tiện ích/Dịch vụ bao gồm (Hành lý 7kg xách tay, suất ăn, wifi...).
      - Giá vé tốt nhất (VND).
      - Nút **"Chọn Chuyến Bay"** dẫn đến `flight-detail.html?id=...`.

---

### 2.3. Trang Chi Tiết Chuyến Bay (`flight-detail.html`)
1. **Thông tin tổng quan hành trình:**
   - Điểm đi, điểm đến, ngày bay, tổng thời gian bay.
   - Hãng bay, số hiệu chuyến bay (VJ-128, VN-214,...).
   - Loại máy bay thực tế (Airbus A321neo, Boeing 787 Dreamliner, Airbus A350,...).
2. **Khu vực lựa chọn Hạng Vé (Ticket Classes):**
   - **Hạng Phổ Thông (Eco):**
     - Giá vé tiêu chuẩn.
     - 7kg hành lý xách tay.
     - Thay đổi ngày giờ có thu phí.
   - **Hạng Thương Gia (SkyBoss / Business Class):**
     - Giá vé cao cấp.
     - 10-14kg hành lý xách tay + 30kg ký gửi.
     - Phòng chờ sang trọng, ưu tiên check-in, suất ăn nóng miễn phí.
3. **Nút "Chọn & Thêm Vào Giỏ Hàng":**
   - Bấm vào sẽ lưu chuyến bay cùng hạng vé đã chọn vào giỏ hàng (`LocalStorage` / bảng `cart` trong SQLite).
   - Hiển thị Toast thông báo thành công và dẫn người dùng đến trang Giỏ Hàng.

---

### 2.4. Trang Danh Sách Tour (`tours.html`)
- **Cột Trái (Sidebar Filter):**
  - Lọc theo khoảng giá (Thanh trượt hoặc sắp xếp Tăng/Giảm dần).
  - Lọc theo Hãng hàng không kết hợp trong tour.
  - Lọc theo thời gian cất cánh hoặc số ngày tour (2N1Đ, 3N2Đ, 4N3Đ,...).
- **Cột Phải (Danh Sách Tour):**
  - Card Tour hiển thị: Ảnh 600x400 sắc nét, tên tour, hành trình điểm đến, hãng bay vận chuyển, ngày khởi hành, giá vé, dịch vụ trọn gói (khách sạn 4-5 sao, xe đưa đón, hướng dẫn viên).
  - Nút **"Xem Chi Tiết Tour"** chuyển sang `tour-detail.html?id=...`.

---

### 2.5. Trang Chi Tiết Tour (`tour-detail.html`)
1. **Thông tin đầu trang:**
   - Tên tour, hãng bay phối hợp, loại máy bay di chuyển, thời gian bay.
   - Điểm xuất phát và điểm tham quan chính.
   - Thư viện hình ảnh tour.
2. **Lịch trình chuyến đi (Day-by-Day Itinerary):**
   - Thiết kế dạng Timeline rõ ràng từng ngày:
     - **Ngày 1:** Đón khách tại sân bay, bay đến điểm đến, nhận phòng, ăn tối.
     - **Ngày 2:** Tham quan các địa danh nổi tiếng, trải nghiệm văn hóa.
     - **Ngày 3:** Hoạt động giải trí, mua sắm đặc sản.
     - **Ngày 4:** Tự do trải nghiệm, trả phòng, bay về lại.
3. **Dịch vụ bao gồm & không bao gồm:**
   - Vé máy bay khứ hồi, khách sạn, vé tham quan, bảo hiểm du lịch.
4. **Nút "Đặt Tour Ngay / Thêm Vào Giỏ Hàng":**
   - Lưu thông tin tour vào giỏ hàng và mở thông báo điều hướng đến trang Giỏ Hàng.

---

### 2.6. Trang Giỏ Hàng & Đặt Chỗ (`cart.html`)
1. **Danh sách Dịch vụ Đã Chọn:**
   - Liệt kê các Chuyến bay và Tour trong giỏ hàng.
   - Thông tin: Tên dịch vụ, hạng vé/ngày đi, số lượng, đơn giá, thành tiền.
   - Thao tác: Nút Xóa từng mục và nút "Xóa Toàn Bộ Giỏ Hàng".
   - Tổng thanh toán rõ ràng (Tạm tính, Thuế VAT, Giảm giá, Tổng cộng).
2. **Form Nhập Thông Tin Cá Nhân:**
   - Họ và tên hành khách / người đại diện.
   - Số điện thoại liên hệ.
   - Địa chỉ Email nhận thông tin xác nhận.
   - Số CCCD / Hộ chiếu.
   - Ghi chú đặc biệt (nếu có).
3. **Hành động Đăng Ký / Xác Nhận:**
   - Bấm nút **"Xác Nhận Đặt Chỗ & Thanh Toán"**.
   - Lưu thông tin đơn đặt vào bảng `bookings` trong cơ sở dữ liệu SQLite.
   - Hiển thị Modal/Popup thông báo đặt vé thành công chuyên nghiệp (Mã đơn hàng, tổng tiền, lời cảm ơn).
4. **Cơ chế gửi Email xác nhận:**
   - Mô phỏng/Gửi thực tế email xác nhận từ địa chỉ đại diện: `nvthinh@gmail.com` gửi đến email của khách hàng.
   - Nội dung email hiển thị mã đặt vé (Booking PNR), chi tiết chuyến bay/tour, tổng tiền và hướng dẫn thanh toán.
   - Tích hợp qua EmailJS (nếu có API Key) hoặc hệ thống preview/notification mail template trực quan ngay trên trang web.
