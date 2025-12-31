# tienganh-fe - Frontend Application

Frontend React application cho hệ thống học tiếng Anh.

## 📋 Lưu ý quan trọng

**Ứng dụng này chỉ là Frontend (React)**, không chạy backend server. Tất cả dữ liệu được lấy từ backend API tại `tienganh-be`.

## 🚀 Cài đặt và chạy

```bash
npm install
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🔗 Kết nối Backend

Frontend tự động kết nối với backend API:
- **Development**: `http://localhost:5000/api` (khi chạy tienganh-be local)
- **Production**: `https://tienganh-k1k0.onrender.com/api`

Có thể cấu hình URL backend qua biến môi trường `REACT_APP_API_URL`.

## 📦 Dependencies

- React 18.2.0
- Axios (để gọi API backend)
- Lucide React (icons)

## ⚙️ Cấu hình

File `package.json` có cấu hình `proxy` để hỗ trợ development, nhưng **không phải là backend server**. Đây chỉ là proxy của React dev server để chuyển tiếp requests đến backend API.
