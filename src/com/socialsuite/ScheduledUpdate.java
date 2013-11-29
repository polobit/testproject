package com.socialsuite;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;

/**
 * <code>ScheduledUpdate</code> class stores the details of a update (of social
 * suite user) of client. The class attributes are id, domainUser, screenName,
 * networkType, message, token and secret.
 * 
 * @author Farah
 * 
 */
@XmlRootElement
public class ScheduledUpdate
{
	// Unique id of Stream.
	@Id
	public Long id;

	/**
	 * domain user id from Datastore. To distinguish related updates to domain
	 * user.
	 */
	public Long domain_user_id;

	/**
	 * screen name from social network account need to distinguish updates.
	 */
	public String screen_name;

	/**
	 * Private keys of client. it required to do authentication on social
	 * network.
	 */
	public String token;
	public String secret;

	// enum of social network type
	enum NetworkTypeEnum
	{
		TWITTER, LINKEDIN, FACEBOOK, GOOGLE_PLUS
	};

	/**
	 * social network account type.
	 */
	public NetworkTypeEnum network_type;

	/**
	 * message to be scheduled.
	 */
	public String message;

	/**
	 * ScheduledUpdate Date.
	 */
	public String scheduled_date;

	/**
	 * ScheduledUpdate Time.
	 */
	public String scheduled_time;

	public Long schedule;
	/**
	 * Tweet owner's profile img.
	 */
	public String profileImg;
	public String headline;
	public String tweetOwner;
	public String tweetId;

	/** object of objectify for dB operations on ScheduledUpdate. */
	public static ObjectifyGenericDao<ScheduledUpdate> dao = new ObjectifyGenericDao<ScheduledUpdate>(
			ScheduledUpdate.class);

	// default constructor
	public ScheduledUpdate()
	{
	}

	/**
	 * parameter constructor Creates a update with its domainUser, screenName,
	 * networkType, data.
	 * 
	 * @param domainUserId
	 *            - current domain user id.
	 * @param screenName
	 *            - screen name from social network account need to distinguish
	 *            streams.
	 * @param networkType
	 *            - social network account type.
	 * @param token
	 *            - authentication key of twitter.
	 * @param secret
	 *            - authentication key of twitter.
	 * @param message
	 *            - message to be included in scheduled update.
	 */
	public ScheduledUpdate(Long domain_user_id, String screen_name, String network_type, String token, String secret,
			String message, String scheduled_date, String scheduled_time, String profileImg, String headline,
			String tweetOwner, String tweetId, Long schedule)
	{
		System.out.println("In ScheduledUpdate constructor " + message + " networkType : " + network_type);
		this.domain_user_id = domain_user_id;
		this.screen_name = screen_name;
		this.network_type = NetworkTypeEnum.valueOf(network_type.toUpperCase());
		this.token = token;
		this.secret = secret;
		this.message = message;
		this.scheduled_date = scheduled_date;
		this.scheduled_time = scheduled_time;
		this.profileImg = profileImg;
		this.headline = headline;
		this.tweetOwner = tweetOwner;
		this.tweetId = tweetId;
		this.schedule = schedule;
	}

	/**
	 * Saves (new) a ScheduledUpdate.
	 */
	public void save()
	{
		System.out.println("In ScheduledUpdate save, networkType : " + this.network_type);
		dao.put(this);
	}// save end

	/**
	 * Delete Current ScheduledUpdate object, matched with the given id.
	 * 
	 */
	public void delete()
	{
		dao.delete(this);
	}// delete end

	@Override
	public String toString()
	{
		return "ScheduledUpdate [id=" + id + ", domain_user_id=" + domain_user_id + ", screen_name=" + screen_name
				+ ", token=" + token + ", secret=" + secret + ", network_type=" + network_type + ", message=" + message
				+ ", date=" + scheduled_date + ", time=" + scheduled_time + ", profileImg=" + profileImg
				+ ", headline=" + headline + ", tweetOwner=" + tweetOwner + ", tweetId=" + tweetId + "]";
	}

	/**
	 * Gets value of a ScheduledUpdate object, matched with the given Id.
	 * 
	 * @param id
	 *            ScheduledUpdate id of the object to get its value.
	 * @return value of the matched entity.
	 */
	public static ScheduledUpdate getScheduledUpdate(Long id)
	{
		try
		{
			// search ScheduledUpdate on id.
			return dao.get(id);
		}
		catch (EntityNotFoundException e)
		{
			// ScheduledUpdate not found
			// e.printStackTrace();
			return null;
		}
	}// getScheduledUpdate end

	/**
	 * Gets value of a ScheduledUpdate object, matched with the given
	 * screen_name.
	 * 
	 * @param screen_name
	 *            - screen_name of account holder.
	 * @return value of the matched entity.
	 */
	public static List<ScheduledUpdate> getScheduledUpdates(String screen_name)
	{
		// search ScheduledUpdate on screen_name.
		return dao.listByProperty("screen_name", screen_name);
	}// getScheduledUpdate end

	/**
	 * Gets value of a ScheduledUpdate objects, related with the current
	 * domainUser.
	 * 
	 * @return list of value of the matched entity.
	 */
	public static List<ScheduledUpdate> getScheduledUpdates()
	{
		DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();

		try
		{
			System.out.println("In get ScheduledUpdates.");
			return dao.listByProperty("domain_user_id", domainUser.id);
		}
		catch (Exception e)
		{
			// ScheduledUpdates not found
			e.printStackTrace();
			return null;
		}
	}// getScheduledUpdates end
}