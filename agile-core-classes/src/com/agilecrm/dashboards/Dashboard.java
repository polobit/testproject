package com.agilecrm.dashboards;

import java.util.LinkedHashSet;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Category;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.contact.Note;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Milestone;
import com.agilecrm.reports.Reports.Duration;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

public class Dashboard {
	// Key
    @Id
    public Long id;

    /**
     * Represents the name of the dashboard
     */
    public String name = null;
    
    /**
     * Represents the description of the dashboard
     */
    public String description = null;
    
    
    @NotSaved(IfDefault.class)
    private Key<AgileUser> agileUser = null;
    
    /**
     * Created time of a dashboard.
     */
    public Long created_time = 0L;
    
    // Category of report generation - daily, weekly, monthly.
    public static enum Duration
    {
	DAILY, WEEKLY, MONTHLY
    };

    @Indexed
    @NotSaved(IfDefault.class)
    public Duration duration;

    @NotSaved(IfDefault.class)
    public String sendTo = null;
    
    // Dao
    public static ObjectifyGenericDao<Dashboard> dao = new ObjectifyGenericDao<Dashboard>(Dashboard.class);
    
    public Dashboard(){
    	
    }
    
    /**
     * Saves the dashboard
     */
    public void save(){
    	dao.put(this);
    }
    
    /**
     * Deletes the dashboard
     */
    public void delete(){
    	dao.delete(this);
    }
    
    /**
     * Sets created time and agile user. PrePersist is called each
     * time before object gets saved.
     */
    @PrePersist
    private void PrePersist(){
		// Initializes created Time
		if (created_time == 0L){
			created_time = System.currentTimeMillis() / 1000;
		}
	
		// Set Agile user.
		if (agileUser == null){
			agileUser = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);
		}
    }
}
