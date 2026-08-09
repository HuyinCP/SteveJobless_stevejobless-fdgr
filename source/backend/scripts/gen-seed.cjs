// Sinh source/backend/db/init.sql tu source/src/data/candidates.ts (nguon du lieu duy nhat).
// Chay lai sau khi sua candidates.ts:
//   node source/backend/scripts/gen-seed.cjs source/src/data/candidates.ts source/backend/db/init.sql
// Can co "typescript" trong source/node_modules (co san vi frontend dung tsc).
const fs = require("fs");
const ts = require("typescript");

const srcPath = process.argv[2];
const outPath = process.argv[3];

const source = fs.readFileSync(srcPath, "utf8");
const result = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});

const moduleObj = { exports: {} };
const fn = new Function("module", "exports", "require", result.outputText);
fn(moduleObj, moduleObj.exports, () => ({}));

const candidates = moduleObj.exports.INITIAL_CANDIDATES;

function sqlStr(s) {
  return "'" + String(s).replace(/'/g, "''") + "'";
}
function sqlJson(obj) {
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

const lines = [];
lines.push("-- Auto-generated tu source/src/data/candidates.ts. KHONG sua tay - chay lai script gen-seed de dong bo.");
lines.push("");
lines.push("CREATE TABLE IF NOT EXISTS candidates (");
lines.push("  id TEXT PRIMARY KEY,");
lines.push("  full_name TEXT NOT NULL,");
lines.push("  mssv TEXT NOT NULL UNIQUE,");
lines.push("  email TEXT NOT NULL UNIQUE,");
lines.push("  math_score INT NOT NULL,");
lines.push("  coding_score INT NOT NULL,");
lines.push("  regional_count INT NOT NULL,");
lines.push("  wf_count INT NOT NULL,");
lines.push("  topic_scores JSONB NOT NULL DEFAULT '{}'::jsonb,");
lines.push("  achievements JSONB NOT NULL DEFAULT '[]'::jsonb,");
lines.push("  strengths TEXT NOT NULL DEFAULT '',");
lines.push("  weaknesses TEXT NOT NULL DEFAULT '',");
lines.push("  active BOOLEAN NOT NULL DEFAULT true");
lines.push(");");
lines.push("");
lines.push("INSERT INTO candidates");
lines.push(
  "  (id, full_name, mssv, email, math_score, coding_score, regional_count, wf_count, topic_scores, achievements, strengths, weaknesses, active)"
);
lines.push("VALUES");

const rows = candidates.map((c) => {
  return (
    "  (" +
    [
      sqlStr(c.id),
      sqlStr(c.fullName),
      sqlStr(c.mssv),
      sqlStr(c.email),
      c.mathScore,
      c.codingScore,
      c.regionalCount,
      c.wfCount,
      sqlJson(c.topicScores),
      sqlJson(c.achievements),
      sqlStr(c.strengths),
      sqlStr(c.weaknesses),
      c.active ? "true" : "false",
    ].join(", ") +
    ")"
  );
});
lines.push(rows.join(",\n") + "");
lines[lines.length - 1] += "\nON CONFLICT (id) DO NOTHING;";
lines.push("");

fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("Wrote", outPath, "with", candidates.length, "candidates");
