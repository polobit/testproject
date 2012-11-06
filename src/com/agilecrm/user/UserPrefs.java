package com.agilecrm.user;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.agilecrm.core.DomainUser;
import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserPrefs
{

    // Key
    @Id
    public Long id;

    @Parent
    private Key<AgileUser> user;

    @NotSaved(IfDefault.class)
    public String pic = null;

    @NotSaved(IfDefault.class)
    public String template = "red";

    @NotSaved(IfDefault.class)
    public String width = "";

    @NotSaved
    public String name = null;

    @NotSaved(IfDefault.class)
    public String timezone = null;

    @NotSaved(IfDefault.class)
    public String currency = null;

    @NotSaved(IfDefault.class)
    public String signature = null;

    @NotSaved(IfDefault.class)
    public boolean task_reminder = true;

    // Dao
    private static ObjectifyGenericDao<UserPrefs> dao = new ObjectifyGenericDao<UserPrefs>(
	    UserPrefs.class);

    UserPrefs(Long userId, String name, String image, String template,
	    String width, String signature, boolean task_reminder)
    {
	this.name = name;
	this.pic = image;
	this.template = template;
	this.width = width;
	this.signature = signature;
	this.task_reminder = task_reminder;

	this.user = new Key<AgileUser>(AgileUser.class, userId);

    }

    UserPrefs()
    {

    }

    public static UserPrefs getCurrentUserPrefs()
    {
	// Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();

	// Get Prefs
	return getUserPrefs(agileUser);
    }

    public static UserPrefs getUserPrefs(AgileUser agileUser)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		agileUser.id);

	UserPrefs userPrefs = ofy.query(UserPrefs.class).ancestor(userKey)
		.get();
	if (userPrefs == null)
	    return getDefaultPrefs(agileUser);

	return userPrefs;
    }

    private static UserPrefs getDefaultPrefs(AgileUser agileUser)
    {
	UserPrefs userPrefs = new UserPrefs(agileUser.id, null, null,
		"default", "", "- Powered by AgileCRM", true);
	userPrefs.save();
	return userPrefs;
    }

    public void save()
    {
	// Wrapping UserPrefs name to DomainUser name

	DomainUser currentDomainUser = DomainUser.getDomainCurrentUser();

	try
	{
	    if ((currentDomainUser != null)
		    && (currentDomainUser.name == null || !currentDomainUser.name
			    .equals(this.name)))
	    {
		currentDomainUser.name = this.name;
		currentDomainUser.save();
		this.name = null;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	dao.put(this);
    }

    public void delete()
    {
	dao.delete(this);
    }

    public static UserPrefs getUserPrefs(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (EntityNotFoundException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}
    }

    public static List<UserPrefs> getAllUserPrefs()
    {
	return dao.fetchAll();
    }

    @XmlElement(name = "name")
    public String getCurrentDomainUserName()
    {
	DomainUser currentDomainUser = DomainUser.getDomainCurrentUser();
	if (currentDomainUser != null && currentDomainUser.name != null)
	    return currentDomainUser.name;

	return "?";
    }

    @XmlElement(name = "agile_user")
    public AgileUser getAgileUser()
    {
	if (user != null)
	    try
	    {
		return dao.ofy().get(user);
	    }
	    catch (Exception e)
	    {
		return null;
	    }

	return null;
    }
}
