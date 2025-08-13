# English Learner - MVP Sàn Giáo Dục Tiếng Anh

[Link Demo](https://english-learner-8j293c9vc-giabaoanhs-projects.vercel.app/)

---

## Mô tả dự án

English Learner là một MVP web app dành cho người học tiếng Anh, được xây dựng dựa trên nền tảng cộng đồng (UGC) với các tính năng:

- Đăng ký, đăng nhập người dùng. Hỗ trợ thay đổi profile, lưu avatar qua cloudinary
- Hỗ trợ học idiom tiếng Anh thông qua các idiom mà người dùng hoặc cộng đồng tạo
- Người dùng có thể đóng góp và tương tác nội dung để cùng phát triển cộng đồng học tập
- Tích hợp AI hỗ trợ tạo idiom dựa trên tên idiom
- Giao diện responsive, thân thiện với người dùng

Mục tiêu là xây dựng một nền tảng học tập vừa mang tính cá nhân hóa, vừa phát triển theo cộng đồng, hỗ trợ đa dạng nhóm đối tượng: học viên, giáo viên, admin.

---

## Công nghệ sử dụng

- Frontend: ReactJS (TypeScript)
- Backend: Node.js + Express (TypeScript)
- Database: MongoDB (Mongoose)
- Xác thực: JWT
- AI Integration: OpenAI API (DeepSeek)
- Triển khai: Vercel, Render

---

## Tính năng chính

- Đăng ký / đăng nhập bằng email và mật khẩu (username không được chứa ký tự đặc biệt)
- Tạo, sửa, xóa bài học, idiom liên quan tiếng Anh
- Bình luận, tương tác trên các idiom
- AI hỗ trợ tạo idiom dựa trên tên idiom người dùng muốn học
- Responsive UI thân thiện trên cả desktop và mobile

---

## Hướng dẫn cài đặt

### Yêu cầu

- Node.js >= 16.x
- MongoDB (có thể dùng Mongo Atlas hoặc local)

### Cài đặt backend

```bash
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env với các biến môi trường (MongoDB URI, JWT secret, API keys nếu có)
npm run dev
```

### Cài đặt frontend

```bash
cd client
npm install
cp .env.example .env
# Chỉnh sửa .env nếu cần (ví dụ API endpoint)
npm run dev
```

Ứng dụng frontend mặc định chạy trên `http://localhost:3000`, backend trên `http://localhost:5000`.

---

## Cách sử dụng

1. Truy cập trang đăng ký để tạo tài khoản mới (lưu ý username không được chứa ký tự đặc biệt)
2. Đăng nhập với tài khoản đã tạo
3. Truy cập trang chính để tạo idiom, đặt câu hỏi, bình luận
4. Sử dụng AI hỗ trợ tạo idiom trong personal page chọn create idiom trong dấu 3 chấm
5. Tương tác và phát triển cộng đồng bằng cách đóng góp nội dung

---

## Demo trực tuyến

Bạn có thể trải nghiệm phiên bản live tại:

[https://english-learner-8j293c9vc-giabaoanhs-projects.vercel.app/](https://english-learner-8j293c9vc-giabaoanhs-projects.vercel.app/)

---

## Cấu trúc thư mục (Backend)

/routes - định nghĩa API routes
/controllers - xử lý logic các route
/services - các service nghiệp vụ
/models - định nghĩa schema MongoDB
/middleware - middleware xác thực JWT, xử lý lỗi, etc
/types - interface
/utils - hàm tiện ích

---

## Cấu trúc thư mục (Frontend)

/src
/components - các component UI
/features - các slice của pages
/pages - các trang (login, register, home, feature...)
/api - gọi API
/hooks - custom hooks
/utils - hàm tiện ích
/types - interface

---

## Phát triển thêm

- Tích hợp AI tạo bài tập, sửa lỗi trực tiếp khi nhập
- Cho phép upload file audio, hình ảnh minh họa bài học qua Cloudinary
- Mở rộng tính năng nhóm học, chat cộng đồng
- Tích hợp push notification, reminder học tập
- Phân quyền chi tiết hơn cho giáo viên và admin

---

## Liên hệ

Nếu cần hỗ trợ hoặc muốn trao đổi về dự án, vui lòng liên hệ:  
**Gia Bao Anh**  
Email: [giabaoanh3003@gmail.com]
