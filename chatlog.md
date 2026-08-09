# Chatlog — SPD Challenge 2026 — Đội SteveJobless

Lịch sử tương tác với AI (Claude, chạy trong Claude Code) trong thời gian thi. Ghi theo thứ tự
thời gian, do Kỹ sư Điều phối AI (Nghiêm Quang Huy) trực tiếp thao tác và cập nhật liên tục trong
suốt buổi thi. Các đoạn dài được rút gọn phần lặp lại (ví dụ toàn văn thể lệ đã dán ở lượt đầu) nhưng
giữ nguyên nội dung yêu cầu và quyết định thực tế đã thực hiện.

---

## Lượt 1 — User

Dán toàn văn thể lệ cuộc thi "Software Production and Development Challenge 2026", đề bài chính
thức PDF (`SPD-Challenge-2026-Official-Problem.pdf`), public prompt chấm cấu trúc
(`spd-public-structure-prompt.md`), ý tưởng dự án nhóm (`description.txt` — hệ thống ghép đội thi
ICPC), kèm thông tin:

> mail của tôi là huy211020055@gmail.com
> tên tôi là Nghiêm Quang Huy
> user name: stevejobless-fdgr
> tên đội là: SteveJobless
> bạn setup giúp các file rules như claude.md vân vân. đây là đề bài ... và đây là dự định mà nhóm
> ... và đây là dự án mà nhóm định làm, bạn hãy adapt thêm @description.txt

## Lượt 2 — Claude

Đọc đầy đủ 3 tệp đính kèm (PDF đề bài, public structure prompt, description.txt). Đề bài chính thức:
xây hệ thống Team-Matching dựa trên ràng buộc đa biến, bối cảnh tự chọn. Nhận thấy điểm mấu chốt:
theo Mục 5 thể lệ, chỉ được bắt đầu tương tác AI và khởi tạo repository **từ khi giờ thi chính thức
bắt đầu**. Dừng lại hỏi xác nhận trạng thái giờ thi trước khi tạo bất kỳ file thật nào.

## Lượt 3 — User (trả lời AskUserQuestion)

> "Đã bắt đầu, đang trong giờ thi"

## Lượt 4 — Claude

Xác nhận có thể tiến hành. Đặt kế hoạch: tạo repo root `SteveJobless_stevejobless-fdgr/` (sửa lại
không dùng dấu `[]` như thư mục workspace hiện tại, vì mẫu `[TênĐội]_[Tên đăng nhập]` trong thể lệ
chỉ là ký hiệu placeholder). Hỏi thêm 2 thông tin còn thiếu để hoàn thiện README/sản phẩm: tên thành
viên thứ hai (Kỹ sư Trình bày) và tên sản phẩm.

## Lượt 5 — User (trả lời AskUserQuestion)

> Tên thành viên 2: "Lê Quỳnh Anh"
> Tên sản phẩm: "ICPC Squad Finder"

## Lượt 6 — Claude

Kiểm tra môi trường (`node -v`, `npm -v`, `git --version`), tạo thư mục repo root, viết
`CLAUDE.md` (quy tắc thi + quyết định kỹ thuật), `.gitignore`, `submission.json`. Bắt đầu scaffold
`source/` bằng `npm create vite@latest source -- --template react-ts`, cài `tailwindcss` +
`@tailwindcss/vite`.

Thiết kế model dữ liệu ban đầu cho `Candidate` dựa trên `description.txt`: hai trục điểm
`mathScore`/`codingScore` và 3 mẫu hình "đội mạnh" (≥1 toán + ≥2 lập trình / ≥1 lập trình + ≥2 toán /
cả 3 đều mạnh cả hai), cùng một trường `skills: string[]` tự đặt tên.

## Lượt 7 — User

> "theo bạn 1 team icpc mạnh nên là như thế nào, tại nó heuristic quá tôi không đoán được, ví dụ
> hình học, game, bạn brainstorming thêm được không"

Từ chối tool call viết `types/index.ts` với field `skills: string[]` tự đặt tên, yêu cầu brainstorm
thêm vì 2 trục toán/lập trình quá thô, không phản ánh việc ICPC cần phủ nhiều chuyên đề (hình học,
game theory...).

## Lượt 8 — Claude

