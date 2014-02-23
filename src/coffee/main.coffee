do ->

  generateUID = do ->

    letter = /[a-zA-Z]$/;
    vowel = /[aeiouAEIOU]$/;
    consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;

    (length = 10, memorable = yes, pattern = /\w/, prefix = '')->

      return prefix if prefix.length >= length

      if memorable
        pattern = if consonant.test(prefix) then vowel else consonant

      n   = (Math.floor(Math.random() * 100) % 94) + 33
      chr = String.fromCharCode(n)
      chr = chr.toLowerCase() if memorable

      unless pattern.test chr
        return generateUID length, memorable, pattern, prefix

      return generateUID length, memorable, pattern, "" + prefix + chr


  # highlight code blocks
  blocks =
    download    : """
      $ brew install "https://kite-cli.s3.amazonaws.com/kite.rb"
      $ kite register
      $ kite install systeminfo
      $ kite run systeminfo
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
  download.innerHTML = "#{blocks.download} #{generateUID 6}"
  hljs.highlightBlock download

  # set time
  document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear()
