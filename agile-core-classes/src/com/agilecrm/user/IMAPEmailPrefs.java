package com.agilecrm.user;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.codec.DecoderException;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.IMAPEmailPrefsUtil;
import com.agilecrm.util.EncryptDecryptUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>IMAPEmailPrefs</code> is the base class for setting IMAP Email
 * Preferences. IMAP is the acronym for "Internet Message Access Protocol" and
 * an Internet protocol that allows an e-mail client to access e-mail on a
 * remote mail server. An IMAP server typically listens on well-known port 143.
 * IMAP over SSL (IMAPS) is assigned well-known port number 993.
 * <p>
 * Email sent by a contact can be viewed directly within AgileCRM by setting
 * IMAPPrefs. User should set Email Server host, username and Password.
 * IMAPEmailPrefs are enabled to the user who logged in.
 * </p>
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
@Cached
public class IMAPEmailPrefs
{
    /**
     * IMAPEmailPrefs Id.
     */
    @Id
    public Long id;

    /*
     * @NotSaved(IfDefault.class) public String email = null;
     */

    /**
     * Host Server Name.
     */
    @NotSaved(IfDefault.class)
    public String server_name = null;

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
     * SMTP host.
     */
    public String smtp_host;

    /**
     * SMTP port.
     */
    public String smtp_port;

    /**
     * AgileUser Key.
     */
    @Parent
    @JsonIgnore
    private Key<AgileUser> agileUser;

    /**
     * Sharing this object following list of users
     */
    @JsonIgnore
    @NotSaved(IfDefault.class)
    public List<Key<AgileUser>> sharedWithUsers;

    @NotSaved
    public List<String> shared_with_users_ids;

    @NotSaved
    public boolean isUpdated = true;

    /**
     * List of folders to fetch mails
     */
    @NotSaved(IfDefault.class)
    public List<String> folders = null;

    /**
     * IMAPEmailPrefs Dao.
     */
    private static ObjectifyGenericDao<IMAPEmailPrefs> dao = new ObjectifyGenericDao<IMAPEmailPrefs>(
	    IMAPEmailPrefs.class);

    /**
     * Default IMAPEmailPrefs.
     */
    IMAPEmailPrefs()
    {

    }

    /**
     * Constructs a new {@link IMAPEmailPrefs}.
     * 
     * @param email
     *            - User email-id.
     * @param serverName
     *            - Host Server name.
     * @param userName
     *            - UserName to access email.
     * @param password
     *            - User password to access email.
     * @param isSecure
     *            - SSL or not
     * @param smtpHost
     *            - SMTP host.
     * @param smtpPort
     *            - SMTP port.
     */
    IMAPEmailPrefs(String serverName, String userName, String password, boolean isSecure, String smtpHost,
	    String smtpPort)
    {
	// this.email = email;
	this.server_name = serverName;
	this.user_name = userName;
	this.password = password;
	this.smtp_host = smtpHost;
	this.smtp_port = smtpPort;
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
     * Returns list of selected mail server folders,we fetches mails from these
     * folders only if list is not empty.
     * 
     * @return
     */
    public List<String> getFoldersList()
    {
	return folders;
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
     * Saves IMAPEmailPrefs.
     */
    public void save()
    {
	// Verify imap credentials
	try
	{
	    IMAPEmailPrefsUtil.checkImapPrefs(this);
	    //If user doesn't mention folders, we uses default folders to fetch mails
	    if (folders == null || folders.size() == 0)
		folders = IMAPEmailPrefsUtil.getDefaultIMAPFolders(this);
	    // Sharing current prefs with specified users
	    if (shared_with_users_ids != null)
	    {
		sharedWithUsers = new ArrayList<Key<AgileUser>>();
		for (int i = 0; i < shared_with_users_ids.size(); i++)
		{
		    Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, Long.parseLong(shared_with_users_ids
			    .get(i)));
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
     * Deletes IMAPEmailPrefs.
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
		IMAPEmailPrefs oldIMAPEmailPrefs = IMAPEmailPrefsUtil.getIMAPEmailPrefs(this.id, agileUser);
		this.encrypted_password = oldIMAPEmailPrefs.encrypted_password;
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

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
	return "User name: " + user_name + " Server " + server_name;
    }
}