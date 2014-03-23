// query for math kites:
kontrol.fetchKites({
  username: 'demo-user',
  environment: 'unknown',
  name: 'math'
}, function (err, kites) {
  if (err) {
    handleError(err);
    kontrol.disconnect();
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
      Kite.disconnect(math, kontrol);
      return;
    }
    displayResult(num, squared);
    Kite.disconnect(math, kontrol);
  });
});