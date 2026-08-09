# ICPC Squad Finder

Prototype web nội bộ, dành riêng cho sinh viên **Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM**, hỗ
trợ tìm và ghép đội thi **ICPC** (mỗi đội đúng 3 người) dựa trên ràng buộc đa biến — xây dựng cho
**SPD Challenge 2026** (Software Production and Development Challenge 2026). Không phục vụ sinh
viên trường khác.

## 1. Bài toán giải quyết

Mùa thi ICPC vòng khu vực đang tới gần và một trong những khó khăn lớn nhất khi thành lập đội là
tìm đủ 3 người có năng lực bù trừ nhau (tư duy toán + khả năng cài đặt) mà vẫn thỏa các ràng buộc
hành chính (số lần đã tham dự Regional/World Finals). Việc ghép đội thủ công tốn thời
gian, dễ bỏ lọt ứng viên phù hợp và khó giải thích tại sao một tổ hợp lại "mạnh". ICPC Squad Finder
tự động hoá bước này: khai báo ràng buộc → hệ thống lọc và đề xuất tổ hợp đội hình hợp lệ kèm báo
cáo giải thích, người dùng vẫn là người quyết định chọn ai.

## 2. Tính năng chính

- **Khai báo mục tiêu & ràng buộc**: hiển thị các ràng buộc cố định theo luật ICPC Global (đúng 3
  thành viên/đội, tối đa 5 năm thi Regional, tối đa 2 lần World Finals — không thể chỉnh, vì đây là
  luật thi đấu thật) và cho phép điều chỉnh ngưỡng "mạnh" cho điểm toán/lập trình (tiêu chí riêng của
  dự án).
- **Khám phá kho ứng viên**: tối thiểu 20 hồ sơ mock, tìm kiếm theo tên/MSSV, xem chi tiết điểm
  mạnh/yếu, thành tích và các chủ đề (tag Codeforces) mỗi người mạnh — một ứng viên có thể mang
  nhiều chủ đề cùng lúc.
- **Đề xuất đội hình**: liệt kê tối đa 5 tổ hợp 3 người hợp lệ, xếp hạng theo điểm tổng hợp (điểm
  toán/lập trình trung bình + độ phủ chủ đề).
- **Báo cáo giải thích**: với mỗi phương án, hiển thị vai trò từng thành viên (Tư duy toán / Lập
  trình - cài đặt / cả hai), mẫu hình "đội mạnh" đạt được, chủ đề được phủ/còn thiếu, và lý do đội
  hình được xem là tối ưu.
- **Cập nhật động theo thời gian thực**: bật/tắt trạng thái "sẵn sàng" của ứng viên hoặc đổi ràng
  buộc ở Bước 1 khiến toàn bộ đề xuất được tính lại ngay; phương án đã chọn nếu không còn hợp lệ sẽ
  tự động bị bỏ chọn.
- **Xử lý ngoại lệ khi vô nghiệm**: khi không có tổ hợp nào thỏa điều kiện, hệ thống chỉ rõ đang
  thiếu năng lực/điều kiện gì — không tự sinh dữ liệu giả, không lặp lại thành viên, không treo,
  không màn hình trắng.

## 3. Công nghệ và phụ thuộc

- **Vite + React 19 + TypeScript** — ứng dụng single-page, chạy hoàn toàn phía client.
- **Tailwind CSS v4** (`@tailwindcss/vite`) — styling.
- **Không cần backend/database**: dữ liệu ứng viên là mock JSON (`source/src/data/candidates.ts`),
  trạng thái người dùng lưu qua `localStorage` của trình duyệt.
- Taxonomy chủ đề (`topicTags`) lấy theo tag chính thức của Codeforces (implementation, math,
  greedy, dp, data structures, graphs, geometry, games, ...).
- Xem đầy đủ dependency tại `source/package.json`.

## 4. Hướng dẫn cài đặt và chạy

Yêu cầu: Node.js ≥ 18.

```bash
cd source
npm install
npm run dev
```

Mở địa chỉ hiển thị trên terminal (mặc định `http://localhost:5173`).

Build production:

```bash
cd source
npm run build
npm run preview
```

## 5. Cấu trúc thư mục

```
SteveJobless_stevejobless-fdgr/
├── README.md               <- tài liệu này
├── chatlog.md               <- lịch sử tương tác với AI trong thời gian thi
├── submission.json          <- khai báo cấu trúc cho hệ thống chấm
├── .gitignore
├── CLAUDE.md                 <- quy tắc/ràng buộc dự án dùng để điều hướng AI trong quá trình thi
└── source/                   <- toàn bộ mã nguồn ứng dụng
    ├── package.json
    ├── index.html
    └── src/
        ├── App.tsx               <- orchestrator: 6 bước core flow của đề bài
        ├── main.tsx
        ├── index.css
        ├── types/index.ts        <- model dữ liệu (Candidate, FormationConstraints, ...)
        ├── data/candidates.ts    <- 20 hồ sơ ứng viên mock
        ├── lib/teamMatching.ts   <- thuật toán ghép đội + chẩn đoán vô nghiệm
        ├── lib/icpcRules.ts      <- hằng số luật ICPC cố định (team size, giới hạn Regional/WF)
        ├── hooks/useLocalStorage.ts
        └── components/           <- ConstraintsForm, CandidatePool, CandidateCard,
                                      SuggestionResults, SuggestionCard, DeficiencyPanel
```

## 6. Thông tin đội thi

- **Tên đội**: SteveJobless
- **Nghiêm Quang Huy** — Kỹ sư Điều phối AI: thực hiện toàn bộ prompt, thay đổi repository, quản lý
  commit, `chatlog.md` và `README.md`.
- **Lê Quỳnh Anh** — Kỹ sư Trình bày: sản xuất video demo, trình bày sản phẩm và phân tích mã nguồn;
  không can thiệp repository, prompt hoặc commit.

Sản phẩm này được tạo và chỉnh sửa hoàn toàn thông qua AI theo đúng thể lệ SPD Challenge 2026.
