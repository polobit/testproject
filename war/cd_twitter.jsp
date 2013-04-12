
<%@page import="org.scribe.model.Token"%>
<%@page import="com.agilecrm.Globals"%>
<%@page import="org.scribe.builder.api.TwitterApi"%>
<%@page import="org.scribe.builder.ServiceBuilder"%>
<%@page import="org.scribe.oauth.OAuthService"%>
<%

// Get Service
StringBuffer callbackURL = request.getRequestURL();
int index = callbackURL.lastIndexOf("/");
callbackURL.replace(index, callbackURL.length(), "").append("/cd_twitter_callback.jsp");

OAuthService service = new ServiceBuilder().provider(TwitterApi.class).callback(callbackURL.toString()).apiKey(Globals.TWITTER_API_KEY)
	.apiSecret(Globals.TWITTER_SECRET_KEY).build();

// Save Token and Service as we need them after it returns back
Token token = service.getRequestToken();
session.setAttribute("requestToken", token);

// Redirect to Authorization URL
String url = service.getAuthorizationUrl(token);
System.out.println(url + " " + token.getToken() + " " + token.getSecret());
 
response.sendRedirect(url);
%>
