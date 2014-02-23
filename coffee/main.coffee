do ->

  # highlight code blocks
  blocks =
    download    : """
      $ brew install "https://kite-cli.s3.amazonaws.com/kite.rb"
      $ kite register
      $ kite install systeminfo
      $ kite run systeminfo $USER_ID
      """
    kiteMessage : """
      {
        "arguments":[
          {
            "authentication":{
              "key":"KpVmfxow4IJCQ3GiRXi3PWu2OMitnDhrLWTrm0TYMqSRwvFL0GQsKiouBL889Iu9",
              "type":"kodingKey"
            },
            "kite":{
              "environment":"development",
              "hostname":"tardis.local",
              "id":"d1a89409-079d-43fc-44d0-999a111c0915",
              "name":"application",
              "port":"52649",
              "publicIP":"",
              "region":"localhost",
              "username":"devrim",
              "version":"1"
            },
            "withArgs":{
              "environment":"",
              "hostname":"",
              "id":"",
              "name":"mathworker",
              "region":"",
              "username":"devrim",
              "version":""
            }
          },
          "[Function]"
        ],
        "callbacks":{
          "1":[
            "1"
          ]
        },
        "links":[

        ],
        "method":"getKites"
      }
      """

  kiteMessage = document.getElementById 'kite-message'
  kiteMessage.innerHTML = blocks.kiteMessage
  hljs.highlightBlock kiteMessage

  download = document.getElementById 'download-instructions'
  download.innerHTML = blocks.download
  hljs.highlightBlock download

  # set time
  document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear()
