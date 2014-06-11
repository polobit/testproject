package com.agilecrm.user;

import java.io.Serializable;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.account.NavbarConstants;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>DomainUser</code> class stores the users of agileCRM in database, by
 * setting the name space to empty. User's created time is assigned with in this
 * class while its creation but its logged_in time is assigned in
 * <code>HomeServlet</code> class while the user is logged in to agileCRM.
 * <p>
 * It stores encrypted password in database and allows default password
 * (MASKED_PASSWORD) to travel through the network along with encrypted, by
 * assigning the default one to its "password" attribute.
 * </p>
 * <p>
 * Accessibility of the user is limited based on "is_admin" attribute value of
 * the user.
 * </p>
 * 
 * @author
 * 
 */
@XmlRootElement
@Cached
public class DomainUser extends Cursor implements Cloneable, Serializable
{

    // Key
    @Id
    public Long id;

    /**
     * Domain of the user
     */
    public String domain;

    /**
     * Email of the user
     */
    public String email;

    /**
     * Specifies the user accessibility
     */
    @NotSaved(IfDefault.class)
    public boolean is_admin = false;

    /**
     * Specifies the user ownership
     */
    @Indexed
    @NotSaved(IfDefault.class)
    public boolean is_account_owner = false;

    /**
     * Makes the user disable for its true value
     */
    @NotSaved(IfDefault.class)
    public boolean is_disabled = false;

    /**
     * Email content to be sent for the first time
     */
    @NotSaved
    public String email_template = null;

    /**
     * Stores user access scopes
     */
    @NotSaved(IfDefault.class)
    public HashSet<UserAccessScopes> scopes = null;

    @NotSaved(IfDefault.class)
    public LinkedHashSet<NavbarConstants> menu_scopes = null;

    /**
     * Name of the domain user
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Assigns its value to password attribute
     */
    public static final String MASKED_PASSWORD = "PASSWORD";

    /**
     * Domain Password
     */
    @NotSaved
    public String password = MASKED_PASSWORD;

    /**
     * Stores encrypted password
     */
    @NotSaved(IfDefault.class)
    private String encrypted_password = null;

    /**
     * Misc User Info
     */
    @NotSaved(IfDefault.class)
    public String info_json_string = null;

    /**
     * Gadget id of the user
     */
    @NotSaved(IfDefault.class)
    public String gadget_id = null;

    /**
     * Stores created time and logged_in time of the user
     */
    @NotSaved
    private JSONObject info_json = new JSONObject();

    /**
     * Info Keys of the user
     */
    public static final String CREATED_TIME = "created_time";
    public static final String LOGGED_IN_TIME = "logged_in_time";
    public static final String LAST_LOGGED_IN_TIME = "last_logged_in_time";
    public static final String COUNTRY = "country";
    public static final String REGION = "region";
    public static final String CITY = "city";
    public static final String LAT_LONG = "lat_long";
    public static final String IP_ADDRESS = "ip_address";

    // Dao
    private static ObjectifyGenericDao<DomainUser> dao = new ObjectifyGenericDao<DomainUser>(DomainUser.class);

    /**
     * Default constructor
     */
    public DomainUser()
    {

    }

    /**
     * Constructs new {@link DomainUser} entity with the following parameters
     * 
     * @param domain
     *            domain of the user
     * @param email
     *            email of the user to login into agileCRM
     * @param name
     *            name of the user
     * @param password
     *            password to login into agileCRM
     * @param isAdmin
     *            specifies the accessibility of the user
     * @param isAccountOwner
     *            specifies ownership
     */
    public DomainUser(String domain, String email, String name, String password, boolean isAdmin, boolean isAccountOwner)
    {
	this.domain = domain;
	this.email = email;
	this.name = name;
	this.password = password;
	this.is_admin = isAdmin;
	this.is_account_owner = isAccountOwner;
    }

