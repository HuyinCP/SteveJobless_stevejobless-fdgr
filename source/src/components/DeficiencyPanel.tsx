import type { DeficiencyReason } from "../types";

interface Props {
  deficiencies: DeficiencyReason[];
  totalSuggestions: number;
}

export function DeficiencyPanel({ deficiencies, totalSuggestions }: Props) {
  if (deficiencies.length === 0) return null;

  const isFatal = totalSuggestions === 0;

  return (
    <div
      className={`rounded-lg border p-4 ${
        isFatal ? "border-rose-300 bg-rose-50" : "border-amber-300 bg-amber-50"
      }`}
    >
      <h3 className={`font-semibold ${isFatal ? "text-rose-700" : "text-amber-700"}`}>
        {isFatal
          ? "Không tìm được đội hình hợp lệ nào (vô nghiệm)"
          : "Một số nhóm/trường không tạo được đội hình hợp lệ"}
      </h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-700 list-disc pl-5">
        {deficiencies.map((d) => (
          <li key={d.school}>{d.reason}</li>
        ))}
      </ul>
      {isFatal && (
        <p className="text-sm text-rose-700 mt-2">
          Hệ thống không tự tạo dữ liệu giả hoặc lặp lại thành viên để lấp chỗ trống. Hãy nới ràng
          buộc ở Bước 1 hoặc bật thêm ứng viên ở Bước 2 rồi thử lại.
        </p>
      )}
    </div>
  );
}
