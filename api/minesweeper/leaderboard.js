import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { sort = "time" } = req.query;

  let query = supabase
    .from("minesweeper_scores")
    .select("username, time, difficulty, wins_easy, wins_medium, wins_hard, booms");

  if (sort === "time") {
    query = query.eq("difficulty", req.query.difficulty || "easy").order("time", { ascending: true });
  } else if (["easy", "medium", "hard"].includes(sort)) {
    query = query.order(`wins_${sort}`, { ascending: false });
  } else if (sort === "booms") {
    query = query.order("booms", { ascending: false });
  } else {
    query = query.order("username", { ascending: true });
  }

  query = query.limit(10);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
}
