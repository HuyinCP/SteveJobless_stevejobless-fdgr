import { useState } from "react";
import type { FormEvent } from "react";
import { registerCandidate } from "../lib/api";
import type { Candidate } from "../types";

interface Props {
  onRegistered: (candidate: Candidate) => void;
  onCancel: () => void;
}

const MSSV_RE = /^\d{8}$/;

export function RegisterProfile({ onRegistered, onCancel }: Props) {
  const [fullName, setFullName] = useState("");
  const [mssv, setMssv] = useState("");
  const [mathScore, setMathScore] = useState(5);
  const [codingScore, setCodingScore] = useState(5);
  const [regionalCount, setRegionalCount] = useState(0);
  const [wfCount, setWfCount] = useState(0);
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const email = MSSV_RE.test(mssv) ? `${mssv}@student.hcmus.edu.vn` : "";
  const nameValid = fullName.trim().split(/\s+/).length >= 2;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nameValid) {
      setError("Họ tên phải là tên thật, ít nhất 2 từ.");
      return;
    }
    if (!MSSV_RE.test(mssv)) {
      setError("MSSV phải gồm đúng 8 chữ số.");
      return;
    }
    setSubmitting(true);
    try {
      const candidate = await registerCandidate({
        fullName: fullName.trim(),
        mssv,
        email,
        mathScore,
        codingScore,
        regionalCount,
        wfCount,
        strengths: strengths.trim(),
        weaknesses: weaknesses.trim(),
      });
      onRegistered(candidate);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Đăng ký hồ sơ mới</h3>
        <p className="text-sm text-slate-500">
          Dành cho sinh viên chưa có trong hệ thống — điền thông tin để tạo hồ sơ ứng viên của bạn.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên (thật)</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nguyễn Văn A"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">MSSV (8 số)</label>
          <input
            type="text"
            value={mssv}
            onChange={(e) => setMssv(e.target.value.replace(/\D/g, "").slice(0, 8))}
            placeholder="21127021"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email sinh viên (tự động theo MSSV)
          </label>
          <input
            type="text"
            value={email || "—"}
            readOnly
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tự đánh giá Toán: <b>{mathScore}</b>/10
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={mathScore}
            onChange={(e) => setMathScore(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tự đánh giá Lập trình: <b>{codingScore}</b>/10
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={codingScore}
            onChange={(e) => setCodingScore(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Số lần đã thi Regional</label>
          <input
            type="number"
            min={0}
            value={regionalCount}
            onChange={(e) => setRegionalCount(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Số lần đã thi World Finals</label>
          <input
            type="number"
            min={0}
            value={wfCount}
            onChange={(e) => setWfCount(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Điểm mạnh</label>
        <textarea
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Cần cải thiện</label>
        <textarea
          value={weaknesses}
          onChange={(e) => setWeaknesses(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? "Đang tạo hồ sơ..." : "Tạo hồ sơ"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
