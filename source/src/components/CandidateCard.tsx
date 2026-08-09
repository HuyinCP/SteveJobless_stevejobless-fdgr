import type { Candidate } from "../types";

interface Props {
  candidate: Candidate;
  strongThreshold: number;
  onToggleActive: (id: string) => void;
}

export function CandidateCard({ candidate, strongThreshold, onToggleActive }: Props) {
  const mathStrong = candidate.mathScore >= strongThreshold;
  const codingStrong = candidate.codingScore >= strongThreshold;
  const overLimit = candidate.regionalCount > 5 || candidate.wfCount > 2;

  return (
    <div
      className={`rounded-lg border p-4 bg-white flex flex-col gap-2 ${
        candidate.active ? "border-slate-200" : "border-slate-200 opacity-50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{candidate.fullName}</p>
          <p className="text-xs text-slate-500">{candidate.mssv}</p>
        </div>
        <label className="flex items-center gap-1 text-xs text-slate-600 shrink-0">
          <input
            type="checkbox"
            checked={candidate.active}
            onChange={() => onToggleActive(candidate.id)}
          />
          sẵn sàng
        </label>
      </div>

      <div className="flex gap-2 text-xs">
        <span
          className={`px-2 py-0.5 rounded-full ${
            mathStrong ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          Toán {candidate.mathScore}/10
        </span>
        <span
          className={`px-2 py-0.5 rounded-full ${
            codingStrong ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          Lập trình {candidate.codingScore}/10
        </span>
        <span
          className={`px-2 py-0.5 rounded-full ${
            overLimit ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          Regional {candidate.regionalCount} · WF {candidate.wfCount}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {candidate.topicTags.map((tag) => (
          <span key={tag} className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-xs text-slate-600">
        <b>Mạnh:</b> {candidate.strengths}
      </p>
      <p className="text-xs text-slate-500">
        <b>Cần cải thiện:</b> {candidate.weaknesses}
      </p>
    </div>
  );
}
