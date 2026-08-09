import { useState } from "react";
import type { Candidate } from "../types";
import { CandidateCard } from "./CandidateCard";

interface Props {
  candidates: Candidate[];
  strongThreshold: number;
  onToggleActive: (id: string) => void;
}

export function CandidatePool({ candidates, strongThreshold, onToggleActive }: Props) {
  const [selectedId, setSelectedId] = useState("");

  const activeCount = candidates.filter((c) => c.active).length;
  const selected = candidates.find((c) => c.id === selectedId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm flex-1 min-w-[220px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        >
          <option value="">— Chọn một ứng viên để xem chi tiết —</option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName} ({c.mssv}){c.active ? "" : " · tạm ngừng"}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-500">
          {activeCount}/{candidates.length} ứng viên đang sẵn sàng
        </span>
      </div>

      {selected ? (
        <CandidateCard
          candidate={selected}
          strongThreshold={strongThreshold}
          onToggleActive={onToggleActive}
        />
      ) : (
        <p className="text-sm text-slate-500">Chọn một ứng viên trong danh sách trên để xem hồ sơ.</p>
      )}
    </div>
  );
}
