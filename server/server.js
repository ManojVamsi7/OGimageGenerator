const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/generate-og-image', async (req, res) => {
  const { title, content, imageUrl } = req.query;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });

  const htmlContent = `
    <html>
      <body>
        <div style="width: 1200px; height: 630px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background-color: #fff;">
          <h1>${title}</h1>
          <p>${content}</p>
          ${imageUrl ? `<img src="${imageUrl}" style="max-width: 100%; max-height: 400px;" />` : ''}
        </div>
      </body>
    </html>
  `;

  await page.setContent(htmlContent);
  const imageBuffer = await page.screenshot();
  await browser.close();

  res.set('Content-Type', 'image/png');
  res.send(imageBuffer);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
