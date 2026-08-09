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
loại), commit đầu tiên (`58b2b98`).

## Lượt 14 — User

> "bạn đã dựng git chưa và là link nào ?"

## Lượt 15 — Claude

Kiểm tra `git remote -v` và `gh auth status` — xác nhận repo mới chỉ có local commit, chưa có
remote/GitHub link, `gh` CLI chưa cài trên máy.

## Lượt 16 — User

> "tên đội tôi là SteveJobless và tên đăng nhập là stevejobless-fdgr bạn coi lại thử đặt đúng tên
> chưa https://github.com/HuyinCP/SteveJobless_stevejobless-fdgr.git"

## Lượt 17 — Claude

Đối chiếu lại: tên thư mục repo root, `submission.json` (`team_name`, `login`) đều đã khớp
`SteveJobless` / `stevejobless-fdgr`. Thêm remote `origin` từ URL do user cung cấp, hỏi xác nhận
trước khi push (hành động công khai). User xác nhận ("Pại, push ngay") → `git push -u origin
master` thành công.

## Lượt 18 — User

> "tổng kết lại bạn hoàn thành dự án tới đâu rồi, có thể chỉ tôi cách chạy để xem không"

## Lượt 19 — Claude

Tổng kết tiến độ, nêu rõ phần chưa làm (đăng ký tài khoản theo `description.txt` gốc — bị bỏ vì đề
chính thức không yêu cầu) và giới hạn (chưa tự mắt kiểm tra UI). Dùng skill `run`: không có project
skill / `chromium-cli` sẵn có trên máy Windows này, nên khởi động `npm run dev` (cổng 5173) và mở
trực tiếp bằng trình duyệt thật của người dùng qua `Start-Process` (PowerShell) thay vì headless
screenshot, vì đây là máy desktop thật có GUI, không phải container cold-start.

## Lượt 20 — User

Chọn dòng `chatlog.md` trong IDE (không phải yêu cầu cụ thể), rồi:

> "tôi muốn xác nhận lại scope của dự án, hiện tại chúng ta chỉ đang dev internal project cho
> trường đại học khoa học tự nhiên, các trường khác không liên quan, giảm scope xuống"

## Lượt 21 — Claude

Giảm scope theo yêu cầu: bỏ hoàn toàn khái niệm đa trường vì dự án chỉ phục vụ nội bộ sinh viên
Trường ĐH Khoa học Tự nhiên. Thay đổi cụ thể:

- `types/index.ts`: bỏ `Candidate.school`, `FormationConstraints.requireSameSchool`/`requiredSchool`,
  `TeamSuggestion.school`, `DeficiencyReason.school`.
- `data/candidates.ts`: bỏ field `school` và 2 hằng `SCHOOL_HCMUS`/`SCHOOL_HCMUT`; chuẩn hoá 3 hồ sơ
  từng gán "Bách Khoa" (c16-c18) thành MSSV/email theo định dạng HCMUS cho đồng nhất.
- `lib/teamMatching.ts`: bỏ `groupBySchool`/nhánh `requiredSchool`/`requireSameSchool`, đơn giản hoá
  `generateTeamSuggestions` để chạy trực tiếp trên toàn bộ ứng viên hợp lệ (không group theo trường);
  `diagnose` không còn nhận `school`.
- Components: bỏ prop `schools` và UI liên quan ở `ConstraintsForm` (2 field "cùng trường"),
  `CandidatePool` (dropdown lọc trường), `CandidateCard` (hiển thị trường); đơn giản hoá
  `DeficiencyPanel` (chỉ còn 1 khối lỗi vô nghiệm, bỏ nhánh "một số trường không tạo được đội").
- `App.tsx`: bỏ `useMemo` tính `schools`, bỏ truyền prop `schools`, sửa câu mô tả trong header (bỏ
  "ràng buộc cùng trường").
- `CLAUDE.md`/`README.md`: cập nhật mô tả scope, bỏ mọi nhắc tới ràng buộc/tính năng liên trường.

