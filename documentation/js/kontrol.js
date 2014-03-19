
var kontrol = new Kontrol({
  url: 'ws://localhost:4000',
  auth: {
    type: "username",
    key: prompt
  }
});

var kites = kontrol.fetchKites({
  username: 'devrim',
  environment: 'unknown',
  name: 'math',
  version: '1.0.0'
});

