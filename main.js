(function() {
  var addRunButton, codeBlocks, getUsername,
    __slice = [].slice;

  addRunButton = function(block) {
    var button, code;
    code = block.textContent;
    button = document.createElement('button');
    button.textContent = 'run';
    button.onclick = function() {
      return eval(code);
    };
    return block.parentNode.insertBefore(button, block.nextSibling);
  };

  codeBlocks = __slice.call((document.getElementsByTagName('code'))).map(function(el) {
    return el.parentNode;
  }).filter(function(el) {
    return el.tagName.toLowerCase() === 'pre';
  });

  codeBlocks.forEach(function(block) {
    if (block.classList.contains('js')) {
      addRunButton(block);
    }
    return hljs.highlightBlock(block);
  });

  document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear();

  document.addEventListener('scroll', function() {
    var body, timer;
    timer = null;
    body = document.body;
    return body.style.backgroundPositionY = "" + (body.scrollTop / 2 - 100) + "px";
  });

  getUsername = function() {
    var _ref;
    return localStorage.username != null ? localStorage.username : localStorage.username = ((_ref = prompt('Please choose a username')) != null ? _ref.replace(/\//, ':') : void 0) || 'anonymous';
  };

}).call(this);
