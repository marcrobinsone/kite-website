// create a client for the Kontrol service registry:
var kontrol = new Kontrol({
  url: 'ws://localhost:4000',
  auth: {
    type: "username",
    key: getUsername()
  }
});

// query for a math kite:
var kites = kontrol.fetchKites({
  username: 'devrim',
  environment: 'unknown',
  name: 'math',
  version: '1.0.0'
});

kites.then(function (kites) {
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
        "Your number:" + num + "\n" +
        "Its square:" + squared + "!!!"
      );
    })
    // if there is an error, show it to the user:
    .catch(alert)
    // clean up:
    .finally(function () {
      math.disconnect();
      kontrol.disconnect();
    })
  );
})
.then(function () {
  alert("Hooray! You ran your first RPC!");
});


