package com.agilecrm.user;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.core.DomainUser;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

@XmlRootElement
public class AgileUser
{
    // Key
    @Id
    public Long id;

    // Associate Outer Domain User Id
    public Long domain_user_id;

    // Dao
    private static ObjectifyGenericDao<AgileUser> dao = new ObjectifyGenericDao<AgileUser>(
	    AgileUser.class);

    public AgileUser()
    {

    }

    public AgileUser(Long domain_user_id)
    {
	this.domain_user_id = domain_user_id;
    }

    public void save()
    {
	dao.put(this);
    }

    public String toString()
    {
	return "Id: " + id + " domain_user_id " + domain_user_id;
    }

    public static List<AgileUser> getUsers()
    {
	return dao.fetchAll();
    }

    public static AgileUser getCurrentAgileUser()
    {
	// Get User from Domain_id
	return getCurrentAgileUserFromDomainUser(SessionManager.get()
		.getDomainId());
    }

    public static AgileUser getCurrentAgileUserFromDomainUser(
	    Long domain_user_id)
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(AgileUser.class)
		.filter("domain_user_id", domain_user_id).get();
    }

    // Get Domain user based on the id
    public DomainUser getDomainUser()
    {
	return DomainUser.getDomainUser(domain_user_id);
    }

    // Delete Agile User
    public void delete()
    {
	dao.delete(this);
    }
}