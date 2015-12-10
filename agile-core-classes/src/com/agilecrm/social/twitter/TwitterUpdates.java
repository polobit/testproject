package com.agilecrm.social.twitter;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.List;

import twitter4j.HashtagEntity;
import twitter4j.Paging;
import twitter4j.QueryResult;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterRuntimeException;
import twitter4j.URLEntity;
import twitter4j.User;
import twitter4j.UserMentionEntity;

import com.agilecrm.social.stubs.SocialUpdateStream;
import com.agilecrm.widgets.Widget;

public class TwitterUpdates
{

    /**
     * Searches in Twitter for the specified twitterId and gets the tweets of
     * that person
     * 
     * @param widget
     *            {@link Widget} for accessing token and secret key
     * @param twitterId
     *            {@link String} to access recipient twitter account
     * @return {@link List} of {@link SocialUpdateStream}
     * @throws Exception
     *             If {@link Twitter} throws an exception
     */
    public static List<SocialUpdateStream> getNetworkUpdates(Widget widget, Long twitterId)
	    throws SocketTimeoutException, IOException, Exception
    {
	try
	{
	    /*
	     * Get Twitter object and on that fetch user to get screen name,
	     * form a query on screen name and search for tweets
	     */
	    return TwitterUpdates.getNetworkUpdates(widget, twitterId, 0, 0);
	}
	catch (TwitterRuntimeException e)
	{
	    System.out.println("In network updates twitter exception");
	    throw TwitterUtil.getErrorMessage(e);
	}
    }

    /**
     * Searches in Twitter for the specified twitterId and gets the tweets of
     * that person
     * 
     * @param widget
     *            {@link Widget} for accessing token and secret key
     * @param twitterId
     *            {@link String} to access recipient twitter account
     * @param statusId
     *            tweet id of the tweet after which updates are retrieved
     * @param count
     *            number of tweets to be retrieved
     * @return {@link List} of {@link SocialUpdateStream}
     * @throws Exception
     *             If {@link Twitter} throws an exception
     */
    public static List<SocialUpdateStream> getNetworkUpdates(Widget widget, Long twitterId, long statusId, int count)
	    throws SocketTimeoutException, IOException, Exception
    {
	try
	{
	    /*
	     * Get Twitter object and on that fetch user to get screen name,
	     * form a query on screen name and search for tweets setting max
	     * status id and count
	     */
	    Twitter twitter = TwitterUtil.getTwitter(widget);
	    User user = twitter.showUser(twitterId);
	    Paging page = new Paging();
	    // set max id if statusId is not zero
	    if (statusId != 0){
	    	page.setMaxId(statusId);
	    }

	    // set max id if count is not zero
	    if (count != 0){
	    	page.setCount(count);
	    }

	    return TwitterUpdates.getListOfSocialUpdateStream(user, twitter,
		    twitter.getUserTimeline(user.getScreenName(), page));
	}
	catch (TwitterRuntimeException e)
	{
	    System.out.println("In network updates twitter exception");
	    throw TwitterUtil.getErrorMessage(e);
	}
    }

    /**
     * Forms a {@link List} of {@link SocialUpdateStream} from the {@link List}
     * of {@link Status} (tweets)
     * 
     * @param user
     *            {@link User} contact whose tweets are to be filled in list
     * @param twitter
     *            {@link Twitter} after setting authentication
     * @param queryResult
     *            {@link QueryResult} to retrieve tweets of the person
     * @return {@link List} of {@link SocialUpdateStream}
     * @throws Exception
     *             If {@link Twitter} throws an exception
     */
    public static List<SocialUpdateStream> getListOfSocialUpdateStream(User user, Twitter twitter, List<Status> tweets)
	    throws SocketTimeoutException, IOException, Exception
    {
	List<SocialUpdateStream> updateStream = new ArrayList<SocialUpdateStream>();

	/*
	 * For each tweet, retrieve the information and make it into proper
	 * string with links to display it
	 */
	for (Status tweet : tweets)
	    try
	    {
		SocialUpdateStream stream = new SocialUpdateStream();

		stream.id = String.valueOf(tweet.getId());
		stream.message = tweet.getText();
		stream.is_retweet = tweet.isRetweet();
		stream.is_retweeted = tweet.isRetweetedByMe();
		stream.created_time = tweet.getCreatedAt().getTime() / 1000;

		/*
		 * If tweet is a retweet, get the picture URL and profile URL of
		 * person who actually tweeted it, else get picture URL and
		 * profile URL of the the contact's twitter profile
		 */
		if (tweet.isRetweet())
		{
		    User tweetor = twitter.showUser(tweet.getUserMentionEntities()[0].getScreenName());
		    stream.tweeted_person_pic_url = tweetor.getMiniProfileImageURLHttps();
		    stream.tweeted_person_profile_url = "https://twitter.com/" + tweetor.getScreenName();
		}
		else
		{
		    stream.tweeted_person_pic_url = user.getBiggerProfileImageURLHttps();
		    stream.tweeted_person_profile_url = "https://twitter.com/" + user.getScreenName();
		}

		/*
		 * For every user who retweeted the tweet, make its screen name
		 * as link in the tweet string which can be redirected to
		 * his/her twitter profile
		 */
		for (UserMentionEntity entity : tweet.getUserMentionEntities()){
		    stream.message = stream.message.replace("@" + entity.getScreenName(),
			    "<a href='https://twitter.com/" + entity.getScreenName()
				    + "' target='_blank' class='cd_hyperlink'>@" + entity.getScreenName() + "</a>");
		}

		/*
		 * For every hash tag, make its name as link in the tweet string
		 * which can be redirected to twitter profile of it
		 */
		for (HashtagEntity entity : tweet.getHashtagEntities())
		{
		    String url = "https://twitter.com/search?q=%23" + entity.getText() + "&src=hash";
		    stream.message = stream.message.replace("#" + entity.getText(), "<a href='" + url
			    + "' target='_blank' class='cd_hyperlink'>#" + entity.getText() + "</a>");
		}

		/*
		 * If tweet contains links, replacing the link with its display
		 * content returned from Twitter, which redirects with the
		 * actual URL
		 */
		for (URLEntity entity : tweet.getURLEntities()){
		    stream.message = stream.message.replace(entity.getURL(), "<a href='" + entity.getURL()
			    + "' target='_blank' class='cd_hyperlink'>" + entity.getDisplayURL() + "</a>");
		}

		/*
		 * If still tweet contains URL, showing it as hyper link and
		 * linking it with its own URL
		 */
		String[] words = stream.message.split(" ");
		String exp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";

		for (String word : words){
		    if (word.matches(exp))
			stream.message = stream.message.replace(word, "<a href='" + word
				+ "' target='_blank' class='cd_hyperlink'>" + word + "</a>");
		}

		System.out.println("Tweet after showing links: " + stream.message);

		// Each tweet is added in a list
		updateStream.add(stream);
	    }
	    catch (TwitterRuntimeException e)
	    {
		System.out.println("In list of updates twitter exception");
		throw TwitterUtil.getErrorMessage(e);
	    }
	return updateStream;
    }

}
