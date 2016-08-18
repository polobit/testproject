<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Wordpress Page</title>

<script type="text/javascript" src="https://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js"></script>

<script type="text/javascript">

  // CREATE A PUBNUB OBJECT
	Pubnub = PUBNUB.init({ 'publish_key' : 'pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274', 'subscribe_key' : 'sub-c-118f8482-92c3-11e2-9b69-12313f022c90',
		ssl : true, origin : 'pubsub.pubnub.com', });

	Pubnub.subscribe({ channel : getAgileChannelName(), restore : false, message : function(message, env, channel)
	{
		console.log(message);
	}});
		


  function getAgileChannelName(){
  	return document.location.hostname.replace(/\./g, '');
  }

  function openAgileRegisterPage(source) {
  	if(!source)
  		 source = "wordpress";

  	var windowURL = "https://my-dot-core-dot-agilecrmbeta.appspot.com/register?origin_from=" + source + "&domain_channel=" + getAgileChannelName();

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