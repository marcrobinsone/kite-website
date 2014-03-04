(function() {
  var KDEventEmitter, KDObject, Kontrol, NewKite, createCounter, noop,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.KD = {
    registerSingleton: function() {},
    log: window.log = console.log.bind(console),
    warn: window.warn = console.warn.bind(console),
    error: window.error = console.error.bind(console),
    config: {
      newkontrol: {
        url: 'ws://127.0.0.1:4000/kontrol'
      }
    },
    getSessionToken: function() {
      return KD.sessionToken;
    },
    utils: {
      idCounter: 0,
      createCounter: createCounter = function(i) {
        if (i == null) {
          i = 0;
        }
        return function() {
          return i++;
        };
      },
      getUniqueId: (function(inc) {
        return function() {
          return "kd-" + (inc());
        };
      })(createCounter()),
      defer: (function(queue) {
        if ((typeof window !== "undefined" && window !== null ? window.postMessage : void 0) && window.addEventListener) {
          window.addEventListener("message", (function(ev) {
            if (ev.source === window && ev.data === "kd-tick") {
              ev.stopPropagation();
              if (queue.length > 0) {
                return queue.shift()();
              }
            }
          }), true);
          return function(fn) {
            queue.push(fn);
            return window.postMessage("kd-tick", "*");
          };
        } else {
          return function(fn) {
            return setTimeout(fn, 1);
          };
        }
      })([]),
      generateUID: (function() {
        var consonant, letter, vowel;
        letter = /[a-zA-Z]$/;
        vowel = /[aeiouAEIOU]$/;
        consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;
        return function(length, memorable, pattern, prefix) {
          var chr, generateUID, n;
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
          generateUID = KD.utils.generateUID;
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
      })(),
      throttle: function(func, wait) {
        var args, context, more, throttling, timeout, whenDone;
        context = args = timeout = throttling = more = null;
        whenDone = KD.utils.debounce((function() {
          return more = throttling = false;
        }), wait);
        return function() {
          var later;
          context = this;
          args = arguments;
          later = function() {
            timeout = null;
            if (more) {
              func.apply(context, args);
            }
            return whenDone();
          };
          if (!timeout) {
            timeout = setTimeout(later, wait);
          }
          if (throttling) {
            more = true;
          } else {
            func.apply(context, args);
          }
          whenDone();
          return throttling = true;
        };
      },
      debounce: function(func, wait) {
        var timeout;
        timeout = null;
        return function() {
          var args, context, later;
          context = this;
          args = arguments;
          later = function() {
            timeout = null;
            return func.apply(context, args);
          };
          clearTimeout(timeout);
          return timeout = setTimeout(later, wait);
        };
      }
    }
  };

  KD.sessionToken = KD.utils.generateUID(6);

  noop = function() {};

  KDEventEmitter = (function() {
    var _off, _on, _registerEvent, _unregisterEvent;

    KDEventEmitter.registerWildcardEmitter = function() {
      var prop, source, val, _results;
      source = this.Wildcard.prototype;
      _results = [];
      for (prop in source) {
        if (!__hasProp.call(source, prop)) continue;
        val = source[prop];
        if (prop !== 'constructor') {
          _results.push(this.prototype[prop] = val);
        }
      }
      return _results;
    };

    KDEventEmitter.registerStaticEmitter = function() {
      return this._e = {};
    };

    _registerEvent = function(registry, eventName, listener) {
      if (registry[eventName] == null) {
        registry[eventName] = [];
      }
      return registry[eventName].push(listener);
    };

    _unregisterEvent = function(registry, eventName, listener) {
      var cbIndex;
      if (!eventName || eventName === "*") {
        return registry = {};
      } else if (listener && registry[eventName]) {
        cbIndex = registry[eventName].indexOf(listener);
        if (cbIndex >= 0) {
          return registry[eventName].splice(cbIndex, 1);
        }
      } else {
        return registry[eventName] = [];
      }
    };

    _on = function(registry, eventName, listener) {
      var name, _i, _len, _results;
      if (eventName == null) {
        throw new Error('Try passing an event, genius!');
      }
      if (listener == null) {
        throw new Error('Try passing a listener, genius!');
      }
      if (Array.isArray(eventName)) {
        _results = [];
        for (_i = 0, _len = eventName.length; _i < _len; _i++) {
          name = eventName[_i];
          _results.push(_registerEvent(registry, name, listener));
        }
        return _results;
      } else {
        return _registerEvent(registry, eventName, listener);
      }
    };

    _off = function(registry, eventName, listener) {
      var name, _i, _len, _results;
      if (Array.isArray(eventName)) {
        _results = [];
        for (_i = 0, _len = eventName.length; _i < _len; _i++) {
          name = eventName[_i];
          _results.push(_unregisterEvent(registry, name, listener));
        }
        return _results;
      } else {
        return _unregisterEvent(registry, eventName, listener);
      }
    };

    KDEventEmitter.emit = function() {
      var args, eventName, listener, listeners, _base, _i, _len;
      if (this._e == null) {
        throw new Error('Static events are not enabled for this constructor.');
      }
      eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      listeners = (_base = this._e)[eventName] != null ? _base[eventName] : _base[eventName] = [];
      for (_i = 0, _len = listeners.length; _i < _len; _i++) {
        listener = listeners[_i];
        listener.apply(null, args);
      }
      return this;
    };

    KDEventEmitter.on = function(eventName, listener) {
      if ('function' !== typeof listener) {
        throw new Error('listener is not a function');
      }
      if (this._e == null) {
        throw new Error('Static events are not enabled for this constructor.');
      }
      this.emit('newListener', listener);
      _on(this._e, eventName, listener);
      return this;
    };

    KDEventEmitter.off = function(eventName, listener) {
      this.emit('listenerRemoved', eventName, listener);
      _off(this._e, eventName, listener);
      return this;
    };

    function KDEventEmitter(options) {
      var maxListeners;
      if (options == null) {
        options = {};
      }
      maxListeners = options.maxListeners;
      this._e = {};
      this._maxListeners = maxListeners > 0 ? maxListeners : 10;
    }

    KDEventEmitter.prototype.emit = function() {
      var args, eventName, listenerStack, _base;
      eventName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if ((_base = this._e)[eventName] == null) {
        _base[eventName] = [];
      }
      listenerStack = [];
      listenerStack = listenerStack.concat(this._e[eventName].slice(0));
      listenerStack.forEach((function(_this) {
        return function(listener) {
          return listener.apply(_this, args);
        };
      })(this));
      return this;
    };

    KDEventEmitter.prototype.on = function(eventName, listener) {
      if ('function' !== typeof listener) {
        throw new Error('listener is not a function');
      }
      this.emit('newListener', eventName, listener);
      _on(this._e, eventName, listener);
      return this;
    };

    KDEventEmitter.prototype.off = function(eventName, listener) {
      this.emit('listenerRemoved', eventName, listener);
      _off(this._e, eventName, listener);
      return this;
    };

    KDEventEmitter.prototype.once = function(eventName, listener) {
      var _listener;
      _listener = (function(_this) {
        return function() {
          var args;
          args = [].slice.call(arguments);
          _this.off(eventName, _listener);
          return listener.apply(_this, args);
        };
      })(this);
      this.on(eventName, _listener);
      return this;
    };

    return KDEventEmitter;

  })();

  KDEventEmitter.Wildcard = (function(_super) {
    var getAllListeners, listenerKey, removeAllListeners, wildcardKey;

    __extends(Wildcard, _super);

    wildcardKey = '*';

    listenerKey = '_listeners';

    function Wildcard(options) {
      if (options == null) {
        options = {};
      }
      Wildcard.__super__.constructor.apply(this, arguments);
      this._delim = options.delimiter || '.';
    }

    Wildcard.prototype.setMaxListeners = function(n) {
      return this._maxListeners = n;
    };

    getAllListeners = function(node, edges, i) {
      var listeners, nextNode, straight, wild;
      if (i == null) {
        i = 0;
      }
      listeners = [];
      if (i === edges.length) {
        straight = node[listenerKey];
      }
      wild = node[wildcardKey];
      nextNode = node[edges[i]];
      if (straight != null) {
        listeners = listeners.concat(straight);
      }
      if (wild != null) {
        listeners = listeners.concat(getAllListeners(wild, edges, i + 1));
      }
      if (nextNode != null) {
        listeners = listeners.concat(getAllListeners(nextNode, edges, i + 1));
      }
      return listeners;
    };

    removeAllListeners = function(node, edges, it, i) {
      var edge, listener, listeners, nextNode;
      if (i == null) {
        i = 0;
      }
      edge = edges[i];
      nextNode = node[edge];
      if (nextNode != null) {
        return removeAllListeners(nextNode, edges, it, i + 1);
      }
      if ((it != null) && ((listeners = node[listenerKey]) != null)) {
        node[listenerKey] = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = listeners.length; _i < _len; _i++) {
            listener = listeners[_i];
            if (listener !== it) {
              _results.push(listener);
            }
          }
          return _results;
        })();
      } else {
        node[listenerKey] = [];
      }
    };

    Wildcard.prototype.emit = function() {
      var eventName, listener, listeners, oldEvent, rest, _i, _len;
      eventName = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      "use strict";
      if (this.hasOwnProperty('event')) {
        oldEvent = this.event;
      }
      this.event = eventName;
      listeners = getAllListeners(this._e, eventName.split(this._delim));
      for (_i = 0, _len = listeners.length; _i < _len; _i++) {
        listener = listeners[_i];
        listener.apply(this, rest);
      }
      if (oldEvent != null) {
        this.event = oldEvent;
      } else {
        delete this.event;
      }
      return this;
    };

    Wildcard.prototype.off = function(eventName, listener) {
      removeAllListeners(this._e, (eventName != null ? eventName : '*').split(this._delim), listener);
      return this;
    };

    Wildcard.prototype.on = function(eventName, listener) {
      var edge, edges, listeners, node, _i, _len;
      if ('function' !== typeof listener) {
        throw new Error('listener is not a function');
      }
      this.emit('newListener', eventName, listener);
      edges = eventName.split('.');
      node = this._e;
      for (_i = 0, _len = edges.length; _i < _len; _i++) {
        edge = edges[_i];
        node = node[edge] != null ? node[edge] : node[edge] = {};
      }
      listeners = node[listenerKey] != null ? node[listenerKey] : node[listenerKey] = [];
      listeners.push(listener);
      return this;
    };

    return Wildcard;

  })(KDEventEmitter);

  KDObject = (function(_super) {
    var NOTREADY, READY, _ref;

    __extends(KDObject, _super);

    _ref = [0, 1], NOTREADY = _ref[0], READY = _ref[1];

    KDObject.prototype.utils = KD.utils;

    function KDObject(options, data) {
      if (options == null) {
        options = {};
      }
      this.id || (this.id = options.id || KD.utils.getUniqueId());
      this.setOptions(options);
      if (data) {
        this.setData(data);
      }
      if (options.delegate) {
        this.setDelegate(options.delegate);
      }
      this.registerKDObjectInstance();
      KDObject.__super__.constructor.apply(this, arguments);
      this.on('error', error);
      this.once('ready', (function(_this) {
        return function() {
          return _this.readyState = READY;
        };
      })(this));
    }

    KDObject.prototype.bound = function(method) {
      var boundMethod;
      if (this[method] == null) {
        throw new Error("@bound: unknown method! " + method);
      }
      boundMethod = "__bound__" + method;
      boundMethod in this || Object.defineProperty(this, boundMethod, {
        value: this[method].bind(this)
      });
      return this[boundMethod];
    };

    KDObject.prototype.lazyBound = function() {
      var method, rest, _ref1;
      method = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref1 = this[method]).bind.apply(_ref1, [this].concat(__slice.call(rest)));
    };

    KDObject.prototype.forwardEvent = function(target, eventName, prefix) {
      if (prefix == null) {
        prefix = "";
      }
      return target.on(eventName, this.lazyBound('emit', prefix + eventName));
    };

    KDObject.prototype.forwardEvents = function(target, eventNames, prefix) {
      var eventName, _i, _len, _results;
      if (prefix == null) {
        prefix = "";
      }
      _results = [];
      for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
        eventName = eventNames[_i];
        _results.push(this.forwardEvent(target, eventName, prefix));
      }
      return _results;
    };

    KDObject.prototype.ready = function(listener) {
      if (typeof Promise !== "undefined" && Promise !== null ? Promise.prototype.nodeify : void 0) {
        return new Promise((function(_this) {
          return function(resolve) {
            if (_this.readyState === READY) {
              resolve();
            }
            return _this.once('ready', resolve);
          };
        })(this)).nodeify(listener);
      } else if (this.readyState === READY) {
        return this.utils.defer(listener);
      } else {
        return this.once('ready', listener);
      }
    };

    KDObject.prototype.getInstance = function(instanceId) {};

    KDObject.prototype.registerKDObjectInstance = function() {};

    KDObject.prototype.setData = function(data) {
      this.data = data;
    };

    KDObject.prototype.getData = function() {
      return this.data;
    };

    KDObject.prototype.setOptions = function(options) {
      this.options = options != null ? options : {};
    };

    KDObject.prototype.setOption = function(option, value) {
      return this.options[option] = value;
    };

    KDObject.prototype.unsetOption = function(option) {
      if (this.options[option]) {
        return delete this.options[option];
      }
    };

    KDObject.prototype.getOptions = function() {
      return this.options;
    };

    KDObject.prototype.getOption = function(key) {
      var _ref1;
      return (_ref1 = this.options[key]) != null ? _ref1 : null;
    };

    KDObject.prototype.changeId = function(id) {
      return this.id = id;
    };

    KDObject.prototype.getId = function() {
      return this.id;
    };

    KDObject.prototype.setDelegate = function(delegate) {
      this.delegate = delegate;
    };

    KDObject.prototype.getDelegate = function() {
      return this.delegate;
    };

    KDObject.prototype.destroy = function() {
      this.isDestroyed = true;
      return this.emit('KDObjectWillBeDestroyed');
    };

    KDObject.prototype.inheritanceChain = function(options) {
      var chain, method, methodArray, newChain, proto, _i, _j, _len, _len1;
      methodArray = options.method.split(".");
      options.callback;
      proto = this.__proto__;
      chain = this;
      for (_i = 0, _len = methodArray.length; _i < _len; _i++) {
        method = methodArray[_i];
        chain = chain[method];
      }
      while (proto = proto.__proto__) {
        newChain = proto;
        for (_j = 0, _len1 = methodArray.length; _j < _len1; _j++) {
          method = methodArray[_j];
          newChain = newChain[method];
        }
        chain = options.callback({
          chain: chain,
          newLink: newChain
        });
      }
      return chain;
    };

    KDObject.prototype.chainNames = function(options) {
      options.chain;
      options.newLink;
      return "" + options.chain + "." + options.newLink;
    };

    return KDObject;

  })(KDEventEmitter);

  Kontrol = (function(_super) {
    __extends(Kontrol, _super);

    function Kontrol(options) {
      var authentication, kite;
      if (options == null) {
        options = {};
      }
      Kontrol.__super__.constructor.call(this, options);
      kite = {
        name: "kontrol",
        url: "" + KD.config.newkontrol.url
      };
      authentication = {
        type: "sessionID",
        key: KD.getSessionToken()
      };
      this.kite = new NewKite(kite, authentication);
      this.kite.connect();
    }

    Kontrol.prototype.getKites = function(query, callback) {
      if (query == null) {
        query = {};
      }
      if (callback == null) {
        callback = noop;
      }
      this._sanitizeQuery(query);
      return this.kite.tell("getKites", [query], (function(_this) {
        return function(err, kites) {
          var k;
          if (err) {
            return callback(err, null);
          }
          return callback(null, (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = kites.length; _i < _len; _i++) {
              k = kites[_i];
              _results.push(this._createKite(k));
            }
            return _results;
          }).call(_this));
        };
      })(this));
    };

    Kontrol.prototype.watchKites = function(query, callback) {
      var onEvent;
      if (query == null) {
        query = {};
      }
      if (!callback) {
        return warn("callback is not defined ");
      }
      this._sanitizeQuery(query);
      onEvent = (function(_this) {
        return function(options) {
          var e;
          e = options.withArgs[0];
          return callback(null, {
            action: e.action,
            kite: _this._createKite(e)
          });
        };
      })(this);
      return this.kite.tell("getKites", [query, onEvent], (function(_this) {
        return function(err, kites) {
          var kite, _i, _len, _results;
          if (err) {
            return callback(err, null);
          }
          _results = [];
          for (_i = 0, _len = kites.length; _i < _len; _i++) {
            kite = kites[_i];
            _results.push(callback(null, {
              action: _this.KiteAction.Register,
              kite: _this._createKite(kite)
            }));
          }
          return _results;
        };
      })(this));
    };

    Kontrol.prototype._createKite = function(k) {
      return new NewKite(k.kite, {
        type: "token",
        key: k.token
      });
    };

    Kontrol.prototype._sanitizeQuery = function(query) {
      if (!query.username) {
        query.username = "" + (KD.nick());
      }
      if (!query.environment) {
        return query.environment = "" + KD.config.environment;
      }
    };

    Kontrol.prototype.KiteAction = {
      Register: "REGISTER",
      Deregister: "DEREGISTER"
    };

    return Kontrol;

  })(KDObject);

  NewKite = (function(_super) {
    var CLOSED, NOTREADY, READY, apply, setAt, uniqueID, _ref;

    __extends(NewKite, _super);

    setAt = Bongo.JsPath.setAt;

    _ref = [0, 1, 3], NOTREADY = _ref[0], READY = _ref[1], CLOSED = _ref[2];

    uniqueID = Bongo.createId();

    function NewKite(kite, authentication, options) {
      if (options == null) {
        options = {};
      }
      NewKite.__super__.constructor.call(this, options);
      this.kite = kite;
      this.authentication = authentication;
      this.readyState = NOTREADY;
      this.autoReconnect = true;
      if (this.autoReconnect) {
        this.initBackoff(options);
      }
      this.handlers = {
        log: function(options) {
          log.apply(null, options.withArgs);
          return options.responseCallback({
            withArgs: [
              {
                error: null,
                result: null
              }
            ]
          });
        },
        alert: function(options) {
          alert.apply(null, options.withArgs);
          return options.responseCallback({
            withArgs: [
              {
                error: null,
                result: null
              }
            ]
          });
        }
      };
      this.proto = new Bongo.dnodeProtocol.Session(null, this.handlers);
      this.proto.on('request', (function(_this) {
        return function(req) {
          log("proto request", {
            req: req
          });
          return _this.ready(function() {
            return _this.ws.send(JSON.stringify(req));
          });
        };
      })(this));
      this.proto.on('fail', (function(_this) {
        return function(err) {
          return log("proto fail", {
            err: err
          });
        };
      })(this));
      this.proto.on('error', (function(_this) {
        return function(err) {
          return log("proto error", {
            err: err
          });
        };
      })(this));
      this.proto.on('remoteError', (function(_this) {
        return function(err) {
          return log("proto remoteEerror", {
            err: err
          });
        };
      })(this));
    }

    NewKite.prototype.connect = function() {
      var addr;
      addr = this.kite.url;
      log("Trying to connect to " + addr);
      this.ws = new WebSocket(addr);
      this.ws.onopen = this.bound('onOpen');
      this.ws.onclose = this.bound('onClose');
      this.ws.onmessage = this.bound('onMessage');
      return this.ws.onerror = this.bound('onError');
    };

    NewKite.prototype.disconnect = function(reconnect) {
      if (reconnect == null) {
        reconnect = true;
      }
      if (reconnect != null) {
        this.autoReconnect = !!reconnect;
      }
      return this.ws.close();
    };

    NewKite.prototype.tell = function(method, args, cb) {
      var options, scrubber, _ref1;
      if (!cb) {
        _ref1 = [[], args], args = _ref1[0], cb = _ref1[1];
      }
      if (!Array.isArray(args)) {
        args = [args];
      }
      options = {
        authentication: this.authentication,
        withArgs: args,
        responseCallback: cb,
        kite: {
          username: "" + (KD.nick()),
          environment: "" + KD.config.environment,
          name: "browser",
          version: "1.0." + KD.config.version,
          region: "browser",
          hostname: "browser",
          id: uniqueID
        }
      };
      scrubber = new Bongo.dnodeProtocol.Scrubber(this.proto.localStore);
      return scrubber.scrub([options], (function(_this) {
        return function() {
          var fn, id, scrubbed;
          scrubbed = scrubber.toDnodeProtocol();
          scrubbed.method = method;
          _this.proto.emit('request', scrubbed);
          if (cb) {
            id = Number(Object.keys(scrubbed.callbacks).last);
            fn = _this.proto.localStore.items[id];
            return _this.proto.localStore.items[id] = function() {
              var response;
              delete _this.proto.localStore.items[id];
              response = arguments[0];
              return fn.apply(null, [response.error, response.result]);
            };
          }
        };
      })(this));
    };

    NewKite.prototype.onOpen = function() {
      log("Connected to Kite: " + this.kite.name);
      this.clearBackoffTimeout();
      this.readyState = READY;
      this.emit('connected', this.name);
      return this.emit('ready');
    };

    NewKite.prototype.onClose = function(evt) {
      log("" + this.kite.name + ": disconnected, trying to reconnect...");
      this.readyState = CLOSED;
      this.emit('disconnected');
      if (this.autoReconnect) {
        return KD.utils.defer((function(_this) {
          return function() {
            return _this.setBackoffTimeout(_this.bound("connect"));
          };
        })(this));
      }
    };

    NewKite.prototype.onMessage = function(evt) {
      var args, data, getCallback, method, req;
      data = evt.data;
      log("onMessage", data);
      req = JSON.parse(data);
      getCallback = (function(_this) {
        return function(callbackId) {
          var cb;
          if (!_this.proto.remoteStore.has(callbackId)) {
            _this.proto.remoteStore.add(callbackId, function() {
              return _this.proto.request(callbackId, [].slice.call(arguments));
            });
          }
          cb = _this.proto.remoteStore.get(callbackId);
          return function() {
            var rest;
            rest = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return cb({
              withArgs: rest
            });
          };
        };
      })(this);
      args = req["arguments"] || [];
      Object.keys(req.callbacks || {}).forEach(function(strId) {
        var callback, id, path;
        id = parseInt(strId, 10);
        path = req.callbacks[id];
        callback = getCallback(id);
        callback.id = id;
        return setAt(args, path, callback);
      });
      method = req.method;
      switch (method) {
        case 'methods':
          return this.proto.handleMethods(args[0]);
        case 'error':
          return this.proto.emit('remoteError', args[0]);
        case 'cull':
          return args.forEach((function(_this) {
            return function(id) {
              return _this.proto.remoteStore.cull(id);
            };
          })(this));
        default:
          switch (typeof method) {
            case 'string':
              if (this.proto.instance.propertyIsEnumerable(method)) {
                return apply(this.proto.instance[method], this.proto.instance, args);
              } else {
                return this.proto.emit('error', new Error("Request for non-enumerable method: " + method));
              }
              break;
            case 'number':
              return apply(this.proto.localStore.get(method), this.proto.instance, args[0].withArgs);
          }
      }
    };

    apply = function(fn, ctx, args) {
      return fn.apply(ctx, args);
    };

    NewKite.prototype.onError = function(evt) {
      return log("" + this.kite.name + " error: " + evt.data);
    };

    NewKite.prototype.initBackoff = function(options) {
      var backoff, initalDelayMs, maxDelayMs, maxReconnectAttempts, multiplyFactor, totalReconnectAttempts, _ref1, _ref2, _ref3, _ref4, _ref5;
      backoff = (_ref1 = options.backoff) != null ? _ref1 : {};
      totalReconnectAttempts = 0;
      initalDelayMs = (_ref2 = backoff.initialDelayMs) != null ? _ref2 : 700;
      multiplyFactor = (_ref3 = backoff.multiplyFactor) != null ? _ref3 : 1.4;
      maxDelayMs = (_ref4 = backoff.maxDelayMs) != null ? _ref4 : 1000 * 15;
      maxReconnectAttempts = (_ref5 = backoff.maxReconnectAttempts) != null ? _ref5 : 50;
      this.clearBackoffTimeout = function() {
        return totalReconnectAttempts = 0;
      };
      return this.setBackoffTimeout = (function(_this) {
        return function(fn) {
          var timeout;
          if (totalReconnectAttempts < maxReconnectAttempts) {
            timeout = Math.min(initalDelayMs * Math.pow(multiplyFactor, totalReconnectAttempts), maxDelayMs);
            setTimeout(fn, timeout);
            return totalReconnectAttempts++;
          } else {
            return _this.emit("connectionFailed");
          }
        };
      })(this);
    };

    NewKite.prototype.ready = function(cb) {
      if (this.readyState) {
        return KD.utils.defer(cb);
      }
      return this.once('ready', cb);
    };

    return NewKite;

  })(KDObject);

  (function() {
    var blocks, download, kiteMessage;
    blocks = {
      download: "$ brew install \"https://kite-cli.s3.amazonaws.com/kite.rb\"\n// or, for linux:\n// $ wget https://kite-cli.s3.amazonaws.com/kite-latest-linux.deb\n// $ sudo dpkg -i kite-latest-linux.deb\n$ kite register\n$ kite install systeminfo\n$ kite run systeminfo",
      kiteMessage: "{\n  \"arguments\":[\n    {\n      \"authentication\":{\n        \"key\":\"KpVmfxow4IJCQ3GiRXi3PWu2OMitnDhrLWTrm0TYMqSRwvFL0GQsKiouBL889Iu9\",\n        \"type\":\"kodingKey\"\n      },\n      \"kite\":{\n        \"environment\":\"development\",\n        \"hostname\":\"tardis.local\",\n        \"id\":\"d1a89409-079d-43fc-44d0-999a111c0915\",\n        \"name\":\"application\",\n        \"port\":\"52649\",\n        \"publicIP\":\"\",\n        \"region\":\"localhost\",\n        \"username\":\"devrim\",\n        \"version\":\"1\"\n      },\n      \"withArgs\":{\n        \"environment\":\"\",\n        \"hostname\":\"\",\n        \"id\":\"\",\n        \"name\":\"mathworker\",\n        \"region\":\"\",\n        \"username\":\"devrim\",\n        \"version\":\"\"\n      }\n    },\n    \"[Function]\"\n  ],\n  \"callbacks\":{\n    \"1\":[\n      \"1\"\n    ]\n  },\n  \"links\":[\n\n  ],\n  \"method\":\"getKites\"\n}"
    };
    kiteMessage = document.getElementById('kite-message');
    kiteMessage.innerHTML = blocks.kiteMessage;
    hljs.highlightBlock(kiteMessage);
    download = document.getElementById('download-instructions');
    download.innerHTML = "" + blocks.download + " " + (KD.getSessionToken());
    hljs.highlightBlock(download);
    document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear();
    return document.addEventListener('scroll', function() {
      var body, timer;
      timer = null;
      body = document.body;
      return body.style.backgroundPositionY = "" + (body.scrollTop / 2 - 100) + "px";
    });
  })();

  window.KDObject = KDObject;

  window.KDEventEmitter = KDEventEmitter;

  window.NewKite = NewKite;

  window.Kontrol = Kontrol;

}).call(this);
