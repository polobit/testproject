package com.agilecrm.user;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;

/**
 * <code>AgileUser</code> class stores agileUser entities with domain user id as
 * its attribute.
 * <p>
 * Agile user associated to a domain user is created(using its parameterized
 * constructor), when only the domain user logged in for the very first time.
 * <p>
 * 
 * @author
 * 
 */
@XmlRootElement
@Cached
public class AgileUser
{

    // Key
    @Id
    public Long id;

    /**
     * Associate outer domain user Id
     */
    public Long domain_user_id;

    // Dao
    private static ObjectifyGenericDao<AgileUser> dao = new ObjectifyGenericDao<AgileUser>(AgileUser.class);

    /**
     * Default constructor
     */
    public AgileUser()
    {
    }

    /**
     * Creates an agile user, associate to a domain user using its id
     * 
     * @param domain_user_id
     *            domain user id
     */
    public AgileUser(Long domain_user_id)
    {
	this.domain_user_id = domain_user_id;
    }

    /**
     * Fetches all agile users
     * 
     * @return list of agile users
     */
    public static List<AgileUser> getUsers()
    {
	return dao.fetchAll();
    }

    /**
     * Gets agile user associated with the current domain user
     * 
     * @return current agile user
     */
    public static AgileUser getCurrentAgileUser()
    {
	// Gets user from Domain_id
	return getCurrentAgileUserFromDomainUser(SessionManager.get().getDomainId());
    }

    /**
     * Gets agile user based on domain user id
     * 
     * @param domain_user_id
     *            domain user id to get its associated agile user
     * @return agile user corresponding to a domain user
     */
    public static AgileUser getCurrentAgileUserFromDomainUser(Long domain_user_id)
    {
	return dao.getByProperty("domain_user_id", domain_user_id);
    }

    /**
     * Gets agile user based on agileuser id
     * 
     * @param domain_user_id
     *            domain user id to get its associated agile user
     * @return agile user corresponding to a domain user
     */
    public static AgileUser getCurrentAgileUser(Long agile_userid)
    {
	return dao.getByProperty("id", agile_userid);
    }

    public static AgileUser getUser(Key<AgileUser> userKey)
    {
	try
	{
	    return dao.get(userKey);
	}
	catch (EntityNotFoundException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets domain user based on the id
     * 
     * @return {@link DomainUser}
     */
    public DomainUser getDomainUser()
    {
	return DomainUserUtil.getDomainUser(domain_user_id);
    }

    /**
     * Stores an agile user in database
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Deletes agile user from database
     */
    public void delete()
    {
	dao.delete(this);
    }

    public String toString()
    {
	return "Id: " + id + " domain_user_id " + domain_user_id;
    }
}