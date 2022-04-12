import { createSocket } from 'dgram';

const PORT = 3000;

// creating a client socket
const client = createSocket('udp4');

interface ConstructMessageOptions {
  type: PacketType;
  sequenceNumber: number;
  host: string;
  port: number;
  payload: string;
}

enum PacketType {
  Data,
  ACK,
  SYN,
  SYNACK,
  NAK,
}

//buffer msg
const data = Buffer.from([
  0, 0, 0, 0, 1, 127, 0, 0, 1, 31, 71, 72, 105, 32, 83,
]);

/**
 * example: 1 -> [0, 0, 0, 1];
 */
function numberTo4BytesArray(num: number) {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, num, false);
  return Buffer.from(arr).toJSON().data;
}

/**
 * example: '192.168.1.1' -> [192, 168, 1, 1];
 * throws error if not good format
 */
function validateIpAddressTo4BytesArray(host: string): Array<number> {
  const ipAddressValidation = new RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
  if (!ipAddressValidation.test(host)) {
    throw new Error('Must be a valid ip address');
  }

  return [...host.matchAll(/\d{1,3}/g)].map(([num]) => parseInt(num, 10));
}

function bigEndian(port: number): [number, number] {
  const MAX = 256;
  return [Math.floor(port / MAX), port % MAX];
}

function constructMessage({
  type,
  sequenceNumber,
  host,
  port,
  payload,
}: ConstructMessageOptions) {
  return [
    type,
    ...numberTo4BytesArray(sequenceNumber),
    ...validateIpAddressTo4BytesArray(host),
    ...bigEndian(port),
  ];
}

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
