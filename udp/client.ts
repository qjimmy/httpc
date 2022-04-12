import { createSocket } from 'dgram';
import * as fs from 'fs';

const PORT = 3000;

// creating a client socket
const client = createSocket('udp4');

interface ConstructMessageOptions {
  type: PacketType;
  sequenceNumber: number;
  host: string;
  port: number;
  payload: any[];
}

enum PacketType {
  Data,
  ACK,
  SYN,
  SYNACK,
  NAK,
}

//buffer msg

const textFile = file2Bytes('test.txt');
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
function file2Bytes(filePath) {
  const fileData = fs.readFileSync(filePath).toString('hex');
  let result = [];
  for (var i = 0; i < fileData.length; i += 2)
    result.push('0x' + fileData[i] + '' + fileData[i + 1]);
  return result;
}

function constructMessage({
  type,
  sequenceNumber,
  host,
  port,
  payload,
}: ConstructMessageOptions) {
  return Buffer.from([
    type,
    ...numberTo4BytesArray(sequenceNumber),
    ...validateIpAddressTo4BytesArray(host),
    ...bigEndian(port),
    ...Buffer.from(payload),
  ]);
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

console.log(
  constructMessage({
    type: PacketType.Data,
    sequenceNumber: 1,
    host: '127.0.0.1',
    port: 8007,
    payload: textFile,
  }),
);

//sending msg
client.send(
  constructMessage({
    type: PacketType.Data,
    sequenceNumber: 1,
    host: '127.0.0.1',
    port: 8007,
    payload: textFile,
  }),
  PORT,
  '127.0.0.1',
  function (error) {
    if (error) {
      client.close();
    }
  },
);
