import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ConstraintsForm } from "./components/ConstraintsForm";
import { CandidatePool } from "./components/CandidatePool";
import { StudentPortal } from "./components/StudentPortal";
import { SuggestionResults } from "./components/SuggestionResults";
import { INITIAL_CANDIDATES } from "./data/candidates";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DEFAULT_CONSTRAINTS, generateTeamSuggestions } from "./lib/teamMatching";
import type { Candidate, FormationConstraints } from "./types";

function StepHeader({ step, title, hint }: { step: number; title: string; hint?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shrink-0 shadow-sm shadow-blue-600/30">
        {step}
      </span>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {hint && <p className="text-sm text-slate-500">{hint}</p>}
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 sm:p-6">
      {children}
    </section>
  );
}

function App() {
  // v3: bump khi đổi cấu trúc Candidate/FormationConstraints để tránh đọc dữ liệu cũ không tương
  // thích từ localStorage (gây crash trắng màn hình — điều đề bài cấm tuyệt đối).
  const [candidates, setCandidates] = useLocalStorage<Candidate[]>(
    "spd-icpc-candidates-v3",
    INITIAL_CANDIDATES
  );
  const [constraints, setConstraints] = useLocalStorage<FormationConstraints>(
    "spd-icpc-constraints-v3",
    DEFAULT_CONSTRAINTS
  );
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"match" | "portal">("match");

  const result = useMemo(
    () => generateTeamSuggestions(candidates, constraints),
    [candidates, constraints]
  );

  useEffect(() => {
    if (selectedId && !result.suggestions.some((s) => s.id === selectedId)) {
      setSelectedId(null);
    }
  }, [result, selectedId]);

  const toggleActive = (id: string) =>
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  const resetAll = () => {
    setCandidates(INITIAL_CANDIDATES);
    setConstraints(DEFAULT_CONSTRAINTS);
    setHasGenerated(false);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-xs font-semibold text-cyan-100 uppercase tracking-widest">
            SPD Challenge 2026 · Đội SteveJobless
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight">
            ICPC Squad Finder
          </h1>
          <p className="text-sm sm:text-base text-blue-50/90 mt-2 max-w-2xl">
            Hệ thống nội bộ ghép đội thi ICPC (3 người/đội) cho sinh viên Trường ĐH Khoa học Tự
            nhiên, ĐHQG-HCM chuẩn bị vòng khu vực.
          </p>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setView("match")}
              className={`text-sm px-4 py-2 rounded-full font-semibold transition-colors ${
                view === "match"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              Ghép đội (Điều phối)
            </button>
            <button
              onClick={() => setView("portal")}
              className={`text-sm px-4 py-2 rounded-full font-semibold transition-colors ${
                view === "portal"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              Cổng sinh viên (Đăng nhập)
            </button>
          </div>
        </div>
      </header>

      {view === "portal" && (
        <main className="max-w-5xl mx-auto px-4 py-8">
          <StudentPortal />
        </main>
      )}

      {view === "match" && (
      <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
        <Card>
          <StepHeader
            step={1}
            title="Khai báo mục tiêu & ràng buộc"
            hint="Thiết lập điều kiện cho dự án ghép đội ICPC lần này."
          />
          <ConstraintsForm constraints={constraints} onChange={setConstraints} />
        </Card>

        <Card>
          <StepHeader
            step={2}
            title="Khám phá kho ứng viên"
          />
          <CandidatePool
            candidates={candidates}
            strongThreshold={constraints.strongThreshold}
            onToggleActive={toggleActive}
          />
        </Card>

        <Card>
          <StepHeader
            step={3}
            title="Kích hoạt đề xuất đội hình"
            hint="Bấm để hệ thống tính toán các phương án đội hình hợp lệ từ kho ứng viên hiện tại."
          />
          <button
            onClick={() => setHasGenerated(true)}
            className="rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors"
          >
            Tạo đề xuất đội hình
          </button>
          {hasGenerated && (
            <p className="text-xs text-slate-500 mt-3">
              Cập nhật lần cuối: {new Date(result.generatedAt).toLocaleTimeString("vi-VN")} — kết
              quả tự tính lại ngay khi bạn đổi ràng buộc ở Bước 1 hoặc bật/tắt ứng viên ở Bước 2.
            </p>
          )}
        </Card>

        {hasGenerated && (
          <>
            <Card>
              <StepHeader
                step={4}
                title="Báo cáo giải thích"
                hint="Mỗi phương án hiển thị vai trò từng thành viên, chủ đề được phủ và lý do được chọn."
              />
              <SuggestionResults result={result} selectedId={selectedId} onSelect={setSelectedId} />
            </Card>

            <Card>
              <StepHeader
                step={5}
                title="Điều chỉnh biến số để kiểm tra cập nhật động"
                hint="Thử nhanh các preset sau — danh sách ở Bước 4 sẽ tự loại bỏ phương án không còn hợp lệ."
              />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setConstraints((c) => ({ ...c, strongThreshold: 9 }))}
                  className="text-sm rounded-lg border border-slate-300 px-3 py-1.5 bg-white hover:bg-slate-50 transition-colors"
                >
                  Nâng ngưỡng "mạnh" lên 9/10
                </button>
                <button
                  onClick={() => setConstraints((c) => ({ ...c, strongThreshold: 5 }))}
                  className="text-sm rounded-lg border border-slate-300 px-3 py-1.5 bg-white hover:bg-slate-50 transition-colors"
                >
                  Hạ ngưỡng "mạnh" xuống 5/10
                </button>
                <button
                  onClick={() => setConstraints(DEFAULT_CONSTRAINTS)}
                  className="text-sm rounded-lg border border-slate-300 px-3 py-1.5 bg-white hover:bg-slate-50 transition-colors"
                >
                  Khôi phục ràng buộc mặc định
                </button>
              </div>
            </Card>

            <Card>
              <StepHeader
                step={6}
                title="Xử lý ngoại lệ khi vô nghiệm"
                hint="Nếu không có tổ hợp nào thỏa điều kiện, hệ thống báo lỗi rõ ràng — không tự bù dữ liệu giả, không treo, không màn hình trắng."
              />
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => setConstraints((c) => ({ ...c, strongThreshold: 10 }))}
                  className="text-sm rounded-lg border border-rose-300 text-rose-700 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  Demo trường hợp vô nghiệm (ngưỡng "mạnh" = 10/10)
                </button>
              </div>
              {result.status === "no-solution" ? (
                <p className="text-sm text-slate-600">
                  Xem thông báo lỗi chi tiết ở Bước 4 phía trên (khối màu đỏ).
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Hiện tại hệ thống vẫn tìm được ít nhất một phương án hợp lệ.
                </p>
              )}
            </Card>
          </>
        )}

        <footer className="text-center text-xs text-slate-400 pt-4">
          <button onClick={resetAll} className="underline hover:text-slate-600 transition-colors">
            Đặt lại toàn bộ dữ liệu về mặc định
          </button>
        </footer>
      </main>
      )}
    </div>
  );
}

export default App;
