package com.agilecrm;
import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Indexed;
/**
 * <code>AllDomainStats</code> class stores the details of a Stats Report. 
 * The properties (created_time, campaing_count, webrule_count fields and
 * etc..) of all domain are stored in this class. 
 * 
 * @author Prashannjeet
 * 
 */

public class AllDomainStats {

	/**
     * All Domain Stats Id
     */
    @Id
    public Long id;

    /**
     * Created Time
     */
    @Indexed
    public long created_time = 0L;

    /**
     * Count of all Campaign
     */
    @Indexed
    public long campaign_count=0L;
    
    /**
     * Count of all Web rules
     */
    @Indexed
    public long webrule_count=0L;
    
    /**
     * Count of all Landing pages
     */
    @Indexed
    public long landingPage_count=0L;
    
    /**
     * Count of all Form
     */
    @Indexed
    public long form_count=0L;
    
    /**
     * Count of all Trigger
     */
    @Indexed
    public long triggers_count=0L;
    
    /**
     * Count of all Trigger
     */
    @Indexed
    public long emailTemplate_count=0L;
    
    /**
     * Stores the property names in final variables, for reading flexibility of
     * the property values
     */
    public static final String CAMPAIGN_COUNT = "campaign_count";
    public static final String FORM_COUNT = "form_count";
    public static final String TRIGGER_COUNT = "triggers_count";
    public static final String LANDINGPAGE_COUNT = "landingPage_count";
    public static final String WEBRULE_COUNT = "webrule_count";
    public static final String EMAIL_TEMPLATE_COUNT = "emailTemplate_count";
    
    /**
     * ObjctifyDAO for AllDomainStats
     */
    public static ObjectifyGenericDao<AllDomainStats> dao = new ObjectifyGenericDao<AllDomainStats>(AllDomainStats.class);

    public AllDomainStats()
    {
    }

    public AllDomainStats(long created_time, long campaign_count, long webrule_count, long form_count, long landingPage_count, long triggers_count, long emailTemplate_count)
    {
		this.created_time = created_time;
		this.campaign_count = campaign_count;
		this.webrule_count = webrule_count;
		this.form_count = form_count;
		this.landingPage_count=landingPage_count;
		this.triggers_count=triggers_count;
		this.emailTemplate_count=emailTemplate_count;
    }

    /**
     * Saves a Stats Report in the database
     */
    public void save()
    {
	String currentNameSpace = NamespaceManager.get();
	NamespaceManager.set("");
	try
	{	
	       dao.put(this);
	}
	catch (Exception e)
	{
		e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(currentNameSpace);
	}
    }

    @Override
    public String toString()
    {
	return "AllDomainStats [id=" + id + ", created_time=" + created_time + ", campaign=" + campaign_count + ", webrule=" + webrule_count
			+ ", form=" + form_count + ", landingPage="+ landingPage_count +", triggers=" + triggers_count +", Email Template="+emailTemplate_count+"]";
    }

}
