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
    const { username, time, difficulty } = req.body;

    if (!username || !difficulty) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    // Fetch existing row
    const { data: existing, error: fetchError } = await supabase
      .from("minesweeper_scores")
      .select("*")
      .eq("username", username)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Fetch error:", fetchError.message);
      return res.status(500).json({ success: false, error: fetchError.message });
    }

    let updates = {
      username,
      difficulty,
      time: typeof time === "number" && time > 0 ? time : null,
      wins_easy: 0,
      wins_medium: 0,
      wins_hard: 0,
      booms: 0
    };

    // Apply only if it's a winning time
    if (typeof time === "number" && time > 0) {
      updates[`wins_${difficulty}`] = 1;
    }

    // Always add 1 boom if it's a loss
    if (!time || time === 0) {
      updates.booms = 1;
    }

    if (existing) {
      // Merge totals
      updates.booms += existing.booms || 0;
      updates.wins_easy += existing.wins_easy || 0;
      updates.wins_medium += existing.wins_medium || 0;
      updates.wins_hard += existing.wins_hard || 0;

      // Keep best time (lowest)
      const prevBest = existing.time;
      if (typeof time === "number" && time > 0 && (prevBest === null || time < prevBest)) {
        updates.time = time;
      } else {
        updates.time = prevBest;
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
      const { error: insertError } = await supabase
        .from("minesweeper_scores")
        .insert([updates]);

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
