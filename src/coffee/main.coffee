# FIXME: until we have a properly factored bundle, expose the Kontrol.Kite as
#        a global:
window.Kite = window.Kontrol.Kite

wrap = (code) ->
  """
  void function () { #{ code } }();
  """

addRunButton = (block) ->
  code = block.textContent
  button = document.createElement 'button'
  button.textContent = 'run'
  button.onclick = -> eval wrap code
  block.parentNode.insertBefore button, block.nextSibling

# Highlight code blocks.
codeBlocks = [ (document.querySelectorAll 'pre > code')... ]
  .map (el) -> el.parentNode

codeBlocks.forEach (block) ->
  addRunButton block  if block.classList.contains 'language-js'
  hljs.highlightBlock block

# set time
document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear()

getUsername = ->
  localStorage.username ?=
    (prompt 'Please choose a username')?.replace(/\//, ':') or 'anonymous'
