import type { Candidate } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Cổng sinh viên đọc danh sách/hồ sơ ứng viên từ backend (Postgres), tách khỏi luồng ghép đội
 * chính (vẫn dùng mock JSON + localStorage như trước, xem CLAUDE.md mục 4 lý do tách rủi ro). */
export function getCandidates(): Promise<Candidate[]> {
  return request<Candidate[]>("/api/candidates");
}

export function getCandidateById(id: string): Promise<Candidate> {
  return request<Candidate>(`/api/candidates/${id}`);
}
