const http = require('http');
const Koa = require('koa');
const SocketIO = require('socket.io')
const serveStatic = require('koa-static');
const morgan = require('koa-morgan');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const server = http.createServer(app.callback());
const io = SocketIO(server);

app.use(morgan('combined'));
app.use(bodyParser());
app.use(serveStatic('public'));

let responseStatus = 200;
let responseHeaders = {};
let responseType = 'text/plain';
let responseBody = 'ok';
app.use(async ({request, response}) => {
  if (request.url.startsWith('/api/callback')) {
    io.emit('callback', {
      type: request.type,
      timestamp: new Date(),
      method: request.method,
      url: request.originalUrl,
      query: request.query,
      rawBody: request.rawBody,
      body: request.body,
      headers: request.headers,
    });
    response.status = responseStatus;
    response.set(responseHeaders);
    response.type = responseType;
    response.body = responseBody;
  } else if (request.url === '/api/response') {
    if (request.method === 'PUT') {
      responseStatus = request.body.status;
      responseHeaders = {};
      if (request.body.headers) {
        const pairs = request.body.headers
          .split('\n')
          .map(l => l.split(':').map(s => s.trim()));
        for (let [name, value] of pairs) {
          responseHeaders[name] = value;
        }
      }
      responseType = request.body.type;
      responseBody = request.body.body;
      response.body = 'ok';
    } else if (request.method === 'GET') {
      response.type = 'application/json';
      let headers = [];
      for (let name in responseHeaders) {
        headers.push(`${name}: ${responseHeaders[name]}`);
      }
      response.body = JSON.stringify({
        status: responseStatus,
        headers: headers.join('\n'),
        type: responseType,
        body: responseBody
      });
    }
  }
});


const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

server.listen({port, host}, () => console.log(`listening on http://${host}:${port}`));
