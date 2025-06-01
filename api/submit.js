export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzdUboTdeHvwCNJp29e2khdwSgPxbHymYtQHeh4Nq0v87_eTX8EYhZ4x0J23GO8K9l6/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });

      // Try to read as text first
      const text = await response.text();

      // Try to parse as JSON, but catch if it fails
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        // Log the raw response for debugging
        console.error('Google Apps Script response:', text);
        throw new Error('Google Apps Script did not return JSON. Raw response: ' + text);
      }

      res.status(200).json(data);
    } catch (err) {
      // Log the error for Vercel logs
      console.error('API error:', err.message);
      res.status(500).json({ status: 'error', message: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}