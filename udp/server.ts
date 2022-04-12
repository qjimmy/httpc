import { createSocket } from 'dgram';

// --------------------creating a udp server --------------------

// creating a udp server
const server = createSocket('udp4');

// emits when any error occurs
server.on('error', function (error) {
  console.log('Error: ' + error);
  server.close();
});

// emits on new datagram msg
server.on('message', function (msg, info) {
  console.log('Data received from client : ' + msg.toString());
  console.log(
    'Received %d bytes from %s:%d\n',
    msg.length,
    info.address,
    info.port,
  );

  //sending msg
  server.send(msg, info.port, 'localhost', function (error) {
    if (error) {
      server.close();
    }

    console.log('Server sent: ' + msg.toString());
  });
});

//emits when socket is ready and listening for datagram msgs
server.on('listening', function () {
  const { port, family, address } = server.address();
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + address);
  console.log('Server is IP4/IP6 : ' + family + '\n\n');
});

//emits after the socket is closed using socket.close();
server.on('close', function () {
  console.log('Socket is closed !');
});

server.bind(3000);
