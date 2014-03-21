// create a client for the Kontrol service registry:
var kontrol = new Kontrol({
  url: 'ws://kite-kontrol.koding.com',
  auth: {
    type: 'username',
    key: 'demo-user'
  }
});

// query for a math kite:
var kites = kontrol.fetchKites({
  username: 'demo-user',
  environment: 'unknown',
  name: 'math'
});

kites.then(function (kites) {
  if (!(kites && kites.length)) {
    throw new Error("No kites found!");
  }
  // choose a random kite:
  var i = Math.floor(Math.random() * kites.length);
  var math = kites[i];
  // connect to it:
  math.connect();
  // get some input from the user, and cast it as a number:
  var num = +prompt('enter your favorite number');
  return (
    // send a command to the kite:
    math.tell('square', [num])
    // when the response arrives, show it to the user:
    .then(function (squared) {
      alert(
        'Your number:' + num + '\n' +
        'Its square:' + squared + '!!!'
      );
    })
    // if there is an error, show it to the user:
    .catch(alert)
    // tear down the math worker:
    .finally(function () {
      math.disconnect();
    })
  );
})
// tear down kontrol:
.finally(function () {
  kontrol.disconnect();
})
.then(function () {
  alert('Hooray! You ran your first RPC!');
});
