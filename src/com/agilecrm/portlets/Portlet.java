package com.agilecrm.portlets;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import net.sf.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;


@XmlRootElement
@Cached
public class Portlet {
	// Key
    @Id
    public Long id;

    /**
     * Represents the name of the portlet
     */
    public String name = null;
    
    public static enum PortletType{
    	CONTACTS, DEALS, TASKSANDEVENTS
    };

    /**
     * Portlet type which stores info to categorize the portlets
     */
    @Indexed
    public PortletType portlet_type = null;
    
    @NotSaved(IfDefault.class)
    public String prefs = null;
    
    @NotSaved(IfDefault.class)
    public JSONObject settings = null;
    
    /**
     * Since portlets are sortable at the client position of the portlet is stored
     * in position variable
     */
    @NotSaved(IfDefault.class)
    public int column_position = 0;
   
    @NotSaved(IfDefault.class)
    public int row_position = 0;
    
    /**
     * Stores {@link Boolean} info whether the portlet is minimized
     */
    @NotSaved(IfDefault.class)
    public boolean is_minimized = false;
    
    @Parent
    @Indexed
    private Key<AgileUser> user;
    
    @NotSaved(IfDefault.class)
    public List<Contact> contactsList=null;
    
    @NotSaved(IfDefault.class)
    public List<Opportunity> dealsList=null;
    
    @NotSaved(IfDefault.class)
    public List<Task> tasksList=null;
    
    @NotSaved(IfDefault.class)
    public List<Event> eventsList=null;
    
    @NotSaved(IfDefault.class)
    public List<String> milestonesList=null;
    
    @NotSaved(IfDefault.class)
    public List<Double> milestoneValuesList=null;
    
    @NotSaved(IfDefault.class)
    public List<Integer> milestoneNumbersList=null;
    
    @NotSaved(IfDefault.class)
    public List<Milestone> milestoneList=null;
    
    @NotSaved(IfDefault.class)
    public List<DomainUser> domainUsersList=null;
    
    @NotSaved(IfDefault.class)
    public List<Integer> mailsCountList=null;
    
    @NotSaved(IfDefault.class)
    public JSONObject growthGraphJson=null;
    
    /**
     * Stores {@link Boolean} info whether the portlet is added
     */
    @NotSaved
    public boolean is_added = false;
    
    // Dao
    private static ObjectifyGenericDao<Portlet> dao = new ObjectifyGenericDao<Portlet>(Portlet.class);
    
    public Portlet(){
    	
    }
    
    public Portlet(String name){
    	this.name=name;
    }
    
    public Portlet(String name,PortletType type){
    	this.name=name;
    	this.portlet_type=type;
    }
    
    public void save(){
    	if (user == null)
    		user = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id);
    	dao.put(this);
    }
    
    /**
     * Deletes the portlet
     */
    public void delete(){
    	dao.delete(this);
    }

}
