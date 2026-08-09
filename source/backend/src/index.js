import "dotenv/config";
import cors from "cors";
import express from "express";
import { pool } from "./db.js";

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

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`ICPC Squad Finder API đang chạy tại http://localhost:${port}`);
});
