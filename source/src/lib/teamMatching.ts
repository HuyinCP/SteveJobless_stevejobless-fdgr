import { ALL_TOPIC_TAGS } from "../types";
import type {
  Candidate,
  DeficiencyReason,
  FormationConstraints,
  FormationResult,
  RoleAssignment,
  TeamSuggestion,
  TopicTag,
} from "../types";
import { ICPC_MAX_REGIONAL_YEARS, ICPC_MAX_WORLD_FINALS, ICPC_TEAM_SIZE } from "./icpcRules";

export const DEFAULT_CONSTRAINTS: FormationConstraints = {
  strongThreshold: 7,
};

function combinations<T>(items: T[], k: number): T[][] {
  if (k > items.length || k <= 0) return [];
  const result: T[][] = [];
  const pick = (start: number, current: T[]) => {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < items.length; i++) {
      current.push(items[i]);
      pick(i + 1, current);
      current.pop();
    }
  };
  pick(0, []);
  return result;
}

function isMathStrong(c: Candidate, threshold: number) {
  return c.mathScore >= threshold;
}
function isCodingStrong(c: Candidate, threshold: number) {
  return c.codingScore >= threshold;
}

/** Điều kiện 3 của đề: bao phủ 100% năng lực yêu cầu — một trong hai mẫu hình bù trừ toán/lập trình. */
function evaluatePattern(members: Candidate[], threshold: number): string | null {
  const mathStrongCount = members.filter((c) => isMathStrong(c, threshold)).length;
  const codingStrongCount = members.filter((c) => isCodingStrong(c, threshold)).length;
  const bothCount = members.filter(
    (c) => isMathStrong(c, threshold) && isCodingStrong(c, threshold)
  ).length;

  if (bothCount === members.length) {
    return `Cả ${members.length} thành viên đều mạnh cả toán và lập trình (>= ${threshold}/10 mỗi mảng).`;
  }
  if (mathStrongCount >= 1 && codingStrongCount >= 2) {
    return `≥1 người tư duy toán tốt + ≥2 người giỏi lập trình (toán: ${mathStrongCount}, lập trình: ${codingStrongCount}).`;
  }
  if (codingStrongCount >= 1 && mathStrongCount >= 2) {
    return `≥1 người giỏi lập trình + ≥2 người tư duy toán tốt (toán: ${mathStrongCount}, lập trình: ${codingStrongCount}).`;
  }
  return null;
}

function assignRoles(members: Candidate[], threshold: number): RoleAssignment[] {
  return members.map((candidate) => {
    const mathStrong = isMathStrong(candidate, threshold);
    const codingStrong = isCodingStrong(candidate, threshold);
    let role: RoleAssignment["role"];
    if (mathStrong && codingStrong) role = "Toán + Lập trình (cả hai)";
    else if (mathStrong) role = "Tư duy toán";
    else if (codingStrong) role = "Lập trình / cài đặt";
    else role = candidate.mathScore >= candidate.codingScore ? "Tư duy toán" : "Lập trình / cài đặt";
    return { candidate, role };
  });
}

function topicCoverage(members: Candidate[]): { covered: TopicTag[]; missing: TopicTag[] } {
  const set = new Set<TopicTag>();
  members.forEach((m) => m.topicTags.forEach((t) => set.add(t)));
  const covered = ALL_TOPIC_TAGS.filter((t) => set.has(t));
  const missing = ALL_TOPIC_TAGS.filter((t) => !set.has(t));
  return { covered, missing };
}

function scoreTeam(members: Candidate[], covered: TopicTag[]): number {
  const avgMath = members.reduce((s, c) => s + c.mathScore, 0) / members.length;
  const avgCoding = members.reduce((s, c) => s + c.codingScore, 0) / members.length;
  return Math.round((avgMath + avgCoding + covered.length * 0.3) * 100) / 100;
}

function buildExplanation(
  roles: RoleAssignment[],
  pattern: string,
  covered: TopicTag[],
  missing: TopicTag[]
): string[] {
  const lines: string[] = [];
  lines.push(`Mẫu hình đội mạnh đạt được: ${pattern}`);
  roles.forEach(({ candidate, role }) => {
    lines.push(
      `${candidate.fullName}: vai trò "${role}" (toán ${candidate.mathScore}/10, lập trình ${candidate.codingScore}/10).`
    );
  });
  lines.push(
    `Phủ ${covered.length}/${ALL_TOPIC_TAGS.length} chủ đề Codeforces: ${covered.join(", ") || "không có"}.` +
      (missing.length ? ` Còn thiếu: ${missing.join(", ")}.` : " Không thiếu chủ đề nào.")
  );
  lines.push(
    `Mỗi thành viên đều thỏa giới hạn ICPC: ≤ ${ICPC_MAX_REGIONAL_YEARS} năm thi Regional và ≤ ${ICPC_MAX_WORLD_FINALS} lần thi World Finals.`
  );
  return lines;
}

function diagnose(eligible: Candidate[], constraints: FormationConstraints): DeficiencyReason {
  const mathStrongCount = eligible.filter((c) => isMathStrong(c, constraints.strongThreshold)).length;
  const codingStrongCount = eligible.filter((c) => isCodingStrong(c, constraints.strongThreshold)).length;

  let reason: string;
  if (eligible.length < ICPC_TEAM_SIZE) {
    reason = `Chỉ có ${eligible.length} ứng viên hợp lệ (đã thỏa giới hạn ICPC), cần tối thiểu ${ICPC_TEAM_SIZE} người.`;
  } else {
    reason =
      `Có ${eligible.length} ứng viên hợp lệ nhưng không tổ hợp nào phủ đủ năng lực yêu cầu ` +
      `(hiện có ${mathStrongCount} người tư duy toán tốt và ${codingStrongCount} người giỏi lập trình đạt ngưỡng ${constraints.strongThreshold}/10; ` +
      `cần tối thiểu 1 người ở mảng này + 2 người ở mảng còn lại, hoặc ngược lại).`;
  }
  return { eligibleCount: eligible.length, mathStrongCount, codingStrongCount, reason };
}

export function generateTeamSuggestions(
  allCandidates: Candidate[],
  constraints: FormationConstraints
): FormationResult {
  const active = allCandidates.filter((c) => c.active);
  const eligible = active.filter(
    (c) => c.regionalCount <= ICPC_MAX_REGIONAL_YEARS && c.wfCount <= ICPC_MAX_WORLD_FINALS
  );

  const suggestions: TeamSuggestion[] = [];

  if (eligible.length >= ICPC_TEAM_SIZE) {
    const combos = combinations(eligible, ICPC_TEAM_SIZE);
    combos.forEach((members) => {
      const pattern = evaluatePattern(members, constraints.strongThreshold);
      if (!pattern) return;
      const roleAssignments = assignRoles(members, constraints.strongThreshold);
      const { covered, missing } = topicCoverage(members);
      const score = scoreTeam(members, covered);
      suggestions.push({
        id: members.map((m) => m.id).join("-"),
        members,
        roleAssignments,
        score,
        pattern,
        coveredTopics: covered,
        missingTopics: missing,
        explanation: buildExplanation(roleAssignments, pattern, covered, missing),
      });
    });
  }

  suggestions.sort((a, b) => b.score - a.score);

  return {
    status: suggestions.length > 0 ? "ok" : "no-solution",
    suggestions: suggestions.slice(0, 5),
    deficiencies: suggestions.length > 0 ? [] : [diagnose(eligible, constraints)],
    generatedAt: Date.now(),
  };
}
