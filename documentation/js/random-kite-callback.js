// query for math kites:
kontrol.fetchKites({
  username: 'demo-user',
  environment: 'unknown',
  name: 'math'
}, function (err, kites) {
  if (err) {
    handleError(err);
    teardown(kontrol);
    return;
  }
  // choose a random kite:
  var math = kites[Math.floor(Math.random() * kites.length)];
  // connect to it:
  math.connect();
  // get some input from the user, and cast it as a number:
  var num = getFavoriteNumber();
  // send a command to the math worker:
  math.tell('square', [num], function (err, squared) {
    if (err) {
      handleError(err);
      teardown(math, kontrol);
      return;
    }
    displayResult(num, squared);
    teardown(math, kontrol);
  });
});

function teardown() {
  for (var i = 0, len = arguments.length; i < len; i ++) {
    arguments[i].disconnect();
  }
}
