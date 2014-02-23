class KDObject extends KDEventEmitter

  [NOTREADY, READY] = [0,1]

  utils: KD.utils

  constructor:(options = {}, data)->

    @id or= options.id or KD.utils.getUniqueId()
    @setOptions options
    @setData data  if data
    @setDelegate options.delegate if options.delegate
    @registerKDObjectInstance()

    super


    @on 'error', error
    @once 'ready', => @readyState = READY

  bound: (method)->
    throw new Error "@bound: unknown method! #{method}"  unless @[method]?
    boundMethod = "__bound__#{method}"
    boundMethod of this or Object.defineProperty(
      this, boundMethod, value: @[method].bind this
    )
    return @[boundMethod]

  lazyBound: (method, rest...)-> @[method].bind this, rest...

  forwardEvent: (target, eventName, prefix="") ->
    target.on eventName, @lazyBound 'emit', prefix + eventName

  forwardEvents: (target, eventNames, prefix="") ->
    @forwardEvent target, eventName, prefix  for eventName in eventNames

  ready:(listener)->
    if Promise?::nodeify
      new Promise (resolve) =>
        resolve() if @readyState is READY
        @once 'ready', resolve
      .nodeify listener
    else if @readyState is READY then @utils.defer listener
    else @once 'ready', listener


  getInstance:(instanceId)->

  registerKDObjectInstance:->

  setData:(@data)->

  getData:-> @data

  setOptions:(@options = {})->

  setOption:(option, value)-> @options[option] = value

  unsetOption:(option)-> delete @options[option] if @options[option]

  getOptions:-> @options
  getOption:(key)-> @options[key] ? null

  changeId:(id)-> @id = id

  getId:->@id

  setDelegate:(@delegate)->

  getDelegate:->@delegate

  destroy:->
    @isDestroyed = yes
    @emit 'KDObjectWillBeDestroyed'

  inheritanceChain:(options)->
    #need to detect () to know whether to call as function or get value as parameter
    methodArray = options.method.split "."
    options.callback
    proto = @__proto__
    chain = @
    chain = chain[method] for method in methodArray
    while proto = proto.__proto__
      newChain = proto
      newChain = newChain[method] for method in methodArray
      chain = options.callback chain:chain,newLink:newChain
    chain

  chainNames:(options)->
    options.chain
    options.newLink
    "#{options.chain}.#{options.newLink}"