    /**
     * Sends notification on disabling or enabling the domain user
     */
    private void sendNotification()
    {
	try
	{
	    if (is_disabled)
		sendEmail(SendMail.USER_DISABLED_SUBJECT, SendMail.USER_DISABLED_NOTIFICATION);
	    else
		sendEmail(SendMail.USER_ENABLED_NOTIFICATION, SendMail.USER_ENABLED_NOTIFICATION);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Checks maximum users allowed in the domain, and throws exception if
     * maximum allowed users quantity exceeds
     * 
     * @return
     * @throws Exception
     */
    private boolean checkMaxUsersInPlan() throws Exception
    {
	if (DomainUserUtil.count() != 0)
	{
	    // Get subscription details of account
	    Subscription subscription = Subscription.getSubscription();

	    // If subscription is null, it indicates user is in free plan.
	    // Limits users to global trail users count
	    if (subscription == null && DomainUserUtil.count() >= Globals.TRIAL_USERS_COUNT)
		throw new Exception("Please upgrade. You cannot add more than " + Globals.TRIAL_USERS_COUNT
			+ " users in the free plan");

	    // If Subscription is not null then limits users to current plan
	    // quantity).
	    if (subscription != null && DomainUserUtil.count() >= subscription.plan.quantity)
		throw new Exception("Please upgrade. You cannot add more than " + subscription.plan.quantity
			+ " users in the current plan");

	    return false;
	}
	return false;
    }

    /**
     * Sends welcome email to user on creating a new one. It clones user and
     * marks password as null if it is openid registration as it can be checked
     * in email template
     */
    private void sendWelcomeEmail()
    {
	try
	{
	    // Cloned as we change password to null if user from open id
	    // registration. so it can be checked in email template
	    // based on
	    // password field
	    DomainUser user = (DomainUser) this.clone();

	    if (user.password.equals(MASKED_PASSWORD))
		user.password = null;

	    user.sendEmail(SendMail.WELCOME_SUBJECT, SendMail.WELCOME);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Send password changed notification e-mail to user via function
     * user.SendMail
     * 
     * @param oldPassword
     *            - old encrypted password of the user, handles even if its null
     */
    private void sendPasswordChangedNotification(String oldPassword)
    {
	try
	{
	    if (StringUtils.equals(this.password, MASKED_PASSWORD))
		return;

	    String newhash = MD5Util.getMD5HashedPassword(this.password);

	    if (StringUtils.equals(newhash, oldPassword))
		return;

	    // no need to send any mail, password hasn't changed.

	    // Cloned as we change password to null if user from open id
	    // registration. so it can be checked in email template
	    // based on
	    // password field
	    DomainUser user = (DomainUser) this.clone();

	    if (user.password.equals(MASKED_PASSWORD))
		user.password = null;

	    user.sendEmail(SendMail.PASSWORD_CHANGE_NOTIFICATION_SUBJECT, SendMail.PASSWORD_CHANGE_NOTIFICATION);
	    System.out.println("SENT-CHANGED:-----------------");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Checks if super user is being marked as not admin. It compares with
     * existing user with current change
     * 
     * @param user
     * @return
     * @throws Exception
     */
    private void checkSuperUserDisabled(DomainUser user) throws Exception
    {
	// If existing domain user is Super User
	if (user.is_account_owner)
	{
	    // If user is account owner then account owner should be set to true
	    // when it is being updated
	    this.is_account_owner = true;

	    if (!is_admin)
		throw new Exception(user.name + " is the owner of '" + user.domain
			+ "' domain and should be an <b>admin</b>. You can change the Email and Name instead.");
	}
    }

    /**
     * Checks if user is admin and disabled
     * 
     * @throws Exception
     */
    private void checkAdminDisabled() throws Exception
    {
	// User cannot be admin and disabled
	if (this.is_admin == true && this.is_disabled == true)
	{
	    throw new Exception("Can not disable Admin user. You should remove admin privilege first.");
	}
    }

    /**
     * Sends email with template and subject chosen, and sends to domain user's
     * email. It passes current domain user to fill the template.
     * 
     * @param subject
     * @param template
     */
    private void sendEmail(String subject, String template)
    {
	SendMail.sendMail(this.email, subject, template, this);
    }

    /**
     * Gets encrypted password
     * 
     * @return encrypted password
     */
    public String getHashedString()
    {
	return encrypted_password;
    }

    /**
     * Saves domain user by validating the existence of duplicates and the
     * values of the attributes "is_admin" and "is_disable" (i.e both can't be
     * true) and also no.of users in the domain.
     * 
     * @throws Exception
     */
    public void save() throws Exception
    {
	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);

	// Set to current namespace if it is empty
	if (StringUtils.isEmpty(this.domain))
	{
	    this.domain = NamespaceManager.get();
	    System.out.println("Domain empty - setting it to " + this.domain);
	}

	System.out.println("Creating or updating new user " + this);

	// Check if user exists with this email

	if (domainUser != null)
	{
	    // If domain user exists, not allowing to create new user
	    if (this.id == null || (this.id != null && !this.id.equals(domainUser.id)))
	    {
		throw new Exception("User with this email address " + domainUser.email + " already exists in "
			+ domainUser.domain + " domain.");
	    }

	    // Checks if super user is disabled, and throws exception if super
	    // is disabled
	    checkSuperUserDisabled(domainUser);

	    // Checks and throws exception if user is admin and disabled
	    checkAdminDisabled();

	    // To send enabled/disabled user email notification
	    if (domainUser.is_disabled != this.is_disabled)
	    {
		sendNotification();
	    }

	    sendPasswordChangedNotification(domainUser.encrypted_password);
	}

	// Check if namespace is null or empty. Then, do not allow to be created
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
	    if (StringUtils.isEmpty(this.domain))
	    {
		System.out.println("Domain user not created");
		throw new Exception("Domain is empty. Please login again & try.");
	    }

	// Sends email, if the user is new
	if (this.id == null)
	{
	    if (checkMaxUsersInPlan())
		return;

	    sendWelcomeEmail();
	}

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    dao.put(this);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Deletes domain user
     */
    public void delete()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	dao.delete(this);
	NamespaceManager.set(oldNamespace);
    }

    /**
     * Sets information to info_json
     * 
     * @param key
     *            name of the key (crated_time or updated_time)
     * @param value
     *            value to be associated with the key
     */
    public void setInfo(String key, Object value)
    {
	if (value == null)
	    return;
	try
	{
	    info_json.put(key, value);
	}
	catch (Exception e)
	{
	}
    }

    /**
     * Gets value associated with the given key
     * 
     * @param key
     *            name of the key
     * @return value of the key
     */
    public Object getInfo(String key)
    {
	try
	{
	    return info_json.getString(key);
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Checks whether the given key has a value or not
     * 
     * @param key
     *            name of the key
     * @return boolean value based on value of the key
     */
    public boolean hasInfo(String key)
    {
	try
	{
	    return info_json.has(key);
	}
	catch (Exception e)
	{
	    return false;
	}
    }

    /**
     * Check is user is registered via OpenID.<br/>
     * For OpenID we have <code>encrypted_password</code> as <code>null</code>.
     * This parameter is not sent on network when the object is serialized.
     * 
     * @return - true if user is registered via OpenId
     */
    @JsonIgnore
    public boolean isOpenIdRegisteredUser()
    {
	return StringUtils.isEmpty(encrypted_password);
    }

    /**
     * Assigns values to info_json_string and for created time and encrypted
     * password based on their old values.
     */
    @PrePersist
    private void PrePersist()
    {
	// Stores created time in info_json
	if (!hasInfo(CREATED_TIME))
	    setInfo(CREATED_TIME, new Long(System.currentTimeMillis() / 1000));

	// Stores password
	if (!StringUtils.isEmpty(password) && !password.equals(MASKED_PASSWORD))
	{
	    // Encrypt password while saving
	    encrypted_password = MD5Util.getMD5HashedPassword(password);
	}
	else
	{
	    // Gets password from old values
	    if (this.id != null)
	    {
		// Get Old password
		DomainUser oldDomainUser = DomainUserUtil.getDomainUser(id);
		this.encrypted_password = oldDomainUser.encrypted_password;

		// Somewhere name is going null which updating.
		if (this.name == null)
		    this.name = oldDomainUser.name;
	    }
	}

	if (scopes == null || scopes.size() == 0)
	{
	    scopes = new LinkedHashSet<UserAccessScopes>();
	    scopes.add(UserAccessScopes.RESTRICTED);
	}

	info_json_string = info_json.toString();

	// Lowercase
	email = StringUtils.lowerCase(email);
	domain = StringUtils.lowerCase(domain);
    }

    /**
     * Gets execute on saving a user, and assigns data to info_json when it is
     * not null
     * 
     * @throws DecoderException
     */
    @PostLoad
    public void postLoad() throws DecoderException
    {
	try
	{
	    if (info_json != null)
		info_json = new JSONObject(info_json_string);

	    // If no scopes are set, then all scopes are added
	    if (scopes == null)
		scopes = new LinkedHashSet<UserAccessScopes>(Arrays.asList(UserAccessScopes.values()));

	    if (menu_scopes == null)
	    {
		menu_scopes = new LinkedHashSet<NavbarConstants>(Arrays.asList(NavbarConstants.values()));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    // To String
    @Override
    public String toString()
    {
	return "\n Email: " + this.email + " Domain: " + this.domain + "\n IsAdmin: " + this.is_admin + " DomainId: "
		+ this.id + " Name: " + this.name + "\n " + info_json;
    }
}