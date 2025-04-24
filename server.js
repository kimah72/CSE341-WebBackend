const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Sarah Birch');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Running on port ${port}`);
});