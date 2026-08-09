// Taxonomy chủ đề lấy theo tag chính thức của Codeforces (codeforces.com/blog/entry/22380),
// rút gọn về các tag phổ biến nhất theo phân bố thực tế (implementation, math, greedy, dp...).
export type TopicTag =
  | "implementation"
  | "math"
  | "greedy"
  | "dp"
  | "data structures"
  | "brute force"
  | "constructive algorithms"
  | "graphs"
  | "binary search"
  | "strings"
  | "number theory"
  | "geometry"
  | "games"
  | "two pointers";

export const ALL_TOPIC_TAGS: TopicTag[] = [
  "implementation",
  "math",
  "greedy",
  "dp",
  "data structures",
  "brute force",
  "constructive algorithms",
  "graphs",
  "binary search",
  "strings",
  "number theory",
  "geometry",
  "games",
  "two pointers",
];

// Cấp độ giải thưởng, theo hệ thống thi học sinh giỏi/Olympic sinh viên tại Việt Nam.
export type AchievementLevel = "Tỉnh/Thành phố" | "Quốc gia" | "Quốc tế" | "Đại học toàn quốc";

export interface Achievement {
  competition: string; // tên kỳ thi, ví dụ "VMO", "VOI", "IOI", "Olympic Tin học Sinh viên — Khối Siêu Cúp"
  level: AchievementLevel;
  year: number;
  result: string; // ví dụ "Giải Nhất", "Huy chương Vàng", "Top 10"
}

export interface Candidate {
  id: string;
  fullName: string;
  mssv: string;
  email: string;
  mathScore: number; // 0-10, tư duy toán / giải thuật
  codingScore: number; // 0-10, cài đặt / lập trình thi đấu
  regionalCount: number; // số lần đã thi vòng Regional
  wfCount: number; // số lần đã thi World Finals
  topicTags: TopicTag[]; // chủ đề mạnh theo tag Codeforces — một ứng viên có thể có nhiều tag
  achievements: Achievement[];
  strengths: string;
  weaknesses: string;
  active: boolean; // đang sẵn sàng tham gia ghép đội (có thể tắt để mô phỏng cập nhật động)
}

export interface FormationConstraints {
  strongThreshold: number; // điểm >= threshold thì coi là "mạnh" ở mảng đó — tham số dự án, không phải luật ICPC
}

export interface RoleAssignment {
  candidate: Candidate;
  role: "Tư duy toán" | "Lập trình / cài đặt" | "Toán + Lập trình (cả hai)";
}

export interface TeamSuggestion {
  id: string;
  members: Candidate[];
  roleAssignments: RoleAssignment[];
  score: number;
  pattern: string; // mẫu hình "đội mạnh" mà đội này đạt được (rule cứng theo đề)
  coveredTopics: TopicTag[]; // phủ tag thực tế — chỉ dùng để xếp hạng/giải thích, không quyết định hợp lệ
  missingTopics: TopicTag[];
  explanation: string[];
}

export interface DeficiencyReason {
  eligibleCount: number;
  mathStrongCount: number;
  codingStrongCount: number;
  reason: string;
}

export interface FormationResult {
  status: "ok" | "no-solution";
  suggestions: TeamSuggestion[];
  deficiencies: DeficiencyReason[];
  generatedAt: number;
}
