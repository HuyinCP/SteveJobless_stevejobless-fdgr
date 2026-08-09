import { useMemo, useState } from "react";
import type { Candidate } from "../types";
import { CandidateCard } from "./CandidateCard";

interface Props {
  candidates: Candidate[];
  strongThreshold: number;
  schools: string[];
  onToggleActive: (id: string) => void;
}

export function CandidatePool({ candidates, strongThreshold, schools, onToggleActive }: Props) {
  const [query, setQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchesQuery =
        query.trim() === "" ||
        c.fullName.toLowerCase().includes(query.toLowerCase()) ||
        c.mssv.includes(query);
      const matchesSchool = schoolFilter === "" || c.school === schoolFilter;
      return matchesQuery && matchesSchool;
    });
  }, [candidates, query, schoolFilter]);

  const activeCount = candidates.filter((c) => c.active).length;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc MSSV..."
          className="rounded border border-slate-300 px-3 py-2 text-sm flex-1 min-w-[200px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
        >
          <option value="">Tất cả trường</option>
          {schools.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-500 self-center">
          {activeCount}/{candidates.length} ứng viên đang sẵn sàng · hiển thị {filtered.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((c) => (
          <CandidateCard
            key={c.id}
            candidate={c}
            strongThreshold={strongThreshold}
            onToggleActive={onToggleActive}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-slate-500 mt-4">Không có ứng viên khớp bộ lọc hiện tại.</p>
      )}
    </div>
  );
}