Chạy lại `npx tsc -b --noEmit` và `npm run build` — cả hai đều pass sau khi sửa các lỗi do xoá field
(`members` không dùng trong `buildExplanation`, thiếu argument ở lời gọi).

Hỏi xác nhận trước khi commit/push (hành động công khai). User xác nhận → `git add -A`, commit
`1fcf9f4` ("Giam scope: bo rang buoc/khai niem da truong"), push lên `origin/master`.

## Lượt 22 — User

> "phần Khai báo mục tiêu & ràng buộc chưa hợp lý lắm
> thứ nhất là: bản chất 1 đội là 3 người, sao lại cho user chọn số lượng người trong một đội ?
> thứ hai là: số lần thi Regional và WF nữa, những phần nảy phải là cố định mà, trong quy định icpc
> global, bạn lên xem thử."

## Lượt 23 — Claude

Đồng ý về nguyên tắc trước khi sửa, tra cứu luật ICPC Global bằng `WebSearch` + `WebFetch` (đọc PDF
"ICPC Regional Rules for Regionals 2024" tải về qua WebFetch, dùng Read tool đọc trực tiếp nội dung
PDF). Xác nhận từ văn bản gốc, mục "Team Composition" và "Limits on Participation":
- "Each team consists of three contestants" → team size cố định = 3.
- "A student who has competed in qualifying regional contests during five different contest years is
  NOT eligible to compete" → tối đa 5 năm thi Regional, cố định.
- "A student who has competed in two ICPC World Finals is NOT eligible to compete in ICPC Regionals"
  → tối đa 2 lần World Finals, cố định.
- (Ngoài ra văn bản còn xác nhận "All team members must be enrolled in the same degree-granting
  institution" — khớp với quyết định giảm scope một-trường ở Lượt 21, không cần khôi phục field
  `school`.)

Thực hiện thay đổi:
- Tạo `source/src/lib/icpcRules.ts` — hằng số `ICPC_TEAM_SIZE=3`, `ICPC_MAX_REGIONAL_YEARS=5`,
  `ICPC_MAX_WORLD_FINALS=2`, kèm trích dẫn nguồn.
- `types/index.ts`: `FormationConstraints` rút gọn chỉ còn `strongThreshold` (tham số dự án thật sự
  có thể chỉnh) — bỏ `teamSize`, `maxRegional`, `maxWF` khỏi state người dùng chỉnh được.
- `lib/teamMatching.ts`: dùng hằng số `icpcRules.ts` cố định cho việc lọc điều kiện hợp lệ và sinh
  tổ hợp, không còn đọc từ `constraints`.
- `components/ConstraintsForm.tsx`: viết lại — hiển thị 3 ràng buộc ICPC dưới dạng badge chỉ đọc
  (không phải input), chỉ giữ lại slider `strongThreshold` là điều chỉnh được.
- `components/CandidateCard.tsx`: dùng hằng số `ICPC_MAX_REGIONAL_YEARS`/`ICPC_MAX_WORLD_FINALS`
  thay số cứng 5/2.
- `App.tsx`: bỏ preset "Siết Regional ≤ 1, WF = 0" (không còn hợp lệ vì không thể chỉnh luật ICPC),
  thay bằng preset "Hạ ngưỡng mạnh xuống 5/10".
- `CLAUDE.md`/`README.md`: thêm mục trích dẫn luật ICPC cố định, phân biệt rõ với `strongThreshold`
  là tiêu chí riêng của dự án.

Chạy lại `npx tsc -b --noEmit` và `npm run build` — pass.

## Lượt 24 — User (chèn giữa lượt đang xử lý, qua system-reminder)

