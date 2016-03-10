package com.agilecrm.deals.filter;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class DealFilter {
	// Key
    @Id
    public Long id;
    
    /**
     * Name of the filter
     */
    @NotSaved(IfDefault.class)
    public String name = null;
    
    @NotSaved(IfDefault.class)
    public String view_type = null;
    
    /**
     * Owner id of deal
     */
    @NotSaved(IfDefault.class)
    public Long owner_id = null;
    
    @NotSaved(IfDefault.class)
    public Long pipeline_id = null;
    
    @NotSaved(IfDefault.class)
    public String milestone = null;
    
    @NotSaved(IfDefault.class)
    public String value_filter = null;
    
    @NotSaved(IfDefault.class)
    public String value = null;
    
    @NotSaved(IfDefault.class)
    public String value_start = null;
    
    @NotSaved(IfDefault.class)
    public String value_end = null;
    
    @NotSaved(IfDefault.class)
    public String archived = null;
    
    /**
     * DomainUser Id who created Filter.
     */
    @NotSaved
    public String filter_owner_id = null;
    
    /**
     * Key object of DomainUser.
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> owner = null;
    
    /**
     * Created time of filter
     */
    public Long created_time = 0L;
    
    // Dao
    public static ObjectifyGenericDao<DealFilter> dao = new ObjectifyGenericDao<DealFilter>(DealFilter.class);
    
    public DealFilter(){
    	
    }
    
    public DealFilter(String name){
    	this.name=name;
    }
    
    public DealFilter(String name, String view_type){
    	this.name=name;
    	this.view_type=view_type;
    }
    
    public DealFilter(String name, String view_type, Long owner_id, String value_filter, String value, String archived){
    	this.name=name;
    	this.view_type=view_type;
    	this.owner_id=owner_id;
    	this.value_filter=value_filter;
    	this.value=value;
    	this.archived=archived;
    }
    
    public DealFilter(String name, String view_type, Long owner_id, Long pipeline_id, String milestone, String value_filter, String value, String value_start, String value_end, String archived){
    	this.name=name;
    	this.view_type=view_type;
    	this.owner_id=owner_id;
    	this.pipeline_id=pipeline_id;
    	this.milestone=milestone;
    	this.value_filter=value_filter;
    	this.value=value;
    	this.value_start=value_start;
    	this.value_end=value_end;
    	this.archived=archived;
    }
    
    /**
     * Saves the filter
     */
    public void save(){
    	dao.put(this);
    }
    
    /**
     * Deletes the filter
     */
    public void delete(){
    	dao.delete(this);
    }
    
    /**
     * Gets domain user with respect to owner id if exists, otherwise null.
     * 
     * @return Domain user object.
     * @throws Exception
     *             when Domain User not exists with respect to id.
     */
    @XmlElement(name = "filterOwner")
    public DomainUser getFilterOwner() throws Exception
    {
	if (owner != null)
	{
	    try
	    {
		// Gets Domain User Object
		return DomainUserUtil.getDomainUser(owner.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }
    
    /**
     * Assigns created time for the new one, creates filter with owner key.
     */
    @PrePersist
    private void PrePersist(){
    	if(created_time == 0L){
			created_time = System.currentTimeMillis() / 1000;
		}
    	
    	if (filter_owner_id == null)
    	{
    		DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();
    	    filter_owner_id = domainUser.id.toString();
    	}
    	

	    // Saves domain user key
	    if (filter_owner_id != null)
	    	owner = new Key<DomainUser>(DomainUser.class, Long.parseLong(filter_owner_id));
    }
    

}
