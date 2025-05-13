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
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method Not Allowed" });

  try {
    const { username, time, difficulty, booms } = req.body;

    if (!username || !difficulty || typeof booms !== "number") {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const isWin = typeof time === "number" && time > 0;
    const timeKey = `${difficulty}_time`;
    const winKey = `wins_${difficulty}`;

    const { data: existing, error: fetchError } = await supabase
      .from("minesweeper_scores")
      .select("*")
      .eq("username", username)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Fetch error:", fetchError.message);
      return res.status(500).json({ success: false, error: fetchError.message });
    }

    if (existing) {
      const updates = {
        booms: (existing.booms || 0) + booms,
        [winKey]: (existing[winKey] || 0) + (isWin ? 1 : 0),
        [timeKey]: existing[timeKey]
      };

      if (isWin && (existing[timeKey] == null || time < existing[timeKey])) {
        updates[timeKey] = time;
      }

      const { error: updateError } = await supabase
        .from("minesweeper_scores")
        .update(updates)
        .eq("username", username);

      if (updateError) {
        console.error("Update error:", updateError.message);
        return res.status(500).json({ success: false, error: updateError.message });
      }
    } else {
      const insertPayload = {
        username,
        wins_easy: 0,
        wins_medium: 0,
        wins_hard: 0,
        easy_time: null,
        medium_time: null,
        hard_time: null,
        booms: booms,
        [winKey]: isWin ? 1 : 0,
        [timeKey]: isWin ? time : null
      };

      const { error: insertError } = await supabase
        .from("minesweeper_scores")
        .insert([insertPayload]);

      if (insertError) {
        console.error("Insert error:", insertError.message);
        return res.status(500).json({ success: false, error: insertError.message });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Handler crash:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
