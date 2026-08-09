import type { FormationConstraints } from "../types";

interface Props {
  constraints: FormationConstraints;
  onChange: (next: FormationConstraints) => void;
}

export function ConstraintsForm({ constraints, onChange }: Props) {
  const set = <K extends keyof FormationConstraints>(key: K, value: FormationConstraints[K]) =>
    onChange({ ...constraints, [key]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Số thành viên/đội</label>
        <input
          type="number"
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900"
          value={constraints.teamSize}
          min={2}
          max={5}
          onChange={(e) => set("teamSize", Number(e.target.value) || 1)}
        />
        <p className="text-xs text-slate-500 mt-1">Quy định ICPC: đúng 3 thành viên/đội.</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">Ngưỡng "mạnh" (0-10)</label>
        <input
          type="range"
          min={1}
          max={10}
          className="w-full"
          value={constraints.strongThreshold}
          onChange={(e) => set("strongThreshold", Number(e.target.value))}
        />
        <p className="text-xs text-slate-500 mt-1">
          Điểm toán/lập trình ≥ <b>{constraints.strongThreshold}</b>/10 mới được tính là "mạnh".
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Tối đa số lần thi Regional
        </label>
        <input
          type="number"
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900"
          value={constraints.maxRegional}
          min={0}
          onChange={(e) => set("maxRegional", Number(e.target.value))}
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Tối đa số lần thi World Finals
        </label>
        <input
          type="number"
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900"
          value={constraints.maxWF}
          min={0}
          onChange={(e) => set("maxWF", Number(e.target.value))}
        />
      </div>
    </div>
  );
}
