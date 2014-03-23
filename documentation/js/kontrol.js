// require the Kontrol library:
var Kontrol = require('kontrol');
// create a client for the Kontrol service registry:
var kontrol = new Kontrol({
  url: 'ws://kite-kontrol.koding.com',
  auth: {
    type: 'username',
    key: 'demo-user'
  }
});
