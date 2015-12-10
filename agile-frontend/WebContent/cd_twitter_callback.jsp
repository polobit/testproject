<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="twitter4j.auth.AccessToken"%>
<%@page import="twitter4j.TwitterFactory"%>
<%@page import="twitter4j.Twitter"%>
<%@page import="twitter4j.User"%>
<%@page import="com.agilecrm.Globals"%>
<%@page import="org.scribe.builder.api.TwitterApi"%>
<%@page import="org.scribe.builder.ServiceBuilder"%>
<%@page import="org.scribe.oauth.OAuthService"%>
<%@page import="org.scribe.model.Verifier"%>
<%@page import="org.scribe.model.Token"%>
<%
String deniedParam  = request.getParameter("denied");
if(StringUtils.isNotBlank(deniedParam)){
    out.println("You may <a href='#' onclick='window.close();return false;'>close this window</a> and continue browsing AgileCRM Dashboard. Note that Twitter server is not responding right now, Please try again after some time.Seems something went wrong.");
    return;
}
	
//Get Access Token
Token accessToken = null; Twitter twitter = null; User user = null;

try{

Token requestToken = (Token) request.getSession().getAttribute("requestToken");

// Get OAuth Token and Verifier
String oAuthVerifier = request.getParameter("oauth_verifier");

// Builds a verifier
Verifier verifier = new Verifier(oAuthVerifier);

// Get Service
StringBuffer callbackURL = request.getRequestURL();
int index = callbackURL.lastIndexOf("/");
callbackURL.replace(index, callbackURL.length(), "").append("/cd_twitter_callback.jsp");
OAuthService service = new ServiceBuilder().provider(TwitterApi.SSL.class).callback(callbackURL.toString()).apiKey(Globals.TWITTER_API_KEY)
	.apiSecret(Globals.TWITTER_SECRET_KEY).build();

// Get Access Token
accessToken = service.getAccessToken(requestToken, verifier);

System.out.println("accessToken : ");
System.out.println(accessToken);

// Use Twitter4Java to get more details - screenname to show it to the user
twitter = new TwitterFactory().getInstance();

twitter.setOAuthConsumer(Globals.TWITTER_API_KEY, Globals.TWITTER_SECRET_KEY);

AccessToken accessToken2 = new AccessToken(accessToken.getToken(), accessToken.getSecret());
twitter.setOAuthAccessToken(accessToken2);
	    
//Fetches User from Twitter
user = twitter.showUser(twitter.getId());
}catch(Exception e){
	   System.out.println(accessToken);
	   System.out.println("Some error occured : " + e.getMessage());
	   out.println("<div style='text-align: center;font-size: large;'>Oops.. Twitter says you are too fast for it to serve you. Please try again after few minutes. <br><button class=\"btn\" style='font-size: initial;' onclick='window.close();return false;'>Close</button></div>");	   
	   return;
}
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
	
	// Fetches profile image url
	var profileImgUrl = "<%=user.getOriginalProfileImageURLHttps()%>";
		
	window.opener.popupTwitterCallback(token, tokenSecret, account, profileImgUrl);
	window.close();
});


</script>

</head>


<body>

Please wait, <%=twitter.getScreenName()%>

</body>
</html>