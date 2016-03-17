package com.agilecrm.user.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.projectedpojos.OpportunityPartial;
import com.agilecrm.projectedpojos.PartialDAO;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PropertyProjection;
import com.google.appengine.api.datastore.QueryResultIterable;
import com.google.appengine.api.datastore.QueryResultIterator;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.cache.CachingDatastoreServiceFactory;

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
    
    // Partial Dao
    public static PartialDAO<DomainUserPartial> partialDAO = new PartialDAO<DomainUserPartial>(DomainUserPartial.class);

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
     * Gets a user based on its id
     * 
     * @param id
     * @return
     */
    public static DomainUserPartial getPartialDomainUser(Long id)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
		return partialDAO.get(id);
	}
	catch (Exception e)
	{
		System.out.println(ExceptionUtils.getFullStackTrace(e));
	    e.printStackTrace();
	    return null;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
    
    /**
     * Gets a user based on its id
     * 
     * @param id
     * @return
     */
    public static List<DomainUserPartial> getPartialDomainUsers(String domainname)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
		Map map = new HashMap();
		map.put("domain", domainname);
		
		return partialDAO.listByProperty(map);
		
	}
	catch (Exception e)
	{
		System.out.println(ExceptionUtils.getFullStackTrace(e));
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
	    List<DomainUser> domainUsers = dao.listByProperty("domain", domain);

	    // Now sort by name.
	    Collections.sort(domainUsers, new Comparator<DomainUser>()
	    {
		public int compare(DomainUser one, DomainUser other)
		{
		    return one.name.toLowerCase().compareTo(other.name.toLowerCase());
		}
	    });

	    return domainUsers;
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

    public static Set<String> getAllDomainsUsingIterator()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Set<String> domains = new HashSet<String>();
	    Query<DomainUser> query = dao.ofy().query(DomainUser.class).filter("is_account_owner", true);
	    QueryResultIterator<DomainUser> iterator = query.iterator();
	    while (iterator.hasNext())
	    {
		DomainUser user = iterator.next();
		// Temporary list
		domains.add(user.domain);
	    }
	    return domains;
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
	    user = dao.ofy().query(DomainUser.class).filter("domain", domain).filter("is_account_owner", true).get();
	    if (user == null)
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
     * 
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
	    com.googlecode.objectify.Query<DomainUser> query = dao.ofy().query(DomainUser.class)
		    .filter("domain", domain).filter("is_admin", true).limit(1).order("id");
	    QueryResultIterable<DomainUser> users = query.fetch();
	    Iterator<DomainUser> iterator = users.iterator();

	    // We only need one user
	    if (iterator.hasNext())
	    {
		user = iterator.next();
		if (!user.is_account_owner)
		{
		    user.is_account_owner = true;
		    user.is_admin = true;
		    user.save();
		}
	    }
	    else
	    {
		// If admin is not there in account, first user is made admin
		// and account owner
		query = dao.ofy().query(DomainUser.class).filter("domain", domain).limit(1).order("id");
		user = query.get();
		if (user != null && !user.is_account_owner)
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
	    DomainUser domainuser = dao.getByProperty(searchMap);
	    if (domainuser == null)
		domainuser = getDomainUserFromScheduleIdCaseInsensitve(namespace, scheduleid);
	    return domainuser;
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

    /**
     * Returns list of User Keys
     * 
     * @return List
     */
    public static List<Key<DomainUser>> getDomainUserKeys(String domain)
    {
	String oldnamespace = NamespaceManager.get();

	NamespaceManager.set("");

	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    searchMap.put("domain", domain);

	    return dao.listKeysByProperty(searchMap);
	}
	finally
	{
	    NamespaceManager.set(oldnamespace);
	}

    }

    /**
     * fetch domain user by using case insensitive comparision of schedule id
     * 
     * @param domain
     * @param schedule_id
     * @return
     */
    public static DomainUser getDomainUserFromScheduleIdCaseInsensitve(String domain, String schedule_id)
    {
	List<DomainUser> domain_users = getUsers(domain);

	for (DomainUser dm_us : domain_users)
	{
	    if (schedule_id.equalsIgnoreCase(dm_us.schedule_id))
	    {
		return dm_us;
	    }
	}
	return null;

    }

    public static List<DomainUser> getAllAdminUsers(String domain)
    {
	String oldnamespace = NamespaceManager.get();

	NamespaceManager.set("");

	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    searchMap.put("is_admin", true);
	    searchMap.put("domain", domain);

	    return dao.listByProperty(searchMap);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting admin users..." + e.getMessage());
	    return null;
	}
	finally
	{

	    NamespaceManager.set(oldnamespace);
	}
    }
    

}
