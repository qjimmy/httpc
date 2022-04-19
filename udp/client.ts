import { createSocket } from 'dgram';
import { constructMessage, file2Bytes, PacketType } from './utils';

const PORT = 3000;

// creating a client socket
const client = createSocket('udp4');

//buffer msg
const textFile = file2Bytes('test.txt');

//sequence number
const syn = 1;
const ACKcounter = 1;
let TCPconnection = false;

client.on('message', function (msg, info) {
  console.log(
    'Received %d bytes from %s:%d\n',
    msg.length,
    info.address,
    info.port,
  );

  console.log(msg.toString().slice(11));
  // if (
  //   !TCPconnection &&
  //   numberTo4BytesArray(syn).toString() == msg.toString().substring(0, 5)
  // ) {
  //   console.log('Server is live and matching SYNbit received');
  //   TCPconnection = true;
  //   client.send(
  //     ACKcounter.toString(),
  //     info.port,
  //     'localhost',
  //     function (error) {
  //       if (error) {
  //         client.close();
  //       }

  //       console.log('ACK sent');
  //       // constructmessage
  //       ACKcounter++;
  //       constructMessage({
  //         type: PacketType.Data,
  //         sequenceNumber: syn,
  //         host: '127.0.0.1',
  //         port: 8007,
  //         payload: textFile,
  //       }),
  //         PORT,
  //         '127.0.0.1',
  //         function (error) {
  //           if (error) {
  //             client.close();
  //           }
  //         };
  //       console.log(
  //         constructMessage({
  //           type: PacketType.Data,
  //           sequenceNumber: syn,
  //           host: '127.0.0.1',
  //           port: 8007,
  //           payload: textFile,
  //         }),
  //       );
  //     },
  //   );
  // } else if (
  //   TCPconnection &&
  //   numberTo4BytesArray(ACKcounter).toString() !==
  //     msg.toString().substring(0, 5)
  // ) {
  //   console.log('NACK received, retransmitting packet...');
  //   constructMessage({
  //     type: PacketType.Data,
  //     sequenceNumber: ACKcounter,
  //     host: '127.0.0.1',
  //     port: 8007,
  //     payload: textFile,
  //   }),
  //     PORT,
  //     '127.0.0.1',
  //     function (error) {
  //       if (error) {
  //         client.close();
  //       }
  //     };
  //   console.log(
  //     constructMessage({
  //       type: PacketType.Data,
  //       sequenceNumber: ACKcounter,
  //       host: '127.0.0.1',
  //       port: 8007,
  //       payload: textFile,
  //     }),
  //   );
  // }
});

//sending msg
// if (!TCPconnection) {
//   client.send(
//     constructMessage({
//       type: PacketType.Data,
//       sequenceNumber: ACKcounter,
//       host: '127.0.0.1',
//       port: 8007,
//       payload: 'Hello world!',
//     }),
//     PORT,
//     '127.0.0.1',
//     function (error) {
//       if (error) {
//         client.close();
//       }
//     },
//   );
// }

client.send(
  constructMessage({
    type: PacketType.Data,
    sequenceNumber: ACKcounter,
    host: '127.0.0.1',
    port: 8007,
    payload: 'POST /bob.txt HTTP/1.1\nHost: localhost\n\nHi',
  }),
  PORT,
  '127.0.0.1',
  function (error) {
    if (error) {
      client.close();
    }
  },
);

//emits after the socket is closed using socket.close();
client.on('close', function () {
  TCPconnection = false;
  console.log('Client Socket is closed !');
});
