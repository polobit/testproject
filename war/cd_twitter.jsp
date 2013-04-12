<%@page import="twitter4j.auth.RequestToken"%>
<%@page import="twitter4j.TwitterFactory"%>
<%@page import="twitter4j.Twitter"%>
<%

// Constants
final String CONSUMER_KEY = "Q8jLaFvEhdE3kRTgUpMw";
final String CONSUMER_SECRET = "vfsi8O6nXsKh4jhTpJlS003OULo4KcuBnek5eWpgfCQ"; 

Twitter twitter = new TwitterFactory().getInstance();
twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);

RequestToken requestToken = twitter.getOAuthRequestToken();

String token = requestToken.getToken();
String tokenSecret = requestToken.getTokenSecret();
 
session.setAttribute("token", token);
session.setAttribute("tokenSecret", tokenSecret);
 
String authUrl = requestToken.getAuthorizationURL();

System.out.println(authUrl + " " + token + " " + tokenSecret);
 
response.sendRedirect(authUrl);

%>
