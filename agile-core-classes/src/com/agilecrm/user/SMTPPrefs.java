package com.agilecrm.user;

import java.io.Serializable;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.codec.DecoderException;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.account.util.VerifiedEmailsUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.SMTPPrefsUtil;
import com.agilecrm.util.EncryptDecryptUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>SMTPPrefs</code> is the base class for setting SMTP Exchange Email
 * Preferences.
 * <p>
 * Email sent by a contact can be viewed directly within AgileCRM by setting
 * SMTPPrefs. User should set Email Server host, username and Password.
 * </p>
 * 
 * @author Manohar
 * 
 */
@SuppressWarnings("serial")
@XmlRootElement
@Cached
public class SMTPPrefs implements Serializable {
	
	@Id
	public Long id;

	@NotSaved(IfDefault.class)
	public String server_url = null;

	@NotSaved(IfDefault.class)
	public String server_host = null;
	
	@NotSaved(IfDefault.class)
	public String user_name = null;

	@NotSaved
	public String password = MASKED_PASSWORD;

	@NotSaved(IfDefault.class)
	private String encrypted_password = null;
	
	/**
     * User can send bulk email
     */
    @NotSaved(IfDefault.class)
    public boolean bulk_email = false;
    
    /**
     * Max per day limit of gmail
     */
    @NotSaved(IfDefault.class)
    public long max_email_limit = 200L;
    
    /**
     * Email sent we will append while showing from Memcache
     */
    @NotSaved
    public long email_sent_count = 0;

	@Parent
	@JsonIgnore
	private Key<AgileUser> agileUser;

	/*@JsonIgnore
	@NotSaved(IfDefault.class)
	public List<Key<AgileUser>> sharedWithUsers;

	@NotSaved
	public List<String> shared_with_users_ids;*/

	public boolean isUpdated;
	public boolean is_secure = false;
	public static final String MASKED_PASSWORD = "PASSWORD";

	private static ObjectifyGenericDao<SMTPPrefs> dao = new ObjectifyGenericDao<SMTPPrefs>(
			SMTPPrefs.class);

	public SMTPPrefs() {
	}

	/**
	 * Constructs a new {@link SMTPPrefs}.
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
	public SMTPPrefs(String host, String userName, String password, boolean isSecure) {
		this.server_url = host;
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
	public void setAgileUser(Key<AgileUser> agileUser) {
		this.agileUser = agileUser;
	}

	/**
	 * Returns AgileUser Key.
	 * 
	 * @return AgileUser object
	 */
	public Key<AgileUser> getAgileUser() {
		return agileUser;
	}

	/**
	 * Returns list of users, to which current user IMAP settings are sharing
	 * 
	 * @return
	 */
	/*public List<Key<AgileUser>> getSharedWithUsers() {
		return sharedWithUsers;
	}*/

	/**
	 * Sets list of users, to which current user IMAP settings are sharing
	 * 
	 * @return
	 */
	/*public void setSharedWithUsers(List<Key<AgileUser>> sharedUsers) {
		this.sharedWithUsers = sharedUsers;
	}*/

	/**
	 * Saves SMTPPrefs.
	 */
	public void save() {
		try {
			// Verify SMTP Exchange credentials
			SMTPPrefsUtil.checkSMTPPrefs(this);

			// Sharing current prefs with specified users
			/*if(shared_with_users_ids != null) {
				sharedWithUsers = new ArrayList<Key<AgileUser>>();
				for(int i = 0; i < shared_with_users_ids.size(); i++) {
					Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
							Long.parseLong(shared_with_users_ids.get(i)));
					sharedWithUsers.add(userKey);
				}
			}*/
		} catch(Exception e) {
			e.printStackTrace();
			throw new WebApplicationException(Response
					.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
		dao.put(this);
		
		//Put SMTP bulk email send status to Memcache
		SMTPPrefsUtil.setSMTPSendPrefsIsBulk(this.user_name, this.bulk_email);
	}

	/**
	 * Deletes SMTPPrefs.
	 */
	public void delete() {
		dao.delete(this);
		
		//Put SMTP bulk email send status  as a false to Memcache
		SMTPPrefsUtil.setSMTPSendPrefsIsBulk(this.user_name, false);
		
		//While deleting SMTP prefs delete verified email address
		VerifiedEmailsUtil.deleteVerifiedEmail(this.user_name);
	}

	/**
	 * Encrypts the given password. If password is not changed, remains old
	 * encrypted password.
	 */
	@PrePersist
	private void PrePersist() {
		if(!password.equalsIgnoreCase(MASKED_PASSWORD)) {
			// Encrypt password while saving
			encrypted_password = EncryptDecryptUtil.encrypt(password);
		} else {
			if(this.id != null) {
				// Get Old password
				SMTPPrefs oldSMTPPrefs = SMTPPrefsUtil.getSMTPPrefs(this.id, agileUser);
				this.encrypted_password = oldSMTPPrefs.encrypted_password;
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
	private void PostLoad() throws DecoderException {
		if(encrypted_password != null) {
			// Decrypt password
			password = EncryptDecryptUtil.decrypt(encrypted_password);
		}
	}

	/**
	 * Override toString()
	 */
	public String toString() {
		return "User name: " + user_name + " Server " + server_url;
	}
}