const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', function (req, res) {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is running on port: ', port);
});