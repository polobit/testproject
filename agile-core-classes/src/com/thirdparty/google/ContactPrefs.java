/**
 * @auther jitendra
 * @since 2014
 */
package com.thirdparty.google;

import java.io.Serializable;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.DataSyncUrlConstants;
import com.agilecrm.contact.sync.Type;
import com.agilecrm.contact.sync.SyncFrequency;
import com.agilecrm.contact.sync.config.SyncPrefs;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.subscription.limits.PlanLimits;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.NamespaceManager;
import com.google.gdata.util.common.base.StringUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;
import com.thirdparty.google.groups.GoogleGroupDetails;
import com.thirdparty.google.groups.util.ContactGroupUtil;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * <code>ContactPrefs</code> class stores the details of different sources to
 * import contacts.
 * 
 * @author Tejaswi
 * @since July 2013
 * 
 */
@SuppressWarnings("serial")
public class ContactPrefs extends SyncPrefs implements Serializable
{

    /** type defines third party client type eg google,zoho,stripe etc */
    @NotSaved(IfDefault.class)
    public Type type = null;

    /** my_contacts. */
    @NotSaved(IfDefault.class)
    @Unindexed
    public Boolean my_contacts = true;

    /**  username. */
    @NotSaved(IfDefault.class)
    public String userName = null;
    
    /**  username. */
    @NotSaved(IfDefault.class)
    public String password = null;
    

    /** If access token expire time is specified, we store it. */
    @NotSaved(IfDefault.class)
    public Long expires = 0L;

    /** created at. */
    @NotSaved(IfDefault.class)
    public Long createdAt = 0L;

    // modified time
    /** last modifed at. */
    @NotSaved(IfDefault.class)
    public Long lastModifedAt = 0L;


    /**
     * import options can hold various modules option from third party client eg
     * zoho have cases,leads,contact in import option we can set modules that
     * are need to be imported in agile
     */

    public List<String> importOptions;

    /** hold domain user. */
    @JsonIgnore
    public Key<DomainUser> domainUser;

    /** sync_to_group. */
    @NotSaved(IfDefault.class)
    public String sync_to_group = null;

    /** sync_from_group. */
    @NotSaved(IfDefault.class)
    public String sync_from_group = null;
    
    
    @NotSaved
    public String imageUrl = null;
    
    @NotSaved
    public String content = null;

    /** conflict. */
    @NotSaved(IfDefault.class)
    public String conflict = null;

    /** other optional params values can be set from third party client */
    @NotSaved(IfDefault.class)
    public String othersParams = null;
    /**
     * Store last Syn date in string format
     */
    @NotSaved(IfDefault.class)
    public String lastSyncCheckPoint = null;


    /**
     * Instantiates a new contact prefs.
     */
    public ContactPrefs()
    {
    }

    /** holds sync prefs frequency for job scheduling for cron */
    @NotSaved(IfDefault.class)
    public SyncFrequency duration = SyncFrequency.ONCE;

    /** Group option specific to google client   */
    @NotSaved
    @Embedded
    public List<GoogleGroupDetails> groups = new ArrayList<GoogleGroupDetails>();

    /**
     *  Category of report generation - daily, weekly, monthly.
     *
     */
    public static enum SYNC_TYPE
    {

	/**  client to agile. */
	CLIENT_TO_AGILE,
	/**  agile to client. */
	AGILE_TO_CLIENT,
	/**  two way. */
	TWO_WAY
    };

    /**  sync_type. */
    @NotSaved(IfDefault.class)
    public SYNC_TYPE sync_type = null;
    /**
     * various field data can be set as list in dataOption field can be like
     * Account,leads,customer etc..
     */

    /*
     * @NotSaved public List<String> thirdPartyField;
     * 
     * private static String AGILE = "Agile"; private static String CLIENT =
     * "Client";
     */

    /**
     * ContactPrefs DAO.
     */
    public static ObjectifyGenericDao<ContactPrefs> dao = new ObjectifyGenericDao<ContactPrefs>(ContactPrefs.class);

