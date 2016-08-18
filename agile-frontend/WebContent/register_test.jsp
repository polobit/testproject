<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Wordpress Page</title>

<script type="text/javascript">

  function openAgileRegisterPage(source) {
  	if(!source)
  		 source = "wordpress";

  	var windowURL = "https://my-dot-core-dot-agilecrmbeta.appspot.com/register?origin_from=" + source;
  	var newwindow = window.open(windowURL,'name','height=310,width=500');
	if (window.focus)
	{
		newwindow.focus();
	}
  }

  function agileRegisterSuccessCallback(json){
  	console.log(json);
  }

</script>

</head>


<body>
	I am non Agile page 
	
	<input type="button" value="Register in Agile" onclick="openAgileRegisterPage('wordpress')">
</body>
</html>