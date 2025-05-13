import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ success: false, error: "Method Not Allowed" });

  const { sort = "time", difficulty = "easy" } = req.query;
  const validDifficulties = ["easy", "medium", "hard"];
  const sortDifficulty = validDifficulties.includes(difficulty) ? difficulty : "easy";

  try {
    const { data, error } = await supabase
      .from("minesweeper_scores")
      .select(`
        username,
        booms,
        wins_easy,
        wins_medium,
        wins_hard,
        easy_time,
        medium_time,
        hard_time
      `);

    if (error) return res.status(500).json({ error: error.message });

    const leaderboard = data.map(entry => ({
      username: entry.username,
      totalBooms: entry.booms || 0,
      easy: entry.wins_easy || 0,
      medium: entry.wins_medium || 0,
      hard: entry.wins_hard || 0,
      bestTimes: {
        easy: entry.easy_time ?? null,
        medium: entry.medium_time ?? null,
        hard: entry.hard_time ?? null
      }
    }));

    leaderboard.sort((a, b) => {
      if (sort === "booms") return b.totalBooms - a.totalBooms;
      if (["easy", "medium", "hard"].includes(sort)) return b[sort] - a[sort];
      if (sort === "time") {
        const aTime = a.bestTimes[sortDifficulty] ?? Infinity;
        const bTime = b.bestTimes[sortDifficulty] ?? Infinity;
        return aTime - bTime;
      }
      return a.username.localeCompare(b.username);
    });

    return res.status(200).json(leaderboard.slice(0, 10));
  } catch (err) {
    console.error("Leaderboard error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
