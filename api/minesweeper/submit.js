import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = {
    username,
    time,
    difficulty,
    wins_easy: currentDifficulty === "easy" ? 1 : 0,
    wins_medium: currentDifficulty === "medium" ? 1 : 0,
    wins_hard: currentDifficulty === "hard" ? 1 : 0,
    booms: totalBooms
  };

  if (!username || !time || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Fetch existing entry by username
  const { data: existing, error: fetchError } = await supabase
    .from('minesweeper_scores')
    .select('*')
    .eq('username', username)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return res.status(500).json({ error: fetchError.message });
  }

  let updates = {
    username,
    time,
    difficulty,
    booms,
    wins_easy,
    wins_medium,
    wins_hard
  };

  // If user exists, update cumulatively
  if (existing) {
    updates.booms = existing.booms + booms;
    updates.wins_easy = existing.wins_easy + wins_easy;
    updates.wins_medium = existing.wins_medium + wins_medium;
    updates.wins_hard = existing.wins_hard + wins_hard;

    // Preserve best (lowest) time
    if (
      existing.difficulty === difficulty &&
      typeof existing.time === 'number' &&
      existing.time > 0 &&
      time >= existing.time
    ) {
      updates.time = existing.time;
    }
  }

  // Perform upsert (insert or update by username)
  const { error: upsertError } = await supabase
    .from('minesweeper_scores')
    .upsert(updates, { onConflict: ['username'] });

  if (upsertError) {
    return res.status(500).json({ error: upsertError.message });
  }

  res.status(200).json({ success: true });
}
