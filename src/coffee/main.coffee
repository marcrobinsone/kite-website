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

codeBlocks.forEach (block) ->
  addRunButton block  if block.classList.contains 'js'
  hljs.highlightBlock block

# set time
document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear()

#bg animation
document.addEventListener 'scroll', ->
  timer  = null
  {body} = document
  body.style.backgroundPositionY = "#{body.scrollTop / 2 - 100}px"

getUsername = ->
  localStorage.username ?=
    (prompt 'Please choose a username')?.replace(/\//, ':') or 'anonymous'
