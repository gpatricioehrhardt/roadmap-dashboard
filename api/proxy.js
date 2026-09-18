// ✅ Jira Proxy Backend - Environment Variables Configured
// JIRA_API_TOKEN, JIRA_EMAIL, JIRA_SITE are set in Vercel environment
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint } = req.query;
  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint parameter required' });
  }

  const JIRA_SITE = 'carbontech-team.atlassian.net';
  const EMAIL = 'gisele.patricio@carbontech.digital';
  const API_TOKEN = process.env.JIRA_API_TOKEN;

  if (!API_TOKEN) {
    return res.status(401).json({ error: 'JIRA_API_TOKEN not configured' });
  }

  const auth = Buffer.from(`${EMAIL}:${API_TOKEN}`).toString('base64');

  try {
    const response = await fetch(`https://${JIRA_SITE}/rest/api/3${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
