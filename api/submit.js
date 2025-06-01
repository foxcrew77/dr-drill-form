export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Use your working Apps Script Web App URL
      const response = await fetch('https://script.google.com/macros/s/AKfycbxDA6EairvLNbDnm8dl4bFznGIaYsgHCYG-3s6p2TuRGSC3ONCoqHlg4O_aZOevtfeSow/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Apps Script responded with status: ${response.status}`);
      }

      // Try to read as text first
      const text = await response.text();

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Apps Script response is not JSON:', text);
        throw new Error('Apps Script did not return valid JSON');
      }

      res.status(200).json(data);
    } catch (err) {
      console.error('API error:', err.message);
      res.status(500).json({ status: 'error', message: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 