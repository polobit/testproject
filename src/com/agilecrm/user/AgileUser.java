package com.agilecrm.user;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

@XmlRootElement
public class AgileUser
{
    // Key
    @Id
    public Long id;

    // Open Id
    public String open_id_user_id;

    // User
    public User open_id_user;

    // Dao
    private static ObjectifyGenericDao<AgileUser> dao = new ObjectifyGenericDao<AgileUser>(
	    AgileUser.class);

    public AgileUser()
    {

    }

    public AgileUser(User openIdUser)
    {
	this.open_id_user_id = openIdUser.getUserId();
	this.open_id_user = openIdUser;
    }

    public static AgileUser getUser(String openId)
    {

	Objectify ofy = ObjectifyService.begin();
	try
	{
	    return ofy.query(AgileUser.class).filter("open_id_user_id", openId)
		    .get();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public void save()
    {
	dao.put(this);
    }

    public String toString()
    {
	return "Id: " + id + " open id " + open_id_user_id + " "
		+ open_id_user.getAuthDomain() + " " + open_id_user.getEmail()
		+ " Name " + open_id_user.getNickname() + " Namespace : "
		+ NamespaceManager.get();
    }

    public static List<AgileUser> getUsers()
    {
	return dao.fetchAll();
    }

    public static AgileUser getCurrentAgileUser()
    {
	// Get UserId of person who is logged in
	User user = AgileUser.getCurrentUser();

	// Agile User
	AgileUser agileUser = AgileUser.getUser(user.getUserId());

	return agileUser;

    }

    // Get Current User
    public static User getCurrentUser()
    {
	// Get UserId of person who is logged in
	UserService userService = UserServiceFactory.getUserService();
	User user = userService.getCurrentUser();
	return user;
    }

    // Delete Agile User
    public void delete()
    {
	dao.delete(this);
    }

}
