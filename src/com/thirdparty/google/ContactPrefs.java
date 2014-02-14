package com.thirdparty.google;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.google.gdata.util.common.base.StringUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>ContactPrefs</code> class stores the details of different sources to
 * import contacts.
 * 
 * @author Tejaswi
 * @since July 2013
 * 
 */
@XmlRootElement
public class ContactPrefs implements Serializable
{
	// Key
	@Id
	public Long id;

	/** Stores user name of the source */
	@NotSaved(IfDefault.class)
	public String userName = null;

	/** Stores password of the source */
	@NotSaved(IfDefault.class)
	public String password = null;

	/** API key of source */
	@NotSaved(IfDefault.class)
	public String apiKey = null;

	/**
	 * Access token for OAuth
	 */
	@NotSaved(IfDefault.class)
	@JsonIgnore
	public String token = null;

	/**
	 * Secret token for OAuth
	 */
	@NotSaved(IfDefault.class)
	@JsonIgnore
	public String secret = null;

	/**
	 * Refresh token for OAuth to exchange for access token
	 */
	@NotSaved(IfDefault.class)
	@JsonIgnore
	public String refreshToken = null;

	/**
	 * If access token expire time is specified, we store it
	 */
	@NotSaved(IfDefault.class)
	public Long expires = 0L;

	// created time
	@NotSaved(IfDefault.class)
	public Long createdAt = 0L;

	// modified time
	@NotSaved(IfDefault.class)
	public Long lastModifedAt = 0L;

	// domain user key
	@JsonIgnore
	private Key<DomainUser> domainUser;

	public static enum Type
	{
		GOOGLE, ZOHO, SUGAR, SALESFORCE
	}

	/**
	 * Enum type which specifies sources from which we import contacts
	 */
	@NotSaved(IfDefault.class)
	public Type type = null;

	public ContactPrefs()
	{
	}

	// Category of report generation - daily, weekly, monthly.
	public static enum Duration
	{
		DAILY, WEEKLY, MONTHLY
	};

	@Indexed
	@NotSaved(IfDefault.class)
	public Duration duration;

	// Category of report generation - daily, weekly, monthly.
	public static enum SYNC_TYPE
	{
		CLIENT_TO_AGILE, AGILE_TO_CLIENT, TWO_WAY
	};

	@NotSaved(IfDefault.class)
	public SYNC_TYPE sync_type = null;

	@NotSaved
	public List<String> salesforceFields;

	public ContactPrefs(Type type, String token, String secret, Long expires, String refreshToken)
	{
		this.type = type;
		this.token = token;
		this.secret = secret;
		this.refreshToken = refreshToken;
		this.expires = expires;
	}

	/**
	 * ContactPrefs DAO.
	 */
	public static ObjectifyGenericDao<ContactPrefs> dao = new ObjectifyGenericDao<ContactPrefs>(ContactPrefs.class);

	/**
	 * Saves ContactPrefs in database
	 */
	public void save()
	{
		dao.put(this);
	}

	/**
	 * sets created time,expire time for access token and domain user key
	 */
	@PrePersist
	public void prePersist()
	{

		createdAt = System.currentTimeMillis();
		if (expires != 0l)
			expires = createdAt + expires * 1000;

		if (domainUser == null)
			domainUser = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());
	}

	/**
	 * Sets domianUser key.
	 * 
	 * @param domianUser
	 *            - domianUser Key.
	 */
	public void setDomainUser(Key<DomainUser> domianUser)
	{
		this.domainUser = domianUser;
	}

	/**
	 * Returns domianUser Key.
	 * 
	 * @return domianUser object
	 */
	public Key<DomainUser> getDomainUser()
	{
		System.out.println("domain user key : " + domainUser);
		return domainUser;
	}

	/**
	 * Deletes ContactPrefs.
	 */
	public void delete()
	{
		dao.delete(this);
	}

	public void setPrefs(JSONObject object)
	{
		String duration = null;
		String type = null;
		System.out.println(object);
		try
		{
			duration = object.getString("duration");
			type = object.getString("sync_type");
		}
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if (!StringUtil.isEmpty(duration))
			this.duration = Duration.valueOf(duration);
		if (!StringUtil.isEmpty(type))
			sync_type = SYNC_TYPE.valueOf(type);

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		return "username: " + userName + "password: " + password + "apikey: " + apiKey + "token: " + token
				+ " secret: " + secret + "refreshToken: " + refreshToken + " expires: " + expires;
	}
}
