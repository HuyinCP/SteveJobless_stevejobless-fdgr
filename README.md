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
  mạnh/yếu, thành tích và điểm thành thục theo từng chủ đề (tag Codeforces) — một ứng viên có thể
  mạnh nhiều chủ đề cùng lúc với mức điểm khác nhau.
- **Đề xuất đội hình**: liệt kê tối đa 5 tổ hợp 3 người hợp lệ, xếp hạng bằng mô hình **MDSB**
  (Minimize Distance to Bound point — tham khảo Ngo Tung Son et al., IMMS 2018): so điểm mỗi tổ hợp
  với một "điểm biên" lý tưởng tổng hợp từ những ứng viên giỏi nhất mỗi chủ đề, tổ hợp càng gần điểm
  biên càng được xếp hạng cao.
- **Báo cáo giải thích**: với mỗi phương án, hiển thị vai trò từng thành viên (Tư duy toán / Lập
  trình - cài đặt / cả hai), mẫu hình "đội mạnh" đạt được, chủ đề được phủ/còn thiếu, khoảng cách
  MDSB và chủ đề còn lệch nhiều nhất so với điểm biên lý tưởng.
- **Cập nhật động theo thời gian thực**: bật/tắt trạng thái "sẵn sàng" của ứng viên hoặc đổi ràng
  buộc ở Bước 1 khiến toàn bộ đề xuất được tính lại ngay; phương án đã chọn nếu không còn hợp lệ sẽ
  tự động bị bỏ chọn.
- **Xử lý ngoại lệ khi vô nghiệm**: khi không có tổ hợp nào thỏa điều kiện, hệ thống chỉ rõ đang
  thiếu năng lực/điều kiện gì — không tự sinh dữ liệu giả, không lặp lại thành viên, không treo,
  không màn hình trắng.
- **Cổng sinh viên (đăng nhập)**: mỗi ứng viên có một tài khoản riêng lưu trong database
  (PostgreSQL) — đăng nhập bằng cách chọn tên mình trong danh sách (dữ liệu mock, không cần mật
  khẩu), sau đó chỉ xem được hồ sơ của chính mình (read-only). Tách biệt hoàn toàn với luồng ghép
  đội chính ở trên để không ảnh hưởng tới phần đã được chấm theo core flow của đề.

## 3. Công nghệ và phụ thuộc

**Luồng ghép đội chính** (bắt buộc theo đề, giữ đơn giản có chủ đích):
- **Vite + React 19 + TypeScript** — ứng dụng single-page, chạy hoàn toàn phía client.
- **Tailwind CSS v4** (`@tailwindcss/vite`) — styling.
- **Không cần backend/database**: dữ liệu ứng viên là mock JSON (`source/src/data/candidates.ts`),
  trạng thái người dùng lưu qua `localStorage` của trình duyệt.
- Taxonomy chủ đề (`topicScores`) lấy theo tag chính thức của Codeforces (implementation, math,
  greedy, dp, data structures, graphs, geometry, games, ...).
- Thuật toán xếp hạng đội hình theo mô hình **MDSB** — Ngo Tung Son, Le Van Thanh, Tran Binh Duong,
  Bui Ngoc Anh, "A Decision Support Tool for Cross-Functional Team Selection: Case Study in
  ACM-ICPC Team Selection", IMMS 2018.

**Cổng sinh viên** (tính năng bổ sung, có database thật — tách riêng để không ảnh hưởng luồng chính):
- **PostgreSQL 16** chạy qua **Docker Compose** (`docker-compose.yml` ở repo root), seed sẵn 20
  ứng viên từ `source/backend/db/init.sql` (sinh tự động từ `candidates.ts` bằng
  `source/backend/scripts/gen-seed.cjs` — một nguồn dữ liệu duy nhất, không maintain hai bản).
- **Express + node-postgres (`pg`)** (`source/backend`) — REST API đọc/cập nhật dữ liệu ứng viên.
- Frontend gọi API qua `source/src/lib/api.ts` (biến môi trường `VITE_API_URL`).

Xem đầy đủ dependency tại `source/package.json` và `source/backend/package.json`.

## 4. Hướng dẫn cài đặt và chạy

Yêu cầu: Node.js ≥ 18, Docker + Docker Compose (chỉ cần nếu muốn dùng Cổng sinh viên).

