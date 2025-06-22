import http from 'node:http';
import {cfg} from './config/index.js';
import {router} from './lib/router.js';

const {port} = cfg;

const server = http.createServer((req, res) => {
  try {
    router.handleRoute(req, res);
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.end(JSON.stringify({
    //     method: req.method, url: req.url
    // }));
  } catch (error) {
    console.error('Server error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
