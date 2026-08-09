import type { Candidate } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Cổng sinh viên đọc/ghi dữ liệu ứng viên từ backend (Postgres), tách khỏi luồng ghép đội chính
 * (vẫn dùng mock JSON + localStorage như trước, xem CLAUDE.md mục 4 lý do tách rủi ro). */
export function getCandidates(): Promise<Candidate[]> {
  return request<Candidate[]>("/api/candidates");
}

export function getCandidateById(id: string): Promise<Candidate> {
  return request<Candidate>(`/api/candidates/${id}`);
}

export interface NewCandidateInput {
  fullName: string;
  mssv: string;
  email: string;
  mathScore: number;
  codingScore: number;
  regionalCount: number;
  wfCount: number;
  strengths: string;
  weaknesses: string;
}

export function registerCandidate(input: NewCandidateInput): Promise<Candidate> {
  return request<Candidate>("/api/candidates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
