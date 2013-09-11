package com.agilecrm.user.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>DomainUserUtil</code> is utility class used to process data of
 * {@link DomainUser} class, It processes only when fetching the data from
 * <code>DomainUser<code> class.
 * <p>
 * Sets the name space manager to empty to fetch data. Once fetching is done 
 * sets back to old name space
 * </p>
 * <p>
 * This utility class includes methods needed to return the users based on 
 * id, email and name of the domain.  
 * DomainUser utility methods return all users, user tracked by an id and
 * users of a specific domain.
 * </p>
 * 
 * @author
 * 
 */
public class DomainUserUtil
{
    // Dao
    public static ObjectifyGenericDao<DomainUser> dao = new ObjectifyGenericDao<DomainUser>(DomainUser.class);

    /**
     * Generates a password of length eight characters and sends an email to the
     * user.
     * 
     * Gets the domain user based on its email and assigns the generated
     * password to it and saves the user again.
     * 
     * @param email
     *            email address of the user
     * @return {@link DomainUser} object
     * @throws Exception
     */
    public static DomainUser generatePassword(String email) throws Exception
    {
	DomainUser domainUser = getDomainUserFromEmail(email);

	if (email != null && domainUser != null)
	{
	    /*
	     * Commented to send forgot password mail also to OpenId users
	     * if(StringUtils.isEmpty(domainUser.getHashedString())) { throw new
	     * Exception(); }
	     */
	    String oldNamespace = NamespaceManager.get();
	    NamespaceManager.set("");

	    String randomNumber = RandomStringUtils.randomAlphanumeric(8).toUpperCase();

	    domainUser.password = randomNumber;

	    // Send an email with the new password
	    SendMail.sendMail(email, SendMail.FORGOT_PASSWORD_SUBJECT, SendMail.FORGOT_PASSWORD, domainUser);

	    try
	    {
		domainUser.save();
	    }
	    catch (Exception e)
	    {
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

    /**
     * Gets a user based on its id
     * 
     * @param id
     * @return
     */
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

    /**
     * Gets list of domain users of given domain
     * 
     * @param domain
     *            name of the domain
     * @return list of domain users
     */
    public static List<DomainUser> getUsers(String domain)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return dao.listByProperty("domain", domain);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Gets current domain user using SessionManager
     * 
     * @return current domain user
     */
    public static DomainUser getCurrentDomainUser()
    {
	// Get Current Logged In user
	UserInfo userInfo = SessionManager.get();
	if (userInfo == null)
	    return null;

	return getDomainUserFromEmail(userInfo.getEmail());
    }

    /**
     * Gets domain user based on its email
     * 
     * @param email
     *            email of the user
     * @return {@link DomainUser} object
     */
    public static DomainUser getDomainUserFromEmail(String email)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return dao.getByProperty("email", email);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static DomainUser getDomainUserByEmailFromCurrentAccount(String email)
    {
	String namespace = NamespaceManager.get();

	if (StringUtils.isEmpty(namespace))
	    return null;

	NamespaceManager.set("");

	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    searchMap.put("email", email);
	    searchMap.put("domain", namespace);
	    return dao.getByProperty(searchMap);
	}
	finally
	{
	    NamespaceManager.set(namespace);
	}
    }

    /**
     * Gets domain user based on gadget_id
     * 
     * @param gadgetId
     *            to get domain user
     * @return domain user entity
     */
    public static DomainUser getDomainUserFromGadgetId(String gadgetId)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return dao.getByProperty("gadget_id", gadgetId);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Fetches all domain users
     * 
     * @return list of domain users
     */
    public static List<DomainUser> getAllUsers()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return dao.fetchAll();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Returns list of domain users based on page size.
     * 
     * @param max
     *            Maximum number of domain users list based on page size query
     *            param.
     * @param cursor
     *            Cursor string that points the list that exceeds page_size.
     * @return Returns list of domain users with respective to page size and
     *         cursor.
     */
    public static List<DomainUser> getAllDomainUsers(int max, String cursor)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return dao.fetchAll(max, cursor);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Gets account owners of the given domain
     * 
     * @param domain
     *            name of the domain
     * @return domain user, who is owner
     */
    public static DomainUser getDomainOwner(String domain)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	DomainUser user = dao.ofy().query(DomainUser.class).filter("domain", domain).filter("is_account_owner", true)
		.get();

	NamespaceManager.set(oldNamespace);
	return user;
    }

    /**
     * Gets number of users in a domain
     * 
     * @return number of users in a domain
     */
    public static int count()
    {
	return count(NamespaceManager.get());
    }

    public static int count(String domain)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{
	    return dao.ofy().query(DomainUser.class).filter("domain", domain).count();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}