package com.agilecrm.deals.util;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

/**
 * <code>OpportunityUtil</code> is the utility class to fetch opportunities with
 * respect to id, closed-date time period and also with respect to related
 * contacts. The map values for a chart are provided by getting expected values
 * and pipeline values. All expected values and pipeline values of deals having
 * closed date of same month are merged.
 * <p>
 * The opportunities are retrieved with respect to milestones. The percentage of
 * opportunities that are successfully done compared to total opportunities can
 * be known.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
public class OpportunityUtil
{
    /**
     * ObjectifyDao of Opportunity.
     */
    private static ObjectifyGenericDao<Opportunity> dao = new ObjectifyGenericDao<Opportunity>(Opportunity.class);

    /**
     * Gets opportunity based on id.
     * 
     * @param id
     *            Opportunity Id.
     * @return Opportunity with respect to id.
     */
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

    /**
     * Gets list of all opportunities.
     * 
     * @return list of all opportunities.
     */
    public static List<Opportunity> getOpportunities()
    {
	return dao.fetchAll();
    }

    /**
     * Gets list of all opportunities by milestones.
     * 
     * @return DealsByMilestones JSONObjects with respect to given
     *         milestonesJSONObject
     * @throws JSONException
     */
    public static JSONObject getDealsByMilestone()
    {
	JSONObject milestonesObject = new JSONObject();

	// Array of milestones
	Opportunity.MILESTONES = MilestoneUtil.getMilestones().milestones.split(",");
	ObjectMapper mapper = new ObjectMapper();

	// Iterate through all possible milestones
	for (String milestone : Opportunity.MILESTONES)
	{
	    String json = "";
	    List<Opportunity> dealslist = getDeals(null, milestone, null);
	    try
	    {
		json = mapper.writeValueAsString(dealslist);
		json = json.replace("null", "\"\"");
		milestonesObject.put(milestone.trim(), json);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return milestonesObject;
    }

    /**
     * Gets list of opportunities with respect to closed date and given time
     * period.
     * 
     * @param minTime
     *            - Given time less than closed date.
     * @param maxTime
     *            - Given time greater than closed date.
     * @return list of opportunities with closed date in between min and max
     *         times.
     */
    public static List<Opportunity> getOpportunities(long minTime, long maxTime)
    {
	return dao.ofy().query(Opportunity.class).filter("close_date >= ", minTime).filter("close_date <= ", maxTime).list();
    }

    /**
     * Returns deals count with given contact-id and milestone
     * 
     * @param contactId
     *            - Contact Id
     * @param milestone
     *            - milestone
     * @return int
     */
    public static int getDealsCount(Long contactId, String milestone, Long ownerId)
    {
	if (contactId == null && milestone == null && ownerId == null)
	    return 0;

	Map<String, Object> conditionsMap = new HashMap<String, Object>();

	if (contactId != null)
	    conditionsMap.put("related_contacts", new Key<Contact>(Contact.class, contactId));

	if (milestone != null)
	    conditionsMap.put("milestone", milestone.trim());

	if (ownerId != null)
	    conditionsMap.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));

	return dao.getCountByProperty(conditionsMap);
    }

    /**
     * Returns deals based on contact Id or milestone or ownerId or all at once
     * 
     * @param contactId
     *            - Contact Id
     * @param milestone
     *            - milestone
     * @param ownerId
     *            - deal owner id
     * @return List
     */
    public static List<Opportunity> getDeals(Long contactId, String milestone, Long ownerId)
    {
	if (contactId == null && milestone == null && ownerId == null)
	    return null;

	Map<String, Object> conditionsMap = new HashMap<String, Object>();

	if (contactId != null)
	    conditionsMap.put("related_contacts", new Key<Contact>(Contact.class, contactId));

	if (milestone != null)
	    conditionsMap.put("milestone", milestone.trim());

	if (ownerId != null)
	    conditionsMap.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));

	return dao.listByProperty(conditionsMap);
    }

    /**
     * Gets JSONObject of expected-values and pipeline values of deals with
     * respect to month. Gets list of opportunities with respect to given time
     * period. Adds expected-values and pipeline values by iterating through
     * each deal having closed date on same month. These are used for graph
     * building.
     * 
     * @param minTime
     *            - Given time less than closed date.
     * @param maxTime
     *            - Given time greater than closed date.
     * @return JsonObject having total and pipeline values with respect to
     *         month.
     */
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
		double total = opportunity.expected_value;
		double pipeline = opportunity.expected_value * opportunity.probability / 100;

		/*
		 * //mm-yy DateFormat formatter = new SimpleDateFormat("MM-yy");
		 * //Get mm/yy String mmYY = formatter.format(new
		 * Date(opportunity.close_date * 1000));
		 */
		Date opportunityDate = new Date(opportunity.close_date * 1000);

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(opportunityDate);
		calendar.set(Calendar.DAY_OF_MONTH, 1);

		Date firstDayOfMonth = calendar.getTime();
		String mmYY = Math.round(firstDayOfMonth.getTime() / 1000) + "";

		Double oldTotal = 0D, oldPipeline = 0D;

		// Read from previous object if present
		if (dealsObject.containsKey(mmYY))
		{
		    JSONObject totalAndPipeline = dealsObject.getJSONObject(mmYY);
		    oldTotal = totalAndPipeline.getDouble(TOTAL);
		    oldPipeline = totalAndPipeline.getDouble(PIPELINE);
		}

		// If already present, get the previous one and add total and
		// pipeline
		JSONObject totalAndPipeline;

		// Check whether dealsObject is null
		if (dealsObject.containsKey(mmYY) && dealsObject.getJSONObject(mmYY) == null)
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

	System.out.println(dealsObject);
	return dealsObject;
    }

    /**
     * Gets total number of milestones in a given period.
     * 
     * @param minTime
     *            - Given time less than closed date.
     * @param maxTime
     *            - Given time greater than closed date.
     * @param milestone
     *            - Given milestone.
     * @return Count of total number of milestones.
     */
    public static int getTotalNumberOfMilestones(long minTime, long maxTime, String milestone)
    {
	return dao.ofy().query(Opportunity.class).filter("close_date >= ", minTime).filter("close_date <= ", maxTime).filter("milestone", milestone).count();
    }

    /**
     * Gets milestone JSONObject with respect to given time period. Filters the
     * opportunities with respect to milestones. For e.g. Milestone 'Lost'
     * consists of 4 opportunities, having closed date within the given range.
     * 
     * @param minTime
     *            - Given time less than closed date.
     * @param maxTime
     *            - Given time greater than closed date.
     * @return Milestone JSONObjects with respect to given time period.
     */
    public static JSONObject getMilestones(long minTime, long maxTime)
    {
	// Milestones object
	JSONObject milestonesObject = new JSONObject();

	// Array of milestones
	Opportunity.MILESTONES = MilestoneUtil.getMilestones().milestones.split(",");

	// Iterate through all possible milestones
	for (String milestone : Opportunity.MILESTONES)
	{
	    int numOpportunities = getTotalNumberOfMilestones(minTime, maxTime, milestone.trim());
	    milestonesObject.put(milestone, numOpportunities);
	}

	System.out.println(milestonesObject);
	return milestonesObject;
    }

    /**
     * Returns JSONObject consisting of percentage of deals won compared to
     * total number of opportunities. Gets the conversions rate in particular
     * period - Total Closed/Total.
     * 
     * @param minTime
     *            - Given time less than closed date.
     * @param maxTime
     *            - Given time greater than closed date.
     * @return JSONObject having percentage of deals with milestone won compared
     *         to total deals in a given period.
     */
    public static JSONObject getConversionDetails(long minTime, long maxTime)
    {
	// Gets total count of opportunities within the given period
	int numOpportunities = dao.ofy().query(Opportunity.class).filter("close_date >= ", minTime).filter("close_date <= ", maxTime).count();

	JSONObject conversionObject = new JSONObject();

	// Gets total number of opportunities with milestone won
	int closedNumOpportunities = getTotalNumberOfMilestones(minTime, maxTime, "won");

	conversionObject.put("conversion", (closedNumOpportunities * 100) / numOpportunities);

	System.out.println(conversionObject);
	return conversionObject;
    }

    public static List<Opportunity> getDealsRelatedToCurrentUser()
    {
	return dao.ofy().query(Opportunity.class).filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.order("-created_time").limit(10).list();
    }

    public static List<Opportunity> getUpcomingDealsRelatedToCurrentUser(String pageSize)
    {
	return dao.ofy().query(Opportunity.class).filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.order("close_date").limit(Integer.parseInt(pageSize)).list();
    }
}