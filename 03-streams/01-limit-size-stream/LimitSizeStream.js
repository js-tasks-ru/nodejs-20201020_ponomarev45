const stream = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.length = 0;
  }

  _transform(chunk, encoding, callback) {
    this.length += chunk.length;
    if (this.length > this.limit) {
      return callback(new LimitExceededError());
    } else {
      return callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
