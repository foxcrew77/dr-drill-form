const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzdUboTdeHvwCNJp29e2khdwSgPxbHymYtQHeh4Nq0v87_eTX8EYhZ4x0J23GO8K9l6/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: event.body
      });
      const data = await response.json();
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ status: 'error', message: err.message })
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
};