Đề xuất: giữ nguyên rule cứng pass/fail theo 3 mẫu hình toán/lập trình đã có trong `description.txt`
(để không phá vỡ điều kiện 3 của đề — cần đơn giản, giải thích được, dễ demo "vô nghiệm"), nhưng
thêm một tập **tag chuyên môn** cho mỗi ứng viên, dùng độ phủ tag làm điểm xếp hạng phụ + nội dung
giải thích, không dùng làm điều kiện hợp lệ cứng. Hỏi người dùng có đồng ý hướng này không.

## Lượt 9 — User

> "theo hướng của bạn cho là đúng đi"

## Lượt 10 — Claude

Viết lại `types/index.ts` với `topicTags: TopicTag[]` — nhưng tự đặt ra danh sách tag
(`Graph, DP, Geometry, Number Theory, Game Theory, Data Structures, Strings, Greedy/Ad-hoc`).

## Lượt 11 — User

> "tags bạn có thể lên codeforces để lấy tags về được không"

Từ chối tool call vì tag đang là tự bịa, yêu cầu lấy taxonomy thật từ Codeforces.

## Lượt 12 — Claude

Dùng `WebFetch` tới `codeforces.com/problemset` (bị chặn, HTTP 403), sau đó dùng `WebSearch` với
truy vấn "Codeforces problem tags full list implementation math greedy dp graphs data structures".
Lấy được danh sách tag chính thức: implementation, math, greedy, dp, data structures, brute force,
constructive algorithms, graphs, sortings, binary search, dfs and similar, trees, strings, number
theory, combinatorics, geometry, bitmasks, two pointers, dsu, shortest paths, games, ... Chọn 14 tag
phổ biến nhất theo phân bố thực tế (implementation, math, greedy, dp, data structures, brute force,
constructive algorithms, graphs, binary search, strings, number theory, geometry, games, two
pointers) làm `TopicTag` cho ứng dụng, ghi rõ nguồn trong comment code.

Viết lại `source/src/types/index.ts` với taxonomy tag thật từ Codeforces, sau đó tạo:

- `source/src/data/candidates.ts` — 20 hồ sơ ứng viên mock (17 HCMUS + 3 Bách Khoa, có xen hồ sơ
  vượt giới hạn Regional/WF để demo tính năng lọc động).
- `source/src/lib/teamMatching.ts` — thuật toán tổ hợp (combinations) + kiểm tra 4 điều kiện đội hợp
  lệ theo đề bài + chẩn đoán lý do vô nghiệm theo từng trường.
- `source/src/hooks/useLocalStorage.ts`.
- Các component: `ConstraintsForm`, `CandidatePool`, `CandidateCard`, `SuggestionCard`,
  `SuggestionResults`, `DeficiencyPanel`.
- Viết lại `App.tsx` thành orchestrator theo đúng 6 bước Core Flow của đề bài (khai báo ràng buộc →
  khám phá ứng viên → kích hoạt đề xuất → báo cáo giải thích → điều chỉnh biến số động → xử lý
  ngoại lệ vô nghiệm), xoá boilerplate mặc định của Vite (`App.css`, `assets/react.svg`,
  `assets/vite.svg`, `assets/hero.png`, `public/icons.svg`), sửa `index.html` title.

Chạy `npx tsc -b --noEmit` (không lỗi) và `npm run build` (build thành công, `dist/` sinh ra bình
thường). Khởi động `npm run dev` tạm thời trên cổng 5183, `curl` kiểm tra HTML trả về đúng title và
`main.tsx` được serve đúng, sau đó tắt server. *Giới hạn: môi trường không có công cụ trình duyệt/
chụp ảnh màn hình để xác nhận UI hiển thị bằng mắt — chỉ xác nhận được build/dev server không lỗi.*

Viết `README.md` đầy đủ 7 mục bắt buộc theo `spd-public-structure-prompt.md`.

## Lượt 13 — Claude (tiếp)

Khởi tạo `chatlog.md` (tệp này). Sau đó: `git init`, add toàn bộ file (trừ những gì bị `.gitignore`
loại), commit đầu tiên.

---

> **Lưu ý cho người nộp bài**: nếu công cụ AI đang dùng hỗ trợ export session link công khai
> (ví dụ Claude, ChatGPT, Gemini chia sẻ session), hãy dán thêm link đó vào ô "Chatlog / AI sessions"
> khi nộp theo đúng `SUBMISSION PROTOCOL`, mỗi link một dòng theo thứ tự thời gian, bổ sung cho file
> này. Trước khi nộp, rà lại toàn bộ log này để đảm bảo khớp timestamp commit và không sót lượt
> prompt/response nào diễn ra sau lượt cuối được ghi ở đây.
