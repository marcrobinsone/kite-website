# Highlight code blocks.
[ (document.getElementsByTagName 'code')... ]
  .map (block) ->
    block.parentNode
  .filter (block) ->
    # only highlight code blocks inside of "<pre>" elements
    block.tagName.toLowerCase() is 'pre'
  .forEach hljs.highlightBlock

# set time
document.getElementsByTagName('time')[0].innerHTML = (new Date).getFullYear()

#bg animation
document.addEventListener 'scroll', ->
  timer  = null
  {body} = document
  body.style.backgroundPositionY = "#{body.scrollTop / 2 - 100}px"

username = ->
  localStorage.username or=
    (prompt 'Please choose a username').replace /\//, ':'
