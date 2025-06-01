import fetch from 'node-fetch';
export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        // Forward the request body to your Apps Script Web App
        const response = await fetch('https://script.google.com/macros/s/AKfycbzdUboTdeHvwCNJp29e2khdwSgPxbHymYtQHeh4Nq0v87_eTX8EYhZ4x0J23GO8K9l6/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(200).json(data);
      } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }