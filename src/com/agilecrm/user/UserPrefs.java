package com.agilecrm.user;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.agilecrm.core.DomainUser;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;
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

    @NotSaved
    public AgileUser agile_user = null;

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

    public UserPrefs(Long userId, String name, String image, String template,
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

    public String getCurrentDomainUserName()
    {
	DomainUser currentDomainUser = DomainUser.getDomainCurrentUser();
	if (currentDomainUser != null && currentDomainUser.name != null)
	    return currentDomainUser.name;

	return "?";
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

}
