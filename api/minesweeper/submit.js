export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, time, difficulty } = req.body;

  if (!username || !time || !difficulty) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // TEMP: In-memory for testing — this won't persist!
  const leaderboard = globalThis.leaderboard || [];
  leaderboard.push({ username, time, difficulty, date: new Date().toISOString() });
  globalThis.leaderboard = leaderboard;

  return res.status(200).json({ success: true, leaderboard });
}
