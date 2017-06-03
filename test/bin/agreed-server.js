const assert = require('assert');
const plzPort = require('plz-port');
const cp = require('child_process');
const http = require('http');
const AssertStream = require('assert-stream');
const mustCall = require('must-call');

const path = './test/agreed.json';
plzPort().then((port) => {
  const proc = cp.exec(`node ${process.cwd()}/bin/agreed-server.js --port ${port} --path ${path}`);
  setTimeout(() => {
    const options = {
      host: 'localhost',
      method: 'GET',
      path: '/users/header/yosuke',
      port: port,
      headers: {
        'Content-Type': 'application/json',
        'x-jwt-token': 'testtesttest'
      }
    };
    http.get(options, mustCall((res) => {
      const assertStream = new AssertStream();
      assertStream.expect({
        message: 'hello yosuke'
      });
      res.pipe(assertStream);
      proc.kill();
    }));
  }, 1000);
});
