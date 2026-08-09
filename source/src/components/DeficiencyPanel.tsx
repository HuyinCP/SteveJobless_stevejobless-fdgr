import type { DeficiencyReason } from "../types";

interface Props {
  deficiencies: DeficiencyReason[];
}

export function DeficiencyPanel({ deficiencies }: Props) {
  if (deficiencies.length === 0) return null;

  return (
    <div className="rounded-xl border border-rose-300 bg-rose-50 p-4">
      <h3 className="font-semibold text-rose-700">Không tìm được đội hình hợp lệ nào (vô nghiệm)</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-700 list-disc pl-5">
        {deficiencies.map((d, i) => (
          <li key={i}>{d.reason}</li>
        ))}
      </ul>
      <p className="text-sm text-rose-700 mt-2">
        Hệ thống không tự tạo dữ liệu giả hoặc lặp lại thành viên để lấp chỗ trống. Hãy nới ràng buộc
        ở Bước 1 hoặc bật thêm ứng viên ở Bước 2 rồi thử lại.
      </p>
    </div>
  );
}
