![httpc workflow](https://github.com/qjimmy/httpc/actions/workflows/ci.yaml/badge.svg)

# httpc

Minimal CLI application using TCP sockets to send HTTP requests.

<br />

# COMP 445

<br />

<p align="center">Concordia University</p>
<p align="center">Computer Networking</p>
<p align="center">Lab assignment 1</p>
<p align="center">Winter 2022</p>

<br />

This CLI application is built as a submission to the COMP445 course at Concordia University.

Here are the expected arguments and options this CLI application expects:

```bash

$ httpc (get|post) [-v] (-h "k:v")* [-d inline-data] [-f file] URL

```

<br />

---

<br />

## Installation

<br />

Clone this repository and install its dependencies.

```bash
  $ yarn install
```

<br />

## Running the app locally

**To be able to run this locally, you need to have installed Node.js 14 or later.**

<br />

You must build the executable first. Transpile the Typescript code into Javascript with:

```bash
  $ yarn build
```

<br />

You can then run the CLI application locally using the Javascript executable file in the `dist` folder. For example:

```bash
  $ node dist/src/httpc.js get https://httpbin.org/get
```

<br />

---

## Using Docker 🐳

First, build the docker image for the executable using the Dockerfile provided.

```bash
  $ docker build -t httpc .
```

Next, run the docker image while passing specified CLI arguments. For example:

```bash
  $ docker run httpc get https://httpbin.org/get
```

By executing the CLI application as presented above can yield leftover unused docker containers. You can prevent this by appending the `--rm` option. For example:

```bash
  $ docker run --rm httpc get https://httpbin.org/get
```

<br />

---

<br />

## Unit Tests

<br />

Modules in this assignment are also covered as units of code.

```bash
$ yarn test
```

You can check the coverage with

```bash
$ yarn test:cov
```
