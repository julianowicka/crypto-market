const express = require('express');
const path = require('path');
const https = require('https');
const { URL } = require('url');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const DEMO_KEY = process.env.COINGECKO_DEMO_API_KEY
const PRO_KEY = process.env.COINGECKO_PRO_API_KEY

app.use('/api', (req, res) => {
  const targetUrl = new URL(COINGECKO_BASE + req.url.replace(/^\/api/, ''))

  const options = {
    method: req.method,
    headers: {
      ...req.headers,
      host: targetUrl.host,
      origin: undefined,
      referer: undefined,
      'x-cg-demo-api-key': DEMO_KEY || undefined,
      'x-cg-pro-api-key': PRO_KEY || undefined,
    },
  }

  const proxyReq = https.request(targetUrl, options, (proxyRes) => {
    res.status(proxyRes.statusCode || 500)
    Object.entries(proxyRes.headers).forEach(([k, v]) => {
      if (k && v) res.setHeader(k, v)
    })
    proxyRes.pipe(res)
  })

  proxyReq.on('error', (err) => {
    console.error('Proxy error', err)
    res.status(500).json({ error: 'Proxy error' })
  })

  if (req.readable) req.pipe(proxyReq)
  else proxyReq.end()
})

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', function (req, res) {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is running on port: ', port);
});