> "theo tôi nghĩ phần achievements nên chia nhỏ ra nữa cụ thể hóa ra, lúc cấp 3 ở việt nam thì có
> giải quốc gia VOI, VMO,... giải quốc tế IMO, IOI, giải tỉnh (năm nào ?) cần cụ thể hóa ra, rồi lúc
> lên đại học thi icpc rank mấy rồi huy chương gì, rồi olp tin học sinh viên, olp toán học sinh viên,
> giải siêu cúp sinh viên, bạn lên hệ thống olp tin học việt nam hay icpc để xem kỹ hơn
> https://www.olp.vn/ cụ thể hóa ra năm đó là năm nào"

## Lượt 25 — Claude

Tra cứu `olp.vn` bằng `WebFetch`/`WebSearch` để lấy đúng tên/cơ cấu giải Olympic Tin học Sinh viên
Việt Nam: xác nhận có khối cá nhân "A (Siêu Cúp), B (Chuyên), C (Không chuyên)" và Siêu Cúp
2025 do đội HCMUS vô địch (nguồn: hcmus.edu.vn). Từ đó:

- `types/index.ts`: thêm `AchievementLevel` và interface `Achievement { competition, level, year,
  result }`; đổi `Candidate.achievements` từ `string[]` sang `Achievement[]`.
- `data/candidates.ts`: viết lại toàn bộ trường `achievements` của 20 ứng viên thành các mục cụ thể
  theo hệ thống thi thật — VOI/VMO (HSG Quốc gia Tin học/Toán), IOI/IMO (Olympic quốc tế), Olympic
  Tin học Sinh viên Việt Nam (khối Siêu Cúp/Chuyên), Olympic Toán học Sinh viên Việt Nam, ICPC
  Regional/Vietnam Nationals/World Finals — mỗi mục có năm và kết quả cụ thể (dữ liệu mock nhưng
  theo khung thật, không phải người thật). Thêm ghi chú nguồn ở đầu file.
- `components/CandidateCard.tsx`: thêm danh sách hiển thị achievements (tên giải, cấp độ, năm, kết
  quả) — trước đó field này tồn tại trong data nhưng không hiển thị ở UI.

Chạy lại `npx tsc -b --noEmit` và `npm run build` — pass.

## Lượt 26 — User

> "bạn có thể nào đọc paper này @IMMS_2018_paper_21.pdf để hiểu thêm"

Đính kèm paper: Ngo Tung Son, Le Van Thanh, Tran Binh Duong, Bui Ngoc Anh, "A Decision Support Tool
for Cross-Functional Team Selection: Case Study in ACM-ICPC Team Selection", IMMS 2018.

## Lượt 27 — Claude

Đọc toàn bộ paper (dùng Read tool đọc trực tiếp PDF). Tóm tắt mô hình **MDSB** (Minimize Distance to
Bound point): với h thành viên và m tag kỹ năng (paper dùng đúng 35 tag Codeforces), tính bound
point E (mỗi tọa độ E_j = tổng điểm h ứng viên giỏi nhất tag j trong cả pool — tính độc lập theo
từng tag) và achieved point O của một tổ hợp cụ thể (tổng điểm từng tag của các thành viên); chọn
tổ hợp có khoảng cách Euclid ||E-O|| nhỏ nhất — gộp đồng thời 2 mục tiêu "wide" (phủ nhiều tag) và
"deep" (điểm cao mỗi tag) mà không cần tự chọn trọng số như weighted-sum thông thường. Paper giải
bằng Genetic Algorithm.

Chỉ ra điểm liên quan tới code hiện tại: hàm chấm điểm cũ trong `teamMatching.ts`
(`avgMath + avgCoding + coveredTopics.length * 0.3`) là weighted-sum tự đặt trọng số — đúng loại
hạn chế mà paper chỉ ra. Nêu rào cản: MDSB cần điểm số liên tục theo từng tag (`R_i,j`), còn dữ liệu
hiện tại chỉ có `topicTags: string[]` (có/không). Hỏi người dùng có muốn áp dụng MDSB không.

## Lượt 28 — User

> "áp dụng MDSB vào đi"

## Lượt 29 — Claude

