import * as fs from 'fs';

export interface ConstructMessageOptions {
  type: PacketType;
  sequenceNumber: number;
  host: string;
  port: number;
  payload: any[];
}

export enum PacketType {
  Data,
  ACK,
  SYN,
  SYNACK,
  NAK,
}

/**
 * example: 1 -> [0, 0, 0, 1];
 */
export const numberTo4BytesArray = (num: number) => {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, num, false);
  return Buffer.from(arr).toJSON().data;
};
/**
 * example: '192.168.1.1' -> [192, 168, 1, 1];
 * throws error if not good format
 */
export const validateIpAddressTo4BytesArray = (host: string): Array<number> => {
  const ipAddressValidation = new RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
  if (!ipAddressValidation.test(host)) {
    throw new Error('Must be a valid ip address');
  }

  return [...host.matchAll(/\d{1,3}/g)].map(([num]) => parseInt(num, 10));
};

export const bigEndian = (port: number): [number, number] => {
  const MAX = 256;
  return [Math.floor(port / MAX), port % MAX];
};
export const file2Bytes = (path) => {
  const file = fs.readFileSync(path).toString('hex');
  const bytes = [];
  for (let i = 0; i < file.length; i += 2)
    bytes.push('0x' + file[i] + '' + file[i + 1]);
  return bytes;
};

export const constructMessage = ({
  type,
  sequenceNumber,
  host,
  port,
  payload,
}: ConstructMessageOptions) => {
  return Buffer.from([
    type,
    ...numberTo4BytesArray(sequenceNumber),
    ...validateIpAddressTo4BytesArray(host),
    ...bigEndian(port),
    ...Buffer.from(payload),
  ]);
};
