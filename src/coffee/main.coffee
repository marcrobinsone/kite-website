wrapIife = (code) ->
  """
  void function () { #{ code } }();
  """

getCode = (block) ->
  (block.dataset?.deps ? "")
  .split ' '
  .map (dep) -> (document.getElementById dep)?.textContent ? ""
  .concat block.textContent
  .join "\n"

addRunButton = (block) ->
  code = wrapIife getCode block
  fn = Function code
  button = document.createElement 'button'
  button.textContent = 'run'
  button.onclick = fn
  block.parentNode.insertBefore button, block.nextSibling

# Highlight code blocks.
blocks = 
  [ (document.querySelectorAll 'pre > code')... ].map (el) -> el.parentNode

for block in blocks
  hljs.highlightBlock block
  
  addRunButton block  if block.classList.contains 'runnable'

# set time
document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear()

# Evil globals:

@getFavoriteNumber = ->
  fav = +prompt 'enter your favorite number'
  alert "That's not a number!"  unless fav is fav
  fav

@displayResult = (num, squared) ->
  alert "If you like #{ num }, you'll love #{ squared }!!!"

@handleError = (err) -> alert err
