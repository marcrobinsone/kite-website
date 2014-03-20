
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="assets/favicon.ico">

    <title>Kites</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href='http://fonts.googleapis.com/css?family=Exo+2:400,100,200,300,100italic,200italic,300italic,600,600italic,400italic' rel='stylesheet' type='text/css'>
    <link href="css/jumbotron.css" rel="stylesheet">
    <link rel="stylesheet" href="http://yandex.st/highlightjs/8.0/styles/default.min.css">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron">
      <div class="container">
        <div class="row">
          <h1>Kites</h1>
          <h2>A Micro-Service Framework</h2>
          <p>
            A Kite is a micro-service communicating with other parties with Kite Protocol. Installed browser apps on koding.com talks with these Kites. For example, file tree in Develop tab talks with fs Kite.
            <h3>Demo: Connect to our kites:</h3>

            <%= codeSample('kontrol.js') %>

            <h3>Test for yourself</h3>

            <%= codeSample('install.sh') %>
          </p>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Example row of columns -->
      <div class="row">
        <h2>What can a Kite do?</h2>
        <p>A Kite can respond to requests and make requests to other Kites. The request may return a response or it may call a callback that is sent in the arguments of the request any time. The details are explained in Kite Protocol.</p>
      </div>
      <div class="row">
        <h2>What is Kite Protocol?</h2>
        <p>
          Kite Protocol is the subset of dnode protocol. Information about the dnode protocol can be found here. It is a JSON based protocol which allows us to build async-RPC and pub/sub mechanisms on top of it. Read and understand it first. Here are the differences in our protocol:
          <ul>
            <li>We do not use the initial <code>methods</code> exchange.</li>
            <li>We do not use the <code>links</code> field in the message.</li>
            <li>We always send 1 object in <code>arguments</code> field:
                <ul>
                  <li>The first one is options object, it is an object with 3 keys:
                    <ul>
                      <li><code>kite:</code> Information about the Kite that is making the request.</li>
                      <li><code>authentication:</code> Authentication information for this request.</li>
                      <li><code>withArgs:</code> This fields contains the arguments that will be passed to the method called. It may be a type of any valid JSON type.</li>
                      <li><code>responseCallback:</code> This is the optional response callback function. It may be omitted or passed as null. We remove the callback after we get the response to free memory because it will only be called once by the other side.</li>
                    </ul>
                  </li>
                </ul>
            </li>
            <li>Currently, we use WebSocket for transport layer. This may change in future. The path to connect on the server is "/dnode".          </li>
          </ul>
        </p>
      </div>
      <div class="row">
        <h2>What does a Kite Protocol message looks like?</h2>
        <p>This is a message for geting the list of kites from <em>Kontrol:</em></p>
        <p><small>Contents of <code>withArgs</code> are specific to <code>getKites</code> method and can be totally different for any other method.</small></p>

        <%= codeSample('protocol.json') %>
      </div>

      <hr>

      <footer>
        <p>&copy; <a href="koding.com" target="_blank">Koding, Inc.</a> <time>2014</time></p>
      </footer>
    </div> <!-- /container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="http://yandex.st/highlightjs/8.0/highlight.min.js"></script>
    <script src="bluebird.js"></script>
    <script src="kontrol.js"></script>
    <script src="main.js"></script>
  </body>
</html>
