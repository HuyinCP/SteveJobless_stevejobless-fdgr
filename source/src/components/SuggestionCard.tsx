import type { TeamSuggestion } from "../types";

interface Props {
  suggestion: TeamSuggestion;
  rank: number;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function SuggestionCard({ suggestion, rank, selected, onSelect }: Props) {
  return (
    <div
      className={`rounded-lg border p-4 bg-white flex flex-col gap-3 ${
        selected ? "border-indigo-500 ring-2 ring-indigo-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            Phương án #{rank} · khoảng cách MDSB = {suggestion.mdsbDistance.toFixed(2)}
          </h3>
          <p className="text-xs text-slate-400">Càng thấp càng gần điểm biên lý tưởng (tối ưu hơn).</p>
        </div>
        <button
          onClick={() => onSelect(suggestion.id)}
          className={`text-xs px-3 py-1.5 rounded font-medium ${
            selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {selected ? "Đã chọn" : "Chọn đội này"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {suggestion.roleAssignments.map(({ candidate, role }) => (
          <div key={candidate.id} className="rounded border border-slate-100 bg-slate-50 p-2">
            <p className="text-sm font-medium text-slate-900">{candidate.fullName}</p>
            <p className="text-xs text-indigo-600">{role}</p>
            <p className="text-xs text-slate-500">
              Toán {candidate.mathScore} · Lập trình {candidate.codingScore}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {suggestion.coveredTopics.map((t) => (
          <span key={t} className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
            {t}
          </span>
        ))}
        {suggestion.missingTopics.map((t) => (
          <span key={t} className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 line-through">
            {t}
          </span>
        ))}
      </div>

      <details className="text-sm text-slate-600">
        <summary className="cursor-pointer text-indigo-600 font-medium">
          Xem báo cáo giải thích chi tiết
        </summary>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          {suggestion.explanation.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
