package com.agilecrm.social;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.annotation.XmlRootElement;

import twitter4j.ResponseList;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.User;
import twitter4j.auth.AccessToken;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.widgets.Widget;

@XmlRootElement
public class TwitterUtil
{

	public static final String TWITTER_API_KEY = "fhaEpuOQOJYMfDnxHFf7PQ";
	public static final String TWITTER_SECRET_KEY = "AUoq9TJHwKRIdngQa39RBskYBzn6aZNkERqj5z753k";


	// Get Twitter Profile
	public static List<SocialSearchResult> searchTwitterProfiles(Widget widget, Contact contact) throws Exception
	{
		String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
		String lastName = contact.getContactFieldValue(Contact.LAST_NAME);
		if(firstName == null || lastName == null)
			return null;
		
		// Get Users
		Twitter twitter = new TwitterFactory().getInstance();

		twitter.setOAuthConsumer(TWITTER_API_KEY, TWITTER_SECRET_KEY);
		AccessToken accessToken = new AccessToken(widget.getProperty("token"), widget.getProperty("secret"));
		twitter.setOAuthAccessToken(accessToken);
		
		ResponseList<User> users = twitter.searchUsers(firstName + " " + lastName + " ", 0);
		List<SocialSearchResult> searchResults = new ArrayList<SocialSearchResult>();
		
		
		
		for(User user: users)
		{
			
			SocialSearchResult result = new SocialSearchResult();
			
			result.id = user.getId() + "";
			result.name = user.getName();
			result.picture = user.getProfileImageURL().toExternalForm();
			result.location = user.getLocation();
			result.summary = user.getDescription();
			result.num_connections = user.getFollowersCount() + "";
			result.location = user.getLocation();
			
			searchResults.add(result);			
		}
		
		return searchResults;
	}


	public static Map<String, String> getTwitterUserProperties(String token, String tokenSecret)
	{

		// Get Users
		Twitter twitter = new TwitterFactory().getInstance();

		twitter.setOAuthConsumer(TWITTER_API_KEY, TWITTER_SECRET_KEY);
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
			String path = user.getProfileImageURL().toExternalForm();
			
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

	// Fetch Twitter Profile by id
	public static SocialSearchResult getTwitterProfileById(Widget widget, String id)
	{
		Twitter twitter = new TwitterFactory().getInstance();
		
		twitter.setOAuthConsumer(TWITTER_API_KEY, TWITTER_SECRET_KEY);
		AccessToken accessToken = new AccessToken(widget.getProperty("token"), widget.getProperty("secret"));
		twitter.setOAuthAccessToken(accessToken);
		try
		{
			long profile_id = Long.parseLong(id) ;
			User user = twitter.showUser(profile_id);
			
			SocialSearchResult result = new SocialSearchResult();
			
			result.id = user.getId() + "";
			result.name = user.getName();
			result.picture = user.getProfileImageURL().toExternalForm();
			result.location = user.getLocation();
			result.summary = user.getDescription();
			result.num_connections = user.getFollowersCount() + "";
			result.location = user.getLocation();
	
			return result;
		} 
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return null;
	}

	
	public static void main(String[] args) throws Exception
	{

		List<ContactField> properties = new ArrayList<ContactField>();
		properties.add(new ContactField("company", "work", "Giga Om"));

		//Contact contact = new Contact(Contact.Type.PERSON, "", "Om", "Malik", new ArrayList<String>(), properties);
		// getLinkedInProfile(contact);
		//getTwitterProfile(contact);
	}

}
