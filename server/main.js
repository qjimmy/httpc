/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const net = require('net');
const yargs = require('yargs');

/**
 * TEST INPUTS
 *
 * GET / HTTP/1.1
 *
 * GET /bob.txt HTTP/1.1
 *
 * POST /some-file.js HTTP/1.1\n\n\nconsole.log('hello world');\n\n
 */

const argv = yargs
  .usage('node main.js [--port port] [--dir directory]')
  .default('dir', './')
  .default('port', 8007)
  .help('help').argv;

const basePath = './server/' + argv.dir;

const server = net.createServer(handleClient).on('error', (err) => {
  throw err;
});

server.listen({ port: argv.port }, () => {
  console.log('Echo server is listening at %j', server.address());
});

function parseHttpRequest(httpRequest) {
  // POST /bob HTTP/1.1\nHost: localhost\nContent-Length: 2\n\nHi I created this file\n\n
  const [metaRequest] = httpRequest.toString().split('\\n');
  const [method, path, version] = metaRequest.split(' ');
  const [headersString, body] = httpRequest
    .toString()
    .slice(metaRequest.length + 1)
    .split('\\n\\n');
  const headers = headersString.split('\n').reduce((acc, current) => {
    const [key, value] = current.replace(/ /g, '').split(':');
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
      return { ...acc, [key]: value };
    } else if (value.includes('.')) {
      return { ...acc, [key]: parseFloat(value) };
    } else {
      return { ...acc, [key]: intValue };
    }
  }, {});

  return {
    method,
    path:
      path && path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path,
    version,
    headers,
    body,
  };
}

function handleClient(socket) {
  console.log('New client form %j', socket.address());
  socket
    .on('data', (buf) => {
      // just echo what received
      const { method, path, body } = parseHttpRequest(buf);

      if (method === 'GET' && path === '/') {
        const listOfFiles = fs
          .readdirSync(basePath)
          .filter((file) => file !== 'main.js');
        socket.write(Buffer.from(JSON.stringify(listOfFiles)));
      } else if (method === 'GET' && path.match(/\/.+/).length > 0) {
        try {
          const numberOfDir = path.split('/').length - 1;
          if (numberOfDir > 1) {
            throw {
              statusCode: 401,
              message:
                'Access Denied. You do not have access to that directory.',
            };
          }
          const filePath = basePath + path;
          const fileContent = fs.readFileSync(filePath);
          socket.write(Buffer.from(fileContent));
        } catch (error) {
          socket.write(
            Buffer.from(
              JSON.stringify({
                statusCode: error?.status || 404,
                message: error?.message || 'No file found for ' + path,
              }),
            ),
          );
        }
      } else if (method === 'POST' && path.match(/\/.+/).length > 0) {
        console.log(path);
        fs.writeFileSync(basePath + path, body, {
          encoding: 'utf8',
          flag: 'w',
        });
        socket.write('Success!');
      }
    })
    .on('error', (err) => {
      console.log('socket error %j', err);
      socket.destroy();
    })
    .on('end', () => {
      socket.destroy();
    });
}
