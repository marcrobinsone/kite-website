(function() {
  (function() {
    var blocks, download, generateUID, kiteMessage;
    generateUID = (function() {
      var consonant, letter, vowel;
      letter = /[a-zA-Z]$/;
      vowel = /[aeiouAEIOU]$/;
      consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;
      return function(length, memorable, pattern, prefix) {
        var chr, n;
        if (length == null) {
          length = 10;
        }
        if (memorable == null) {
          memorable = true;
        }
        if (pattern == null) {
          pattern = /\w/;
        }
        if (prefix == null) {
          prefix = '';
        }
        if (prefix.length >= length) {
          return prefix;
        }
        if (memorable) {
          pattern = consonant.test(prefix) ? vowel : consonant;
        }
        n = (Math.floor(Math.random() * 100) % 94) + 33;
        chr = String.fromCharCode(n);
        if (memorable) {
          chr = chr.toLowerCase();
        }
        if (!pattern.test(chr)) {
          return generateUID(length, memorable, pattern, prefix);
        }
        return generateUID(length, memorable, pattern, "" + prefix + chr);
      };
    })();
    blocks = {
      download: "$ brew install \"https://kite-cli.s3.amazonaws.com/kite.rb\"\n$ kite register\n$ kite install systeminfo\n$ kite run systeminfo",
      kiteMessage: "{\n  \"arguments\":[\n    {\n      \"authentication\":{\n        \"key\":\"KpVmfxow4IJCQ3GiRXi3PWu2OMitnDhrLWTrm0TYMqSRwvFL0GQsKiouBL889Iu9\",\n        \"type\":\"kodingKey\"\n      },\n      \"kite\":{\n        \"environment\":\"development\",\n        \"hostname\":\"tardis.local\",\n        \"id\":\"d1a89409-079d-43fc-44d0-999a111c0915\",\n        \"name\":\"application\",\n        \"port\":\"52649\",\n        \"publicIP\":\"\",\n        \"region\":\"localhost\",\n        \"username\":\"devrim\",\n        \"version\":\"1\"\n      },\n      \"withArgs\":{\n        \"environment\":\"\",\n        \"hostname\":\"\",\n        \"id\":\"\",\n        \"name\":\"mathworker\",\n        \"region\":\"\",\n        \"username\":\"devrim\",\n        \"version\":\"\"\n      }\n    },\n    \"[Function]\"\n  ],\n  \"callbacks\":{\n    \"1\":[\n      \"1\"\n    ]\n  },\n  \"links\":[\n\n  ],\n  \"method\":\"getKites\"\n}"
    };
    kiteMessage = document.getElementById('kite-message');
    kiteMessage.innerHTML = blocks.kiteMessage;
    hljs.highlightBlock(kiteMessage);
    download = document.getElementById('download-instructions');
    download.innerHTML = "" + blocks.download + " " + (generateUID(6));
    hljs.highlightBlock(download);
    return document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear();
  })();

}).call(this);
