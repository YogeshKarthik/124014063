const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    res.status(400).json({ error: 'No URLs provided in the query parameters.' });
    return;
  }

  const urlList = Array.isArray(urls) ? urls : [urls];
  const results = [];

  const promises = urlList.map(async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500 });

      if (response.status === 200 && response.data && Array.isArray(response.data.numbers)) {
        results.push(...response.data.numbers);
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
    }
  });

  await Promise.all(promises);

  const uniqueNumbers = Array.from(new Set(results)).sort((a, b) => a - b);

  res.json({ numbers: uniqueNumbers });
});

app.listen(port, () => {
  console.log(`Number Management Service listening at http://localhost:${port}`);
});
