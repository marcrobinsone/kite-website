(function() {
  var username,
    __slice = [].slice;

  __slice.call((document.getElementsByTagName('code'))).map(function(block) {
    return block.parentNode;
  }).filter(function(block) {
    return block.tagName.toLowerCase() === 'pre';
  }).forEach(hljs.highlightBlock);

  document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear();

  document.addEventListener('scroll', function() {
    var body, timer;
    timer = null;
    body = document.body;
    return body.style.backgroundPositionY = "" + (body.scrollTop / 2 - 100) + "px";
  });

  username = function() {
    return localStorage.username || (localStorage.username = (prompt('Please choose a username')).replace(/\//, ':'));
  };

}).call(this);
