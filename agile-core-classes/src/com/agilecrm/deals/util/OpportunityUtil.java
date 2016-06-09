package com.agilecrm.deals.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeSet;

import javax.xml.bind.annotation.XmlElement;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
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
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.core.api.deals.MilestoneAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.projectedpojos.OpportunityPartial;
import com.agilecrm.projectedpojos.PartialDAO;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.OpportunityDocument;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.access.util.UserAccessControlUtil.CRUDOperation;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PropertyProjection;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.search.Document.Builder;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PropertyProjection;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.cache.CachingDatastoreServiceFactory;

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
     * ObjectifyDao of OpportunityPartial.
     */
    private static PartialDAO<OpportunityPartial> partialDAO = new PartialDAO<OpportunityPartial>(OpportunityPartial.class);

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
	Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime);
	return dao.fetchAll(q);
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
		double total = 0D;
        double pipeline = 0D;
         if(opportunity.expected_value!=null){
            total=opportunity.expected_value;
            pipeline=opportunity.expected_value * opportunity.probability / 100;
         }

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
	Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime).filter("milestone", milestone).order("close_date");
	return dao.getCount(q);
    }
    
    public static int getDealsbyMilestone(Long pipelineId)
    {
	Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("pipeline",  new Key<Milestone>(Milestone.class, pipelineId)).limit(2);
	return dao.getCount(q);
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
	Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime);
	int numOpportunities = dao.getCount(q);

	JSONObject conversionObject = new JSONObject();

	// Gets total number of opportunities with milestone won
	int closedNumOpportunities = getTotalNumberOfMilestones(minTime, maxTime, "won");

	conversionObject.put("conversion", (closedNumOpportunities * 100) / numOpportunities);

	System.out.println(conversionObject);
	return conversionObject;
    }

    public static List<Opportunity> getDealsRelatedToCurrentUser()
    {
	Query<Opportunity> q = dao.ofy().query(Opportunity.class)
		.filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.filter("archived", false).order("-created_time").limit(10);
	return dao.fetchAll(q);
    }

    public static List<Opportunity> getUpcomingDealsRelatedToCurrentUser(String pageSize)
    {
	System.out.println("deals--------------------");
	Query<Opportunity> q = dao.ofy().query(Opportunity.class)
		.filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.filter("archived", false).order("close_date").limit(Integer.parseInt(pageSize));
	return dao.fetchAll(q);
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
	Query<Opportunity> q = dao.ofy().query(Opportunity.class)
		.filter("pipeline", new Key<Milestone>(Milestone.class, pipelineId)).filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime).filter("milestone", milestone).order("close_date");
	return dao.getCount(q);
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
    public static JSONObject getDealsDetailsByPipeline(Long ownerId, Long pipelineId, Long sourceId, long minTime,
	    long maxTime, String frequency)
    {
	// Final JSON Constants
	String TOTAL = "Total";
	String PIPELINE = "Pipeline";
	int type = Calendar.DAY_OF_MONTH;
	// Deals Object
	JSONObject dealsObject = new JSONObject();
	CategoriesUtil categoriesUtil = new CategoriesUtil();

	/*
	 * if (pipelineId == null || pipelineId == 0L) pipelineId =
	 * MilestoneUtil.getMilestones().id;
	 */

	// Returns month (key) and total and pipeline
	// If request comes from deals list view or request comes from dashboard
	// and pipeline id is 0,
	// we'll assign null to pipeline id to get all tracks data
	if (minTime == 0 || pipelineId == 0)
	{
	    pipelineId = null;
	}
	if (ownerId != null && ownerId == 0)
	    ownerId = null;
	if (sourceId != null && sourceId == 0)
	    sourceId = null;
	String timeZone = "UTC";
	UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
	if (userPrefs != null && userPrefs.timezone != null)
	{
	    timeZone = userPrefs.timezone;
	}
	List<Opportunity> opportunitiesList = getDealsWithOwnerandPipeline(ownerId, pipelineId, minTime, maxTime);
	List<Opportunity> opportunitiesList_temp = new ArrayList<Opportunity>();
	if (opportunitiesList != null && opportunitiesList.size() > 0)
	{
	    if (sourceId != null)
	    {
		for (Opportunity opportunity : opportunitiesList)
		{
		    boolean flag = true;
		    try
		    {
			Long source = opportunity.getDeal_source_id();
			if (sourceId == 1)
			{
			    if (source == 0L)
				opportunitiesList_temp.add(opportunity);
			    else
			    {
				List<Category> sources = categoriesUtil.getCategoriesByType("DEAL_SOURCE");
				for (Category source_id : sources)
				{
				    if (source.toString().equals(source_id.getId().toString()))
				    {
					flag = false;
					break;
				    }

				}
				if (flag)
				    opportunitiesList_temp.add(opportunity);
			    }
			}
			else if (source.toString().equals(sourceId.toString()))
			    opportunitiesList_temp.add(opportunity);
			else
			    continue;
		    }
		    catch (Exception e)
		    {
			System.out.println("Exception :" + e);
		    }
		}
	    }
	    else
		opportunitiesList_temp = opportunitiesList;
	    if (opportunitiesList_temp != null && opportunitiesList_temp.size() > 0)
	    {
		Calendar startCalendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
		System.out.println("Start Calendar timezone id-----" + startCalendar.getTimeZone().getID());
		if (minTime == 0)
		{
		    startCalendar.setTimeInMillis(opportunitiesList_temp.get(0).close_date * 1000);
		}
		else
		{
		    startCalendar.setTimeInMillis(minTime * 1000);
		}
		if (frequency != null)
		{
		    if (StringUtils.equalsIgnoreCase(frequency, "monthly"))
			startCalendar.set(Calendar.DAY_OF_MONTH, 1);

		    if (StringUtils.equalsIgnoreCase(frequency, "Quarterly"))
		    {
			int a = startCalendar.get(Calendar.MONTH) / 3;
			a = a * 3;
			startCalendar.set(Calendar.MONTH, a);
			startCalendar.set(Calendar.DAY_OF_MONTH, 1);

		    }
		}
		else
		    startCalendar.set(Calendar.DAY_OF_MONTH, 1);
		startCalendar.set(Calendar.HOUR_OF_DAY, 0);
		startCalendar.set(Calendar.MINUTE, 0);
		startCalendar.set(Calendar.SECOND, 0);
		startCalendar.set(Calendar.MILLISECOND, 0);
		System.out.println("startCalendar.getTimeInMillis()-----" + startCalendar.getTimeInMillis());
		Calendar endCalendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
		System.out.println("End Calendar timezone id-----" + endCalendar.getTimeZone().getID());
		if (maxTime == 1543842319)
		{
		    endCalendar
			    .setTimeInMillis(opportunitiesList_temp.get(opportunitiesList_temp.size() - 1).close_date * 1000);
		}
		else
		{
		    endCalendar.setTimeInMillis(maxTime * 1000);
		}
		if (frequency != null)
		{
		    if (StringUtils.equalsIgnoreCase(frequency, "monthly"))
			endCalendar.set(Calendar.DAY_OF_MONTH, 1);
		    if (StringUtils.equalsIgnoreCase(frequency, "Quarterly"))
		    {
			int a = endCalendar.get(Calendar.MONTH) / 3;
			a = a * 3;
			endCalendar.set(Calendar.MONTH, a);
			endCalendar.set(Calendar.DAY_OF_MONTH, 1);

		    }
		}
		else
		    endCalendar.set(Calendar.DAY_OF_MONTH, 1);
		endCalendar.set(Calendar.HOUR_OF_DAY, 0);
		endCalendar.set(Calendar.MINUTE, 0);
		endCalendar.set(Calendar.SECOND, 0);
		endCalendar.set(Calendar.MILLISECOND, 0);
		System.out.println("endCalendar.getTimeInMillis()-----" + endCalendar.getTimeInMillis());
		long startTimeInMilliSecs = startCalendar.getTimeInMillis();
		while (startTimeInMilliSecs <= endCalendar.getTimeInMillis())
		{
		    JSONObject totalAndPipeline = new JSONObject();
		    totalAndPipeline.put(TOTAL, 0);
		    totalAndPipeline.put(PIPELINE, 0);
		    String mmYY = (startCalendar.getTimeInMillis() / 1000) + "";
		    dealsObject.put(mmYY, totalAndPipeline);
		    if (frequency != null)
		    {
			if (StringUtils.equalsIgnoreCase(frequency, "daily"))
			{
			    type = Calendar.DAY_OF_MONTH;
			    startCalendar.add(type, 1);
			}
			if (StringUtils.equalsIgnoreCase(frequency, "monthly"))
			{
			    type = Calendar.MONTH;
			    startCalendar.add(type, 1);
			    startCalendar.set(Calendar.DAY_OF_MONTH, 1);
			}
			if (StringUtils.equalsIgnoreCase(frequency, "Quarterly"))
			{
			    type = Calendar.MONTH;
			    startCalendar.add(type, 3);
			    startCalendar.set(Calendar.DAY_OF_MONTH, 1);
			}
			if (StringUtils.equalsIgnoreCase(frequency, "weekly"))
			{
			    type = Calendar.WEEK_OF_YEAR;
			    startCalendar.add(type, 1);
			}
		    }
		    else
		    {
			startCalendar.add(Calendar.MONTH, 1);
			startCalendar.set(Calendar.DAY_OF_MONTH, 1);
		    }
		    startCalendar.set(Calendar.HOUR_OF_DAY, 0);
		    startCalendar.set(Calendar.MINUTE, 0);
		    startCalendar.set(Calendar.SECOND, 0);
		    startCalendar.set(Calendar.MILLISECOND, 0);
		    startTimeInMilliSecs = startCalendar.getTimeInMillis();

		}
	    }
	}
	for (Opportunity opportunity : opportunitiesList_temp)
	{
	    String last = "";
	    try
	    {
		String wonMilestone = "Won";
		String lostMilestone = "Lost";
		Milestone mile = MilestoneUtil.getMilestone(opportunity.getPipeline_id());
		if (mile.won_milestone != null)
		    wonMilestone = mile.won_milestone;
		if (mile.lost_milestone != null)
		    lostMilestone = mile.lost_milestone;

		// If the deal is won, change the probability to 100.
		if (opportunity.milestone.equalsIgnoreCase(wonMilestone))
		    opportunity.probability = 100;

		// If the deal is lost, change the probability to 0.
		if (opportunity.milestone.equalsIgnoreCase(lostMilestone))
		    opportunity.probability = 0;
		// Total and Pipeline (total * probability)
		double total = 0D;
        double pipeline = 0D;
         if(opportunity.expected_value!=null){
            total=opportunity.expected_value;
            pipeline=opportunity.expected_value * opportunity.probability / 100;
         }
		

		/*
		 * //mm-yy DateFormat formatter = new SimpleDateFormat("MM-yy");
		 * //Get mm/yy String mmYY = formatter.format(new
		 * Date(opportunity.close_date * 1000));
		 */
		Date opportunityDate = new Date(opportunity.close_date * 1000);

		Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
		calendar.setTimeInMillis(opportunity.close_date * 1000);
		if (frequency != null)
		{
		    if (StringUtils.equalsIgnoreCase(frequency, "monthly"))
			calendar.set(Calendar.DAY_OF_MONTH, 1);
		    if (StringUtils.equalsIgnoreCase(frequency, "Quarterly"))
		    {
			int a = calendar.get(Calendar.MONTH) / 3;
			a = a * 3;
			calendar.set(Calendar.MONTH, a);
			calendar.set(Calendar.DAY_OF_MONTH, 1);
		    }
		    if (StringUtils.equalsIgnoreCase(frequency, "weekly"))
		    {

			Iterator iter = dealsObject.keys();
			while (iter.hasNext())
			{
			    String key = (String) iter.next();
			    if ((calendar.getTimeInMillis() / 1000 + "").compareToIgnoreCase(key.toString()) > -1)
			    {
				last = key;
				continue;
			    }
			    break;
			}

		    }
		}
		else
		    calendar.set(Calendar.DAY_OF_MONTH, 1);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		String mmYY;
		Date firstDayOfMonth = calendar.getTime();
		if (frequency != null && StringUtils.equalsIgnoreCase(frequency, "weekly"))
		    mmYY = last;
		else
		    mmYY = (calendar.getTimeInMillis() / 1000) + "";

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
	List<String> milestoneList = new ArrayList<String>();
	milestoneList.add("New");
	milestoneList.add("Prospect");
	milestoneList.add("Proposal");
	Query<Opportunity> q = dao.ofy().query(Opportunity.class)
		.filter("close_date <=", (new Date()).getTime() / 1000).filter("close_date !=", null)
		.filter("milestone in", milestoneList)
		.filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.order("close_date");
	return dao.fetchAll(q);
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
	List<String> milestoneList = new ArrayList<String>();
	milestoneList.add("New");
	milestoneList.add("Prospect");
	milestoneList.add("Proposal");
	Query<Opportunity> q = dao.ofy().query(Opportunity.class)
		.filter("close_date <=", (new Date()).getTime() / 1000).filter("close_date !=", null)
		.filter("milestone in", milestoneList).order("close_date");
	return dao.fetchAll(q);
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

	    searchMap.putAll(getDateFilterCondition(filterJson, sortField));
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

    
    // Total value count using projection query
    public static Double getTotalValueOfDeals(org.json.JSONObject filterJson) throws JSONException
    {
    com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("Opportunity");
    DatastoreService dataStore = DatastoreServiceFactory.getDatastoreService();
 	query.addProjection(new PropertyProjection("expected_value", Double.class));
	double dealTotal = 0d;
	double start_value = 0d;
	double end_value = 0d;
	String sortField = "close_date";
	String fieldval = filterJson.getString("field");
	try
	{
		
	    if (checkJsonString(filterJson, "pipeline_id"))
	    {
	    	 Key<Milestone> pipelinekey = new Key<Milestone>(Milestone.class, Long.parseLong(filterJson.getString("pipeline_id")));
    		 query.addFilter("pipeline", FilterOperator.EQUAL, KeyFactory.createKey(pipelinekey.getKind(), pipelinekey.getId()));
    		 

		if (checkJsonString(filterJson, "milestone")){
			query.addFilter("milestone" , FilterOperator.EQUAL , filterJson.getString("milestone"));		    
	    }
	    }
	    if (checkJsonString(filterJson, "owner_id")){
	    	 Key<DomainUser> ownerkey = new Key<DomainUser>(DomainUser.class, Long.parseLong(filterJson.getString("owner_id")));
    		 query.addFilter("ownerKey", FilterOperator.EQUAL, KeyFactory.createKey(ownerkey.getKind(), ownerkey.getId()));
    		 
	    	
	 //   	query.setFilter(com.google.appengine.api.datastore.Query.FilterOperator.EQUAL.of("ownerKey",searchMap.get("ownerKey")));
	    }
	    if (checkJsonString(filterJson, "archived"))
	    {
		if (!filterJson.getString("archived").equals("all")){
	    query.addFilter("archived",FilterOperator.EQUAL, Boolean.parseBoolean(filterJson.getString("archived")));		 
	    }
	    }
	    if (checkJsonString(filterJson, "probability_filter")
		    && filterJson.getString("probability_filter").equalsIgnoreCase("equals"))
	    {
		if (checkJsonString(filterJson, "probability"))
		{
		    long probability = Long.parseLong(filterJson.getString("probability").replace("%", ""));
		    query.addFilter("probability" , FilterOperator.EQUAL, probability);
		}

	    }
	    else
	    {
		if (checkJsonString(filterJson, "probability_start"))
		{
		    long probability = Long.parseLong(filterJson.getString("probability_start").replace("%", ""));
	        query.addFilter("probability",FilterOperator.GREATER_THAN, probability);
		}
		if (checkJsonString(filterJson, "probability_end"))
		{
		    long probability = Long.parseLong(filterJson.getString("probability_end").replace("%", ""));
		    query.addFilter("probability",FilterOperator.LESS_THAN, probability);
		}
	    }
	    if (checkJsonString(filterJson, "close_date_filter")) {
	    	    	 String fieldName = "close_date" ;
		    if (checkJsonString(filterJson, fieldName + "_filter"))
		    {
			if (filterJson.getString(fieldName + "_filter").equalsIgnoreCase("on")
				&& checkJsonString(filterJson, fieldName + "_start"))
			{
			    long closeDate = Long.parseLong(filterJson.getString(fieldName+"_start"));
			    query.addFilter(fieldName,FilterOperator.EQUAL,closeDate );
			}
			else if (filterJson.getString(fieldName + "_filter").equalsIgnoreCase("before")
					&& checkJsonString(filterJson, fieldName + "_start"))
				{
				    long closeDate = Long.parseLong(filterJson.getString(fieldName+"_start"));
				    query.addFilter(fieldName,FilterOperator.LESS_THAN,closeDate );
				}
			else if (filterJson.getString(fieldName + "_filter").equalsIgnoreCase("after")
					&& checkJsonString(filterJson, fieldName + "_start"))
				{
				    long closeDate = Long.parseLong(filterJson.getString(fieldName+"_start"));
				    query.addFilter(fieldName,FilterOperator.GREATER_THAN,closeDate );
				}
			else
			{
				if (filterJson.getString(fieldName + "_filter").equalsIgnoreCase("between") ||( filterJson.getString(fieldName + "_filter").equalsIgnoreCase("last") || filterJson.getString(fieldName + "_filter").equalsIgnoreCase("next")) ){
			    if (checkJsonString(filterJson, fieldName + "_start"))
			    {
				long closeDate = Long.parseLong(filterJson.getString(fieldName + "_start"));
				if (filterJson.getString(fieldName + "_filter").equalsIgnoreCase("next"))
					query.addFilter(fieldName,FilterOperator.GREATER_THAN,closeDate );
				else
					query.addFilter(fieldName,FilterOperator.GREATER_THAN_OR_EQUAL,closeDate );
			    }
			    if (checkJsonString(filterJson, fieldName + "_end"))
			    {
				long closeDate = Long.parseLong(filterJson.getString(fieldName + "_end"));
				 query.addFilter(fieldName,FilterOperator.LESS_THAN_OR_EQUAL,closeDate );
			    }
			}
			}
		    }
		
	    }
	    if (checkJsonString(filterJson, "created_time")) {
	    
	    	 String fieldName = filterJson.getString("created_time");
		    if (checkJsonString(filterJson, fieldName + "_filter"))
		    {
			if (filterJson.getString(fieldName + "_filter").equalsIgnoreCase("equals")
				&& checkJsonString(filterJson, fieldName))
			{
			    long closeDate = Long.parseLong(filterJson.getString(fieldName));
			     query.addFilter(fieldName,FilterOperator.EQUAL,closeDate );
			}
			else
			{
			    if (checkJsonString(filterJson, fieldName + "_start"))
			    {
				long closeDate = Long.parseLong(filterJson.getString(fieldName + "_start"));
				 query.addFilter(fieldName,FilterOperator.GREATER_THAN,closeDate );
			    }
			    if (checkJsonString(filterJson, fieldName + "_end"))
			    {
				long closeDate = Long.parseLong(filterJson.getString(fieldName + "_end"));
				 query.addFilter(fieldName,FilterOperator.LESS_THAN,closeDate );
			    }
			}
		    }
		 }   
    		 Key<Milestone> pipelinekey = new Key<Milestone>(Milestone.class, Long.parseLong(filterJson.getString("pipeline_id")));
    		 KeyFactory.createKey(pipelinekey.getKind(), pipelinekey.getId());
    		 query.addFilter("pipeline", FilterOperator.EQUAL, KeyFactory.createKey(pipelinekey.getKind(), pipelinekey.getId()));
    		 
		      System.out.println("hello n try block "+filterJson.getLong("pipeline_id"));
		      System.out.println(sortField);
		      query.addSort(sortField , SortDirection.ASCENDING);
		      List<Entity> deals = dataStore.prepare(query).asList(FetchOptions.Builder.withDefaults());
		      System.out.println("deals size in projection query = "+deals.size());
		      if (checkJsonString(filterJson, "value_filter")
		  		    && filterJson.getString("value_filter").equalsIgnoreCase("equals"))
		  	    {
		  		if (checkJsonString(filterJson, "value"))
		  		{
		  		    double value = Double.parseDouble(filterJson.getString("value"));
		  		    for (Entity eachdeal : deals) {
		  		    	if(((Double)eachdeal.getProperty("expected_value")) == value)
		  		    		dealTotal = dealTotal+((Double)eachdeal.getProperty("expected_value")) ;
		  		  	}
		  		    System.out.println("out side try "+dealTotal);
			        return  dealTotal;
		  		}

		  	    }
		  	    else
		  	    {
		  		if (checkJsonString(filterJson, "value_start"))
		  		{
		  		    start_value = Double.parseDouble(filterJson.getString("value_start").replace("%", ""));
		  		}
		  		if (checkJsonString(filterJson, "value_end"))
		  		{
		  		   end_value = Double.parseDouble(filterJson.getString("value_end").replace("%", ""));
		  		 
		  		}
		  	    }
		      if (start_value > 0 && end_value >0)
		      {
		    	  for (Entity eachdeal : deals) {
		    		  if (((Double)eachdeal.getProperty("expected_value")) >=start_value && ((Double)eachdeal.getProperty("expected_value"))  <=end_value )
			    	        dealTotal = dealTotal+((Double)eachdeal.getProperty("expected_value")) ;
			      }
			      
			  System.out.println("out side try "+dealTotal);
			  return  dealTotal;
		      }
		      else if (start_value > 0 && end_value ==0)
		      {
		    	  for (Entity eachdeal : deals) {
		    		  if (((Double)eachdeal.getProperty("expected_value")) >=start_value )
			    	        dealTotal = dealTotal+((Double)eachdeal.getProperty("expected_value")) ;
			      }
			      
			  System.out.println("out side try "+dealTotal);
			  return  dealTotal;
		      }
		      else if (start_value == 0 && end_value >0)
		      {
		    	  for (Entity eachdeal : deals) {
		    		  if (((Double)eachdeal.getProperty("expected_value")) <=end_value )
			    	        dealTotal = dealTotal+((Double)eachdeal.getProperty("expected_value")) ;
			      }
			      
			  System.out.println("out side try "+dealTotal);
			  return  dealTotal;
		      }
		      for (Entity eachdeal : deals) {
		    	  dealTotal = dealTotal+((Double)eachdeal.getProperty("expected_value")) ;
		      }
		      
		  System.out.println("out side try "+dealTotal);
		  return  dealTotal;
	  }
	catch (JSONException e)
	{
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
		if (json.getString(fieldName + "_filter").equalsIgnoreCase("on")
			&& checkJsonString(json, fieldName +"_start"))
		{
		    long closeDateStart = Long.parseLong(json.getString(fieldName + "_start"));
		    searchMap.put("close_date	" , closeDateStart);
		    
		}
		else if (json.getString(fieldName + "_filter").equalsIgnoreCase("after")
				&& checkJsonString(json, fieldName +"_start"))
			{
			    long closeDate = Long.parseLong(json.getString(fieldName + "_start"));
			    searchMap.put("close_date	 >", closeDate);
			}
		else if (json.getString(fieldName + "_filter").equalsIgnoreCase("before")
				&& checkJsonString(json, fieldName +"_start"))
			{
			    long closeDate = Long.parseLong(json.getString(fieldName + "_start"));
			    searchMap.put("close_date	 < ", closeDate);
			}
		else
		{ 
			if (json.getString(fieldName + "_filter").equalsIgnoreCase("between") ||( json.getString(fieldName + "_filter").equalsIgnoreCase("last") || json.getString(fieldName + "_filter").equalsIgnoreCase("next")) ){
			    if (checkJsonString(json, fieldName + "_start"))
			    {
				long closeDate = Long.parseLong(json.getString(fieldName + "_start"));
				if( json.getString(fieldName + "_filter").equalsIgnoreCase("next"))
					searchMap.put("close_date	 > ", closeDate);
				else
					searchMap.put("close_date	 >= ", closeDate);
			    }
			    if (checkJsonString(json, fieldName + "_end"))
			    {
				long closeDate = Long.parseLong(json.getString(fieldName + "_end"));
				searchMap.put("close_date <= ", closeDate);
			    }
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
    public static List<Opportunity> getPendingDealsRelatedToCurrentUser(long dueDate, String track, String milestone_id)
    {
	List<Opportunity> pendingDealsList = new ArrayList<Opportunity>();
	try
	{
	    if (track != null && milestone_id != null)
	    {
		Query<Opportunity> q = dao.ofy().query(Opportunity.class)
			.filter("close_date <=", (new Date()).getTime() / 1000).filter("archived", false).limit(50)
			.filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
			.filter("pipeline", new Key<Milestone>(Milestone.class, Long.valueOf(track)))
			.filter("milestone", milestone_id).order("close_date");
		pendingDealsList = dao.fetchAll(q);
	    }
	    else
	    {
		List<Milestone> milestoneList = new ArrayList<Milestone>();
		if (track != null && milestone_id == null)
		{
		    if (MilestoneUtil.getMilestone(Long.valueOf(track)) != null)
			milestoneList.add(MilestoneUtil.getMilestone(Long.valueOf(track)));
		}
		else
		{
		    milestoneList = MilestoneUtil.getMilestonesList();
		}
		if (milestoneList != null && milestoneList.size() > 0)
		{
		    for (Milestone milestone : milestoneList)
		    {
			List<String> milestoneNamesList = new ArrayList<String>();
			String[] milestoneNamesArray = milestone.milestones.split(",");
			if (milestone.won_milestone != null && milestone.lost_milestone != null)
			{
			    for (String string : milestoneNamesArray)
			    {
				if (!string.equals(milestone.won_milestone) && !string.equals(milestone.lost_milestone))
				{
				    milestoneNamesList.add(string);
				}
			    }
			}
			else
			{
			    for (String string : milestoneNamesArray)
			    {
				if (!string.equals("Won") && !string.equals("Lost"))
				{
				    milestoneNamesList.add(string);
				}
			    }
			}
			Query<Opportunity> q = dao
				.ofy()
				.query(Opportunity.class)
				.filter("close_date <=", (new Date()).getTime() / 1000)
				.filter("archived", false)
				.limit(50)
				.filter("ownerKey",
					new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
				.filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id))
				.filter("milestone in", milestoneNamesList).order("close_date");
			List<Opportunity> allDealsList = dao.fetchAll(q);
			pendingDealsList.addAll(allDealsList);
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
    public static List<Opportunity> getPendingDealsRelatedToAllUsers(long dueDate, String track, String milestone_id)
    {
	List<Opportunity> pendingDealsList = new ArrayList<Opportunity>();
	try
	{

	    if (track != null && milestone_id != null)
	    {
		Query<Opportunity> q = dao.ofy().query(Opportunity.class)
			.filter("close_date <=", (new Date()).getTime() / 1000).filter("archived", false).limit(50)
			.filter("pipeline", new Key<Milestone>(Milestone.class, Long.valueOf(track)))
			.filter("milestone", milestone_id).order("close_date");
		pendingDealsList = dao.fetchAll(q);
	    }
	    else
	    {
		List<Milestone> milestoneList = new ArrayList<Milestone>();
		if (track != null && milestone_id == null)
		{
		    if (MilestoneUtil.getMilestone(Long.valueOf(track)) != null)
			milestoneList.add(MilestoneUtil.getMilestone(Long.valueOf(track)));
		}
		else
		{
		    milestoneList = MilestoneUtil.getMilestonesList();
		}
		if (milestoneList != null && milestoneList.size() > 0)
		{
		    for (Milestone milestone : milestoneList)
		    {
			List<String> milestoneNamesList = new ArrayList<String>();
			String[] milestoneNamesArray = milestone.milestones.split(",");
			if (milestone.won_milestone != null && milestone.lost_milestone != null)
			{
			    for (String string : milestoneNamesArray)
			    {
				if (!string.equals(milestone.won_milestone) && !string.equals(milestone.lost_milestone))
				{
				    milestoneNamesList.add(string);
				}
			    }
			}
			else
			{
			    for (String string : milestoneNamesArray)
			    {
				if (!string.equals("Won") && !string.equals("Lost"))
				{
				    milestoneNamesList.add(string);
				}
			    }
			}
			Query<Opportunity> q = dao.ofy().query(Opportunity.class)
				.filter("close_date <=", (new Date()).getTime() / 1000).filter("archived", false)
				.limit(50).filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id))
				.filter("milestone in", milestoneNamesList).order("close_date");
			List<Opportunity> allDealsList = dao.fetchAll(q);
			pendingDealsList.addAll(allDealsList);
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
	Double totalMilestoneValue = 0.0d;
	List<Opportunity> milestoneList = null;
	Map<Double, Integer> map = new LinkedHashMap<Double, Integer>();
	try
	{
	    if (ownerId != null)
	    {
		Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("milestone", milestone)
			.filter("close_date <=", dueDate)
			.filter("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId)).filter("archived", false)
			.order("close_date");
		milestoneList = dao.fetchAll(q);
	    }
	    else
	    {
		if (owner)
		{
		    Query<Opportunity> q = dao
			    .ofy()
			    .query(Opportunity.class)
			    .filter("milestone", milestone)
			    .filter("pipeline", new Key<Milestone>(Milestone.class, trackId))
			    .filter("ownerKey",
				    new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
			    .filter("archived", false).order("close_date");
		    milestoneList = dao.fetchAll(q);
		}
		else
		{
		    Query<Opportunity> q = dao.ofy().query(Opportunity.class)
			    .filter("pipeline", new Key<Milestone>(Milestone.class, trackId))
			    .filter("milestone", milestone).filter("archived", false).order("close_date");
		    milestoneList = dao.fetchAll(q);
		}
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
	try
	{
	    if (ownerId != null)
	    {
		Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("milestone", "Won")
			.filter("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId)).filter("archived", false)
			.order("-created_time");
		return dao.fetchAll(q);
	    }

	    else
	    {
		Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("milestone", "Won")
			.filter("archived", false).order("-created_time");
		return dao.fetchAll(q);
	    }

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
	Query<Opportunity> q = dao.ofy().query(Opportunity.class)
		.filter("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId)).filter("archived", false)
		.order("-created_time");
	return dao.fetchAll(q);
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
	    org.json.JSONObject filterJSON = new org.json.JSONObject(filters);
		System.out.println("------------" + filterJSON.toString());
		
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
		    Query<Opportunity> q = dao.ofy().query(Opportunity.class)
			    .filter("milestone", milestone.won_milestone).filter("won_date >= ", minTime)
			    .filter("won_date <= ", maxTime).filter("archived", false)
			    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("won_date");
		    ;
		    Query<Opportunity> timeChanged = dao.ofy().query(Opportunity.class)
				    .filter("milestone", milestone.won_milestone).filter("milestone_changed_time >= ", minTime)
				    .filter("milestone_changed_time <= ", maxTime).filter("archived", false)
				    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("-milestone_changed_time");
			 ;
		    List<Opportunity> listWonDate = dao.fetchAll(q);
		    List<Opportunity> listTimeChanged = dao.fetchAll(timeChanged);
		    Map <Long, Opportunity> map = new HashMap<Long,Opportunity>();
		    for(Opportunity oppr: listWonDate){
		        map.put(oppr.id , oppr);
		    }
		    for(Opportunity oppr2: listTimeChanged){
		    	if(map.get(oppr2.id) == null)
		    	       map.put(oppr2.id , oppr2);
		    }

		    List<Opportunity> list = new ArrayList<Opportunity>(map.values());   
		   
		    for(Opportunity opp : list) 
	            System.out.println(opp.id);
	         
		    if (list != null)
		    {
			ownDealsList.addAll(list);
		    }
		}
		else
		{
		    Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("milestone", "Won")
			    .filter("won_date >= ", minTime).filter("won_date <= ", maxTime).filter("archived", false)
			    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("won_date");
		    ;
		    Query<Opportunity> timeChanged = dao.ofy().query(Opportunity.class)
				    .filter("milestone", "Won").filter("milestone_changed_time >= ", minTime)
				    .filter("milestone_changed_time <= ", maxTime).filter("archived", false)
				    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("won_date");
			 ;
		    List<Opportunity> listWonDate = dao.fetchAll(q);
		    List<Opportunity> listTimeChanged = dao.fetchAll(timeChanged);
		    Map <Long, Opportunity> map = new HashMap<Long,Opportunity>();
		    for(Opportunity oppr: listWonDate){
		        map.put(oppr.id , oppr);
		    }
		    for(Opportunity oppr2: listTimeChanged){
		    	if(map.get(oppr2.id) == null)
		    	       map.put(oppr2.id , oppr2);
		    }

		    List<Opportunity> list = new ArrayList<Opportunity>(map.values());  
		    for(Opportunity opp : list) 
	            System.out.println(opp.id);
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
	    Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("created_time >= ", minTime)
		    .filter("created_time <= ", maxTime);
	    newDealsList = dao.fetchAll(q);
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
		    count += dao.ofy().query(Opportunity.class)
			    .filter("milestone", milestone.won_milestone).filter("won_date >= ", minTime)
			    .filter("won_date <= ", maxTime).filter("archived", false)
			    .filter("ownerKey", new Key<DomainUser>(DomainUser.class, domainUserId))
			    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("won_date").count();
		   // count += dao.getCount(q);
		}
		else
		{
		   count += dao.ofy().query(Opportunity.class).filter("milestone", "Won")
			    .filter("won_date >= ", minTime).filter("won_date <= ", maxTime).filter("archived", false)
			    .filter("ownerKey", new Key<DomainUser>(DomainUser.class, domainUserId))
			    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("won_date").count();
		    //count += dao.getCount(q);
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
		    List<Opportunity> list = dao.ofy().query(Opportunity.class)
                .filter("milestone", milestone.won_milestone).filter("won_date >= ", minTime)
                .filter("won_date <= ", maxTime).filter("archived", false)
                .filter("ownerKey", new Key<DomainUser>(DomainUser.class, domainUserId))
                .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("won_date").list();
            //List<Opportunity> list = dao.fetchAll(q);
		    if (list != null)
		    {
			ownDealsList.addAll(list);
		    }
		}
		else
		{
		    Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("milestone", "Won")
			    .filter("won_date >= ", minTime).filter("won_date <= ", maxTime).filter("archived", false)
			    .filter("ownerKey", new Key<DomainUser>(DomainUser.class, domainUserId))
			    .filter("pipeline", new Key<Milestone>(Milestone.class, milestone.id)).order("won_date");
		    List<Opportunity> list = dao.fetchAll(q);
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
     * 
     * Gets JSONObject of deals and Total pipeline values of deals with respect
     * to da. These are used for graph building.
     * 
     * @param minTime
     *            - Given time less than closed date.
     * @param maxTime
     *            - Given time greater than closed date.
     * @return JsonObject .
     */
    public static JSONObject getIncomingDealsList(Long ownerId, Long minTime, Long maxTime, String frequency,
	    String type)
    {
	JSONObject newDealsObject = new JSONObject();

	String timeZone = "UTC";
	List<Opportunity> opportunitiesList;
	UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
	if (userPrefs != null && userPrefs.timezone != null)
	{
	    timeZone = userPrefs.timezone;
	}
	if (ownerId != null && ownerId != 0)
	    opportunitiesList = getNewDealsListWithOwner(ownerId, minTime, maxTime);
	else
	    opportunitiesList = getNewDealsList(minTime, maxTime);
	// opportunitiesList.get(0).getDeal_source_id();
	CategoriesUtil categoriesUtil = new CategoriesUtil();
	List<Category> sources = categoriesUtil.getCategoriesByType("DEAL_SOURCE");
	JSONObject sourcecount = new JSONObject();
	sourcecount.put("0", type.equalsIgnoreCase("deals") ? 0 : 0.0);
	for (Category source : sources)
	{
	    sourcecount.put(source.getId().toString(), type.equalsIgnoreCase("deals") ? 0 : 0.0);
	}
	System.out.println(sources.get(0).getId());
	newDealsObject = ReportsUtil.initializeFrequencyForReports(minTime, maxTime, frequency, timeZone, sourcecount);

	System.out.println("Total opportunitite....." + opportunitiesList.size());
	for (Opportunity opportunity : opportunitiesList)
	{
	    String last = "";
	    boolean flag_reason = true;
	    try
	    {
		/*
		 * //mm-yy DateFormat formatter = new SimpleDateFormat("MM-yy");
		 * //Get mm/yy String mmYY = formatter.format(new
		 * Date(opportunity.close_date * 1000));
		 */
		Long source_id = opportunity.getDeal_source_id();
		System.out.println(categoriesUtil.getCategory(source_id));
		List<Category> sources_id = categoriesUtil.getCategoriesByType("DEAL_SOURCE");
		for (Category source_temp : sources_id)
		{
		    if (source_temp.getId().toString().equals(source_id.toString()))
			flag_reason = false;
		}
		if (flag_reason)
		    source_id = 0L;
		System.out.println("source" + source_id);
		Double revenue = opportunity.expected_value;
		Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
		calendar.setTimeInMillis(opportunity.created_time * 1000);

		if (StringUtils.equalsIgnoreCase(frequency, "monthly"))
		    calendar.set(Calendar.DAY_OF_MONTH, 1);
		if (StringUtils.equalsIgnoreCase(frequency, "weekly"))
		{

		    Iterator iter = newDealsObject.keys();
		    while (iter.hasNext())
		    {
			String key = (String) iter.next();
			if ((calendar.getTimeInMillis() / 1000 + "").compareToIgnoreCase(key.toString()) > -1)
			{
			    last = key;
			    continue;
			}
			break;
		    }

		}
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);

		String createdtime;
		if (StringUtils.equalsIgnoreCase(frequency, "weekly"))
		    createdtime = last;
		else
		    createdtime = (calendar.getTimeInMillis() / 1000) + "";
		double count = 0;

		// Read from previous object if present
		if (newDealsObject.containsKey(createdtime))
		{
		    JSONObject sourcecount1 = newDealsObject.getJSONObject(createdtime);
		    count = sourcecount1.getInt(source_id.toString());
		    if (type.equalsIgnoreCase("deals"))
			count++;
		    else
            {
                 if(revenue!=null)
			count = count + revenue;
        }
		    sourcecount1.put(source_id.toString(), count);
		    newDealsObject.put(createdtime, sourcecount1);
		}

	    }
	    catch (Exception e)
	    {
		System.out.println("Exception :" + e);
	    }
	}
	return newDealsObject;
    }

    public static List<Opportunity> getNewDealsListWithOwner(Long ownerId, Long minTime, Long maxTime)
    {
	List<Opportunity> newDealsList = new ArrayList<Opportunity>();
	try
	{
	    Query<Opportunity> q = dao.ofy().query(Opportunity.class)
		    .filter("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId))
		    .filter("created_time >= ", minTime).filter("created_time <= ", maxTime).order("-created_time");
	    newDealsList = dao.fetchAll(q);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return newDealsList;

    }

    /*
     * Returns deals based on ownerId or PipelineId or close-date or all at once
     * 
     * 
     * @param ownerId - Owner Id
     * 
     * @param pipelineId - pipeline Id -
     * 
     * @return List
     */
    public static List<Opportunity> getDealsWithOwnerandPipeline(Long ownerId, Long pipelineId, long minTime,
	    long maxTime)
    {
	Map<String, Object> conditionsMap = new HashMap<String, Object>();
	if (ownerId != null)
	    conditionsMap.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));
	if (pipelineId != null)
	    conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, pipelineId));
	conditionsMap.put("close_date >= ", minTime);
	conditionsMap.put("close_date <= ", maxTime);
	conditionsMap.put("archived", false);
	return dao.listByPropertyAndOrder(conditionsMap, "close_date");
    }

    /**
     * Gets JSONObject of deals of loss reason. These are used for pie chart
     * building.
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
	CategoriesUtil categoriesUtil = new CategoriesUtil();

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
	List<Opportunity> opportunitiesList = getLostDealsWithOwnerandPipeline(ownerId, pipelineId, minTime, maxTime);
	List<Opportunity> opportunitiesList_temp = new ArrayList<Opportunity>();
	if (opportunitiesList != null && opportunitiesList.size() > 0)
	{
	    for (Opportunity opportunity : opportunitiesList)
	    {
		boolean flag = true;
		try
		{
		    Long source = opportunity.getDeal_source_id();
		    if (sourceId != null)
		    {
			if (sourceId == 1)
			{
			    if (source == 0L)
				opportunitiesList_temp.add(opportunity);
			    else
			    {
				List<Category> sources = categoriesUtil.getCategoriesByType("DEAL_SOURCE");
				for (Category source_id : sources)
				{
				    if (source.toString().equals(source_id.getId().toString()))
				    {
					flag = false;
					break;
				    }

				}
				if (flag)
				    opportunitiesList_temp.add(opportunity);
			    }

			}
			else if (source.toString().equals(sourceId.toString()))
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
	    if (opportunitiesList_temp != null && opportunitiesList_temp.size() > 0)
	    {
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
	    boolean flag_reason = true;
	    try
	    {
		Long lost_id = opportunity.getLost_reason_id();
		Double value = opportunity.expected_value;
		List<Category> reasons = categoriesUtil.getCategoriesByType("DEAL_LOST_REASON");
		for (Category reason : reasons)
		{
		    if (reason.getId().toString().equals(lost_id.toString()))
			flag_reason = false;
		}
		if (flag_reason)
		    lost_id = 0L;
		// Read from previous object if present
		if (sourcecount.containsKey(lost_id.toString()))
		{
		    JSONObject sourceObject = sourcecount.getJSONObject(lost_id.toString());
		    int count = sourceObject.getInt("count");
		    count++;
		    Double total = sourceObject.getDouble("total");
            if(value!=null)
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
     * Returns deals based on ownerId or PipelineId or sourceId or close-date or
     * all at once
     * 
     * 
     * @param ownerId
     *            - Owner Id
     * @param pipelineId
     *            - pipeline Id -
     * @param sourceId
     * @return List
     */
    public static List<Opportunity> getLostDealsWithOwnerandPipeline(Long ownerId, Long pipelineId, long minTime,
	    long maxTime)
    {
	Map<String, Object> conditionsMap = new HashMap<String, Object>();
	Map<String, Object> conditionsMap1 = new HashMap<String, Object>();
	// List<Opportunity> ownDealsList = new ArrayList<Opportunity>();
	// List<Opportunity> list=null;
	List<Opportunity> list2 = new ArrayList<Opportunity>();
	Set<Opportunity> ownDealsSet = new TreeSet<Opportunity>(new Comparator<Opportunity>()
	{
	    @Override
	    public int compare(Opportunity o1, Opportunity o2)
	    {
		return o1.id.equals(o2.id) ? 0 : -1;
	    }
	});
	List<Milestone> milestoneList;
	Milestone milestone1;
	if (ownerId != null)
	{
	    conditionsMap.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));
	    conditionsMap1.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));
	}

	conditionsMap.put("archived", false);
	conditionsMap1.put("archived", false);
	conditionsMap.put("created_time >= ", minTime);
	conditionsMap.put("created_time <= ", maxTime);
	conditionsMap1.put("milestone_changed_time >= ", minTime);
	conditionsMap1.put("milestone_changed_time <= ", maxTime);
	if (pipelineId != null)
	{
	    milestone1 = MilestoneUtil.getMilestone(pipelineId);
	    if(milestone1!=null){
	    if (milestone1.lost_milestone != null)
	    {
		conditionsMap.put("milestone", milestone1.lost_milestone);
		conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone1.id));
		conditionsMap1.put("milestone", milestone1.lost_milestone);
		conditionsMap1.put("pipeline", new Key<Milestone>(Milestone.class, milestone1.id));
		List<Opportunity> list = dao.listByPropertyAndOrder(conditionsMap, "-created_time");
		List<Opportunity> list2_temp = dao.listByPropertyAndOrder(conditionsMap1, "-milestone_changed_time");
		boolean flag = false;
		list2.addAll(list2_temp);
		for (Opportunity list_it : list)
		{
			if(list2.size()>0){
		    for (Opportunity list_it2 : list2)
		    {
			if (!list_it.id.equals(list_it2.id))
			{
			    flag = true;
			    continue;
			}
			else
			{
			    flag = false;
			    break;
			}
		    }
		    if (flag)
			list2.add(list_it);
		}
			else
				list2.add(list_it);
		}
	    }
	    else
	    {
		conditionsMap.put("milestone", "Lost");
		conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone1.id));
		conditionsMap1.put("milestone", "Lost");
		conditionsMap1.put("pipeline", new Key<Milestone>(Milestone.class, milestone1.id));
		List<Opportunity> list = dao.listByPropertyAndOrder(conditionsMap, "-created_time");
		List<Opportunity> list2_temp = dao.listByPropertyAndOrder(conditionsMap1, "-milestone_changed_time");
		boolean flag = false;
		list2.addAll(list2_temp);
		for (Opportunity list_it : list)
		{
			if(list2.size()>0){
		    for (Opportunity list_it2 : list2)
		    {
			if (!list_it.id.equals(list_it2.id))
			{
			    flag = true;
			    continue;
			}
			else
			{
			    flag = false;
			    break;
			}
		    }
		    if (flag)
			list2.add(list_it);
			}
			else
				list2.add(list_it);
		}
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
		    conditionsMap1.put("milestone", milestone.lost_milestone);
		    conditionsMap1.put("pipeline", new Key<Milestone>(Milestone.class, milestone.id));
		    List<Opportunity> list = dao.listByPropertyAndOrder(conditionsMap, "-created_time");
		    List<Opportunity> list2_temp = dao
			    .listByPropertyAndOrder(conditionsMap1, "-milestone_changed_time");
		    boolean flag = false;
		    list2.addAll(list2_temp);
		    for (Opportunity list_it : list)
		    {
		    	if(list2.size()>0){
			for (Opportunity list_it2 : list2)
			{
			    if (!list_it.id.equals(list_it2.id))
			    {
				flag = true;
				continue;
			    }
			    else
			    {
				flag = false;
				break;
			    }
			}
			if (flag)
			    list2.add(list_it);
		    }
		    	 else
						list2.add(list_it);
		    }
		   
		}
		else
		{
		    conditionsMap.put("milestone", "Lost");
		    conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone.id));
		    conditionsMap1.put("milestone", "Lost");
		    conditionsMap1.put("pipeline", new Key<Milestone>(Milestone.class, milestone.id));

		    List<Opportunity> list = dao.listByPropertyAndOrder(conditionsMap, "-created_time");
		    List<Opportunity> list2_temp = dao
			    .listByPropertyAndOrder(conditionsMap1, "-milestone_changed_time");
		    boolean flag = false;
		    list2.addAll(list2_temp);
		    for (Opportunity list_it : list)
		    {
		    	if(list2.size()>0){
			for (Opportunity list_it2 : list2)
			{
			    if (!list_it.id.equals(list_it2.id))
			    {
				flag = true;
				continue;
			    }
			    else
			    {
				flag = false;
				break;
			    }
			}
			if (flag)
			    list2.add(list_it);
		    }
		    	 else
						list2.add(list_it);
		    }
		}
	    }
	}
	// ownDealsList=new ArrayList<>(ownDealsSet);
	return list2;
    }

    /**
     * Returns JSONObject of won Deals divided by source. These are used for pie
     * chart building.
     * 
     * @param minTime
     *            - Given time less than closed date.
     * @param maxTime
     *            - Given time greater than closed date.
     * @return JsonObject .
     */
    public static JSONObject getWonDealsforpiechart(Long ownerId, long minTime, long maxTime)
    {
	JSONObject dealswoncount = new JSONObject();
	CategoriesUtil categoriesUtil = new CategoriesUtil();

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
	List<Opportunity> opportunitiesList = getWonDealsListWithOwner(minTime, maxTime, ownerId);
	if (opportunitiesList != null && opportunitiesList.size() > 0)
	{

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
	    boolean flag_reason = true;
	    try
	    {

		Long source_id = opportunity.getDeal_source_id();
		Double value = opportunity.expected_value;

		List<Category> sources = categoriesUtil.getCategoriesByType("DEAL_SOURCE");
		for (Category reason : sources)
		{
		    if (reason.getId().toString().equals(source_id.toString()))
			flag_reason = false;
		}
		if (flag_reason)
		    source_id = 0L;

		// Read from previous object if present
		if (dealswoncount.containsKey(source_id.toString()))
		{
		    JSONObject sourceObject = dealswoncount.getJSONObject(source_id.toString());
		    int count = sourceObject.getInt("count");
		    count++;
		    Double total = sourceObject.getDouble("total");
            if(value!=null)
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
     * Returns list of deals based on ownerId or won-date or all at once
     * 
     * 
     * @param ownerId
     *            - Owner Id
     * @return List
     */
    public static List<Opportunity> getWonDealsListWithOwner(long minTime, long maxTime, Long ownerId)
    {
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
		    List<Opportunity> list = dao.listByPropertyAndOrder(conditionsMap, "won_date");
		    if (list != null)
		    {
			ownDealsList.addAll(list);
		    }
		}
		else
		{
		    conditionsMap.put("milestone", "Won");
		    conditionsMap.put("pipeline", new Key<Milestone>(Milestone.class, milestone.id));
		    List<Opportunity> list = dao.listByPropertyAndOrder(conditionsMap, "won_date");
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

    /*
     * Returns list of deals based on ownerId or trackid and mintime, maxtime
     * 
     * @param ownerId - Owner Id
     * 
     * @param trackId - Track Id
     * 
     * @return JSONObject
     */
    @SuppressWarnings("unchecked")
    public static JSONObject getPipelineConversionData(Long ownerId, long minTime, long maxTime, Long Track)
    {

	JSONObject Track_conversion = new JSONObject();
	JSONObject Track_conversion_User = new JSONObject();
	List<DomainUser> domainUsersList = new ArrayList<DomainUser>();
	if (ownerId != null && ownerId == 0)
	    ownerId = null;
	else
	{
	    if (DomainUserUtil.getDomainUser(ownerId) != null)
		domainUsersList.add(DomainUserUtil.getDomainUser(ownerId));
	}
	List<Opportunity> opportunitiesList_main = getConversionDeals(ownerId, minTime, maxTime);
	List<Opportunity> opportunitiesList = new ArrayList<Opportunity>();
	List<Milestone> milestones = new ArrayList<Milestone>();

	try
	{

	    if (Track != null)
	    {
		System.out.println("Inside track check");
		Milestone milestone = MilestoneUtil.getMilestone(Track);
		milestones.add(milestone);
		if (opportunitiesList_main != null && opportunitiesList_main.size() > 0)
		{
		    for (Opportunity opp : opportunitiesList_main)
		    {
			if (opp.getPipeline_id().equals(Track))
			    opportunitiesList.add(opp);
		    }
		    System.out.println("Inside list" + opportunitiesList);
		}
	    }
	    else
	    {
		opportunitiesList = opportunitiesList_main;
		System.out.println("Opportunity list" + opportunitiesList);
		milestones = MilestoneUtil.getMilestonesList();
	    }

	    for (Milestone milestone : milestones)
	    {
		System.out.println("Milestone check");
		JSONObject milestoneValue = new JSONObject();
		Opportunity.MILESTONES = milestone.milestones.split(",");
		for (String milestone_data : Opportunity.MILESTONES)
		{
		    milestoneValue.put(" " + milestone_data.toString(), 0);
		}
		Track_conversion.put(milestone.name, milestoneValue);

	    }

	    if (ownerId == null)
	    {
		System.out.println("Owner check");
		DomainUser dUser = DomainUserUtil.getCurrentDomainUser();
		if (dUser != null)
		    domainUsersList = DomainUserUtil.getUsers(dUser.domain);
	    }
	    for (DomainUser domainuser : domainUsersList)
	    {
		System.out.println("domainuser" + domainuser);
		JSONObject Track_user_pair = new JSONObject();
		Track_user_pair.put(domainuser.name, Track_conversion);
		System.out.println("user pair" + Track_user_pair);
		Track_conversion_User.put(domainuser.id, Track_user_pair);
		System.out.println("Conversion Json" + Track_conversion_User);
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	if (opportunitiesList != null && opportunitiesList.size() != 0)
	{

	    for (Opportunity opp : opportunitiesList)
	    {
		System.out.println("Inside deal List");
		try
		{
		    // int count=0;
		    Long pipeline_id = opp.getPipeline_id();

		    Milestone mile = MilestoneUtil.getMilestone(pipeline_id);

		    System.out.println("mile" + mile);

		    System.out.println("ownerid" + opp.getOwner());
		    if (opp.getOwner() != null)
			if (Track_conversion_User.containsKey(opp.getOwner().id.toString()))
			{
			    JSONObject conversion_user = Track_conversion_User.getJSONObject(opp.getOwner().id
				    .toString());
			    if (conversion_user.containsKey(opp.getOwner().name))
			    {

				JSONObject conversion = conversion_user.getJSONObject(opp.getOwner().name);

				if (mile != null)
				    if (conversion.containsKey(mile.name))
				    {
					JSONObject mileObject = conversion.getJSONObject(mile.name);
					System.out.println("Mileobject" + mileObject);
					if (mileObject.containsKey(" " + opp.milestone))
					{
					    Iterator keys = mileObject.keys();
					    while (keys.hasNext())
					    {
						String key = (String) keys.next();
						int count = mileObject.getInt(key);
						count++;
						mileObject.put(key, count);

						if (key.equalsIgnoreCase(" " + opp.milestone))
						    break;
					    }

					    conversion.put(mile.name, mileObject);
					}
					conversion_user.put(opp.getOwner().name, conversion);

				    }
				Track_conversion_User.put(opp.getOwner().id, conversion_user);
			    }
			}
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    return null;
		}
	    }
	}
	System.out.println("Tracks" + Track_conversion);
	return Track_conversion_User;
    }

    /*
     * 
     * Return List of Opportunities for pipeline conversion
     */
    public static List<Opportunity> getConversionDeals(Long ownerId, long minTime, long maxTime)
    {

	Map<String, Object> conditionsMap1 = new HashMap<String, Object>();
	Map<String, Object> conditionsMap2 = new HashMap<String, Object>();

	System.out.println("insdie conversion");
	if (ownerId != null)
	{
	    conditionsMap1.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));
	    conditionsMap2.put("ownerKey", new Key<DomainUser>(DomainUser.class, ownerId));
	}
	// conditionsMap2.put("archived", false);
	conditionsMap2.put("created_time >= ", minTime);
	conditionsMap2.put("created_time <= ", maxTime);
	conditionsMap1.put("milestone_changed_time >= ", minTime);
	conditionsMap1.put("milestone_changed_time <= ", maxTime);
	// conditionsMap1.put("archived", false);
	try
	{

	    List<Opportunity> list = dao.listByPropertyAndOrder(conditionsMap1, "-milestone_changed_time");
	    System.out.println("list1--" + list);
	    List<Opportunity> list2 = dao.listByPropertyAndOrder(conditionsMap2, "-created_time");
	    System.out.println("list2--" + list2);
	    List<Opportunity> list_main = new ArrayList<Opportunity>();
	    List<Opportunity> list2_main = new ArrayList<Opportunity>();
	    for (Opportunity it1 : list)
	    {
		if (it1.archived == false)
		    list_main.add(it1);
	    }
	    for (Opportunity it2 : list2)
	    {
		if (it2.archived == false)
		    list2_main.add(it2);
	    }

	    boolean flag = false;
	    for (Opportunity list_it : list_main)
	    {
		if (list2_main.size() != 0)
		{
		    for (Opportunity list_it2 : list2_main)
		    {
			if (!list_it.id.equals(list_it2.id))
			{
			    flag = true;
			    continue;
			}
			else
			{
			    flag = false;
			    break;
			}
		    }
		    if (flag)
			list2_main.add(list_it);
		}
		else
		    list2_main.add(list_it);
	    }

	    // conversionList=new ArrayList<>(ownDealsSet);
	    System.out.println("list2" + list2_main);
	    // System.out.println("main list"+conversionList);

	    return list2_main;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
    
    @SuppressWarnings("null")
	public static String updateDeal(Long contactId, String milestone, String expectedValue)
    {   
    	if(expectedValue==null && milestone==null)
    		if (contactId == 0 && milestone.length()==0 && expectedValue.length()==0 )
    			return null; 
    	
    	double expectedValueD=0;
    	if(expectedValue.length()!=0 && expectedValue!=null)    		
    		expectedValueD= Double.parseDouble(expectedValue);	
    	
    	Map<String, Object> conditionsMap = new HashMap<String, Object>();
    	conditionsMap.put("archived", false);

    	Long pipeline=null;
    	String milestoneStr=null;
    	
    	if(milestone.length()!=0 && milestone!=null){ 
    		Map<String, String> fromMilestoneDetails = AgileTaskletUtil.getTrackDetails(milestone);
    		milestoneStr=fromMilestoneDetails.get("milestone").trim();
    		pipeline=Long.parseLong(fromMilestoneDetails.get("pipelineID"));
    	}
    	
    	if (contactId != null)
    		conditionsMap.put("related_contacts", new Key<Contact>(Contact.class, contactId));
    	
	   	List<Opportunity> listOpportunityObj= dao.fetchAllByOrder(1,null,conditionsMap,true,false,"-created_time");
    	
	   	if(listOpportunityObj.isEmpty())
	   		return null;
	   	
	   	Opportunity opportunityObj = listOpportunityObj.get(0);
    		
	   	if(milestoneStr!=null){
	   		opportunityObj.milestone=milestoneStr;
	   		opportunityObj.pipeline_id=pipeline;
    	}
	   	
	   	if(expectedValue.length()!=0 && expectedValue!=null)   
    		opportunityObj.expected_value=expectedValueD;
	   	
	   	System.out.println("updateDeal------------Checking ACLs for creating deal");
	   	UserAccessControlUtil.check(Opportunity.class.getSimpleName(), opportunityObj, CRUDOperation.CREATE, true);
	   	
    	opportunityObj.save();

    	return opportunityObj.name;
    }
	
    /**
     * Gets a partial opportunity based on its id
     * 
     * @param id
     * @return
     */
    public static List<OpportunityPartial> getPartialOpportunities(List<Key<Opportunity>> ids_list)
    {
    	List<OpportunityPartial> list = new ArrayList<OpportunityPartial>();
    	if(ids_list == null || ids_list.size() == 0)
   		 return list;
		
		try
		{
			List<com.google.appengine.api.datastore.Key> keys = dao.convertKeysToNativeKeys(ids_list);
			if(keys.size() == 0)
				return list;
			
			Map map = new HashMap();
			map.put("__key__ IN", keys);
			
			return partialDAO.listByProperty(map);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		    e.printStackTrace();
		    return list;
		}
    }
    
    /**
     * Get opportunities count based on the filter in the given filter JSON object.
     * 
     * @param filterJson
     *            JSON object containing the fields.
     * @param count
     *            number of deals per page.
     * @param cursor
     *            cursor for the deals.
     * @return deals list.
     */
    public static int getOpportunitiesCountByFilter(org.json.JSONObject filterJson, int count, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
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

	    return dao.getCountByPropertyWithLimit(searchMap, 1001);
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}
	return 0;
    }
    
    /**
     * Returns count of opportunities. This method is called if TEXT_PLAIN is
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
    public static int getOpportunitiesCountByFilter(String ownerId, String milestone, String contactId,
	    String fieldName, int max, String cursor, Long pipelineId)
    {
	if (pipelineId == null || pipelineId == 0L)
	    pipelineId = MilestoneUtil.getMilestones().id;

	return getOpportunitiesCountByFilterWithoutDefaultPipeLine(ownerId, milestone, contactId, fieldName, max, cursor,
		pipelineId);

    }
    
    public static int getOpportunitiesCountByFilterWithoutDefaultPipeLine(String ownerId, String milestone,
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

    	    return dao.getCountByPropertyWithLimit(searchMap, 1001);

    	}
    	catch (Exception e)
    	{
    	    e.printStackTrace();
    	    System.out.println(e.getMessage());
    	    return 0;
    	}

        }
    
    public static Milestone getOpportunityPipeline(Opportunity opportunity) throws Exception
    {
    
    Long id = opportunity.getPipeline_id();
	if (id!= null && id != 0L)
	{
	    try
	    {
		// Gets Domain User Object
		return MilestoneUtil.getMilestone(id);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }
    /*
     * Author @sankar
     * date 1/apr/16
     * */
    public static List<Opportunity> getOpportunitiesByNote(Long noteId)
    {
    	Query<Opportunity> q = dao.ofy().query(Opportunity.class).filter("related_notes", new Key<Note>(Note.class,noteId) );
    	return dao.fetchAll(q);
    }
}
