const stream = require("stream");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._limit = options.limit;
    this._length = 0;
  }

  _transform(chunk, encoding, callback) {
    this._length += chunk.length;

    if (this._length > this._limit) {
      return callback(new LimitExceededError());
    }

    return callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
