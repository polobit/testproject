package com.agilecrm.core;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.util.SendMail;
import com.agilecrm.util.Util;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class DomainUser
{
    public static final String MASKED_PASSWORD = "PASSWORD";

    // Key
    @Id
    public Long id;

    // Domain
    public String domain;

    // Email
    public String email;

    // Is Admin
    @NotSaved(IfDefault.class)
    public boolean is_admin = false;

    // Account Owner
    @NotSaved(IfDefault.class)
    public boolean is_account_owner = false;

    @NotSaved(IfDefault.class)
    public boolean is_disabled = false;

    // Email content to be sent for the first time
    @NotSaved
    public String email_template = null;

    // Domain UserName
    @NotSaved(IfDefault.class)
    public String name = null;

    // Domain Password
    @NotSaved
    public String password = MASKED_PASSWORD;

    @NotSaved(IfDefault.class)
    private String encrypted_password = null;

    // Misc User Info
    @NotSaved(IfDefault.class)
    public String info_json_string = null;

    @NotSaved(IfDefault.class)
    public String gadget_id = null;

    @NotSaved
    private JSONObject info_json = new JSONObject();

    // Info Keys
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

    public DomainUser()
    {

    }

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

    // Generate password
    public static DomainUser generatePassword(String email)
    {
	DomainUser domainUser = getDomainUserFromEmail(email);

	if (email != null && domainUser != null)
	{
	    String oldNamespace = NamespaceManager.get();
	    NamespaceManager.set("");

	    String randomNumber = RandomStringUtils.randomAlphanumeric(8)
		    .toUpperCase();

	    domainUser.password = randomNumber;

	    // Send an email with the new password
	    SendMail.sendMail(email, SendMail.FORGOT_PASSWORD_SUBJECT,
		    SendMail.FORGOT_PASSWORD, domainUser);

	    try
	    {
		domainUser.save();
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    finally
	    {
		NamespaceManager.set(oldNamespace);
	    }
	    return domainUser;
	}
	else
	{
	    return null;
	}

    }

    @PrePersist
    private void PrePersist()
    {
	// Store Created
	if (!hasInfo(CREATED_TIME))
	    setInfo(CREATED_TIME, new Long(System.currentTimeMillis() / 1000));

	// Store password
	if (password != null && !password.equals(MASKED_PASSWORD))
	{
	    // Encrypt password while saving
	    encrypted_password = Util.getMD5HashedPassword(password);
	}
	else
	{
	    // Get password from old values
	    if (this.id != null)
	    {
		// Get Old password
		DomainUser oldDomainUser = DomainUser.getDomainUser(id);
		this.encrypted_password = oldDomainUser.encrypted_password;
	    }
	}

	info_json_string = info_json.toString();

	// Lowercase
	email = StringUtils.lowerCase(email);
	domain = StringUtils.lowerCase(domain);
    }

    public String getPasswordString()
    {
	return encrypted_password;
    }

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

    // Get user with id
    public static DomainUser getDomainUser(Long id)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    // Get Users
    public static List<DomainUser> getUsers(String domain)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Objectify ofy = ObjectifyService.begin();
	    return ofy.query(DomainUser.class).filter("domain", domain).list();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }

    // Get DomainUser for the current user
    public static DomainUser getDomainCurrentUser()
    {
	// Get Current Logged In user
	UserInfo userInfo = SessionManager.get();
	return getDomainUserFromEmail(userInfo.getEmail());
    }

    // Get Users
    public static DomainUser getDomainUserFromEmail(String email)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Objectify ofy = ObjectifyService.begin();
	    return ofy.query(DomainUser.class).filter("email", email).get();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    // Get Users
    public static DomainUser getDomainUserFromGadgetId(String gadgetId)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Objectify ofy = ObjectifyService.begin();
	    return ofy.query(DomainUser.class).filter("gadget_id", gadgetId)
		    .get();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    // Save
    public void save() throws Exception
    {
	System.out.println("Creating or updating new user " + this);
	// Check if user exists with this email
	DomainUser domainUser = getDomainUserFromEmail(email);
	if (domainUser != null)
	    // if domain user exists, not allowing to create new user
	    if (this.id == null
		    || (this.id != null && !this.id.equals(domainUser.id)))
	    {
		System.out.println(this.id + " " + domainUser.id);
		throw new Exception(
			"User already exists with this email address "
				+ domainUser);
	    }

	// Set to current namespace if it is empty
	if (StringUtils.isEmpty(this.domain))
	{
	    this.domain = NamespaceManager.get();
	    System.out.println("Domain empty - setting it to " + this.domain);
	}

	// Check if namespace is null or empty. Then, do not allow to be
	// created
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
	    if (StringUtils.isEmpty(this.domain))
	    {
		System.out.println("Domain user not created");
		throw new Exception(
			"Domain is empty. Please login again & try.");
	    }

	// Check if new and more than three users
	if (count() >= Globals.TRIAL_USERS_COUNT && this.id == null)
	    throw new Exception(
		    "Please upgrade. You cannot add more than 2 users in the free plan");

	// Super User should always be the admin
	if (this.is_account_owner && !this.is_admin)
	{
	    this.is_admin = true;
	}

	// Send Email
	if (this.id == null)
	{
	    try
	    {
		SendMail.sendMail(this.email,
			SendMail.NEW_USER_INVITED_SUBJECT,
			SendMail.NEW_USER_INVITED, this);

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

    // Delete Contact
    public void delete()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	dao.delete(this);
	NamespaceManager.set(oldNamespace);
    }

    public static int count()
    {
	String domain = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    return dao.ofy().query(DomainUser.class).filter("domain", domain)
		    .count();
	}
	finally
	{
	    NamespaceManager.set(domain);
	}
    }

    // To String
    public String toString()
    {
	return " Email: " + this.email + " Domain: " + this.domain
		+ " IsAdmin: " + this.is_admin + " DomainId: " + this.id
		+ " Name:" + name + " " + " " + info_json;

    }

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

}