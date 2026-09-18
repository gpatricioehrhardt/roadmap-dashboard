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
    return res.status(500).json({ error: 'JIRA_API_TOKEN not configured' });
  }

  try {
    const auth = Buffer.from(`${EMAIL}:${API_TOKEN}`).toString('base64');
    const url = `https://${JIRA_SITE}/rest/api/3${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Jira API returned ${response.status}: ${response.statusText}`
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}
