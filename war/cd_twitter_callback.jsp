
<%@page import="twitter4j.auth.AccessToken"%>
<%@page import="twitter4j.TwitterFactory"%>
<%@page import="twitter4j.Twitter"%>
<%@page import="com.agilecrm.Globals"%>
<%@page import="org.scribe.builder.api.TwitterApi"%>
<%@page import="org.scribe.builder.ServiceBuilder"%>
<%@page import="org.scribe.oauth.OAuthService"%>
<%@page import="org.scribe.model.Verifier"%>
<%@page import="org.scribe.model.Token"%>
<%
	
Token requestToken = (Token) request.getSession().getAttribute("requestToken");

// Get OAuth Token and Verifier
String oAuthVerifier = request.getParameter("oauth_verifier");

// Builds a verifier
Verifier verifier = new Verifier(oAuthVerifier);

// Get Service
StringBuffer callbackURL = request.getRequestURL();
int index = callbackURL.lastIndexOf("/");
callbackURL.replace(index, callbackURL.length(), "").append("/cd_twitter_callback.jsp");
OAuthService service = new ServiceBuilder().provider(TwitterApi.class).callback(callbackURL.toString()).apiKey(Globals.TWITTER_API_KEY)
	.apiSecret(Globals.TWITTER_SECRET_KEY).build();

// Get Access Token
Token accessToken = service.getAccessToken(requestToken, verifier);

System.out.println(accessToken);

// Use Twitter4Java to get more details - screenname to show it to the user
 Twitter twitter = new TwitterFactory().getInstance();
twitter.setOAuthConsumer(Globals.TWITTER_API_KEY, Globals.TWITTER_SECRET_KEY);

AccessToken accessToken2 = new AccessToken(accessToken.getToken(), accessToken.getSecret());
twitter.setOAuthAccessToken(accessToken2);
	    

%>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Please Wait</title>

<script type="text/javascript" src="lib/jquery.min.js"></script>

<script type="text/javascript">

$(function()
{	 
	var token = "<%=accessToken.getToken()%>";
	var tokenSecret = "<%=accessToken.getSecret()%>";
	var account = "<%=twitter.getScreenName()%>";
		
	window.opener.popupTwitterCallback(token, tokenSecret, account);
	window.close();	
});


</script>

</head>


<body>

Please wait, <%=twitter.getScreenName()%>

</body>
</html>