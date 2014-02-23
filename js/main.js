(function() {
  (function() {
    var blocks, download, kiteMessage;
    blocks = {
      download: "$ brew install \"https://kite-cli.s3.amazonaws.com/kite.rb\"\n$ kite register\n$ kite install systeminfo\n$ kite run systeminfo $USER_ID",
      kiteMessage: "{\n  \"arguments\":[\n    {\n      \"authentication\":{\n        \"key\":\"KpVmfxow4IJCQ3GiRXi3PWu2OMitnDhrLWTrm0TYMqSRwvFL0GQsKiouBL889Iu9\",\n        \"type\":\"kodingKey\"\n      },\n      \"kite\":{\n        \"environment\":\"development\",\n        \"hostname\":\"tardis.local\",\n        \"id\":\"d1a89409-079d-43fc-44d0-999a111c0915\",\n        \"name\":\"application\",\n        \"port\":\"52649\",\n        \"publicIP\":\"\",\n        \"region\":\"localhost\",\n        \"username\":\"devrim\",\n        \"version\":\"1\"\n      },\n      \"withArgs\":{\n        \"environment\":\"\",\n        \"hostname\":\"\",\n        \"id\":\"\",\n        \"name\":\"mathworker\",\n        \"region\":\"\",\n        \"username\":\"devrim\",\n        \"version\":\"\"\n      }\n    },\n    \"[Function]\"\n  ],\n  \"callbacks\":{\n    \"1\":[\n      \"1\"\n    ]\n  },\n  \"links\":[\n\n  ],\n  \"method\":\"getKites\"\n}"
    };
    kiteMessage = document.getElementById('kite-message');
    kiteMessage.innerHTML = blocks.kiteMessage;
    hljs.highlightBlock(kiteMessage);
    download = document.getElementById('download-instructions');
    download.innerHTML = blocks.download;
    hljs.highlightBlock(download);
    return document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear();
  })();

}).call(this);
