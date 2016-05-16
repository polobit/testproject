
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="org.scribe.model.Token"%>
<%@page import="com.agilecrm.Globals"%>
<%@page import="org.scribe.builder.api.TwitterApi"%>
<%@page import="org.scribe.builder.ServiceBuilder"%>
<%@page import="org.scribe.oauth.OAuthService"%>
<%
try{
// Get Service
StringBuffer callbackURL = request.getRequestURL();
int index = callbackURL.lastIndexOf("/");
callbackURL.replace(index, callbackURL.length(), "").append("/cd_twitter_callback.jsp");

OAuthService service = new ServiceBuilder().provider(TwitterApi.SSL.class).callback(callbackURL.toString()).apiKey(Globals.TWITTER_API_KEY)
	.apiSecret(Globals.TWITTER_SECRET_KEY).build();

// Save Token and Service as we need them after it returns back
Token token = service.getRequestToken();
session.setAttribute("requestToken", token);
String referral_type = request.getParameter("referral_type");
session.removeAttribute("referral_type");
if(referral_type != null && !StringUtils.isEmpty(referral_type))
	session.setAttribute("referral_type", referral_type);
// Redirect to Authorization URL
String url = service.getAuthorizationUrl(token);
System.out.println(url + " " + token.getToken() + " " + token.getSecret());
 
response.sendRedirect(url);
}catch(Exception e){	   
	   System.out.println("Some error occured : " + e.getMessage());
	   out.println("<div style='text-align: center;font-size: large;'>Oops.. Twitter says you are too fast for it to serve you. Please try again after few minutes. <br><button class=\"btn\" style='font-size: initial;' onclick='window.close();return false;'>Close</button></div>");	   
	   return;
}
%>
