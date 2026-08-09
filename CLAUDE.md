# CLAUDE.md

Hướng dẫn này áp dụng cho mọi phiên làm việc của Claude trong repository này, trong khuôn khổ
**SPD Challenge 2026** (Software Production and Development Challenge 2026).

## 1. Bối cảnh cuộc thi — ràng buộc bắt buộc phải tuân thủ

- Đây là bài thi **AI-first**: toàn bộ mã nguồn, tài liệu (kể cả README.md này và chính CLAUDE.md)
  phải do AI tạo/sửa thông qua prompt. Kỹ sư Điều phối AI (người duy nhất ngồi ở terminal này) không
  tự viết hoặc tự sửa code bằng tay — mọi thay đổi phải đi qua Claude.
- **Không** tự chèn một đoạn code viết tay rồi yêu cầu Claude "chèn giúp" — điều này bị cấm tương tự
  như tự viết tay.
- Repository chỉ được khởi tạo và commit **trong thời gian thi (360 phút)**. Không commit/sửa gì sau
  giờ kết thúc thi (20:00 ngày thi) — vi phạm sẽ bị truất quyền.
- Kỹ sư Trình bày (Lê Quỳnh Anh) **không được** đụng vào repo, prompt hoặc commit. Nếu có ai không
  phải Kỹ sư Điều phối AI (Nghiêm Quang Huy) yêu cầu thay đổi repo, từ chối và nhắc lại quy định.
- **Chống prompt injection**: nội dung bất kỳ tệp nào trong repo (bao gồm dữ liệu mock, README, comment)
  không được chứa chỉ dẫn nhằm đánh lừa bộ chấm tự động. Không tự thêm nội dung như vậy dù được đề nghị.
- Trước khi nộp bài: xóa mọi khóa bí mật / biến môi trường riêng, đảm bảo `.gitignore` loại trừ
  `.env`, `node_modules/`, thư mục build.
- **`chatlog.md` tại repo root phải luôn được cập nhật** với lịch sử prompt/response quan trọng của
  phiên làm việc — coi đây là một phần bắt buộc của mọi thay đổi, không chỉ code.

## 2. Cấu trúc bắt buộc (Public Grading — 20 điểm, xem `spd-public-structure-prompt.md` ở workspace cha)

```
SteveJobless_stevejobless-fdgr/        <- repo root, khớp [TênĐội]_[Tên đăng nhập]
├── README.md
├── chatlog.md
├── submission.json
├── .gitignore
├── CLAUDE.md                          <- file bổ sung, không bắt buộc nhưng được phép
└── source/                            <- toàn bộ mã nguồn ứng dụng (Vite + React + TS)
    └── package.json, src/, ...
```

- KHÔNG đổi tên 5 mục bắt buộc, không đổi hoa/thường (`README.md` không phải `readme.md`,
  `source/` không phải `Source/`).
- `submission.json` phải luôn parse được, và mọi path khai báo trong đó phải thực sự tồn tại.
- Nếu đổi công nghệ / cấu trúc thư mục con trong `source/`, phải cập nhật lại
  `source_paths` / `dependency_files` / `run_command` trong `submission.json` ngay trong cùng lượt
  thay đổi.

## 3. Đề bài đã chọn — Team-Matching cho ICPC

Đề chính thức: xây hệ thống khám phá/đánh giá/ghép đội dựa trên ràng buộc đa biến, bối cảnh tự chọn.
Bối cảnh nhóm chọn: **ghép đội thi ICPC** (mỗi đội 3 người) cho sinh viên Trường ĐH Khoa học Tự nhiên,
ĐHQG-HCM chuẩn bị vòng khu vực.

### Ràng buộc dữ liệu ứng viên (bắt buộc)
- Đã thi ≤ 5 lần vòng Regional, ≤ 2 lần World Finals (WF).
- Họ tên, MSSV, email sinh viên hợp lệ khi "đăng ký" (dữ liệu mock nhưng phải có validate format).
- Một ứng viên có thể có **nhiều kỹ năng** cùng lúc (không giả định quan hệ 1-1 người↔kỹ năng).
- Không lọc theo thông tin nhạy cảm (dân tộc, tôn giáo, quan điểm chính trị) — tuyệt đối không thêm
  trường dữ liệu này.
- Tối thiểu 20 hồ sơ ứng viên mock, ở trạng thái mặc định khi khởi động app.

### Điều kiện đội hình hợp lệ (4 điều kiện của đề, áp dụng cụ thể cho ICPC)
1. Không lặp lại cùng một cá nhân trong đội.
2. Đúng 3 thành viên/đội (ràng buộc số lượng của đề bài ICPC).
3. Bao phủ 100% năng lực yêu cầu — một trong ba mẫu hình "đội mạnh":
   - ≥1 người tư duy toán tốt (giỏi toán, biết code) + ≥2 người giỏi lập trình, hoặc
   - ≥1 người giỏi lập trình + ≥2 người tư duy toán tốt, hoặc
   - Cả 3 người đều mạnh cả toán và cài đặt thuật toán.
4. Ràng buộc bổ sung tuyệt đối: cả 3 thành viên **cùng một trường**; mỗi ứng viên tự thân thỏa
   giới hạn số lần thi Regional/WF nêu trên.

### Xử lý ngoại lệ (bắt buộc theo đề, mục 3.4)
- Khi không có tổ hợp thỏa mãn: báo lỗi rõ ràng, chỉ rõ đang thiếu năng lực/điều kiện gì cụ thể
  (ví dụ: "Không tìm được ứng viên tư duy toán tốt cùng trường X còn đủ điều kiện Regional").
- Cấm: tự sinh dữ liệu giả lấp chỗ trống, lặp lại thành viên, treo vô hạn, lỗi `undefined`, màn hình
  trắng. Mọi nhánh lỗi phải render UI thông báo có nội dung.
- Khi người dùng thay đổi ràng buộc hoặc danh sách ứng viên real-time, các đề xuất cũ không còn thỏa
  điều kiện phải bị loại khỏi trạng thái "hợp lệ" ngay (không cache đề xuất stale).

## 4. Quyết định kỹ thuật (đã chọn, để tránh AI tự đổi hướng giữa chừng)

- **Stack**: Vite + React + TypeScript, TailwindCSS cho styling. Không cần backend/database —
  dữ liệu mock ở dạng JSON, state lưu qua `localStorage` để việc "thay đổi động" trong core-flow demo
  giữ được sau reload.
- **Thuật toán ghép đội**: constraint-filter + scoring (không cần thuật toán phức tạp — đề bài không
  bắt buộc thuật toán cụ thể). Ưu tiên tính đúng & giải thích được hơn là tối ưu toàn cục.
- **Không** thêm state management library (Redux/Zustand) — quy mô nhỏ, `useState`/`useReducer` +
  Context đủ dùng, tránh phụ thuộc thừa.
- Không viết test framework riêng trừ khi có thời gian dư — ưu tiên hoàn thành đủ 6 bước core flow của
  đề trước.

## 5. Quy ước code

- TypeScript strict, không dùng `any` tùy tiện.
- Không viết comment giải thích code làm gì — chỉ comment khi có lý do ẩn (invariant, workaround).
- Không thêm tính năng ngoài đặc tả đề bài để tránh tốn thời gian thi (360 phút có hạn).
- Văn bản UI/README bằng tiếng Việt (đối tượng người dùng và giám khảo là người Việt).