Áp dụng MDSB làm cơ chế xếp hạng chính (thay hoàn toàn công thức cộng điểm cũ), giữ nguyên lớp lọc
cứng 4 điều kiện hợp lệ của đề (không đổi — MDSB chỉ xếp hạng trong số các tổ hợp đã hợp lệ):

- Tạo `source/src/lib/mdsb.ts`: `computeBoundPoint(pool, teamSize)`, `computeAchievedPoint(members)`,
  `mdsbDistance(E, O)` — trích dẫn nguồn paper ngay trong comment đầu file.
- `types/index.ts`: đổi `Candidate.topicTags: TopicTag[]` (có/không) sang
  `topicScores: Partial<Record<TopicTag, number>>` (điểm 1-10 mỗi tag, dùng làm `R_i,j`); đổi
  `TeamSuggestion.score` thành `mdsbDistance` (càng thấp càng tốt, thay vì càng cao càng tốt).
- `data/candidates.ts`: gán điểm cụ thể cho từng tag của 20 ứng viên (suy từ `mathScore`/`codingScore`
  và tập tag đã có sẵn), thêm vài "brute force" để không có tag nào tuyệt đối vô nghĩa trong bound
  point.
- `lib/teamMatching.ts`: tính `boundPoint` một lần trên toàn bộ pool hợp lệ (không phải mỗi combo),
  dùng cho mọi tổ hợp; `topicCoverage` đổi sang kiểm tra `topicScores[tag] > 0`; sắp xếp kết quả
  tăng dần theo `mdsbDistance` (trước đó giảm dần theo `score`); `buildExplanation` thêm dòng nêu rõ
  giá trị distance và (tối đa 3) tag còn lệch nhiều nhất so với điểm biên E.
- `components/CandidateCard.tsx`: hiển thị điểm số kèm mỗi tag (`tag (điểm)`) thay vì chỉ tên tag.
- `components/SuggestionCard.tsx`: đổi hiển thị "điểm {score}" thành "khoảng cách MDSB = {distance}"
  kèm chú thích "càng thấp càng tối ưu" để tránh hiểu nhầm chiều so sánh.
- Ghi rõ trong `CLAUDE.md`/`README.md`: lý do không dùng Genetic Algorithm như paper (quy mô nhỏ,
  duyệt tổ hợp chính xác vẫn rẻ và đảm bảo tối ưu toàn cục, tránh sai số ngẫu nhiên của GA).

Chạy lại `npx tsc -b --noEmit` và `npm run build` — pass. Khởi động lại `npm run dev`, mở trình duyệt
thật (`Start-Process` PowerShell) để xác nhận UI render bình thường sau khi đổi cấu trúc dữ liệu.

## Lượt 30 — User

> "Uncaught TypeError: Cannot read properties of undefined (reading 'implementation') at topicScore
> (mdsb.ts:22:20) ... tôi chạy không được vào web thì trắng tinh"

Dán nguyên stack trace lỗi từ Console của trình duyệt.

## Lượt 31 — Claude

Chẩn đoán: trình duyệt của người dùng đã lưu `localStorage` từ trước khi đổi `Candidate.topicTags`
sang `topicScores` (ở Lượt 29). `useLocalStorage` đọc dữ liệu cũ (không có field `topicScores`) thay
vì dùng `INITIAL_CANDIDATES` mới, khiến `candidate.topicScores` là `undefined` → crash toàn trang
ngay khi tải — đúng loại lỗi mục 3.4 của đề cấm tuyệt đối ("không hiển thị màn hình trắng").

Sửa gốc rễ (không chỉ vá tạm):
- `App.tsx`: bump key `localStorage` từ `spd-icpc-candidates`/`spd-icpc-constraints` sang hậu tố
  `-v3`, để tự động bỏ qua dữ liệu cũ không tương thích và dùng lại mock data mới — không cần người
  dùng tự xoá localStorage bằng tay.
