import { ICPC_MAX_REGIONAL_YEARS, ICPC_MAX_WORLD_FINALS, ICPC_TEAM_SIZE } from "../lib/icpcRules";
import type { FormationConstraints } from "../types";

interface Props {
  constraints: FormationConstraints;
  onChange: (next: FormationConstraints) => void;
}

export function ConstraintsForm({ constraints, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:col-span-2">
        <p className="text-sm font-medium text-slate-700 mb-2">
          Ràng buộc theo luật ICPC Global (cố định — không thể chỉnh)
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700">
            Đúng {ICPC_TEAM_SIZE} thành viên/đội
          </span>
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700">
            Tối đa {ICPC_MAX_REGIONAL_YEARS} năm thi Regional
          </span>
          <span className="px-2 py-1 rounded bg-slate-100 text-slate-700">
            Tối đa {ICPC_MAX_WORLD_FINALS} lần thi World Finals
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Theo ICPC Regional Rules (mục "Team Composition" và "Limits on Participation") — luật thi
          đấu toàn cầu, hệ thống áp dụng cố định cho mọi ứng viên.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">Ngưỡng "mạnh" (0-10)</label>
        <input
          type="range"
          min={1}
          max={10}
          className="w-full"
          value={constraints.strongThreshold}
          onChange={(e) => onChange({ ...constraints, strongThreshold: Number(e.target.value) })}
        />
        <p className="text-xs text-slate-500 mt-1">
          Điểm toán/lập trình ≥ <b>{constraints.strongThreshold}</b>/10 mới được tính là "mạnh". Đây
          là tiêu chí riêng của dự án (không thuộc luật ICPC), có thể điều chỉnh để kiểm tra khả năng
          cập nhật của hệ thống.
        </p>
      </div>
    </div>
  );
}
