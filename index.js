const trace = func => inputSource => (start, outputSink) => {
  if (start!== 0) return;
  inputSource(0, (t, d) => {
    if (t === 1) {
      func(d);
    }
    outputSink(t, d);
  });
};

module.exports = trace;