### 4.1. Luồng ghép đội chính (không cần Docker)

```bash
cd source
npm install
npm run dev
```

Mở địa chỉ hiển thị trên terminal (mặc định `http://localhost:5173`). Đây là đủ để chạy toàn bộ
6 bước core flow của đề — Cổng sinh viên ở bước dưới là tính năng bổ sung, không bắt buộc.

Build production: `cd source && npm run build && npm run preview`.

### 4.2. Cổng sinh viên (cần Docker — thêm database + API)

```bash
# 1. Khởi động PostgreSQL (tự seed 20 ứng viên từ init.sql khi tạo lần đầu)
cp .env.example .env
docker compose up -d db

# 2. Chạy backend API (đọc dữ liệu từ Postgres)
cd source/backend
cp .env.example .env
npm install
npm run dev          # http://localhost:4000

# 3. Chạy frontend (một terminal khác), rồi vào tab "Cổng sinh viên"
cd source
cp .env.example .env
npm install
npm run dev           # http://localhost:5173
```

Nếu backend không chạy, tab "Ghép đội (Điều phối)" vẫn hoạt động bình thường — chỉ tab "Cổng sinh
viên" hiển thị thông báo lỗi kết nối rõ ràng (không crash, không màn hình trắng).

## 5. Cấu trúc thư mục

```
SteveJobless_stevejobless-fdgr/
├── README.md               <- tài liệu này
├── chatlog.md               <- lịch sử tương tác với AI trong thời gian thi
├── submission.json          <- khai báo cấu trúc cho hệ thống chấm
├── .gitignore
├── CLAUDE.md                 <- quy tắc/ràng buộc dự án dùng để điều hướng AI trong quá trình thi
├── docker-compose.yml         <- Postgres cho Cổng sinh viên (không bắt buộc cho luồng chính)
├── .env.example               <- mẫu biến môi trường cho docker-compose (không commit .env thật)
└── source/                   <- toàn bộ mã nguồn ứng dụng
    ├── package.json
    ├── .env.example           <- mẫu VITE_API_URL cho frontend
    ├── index.html
    ├── src/
    │   ├── App.tsx               <- orchestrator: 6 bước core flow + tab Cổng sinh viên
    │   ├── main.tsx
    │   ├── index.css
    │   ├── types/index.ts        <- model dữ liệu (Candidate, FormationConstraints, ...)
    │   ├── data/candidates.ts    <- 20 hồ sơ ứng viên mock (nguồn dữ liệu duy nhất)
    │   ├── lib/teamMatching.ts   <- lọc hợp lệ (4 điều kiện) + chẩn đoán vô nghiệm
    │   ├── lib/mdsb.ts           <- mô hình xếp hạng MDSB (bound point, distance)
    │   ├── lib/icpcRules.ts      <- hằng số luật ICPC cố định (team size, giới hạn Regional/WF)
    │   ├── lib/api.ts            <- API client cho Cổng sinh viên
    │   ├── hooks/useLocalStorage.ts
    │   └── components/           <- ConstraintsForm, CandidatePool, CandidateCard,
    │                                 SuggestionResults, SuggestionCard, DeficiencyPanel,
    │                                 StudentPortal (Cổng sinh viên)
    └── backend/                  <- API cho Cổng sinh viên (Express + PostgreSQL)
        ├── package.json
        ├── .env.example
        ├── src/index.js          <- REST API: /api/candidates, /health
        ├── src/db.js             <- kết nối Postgres (node-postgres)
        ├── db/init.sql           <- schema + seed 20 ứng viên (auto-run khi tạo container)
        └── scripts/gen-seed.cjs  <- sinh init.sql từ data/candidates.ts (1 nguồn dữ liệu duy nhất)
```

## 6. Thông tin đội thi

- **Tên đội**: SteveJobless
- **Nghiêm Quang Huy** — Kỹ sư Điều phối AI: thực hiện toàn bộ prompt, thay đổi repository, quản lý
  commit, `chatlog.md` và `README.md`.
- **Lê Quỳnh Anh** — Kỹ sư Trình bày: sản xuất video demo, trình bày sản phẩm và phân tích mã nguồn;
  không can thiệp repository, prompt hoặc commit.

Sản phẩm này được tạo và chỉnh sửa hoàn toàn thông qua AI theo đúng thể lệ SPD Challenge 2026.
