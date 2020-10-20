function sum(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw TypeError("Not number");
  }

  return a + b;
}

module.exports = sum;
