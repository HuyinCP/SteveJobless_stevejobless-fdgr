import "dotenv/config";
import { randomUUID } from "node:crypto";
import cors from "cors";
import express from "express";
import { pool } from "./db.js";

const MSSV_RE = /^\d{8}$/;
const NAME_RE = /^[\p{L}\s]{3,}$/u; // ít nhất 3 ký tự chữ (có dấu) + khoảng trắng, không số/ký tự đặc biệt

function emailMatchesMssv(email, mssv) {
  return email.toLowerCase() === `${mssv}@student.hcmus.edu.vn`;
}

function looksLikeRealName(name) {
  const trimmed = name.trim();
  return NAME_RE.test(trimmed) && trimmed.split(/\s+/).length >= 2;
}

function validateNewCandidate(body) {
  const errors = [];
  const fullName = String(body.fullName ?? "").trim();
  const mssv = String(body.mssv ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const mathScore = Number(body.mathScore);
  const codingScore = Number(body.codingScore);
  const regionalCount = Number(body.regionalCount ?? 0);
  const wfCount = Number(body.wfCount ?? 0);
  const strengths = String(body.strengths ?? "").trim();
  const weaknesses = String(body.weaknesses ?? "").trim();

  if (!looksLikeRealName(fullName)) {
    errors.push("Họ tên phải là tên thật (ít nhất 2 từ, chỉ chứa chữ cái).");
  }
  if (!MSSV_RE.test(mssv)) {
    errors.push("MSSV phải gồm đúng 8 chữ số.");
  }
  if (!emailMatchesMssv(email, mssv)) {
    errors.push("Email phải đúng định dạng <mssv>@student.hcmus.edu.vn và khớp với MSSV đã nhập.");
  }
  if (!Number.isInteger(mathScore) || mathScore < 0 || mathScore > 10) {
    errors.push("Điểm toán phải là số nguyên 0-10.");
  }
  if (!Number.isInteger(codingScore) || codingScore < 0 || codingScore > 10) {
    errors.push("Điểm lập trình phải là số nguyên 0-10.");
  }
  if (!Number.isInteger(regionalCount) || regionalCount < 0) {
    errors.push("Số lần thi Regional phải là số nguyên >= 0.");
  }
  if (!Number.isInteger(wfCount) || wfCount < 0) {
    errors.push("Số lần thi World Finals phải là số nguyên >= 0.");
  }

  return {
    errors,
    value: { fullName, mssv, email, mathScore, codingScore, regionalCount, wfCount, strengths, weaknesses },
  };
}

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

function toCandidate(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    mssv: row.mssv,
    email: row.email,
    mathScore: row.math_score,
    codingScore: row.coding_score,
    regionalCount: row.regional_count,
    wfCount: row.wf_count,
    topicScores: row.topic_scores,
    achievements: row.achievements,
    strengths: row.strengths,
    weaknesses: row.weaknesses,
    active: row.active,
  };
}

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (err) {
    res.status(503).json({ status: "db-unreachable", error: String(err.message ?? err) });
  }
});

app.get("/api/candidates", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM candidates ORDER BY id");
    res.json(rows.map(toCandidate));
  } catch (err) {
    res.status(500).json({ error: String(err.message ?? err) });
  }
});

app.get("/api/candidates/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM candidates WHERE id = $1", [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Không tìm thấy ứng viên." });
      return;
    }
    res.json(toCandidate(rows[0]));
  } catch (err) {
    res.status(500).json({ error: String(err.message ?? err) });
  }
});

app.patch("/api/candidates/:id/active", async (req, res) => {
  const { active } = req.body ?? {};
  if (typeof active !== "boolean") {
    res.status(400).json({ error: "Body cần field 'active' kiểu boolean." });
    return;
  }
  try {
    const { rows } = await pool.query(
      "UPDATE candidates SET active = $1 WHERE id = $2 RETURNING *",
      [active, req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Không tìm thấy ứng viên." });
      return;
    }
    res.json(toCandidate(rows[0]));
  } catch (err) {
    res.status(500).json({ error: String(err.message ?? err) });
  }
});

app.post("/api/candidates", async (req, res) => {
  const { errors, value } = validateNewCandidate(req.body ?? {});
  if (errors.length > 0) {
    res.status(400).json({ error: errors.join(" ") });
    return;
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO candidates
        (id, full_name, mssv, email, math_score, coding_score, regional_count, wf_count,
         topic_scores, achievements, strengths, weaknesses, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '{}'::jsonb, '[]'::jsonb, $9, $10, true)
       RETURNING *`,
      [
        randomUUID(),
        value.fullName,
        value.mssv,
        value.email,
        value.mathScore,
        value.codingScore,
        value.regionalCount,
        value.wfCount,
        value.strengths,
        value.weaknesses,
      ]
    );
    res.status(201).json(toCandidate(rows[0]));
  } catch (err) {
    if (err.code === "23505") {
      // unique_violation (mssv hoặc email đã tồn tại)
      res.status(409).json({ error: "MSSV hoặc email này đã được đăng ký trước đó." });
      return;
    }
    res.status(500).json({ error: String(err.message ?? err) });
  }
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`ICPC Squad Finder API đang chạy tại http://localhost:${port}`);
});
