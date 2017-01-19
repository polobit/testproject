package com.agilecrm.user;

import java.util.Map;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.account.util.VerifiedEmailsUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.util.GmailSendPrefsUtil;
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
 * @author ravitheja
 * 
 */
@XmlRootElement
@Cached
public class GmailSendPrefs {
	@Id
	public Long id;

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

	public String oauth_code;
	
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
	
	public Type type;

	
	private static ObjectifyGenericDao<GmailSendPrefs> dao = new ObjectifyGenericDao<>(GmailSendPrefs.class);

	
	public GmailSendPrefs() { }
	
	public GmailSendPrefs(AgileUser agileUser, Type type, String code, String token, String refreshToken, 
			String secret, Map<String, String> properties, String expiresIn) {

		this.agileUser = new Key<AgileUser>(AgileUser.class, agileUser.id);
		this.type = type;
		
		this.oauth_code = code;
		this.token = token;
		this.refresh_token = refreshToken;
		if(properties.containsKey("secret")) this.secret = secret;
		
		this.socialId = properties.get("id");
		this.picture = properties.get("pic");
		this.name = properties.get("name");

		if(properties.containsKey("email")) this.email = properties.get("email");
		if(properties.containsKey("picture")) this.picture = properties.get("picture");
		
		if(StringUtils.isNumeric(expiresIn))
			this.expires_at = System.currentTimeMillis() + (Long.parseLong(expiresIn) - 120) * 1000;
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
	 * Saves SMTPPrefs.
	 */
	public void save() {
		dao.put(this);
		//Save gmail can send bulk email in Memcache
		GmailSendPrefsUtil.setGmailSendPrefsIsBulk(this.email, this.bulk_email);
	}

	/**
	 * Deletes SMTPPrefs.
	 */
	public void delete() {
		dao.delete(this);
		
		GmailSendPrefsUtil.setGmailSendPrefsIsBulk(this.email, false);
		//While deleting prefs delete email from verified list
		VerifiedEmailsUtil.deleteVerifiedEmail(this.email);
	}


}