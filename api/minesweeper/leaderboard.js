import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { difficulty } = req.query;
  if (!difficulty) {
    return res.status(400).json({ error: "Missing difficulty" });
  }

  const { data, error } = await supabase
    .from("minesweeper_scores")
    .select("username, time")
    .eq("difficulty", difficulty)
    .order("time", { ascending: true })
    .limit(10);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
}
