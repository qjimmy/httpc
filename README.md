# httpc

Minimal CLI application using TCP sockets to send HTTP requests.

## COMP 445

Concordia University <br />
Computer Networking <br />
Lab assignment 1 <br />
Winter 2022

## Installation

```bash
$ yarn install
```

## Running the app

```bash

$ yarn build

$ node ./dist/httpc (get|post) [-v] (-h "k:v")* [-d inline-data] [-f file] URL

```

Example:

```bash

$ yarn build

$ node ./dist/httpc get www.google.com

```

## Test

```bash
$ yarn test

$ yarn test:e2e

$ yarn test:cov
```

## License

[MIT licensed](LICENSE).
