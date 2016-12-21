<%@page import="com.agilecrm.user.Referer.ReferTypes"%>
<%@page import="com.agilecrm.user.Referer.ReferTypes"%>
<%@page import="com.agilecrm.user.Referer.ReferTypes"%>
<%@page import="com.agilecrm.user.Referer.ReferTypes"%>
<%@page import="com.agilecrm.user.util.ReferUtil"%>
<%@page import="com.agilecrm.user.Referer"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.util.NamespaceUtil"%>
<%@page import="com.agilecrm.subscription.restrictions.db.BillingRestriction"%>
<%@page import="com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil"%>
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
Token accessToken = null; Twitter twitter = null; User user = null; String referralType = null;

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

Object referralObj = request.getSession().getAttribute("referral_type");
if(referralObj != null){
	referralType = (String) referralObj;
	System.out.println("referral_type is:: "+referralType);
	BillingRestriction restriction = BillingRestrictionUtil.getBillingRestrictionFromDB();
	Referer referer = ReferUtil.getReferrer();
	if(referralType.equals("tweet")){
		twitter.updateStatus("Try @agilecrm. I am using Agile CRM and really love it. An all-in-one CRM which enables you sell like the Fortune 500!");
		if(!referer.usedReferTypes.contains(ReferTypes.twitter_tweet)){
			restriction.incrementEmailCreditsCount(500);
			referer.usedReferTypes.add(ReferTypes.twitter_tweet);
			referer.save();
		}
	}else if(referralType.equals("follow")){
		User user1 = twitter.createFriendship("agilecrm");
		twitter.createFriendship(user1.getId());
		if(!referer.usedReferTypes.contains(ReferTypes.twitter_follow)){
			restriction.incrementEmailCreditsCount(500);
			referer.usedReferTypes.add(ReferTypes.twitter_follow);
			referer.save();
		}
	}
	restriction.save();
}
}catch(Exception e){
	   System.out.println(accessToken);
	   System.out.println("Some error occured : " + e.getMessage());
	   out.println("<div style='text-align: center;font-size: large;'>Oops.. Twitter says you are too fast for it to serve you. Please try again after few minutes. <br><button class=\"btn\" style='font-size: initial;' onclick='window.close();return false;'>Close</button></div>");	   
	   return;
}

String host = request.getServerName();
if(host.contains("-dot-")) {
  response.sendRedirect("https://" + NamespaceUtil.getNamespaceFromURL(host) + ".agilecrm.com/cd_twitter_callback_redirect.jsp?referral_type=" + referralType + "&token=" + accessToken.getToken() + "&tokenSecret=" + accessToken.getSecret() + "&account=" + twitter.getScreenName() + "&profileImgUrl=" + user.getOriginalProfileImageURLHttps());
  return;
}

%>