- Thêm optional chaining (`?.`) khi đọc `topicScores` ở `lib/mdsb.ts` (`topicScore`),
  `lib/teamMatching.ts` (`topicCoverage`), `components/CandidateCard.tsx` — phòng vệ nếu schema
  tiếp tục đổi trong tương lai mà quên bump version, app vẫn không crash trắng màn hình.

Chạy lại `npx tsc -b --noEmit` và `npm run build` — pass. Hướng dẫn người dùng hard-refresh
(`Ctrl+Shift+R`) trang đang mở để chắc chắn không còn cache cũ.

## Lượt 32 — User

Dán kết quả Phương án #5 (Trần Thị Bình, Vũ Thị Phương, Chu Thị Quyên — có người huy chương IOI,
huy chương vàng VOI/Siêu Cúp) nhưng báo cáo giải thích cho thấy đội "thiếu" greedy, brute force,
constructive algorithms... rồi hỏi:

> "nhưng bạn coi lại tag của những bạn này đi, suy nghĩ thật kỹ xem, những bạn mà có giải quốc gia
> .... liệu có yếu greedy brute force constructive algorithms không ? bạn phải động não để nghĩ ra
> skill chứ"

## Lượt 33 — Claude

Nhận ra lỗi thiết kế dữ liệu: mỗi ứng viên trước đó chỉ được gán 2-4 tag "mũi nhọn", mọi tag khác im
lặng = 0 — khiến học sinh giỏi Quốc gia/Quốc tế (IOI, VOI, VMO...) trông như hoàn toàn không biết
greedy/brute force, vô lý vì đó là kỹ năng nền ai luyện ICPC cũng thực hành trước khi chuyên sâu.

Tính lại `topicScores` có hệ thống cho cả 20 ứng viên trong `data/candidates.ts`: giữ nguyên tag mũi
nhọn hiện có, cộng thêm điểm nền cho các tag phổ thông theo công thức tuyến tính từ `mathScore`/
`codingScore`:
- `implementation`, `data structures`, `binary search` ≈ `clamp(codingScore - 3, 0, 9)`.
- `greedy`, `brute force`, `dp` ≈ `clamp(round((mathScore+codingScore)/2) - 3, 0, 9)`.
- `math`, `graphs` (nếu chưa là mũi nhọn) ≈ `clamp(score - 4, 0, 9)`.
- Các tag chuyên sâu hiếm (constructive algorithms, strings, number theory, geometry, games, two
  pointers) giữ nguyên — chỉ xuất hiện khi thực sự là thế mạnh, không rải điểm nền, giống phân bố
  thật trên Codeforces mà paper IMMS 2018 đã chỉ ra (một số tag hiếm có điểm trung bình thấp ngay cả
  ở đội vô địch).

Ghi công thức này thành comment ngay đầu `data/candidates.ts` để minh bạch. Chạy lại
`npx tsc -b --noEmit` và `npm run build` — pass.

## Lượt 34 — User

> "hiện tại tôi muốn dev thêm chức năng đăng nhập theo từng user hiện tại, tức là dựa vào data mock
> hiện tại chúng ta sẽ tạo tài khoản riêng cho từng user đó, bây giờ là liên quan tới database rồi
> tôi đang có docker, bạn có thể nào tạo 1 kho database cần thiết trên docker"

## Lượt 35 — Claude

Kiểm tra Docker (`docker --version`, `docker compose version`, `docker ps`) — sẵn sàng. Vì đây là
thay đổi kiến trúc lớn (từ SPA client-only sang có backend + database), hỏi 2 câu để chốt phạm vi
trước khi code: (1) đăng nhập thật (email+password) hay chỉ chọn hồ sơ; (2) sau đăng nhập user được
sửa hồ sơ hay chỉ xem. User chọn: chọn hồ sơ (không password), chỉ xem không sửa.

Quyết định thiết kế (nêu rõ với user trước khi làm): **tách rủi ro** — luồng ghép đội chính (đã chạy
ổn, là phần bắt buộc chấm điểm) giữ nguyên hoàn toàn dùng mock JSON + `localStorage`; tính năng đăng
nhập mới là một tab riêng, độc lập, có database riêng.

