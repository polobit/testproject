package com.agilecrm.user;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.MD5Util;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
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
public class DomainUser extends Cursor
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
    public static final String COUNTRY = "country";
    public static final String REGION = "region";
    public static final String CITY = "city";
    public static final String LAT_LONG = "lat_long";
    public static final String IP_ADDRESS = "ip_address";

    // Dao
    private static ObjectifyGenericDao<DomainUser> dao = new ObjectifyGenericDao<DomainUser>(
	    DomainUser.class);

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
    public DomainUser(String domain, String email, String name,
	    String password, boolean isAdmin, boolean isAccountOwner)
    {
	this.domain = domain;
	this.email = email;
	this.name = name;
	this.password = password;
	this.is_admin = isAdmin;
	this.is_account_owner = isAccountOwner;
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
	System.out.println("Creating or updating new user " + this);

	// Check if user exists with this email

	if (domainUser != null)
	{
	    // If domain user exists, not allowing to create new user
	    if (this.id == null
		    || (this.id != null && !this.id.equals(domainUser.id)))
	    {
		throw new Exception(
			"User already exists with this email address "
				+ domainUser);
	    }

	    // If domain user exists,setting to name if null
	    if (this.name == null)
	    {
		this.name = domainUser.name;
	    }

	    // If existing domain user is Super User
	    if (domainUser.is_account_owner)
	    {
		this.is_account_owner = true;
		this.is_disabled = false;
		if (!this.is_admin)
		{
		    this.is_admin = true;
		    throw new Exception(
			    "Super user should be Admin and cannot be disabled.");
		}
	    }

	    // To send enabled/disabled user email notification
	    if (domainUser.is_disabled != this.is_disabled)
	    {
		try
		{
		    if (domainUser.is_disabled == true)
			SendMail.sendMail(this.email,
				SendMail.USER_ENABLED_SUBJECT,
				SendMail.USER_ENABLED_NOTIFICATION, this);
		    else
			SendMail.sendMail(this.email,
				SendMail.USER_DISABLED_SUBJECT,
				SendMail.USER_DISABLED_NOTIFICATION, this);

		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
	    }
	}

	// User cannot be admin and disabled
	if (this.is_admin == true && this.is_disabled == true)
	{
	    throw new Exception("User cannot be admin and disabled at a time.");
	}

	// Set to current namespace if it is empty
	if (StringUtils.isEmpty(this.domain))
	{
	    this.domain = NamespaceManager.get();
	    System.out.println("Domain empty - setting it to " + this.domain);
	}

	// Check if namespace is null or empty. Then, do not allow to be created
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
	    if (StringUtils.isEmpty(this.domain))
	    {
		System.out.println("Domain user not created");
		throw new Exception(
			"Domain is empty. Please login again & try.");
	    }

	// Check if new and more than three users
	if (DomainUserUtil.count() >= Globals.TRIAL_USERS_COUNT
		&& this.id == null)
	    throw new Exception(
		    "Please upgrade. You cannot add more than 2 users in the free plan");

	// Sends email, if the user is new
	if (this.id == null)
	{
	    try
	    {
		SendMail.sendMail(this.email, SendMail.WELCOME_SUBJECT,
			SendMail.WELCOME, this);

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
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
	if (password != null && !password.equals(MASKED_PASSWORD))
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
	    }
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
    private void PostLoad() throws DecoderException
    {
	try
	{
	    if (info_json != null)
		info_json = new JSONObject(info_json_string);
	}
	catch (Exception e)
	{
	}
    }

    // To String
    public String toString()
    {
	return "\n Email: " + this.email + " Domain: " + this.domain
		+ "\n IsAdmin: " + this.is_admin + " DomainId: " + this.id
		+ " Name: " + this.name + "\n " + info_json;

    }
}