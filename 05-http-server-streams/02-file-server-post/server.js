const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const checkPathName = pathname.split('/');

  if (checkPathName.length > 1) {
    res.statusCode = 400;
    res.end("Nested file path");
    return;
  }


  const filepath = path.join(__dirname, 'files', pathname);

  const writeStream = fs.createWriteStream(filepath, { flags: "wx" });
  const limitStream = new LimitSizeStream({ limit: 1e6 })

  req.pipe(limitStream).pipe(writeStream);

  switch (req.method) {
    case 'POST':
      limitStream.on("error", err => {
        if (err.code === "LIMIT_EXCEEDED") {
          res.statusCode = 413;
          res.end("File is too big");

          fs.unlink(filepath, err => { });
          return;
        }

        res.statusCode = 500;
        res.end("Error occurred");

        fs.unlink(filepath, err => { });
      })

      writeStream
        .on("error", err => {
          if (err.code === "EEXIST") {
            res.statusCode = 409;
            res.end("File already exists");
            return;
          }

          res.statusCode = 500;
          res.end("Error occurred");

          fs.unlink(filepath, err => { });
        })
        .on("close", () => {
          res.statusCode = 201;
          res.end("OK")
        })

      res.on("close", () => {
        if (res.finished) return;
        fs.unlink(filepath, err => { });
      })
      // if (req.headers['content-length'] > 1e6) {
      //   res.statusCode = 413;
      //   res.end('File is too big!');
      //   return;

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
