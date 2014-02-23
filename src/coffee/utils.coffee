window.KD =

  registerSingleton : ->
  log               : window.log   = console.log.bind     console
  warn              : window.warn  = console.warn.bind    console
  error             : window.error = console.error.bind   console
  config            :
    newkontrol      :
      url           : 'ws://127.0.0.1:4000/kontrol'
  getSessionToken   : -> KD.sessionToken
  utils             :
    idCounter       : 0
    createCounter   : createCounter = (i = 0) -> -> i++
    getUniqueId     : do (inc = createCounter()) -> -> "kd-#{do inc}"
    defer           : do (queue = []) ->
      # this was ported from browserify's implementation of "process.nextTick"
      if window?.postMessage and window.addEventListener
        window.addEventListener "message", ((ev) ->
          if ev.source is window and ev.data is "kd-tick"
            ev.stopPropagation()
            do queue.shift()  if queue.length > 0
        ), yes
        (fn) -> queue.push fn; window.postMessage "kd-tick", "*"
      else
        (fn) -> setTimeout fn, 1
    generateUID     : do ->

      letter = /[a-zA-Z]$/;
      vowel = /[aeiouAEIOU]$/;
      consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;

      (length = 10, memorable = yes, pattern = /\w/, prefix = '')->

        return prefix if prefix.length >= length
        {generateUID} = KD.utils
        if memorable
          pattern = if consonant.test(prefix) then vowel else consonant

        n   = (Math.floor(Math.random() * 100) % 94) + 33
        chr = String.fromCharCode(n)
        chr = chr.toLowerCase() if memorable

        unless pattern.test chr
          return generateUID length, memorable, pattern, prefix

        return generateUID length, memorable, pattern, "" + prefix + chr

KD.sessionToken = KD.utils.generateUID 6
noop  = ->

