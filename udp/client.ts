import { createSocket } from 'dgram';

const PORT = 3000;

// creating a client socket
const client = createSocket('udp4');

//buffer msg
const data = Buffer.from('test');

client.on('message', function (msg, info) {
  console.log('Data received from server : ' + msg.toString());
  console.log(
    'Received %d bytes from %s:%d\n',
    msg.length,
    info.address,
    info.port,
  );
});

//sending msg
client.send(data, PORT, 'localhost', function (error) {
  if (error) {
    client.close();
  }
});

const data1 = Buffer.from('hello');
const data2 = Buffer.from('world');

//sending multiple msg
client.send([data1, data2], PORT, 'localhost', function (error) {
  if (error) {
    client.close();
  }
});
