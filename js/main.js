(function() {
  var addRunButton, block, blocks, getCode, getUsername, wrapIife, _i, _len,
    __slice = [].slice;

  wrapIife = function(code) {
    return "void function () { " + code + " }();";
  };

  getCode = function(block) {
    var _ref, _ref1;
    return ((_ref = (_ref1 = block.dataset) != null ? _ref1.deps : void 0) != null ? _ref : "").split(' ').map(function(dep) {
      var _ref, _ref1;
      return (_ref = (_ref1 = document.getElementById(dep)) != null ? _ref1.textContent : void 0) != null ? _ref : "";
    }).concat(block.textContent).join("\n");
  };

  addRunButton = function(block) {
    var button, code;
    code = getCode(block);
    button = document.createElement('button');
    button.textContent = 'run';
    button.onclick = function() {
      return eval(wrapIife(code));
    };
    return block.parentNode.insertBefore(button, block.nextSibling);
  };

  blocks = __slice.call((document.querySelectorAll('pre > code'))).map(function(el) {
    return el.parentNode;
  });

  for (_i = 0, _len = blocks.length; _i < _len; _i++) {
    block = blocks[_i];
    hljs.highlightBlock(block);
    if (block.classList.contains('runnable')) {
      addRunButton(block);
    }
  }

  document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear();

  getUsername = function() {
    var _ref;
    return localStorage.username != null ? localStorage.username : localStorage.username = ((_ref = prompt('Please choose a username')) != null ? _ref.replace(/\//, ':') : void 0) || 'anonymous';
  };

  this.getFavoriteNumber = function() {
    return +prompt('enter your favorite number');
  };

  this.displayResult = function(num, squared) {
    return alert('If you like ' + num + ", you'll love " + squared + '!!!');
  };

  this.handleError = function(err) {
    return alert(err);
  };

}).call(this);
