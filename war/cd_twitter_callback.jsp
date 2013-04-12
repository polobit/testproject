<%@page import="twitter4j.User"%>
<%@page import="twitter4j.auth.AccessToken"%>
<%@page import="twitter4j.auth.RequestToken"%>
<%@page import="twitter4j.TwitterFactory"%>
<%@page import="twitter4j.Twitter"%>
<%
	// Constants
	final String CONSUMER_KEY = "Q8jLaFvEhdE3kRTgUpMw";
	final String CONSUMER_SECRET = "vfsi8O6nXsKh4jhTpJlS003OULo4KcuBnek5eWpgfCQ";

	Twitter twitter = new TwitterFactory().getInstance();
	twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);
	
	String token = (String) session.getAttribute("token");
	String tokenSecret = (String) session.getAttribute("tokenSecret");
	
	if(token == null || tokenSecret == null)
	{
		out.println("Session is invalid. Please try again.");
		return;
	}
	else
	{
		System.out.println("Token: " + token + " Secret: " + tokenSecret);
	}
	
	
	AccessToken accessToken = twitter.getOAuthAccessToken(new RequestToken(token, tokenSecret));
	System.out.println("In call back " + accessToken.getToken() + " " + accessToken.getTokenSecret());
	
	
	System.out.println(accessToken);
	
	twitter.setOAuthAccessToken(accessToken);
	
	//out.println(accessToken.getScreenName());
	
	//out.println(user.getName());
%>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Please Wait</title>
<style type="text/css" media="all">
@import url("css/style.css");

@import url("css/jquery.wysiwyg.css");

@import url("css/facebox.css");

@import url("css/visualize.css");

@import url("css/date_input.css");
</style>

<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=7" /><![endif]-->
<!--[if lt IE 8]><style type="text/css" media="all">@import url("css/ie.css");</style><![endif]-->
<!--[if IE]><script type="text/javascript" src="js/excanvas.js"></script><![endif]-->

<script type="text/javascript" src="lib/jquery.min.js"></script>


<script type="text/javascript">

$(function()
{
		 
	var token = "<%=accessToken.getToken()%>";
	var tokenSecret = "<%=accessToken.getTokenSecret()%>";
	var account = "<%=twitter.getScreenName()%>";
	
	window.opener.popupTwitterCallback(token, tokenSecret, account);
	window.close();	
});


</script>

</head>


<body>

Please wait <%out.println(accessToken.getScreenName()); %>

</body>
</html>