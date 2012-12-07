package com.agilecrm.deals;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.jdo.annotations.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import net.sf.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.core.DomainUser;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.workflows.triggers.util.DealTriggerUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class Opportunity
{

    // Key
    @Id
    public Long id;

    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    @NotSaved(IfDefault.class)
    public Long close_date = 0L;

    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    public String name = null;

    @NotSaved(IfDefault.class)
    public String description = null;

    @NotSaved(IfDefault.class)
    public Long expected_value = null;

    @NotSaved(IfDefault.class)
    public String milestone = null;

    public int probability = 0;

    @NotSaved(IfDefault.class)
    public String track = null;

    // Owner
    @NotSaved
    public String owner = null;

    @NotSaved(IfDefault.class)
    private Key<DomainUser> ownerKey = null;

    @NotSaved(IfDefault.class)
    private Key<AgileUser> agileUser = null;

    @NotSaved(IfDefault.class)
    @Embedded
    public List<String> contacts = null;

    @NotSaved
    public String entity_type = "deal";

    // Dao
    public static ObjectifyGenericDao<Opportunity> dao = new ObjectifyGenericDao<Opportunity>(
	    Opportunity.class);

    // Possible Milestones
    private static String MILESTONES[] = {};

    Opportunity()
    {

    }

    public Opportunity(String name, String description, Long expectedValue,
	    String milestone, int probability, String track, String owner)
    {

	this.name = name;
	this.description = description;
	this.expected_value = expectedValue;
	this.milestone = milestone;
	this.probability = probability;
	this.track = track;
	this.owner = owner;
    }

    // To String
    public String toString()
    {
	return "id: " + id + " relatesto: " + contacts + " close date"
		+ close_date + " name: " + name + " description:" + description
		+ " expectedValue: " + expected_value + " milestone: "
		+ milestone + " probability: " + probability + " Track: "
		+ track + " Owner " + owner;
    }

    public static Opportunity getOpportunity(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static List<Opportunity> getOpportunities()
    {
	return dao.fetchAll();
    }

    // Get deals of contact in contact details: Yaswanth - 08/24/12
    public static List<Opportunity> getCurrentContactDeals(Long id)
    {
	Objectify ofy = ObjectifyService.begin();

	Key<Contact> contact_key = new Key<Contact>(Contact.class, id);

	return ofy.query(Opportunity.class)
		.filter("related_contacts = ", contact_key).list();

    }

    // Get Opportunities based on time
    public static List<Opportunity> getOpportunities(long minTime, long maxTime)
    {
	return dao.ofy().query(Opportunity.class)
		.filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime).list();
    }

    // Get map of total and pipelines
    // Author: Yaswanth - 07/30/2012
    public static JSONObject getDealsDetails(long minTime, long maxTime)
    {

	// Final JSON Constants
	String TOTAL = "total";
	String PIPELINE = "pipeline";

	// Deals Object
	JSONObject dealsObject = new JSONObject();

	// Returns month (key) and total and pipeline
	List<Opportunity> opportunitiesList = getOpportunities(minTime, maxTime);
	for (Opportunity opportunity : opportunitiesList)
	{
	    try
	    {
		// Total and Pipeline (total * probability)
		long total = opportunity.expected_value;
		long pipeline = opportunity.expected_value
			* opportunity.probability / 100;

		// mm-yy
		DateFormat formatter = new SimpleDateFormat("MM-yy");

		// Get mm/yy
		// String mmYY = formatter.format(new
		// Date(opportunity.close_date * 1000));
		Date opportunityDate = new Date(opportunity.close_date * 1000);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(opportunityDate);

		calendar.set(Calendar.DAY_OF_MONTH, 1);

		Date firstDayOfMonth = calendar.getTime();
		String mmYY = Math.round(firstDayOfMonth.getTime() / 1000) + "";

		Long oldTotal = 0L, oldPipeline = 0L;

		// Read from previous object if present
		if (dealsObject.containsKey(mmYY))
		{
		    JSONObject totalAndPipeline = dealsObject
			    .getJSONObject(mmYY);
		    oldTotal = totalAndPipeline.getLong(TOTAL);
		    oldPipeline = totalAndPipeline.getLong(PIPELINE);
		}

		// If already present, get the previous one and add total and
		// pipeline
		JSONObject totalAndPipeline;

		// Check whether dealsObject is null
		if (dealsObject.containsKey(mmYY)
			&& dealsObject.getJSONObject(mmYY) == null)
		{
		    totalAndPipeline = dealsObject.getJSONObject(mmYY);
		}
		else
		{
		    totalAndPipeline = new JSONObject();
		}

		// Update the mmYY with the new totals
		totalAndPipeline.put(TOTAL, total + oldTotal);
		totalAndPipeline.put(PIPELINE, pipeline + oldPipeline);
		dealsObject.put(mmYY, totalAndPipeline);

	    }
	    catch (Exception e)
	    {
		System.out.println("Exception :" + e);
	    }
	}

	// System.out.println(dealsObject);

	return dealsObject;
    }

    // Get Total Number of Milestones in a given period
    public static int getTotalNumberOfMilestones(long minTime, long maxTime,
	    String milestone)
    {
	return dao.ofy().query(Opportunity.class)
		.filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime)
		.filter("milestone", milestone).count();

    }

    // To get Milestones of deals
    // Author:yaswanth 07/30/2012
    public static JSONObject getMilestones(long minTime, long maxTime)
    {

	// Milestones object
	JSONObject milestonesObject = new JSONObject();

	// Array of milestones
	MILESTONES = Milestone.getMilestonesArray();

	// Iterate through all possible milestones
	for (String milestone : MILESTONES)
	{

	    int numOpportunities = getTotalNumberOfMilestones(minTime, maxTime,
		    milestone.trim());
	    milestonesObject.put(milestone, numOpportunities);
	}

	System.out.println(milestonesObject);
	return milestonesObject;
    }

    // To get the conversions rate in particular period - Total Closed/Total
    // Author:yaswanth 07/30/2012
    public static JSONObject getConversionDetails(long minTime, long maxTime)
    {

	// Get Total
	int numOpportunities = dao.ofy().query(Opportunity.class)
		.filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime).count();

	JSONObject converstionObject = new JSONObject();

	// Get Closed Total
	int closedNumOpportunities = getTotalNumberOfMilestones(minTime,
		maxTime, "won");

	converstionObject.put("conversion", (closedNumOpportunities * 100)
		/ numOpportunities);

	System.out.println(converstionObject);
	return converstionObject;
    }

    // Delete Opportunity
    public void delete()
    {
	dao.delete(this);
    }

    // Save Opportunity
    public void save()
    {

	if (contacts != null)
	{
	    for (String contact_id : this.contacts)

	    {
		this.related_contacts.add(new Key<Contact>(Contact.class, Long
			.parseLong(contact_id)));
	    }
	}

	if (id == null)
	    DealTriggerUtil.executeTriggerForNewDeal(this);

	this.contacts = null;

	dao.put(this);

    }

    @PrePersist
    private void PrePersist()
    {
	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	// Save agile user key
	ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner));
	System.out.println("OwnerKey" + ownerKey);

	agileUser = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);

    }

    // Contacts related with deals Author : Yaswanth 08-24-2012
    @XmlElement
    public List<Contact> getContacts()
    {

	Objectify ofy = ObjectifyService.begin();
	List<Contact> contacts_list = new ArrayList<Contact>();
	contacts_list.addAll(ofy.get(this.related_contacts).values());
	return contacts_list;
    }

    // Get Users
    @XmlElement(name = "owner")
    public DomainUser getOwner() throws Exception
    {
	if (ownerKey != null)
	{
	    try
	    {
		// Get User prefs to return to access owner name , pic etc..
		// details
		return DomainUser.getDomainUser(ownerKey.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    // Get Users
    @XmlElement(name = "Prefs")
    public UserPrefs getPrefs() throws Exception
    {
	if (agileUser != null)
	{
	    Objectify ofy = ObjectifyService.begin();
	    try
	    {
		// Get User prefs to return to access owner name , pic etc..
		// details

		return ofy.query(UserPrefs.class).ancestor(agileUser).get();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    // Get Pic
    @XmlElement(name = "ownerpic")
    public String getPic() throws Exception
    {

	AgileUser agileuser = null;
	UserPrefs userprefs = null;

	try

	{
	    // Get owner pic through agileuser prefs
	    agileuser = AgileUser.getCurrentAgileUserFromDomainUser(ownerKey
		    .getId());
	    if (agileuser != null)
		userprefs = UserPrefs.getUserPrefs(agileuser);
	    if (userprefs != null)
		return userprefs.pic;
	}
	catch (Exception e)
	{
	    e.printStackTrace();

	}

	return null;
    }
}