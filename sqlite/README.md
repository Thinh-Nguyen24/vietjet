# 🗄️ THƯ MỤC CƠ SỞ DỮ LIỆU SQLITE - DỰ ÁN VIETJET

Thư mục này chứa toàn bộ các tập lệnh SQL dùng để tạo cấu trúc và nạp dữ liệu cho cơ sở dữ liệu SQLite của website Vietjet.

---

## 📂 DANH SÁCH CÁC FILE

1. **[`schema.sql`](file:///c:/Users/Admin/Desktop/Learn%20AI/Vibe%20coding/Bu%E1%BB%95i%203/Vietjet/sqlite/schema.sql)**:
   - Chứa các câu lệnh DDL (`CREATE TABLE`, `CREATE INDEX`).
   - Định nghĩa 5 bảng:
     - `airlines`: Thông tin hãng hàng không, mã code, logo, mô tả.
     - `flights`: Danh sách chuyến bay, giờ cất cánh, giá vé Phổ thông / Thương gia, dịch vụ.
     - `tours`: Danh sách 8 tour du lịch nổi bật, thumbnail 600x400, lịch trình JSON.
     - `cart`: Quản lý các chuyến bay & tour trong giỏ hàng.
     - `bookings`: Đơn đặt chỗ của khách hàng, lưu email gửi từ `nvthinh@gmail.com`.

2. **[`seed_data.sql`](file:///c:/Users/Admin/Desktop/Learn%20AI/Vibe%20coding/Bu%E1%BB%95i%203/Vietjet/sqlite/seed_data.sql)**:
   - Chứa toàn bộ dữ liệu mẫu (DML `INSERT`):
     - 5 Hãng hàng không (VietJet Air, Vietnam Airlines, Bamboo Airways, Singapore Airlines, Qatar Airways).
     - 8 Tour du lịch trọn gói (Đà Nẵng, Phú Quốc, Nha Trang, Thái Lan, Singapore, Nhật Bản, Hàn Quốc, Bali) kèm lịch trình chi tiết từng ngày dạng JSON.
     - 12 Chuyến bay nội địa và quốc tế đa dạng khung giờ (sáng sớm, sáng, chiều, tối).

3. **[`init.sql`](file:///c:/Users/Admin/Desktop/Learn%20AI/Vibe%20coding/Bu%E1%BB%95i%203/Vietjet/sqlite/init.sql)**:
   - File gộp duy nhất của `schema.sql` và `seed_data.sql`.
   - Dùng để chạy trực tiếp một lần vào công cụ SQLite (như *DB Browser for SQLite*, *DBeaver*, hoặc nạp tự động qua WebAssembly trong `js/db.js`).

---

## 💻 CÁCH SỬ DỤNG
- **Dùng với công cụ SQLite bên ngoài:** Mở *DB Browser for SQLite* -> Chọn *Execute SQL* -> Mở file `init.sql` và ấn nút Run.
- **Dùng trong website (WebAssembly):** Module `js/db.js` sẽ tự động đọc cấu trúc và dữ liệu từ các file này để khởi tạo SQLite in-memory ngay trên trình duyệt mà không cần cài đặt thêm bất kỳ phần mềm backend nào.
