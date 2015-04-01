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
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
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
	DEAL, DOCUMENTS, TASK, EVENT, EMAIL, NOTES, CALL
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

    @NotSaved
    public List<String> user_ids = new ArrayList<String>();

    private List<Key<DomainUser>> usersList = new ArrayList<Key<DomainUser>>();

    public static ObjectifyGenericDao<ActivityReports> dao = new ObjectifyGenericDao<ActivityReports>(
	    ActivityReports.class);

    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    public String activity_time = "09:00";

    @NotSaved(IfDefault.class)
    public String activity_weekday = "2";

    @NotSaved(IfDefault.class)
    public String activity_day = "1";

    @NotSaved(IfDefault.class)
    public String report_timezone;

    public ActivityReports()
    {

    }

    public ActivityReports(Frequency duration, String name)
    {
	this.name = name;
	this.frequency = duration;
    }

    @XmlElement
    public List<DomainUser> getUsersList()
    {
	List<DomainUser> users = new ArrayList<DomainUser>();
	for (Key<DomainUser> userKey : usersList)
	{
	    DomainUser user = DomainUserUtil.getDomainUser(userKey.getId());
	    if (user != null)
		users.add(user);

	}
	return users;
    }

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

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
	StringBuilder builder = new StringBuilder();
	builder.append("ActivityReports [id=").append(id).append(", name=").append(name).append(", activity=")
	        .append(activity).append(", frequency=").append(frequency).append(", sendTo=").append(sendTo)
	        .append(", user_ids=").append(user_ids).append(", usersList=").append(usersList)
	        .append(", created_time=").append(created_time).append("]");
	return builder.toString();
    }

}
