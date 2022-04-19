import * as fs from 'fs';

export interface ConstructMessageOptions {
  type: PacketType;
  sequenceNumber: number;
  host: string;
  port: number;
  payload: string;
}

export enum PacketType {
  Data,
  ACK,
  SYN,
  SYNACK,
  NAK,
}

/**
 * Example: 1 -> [0, 0, 0, 1];
 *
 */
export const numberTo4BytesArray = (num: number) => {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, num, false);
  return Buffer.from(arr);
};

export const string4BytesToNumber = (str: string) => {
  let result = 0;
  for (let i = 3; i >= 0; i--) {
    result += str.charCodeAt(3 - i) << (8 * i);
  }
  return result;
};

/**
 * example: '192.168.1.1' -> [192, 168, 1, 1];
 * throws error if not good format
 */
export const validateIpAddressTo4BytesArray = (host: string): Buffer => {
  const ipAddressValidation = new RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
  if (!ipAddressValidation.test(host)) {
    throw new Error('Must be a valid ip address');
  }

  const bytes = [...host.matchAll(/\d{1,3}/g)].map(([num]) =>
    parseInt(num, 10),
  );

  return Buffer.from([...bytes]);
};

export const bigEndian = (port: number): [number, number] => {
  const MAX = 256;
  return [Math.floor(port / MAX), port % MAX];
};

export const file2Bytes = (path): string => {
  return fs.readFileSync(path).toString();
};

export const constructMessage = ({
  type,
  sequenceNumber,
  host,
  port,
  payload,
}: ConstructMessageOptions) => {
  const payloadSize = Buffer.from(payload).length;

  if (payloadSize > 1013) {
    throw new Error(
      `Payload size too big: ${payloadSize} bytes. Exceeds maximum of 1013 bytes.`,
    );
  }

  return Buffer.from([
    ...Buffer.from(`${type}`),
    ...numberTo4BytesArray(sequenceNumber),
    ...validateIpAddressTo4BytesArray(host),
    ...bigEndian(port),
    ...Buffer.from(payload),
  ]);
};
