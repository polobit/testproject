package com.thirdparty.google;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PostLoad;
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
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;
import com.thirdparty.google.groups.GoogleGroupDetails;
import com.thirdparty.google.groups.util.ContactGroupUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * <code>ContactPrefs</code> class stores the details of different sources to
 * import contacts.
 * 
 * @author Tejaswi
 * @since July 2013
 * 
 */
@XmlRootElement
@Cached
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

    @NotSaved(IfDefault.class)
    @Unindexed
    public boolean my_contacts = true;

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

    @NotSaved(IfDefault.class)
    public Long last_synced_to_client = 0L;

    @NotSaved(IfDefault.class)
    public Long last_synced_updated_contacts_to_client = 0L;

    @NotSaved(IfDefault.class)
    public Long last_synced_from_client = 0L;

    @NotSaved
    @Embedded
    public List<GoogleGroupDetails> groups = new ArrayList<GoogleGroupDetails>();

    // domain user key
    @JsonIgnore
    private Key<DomainUser> domainUser;

    public static enum Type
    {
	GOOGLE, ZOHO, SUGAR, SALESFORCE,STRIPE
    }

    /**
     * Enum type which specifies sources from which we import contacts
     */
    @NotSaved(IfDefault.class)
    public Type type = null;

    @NotSaved(IfDefault.class)
    public String sync_to_group = null;

    @NotSaved(IfDefault.class)
    public String sync_from_group = null;

    @NotSaved(IfDefault.class)
    public String conflict = null;

    public ContactPrefs()
    {
    }

    // Category of report generation - daily, weekly, monthly.
    public static enum Duration
    {
	DAILY, WEEKLY, MONTHLY, ONCE
    };

    @NotSaved(IfDefault.class)
    public Duration duration = Duration.ONCE;

    // Category of report generation - daily, weekly, monthly.
    public static enum SYNC_TYPE
    {
	CLIENT_TO_AGILE, AGILE_TO_CLIENT, TWO_WAY
    };

    @NotSaved(IfDefault.class)
    public SYNC_TYPE sync_type = null;
   /**
    * various field data can be set as list in dataOption
    * field can be like Account,leads,customer etc..
    */
    
    @NotSaved
    public List<String> dataOptions;

    public static String AGILE = "Agile";
    public static String CLIENT = "Client";

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
	System.out.println("saving prefs " + this.last_synced_to_client);
	if (domainUser == null)
	    domainUser = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());
    }

    @JsonIgnore
    public void setExpiryTime(Long time)
    {
	createdAt = System.currentTimeMillis();

	System.out.println(expires);
	if (expires / 100000000000l > 1)
	    expires = createdAt + (expires);
	else
	    expires = createdAt + (expires * 1000);
	System.out.println(expires);
    }

    @PostLoad
    void postLoad()
    {
	if (type == Type.GOOGLE)
	{
	    fillGroups();
	}
    }

    /**
     * Fill groups in fetching from google
     */
    public void fillGroups()
    {
	try
	{
	    // Fetches froups from google
	    groups = ContactGroupUtil.getGroups(this);

	    // Get group Agile from set, and deletes if there is a duplicate
	    // Agile group, or add one if there are none (Adds only in the list
	    // to show in UI does not create at this point)
	    GoogleGroupDetails agileGroup = ContactPrefsUtil.getGroup("Agile", this);
	    List<GoogleGroupDetails> groupList = ContactPrefsUtil.getGroupList("Agile", this);
	    if (groupList.isEmpty())
	    {
		agileGroup = new GoogleGroupDetails();
		// agileGroup.atomId = "Agile";
		agileGroup.groupName = "Agile";
		groups.add(agileGroup);
	    }
	    else if (groupList.size() > 1)
	    {
		System.out.println("duplicate groups = " + groupList);
		for (GoogleGroupDetails googleGroup : groupList)
		{
		    // @NotSaved(IfDefault.class)
		    // public Long last_synched_to_client = 0L;

		    System.out.println("duplicate groups = " + googleGroup.atomId);

		    // @NotSaved(IfDefault.class)
		    // public Long last_synched_from_client = 0L;
		    if (!(googleGroup.atomId.equals(sync_from_group) || googleGroup.atomId.equals(sync_to_group)))
		    {
			System.out.println("delete + " + googleGroup.atomId);
			ContactGroupUtil.deleteGroup(this, googleGroup.atomId);
		    }
		}
	    }
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
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

    public Key<DomainUser> getDomainUser(Key<DomainUser> domianUser)
    {
	return domianUser;
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
	if (object == null)
	    return;

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
