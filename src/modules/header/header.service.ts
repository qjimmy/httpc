import { Injectable } from '@nestjs/common';
import { NEW_LINE } from 'src/constants';

@Injectable()
export class HeadersDict {
  private readonly EMPTY_STRING = '';

  constructor(private readonly headers: Map<string, string>) {
    this.headers.set('User-Agent', 'Concordia-HTTP/1.1');
  }

  parseHeader(headerField: string): [string, string] {
    const [key, value] = headerField.split(':');

    if (
      headerField.indexOf(':') === -1 ||
      headerField.match(new RegExp(/\:/, 'g')).length !== 1
    ) {
      throw new Error(
        'Badly formatted headers option. Value must contain exactly 1 colon',
      );
    }

    this.headers.set(key, value);
    return [key, value];
  }

  asHttpString(): string {
    return Object.entries(this.toJSON()).reduce((acc: string, [key, value]) => {
      return `${acc}${key}: ${value}${NEW_LINE}`;
    }, this.EMPTY_STRING);
  }

  toJSON(): Record<string, string> {
    return Object.fromEntries<string>(this.headers);
  }

  get(key: string): string {
    return this.headers.get(key);
  }

  set(key: string, value: string): void {
    this.headers.set(key, value);
  }
}
