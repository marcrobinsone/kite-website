wrapIife = (code) ->
  """
  void function () { #{ code } }();
  """

addRunButton = (block) ->
  code = block.textContent
  button = document.createElement 'button'
  button.textContent = 'run'
  button.onclick = -> eval wrapIife code
  block.parentNode.insertBefore button, block.nextSibling

# Highlight code blocks.
blocks = 
  [ (document.querySelectorAll 'pre > code')... ].map (el) -> el.parentNode

for block in blocks
  hljs.highlightBlock block
  
  # if it's js, offer to run it:
  addRunButton block  if block.classList.contains 'language-js'

# set time
document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear()

getUsername = ->
  localStorage.username ?=
    (prompt 'Please choose a username')?.replace(/\//, ':') or 'anonymous'

# Evil globals:

@getFavoriteNumber = -> +prompt 'enter your favorite number'

@displayResult = (num, squared) ->
  alert 'If you like ' + num + ", you'll love " + squared + '!!!'

@handleError = (err) -> alert err

# FIXME: until we have a properly factored bundle, expose the Kontrol.Kite as a global.
@Kite = Kontrol.Kite



