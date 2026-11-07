# 🚀 ROADMAP & PROMPTS GUIDE CHO ANTIGRAVITY (VIBE CODING)

Tài liệu này cung cấp **kịch bản các câu lệnh Prompt từng bước** được thiết kế riêng để bạn ra lệnh cho Antigravity thực hiện xây dựng toàn bộ website Vietjet theo đúng kiến trúc và yêu cầu trong `PRD.md`, `DATABASE.md` và `ARCHITECTURE.md`.

---

## 📌 BƯỚC 1: KHỞI TẠO CẤU TRÚC, DATABASE SQLITE VÀ HỆ THỐNG GIAO DIỆN CHUNG

> **Copy prompt bên dưới và gửi cho Antigravity:**

```text
Hãy thực hiện BƯỚC 1 theo tài liệu PRD.md và DATABASE.md:
1. Tạo cấu trúc thư mục css/ và js/.
2. Tạo file js/db.js:
   - Sử dụng thư viện sql.js (SQLite WebAssembly) qua CDN.
   - Viết logic khởi tạo cơ sở dữ liệu SQLite trong trình duyệt (bảng airlines, flights, tours, cart, bookings).
   - Nạp sẵn toàn bộ dữ liệu mẫu (Seed Data) chuẩn từ DATABASE.md (5 hãng bay, 8 tour nổi bật kích thước ảnh 600x400 có lịch trình, các chuyến bay mẫu).
   - Có cơ chế lưu trữ (persistence) xuất db sang LocalStorage để khi load lại trang không bị mất dữ liệu.
3. Tạo file css/main.css và css/header-footer.css:
   - Màu chủ đạo là màu đỏ #ee1d23, màu phụ vàng #ffdd00, nền trắng #ffffff và xám nhẹ #f8f9fa.
   - Header có logo Vietjet (Images/VietJet-Air-logo.png), thanh điều hướng menu (Trang Chủ, Chuyến Bay, Tour Du Lịch, Giỏ Hàng kèm số lượng badge).
   - Footer hiện đại, chuyên nghiệp.
4. Tạo js/common.js để quản lý badge giỏ hàng trên header và các hàm tiện ích (format tiền VND, hiển thị toast thông báo).
```

---

## 📌 BƯỚC 2: XÂY DỰNG TRANG CHỦ (`index.html`)

> **Copy prompt bên dưới và gửi cho Antigravity:**

```text
Hãy thực hiện BƯỚC 2 theo PRD.md và ARCHITECTURE.md:
1. Xây dựng trang chủ index.html, css/home.css, js/home.js:
   - Hero banner với khẩu hiệu du lịch hấp dẫn và hình ảnh hàng không Vietjet.
   - Khung tìm kiếm chuyến bay (Booking Widget):
     + Chọn Khứ hồi hoặc Một chiều.
     + Điểm xuất phát (SGN, HAN, DAD, PQC,...), Điểm đến.
     + Ngày đi, Ngày về (disable nếu chọn một chiều), Số lượng hành khách.
     + Nút "Tìm Kiếm Chuyến Bay" -> chuyển hướng sang flights.html kèm tham số trên URL.
   - Phần Tour du lịch nổi bật:
     + Lưới 8 tour nổi bật (lấy từ bảng tours trong SQLite).
     + Thumbnail chuẩn 600x400 sắc nét, tên tour, hãng du lịch, số ngày/đêm, giá tiền VND.
     + Click vào tour dẫn sang trang tours.html hoặc tour-detail.html?id=...
   - Phần Đối tác Hãng hàng không:
     + Hiển thị logo các hãng hàng không: VietJet Air, Vietnam Airlines, Bamboo Airways, Singapore Airlines, Qatar Airways.
     + Click vào logo sẽ dẫn đến trang flights.html lọc riêng chuyến bay của hãng đó.
```

---

## 📌 BƯỚC 3: XÂY DỰNG TRANG CHUYẾN BAY & CHI TIẾT CHUYẾN BAY

> **Copy prompt bên dưới và gửi cho Antigravity:**

```text
Hãy thực hiện BƯỚC 3 theo PRD.md:
1. Xây dựng trang danh sách chuyến bay flights.html, css/flights.css, js/flights.js:
   - Bên trái (Sidebar Filters):
     + Sắp xếp giá vé tăng/giảm dần.
     + Lọc vé khứ hồi, vé một chiều.
     + Lọc bay thẳng, nhiều thành phố.
     + Lọc theo các hãng hàng không (checkbox).
     + Lọc theo thời gian cất cánh (Sáng sớm, Sáng, Chiều, Tối).
     + Lọc theo hạng dịch vụ (Phổ thông, Thương gia).
   - Bên phải:
     + Danh sách các chuyến bay truy vấn từ SQLite theo bộ lọc.
     + Hiển thị logo hãng bay, ngày cất cánh, giờ bay, thời gian bay, giá vé, dịch vụ đi kèm.
     + Nút "Chọn chuyến bay" -> chuyển hướng đến flight-detail.html?id=...
2. Xây dựng trang chi tiết chuyến bay flight-detail.html, js/flight-detail.js:
   - Hiển thị điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing 787, Airbus A321neo...).
   - Bảng so sánh và chọn giá vé: Hạng Phổ Thông (Eco) và Hạng Thương Gia (Business).
   - Nút "Chọn chuyến bay" -> lưu chuyến bay và hạng vé vào Giỏ Hàng (SQLite & LocalStorage), hiện Toast thành công và cho phép đi đến Giỏ Hàng.
```

