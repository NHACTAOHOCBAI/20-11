# Vòng quay may mắn 20/10

Web React + Vite mobile-first gồm form thông tin, vòng quay 6 giải và popup kết quả. Dữ liệu lượt quay được tạo khi người chơi bắt đầu, sau đó cập nhật giải khi animation kết thúc.

## Chạy local

```bash
npm install
cp .env.example .env
npm run dev
```

Điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` vào `.env`. Không đưa service-role key vào frontend.

## Thiết lập Supabase

1. Tạo project trên Supabase.
2. Mở SQL Editor, chạy nội dung tại `supabase/migrations/20261016_create_spin_entries.sql`.
3. Sao chép Project URL và anon/public key vào `.env` (và biến môi trường của Vercel).

RLS không cấp quyền đọc bảng `spin_entries`; người dùng ẩn danh chỉ có thể insert/update. Tuy nhiên, vì người chơi không đăng nhập và kết quả được chọn trong browser, đây chỉ là mô hình dành cho demo/campaign đơn giản: không thể ngăn triệt để request giả mạo hoặc sửa một ID đã biết. Với chiến dịch có tiền thưởng thật, hãy chuyển chọn giải và ghi kết quả vào Edge Function có rate-limit/CAPTCHA hoặc dùng xác thực người dùng.

## Cấu hình giải

Sửa `src/config.ts` để thay đổi tên, giá trị, màu và `weight` của sáu giải. `weight` quyết định xác suất tương đối.

## Deploy Vercel

Import repository vào Vercel, chọn preset **Vite**, rồi khai báo `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` cho Production/Preview. `vercel.json` đã thêm SPA rewrite để truy cập trực tiếp `/wheel` không bị 404.

```bash
npm run build
```