## Lượt 36 — Claude (tiếp, cùng lượt xử lý)

Triển khai:
- Dùng `typescript` package có sẵn trong `source/node_modules` (qua TS compiler API) để trích xuất
  chính xác 20 ứng viên từ `data/candidates.ts` sang SQL — tránh gõ tay sai sót cấu trúc JSONB lồng
  nhau. Script lưu lại tại `source/backend/scripts/gen-seed.cjs` để tái tạo khi `candidates.ts` đổi.
- `docker-compose.yml` (repo root): 1 service Postgres 16, seed tự động qua
  `source/backend/db/init.sql` (mount vào `/docker-entrypoint-initdb.d/`). Thông tin kết nối đọc từ
  `.env` (không commit) với `.env.example` làm mẫu — không hardcode credential trong file đã commit.
- `source/backend`: Express + `pg`, REST API (`GET /api/candidates`, `GET /api/candidates/:id`,
  `PATCH /api/candidates/:id/active`, `GET /health`), CORS mở cho origin frontend.
- Khởi động container (`docker compose up -d db`), đợi Postgres sẵn sàng, xác nhận qua `psql`:
  20 dòng, tiếng Việt hiển thị đúng. Cài dependency backend, chạy `npm run start`, `curl` xác nhận
  `/health` và `/api/candidates` trả đúng cấu trúc khớp type `Candidate` ở frontend.
- Frontend: `lib/api.ts` (gọi API qua `VITE_API_URL`), `vite-env.d.ts` (khai báo type cho biến môi
  trường Vite tuỳ chỉnh), `components/StudentPortal.tsx` (đăng nhập bằng chọn tên trong danh sách
  lấy từ API, lưu `id` đã chọn vào `localStorage`, hiển thị hồ sơ read-only; nếu API lỗi thì hiện
  thông báo lỗi kết nối rõ ràng, không crash). `App.tsx` thêm tab "Ghép đội (Điều phối)" /
  "Cổng sinh viên (Đăng nhập)" — không đổi nguồn dữ liệu hay logic của luồng ghép đội hiện có.
- Dọn các tiến trình `vite dev` cũ còn tồn đọng từ nhiều lượt trước (dùng PowerShell
  `Get-CimInstance Win32_Process` liệt kê rồi `Stop-Process`), khởi động lại 1 frontend dev server
  sạch trên `5173` để test.
- Cập nhật `submission.json` (`dependency_files` thêm `source/backend/package.json`, `run_command`
  mô tả đủ 2 bước docker + backend + frontend), `README.md` (mục 2/3/4/5: tính năng, công nghệ,
  hướng dẫn chạy 2 phần tách biệt, cấu trúc thư mục mới), `CLAUDE.md` (mục 4: ghi rõ quyết định tách
  rủi ro, cách re-seed khi đổi `candidates.ts`).
- Chạy lại `npx tsc -b --noEmit`, `npm run build`, `docker compose config` (validate cú pháp) — tất
  cả pass. Kiểm tra `git add -n -A` để xác nhận không có `.env` thật hay `node_modules` nào bị lọt
  vào staging, chỉ các `.env.example` và mã nguồn thật được thêm mới.

---

> **Lưu ý cho người nộp bài**: nếu công cụ AI đang dùng hỗ trợ export session link công khai
> (ví dụ Claude, ChatGPT, Gemini chia sẻ session), hãy dán thêm link đó vào ô "Chatlog / AI sessions"
> khi nộp theo đúng `SUBMISSION PROTOCOL`, mỗi link một dòng theo thứ tự thời gian, bổ sung cho file
> này. Trước khi nộp, rà lại toàn bộ log này để đảm bảo khớp timestamp commit và không sót lượt
> prompt/response nào diễn ra sau lượt cuối được ghi ở đây.
