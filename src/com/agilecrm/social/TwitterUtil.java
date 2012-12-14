package com.agilecrm.social;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import twitter4j.ResponseList;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.User;
import twitter4j.auth.AccessToken;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.core.api.widgets.WidgetsAPI;
import com.agilecrm.widgets.Widget;

/**
 * <code>TwitterUtil</code> class creates a client which connects to Twitter
 * based on the token and token secret, It includes methods to fetch current
 * user profile, search profiles based on first name and lastname, profile based
 * on twitter id(unique id provided by LinkedIn for each user).
 * <p>
 * This class is called from {@link WidgetsAPI} to search profiles from Twitter
 * or to get Profile based on Twitter id
 * </p>
 * 
 */
public class TwitterUtil
{
    /**
     * Searches Twitter profiles based on first name and last name specified,
     * result fetched are represented by class {@link SocialSearchResult}
     * include details id, name, image_url, url etc..
     * 
     * <p>
     * Token and secret required to connect are retrieved from the widget (saved
     * as prefs JSONString)
     * </p>
     * 
     * @param widget
     *            {@link Widget}
     * @param contact
     *            {@link Contact}
     * @return {@link List} of {@link SocialSearchResult}
     */
    public static List<SocialSearchResult> searchTwitterProfiles(Widget widget,
	    Contact contact) throws Exception
    {
	/* Gets first name and last name of the contact to search profiles */
	String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
	String lastName = contact.getContactFieldValue(Contact.LAST_NAME);
	if (firstName == null || lastName == null)
	    return null;

	// Creates a twitter factory, can be used to to create a connect using
	// appropriate authentication keys
	Twitter twitter = new TwitterFactory().getInstance();

	// Sets authentication, sets api key and secret key
	twitter.setOAuthConsumer(Globals.TWITTER_API_KEY,
		Globals.TWITTER_SECRET_KEY);

	// Creates an accesstoken to connect to Twitter. Token and secret key
	// are specific to an user, stored in widget
	AccessToken accessToken = new AccessToken(widget.getProperty("token"),
		widget.getProperty("secret"));

	// Authenticates based on accessToken created
	twitter.setOAuthAccessToken(accessToken);

	// Searches tiwtter profiles based on first name and last name
	ResponseList<User> users = twitter.searchUsers(firstName + " "
		+ lastName + " ", 0);

	List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();

	// Iterates through Twitter results and wraps the profile details in to
	// SocialSearchResult and adds to list
	for (User user : users)
	{

	    SocialSearchResult result = new SocialSearchResult();

	    result.id = user.getId() + "";
	    result.name = user.getName();
	    result.picture = user.getProfileImageUrlHttps().toString();
	    result.location = user.getLocation();
	    result.summary = user.getDescription();
	    result.num_connections = user.getFollowersCount() + "";
	    result.friends = user.getFriendsCount() + "";
	    result.tweets = user.getStatusesCount() + "";

	    // Adds each result in to list
	    searchResults.add(result);
	}

	// Returns list of matching profiles
	return searchResults;
    }

    /**
     * Creates a client to connect to Twitter using developers API key and
     * secret key. Fetches profile for the current user who connects to Twitter
     * based on token and token secret provided when user creates a connect
     * 
     * @param token
     *            {@link String}
     * @param tokenSecret
     *            {@link String}
     * @return {@link Map}
     */
    public static Map<String, String> getTwitterUserProperties(String token,
	    String tokenSecret)
    {

	// Get Users
	Twitter twitter = new TwitterFactory().getInstance();

	twitter.setOAuthConsumer(Globals.TWITTER_API_KEY,
		Globals.TWITTER_SECRET_KEY);
	AccessToken accessToken = new AccessToken(token, tokenSecret);
	twitter.setOAuthAccessToken(accessToken);

	// Properties
	Map<String, String> properties = new HashMap<String, String>();

	try
	{

	    String id = twitter.getScreenName();
	    // Get User Details - picture, name etc
	    User user = twitter.showUser(id);
	    String name = user.getName();
	    String path = user.getProfileImageUrlHttps().toString();

	    properties.put("id", id);
	    properties.put("name", name);
	    properties.put("pic", path);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return properties;
    }

    /**
     * Fetches Twitter profiles based on the profile id, token and secret are
     * retrieved from the widget object and Twitter sent. Result is wrapped in
     * to {@link SocialSearchResult} class
     * 
     * @param widget
     *            {@link Widget}, for accessing token and secret key
     * @param id
     *            {@link String}
     * @return {@link SocialSearchResult}
     */
    public static SocialSearchResult getTwitterProfileById(Widget widget,
	    String id)
    {

	// Creates a twitter factory, can be used to to create a connect using
	// appropriate authentication keys
	Twitter twitter = new TwitterFactory().getInstance();

	twitter.setOAuthConsumer(Globals.TWITTER_API_KEY,
		Globals.TWITTER_SECRET_KEY);
	AccessToken accessToken = new AccessToken(widget.getProperty("token"),
		widget.getProperty("secret"));

	// Creates Client factory using developer keys, which allows to connect
	// to Twitter using token and key
	twitter.setOAuthAccessToken(accessToken);

	try
	{
	    long profile_id = Long.parseLong(id);

	    // Fetch Twitter user profile based on profile Id
	    User user = twitter.showUser(profile_id);

	    SocialSearchResult result = new SocialSearchResult();

	    // Gets user details from twitter and maps to SocialSearchResult
	    // class
	    result.id = user.getId() + "";
	    result.name = user.getName();
	    result.picture = user.getProfileImageUrlHttps().toString();
	    result.location = user.getLocation();
	    result.summary = user.getDescription();
	    result.num_connections = user.getFollowersCount() + "";
	    result.friends = user.getFriendsCount() + "";
	    result.tweets = user.getStatusesCount() + "";

	    return result;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return null;
    }

    public static void main(String[] args) throws Exception
    {

	List<ContactField> properties = new ArrayList<ContactField>();
	properties.add(new ContactField("company", "work", "Giga Om"));

	// Contact contact = new Contact(Contact.Type.PERSON, "", "Om", "Malik",
	// new ArrayList<String>(), properties);
	// getLinkedInProfile(contact);
	// getTwitterProfile(contact);
    }

}
