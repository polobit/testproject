package com.agilecrm.reports;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * 
 * @author saikiran
 * 
 */
@SuppressWarnings("serial")
@XmlRootElement
@Cached
public class ActivityReports implements Serializable
{
    // Key
    @Id
    public Long id;

    // Name of report
    @NotSaved(IfDefault.class)
    public String name = null;

    public static enum ActivityType
    {
	DEAL, DOCUMENTS, TASK, EVENT, EMAIL, NOTES
    }

    @Indexed
    @NotSaved(IfDefault.class)
    public List<ActivityType> activity = null;

    // Category of report generation - daily, weekly, monthly.
    public static enum Frequency
    {
	DAILY, WEEKLY, MONTHLY
    };

    @Indexed
    @NotSaved(IfDefault.class)
    public Frequency frequency;

    @NotSaved(IfDefault.class)
    public String sendTo = null;

    public List<String> user_ids = new ArrayList<String>();;

    public List<Key<DomainUser>> usersList = new ArrayList<Key<DomainUser>>();

    public static ObjectifyGenericDao<ActivityReports> dao = new ObjectifyGenericDao<ActivityReports>(
	    ActivityReports.class);

    public Long created_time = 0L;

    public ActivityReports()
    {

    }

    public ActivityReports(Frequency duration, String name)
    {
	this.name = name;
	this.frequency = duration;
    }

    @XmlElement(name = "usersList")
    public List<DomainUser> getUsersList()
    {
	Objectify ofy = ObjectifyService.begin();
	List<DomainUser> users_list = new ArrayList<DomainUser>();
	users_list.addAll(ofy.get(this.usersList).values());
	return users_list;
    }

    @XmlElement(name = "user_ids")
    public List<String> getUser_ids()
    {
	user_ids = new ArrayList<String>();

	for (Key<DomainUser> userKey : usersList)
	    user_ids.add(String.valueOf(userKey.getId()));

	return user_ids;
    }

    /**
     * Sets created time, owner key and agile user. PrePersist is called each
     * time before object gets saved.
     */
    @PrePersist
    private void PrePersist()
    {
	// Initializes created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	if (user_ids != null)
	{
	    for (String userId : this.user_ids)
	    {
		this.usersList.add(new Key<DomainUser>(DomainUser.class, Long.parseLong(userId)));
	    }

	}

    }

    /**
     * Saves the report
     */
    public void save()
    {
	dao.put(this);
    }
}
