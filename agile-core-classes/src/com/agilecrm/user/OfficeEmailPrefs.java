package com.agilecrm.user;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.email.util.ContactOfficeUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.email.wrappers.EmailWrapper;
import com.agilecrm.user.util.OfficeEmailPrefsUtil;
import com.agilecrm.util.EncryptDecryptUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>OfficeEmailPrefs</code> is the base class for setting Office Exchange
 * Email Preferences.
 * <p>
 * Email sent by a contact can be viewed directly within AgileCRM by setting
 * OfficeEmailPrefs. User should set Email Server host, username and Password.
 * </p>
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
@Cached
public class OfficeEmailPrefs
{
    /**
     * OfficeEmailPrefs Id.
     */
    @Id
    public Long id;

    /**
     * Host Server URL.
     */
    @NotSaved(IfDefault.class)
    public String server_url = null;

    /**
     * UserName to access email.
     */
    @NotSaved(IfDefault.class)
    public String user_name = null;

    /**
     * Masked Password.
     */
    public static final String MASKED_PASSWORD = "PASSWORD";

    /**
     * User password to access email.
     */
    @NotSaved
    public String password = MASKED_PASSWORD;

    /**
     * Encrypted password.
     */
    @NotSaved(IfDefault.class)
    private String encrypted_password = null;

    /**
     * Use SSL or not, true for SSL.
     */
    public boolean is_secure = true;

    /**
     * AgileUser Key.
     */
    @Parent
    @JsonIgnore
    private Key<AgileUser> agileUser;
    
    /**
     * Sharing this object with list of users
     */
    @JsonIgnore
    @NotSaved(IfDefault.class)
    public List<Key<AgileUser>> sharedWithUsers;

    @NotSaved
    public List<String> shared_with_users_ids;

    /**
     * OfficeEmailPrefs Dao.
     */
    private static ObjectifyGenericDao<OfficeEmailPrefs> dao = new ObjectifyGenericDao<OfficeEmailPrefs>(
	    OfficeEmailPrefs.class);

    /**
     * Default OfficeEmailPrefs.
     */
    OfficeEmailPrefs()
    {

    }

    /**
     * Constructs a new {@link OfficeEmailPrefs}.
     * 
     * @param serverURL
     *            - Host Server URL.
     * @param userName
     *            - UserName to access email.
     * @param password
     *            - User password to access email.
     * @param isSecure
     *            - Protocol to be used.
     */
    OfficeEmailPrefs(String serverURL, String userName, String password, boolean isSecure)
    {
	// this.email = email;
	this.server_url = serverURL;
	this.user_name = userName;
	this.password = password;
	this.is_secure = isSecure;

	System.out.println("Agile user id is " + AgileUser.getCurrentAgileUser().id);
	this.agileUser = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);
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
     * Saves OfficeEmailPrefs.
     */
    public void save()
    {
	// Verify Office Exchange credentials
	try
	{
	    OfficeEmailPrefsUtil.checkOfficePrefs(this);
	    //Sharing current prefs with specified users
	    if (shared_with_users_ids != null)
	    {
		sharedWithUsers = new ArrayList<Key<AgileUser>>();
		for (int i = 0; i < shared_with_users_ids.size(); i++)
		{
		    Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, Long.parseLong(shared_with_users_ids.get(i)));		    
		    sharedWithUsers.add(userKey);
		}
	    }
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}
	dao.put(this);
    }

    /**
     * Deletes OfficeEmailPrefs.
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Encrypts the given password. If password is not changed, remains old
     * encrypted password.
     */
    @PrePersist
    private void PrePersist()
    {
	if (!password.equalsIgnoreCase(MASKED_PASSWORD))
	{
	    // Encrypt password while saving
	    encrypted_password = EncryptDecryptUtil.encrypt(password);
	}
	else
	{
	    if (this.id != null)
	    {
		// Get Old password
		OfficeEmailPrefs oldOfficeEmailPrefs = OfficeEmailPrefsUtil.getOfficeEmailPrefs(this.id, agileUser);
		this.encrypted_password = oldOfficeEmailPrefs.encrypted_password;
	    }
	}
	password = MASKED_PASSWORD;
    }

    /**
     * Decrypts the encrypted password after fetching from database.
     * 
     * @throws DecoderException
     *             if password is not successfully decrypted.
     */
    @PostLoad
    private void PostLoad() throws DecoderException
    {
	if (encrypted_password != null)
	{
	    // Decrypt password
	    password = EncryptDecryptUtil.decrypt(encrypted_password);
	}
    }

    /**
     * Override toString()
     */
    public String toString()
    {
	return "User name: " + user_name + " Server " + server_url;
    }
}