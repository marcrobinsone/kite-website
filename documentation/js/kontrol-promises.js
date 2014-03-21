// create a client for the Kontrol service registry:
var kontrol = new Kontrol({
  url: 'ws://kite-kontrol.koding.com',
  auth: {
    type: 'username',
    key: 'demo-user'
  }
});

// query for math kites:
kontrol.fetchKites({
  username: 'demo-user',
  environment: 'unknown',
  name: 'math'
})

.then(function (kites) {
  // choose a random kite:
  var math = kites[Math.floor(Math.random() * kites.length)];
  // connect to it:
  math.connect();
  // get some input from the user, and cast it as a number:
  var num = getFavoriteNumber();
  return (
    // send a command to the math worker:
    math.tell('square', [num]).then(function (squared) {
      displayResult(num, squared);
    })
    // tear down the math worker:
    .finally(function () {
      math.disconnect();
    })
  );
})
.catch(handleError)
// tear down kontrol:
.finally(function () {
  kontrol.disconnect();
});
