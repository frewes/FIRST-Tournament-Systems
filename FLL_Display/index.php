<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

    <title>Scheduler</title>
    <!-- Bootstrap core CSS -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap theme -->
    <link href="../css/bootstrap-theme.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="scheduler.css" rel="stylesheet">

</head>

<body>
    
<!-- Fixed navbar -->
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
        </div>
    </div>
</nav>

<div class="container">
    <div class="starter-template">
        <h1>FLL Display</h1>
        <p class="lead" id="words">Let's try and leech data off the server!</p>
        <input type="text" id="ip" value="10.11.16.222">
        <button class="btn btn-success btn-sm" onclick="test()">Try it!</button>      
    </div>
</div>

<div class="container">
    <div class="starter-template" id="results"></div>
</div>
    
</body>
    
<script src="display.js" type="text/javascript"></script>
<!-- JQUERY -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
</html>