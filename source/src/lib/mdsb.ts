import { ALL_TOPIC_TAGS } from "../types";
import type { Candidate, TopicTag } from "../types";

// Mô hình MDSB (Minimize Distance to Bound point).
// Nguồn: Ngo Tung Son, Le Van Thanh, Tran Binh Duong, Bui Ngoc Anh — "A Decision Support Tool for
// Cross-Functional Team Selection: Case Study in ACM-ICPC Team Selection", IMMS 2018.
//
// Ý tưởng: với h thành viên và m tag kỹ năng (Codeforces), bound point E là điểm "lý tưởng nhưng
// khó đạt cùng lúc" — mỗi tọa độ E_j là tổng điểm của h ứng viên giỏi nhất tag j trong toàn bộ nhóm
// (tính độc lập theo từng tag, nên hiếm khi cùng một đội đạt được toàn bộ). Một đội thật có điểm
// đạt được O (tổng điểm từng tag của các thành viên). Đội tối ưu là đội có khoảng cách Euclid
// ||E - O|| nhỏ nhất — cách này gộp đồng thời 2 mục tiêu "wide" (phủ nhiều tag) và "deep" (điểm cao
// mỗi tag) thành một hàm mục tiêu duy nhất, không cần tự chọn trọng số thủ công như weighted-sum.
//
// Khác với paper (dùng Genetic Algorithm cho quy mô lớn), ở đây quy mô nhỏ (tối đa vài trăm tổ hợp
// sau khi đã lọc theo 4 điều kiện hợp lệ của đề) nên duyệt tổ hợp chính xác — đảm bảo tối ưu toàn
// cục, không có sai số xấp xỉ như GA.

export type TopicPoint = Record<TopicTag, number>;

function topicScore(candidate: Candidate, tag: TopicTag): number {
  return candidate.topicScores?.[tag] ?? 0;
}

/** E_j = tổng điểm của `teamSize` ứng viên giỏi nhất tag j, tính trên toàn bộ pool ứng viên hợp lệ. */
export function computeBoundPoint(pool: Candidate[], teamSize: number): TopicPoint {
  const bound = {} as TopicPoint;
  ALL_TOPIC_TAGS.forEach((tag) => {
    const topScores = pool
      .map((c) => topicScore(c, tag))
      .sort((a, b) => b - a)
      .slice(0, teamSize);
    bound[tag] = topScores.reduce((sum, v) => sum + v, 0);
  });
  return bound;
}

/** O_j = tổng điểm tag j của các thành viên trong một đội cụ thể. */
export function computeAchievedPoint(members: Candidate[]): TopicPoint {
  const point = {} as TopicPoint;
  ALL_TOPIC_TAGS.forEach((tag) => {
    point[tag] = members.reduce((sum, c) => sum + topicScore(c, tag), 0);
  });
  return point;
}

/** distance(E, O) = sqrt(Σ (E_j - O_j)^2) — càng nhỏ càng gần điểm biên lý tưởng, càng tối ưu. */
export function mdsbDistance(boundPoint: TopicPoint, achievedPoint: TopicPoint): number {
  const sumSquares = ALL_TOPIC_TAGS.reduce((sum, tag) => {
    const diff = boundPoint[tag] - achievedPoint[tag];
    return sum + diff * diff;
  }, 0);
  return Math.sqrt(sumSquares);
}
