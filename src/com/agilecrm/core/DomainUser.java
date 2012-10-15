package com.agilecrm.core;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.Globals;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class DomainUser
{
    // Key
    @Id
    public Long id;

    // Domain
    public String domain;

    // User
    public User open_id_user;

    // Email - we store this only when the user is invited
    public String email;

    // Is Admin
    public boolean is_admin = true;

    @NotSaved(IfDefault.class)
    public boolean is_disabled = false;

    // Email content to be sent for the first time
    @NotSaved
    public String email_template = null;

    // Dao
    private static ObjectifyGenericDao<DomainUser> dao = new ObjectifyGenericDao<DomainUser>(
	    DomainUser.class);

    public DomainUser()
    {

    }

    public DomainUser(User user, String domain, boolean isAdmin)
    {
	this.domain = domain;

	if (user != null)
	{
	    this.open_id_user = user;
	    this.email = user.getEmail();
	}

	this.is_admin = isAdmin;
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

    // Get Users
    public static DomainUser getDomainUserFromEmail(String email, String domain)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Objectify ofy = ObjectifyService.begin();
	    return ofy.query(DomainUser.class).filter("email", email)
		    .filter("domain", domain).get();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }

    // Get DomainUser for the current user
    public static DomainUser getDomainCurrentUser()
    {
	// Get UserId of person who is logged in
	User user = AgileUser.getCurrentUser();

	System.out.println("Current user " + user + " " + user.getEmail());
	if (user == null)
	    return null;

	// Get Domain - Current Namespace is the domain
	String domain = NamespaceManager.get();
	System.out.println("Current domain " + domain);

	// Get Email
	String email = user.getEmail();

	DomainUser domainUser = null;

	// Find Domain user
	if (!StringUtils.isEmpty(domain))
	{
	    domainUser = getDomainUserFromEmail(email, domain);
	    if (domainUser != null)
		return domainUser;
	}

	return getDomainUserFromEmail(email);

	/*
	 * String oldNamespace = NamespaceManager.get();
	 * NamespaceManager.set("");
	 * 
	 * try { Objectify ofy = ObjectifyService.begin(); return
	 * ofy.query(DomainUser.class).filter("user", user).filter("domain",
	 * domain).get(); } finally { NamespaceManager.set(oldNamespace); }
	 */
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

    // Save
    public void save() throws Exception
    {

	System.out.println("Creating or updating new user " + this);

	// Check if user exists with this email
	DomainUser domainUser = getDomainUserFromEmail(email);
	if ((domainUser != null) && !this.id.equals(domainUser.id))
	{
	    throw new Exception("User already exists with this email address "
		    + domainUser);
	}

	String oldNamespace = NamespaceManager.get();

	// Override the domain in the domain user with the name space
	this.domain = NamespaceManager.get();

	// Check if old namespace is null or empty. Then, do not allow to be
	// created
	if (StringUtils.isEmpty(this.domain))
	{
	    System.out.println("Domain user not created");
	    throw new Exception("Domain is empty. Please login again & try.");
	}

	// Check if new and more than three users
	if (count() >= Globals.TRIAL_USERS_COUNT && this.id == null)
	    throw new Exception(
		    "Please upgrade. You cannot add more than 2 users in the free plan");

	// Send Email
	if (this.id == null)
	{
	    SendMail.sendMail(this.email, "New User Invitation",
		    SendMail.NEW_USER_INVITED, this);
	}

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

    public int count()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    return dao.ofy().query(DomainUser.class).filter("domain", domain)
		    .count();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    // To String
    public String toString()
    {
	return "Email " + this.email + " " + this.domain + " " + this.is_admin
		+ " " + this.id;

    }
}