---

## 📌 BƯỚC 4: XÂY DỰNG TRANG TOUR & CHI TIẾT TOUR DU LỊCH

> **Copy prompt bên dưới và gửi cho Antigravity:**

```text
Hãy thực hiện BƯỚC 4 theo PRD.md:
1. Xây dựng trang danh sách tour tours.html, css/tours.css, js/tours.js:
   - Bên trái (Sidebar Filters):
     + Lọc giá vé tăng/giảm dần.
     + Lọc theo các hãng hàng không hợp tác.
     + Lọc theo thời gian cất cánh / số ngày đi tour.
   - Bên phải:
     + Danh sách các tour du lịch, ảnh thumbnail 600x400, hãng bay, ngày cất cánh, thời gian bay, giá tiền, dịch vụ trọn gói.
     + Nút "Chi Tiết Tour" -> chuyển hướng sang tour-detail.html?id=...
2. Xây dựng trang chi tiết tour tour-detail.html, js/tour-detail.js:
   - Thông tin hành trình: Điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay.
   - Hiển thị Lịch trình chuyến đi (Day-by-Day Itinerary) dạng Timeline đẹp mắt (Ngày 1, Ngày 2, Ngày 3, Ngày 4...).
   - Nút "Đặt Tour Ngay" -> lưu tour vào Giỏ Hàng (SQLite & LocalStorage), hiện Toast thành công.
```

---

## 📌 BƯỚC 5: XÂY DỰNG TRANG GIỎ HÀNG, THANH TOÁN & GỬI EMAIL

> **Copy prompt bên dưới và gửi cho Antigravity:**

```text
Hãy thực hiện BƯỚC 5 theo PRD.md:
1. Xây dựng trang giỏ hàng cart.html, css/cart.css, js/cart.js:
   - Xem danh sách các chuyến bay và tour đã chọn từ database SQLite.
   - Nút Xóa từng mục và nút "Xóa Toàn Bộ Giỏ Hàng".
   - Bảng tính tiền chi tiết: Tạm tính, Thuế VAT, Giảm giá ưu đãi, Tổng thanh toán.
2. Form Nhập Thông Tin Khách Hàng:
   - Họ tên, Số điện thoại, Email nhận vé, Số CCCD/Hộ chiếu, Ghi chú.
   - Validate form không được để trống dữ liệu quan trọng.
3. Hành động "Đăng Ký / Xác Nhận Đặt Chỗ":
   - Lưu đơn đặt chỗ vào bảng bookings trong SQLite.
   - Hiển thị Modal Popup thông báo "Đặt Chỗ Hoàn Tất" kèm Mã đặt chỗ (Booking Code), thông tin người đặt và lời cảm ơn.
4. Cơ chế gửi Email xác nhận:
   - Xây dựng chức năng gửi/mô phỏng email chuyên nghiệp gửi từ nvthinh@gmail.com đến địa chỉ email khách hàng đã nhập.
   - Giao diện xem trước nội dung email (Preview Email Modal) với template thiết kế chuẩn hóa thương hiệu Vietjet (Màu đỏ #ee1d23), đầy đủ mã đặt chỗ, danh sách vé/tour và hướng dẫn khởi hành.
```

---

## 📌 BƯỚC 6: KIỂM TRA TOÀN DIỆN & TỐI ƯU GIAO DIỆN

> **Copy prompt bên dưới và gửi cho Antigravity:**

```text
Hãy kiểm tra và hoàn thiện toàn bộ dự án:
1. Kiểm tra tính liên kết giữa tất cả các trang (Trang chủ -> Chuyến bay -> Chi tiết chuyến bay -> Tour -> Chi tiết tour -> Giỏ hàng).
2. Kiểm tra bộ lọc filter hoạt động mượt mà trên flights.html và tours.html.
3. Đảm bảo giao diện chuẩn Responsive trên cả điện thoại (Mobile), máy tính bảng (Tablet) và máy tính (Desktop).
4. Đảm bảo tông màu đúng nhận diện: Nền trắng sáng, màu chủ đạo đỏ #ee1d23, điểm nhấn vàng tươi #ffdd00.
```
