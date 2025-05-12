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
    return res.status(400).json({ error: 'Missing fields' });
  }

  const { data, error } = await supabase
    .from('minesweeper_scores')
    .insert([{ username, time, difficulty }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true, data });
}
