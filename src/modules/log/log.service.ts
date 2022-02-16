import { Injectable } from '@nestjs/common';

@Injectable()
export class LogService {
  log(...args: Array<any>) {
    console.log(...args);
  }
}
