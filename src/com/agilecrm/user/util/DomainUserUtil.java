package com.agilecrm.user.util;

import java.util.HashMap;
import java.util.Iterator;
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
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.QueryResultIterable;
import com.googlecode.objectify.Key;

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
	DomainUser domainUser = generateNewPassword(email);

	if (domainUser == null)
	    return null;

	domainUser.save();
	return domainUser;
    }

    public static DomainUser generateForgotPassword(String email) throws Exception
    {
	DomainUser user = generateNewPassword(email);

	if (user == null)
	    return null;

	// Set password in different variable as current password will be
	// encrypted before saving.
	String password = user.password;

	user.save();

	user.password = password;

	SendMail.sendMail(email, SendMail.FORGOT_PASSWORD_SUBJECT, SendMail.FORGOT_PASSWORD, user);

	return user;

    }

    private static DomainUser generateNewPassword(String email)
    {
	DomainUser domainUser = getDomainUserFromEmail(email);

	if (email != null && domainUser != null)
	{

	    String randomNumber = RandomStringUtils.randomAlphanumeric(8).toUpperCase();

	    domainUser.password = randomNumber;
	}

	return domainUser;

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
     * Creates domain user key
     */
    public static Key<DomainUser> getDomainUserKey(Long id)
    {
	return new Key<DomainUser>(DomainUser.class, id);
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
     * Get Current User key
     */
    public static Key<DomainUser> getCurentUserKey()
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	    return null;

	return getDomainUserKey(info.getDomainId());
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
	DomainUser user = getDomainUserFromEmail(userInfo.getEmail());

	/*
	 * try { user.postLoad(); } catch (DecoderException e) {
	 * System.out.println("exception exception **************************");
	 * // TODO Auto-generated catch block e.printStackTrace(); }
	 * 
	 * System.out.println("**************************" + user.menu_scopes);
	 */
	return user;
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

    public static DomainUser getDomainUserByEmailFromParticularDomain(String email, String domain)
    {
	String namespace = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return null;

	NamespaceManager.set("");

	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    searchMap.put("email", email);
	    searchMap.put("domain", domain);
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

    public static List<DomainUser> getAllDomainOwners()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Map<String, Object> filter = new HashMap<String, Object>();
	    filter.put("is_account_owner", true);
	    return dao.fetchAll();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static List<Key<DomainUser>> getAllDomainOwnerKeys()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Map<String, Object> filter = new HashMap<String, Object>();
	    filter.put("is_account_owner", true);
	    return dao.listKeysByProperty(filter);
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

	    // return dao.fetchAllByOrder(max, cursor, null, true, false,
	    // "-created_time");
	    // return
	    // dao.ofy().query(DomainUser.class).order("-created_time").list();
	    // return DomainUser.dao.fetchAllByOrder(max, cursor, null, true,
	    // true, "-created_time");
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
	DomainUser user = null;
	try
	{
	    user = dao.ofy().query(DomainUser.class).filter("domain", domain).filter("is_account_owner", true)
		.get();
	    if(user == null)
		user = getDomainOwnerHack(domain);
	}
	finally
	{
		NamespaceManager.set(oldNamespace);
	}

	return user;
    }
    
    /**
     * Fetches domain user based on id if is_account_owner flag is not found
     * @param domain
     * @return
     */
    private static final DomainUser getDomainOwnerHack(String domain)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");
	DomainUser user = null;
	try
	{
	     com.googlecode.objectify.Query<DomainUser> query = dao.ofy().query(DomainUser.class).filter("domain", domain).filter("is_admin", true).limit(1).order("id");
	     QueryResultIterable<DomainUser> users = query.fetch();
	     Iterator<DomainUser> iterator = users.iterator();
	     
	     // We only need one user
	     if (iterator.hasNext() )
	     {
		 user = iterator.next();
		 if(!user.is_account_owner)
		 {
		     user.is_account_owner = true;
		     user.is_admin = true;
		     user.save();
		 }
	     }
	     else
	     {
		 // If admin is not there in account, first user is made admin and account owner
		 query = dao.ofy().query(DomainUser.class).filter("domain", domain).limit(1).order("id");
		 user = query.get();
		 if(user != null && !user.is_account_owner)
		 {
		     user.is_admin = true;
		     user.is_account_owner = true;
		     user.save();
		 }
	     }
		 
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

    /**
     * Overloads getUsers method to fetch domain users without domain parameter.
     * 
     * @return List<DomainUser>
     */
    public static List<DomainUser> getUsers()
    {
	return getUsers(NamespaceManager.get());
    }

    public static void setScopes(DomainUser user)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	    return;

	info.setScopes(user.scopes);
	SessionManager.set(info);
    }

    /**
     * Gets a List of users based on referencecode it is used to display
     * referrals in that patcular domain
     * 
     * all domains it was referred by this domain code
     * 
     * @param id
     * @return
     */
    public static List<DomainUser> getAllDomainUsersBasedOnReferenceDomain(String referencecode)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    return dao.listByProperty("referer.reference_by_domain", referencecode);
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
     * Gets domain user based on his scheduleid
     * 
     * @param name
     *            is schedule id.and schedule id is nothing but his name
     * 
     * @return {@link DomainUser} object
     */
    public static DomainUser getDomainUserFromScheduleId(String scheduleid, String namespace)
    {
	String oldnamespace = NamespaceManager.get();

	if (StringUtils.isEmpty(namespace))
	    return null;

	NamespaceManager.set("");

	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    searchMap.put("schedule_id", scheduleid);
	    searchMap.put("domain", namespace);
	    return dao.getByProperty(searchMap);
	}
	finally
	{
	    NamespaceManager.set(oldnamespace);
	}

    }

    /**
     * Gets domain user based on list of keys
     * 
     * @param userKeys
     *            is list of keys.
     * 
     * @return {@link DomainUser} object
     */
    public static List<DomainUser> getDomainUsersFromKeys(List<Key<DomainUser>> userKeys)
    {
	String oldnamespace = NamespaceManager.get();
	System.out.println("-----------geting Userslist." + userKeys.size());

	NamespaceManager.set("");

	try
	{
	    List<DomainUser> userList = dao.fetchAllByKeys(userKeys);
	    System.out.println("-------users size - " + userList.size());
	    return userList;
	}
	finally
	{

	    NamespaceManager.set(oldnamespace);
	}
    }

}
