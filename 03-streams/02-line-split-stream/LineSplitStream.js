const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._data = "";
  }

  _transform(chunk, encoding, callback) {
    const str = this._data + chunk.toString();
    const lines = str.split(os.EOL);
    const last = lines.pop();
    this._data = "";

    for (const line of lines) {
      this.push(line);
    }

    if (str.endsWith(os.EOL)) {
      this.push(last);
    } else {
      this._data = last;
    }

    callback();
  }

  _flush(callback) {
    if (this._data) {
      this.push(this._data);
    }

    callback();
  }
}

module.exports = LineSplitStream;
