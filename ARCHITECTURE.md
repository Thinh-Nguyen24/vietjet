# 🏛️ PROJECT ARCHITECTURE & DESIGN SYSTEM

## 1. CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT DIRECTORY TREE)

```text
Vietjet/
│
├── index.html               # Trang chủ: Search Box, 8 Tour nổi bật, Logo Hãng bay
├── flights.html             # Trang danh sách Chuyến bay (Bộ lọc bên trái, List bên phải)
├── flight-detail.html       # Chi tiết Chuyến bay: Loại máy bay, chọn vé Phổ thông / Thương gia
├── tours.html               # Trang danh sách Tour du lịch (Bộ lọc bên trái, List bên phải)
├── tour-detail.html         # Chi tiết Tour: Thông tin bay, Lịch trình Timeline chi tiết
├── cart.html                # Trang Giỏ hàng & Form đặt vé, xác nhận gửi email
│
├── css/
│   ├── main.css             # Biến CSS, Reset, Typography, Button, Badge dùng chung
│   ├── header-footer.css    # Header navigation, Sticky bar, Footer
│   ├── home.css             # Style riêng cho trang chủ (Search box, Hero, Featured tours)
│   ├── flights.css          # Style layout 2 cột, Filter sidebar, Flight ticket card
│   ├── tours.css            # Style danh sách Tour & Tour Detail (Timeline lịch trình)
│   └── cart.css             # Style giỏ hàng, bảng tính tiền, checkout form, modal popup
│
├── js/
│   ├── db.js                # Module quản trị SQLite (khởi tạo sql.js, seed data, query, export)
│   ├── common.js            # Cập nhật số lượng giỏ hàng trên header, format tiền VND, toast thông báo
│   ├── home.js              # Xử lý tìm kiếm trang chủ, render 8 tour nổi bật, click logo hãng bay
│   ├── flights.js           # Bộ lọc filter đa điều kiện, render danh sách vé máy bay
│   ├── flight-detail.js     # Đọc param URL, hiển thị chi tiết, chọn hạng vé, thêm vào giỏ
│   ├── tours.js             # Bộ lọc tour, render danh sách tour
│   ├── tour-detail.js       # Hiển thị chi tiết tour, render timeline lịch trình ngày, thêm vào giỏ
│   └── cart.js              # Render giỏ hàng, xóa item, form xác nhận, modal & gửi email
│
├── Images/                  # Thư mục hình ảnh
│   ├── VietJet-Air-logo.png # Logo Vietjet Air
│   ├── Vietjet-Air.jpg      # Ảnh máy bay Vietjet
│   ├── R.png                # Hình ảnh đồ họa bổ trợ
│   └── ...                  # Ảnh tour, icon minh họa
│
├── PRD.md                   # Đặc tả yêu cầu sản phẩm
├── DATABASE.md              # Thiết kế Database SQLite & Data mẫu
├── ARCHITECTURE.md          # Thiết kế Kiến trúc & UI/UX Design System
└── ROADMAP_PROMPTS.md       # Lộ trình Prompt điều khiển Antigravity code từng bước
```

---

## 2. DESIGN SYSTEM & QUY CHUẨN GIAO DIỆN

### 2.1. Bảng Màu Thương Hiệu (Color Palette)
- **Primary Brand Color:** `--primary-color: #ee1d23;` (Đỏ đặc trưng Vietjet)
- **Primary Dark (Hover):** `--primary-dark: #c41318;`
- **Primary Light (Tints):** `--primary-light: #fff0f1;`
- **Secondary Accent:** `--accent-color: #ffdd00;` (Vàng tươi rực rỡ)
- **Background Light:** `--bg-body: #ffffff;` (Nền trắng tinh tế)
- **Background Soft:** `--bg-soft: #f8f9fa;` (Nền xám nhạt chia khối)
- **Text Primary:** `--text-main: #1f2937;` (Màu chữ đen xám dịu mắt)
- **Text Secondary:** `--text-sub: #6b7280;` (Màu ghi chú)
- **Border Color:** `--border-color: #e5e7eb;`
- **Success Color:** `--success-color: #10b981;`

### 2.2. Typography & Fonts
- **Font-family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`
- Sử dụng Google Fonts `Inter` hoặc `Be Vietnam Pro` để hỗ trợ hiển thị tiếng Việt hoàn hảo.

### 2.3. Quy Chuẩn Responsive Breakpoints
- **Desktop lớn:** `>= 1200px` (Container max-width: 1200px)
- **Laptop / Tablet ngang:** `992px - 1199px`
- **Tablet đứng:** `768px - 991px` (Layout 2 cột chuyển thành 1 cột hoặc sidebar dạng Drawer)
- **Mobile:** `< 768px` (Tối ưu vuốt chạm ngón tay, kích thước nút tối thiểu 44px)

---

## 3. CƠ CHẾ ĐIỀU HƯỚNG & TRUYỀN DỮ LIỆU GIỮA CÁC TRANG

1. **Từ Trang Chủ sang Trang Chuyến Bay:**
   - Link: `flights.html?from=SGN&to=HAN&date=2026-11-15&trip=khu_hoi`
   - Khi click logo Vietjet: `flights.html?airline=VietJet%20Air`
2. **Từ Danh Sách sang Trang Chi Tiết Chuyến Bay:**
   - Link: `flight-detail.html?id=1`
   - Trang chi tiết đọc ID từ `window.location.search`, truy vấn SQLite:
     ```sql
     SELECT f.*, a.name as airline_name, a.logo as airline_logo 
     FROM flights f JOIN airlines a ON f.airline_id = a.id 
     WHERE f.id = 1;
     ```
3. **Từ Trang Chủ / Danh Sách sang Chi Tiết Tour:**
   - Link: `tour-detail.html?id=1`
   - Trang tour detail phân giải `itinerary_json` thành dạng Timeline các ngày trực quan.
4. **Cơ chế Giỏ Hàng & Email Thông Báo:**
   - Khi bấm "Chọn chuyến bay" hoặc "Đặt tour", item được lưu vào `localStorage.getItem('vietjet_cart')` và đồng bộ vào bảng SQLite `cart`.
   - Cập nhật số lượng Badge icon Giỏ hàng trên Header theo thời gian thực.
   - Tại trang `cart.html`, sau khi khách hàng điền Form và ấn "Đăng ký":
     - Hệ thống sinh mã đặt chỗ: `VJ-BOOKING-XXXXX`.
     - Hiện Modal chúc mừng đặt vé thành công.
     - Kích hoạt trình giả lập/gửi email thông báo từ `nvthinh@gmail.com` kèm đầy đủ hóa đơn xác nhận.
