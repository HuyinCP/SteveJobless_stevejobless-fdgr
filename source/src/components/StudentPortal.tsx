import { useEffect, useState } from "react";
import { getCandidates } from "../lib/api";
import { RegisterProfile } from "./RegisterProfile";
import type { Candidate } from "../types";

const PORTAL_USER_KEY = "spd-icpc-portal-user";

export function StudentPortal() {
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    localStorage.getItem(PORTAL_USER_KEY)
  );
  const [registering, setRegistering] = useState(false);
  const [pendingId, setPendingId] = useState("");

  useEffect(() => {
    getCandidates()
      .then(setCandidates)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const login = (id: string) => {
    localStorage.setItem(PORTAL_USER_KEY, id);
    setSelectedId(id);
  };
  const logout = () => {
    localStorage.removeItem(PORTAL_USER_KEY);
    setSelectedId(null);
  };

  if (error) {
    return (
      <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
        Không kết nối được backend ({error}). Cần chạy <code>docker compose up -d db</code> rồi{" "}
        <code>cd source/backend && npm install && npm run dev</code>.
      </div>
    );
  }
  if (!candidates) {
    return <p className="text-sm text-slate-500">Đang tải danh sách ứng viên từ database...</p>;
  }

  const me = candidates.find((c) => c.id === selectedId) ?? null;

  if (registering) {
    return (
      <RegisterProfile
        onCancel={() => setRegistering(false)}
        onRegistered={(candidate) => {
          setCandidates((prev) => (prev ? [...prev, candidate] : [candidate]));
          setRegistering(false);
          login(candidate.id);
        }}
      />
    );
  }

  if (!me) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-600 mb-3">
          Chọn tên của bạn để đăng nhập (dữ liệu mock từ database, không cần mật khẩu):
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={pendingId}
            onChange={(e) => setPendingId(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm flex-1 min-w-[220px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="">— Chọn tên của bạn —</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.mssv})
              </option>
            ))}
          </select>
          <button
            onClick={() => pendingId && login(pendingId)}
            disabled={!pendingId}
            className="text-sm rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setRegistering(true)}
            className="text-sm rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50 transition-colors"
          >
            + Đăng ký hồ sơ mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold">
            Hồ sơ cá nhân (chỉ xem)
          </p>
          <h3 className="text-lg font-semibold text-slate-900">{me.fullName}</h3>
          <p className="text-sm text-slate-500">
            {me.mssv} · {me.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50 shrink-0 transition-colors"
        >
          Đăng xuất
        </button>
      </div>

      <div className="flex gap-2 text-xs mb-3">
        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          Toán {me.mathScore}/10
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
          Lập trình {me.codingScore}/10
        </span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          Regional {me.regionalCount} · WF {me.wfCount}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {Object.entries(me.topicScores).map(([tag, value]) => (
          <span key={tag} className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            {tag} ({value})
          </span>
        ))}
      </div>

      <p className="text-sm text-slate-700 mb-1">
        <b>Điểm mạnh:</b> {me.strengths || "—"}
      </p>
      <p className="text-sm text-slate-500 mb-3">
        <b>Cần cải thiện:</b> {me.weaknesses || "—"}
      </p>

      {me.achievements.length > 0 && (
        <ul className="text-sm text-slate-600 list-disc pl-5 space-y-0.5">
          {me.achievements.map((a, i) => (
            <li key={i}>
              {a.competition} ({a.level}, {a.year}) — {a.result}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
