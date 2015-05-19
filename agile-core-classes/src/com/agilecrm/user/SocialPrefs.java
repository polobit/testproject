package com.agilecrm.user;

import java.util.List;
import java.util.Map;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.scribe.ScribeServlet;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>SocialPrefs</code> is the base class that handles social preferences
 * like gmail. When user login into any social group from AgileCRM, token,
 * secret and properties will be generated if access is given successfully.
 * SocialPrefs makes use of {@link ScribeServlet} to get token, secret and other
 * properties.
 * <p>
 * SocialPrefs makes user to connect with Contacts from AgileCRM itself through
 * LinkedIn, Gmail, Facebook and Twitter.User can view email sent by a contact
 * in contact detail.
 * </p>
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
@Cached
public class SocialPrefs
{
    /**
     * SocialPrefs Id
     */
    @Id
    public Long id;

    /**
     * SocialPrefs types
     * 
     */
    public enum Type
    {
	LINKEDIN, TWITTER, FACEBOOK, GMAIL, DUMMY
    };

    /**
     * SocialPrefs type.
     */
    public Type type;

    /**
     * AgileUser Key.
     */
    @Parent
    @JsonIgnore
    private Key<AgileUser> agileUser;

    @JsonIgnore
    @NotSaved(IfDefault.class)
    public List<Key<AgileUser>> sharedWithUsers;

    @NotSaved
    public List<String> shared_with_users_ids;

    /**
     * Social group token.
     */
    @NotSaved(IfDefault.class)
    public String token = null;

    /**
     * Refresh token is saved for Oauth 2.0
     */
    @NotSaved(IfDefault.class)
    public String refresh_token = null;

    @NotSaved(IfDefault.class)
    public Long expires_at = 0L;

    /**
     * Social group secret.
     */
    public String secret;

    /**
     * Social Id. E.g.Id from gmail.
     */
    @NotSaved(IfDefault.class)
    public String socialId = null;

    /**
     * Picture of user in social group.
     */
    @NotSaved(IfDefault.class)
    public String picture = null;

    /**
     * User name in social group.
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * User email in social group
     */
    @NotSaved(IfDefault.class)
    public String email = null;

    /**
     * SocialPrefs Dao.
     */
    private static ObjectifyGenericDao<SocialPrefs> dao = new ObjectifyGenericDao<SocialPrefs>(SocialPrefs.class);

    /**
     * Default SocialPrefs.
     */
    SocialPrefs()
    {
    }

    /**
     * Constructs a new {@link SocialPrefs}.
     * 
     * @param agileUser
     *            - AgileUser object.
     * @param type
     *            - SocialPrefs type.
     * @param token
     *            - Social group token.
     * @param secret
     *            - Social group secret.
     * @param properties
     *            - Social group properties.
     */
    public SocialPrefs(AgileUser agileUser, Type type, String token, String secret, Map<String, String> properties)
    {
	this.token = token;
	this.agileUser = new Key<AgileUser>(AgileUser.class, agileUser.id);
	this.secret = secret;
	this.type = type;

	this.socialId = properties.get("id");
	this.picture = properties.get("pic");
	this.name = properties.get("name");

	if (properties.containsKey("email"))
	    this.email = properties.get("email");
	if (properties.containsKey("picture"))
	    this.picture = properties.get("picture");
	System.out.println(properties);
    }

    /**
     * Sets agileUser.
     * 
     * @param agileUser
     *            - CurrentAgileUser Key.
     */
    public void setAgileUser(Key<AgileUser> agileUser)
    {
	this.agileUser = agileUser;
    }

    /**
     * Returns AgileUser Key.
     * 
     * @return AgileUser object
     */
    public Key<AgileUser> getAgileUser()
    {
	return agileUser;
    }

    /**
     * Returns list of users, to which current user IMAP settings are sharing
     * 
     * @return
     */
    public List<Key<AgileUser>> getSharedWithUsers()
    {
	return sharedWithUsers;
    }

    /**
     * Sets list of users, to which current user IMAP settings are sharing
     * 
     * @return
     */
    public void setSharedWithUsers(List<Key<AgileUser>> sharedUsers)
    {
	this.sharedWithUsers = sharedUsers;
    }

    /**
     * Saves SocialPrefs.
     */
    public void save()
    {
	if (this.type == Type.GMAIL)
	{
	    int emailAccountLimitCount = BillingRestrictionUtil.getBillingRestriction(null, null).getCurrentLimits()
		    .getEmailAccountLimit();
	    int emailPrefsCount = ContactEmailUtil.getEmailPrefsCount();
	    if (emailPrefsCount < emailAccountLimitCount)
	    {
		dao.put(this);
	    }
	}
	else
	    dao.put(this);
    }
    
    public void update()
    {
    	dao.put(this);
    }

    /**
     * Deletes SocialPrefs.
     */
    public void delete()
    {
	dao.delete(this);
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
	return "Social - " + type + " Token: " + token + " " + secret;
    }
}