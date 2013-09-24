package com.socialsuite;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;

/**
 * <code>Stream</code> class stores the details of a Stream (of social suite
 * user) of client. The class attributes are id, domainUser, screenName,
 * networkType, data of a Stream, token and secret.
 * 
 * @author Farah
 * 
 */
@XmlRootElement
public class Stream
{
	@Override
	public String toString()
	{
		return "Stream [id=" + id + ", domain_user_id=" + domain_user_id + ", client_channel=" + client_channel
				+ ", screen_name=" + screen_name + ", stream_type=" + stream_type + ", keyword=" + keyword + ", token="
				+ token + ", secret=" + secret + ", network_type=" + network_type + ", column_index=" + column_index
				+ "]";
	}

	// Unique id of Stream.
	@Id
	public Long id;

	/**
	 * domain user id from Datastore. To distinguish related streams to domain
	 * user.
	 */
	public Long domain_user_id;

	/** Channel for pubnub communication. Value is domainUser's id + "_Channel" */
	public String client_channel = null;

	/**
	 * screen name from social network account need to distinguish streams.
	 */
	public String screen_name;

	/**
	 * Type of stream like Home, Sent, Search, etc.
	 */
	public String stream_type;

	/**
	 * Keyword for search stream.
	 */
	public String keyword;;

	/** Private keys of client. it required to do authentication on Twitter. */
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

	public int column_index;

	/** object of objectify for dB operations on Stream. */
	public static ObjectifyGenericDao<Stream> dao = new ObjectifyGenericDao<Stream>(Stream.class);

	// default constructor
	public Stream()
	{
	}

	/**
	 * parameter constructor Creates a stream with its domainUser, screenName,
	 * networkType, data.
	 * 
	 * @param domainUserId
	 *            - current domain user id.
	 * @param clientChannel
	 *            - Pubnub channel of domain user.
	 * @param screenName
	 *            - screen name from social network account need to distinguish
	 *            streams.
	 * @param networkType
	 *            - social network account type.
	 * @param token
	 *            - authentication key of twitter.
	 * @param secret
	 *            - authentication key of twitter.
	 * @param stream_type
	 *            - stream's name.
	 * @param keyword
	 *            - keyword for search stream.
	 * 
	 */
	public Stream(Long domain_user_id, String client_channel, String screen_name, String network_type,
			String stream_type, String keyword, String token, String secret, int column_index)
	{
		System.out.println("In stream constructor " + stream_type + " networkType : " + network_type);
		this.domain_user_id = domain_user_id;
		this.client_channel = client_channel;
		this.screen_name = screen_name;
		this.network_type = NetworkTypeEnum.valueOf(network_type.toUpperCase());
		this.stream_type = stream_type;
		this.keyword = keyword;
		this.token = token;
		this.secret = secret;
		this.column_index = column_index;
	}

	/**
	 * Saves (new) a Stream.
	 */
	public void save()
	{
		System.out.println("In stream save, networkType : " + this.network_type);
		dao.put(this);
	}// save end

	/**
	 * Delete Current Stream object, matched with the given stream id.
	 * 
	 */
	public void delete()
	{
		dao.delete(this);
	}

	@PrePersist
	void prePersist()
	{
		if (this.stream_type.equalsIgnoreCase("Mentions"))
		{
			this.keyword = "@" + this.screen_name;
		}
		if (this.network_type.toString().equalsIgnoreCase("Linkedin"))
		{
			try
			{
				String userName = SocialSuiteLinkedinUtil.getLinkedInUserName(this.token, this.secret);
				System.out.println("Linkedin screen name is : ");
				this.screen_name = userName;
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}
}