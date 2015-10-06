package com.agilecrm.deals.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.AgileQueues;
import com.agilecrm.activities.Category;
import com.agilecrm.activities.util.CategoriesUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.CustomFieldDef.Type;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.OpportunityDocument;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.google.appengine.api.search.Document.Builder;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
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

    // returns all deals count
    public static int getCount()
    {

	return Opportunity.dao.count();
    }

    /**
     * Gets list of all opportunities.
     * 
     * @return list of all opportunities.
     */
    public static List<Opportunity> getOpportunities(int max, String cursor)
    {
	if (max != 0)
	    return dao.fetchAll(max, cursor);
	return getOpportunities();
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
		json = json.replace("null", "\'\'");
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
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	return dao.ofy().query(Opportunity.class).filter("close_date >= ", minTime).filter("close_date <= ", maxTime)
		.list();
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

	Map<String, String> fromMilestoneDetails = AgileTaskletUtil.getTrackDetails(milestone);

	Map<String, Object> conditionsMap = new HashMap<String, Object>();

	if (contactId != null)
	    conditionsMap.put("related_contacts", new Key<Contact>(Contact.class, contactId));

	if (ownerId != null)
	    conditionsMap.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));

	if (milestone != null)
	{
	    conditionsMap.put("milestone", fromMilestoneDetails.get("milestone").trim());

	    conditionsMap.put("pipeline",
		    new Key<Milestone>(Milestone.class, Long.parseLong(fromMilestoneDetails.get("pipelineID"))));
	}
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

	conditionsMap.put("archived", false);

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
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	return dao.ofy().query(Opportunity.class).filter("close_date >= ", minTime).filter("close_date <= ", maxTime)
		.filter("milestone", milestone).count();
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
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	// Gets total count of opportunities within the given period
	int numOpportunities = dao.ofy().query(Opportunity.class).filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime).count();

	JSONObject conversionObject = new JSONObject();

	// Gets total number of opportunities with milestone won
	int closedNumOpportunities = getTotalNumberOfMilestones(minTime, maxTime, "won");

	conversionObject.put("conversion", (closedNumOpportunities * 100) / numOpportunities);

	System.out.println(conversionObject);
	return conversionObject;
    }

    public static List<Opportunity> getDealsRelatedToCurrentUser()
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);

	return dao.ofy().query(Opportunity.class)
		.filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.filter("archived", false).order("-created_time").limit(10).list();
    }

    public static List<Opportunity> getUpcomingDealsRelatedToCurrentUser(String pageSize)
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	System.out.println("deals--------------------");
	return dao.ofy().query(Opportunity.class)
		.filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.filter("archived", false).order("close_date").limit(Integer.parseInt(pageSize)).list();
    }

    /**
     * Returns list of opportunities. This method is called if TEXT_PLAIN is
     * request.
     * 
     * @param ownerId
     *            Owner of the deal.
     * @param milestone
     *            Deals Milestone.
     * @param contactId
     *            Id of the contact related to deal.
     * @param fieldName
     *            the name field to sort on.
     * @param cursor
     * @param pipelineId
     *            the id of the pipeline the deal belongs to.
     * @param count
     *            page size.
     * @return List of deals.
     */
    public static List<Opportunity> getOpportunitiesByFilter(String ownerId, String milestone, String contactId,
	    String fieldName, int max, String cursor, Long pipelineId)
    {
	if (pipelineId == null || pipelineId == 0L)
	    pipelineId = MilestoneUtil.getMilestones().id;

	return getOpportunitiesByFilterWithoutDefaultPipeLine(ownerId, milestone, contactId, fieldName, max, cursor,
		pipelineId);

    }

    /**
     * Posts data to backends in the form of byte data. Entire request is
     * forwarded to the url specified
     * <p>
     * It is used when the action is to be performed on list of deals
     * <p>
     * 
     * @param uri
     *            URL of the targeted request.
     */
    public static void postDataToDealBackend(String uri, String... data)
    {

	// Create Task and push it into Task Queue
	Queue queue = QueueFactory.getQueue(AgileQueues.DEALS_EXPORT_QUEUE);
	TaskOptions taskOptions = TaskOptions.Builder.withUrl(uri);

	if (data.length > 1 && !StringUtils.isEmpty(data[1]))
	{
	    taskOptions = TaskOptions.Builder.withUrl(uri).param("filter", data[0]).param("ids", data[1])
		    .header("Content-Type", "application/x-www-form-urlencoded").method(Method.POST);

	    if (data.length > 2 && !StringUtils.isEmpty(data[2]))
		taskOptions.param("form", data[2]);

	    queue.addAsync(taskOptions);
	    return;
	}

	if (data.length > 0)
	{
	    taskOptions = TaskOptions.Builder.withUrl(uri).param("filter", data[0])
		    .header("Content-Type", "application/x-www-form-urlencoded").method(Method.POST);
	    if (data.length > 2 && !StringUtils.isEmpty(data[2]))
		taskOptions.param("form", data[2]);
	    queue.addAsync(taskOptions);
	    return;
	}
	taskOptions = TaskOptions.Builder.withUrl(uri).method(Method.POST);
	queue.addAsync(taskOptions);
    }

    /* Methods related to Multiple Pipeline */

    public static JSONObject getOpportunitiesWithMilestones(String ownerId, String milestone, String contactId,
	    String fieldName, int max, String cursor, Long pipelineId)
    {

	JSONObject milestonesObject = new JSONObject();

	if (pipelineId == null || pipelineId == 0L || MilestoneUtil.getMilestone(pipelineId) == null)
	    pipelineId = MilestoneUtil.getMilestones().id;

	ObjectMapper mapper = new ObjectMapper();
	List<Opportunity> dealslist = null;

	if (!StringUtils.isEmpty(milestone))
	{
	    String json = "";
	    Map<String, Object> conditionsMap = new HashMap<String, Object>();

	    conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, pipelineId));

	    if (milestone != null)
		conditionsMap.put("milestone", milestone.trim());

	    if (max != 0)
		dealslist = dao.fetchAllByOrder(max, cursor, conditionsMap, true, false, "id");

	    dealslist = dao.listByProperty(conditionsMap);

	    try
	    {
		json = mapper.writeValueAsString(dealslist);
		json = json.replace("null", "\'\'");
		milestonesObject.put(milestone.trim(), json);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	    return milestonesObject;
	}

	// Array of milestones
	Opportunity.MILESTONES = MilestoneUtil.getMilestone(pipelineId).milestones.split(",");
	// Iterate through all possible milestones
	for (String mile : Opportunity.MILESTONES)
	{
	    String json = "";
	    Map<String, Object> conditionsMap = new HashMap<String, Object>();

	    conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, pipelineId));

	    if (mile != null)
		conditionsMap.put("milestone", mile.trim());

	    if (max != 0)
		dealslist = dao.fetchAllByOrder(max, cursor, conditionsMap, true, false, "id");

	    dealslist = dao.listByProperty(conditionsMap);

	    try
	    {
		json = mapper.writeValueAsString(dealslist);
		json = json.replace("null", "\'\'");
		milestonesObject.put(mile.trim(), json);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return milestonesObject;
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
    public static int getTotalNumberOfMilestonesByPipeline(Long pipelineId, long minTime, long maxTime, String milestone)
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	return dao.ofy().query(Opportunity.class).filter("pipeline", new Key<Milestone>(Milestone.class, pipelineId))
		.filter("close_date >= ", minTime).filter("close_date <= ", maxTime).filter("milestone", milestone)
		.count();
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
    public static JSONObject getMilestonesByPipeline(Long pipelineId, long minTime, long maxTime)
    {
	// Milestones object
	JSONObject milestonesObject = new JSONObject();

	if (pipelineId == null || pipelineId == 0L)
	    pipelineId = MilestoneUtil.getMilestones().id;

	// Array of milestones
	Opportunity.MILESTONES = MilestoneUtil.getMilestone(pipelineId).milestones.split(",");

	// Iterate through all possible milestones
	for (String milestone : Opportunity.MILESTONES)
	{
	    int numOpportunities = getTotalNumberOfMilestonesByPipeline(pipelineId, minTime, maxTime, milestone.trim());
	    milestonesObject.put(milestone, numOpportunities);
	}

	System.out.println(milestonesObject);
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
    public static List<Opportunity> getOpportunitiesByPipeline(Long pipelineId, long minTime, long maxTime)
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);

	if (pipelineId == null)
	{
		return dao.ofy().query(Opportunity.class)
				.filter("close_date >= ", minTime).filter("close_date <= ", maxTime).list();
	}
	else
	{
		return dao.ofy().query(Opportunity.class).filter("pipeline", new Key<Milestone>(Milestone.class, pipelineId))
				.filter("close_date >= ", minTime).filter("close_date <= ", maxTime).list();
	}
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
    public static JSONObject getDealsDetailsByPipeline(Long pipelineId, long minTime, long maxTime)
    {
	// Final JSON Constants
	String TOTAL = "total";
	String PIPELINE = "pipeline";

	// Deals Object
	JSONObject dealsObject = new JSONObject();

	/*if (pipelineId == null || pipelineId == 0L)
	    pipelineId = MilestoneUtil.getMilestones().id;*/

	// Returns month (key) and total and pipeline
	//If request comes from deals list view or request comes from dashboard and pipeline id is 0, 
	//we'll assign null to pipeline id to get all tracks data
	if (minTime == 0 || pipelineId == 0)
	{
		pipelineId = null;
	}
	String timeZone = "UTC";
	UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
	if (userPrefs != null && userPrefs.timezone != null)
	{
		timeZone = userPrefs.timezone;
	}
	List<Opportunity> opportunitiesList = getOpportunitiesByPipeline(pipelineId, minTime, maxTime);
	if (opportunitiesList != null && opportunitiesList.size() > 0)
	{
		Calendar startCalendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
		System.out.println("Start Calendar timezone id-----"+startCalendar.getTimeZone().getID());
		if (minTime == 0)
		{
			startCalendar.setTimeInMillis(opportunitiesList.get(0).close_date * 1000);
		}
		else
		{
			startCalendar.setTimeInMillis((minTime * 1000) + (24 * 60 * 60 * 1000));
		}
		startCalendar.set(Calendar.DAY_OF_MONTH, 1);
		startCalendar.set(Calendar.HOUR_OF_DAY, 0);
		startCalendar.set(Calendar.MINUTE, 0);
		startCalendar.set(Calendar.SECOND, 0);
		startCalendar.set(Calendar.MILLISECOND, 0);
		System.out.println("startCalendar.getTimeInMillis()-----"+startCalendar.getTimeInMillis());
		Calendar endCalendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
		System.out.println("End Calendar timezone id-----"+endCalendar.getTimeZone().getID());
		if (maxTime == 1543842319)
		{
			endCalendar.setTimeInMillis(opportunitiesList.get(opportunitiesList.size()-1).close_date * 1000);
		}
		else
		{
			endCalendar.setTimeInMillis(maxTime * 1000);
		}
		endCalendar.set(Calendar.DAY_OF_MONTH, 1);
		endCalendar.set(Calendar.HOUR_OF_DAY, 0);
		endCalendar.set(Calendar.MINUTE, 0);
		endCalendar.set(Calendar.SECOND, 0);
		endCalendar.set(Calendar.MILLISECOND, 0);
		System.out.println("endCalendar.getTimeInMillis()-----"+endCalendar.getTimeInMillis());
		long startTimeInMilliSecs = startCalendar.getTimeInMillis();
		while (startTimeInMilliSecs <= endCalendar.getTimeInMillis())
		{
			JSONObject totalAndPipeline = new JSONObject();
			totalAndPipeline.put(TOTAL, 0);
			totalAndPipeline.put(PIPELINE, 0);
			String mmYY = (startCalendar.getTimeInMillis() / 1000) + "";
			dealsObject.put(mmYY, totalAndPipeline);
			startCalendar.add(Calendar.MONTH, 1);
			startCalendar.set(Calendar.DAY_OF_MONTH, 1);
			startCalendar.set(Calendar.HOUR_OF_DAY, 0);
			startCalendar.set(Calendar.MINUTE, 0);
			startCalendar.set(Calendar.SECOND, 0);
			startCalendar.set(Calendar.MILLISECOND, 0);
			startTimeInMilliSecs = startCalendar.getTimeInMillis();
		}
	}
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

		Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
		calendar.setTimeInMillis(opportunity.close_date * 1000);
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);

		Date firstDayOfMonth = calendar.getTime();
		String mmYY = (calendar.getTimeInMillis() / 1000) + "";

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
     * Gets all the pending deals related to current user. Fetches the deals
     * equals or less to current date and deals which are not won or lost
     * 
     * @return List<Opportunity> having total pending deals with respect to
     *         current user.
     */

    public static List<Opportunity> getPendingDealsRelatedToCurrentUser()
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	List<String> milestoneList = new ArrayList<String>();
	milestoneList.add("New");
	milestoneList.add("Prospect");
	milestoneList.add("Proposal");
	return dao.ofy().query(Opportunity.class).filter("close_date <=", (new Date()).getTime() / 1000)
		.filter("close_date !=", null).filter("milestone in", milestoneList)
		.filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.order("close_date").list();
    }

    /**
     * Gets all the pending deals related to all users. Fetches the deals equals
     * or less to current date and deals which are not won or lost
     * 
     * @return List<Opportunity> having total pending deals with respect to
     *         current user.
     */

    public static List<Opportunity> getPendingDealsRelatedToAllUsers()
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	List<String> milestoneList = new ArrayList<String>();
	milestoneList.add("New");
	milestoneList.add("Prospect");
	milestoneList.add("Proposal");
	return dao.ofy().query(Opportunity.class).filter("close_date <=", (new Date()).getTime() / 1000)
		.filter("close_date !=", null).filter("milestone in", milestoneList).order("close_date").list();
    }

    /**
     * Get opportunities based on the filter in the given filter JSON object.
     * 
     * @param filterJson
     *            JSON object containing the fields.
     * @param count
     *            number of deals per page.
     * @param cursor
     *            cursor for the deals.
     * @return deals list.
     */
    public static List<Opportunity> getOpportunitiesByFilter(org.json.JSONObject filterJson, int count, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	String sortField = "close_date";
	try
	{
	    if (checkJsonString(filterJson, "pipeline_id"))
	    {
		searchMap.put("pipeline",
			new Key<Milestone>(Milestone.class, Long.parseLong(filterJson.getString("pipeline_id"))));
		if (checkJsonString(filterJson, "milestone"))
		    searchMap.put("milestone", filterJson.getString("milestone"));
	    }

	    if (checkJsonString(filterJson, "owner_id"))
		searchMap.put("ownerKey",
			new Key<DomainUser>(DomainUser.class, Long.parseLong(filterJson.getString("owner_id"))));

	    if (checkJsonString(filterJson, "archived"))
	    {
		if (!filterJson.getString("archived").equals("all"))
		    searchMap.put("archived", Boolean.parseBoolean(filterJson.getString("archived")));
	    }

	    if (checkJsonString(filterJson, "value_filter")
		    && filterJson.getString("value_filter").equalsIgnoreCase("equals"))
	    {
		if (checkJsonString(filterJson, "value"))
		{
		    double value = Double.parseDouble(filterJson.getString("value"));
		    searchMap.put("expected_value", value);
		}

	    }
	    else
	    {
		sortField = "expected_value";

		if (checkJsonString(filterJson, "value_start"))
		{
		    double value = Double.parseDouble(filterJson.getString("value_start").replace("%", ""));
		    searchMap.put("expected_value >=", value);
		}
		if (checkJsonString(filterJson, "value_end"))
		{
		    double value = Double.parseDouble(filterJson.getString("value_end").replace("%", ""));
		    searchMap.put("expected_value <=", value);
		}
	    }

	    if (checkJsonString(filterJson, "probability_filter")
		    && filterJson.getString("probability_filter").equalsIgnoreCase("equals"))
	    {
		if (checkJsonString(filterJson, "probability"))
		{
		    long probability = Long.parseLong(filterJson.getString("probability").replace("%", ""));
		    searchMap.put("probability", probability);
		}

	    }
	    else
	    {
		if (checkJsonString(filterJson, "probability_start"))
		{
		    long probability = Long.parseLong(filterJson.getString("probability_start").replace("%", ""));
		    searchMap.put("probability >=", probability);
		}
		if (checkJsonString(filterJson, "probability_end"))
		{
		    long probability = Long.parseLong(filterJson.getString("probability_end").replace("%", ""));
		    searchMap.put("probability <=", probability);
		}
	    }

	    searchMap.putAll(getDateFilterCondition(filterJson, "close_date"));
	    searchMap.putAll(getDateFilterCondition(filterJson, "created_time"));

	    /*
	     * Map<String, Object> customFilters =
	     * getCustomFieldFilters(filterJson.getJSONObject("customFields"));
	     * if (customFilters != null) searchMap.putAll(customFilters);
	     */

	    if (count != 0)
		return dao.fetchAllByOrder(count, cursor, searchMap, true, false, sortField);

	    return dao.listByProperty(searchMap);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return null;
    }

    /**
     * Generate the Map object with field name and values of the date(epoch
     * time).
     * 
     * @param json
     *            Filter object containing date fields.
     * @param fieldName
     *            name of the date field.
     * @return map object with date field query conditions.
     */
    private static Map<String, Object> getDateFilterCondition(org.json.JSONObject json, String fieldName)
    {

	Map<String, Object> searchMap = new HashMap<String, Object>();

	try
	{
	    if (checkJsonString(json, fieldName + "_filter"))
	    {
		if (json.getString(fieldName + "_filter").equalsIgnoreCase("equals")
			&& checkJsonString(json, fieldName))
		{
		    long closeDate = Long.parseLong(json.getString(fieldName));
		    searchMap.put(fieldName, closeDate);
		}
		else
		{
		    if (checkJsonString(json, fieldName + "_start"))
		    {
			long closeDate = Long.parseLong(json.getString(fieldName + "_start"));
			searchMap.put(fieldName + " >", closeDate);
		    }
		    if (checkJsonString(json, fieldName + "_end"))
		    {
			long closeDate = Long.parseLong(json.getString(fieldName + "_end"));
			searchMap.put(fieldName + " <", closeDate);
		    }
		}
	    }
	}
	catch (NumberFormatException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return searchMap;
    }

    /**
     * Validate the field in the json. Check whether the given field is in JSON
     * and it has any value.
     * 
     * @param json
     *            JSON object.
     * @param key
     *            field name to validate.
     * @return true if field is present in the json and it has some value.
     */
    private static boolean checkJsonString(org.json.JSONObject json, String key)
    {

	try
	{
	    if (!json.has(key))
		return false;
	    if (json.getString(key) == null || json.getString(key) == "null" || json.getString(key).length() == 0)
		return false;

	    return true;
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return false;
	}
    }

    /**
     * Generate Map object with Query conditons for deals custom fields.
     * 
     * @param json
     *            Filter object containing the filters related to custom fields.
     * @return
     */
    @SuppressWarnings("unused")
    private static Map<String, Object> getCustomFieldFilters(org.json.JSONObject json)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	List<CustomFieldDef> customFieldList = CustomFieldDefUtil.getAllCustomFields(SCOPE.DEAL);
	try
	{
	    for (CustomFieldDef customField : customFieldList)
	    {
		String fieldLabel = customField.field_label;
		String fieldKey = fieldLabel.replace(" ", "_");
		searchMap.put("custom_data.name", fieldLabel);
		if ((customField.field_type == Type.TEXT || customField.field_type == Type.TEXTAREA || customField.field_type == Type.LIST)
			&& checkJsonString(json, fieldKey))
		{
		    searchMap.put("custom_data.value", json.getString(fieldKey));
		}
		else if (customField.field_type == Type.CHECKBOX && checkJsonString(json, fieldKey))
		{
		    if (json.getBoolean(fieldKey))
			searchMap.put(fieldLabel, "on");
		}
		else if (customField.field_type == Type.DATE && checkJsonString(json, fieldKey))
		{
		    searchMap.putAll(getDateFilterCondition(json, fieldKey));
		}
	    }
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	System.out.println("-----custom---------" + searchMap.toString());
	return searchMap;
    }

    /**
     * fetch opportunity related to contact using contact id
     * 
     * @param contactId
     * @return
     */

    public static List<Opportunity> getAllOpportunity(Long contactId)
    {

	Map<String, Object> conditionsMap = new HashMap<String, Object>();

	conditionsMap.put("related_contacts", new Key<Contact>(Contact.class, contactId));
	return dao.listByProperty(conditionsMap);
    }

    /**
     * Gets all the pending deals related to current user. Fetches the deals
     * equals or less to current date and deals which are not won or lost
     * 
     * @return List<Opportunity> having total pending deals with respect to
     *         current user.
     */
    public static List<Opportunity> getPendingDealsRelatedToCurrentUser(long dueDate)
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	List<Opportunity> pendingDealsList = new ArrayList<Opportunity>();
	try
	{
	    List<Milestone> milestoneList = MilestoneUtil.getMilestonesList();
	    for (Milestone milestone : milestoneList)
	    {
	    	List<Opportunity> allDealsList = dao.ofy().query(Opportunity.class)
    			    .filter("close_date <=", (new Date()).getTime() / 1000).filter("archived", false).limit(50)
    			    .filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
    			    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("close_date").list();
	    	for (Opportunity opportunity : allDealsList)
		    {
	    		if (milestone.won_milestone != null && milestone.lost_milestone != null)
		    	{
	    			if (!opportunity.milestone.equals(milestone.won_milestone) && !opportunity.milestone.equals(milestone.lost_milestone))
    					pendingDealsList.add(opportunity);
		    	}
	    		else
    			{
    				if (!opportunity.milestone.equals("Won") && !opportunity.milestone.equals("Lost"))
    					pendingDealsList.add(opportunity);
    			}
		    }
	    	
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return pendingDealsList;
    }

    /**
     * Gets all the pending deals related to all users. Fetches the deals equals
     * or less to current date and deals which are not won or lost
     * 
     * @return List<Opportunity> having total pending deals with respect to
     *         current user.
     */
    public static List<Opportunity> getPendingDealsRelatedToAllUsers(long dueDate)
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	List<Opportunity> pendingDealsList = new ArrayList<Opportunity>();
	try
	{
	    
	    List<Milestone> milestoneList = MilestoneUtil.getMilestonesList();
	    for (Milestone milestone : milestoneList)
	    {
	    	List<Opportunity> allDealsList = dao.ofy().query(Opportunity.class)
	    		    .filter("close_date <=", (new Date()).getTime() / 1000).filter("archived", false).limit(50)
	    		    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("close_date").list();
	    	for (Opportunity opportunity : allDealsList)
		    {
	    		if (milestone.won_milestone != null && milestone.lost_milestone != null)
		    	{
	    			if (!opportunity.milestone.equals(milestone.won_milestone) && !opportunity.milestone.equals(milestone.lost_milestone))
    					pendingDealsList.add(opportunity);
		    	}
	    		else
    			{
    				if (!opportunity.milestone.equals("Won") && !opportunity.milestone.equals("Lost"))
    					pendingDealsList.add(opportunity);
    			}
		    }
	    	
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return pendingDealsList;
    }

    /**
     * Gets all the pending deals related to all users. Fetches the deals equals
     * or less to current date and deals which are not won or lost
     * 
     * @return List<Opportunity> having total pending deals with respect to
     *         current user.
     */
    public static Map<Double, Integer> getTotalMilestoneValueAndNumber(String milestone, boolean owner, long dueDate,
	    Long ownerId, Long trackId)
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	Double totalMilestoneValue = 0.0d;
	List<Opportunity> milestoneList = null;
	Map<Double, Integer> map = new LinkedHashMap<Double, Integer>();
	try
	{
	    if (ownerId != null)
	    {
		milestoneList = dao.ofy().query(Opportunity.class).filter("milestone", milestone)
			.filter("close_date <=", dueDate)
			.filter("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId)).filter("archived", false)
			.list();
	    }
	    else
	    {
		if (owner)
		    milestoneList = dao
			    .ofy()
			    .query(Opportunity.class)
			    .filter("milestone", milestone)
			    .filter("pipeline", new Key<Milestone>(Milestone.class, trackId))
			    .filter("ownerKey",
				    new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
			    .filter("archived", false).list();
		else
		    milestoneList = dao.ofy().query(Opportunity.class)
			    .filter("pipeline", new Key<Milestone>(Milestone.class, trackId))
			    .filter("milestone", milestone).filter("archived", false).list();
	    }
	    for (Opportunity opportunity : milestoneList)
	    {
		if (opportunity.expected_value != null)
		    totalMilestoneValue += opportunity.expected_value;
	    }
	    if (milestoneList != null)
		map.put(totalMilestoneValue, milestoneList.size());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return map;
    }

    /**
     * Gets list of all opportunities won.
     * 
     * @param minTime
     *            - Given time less than closed date.
     * @param maxTime
     *            - Given time greater than closed date.
     * @return list of opportunities with closed date in between min and max
     *         times.
     */
    public static List<Opportunity> getOpportunitiesWon(Long ownerId)
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	try
	{
	    if (ownerId != null)
		return dao.ofy().query(Opportunity.class).filter("milestone", "Won")
			.filter("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId)).filter("archived", false)
			.list();
	    else
		return dao.ofy().query(Opportunity.class).filter("milestone", "Won").filter("archived", false).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets list of opportunities assigned to a particular user.
     * 
     * @param ownerId
     *            - Given owner id.
     * @return list of opportunities assigned to a particular user.
     */
    public static List<Opportunity> getOpportunitiesAsignedToUser(Long ownerId)
    {
	UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
	return dao.ofy().query(Opportunity.class).filter("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId))
		.filter("archived", false).list();
    }

    /**
     * Get deals based on the given ids, If no ids then get the deals from
     * filters.
     * 
     * @param ids
     *            ids of deals.
     * @param filters
     *            deals filters.
     * @return list of deals.
     */
    public static List<Opportunity> getOpportunitiesForBulkActions(String ids, String filters, int count)
    {
	List<Opportunity> deals = new ArrayList<Opportunity>();
	try
	{
	    JSONArray idsArray = null;
	    if (StringUtils.isNotEmpty(ids))
	    {
		idsArray = new JSONArray(ids);
		System.out.println("------------" + idsArray.length());
	    }

	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
	    System.out.println("------------" + filterJSON.toString());

	    if (idsArray != null && idsArray.length() > 0)
	    {
		List<Key<Opportunity>> dealIds = new ArrayList<Key<Opportunity>>();
		for (int i = 0; i < idsArray.length(); i++)
		{
		    dealIds.add(new Key<Opportunity>(Opportunity.class, Long.parseLong(idsArray.getString(i))));
		    if (dealIds.size() >= count)
		    {
			deals.addAll(Opportunity.dao.fetchAllByKeys(dealIds));
			dealIds.clear();
		    }
		}
		if (!dealIds.isEmpty())
		    deals.addAll(Opportunity.dao.fetchAllByKeys(dealIds));
	    }
	    else
	    {
		deals = OpportunityUtil.getOpportunitiesByFilter(filterJSON, count, null);
		String cursor = deals.get(deals.size() - 1).cursor;
		while (cursor != null)
		{
		    deals.addAll(OpportunityUtil.getOpportunitiesByFilter(filterJSON, count, cursor));
		    cursor = deals.get(deals.size() - 1).cursor;
		}
	    }
	}
	catch (JSONException je)
	{
	    je.printStackTrace();
	}
	return deals;

    }

    /**
     * Update deals in the search document. Maximum deals size in list should be
     * below 200 (150 recomended).
     * 
     * @param deals
     */
    public static void updateSearchDoc(List<Opportunity> deals)
    {

	AppengineSearch<Opportunity> search = new AppengineSearch<Opportunity>(Opportunity.class);
	OpportunityDocument oppDocs = new OpportunityDocument();
	List<Builder> builderObjects = new ArrayList<Builder>();
	for (Opportunity deal : deals)
	{
	    builderObjects.add(oppDocs.buildOpportunityDoc(deal));
	}

	search.index.putAsync(builderObjects.toArray(new Builder[deals.size()]));
    }

    /**
     * Delete deals in the search document. Maximum deals size in list should be
     * below 200 (150 recommended).
     * 
     * @param deals
     */
    public static void deleteSearchDoc(List<Opportunity> deals)
    {

	AppengineSearch<Opportunity> search = new AppengineSearch<Opportunity>(Opportunity.class);
	String[] docIds = new String[deals.size()];
	for (int i = 0; i < deals.size(); i++)
	{
	    docIds[i] = String.valueOf(deals.get(i).id);
	}

	Index index = search.index;

	if (index != null)
	    index.delete(docIds);
    }

    /**
     * Get the won deals list which are won in the specified duration.
     * 
     * @param minTime
     *            Long object
     * @param maxTime
     *            Long object
     */
    public static List<Opportunity> getWonDealsList(Long minTime, Long maxTime)
    {
	List<Opportunity> ownDealsList = new ArrayList<Opportunity>();
	try
	{
		List<Milestone> milestoneList = MilestoneUtil.getMilestonesList();
		for (Milestone milestone : milestoneList)
		{
			if (milestone.won_milestone != null)
			{
				List<Opportunity> list = dao.ofy().query(Opportunity.class).filter("milestone", milestone.won_milestone).filter("won_date >= ", minTime)
					    .filter("won_date <= ", maxTime).filter("archived", false).filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).list();
				if (list != null)
				{
					ownDealsList.addAll(list);
				}
			}
			else
			{
				List<Opportunity> list = dao.ofy().query(Opportunity.class).filter("milestone", "Won").filter("won_date >= ", minTime)
					    .filter("won_date <= ", maxTime).filter("archived", false).filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).list();
				if (list != null)
				{
					ownDealsList.addAll(list);
				}
			}
		}
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return ownDealsList;

    }

    /**
     * Get the new deals list in the specified duration.
     * 
     * @param minTime
     *            Long object
     * @param maxTime
     *            Long object
     */
    public static List<Opportunity> getNewDealsList(Long minTime, Long maxTime)
    {
	List<Opportunity> newDealsList = new ArrayList<Opportunity>();
	try
	{
	    newDealsList = dao.ofy().query(Opportunity.class).filter("created_time >= ", minTime)
		    .filter("created_time <= ", maxTime).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return newDealsList;

    }

    public static List<Opportunity> getOpportunitiesByFilterWithoutDefaultPipeLine(String ownerId, String milestone,
	    String contactId, String fieldName, int max, String cursor, Long pipelineId)
    {
	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();

	    if (pipelineId != null && pipelineId != 1L)
	    {
		// If the track is deleted by the user, get the deals from the
		// default track.
		if (MilestoneUtil.getMilestone(pipelineId) == null)
		    pipelineId = MilestoneUtil.getMilestones().id;

		searchMap.put("pipeline", new Key<Milestone>(Milestone.class, pipelineId));
	    }

	    if (StringUtils.isNotBlank(ownerId))
		searchMap.put("ownerKey", new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId)));

	    if (StringUtils.isNotBlank(milestone))
		searchMap.put("milestone", milestone);

	    if (StringUtils.isNotBlank(contactId))
		searchMap.put("related_contacts", new Key<Contact>(Contact.class, Long.parseLong(contactId)));

	    if (!StringUtils.isNotBlank(fieldName))
		fieldName = "-created_time";

	    if (max != 0)
		return dao.fetchAllByOrder(max, cursor, searchMap, true, false, fieldName);

	    return dao.listByProperty(searchMap);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    return null;
	}

    }

    /**
     * Get the own deals count in the specified duration.
     * 
     * @param minTime
     *            Long object
     * @param maxTime
     *            Long object
     */
    public static int getWonDealsCountOfUser(Long minTime, Long maxTime, Long domainUserId)
    {
	int count = 0;
	try
	{
		List<Milestone> milestoneList = MilestoneUtil.getMilestonesList();
		for (Milestone milestone : milestoneList)
		{
			if (milestone.won_milestone != null)
			{
				count += dao.ofy().query(Opportunity.class).filter("milestone", milestone.won_milestone).filter("won_date >= ", minTime).filter("won_date <= ", maxTime)
					    .filter("archived", false).filter("ownerKey", new Key<DomainUser>(DomainUser.class, domainUserId))
					    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).count();
			}
			else
			{
				count += dao.ofy().query(Opportunity.class).filter("milestone", "Won").filter("won_date >= ", minTime).filter("won_date <= ", maxTime)
					    .filter("archived", false).filter("ownerKey", new Key<DomainUser>(DomainUser.class, domainUserId))
					    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).count();
			}
		}
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return count;

    }

    /**
     * Get the own deals list in the specified duration.
     * 
     * @param minTime
     *            Long object
     * @param maxTime
     *            Long object
     * @param domainUserId
     *            Long object
     */
    public static List<Opportunity> getWonDealsListOfUser(Long minTime, Long maxTime, Long domainUserId)
    {
    List<Opportunity> ownDealsList = new ArrayList<Opportunity>();
	try
	{
		List<Milestone> milestoneList = MilestoneUtil.getMilestonesList();
		for (Milestone milestone : milestoneList)
		{
			if (milestone.won_milestone != null)
			{
				List<Opportunity> list = dao.ofy().query(Opportunity.class).filter("milestone", milestone.won_milestone).filter("won_date >= ", minTime).filter("won_date <= ", maxTime)
					    .filter("archived", false).filter("ownerKey", new Key<DomainUser>(DomainUser.class, domainUserId))
					    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).list();
				if (list != null)
				{
					ownDealsList.addAll(list);
				}
			}
			else
			{
				List<Opportunity> list = dao.ofy().query(Opportunity.class).filter("milestone", "Won").filter("won_date >= ", minTime).filter("won_date <= ", maxTime)
					    .filter("archived", false).filter("ownerKey", new Key<DomainUser>(DomainUser.class, domainUserId))
					    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).list();
				if (list != null)
				{
					ownDealsList.addAll(list);
				}
			}
		}
		return ownDealsList;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

    }

    /**
     * Returns deals based on contact Id or milestone or ownerId or page size or
     * cursor all at once
     * 
     * 
     * @param contactId
     *            - Contact Id
     * @param milestone
     *            - milestone
     * @param ownerId
     *            - deal owner id
     * @param max
     *            -Page size
     * @param cursor
     *            -
     * @return List
     */

    public static List<Opportunity> getDealsWithMilestone(Long contactId, String milestone, Long ownerId, int max,
	    String cursor)
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

	conditionsMap.put("archived", false);

	if (max != 0)
	    return dao.fetchAllByOrder(max, cursor, conditionsMap, true, false, "id");

	return dao.listByProperty(conditionsMap);
    }
    /**
	 * Gets JSONObject of deals of loss reason. These are used for pie chart building.
	 * 
	 * @param minTime
	 *            - Given time less than closed date.
	 * @param maxTime
	 *            - Given time greater than closed date.
	 * @return JsonObject .
	 */
	public static JSONObject getDealswithLossReason(Long ownerId, Long pipelineId, Long sourceId, long minTime,
			long maxTime)
	{

		JSONObject sourcecount = new JSONObject();
		if (minTime == 0 || pipelineId == 0)
		{
			pipelineId = null;
		}
		if (ownerId == 0)
		{
			ownerId = null;
		}
		if (sourceId == 0)
			sourceId = null;
		String timeZone = "UTC";
		UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
		if (userPrefs != null && userPrefs.timezone != null)
		{
			timeZone = userPrefs.timezone;
		}
		List<Opportunity> opportunitiesList = getLostDealsWithOwnerandPipeline(ownerId, pipelineId, minTime,
				maxTime);
		List<Opportunity> opportunitiesList_temp=new ArrayList<Opportunity>();
		if (opportunitiesList != null && opportunitiesList.size() > 0)
		{
			for (Opportunity opportunity : opportunitiesList)
			{
				try
				{
					Long source=opportunity.getDeal_source_id();
					if(sourceId!=null)
					{
						if(sourceId==1)
						{
							if (source==0L)
								opportunitiesList_temp.add(opportunity);
							else
								continue;
						}
						else if (source==sourceId)
							opportunitiesList_temp.add(opportunity);
						else 
							continue;
					}
					else
						opportunitiesList_temp.add(opportunity);
				}
				catch (Exception e)
				{
					System.out.println("Exception :" + e);
				}
			}
			if(opportunitiesList_temp!=null && opportunitiesList_temp.size() > 0){
			CategoriesUtil categoriesUtil = new CategoriesUtil();
			List<Category> reasons = categoriesUtil.getCategoriesByType("DEAL_LOST_REASON");
			JSONObject countandToal = new JSONObject();
			countandToal.put("count", 0);
			countandToal.put("total", 0);
			sourcecount.put("0", countandToal);
			for (Category reason : reasons)
			{
				sourcecount.put(reason.getId(), countandToal);
			}
			}
		}
		for (Opportunity opportunity : opportunitiesList_temp)
		{
			try
			{	
				Long lost_id = opportunity.getLost_reason_id();
				Double value = opportunity.expected_value;

				// Read from previous object if present
				if (sourcecount.containsKey(lost_id.toString()))
				{
					JSONObject sourceObject = sourcecount.getJSONObject(lost_id.toString());
					int count = sourceObject.getInt("count");
					count++;
					Double total = sourceObject.getDouble("total");
					total = total + value;
					sourceObject.put("count", count);
					sourceObject.put("total", total);
					sourcecount.put(lost_id.toString(), sourceObject);
				}

			}
			catch (Exception e)
			{
				System.out.println("Exception :" + e);
			}
		}
		return sourcecount;

	}
	/**
	 * Returns deals based on ownerId or PipelineId or sourceId  or close-date or all at once
	 * 
	 * 
	 * @param ownerId
	 *            - Owner Id
	 * @param pipelineId
	 *            - pipeline Id -
	 *  @param   sourceId      
	 * @return List
	 */
	public static List<Opportunity> getLostDealsWithOwnerandPipeline(Long ownerId, Long pipelineId,
			long minTime, long maxTime)
			{
		UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		List<Opportunity> ownDealsList = new ArrayList<Opportunity>();
		List<Milestone> milestoneList;
		Milestone milestone1;
		if (ownerId != null)
			conditionsMap.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));
		/*if (sourceId != null)
		{
				if(sourceId==1)
					conditionsMap.put("dealSource !="," ");
				else
					conditionsMap.put("dealSource", new Key<Category>(Category.class, sourceId));
		}*/
			
		conditionsMap.put("archived", false);
		conditionsMap.put("milestone_changed_time >= ", minTime);
		conditionsMap.put("milestone_changed_time <= ", maxTime);
		if (pipelineId != null)
		{
			milestone1 = MilestoneUtil.getMilestone(pipelineId);
			if (milestone1.lost_milestone != null)
			{
				conditionsMap.put("milestone", milestone1.lost_milestone);
				conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone1.id));
				List<Opportunity> list = dao.listByProperty(conditionsMap);
				if (list != null)
				{
					ownDealsList.addAll(list);
				}
			}
			else
			{
				conditionsMap.put("milestone", "Lost");
				conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone1.id));
				List<Opportunity> list = dao.listByProperty(conditionsMap);
				if (list != null)
				{
					ownDealsList.addAll(list);
				}
			}
		}
		else
		{
			milestoneList = MilestoneUtil.getMilestonesList();
			for (Milestone milestone : milestoneList)
			{
				if (milestone.lost_milestone != null)
				{
					conditionsMap.put("milestone", milestone.lost_milestone);
					conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone.id));
					List<Opportunity> list = dao.listByProperty(conditionsMap);
					if (list != null)
					{
						ownDealsList.addAll(list);
					}
				}
				else
				{
					conditionsMap.put("milestone", "Lost");
					conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone.id));
					List<Opportunity> list = dao.listByProperty(conditionsMap);
					if (list != null)
					{
						ownDealsList.addAll(list);
					}
				}
			}
		}
		return ownDealsList;
			}
	/**
	 * Returns JSONObject of won Deals divided by source. These are used for pie chart building.
	 * 
	 * @param minTime
	 *            - Given time less than closed date.
	 * @param maxTime
	 *            - Given time greater than closed date.
	 * @return JsonObject .
	 */
	public static JSONObject getWonDealsforpiechart(Long ownerId, long minTime,
			long maxTime){
		JSONObject dealswoncount = new JSONObject();
		if (ownerId == 0)
		{
			ownerId = null;
		}
		String timeZone = "UTC";
		UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
		if (userPrefs != null && userPrefs.timezone != null)
		{
			timeZone = userPrefs.timezone;
		}
		List<Opportunity> opportunitiesList = getWonDealsListWithOwner(minTime,
				maxTime,ownerId);
		if (opportunitiesList != null && opportunitiesList.size() > 0)
		{
			CategoriesUtil categoriesUtil = new CategoriesUtil();
			List<Category> sources = categoriesUtil.getCategoriesByType("DEAL_SOURCE");
			JSONObject countandvalue = new JSONObject();
			countandvalue.put("count", 0);
			countandvalue.put("total", 0);
			dealswoncount.put("0", countandvalue);
			for (Category source : sources)
			{
				dealswoncount.put(source.getId(), countandvalue);
			}
		}
		for (Opportunity opportunity : opportunitiesList)
		{
			try
			{

				Long source_id = opportunity.getDeal_source_id();
				Double value = opportunity.expected_value;

				// Read from previous object if present
				if (dealswoncount.containsKey(source_id.toString()))
				{
					JSONObject sourceObject = dealswoncount.getJSONObject(source_id.toString());
					int count = sourceObject.getInt("count");
					count++;
					Double total = sourceObject.getDouble("total");
					total = total + value;
					sourceObject.put("count", count);
					sourceObject.put("total", total);
					dealswoncount.put(source_id.toString(), sourceObject);
				}

			}
			catch (Exception e)
			{
				System.out.println("Exception :" + e);
			}
		}
		return dealswoncount;
	}
	/**
	 * Returns list of deals based on ownerId  or won-date or all at once
	 * 
	 * 
	 * @param ownerId
	 *            - Owner Id    
	 * @return List
	 */
	public static List<Opportunity> getWonDealsListWithOwner(long minTime, long maxTime, Long ownerId)
	{
		UserAccessControlUtil.checkReadAccessAndModifyQuery("Opportunity", null);
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		List<Opportunity> ownDealsList = new ArrayList<Opportunity>();
		if (ownerId != null)
			conditionsMap.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));
		conditionsMap.put("won_date >= ", minTime);
		conditionsMap.put("won_date <= ", maxTime);
		conditionsMap.put("archived", false);
		try
		{
			List<Milestone> milestoneList = MilestoneUtil.getMilestonesList();
			for (Milestone milestone : milestoneList)
			{
				if (milestone.won_milestone != null)
				{
					conditionsMap.put("milestone", milestone.won_milestone);
					conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone.id));
					List<Opportunity> list = dao.listByProperty(conditionsMap);
					if (list != null)
					{
						ownDealsList.addAll(list);
					}
				}
				else
				{
					conditionsMap.put("milestone", "Won");
					conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone.id));
					List<Opportunity> list = dao.listByProperty(conditionsMap);
					if (list != null)
					{
						ownDealsList.addAll(list);
					}
				}
			}
			return ownDealsList;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}

	}

}