    /**
     * Saves ContactPrefs in database.
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * sets created time,expire time for access token and domain user key.
     */
    @PrePersist
    public void prePersist()
    {
	if (domainUser == null)
	    domainUser = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());
    }

    /**
     * Sets the expiry time of token.
     * 
     * @param time
     *            the new expiry time
     */
    @JsonIgnore
    public void setExpiryTime(Long time)
    {
	createdAt = System.currentTimeMillis();

	System.out.println(expires);
	if (expires / 100000000000l > 1)
	    expires = createdAt + (expires);
	else
	    expires = createdAt + (expires * 1000);
	System.out.println(expires);
    }

    /**
     * Post load.
     */
    @PostLoad
    void postLoad()
    {
	if (type == Type.GOOGLE)
	{
	    fillGroups();
	    if(sync_from_group != null)
	    {
		sync_from_group = URLDecoder.decode(sync_from_group);
		
	    }
	    if(sync_to_group != null)
	    {
		sync_to_group = URLDecoder.decode(sync_to_group);
		
	    }
	    this.imageUrl=DataSyncUrlConstants.GOOGLE_IMAGE_URL;
		this.content=DataSyncUrlConstants.GOOGLE_CONTENT;
	}
	   if(type.SHOPIFY==type){
		   this.imageUrl=DataSyncUrlConstants.SHOPIFY_IMAGE_URL;
		   this.content=DataSyncUrlConstants.SHOPIFY_CONTENT;
		   
	   }
	   if(type.STRIPE==type){
		   this.imageUrl=DataSyncUrlConstants.STRIPE_IMAGE_URL;
		   this.content=DataSyncUrlConstants.STRIPE_CONTENT;
	   }
	   if(type.FRESHBOOKS==type){
		   this.imageUrl=DataSyncUrlConstants.FRESHBOOKS_IMAGE_URL;
		   this.content=DataSyncUrlConstants.FRESHBOOKS_CONTENT;
	   }
	   if(type.QUICKBOOK==type){
		   this.imageUrl=DataSyncUrlConstants.QUICKBOOKS_IMAGE_URL;
		   this.content=DataSyncUrlConstants.QUICKBOOKS_CONTENT;
	   }
	
    }

    /**
     * Fill groups in fetching from google.
     */
    /**
     * Fill groups in fetching from google
     */
    public void fillGroups()
    {
	try
	{
	    // Fetches froups from google
	    groups = ContactGroupUtil.getGroups(this);

	    // Get group Agile from set, and deletes if there is a duplicate
	    // Agile group, or add one if there are none (Adds only in the list
	    // to show in UI does not create at this point)
	    GoogleGroupDetails agileGroup = ContactPrefsUtil.getGroup("Agile", this);
	    List<GoogleGroupDetails> groupList = ContactPrefsUtil.getGroupList("Agile", this);
	    if (groupList.isEmpty())
	    {
		agileGroup = new GoogleGroupDetails();
		// agileGroup.atomId = "Agile";
		agileGroup.groupName = "Agile";
		groups.add(agileGroup);
	    }
	    else if (groupList.size() > 1)
	    {
		System.out.println("duplicate groups = " + groupList);
		for (GoogleGroupDetails googleGroup : groupList)
		{
		    // @NotSaved(IfDefault.class)
		    // public Long last_synched_to_client = 0L;

		    System.out.println("duplicate groups = " + googleGroup.atomId);

		    // @NotSaved(IfDefault.class)
		    // public Long last_synched_from_client = 0L;
		    if (!(googleGroup.atomId.equals(sync_from_group) || googleGroup.atomId.equals(sync_to_group)))
		    {
			System.out.println("delete + " + googleGroup.atomId);
			ContactGroupUtil.deleteGroup(this, googleGroup.atomId);
		    }
		}
	    }
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    /**
     * Sets domianUser key in contact.
     * 
     * @param domianUser
     *            - domianUser Key.
     */
    public void setDomainUser(Key<DomainUser> domianUser)
    {
	this.domainUser = domianUser;
    }

    /**
     * Gets the domain user.
     * 
     * @param domianUser
     *            the domian user
     * @return the domain user
     */
    public Key<DomainUser> getDomainUser(Key<DomainUser> domianUser)
    {
	return domianUser;
    }

    /**
     * Returns domianUser Key.
     * 
     * @return domianUser object
     */
    public Key<DomainUser> getDomainUser()
    {
	System.out.println("domain user key : " + domainUser);
	return domainUser;
    }

    /**
     * Deletes ContactPrefs.
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Sets the prefs.
     * 
     * @param object
     *            the new prefs
     */
    public void setPrefs(JSONObject object)
    {
	if (object == null)
	    return;

	String duration = null;
	String type = null;
	System.out.println(object);
	try
	{
	    duration = object.getString("duration");
	    type = object.getString("sync_type");
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	if (!StringUtil.isEmpty(duration))
	    this.duration = SyncFrequency.valueOf(duration);
	if (!StringUtil.isEmpty(type))
	    sync_type = SYNC_TYPE.valueOf(type);

    }
    
  
}
