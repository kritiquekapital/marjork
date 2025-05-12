import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, time, difficulty } = req.body;
  if (!username || !time || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Try to fetch existing entry
  const { data: existing, error: fetchError } = await supabase
    .from('minesweeper_scores')
    .select('*')
    .eq('username', username)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // Ignore "no rows" error, only fail if it's something else
    return res.status(500).json({ error: fetchError.message });
  }

  let updates = {
    username,
    time,
    difficulty,
    booms: existing?.booms ? existing.booms : 0,
    wins_easy: existing?.wins_easy || 0,
    wins_medium: existing?.wins_medium || 0,
    wins_hard: existing?.wins_hard || 0
  };

  // Set latest time for this difficulty (optional: only if it's faster?)
  if (existing && existing.time && time >= existing.time && existing.difficulty === difficulty) {
    updates.time = existing.time; // Keep old best if new time is slower
  }

  // Increment win count by difficulty
  if (difficulty === 'easy') updates.wins_easy++;
  else if (difficulty === 'medium') updates.wins_medium++;
  else if (difficulty === 'hard') updates.wins_hard++;

  // Upsert (insert or update)
  const { error: upsertError } = await supabase
    .from('minesweeper_scores')
    .upsert(updates, { onConflict: ['username'] });

  if (upsertError) {
    return res.status(500).json({ error: upsertError.message });
  }

  res.status(200).json({ success: true });
}
