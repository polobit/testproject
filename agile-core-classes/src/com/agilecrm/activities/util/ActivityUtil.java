package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Call;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.search.query.util.QueryDocumentUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.gson.Gson;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>ActivityUtil</code> is a utility class to process the data of activity
 * class, it processes when fetching the data and saving the activity to
 * activity database.
 * <p>
 * This utility class includes methods needs to return activities based on user,
 * entity_id, entity_type and activity_type.
 * </p>
 * 
 * @author 
 * 
 */
public class ActivityUtil
{
    // Dao
    private static ObjectifyGenericDao<Activity> dao = new ObjectifyGenericDao<Activity>(Activity.class);

    /**
     * To save save the contact activity.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param contact
     *            the contact object on which the activity is performed.
     * @param data
     *            extra information about the activity like Tag name when a tag
     *            is added. null if nothing.
     */
    public static Activity createContactActivity(ActivityType activity_type, Contact contact, String new_data,
	    String old_data, String changed_field)
    {
	String contact_name = "";
	Activity activity = new Activity();
	if (contact != null)
	{

	    ContactField firstname = contact.getContactFieldByName("first_name");
	    ContactField lastname = contact.getContactFieldByName("last_name");
	    if (firstname != null)
	    {
		contact_name += firstname.value;
	    }
	    if (lastname != null)
	    {
		contact_name += " ";
		contact_name += lastname.value;
	    }

	    activity.label = contact_name;
	    activity.label = activity.label.trim();
	    contact_name = "";
	    activity.entity_id = contact.id;
	}
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.CONTACT;

	if (StringUtils.isNotEmpty(new_data))
	    activity.custom1 = new_data;
	if (StringUtils.isNotEmpty(old_data))
	    activity.custom2 = old_data;
	if (StringUtils.isNotEmpty(changed_field))
	    activity.custom3 = changed_field;

	activity.save();
	return activity;
    }

    /**
     * To save the task activity.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param task
     *            the task object on which the activity is performed.
     * @param data
     *            the extra information of the activity like the progress when
     *            ever user changed the progress. null if nothing.
     */
    public static Activity createTaskActivity(ActivityType activity_type, Task task, String new_data, String old_data,
	    String changed_field, JSONArray jsn)
    {
	Activity activity = new Activity();
	activity.label = task.subject;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.TASK;
	activity.entity_id = task.id;

	// If user changed the progress, save it.
	/*
	 * if (activity_type == ActivityType.PROGRESS) activity.custom1 =
	 * String.valueOf(task.is_complete);
	 */

	if (StringUtils.isNotEmpty(new_data))
	    activity.custom1 = new_data;
	if (StringUtils.isNotEmpty(old_data))
	    activity.custom2 = old_data;
	if (StringUtils.isNotEmpty(changed_field))
	    activity.custom3 = changed_field;

	try
	{
	    if (jsn != null && jsn.length() > 0)
	    {
		List<String> contactids = ActivitySave.getContactids(jsn);
		List<String> contactnames = ActivitySave.getContactNames(jsn);

		JSONObject obj = new JSONObject();
		JSONArray arr = new JSONArray();
		if (contactids != null && contactnames != null && contactids.size() == contactnames.size())
		{
		    for (int i = 0; i < contactids.size(); i++)
		    {

			obj.put("contactid", contactids.get(i));
			obj.put("contactname", contactnames.get(i));

			arr.put(obj);

			obj = new JSONObject();
		    }
		    System.out.println(arr.toString());
		    activity.related_contact_ids = arr.toString();
		}
	    }
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	activity.save();
	return activity;
    }

    /**
     * To save the event activity.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param event
     *            the event object on which the activity is performed.
     * @param data
     *            the extra information about the activity performed on the
     *            event. null if nothing.
     */
    public static Activity createEventActivity(ActivityType activity_type, Event event, String new_data,
	    String old_data, String changed_field, JSONArray jsn)
    {
	Activity activity = new Activity();
	activity.label = event.title;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.EVENT;
	activity.entity_id = event.id;

	if (StringUtils.isNotEmpty(new_data))
	    activity.custom1 = new_data;
	if (StringUtils.isNotEmpty(old_data))
	    activity.custom2 = old_data;
	if (StringUtils.isNotEmpty(changed_field))
	    activity.custom3 = changed_field;

	try
	{
	    if (jsn != null && jsn.length() > 0)
	    {
		List<String> contactids = ActivitySave.getContactids(jsn);
		List<String> contactnames = ActivitySave.getContactNames(jsn);

		JSONObject obj = new JSONObject();
		JSONArray arr = new JSONArray();
		if (contactids != null && contactnames != null && contactids.size() == contactnames.size())
		{
		    for (int i = 0; i < contactids.size(); i++)
		    {

			obj.put("contactid", contactids.get(i));
			obj.put("contactname", contactnames.get(i));

			arr.put(obj);

			obj = new JSONObject();
		    }
		    System.out.println(arr.toString());
		    activity.related_contact_ids = arr.toString();
		}

	    }
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	activity.save();
	return activity;
    }

    /**
     * To save the deal activity.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param deal
     *            the deal object on which the activity is performed.
     * @param data
     *            the extra information about the activity like the new
     *            milestone name when the user change the milestone. null if
     *            nothing.
     */
    public static Activity createDealActivity(ActivityType activity_type, Opportunity deal, String new_data,
	    String old_data, String changed_field, JSONArray jsn)
    {
	Activity activity = new Activity();
	activity.label = deal.name;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.DEAL;
	activity.entity_id = deal.id;

	/*
	 * // save the new milestone, if user changed the milestone. if
	 * (activity_type == ActivityType.MILESTONE) activity.custom1 =
	 * deal.milestone;
	 */

	if (StringUtils.isNotEmpty(new_data))
	    activity.custom1 = new_data;
	if (StringUtils.isNotEmpty(old_data))
	    activity.custom2 = old_data;
	if (StringUtils.isNotEmpty(changed_field))
	    activity.custom3 = changed_field;

	activity.custom4 = deal.owner_id;
	try
	{
	    if (jsn != null && jsn.length() > 0)
	    {
		List<String> contactids = ActivitySave.getContactids(jsn);
		List<String> contactnames = ActivitySave.getContactNames(jsn);

		JSONObject obj = new JSONObject();
		JSONArray arr = new JSONArray();
		if (contactids != null && contactnames != null && contactids.size() == contactnames.size())
		{
		    for (int i = 0; i < contactids.size(); i++)
		    {

			obj.put("contactid", contactids.get(i));
			obj.put("contactname", contactnames.get(i));

			arr.put(obj);

			obj = new JSONObject();
		    }
		    System.out.println(arr.toString());
		    activity.related_contact_ids = arr.toString();
		}
	    }
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	activity.save();
	return activity;
    }

    /**
     * To save the document activity.
     * 
     * @param activity_type
     *            the type of the activity performed on the document (ADD, EDIT
     *            etc..)
     * @param document
     *            the document object on which the activity is performed.
     * @param data
     *            the extra information about the activity like the new
     * 
     */
    public static Activity createDocumentActivity(ActivityType activity_type, Document document, String new_data,
	    String old_data, String changed_field, JSONArray jsn)
    {
	Activity activity = new Activity();
	activity.label = document.name;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.DOCUMENT;
	activity.entity_id = document.id;

	if (StringUtils.isNotEmpty(new_data))
	    activity.custom1 = new_data;
	if (StringUtils.isNotEmpty(old_data))
	    activity.custom2 = old_data;
	if (StringUtils.isNotEmpty(changed_field))
	    activity.custom3 = changed_field;
	try
	{
	    if (jsn != null && jsn.length() > 0)
	    {
		List<String> contactids = ActivitySave.getContactids(jsn);
		List<String> contactnames = ActivitySave.getContactNames(jsn);

		JSONObject obj = new JSONObject();
		JSONArray arr = new JSONArray();

		if (contactids != null && contactnames != null && contactids.size() == contactnames.size())
		{
		    for (int i = 0; i < contactids.size(); i++)
		    {

			obj.put("contactid", contactids.get(i));
			obj.put("contactname", contactnames.get(i));
			System.out.println("ContactIds  " + contactids.get(i) + "contact names   "
			        + contactnames.get(i));
			arr.put(obj);

			obj = new JSONObject();
		    }
		    activity.related_contact_ids = arr.toString();
		}
	    }
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	activity.save();
	return activity;
    }

    /**
     * To save campaign activity. This will include the email clicks also.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param workflow
     *            the campaign object on which the activity is performed.
     * @param data
     *            the extra information of the activity like the email subject
     *            when ever the email sent out. null if nothing.
     */
    public static Activity createCampaignActivity(ActivityType activity_type, Workflow workflow, String data)
    {
	Activity activity = new Activity();
	activity.label = workflow.name;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.CAMPAIGN;
	activity.entity_id = workflow.id;

	if (StringUtils.isNotEmpty(data))
	    activity.custom1 = data;

	activity.save();
	return activity;
    }

    public static Activity createBulkDeleteActivity(EntityType entitytype, String new_data, String old_data,
	    String changed_field)
    {
	Activity activity = new Activity();
	activity.label = "bulk delete";
	activity.activity_type = ActivityType.BULK_DELETE;
	activity.entity_type = entitytype;

	if (StringUtils.isNotEmpty(new_data))
	    activity.custom1 = new_data;
	if (StringUtils.isNotEmpty(old_data))
	    activity.custom2 = old_data;
	if (StringUtils.isNotEmpty(changed_field))
	    activity.custom3 = changed_field;

	activity.save();
	return activity;
    }

    
    /**
     * creates bulk action activity when performed on Contact bulk actions
     * @param new_data is changed data
     * @param old_data  is old data
     * @param changed_field is changed field
     * @param label   
     * @param bulk_email_subject
     * @param entityType   is to decide which action was perfomed i.e deal, contact or etc
     * @return
     */
    public static Activity createBulkActionActivity(String new_data, String old_data, String changed_field,
	    String label, String bulk_email_subject, EntityType entityType)
    {
	Activity activity = new Activity();
	activity.label = label;
	activity.activity_type = ActivityType.BULK_ACTION;
	activity.entity_type = entityType;

	if (StringUtils.isNotEmpty(new_data))
	    activity.custom1 = new_data;
	if (StringUtils.isNotEmpty(old_data))
	    activity.custom2 = old_data;
	if (StringUtils.isNotEmpty(changed_field))
	    activity.custom3 = changed_field;
	if (StringUtils.isNotEmpty(changed_field))
	    activity.custom4 = bulk_email_subject;

	activity.save();
	return activity;
    }

    /**
     * Fetches all the activities with out any filtering
     * 
     * @param max
     *            maximum number of the activities to retrieve.
     * @param cursor
     *            for paging.
     * @return all the activities.
     */
    public static List<Activity> getActivities(int max, String cursor)
    {
	try
	{
	    return dao.fetchAllByOrderWithoutCount(max, cursor, null, true, false, "-time");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get all the activities of the currently logged in user.
     * 
     * @param max
     *            maximum number of the activities to retrieve.
     * @param cursor
     *            for paging.
     * @return the list of the activities.
     */
    public static List<Activity> getActivitiesOfCurrentUser(Integer max, String cursor)
    {
	try
	{

	    System.out.println("user " + new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()));
	    Query<Activity> query = dao.ofy().query(Activity.class);
	    query.filter("user =", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId())).order(
		    "time");
	    if (max != null && max > 0)
		dao.fetchAll(max, cursor);

	    return query.list();
	}
	catch (Exception e)
	{
	    System.out.println("error in fetching activities of current domain user " + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * fetches an activity by its id
     * 
     * @param id
     * @return
     */
    public static Activity getActivity(Long id)
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
     * Fetch list of activities based on the given filters sorted on the time of
     * activity.
     * 
     * @param user_id
     *            the id of the user who performed the activity.
     * @param entity_type
     *            the type of the entity.
     * @param activity_type
     *            activity type.
     * @param entity_id
     *            the id of the entity on which the activity is performed.
     * @param max
     *            maximum number of the activities to retrieve.
     * @param cursor
     *            starting cursor for paging.
     * @return the list of activities based on the given filter.
     */
    public static List<Activity> getActivitiesByFilter(Long user_id, String entity_type, String activity_type,
	    Long entity_id, Integer max, String cursor)
    {
	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    Query<Activity> query = dao.ofy().query(Activity.class);
	    if (!StringUtils.isEmpty(entity_type))
		searchMap.put("entity_type", entity_type);
	    if (!StringUtils.isEmpty(activity_type))
		searchMap.put("activity_type", activity_type);
	    if (user_id != null)
		searchMap.put("user", new Key<DomainUser>(DomainUser.class, user_id));

	    if (entity_id != null)
		searchMap.put("entity_id", entity_id);

	    query.filter("user", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId())).order(
		    "time");
	    if (max != null && max > 0)
		dao.fetchAllByOrder(max, cursor, searchMap, true, false, "time");

	    return dao.listByProperty(searchMap);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * fetches the activities based on 
     * @param entitytype  TASK,EVENT,DEAL,CONTACT,DOCUMENT
     * @param userid action performed by
     * @param max  max records to fetch
     * @param cursor 
     * @return  list of activities
     */
    public static List<Activity> getActivitites(String entitytype, Long userid, int max, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	if (!entitytype.equalsIgnoreCase("ALL") && !entitytype.equalsIgnoreCase("CALL"))
	    searchMap.put("entity_type", entitytype);
	if (entitytype.equalsIgnoreCase("CALL"))
	    searchMap.put("activity_type", entitytype);
	if (userid != null)
	    searchMap.put("user", new Key<DomainUser>(DomainUser.class, userid));

	if (max != 0)
	    return dao.fetchAllByOrder(max, cursor, searchMap, true, false, "-time");

	return dao.listByProperty(searchMap);
    }

    public static List<Activity> getActivitites(Long entityId, int max, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("entity_id", entityId);

	if (max != 0)
	    return dao.fetchAllByOrder(max, cursor, searchMap, true, false, "-time");

	return dao.listByProperty(searchMap);
    }

    /**
     * 
     * @param obj
     *            used to construct map object with the fileds changed in the
     *            deal
     * @mapvalue[0] stores new values given for updation
     * @mapvalue[1] stores the previous value stored in db
     * @mapvalue[2] stores the field name which was modified
     * @return
     * @throws JSONException
     */

    public static Map<String, Object[]> dealChangedFields(Opportunity obj) throws JSONException
    {
	Opportunity oldobj = OpportunityUtil.getOpportunity(obj.id);
	// getJsonCompares(obj, oldobj);

	Map<String, Object[]> dealmap = new HashMap<String, Object[]>();

	try
	{

	    if (obj.close_date != null)
		if (!obj.close_date.equals(oldobj.close_date))
		{
		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.close_date;
		    mapvalue[1] = oldobj.close_date;
		    mapvalue[2] = "close_date";
		    dealmap.put("close_date", mapvalue);
		}
	    if (obj.name != null)
		if (!obj.name.equalsIgnoreCase(oldobj.name))
		{
		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.name;
		    mapvalue[1] = oldobj.name;
		    mapvalue[2] = "name";
		    dealmap.put("name", mapvalue);
		}

	    if (obj.owner_id != null)
		if (!oldobj.getOwner().id.toString().equalsIgnoreCase(obj.owner_id))
		{

		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = DomainUserUtil.getDomainUser(Long.parseLong(obj.owner_id)).name;
		    mapvalue[1] = DomainUserUtil.getDomainUser(oldobj.getOwner().id).name;
		    mapvalue[2] = "owner_name";
		    dealmap.put("owner_name", mapvalue);

		}

	    if (compareDoubleValues(oldobj.expected_value, obj.expected_value) != 0)
	    {
		Object[] mapvalue = new Object[3];
		mapvalue[0] = obj.expected_value;
		mapvalue[1] = oldobj.expected_value;
		mapvalue[2] = "expected_value";
		dealmap.put("expected_value", mapvalue);
	    }

	    if (compareDoubleValues(oldobj.probability, obj.probability) != 0)
	    {
		Object[] mapvalue = new Object[3];
		mapvalue[0] = obj.probability;
		mapvalue[1] = oldobj.probability;
		mapvalue[2] = "probability";
		dealmap.put("probability", mapvalue);
	    }

	    // @@ in case of mile stone mapvalue[3] will store name of the deal
	    // andmapvalue[4] willstore deal owner name
	    // it is useful in case of determining deal won or lost

	    if (obj.milestone != null)
		if (!oldobj.milestone.equalsIgnoreCase(obj.milestone))
		{
		    Object[] mapvalue = new Object[5];
		    mapvalue[0] = obj.milestone;
		    mapvalue[1] = oldobj.milestone;
		    mapvalue[2] = "milestone";
		    dealmap.put("milestone", mapvalue);
		}
	    JSONObject js = new JSONObject(new Gson().toJson(obj));
	    JSONArray jsn = js.getJSONArray("contact_ids");
	    jsn = ActivitySave.getExistingContactsJsonArray(jsn);
	    List<Contact> contacts = oldobj.getContacts();

	    if (obj.archived != oldobj.archived)
	    {
		if (obj.archived)
		    ActivityUtil.createDealActivity(ActivityType.DEAL_ARCHIVE, obj, null, null, null, jsn);
		else
		    ActivityUtil.createDealActivity(ActivityType.DEAL_RESTORE, obj, null, null, null, jsn);
	    }

	    if (jsn != null && (jsn.length() != contacts.size()))
		getDealRelatedContacts(contacts, jsn, obj);

	}
	catch (Exception e)
	{
	    System.out.println("in catech block in Activity Util " + e.getMessage());
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return dealmap;
    }

    /**
     * stores log for related contact changes  
     * @param contacts  old contacts from db
     * @param jsn  new contacts from user interface
     * @param opportunity entity
     * @throws JSONException
     */
    public static void getDealRelatedContacts(List<Contact> contacts, JSONArray jsn, Opportunity opportunity)
	    throws JSONException
    {

    	//fetches the contact ids from contacts to identify which contacts were removed and which are added
	List<String> old_cont_ids = getContactIds(contacts);

	if (jsn == null)
	{
	    JSONArray removed_relatedconatcts = ActivitySave.getJsonArrayOfIdFromList(old_cont_ids);
	    ActivityUtil.createDealActivity(ActivityType.DEAL_RELATED_CONTACTS, opportunity, null, null,
		    "removed_all_relatedcontacts", removed_relatedconatcts);
	}
	else if (contacts.size() > jsn.length())
	{
	    JSONArray removed_jsonconatcts = ActivitySave.removedContacts(old_cont_ids, jsn);
	    ActivityUtil.createDealActivity(ActivityType.DEAL_RELATED_CONTACTS, opportunity, null, null,
		    "removed_relatedcontacts", removed_jsonconatcts);
	}

	else if (jsn.length() > old_cont_ids.size())
	{

	    JSONArray added_jsonconatcts = ActivitySave.addedContacts(old_cont_ids, jsn);
	    ActivityUtil.createDealActivity(ActivityType.DEAL_RELATED_CONTACTS, opportunity, null, null,
		    "added_relatedcontacts", added_jsonconatcts);

	}
    }

    /**
     * stores log for related_to filed change for events
     * 
     * @param contacts old contacts
     * @param jsn   new contact ids from user interface
     * @param event 
     * @throws JSONException
     */
    public static void getEventRelatedContacts(List<Contact> contacts, JSONArray jsn, Event event) throws JSONException
    {

	List<String> old_cont_ids = getContactIds(contacts);

	if (jsn == null)
	{
	    JSONArray removed_relatedconatcts = ActivitySave.getJsonArrayOfIdFromList(old_cont_ids);
	    ActivityUtil.createEventActivity(ActivityType.EVENT_RELATED_CONTACTS, event, null, null,
		    "removed_all_relatedcontacts", removed_relatedconatcts);
	}
	else if (contacts.size() > jsn.length())
	{
	    JSONArray removed_jsonconatcts = ActivitySave.removedContacts(old_cont_ids, jsn);
	    ActivityUtil.createEventActivity(ActivityType.EVENT_RELATED_CONTACTS, event, null, null,
		    "removed_relatedcontacts", removed_jsonconatcts);
	}

	else if (jsn.length() > old_cont_ids.size())
	{

	    JSONArray added_jsonconatcts = ActivitySave.addedContacts(old_cont_ids, jsn);
	    ActivityUtil.createEventActivity(ActivityType.EVENT_RELATED_CONTACTS, event, null, null,
		    "added_relatedcontacts", added_jsonconatcts);

	}
    }

    /**
     * stores log for related_to filed change
     * 
     * @param contacts old contacts
     * @param jsn  new contacts
     * @param task 
     * @throws JSONException
     */
    public static void getTaskRelatedContacts(List<Contact> contacts, JSONArray jsn, Task task) throws JSONException
    {

	List<String> old_cont_ids = getContactIds(contacts);

	if (jsn == null)
	{
	    JSONArray removed_relatedconatcts = ActivitySave.getJsonArrayOfIdFromList(old_cont_ids);
	    ActivityUtil.createTaskActivity(ActivityType.TASK_RELATED_CONTACTS, task, null, null,
		    "removed_all_relatedcontacts", removed_relatedconatcts);
	}
	else if (contacts.size() > jsn.length())
	{
	    JSONArray removed_jsonconatcts = ActivitySave.removedContacts(old_cont_ids, jsn);
	    ActivityUtil.createTaskActivity(ActivityType.TASK_RELATED_CONTACTS, task, null, null,
		    "removed_relatedcontacts", removed_jsonconatcts);
	}

	else if (jsn.length() > old_cont_ids.size())
	{

	    JSONArray added_jsonconatcts = ActivitySave.addedContacts(old_cont_ids, jsn);
	    ActivityUtil.createTaskActivity(ActivityType.TASK_RELATED_CONTACTS, task, null, null,
		    "added_relatedcontacts", added_jsonconatcts);

	}
    }

    /**
     * common method to compare double value
     * 
     * @param d1
     *            old value
     * @param d2
     *            new value given in updation request
     * @return returns the value 0 if d1 is numerically equal to d2 return value
     *         less than 0 if d1 is numerically less than d2 return value
     *         greater than 0 if d1 is numerically greater than d2.
     */
    public static int compareDoubleValues(double d1, double d2)
    {

	int result = Double.compare(d1, d2);
	return result;

    }

    

    /**
     * 
     * @param obj
     *            method used to construct map object with the fileds changed in
     *            the event
     * @mapvalue[0] stores new values given for updation
     * @mapvalue[1] stores the previous value stored in db
     * @return
     */
    public static Map<String, Object[]> eventchangedfields(Event obj)
    {

	Event oldobj = EventUtil.getEvent(obj.id);
	Map<String, Object[]> eventmap = new HashMap<String, Object[]>();

	try
	{
	    if (obj.start != null)
		if (!obj.start.equals(oldobj.start))
		{
		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.start;
		    mapvalue[1] = oldobj.start;
		    mapvalue[2] = "start_date";
		    eventmap.put("start_date", mapvalue);

		}
	    if (obj.end != null)
		if (!obj.end.equals(oldobj.end))
		{

		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.end;
		    mapvalue[1] = oldobj.end;
		    mapvalue[2] = "end_date";
		    eventmap.put("end_date", mapvalue);

		}

	    if (oldobj.title != null && obj.title != null)
		if (!oldobj.title.equalsIgnoreCase(obj.title))
		{

		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.title;
		    mapvalue[1] = oldobj.title;
		    mapvalue[2] = "title";
		    eventmap.put("title", mapvalue);

		}
	    if (oldobj.color != null && obj.color != null)
		if (!oldobj.color.equalsIgnoreCase(obj.color))
		{

		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.color;
		    mapvalue[1] = oldobj.color;
		    mapvalue[2] = "priority";
		    eventmap.put("priority", mapvalue);

		}

	    JSONObject js = new JSONObject(new Gson().toJson(obj));
	    JSONArray jsn = js.getJSONArray("contacts");

	    jsn = ActivitySave.getExistingContactsJsonArray(jsn);
	    List<Contact> contacts = oldobj.getContacts();
	    List<String> old_cont_ids = getContactIds(contacts);
	    if (jsn != null && (jsn.length() != contacts.size()))
		getEventRelatedContacts(contacts, jsn, obj);
	}
	catch (Exception e)
	{
	    System.out.println("in catech block in Activity Util " + e.getMessage());
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return eventmap;

    }

    /**
     * 
     * @param obj
     *            method used to construct map object with the fileds changed in
     *            the task object when it is updated
     * @return @mapvalue[0] stores new values given for updation
     * @mapvalue[1] stores the previous value stored in db
     */
    public static Map<String, Object[]> taskChangedFields(Task obj)
    {

	Task oldobj = TaskUtil.getTask(obj.id);
	Map<String, Object[]> taskmap = new HashMap<String, Object[]>();

	try
	{

	    if (!oldobj.due.equals(obj.due))
	    {
		Object[] mapvalue = new Object[3];
		mapvalue[0] = obj.due;
		mapvalue[1] = oldobj.due;
		mapvalue[2] = "due_date";
		taskmap.put("due", mapvalue);

	    }

	    if (oldobj.status != null && obj.status != null)
		if (!oldobj.status.toString().equalsIgnoreCase(obj.status.toString()))
		{
		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.status;
		    mapvalue[1] = oldobj.status;
		    mapvalue[2] = "status";
		    taskmap.put("status", mapvalue);
		}

	    if (oldobj.priority_type != null && obj.priority_type != null)
		if (!oldobj.priority_type.toString().equalsIgnoreCase(obj.priority_type.toString()))
		{
		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.priority_type;
		    mapvalue[1] = oldobj.priority_type;
		    mapvalue[2] = "priority_type";
		    taskmap.put("priority", mapvalue);
		}

	    if (oldobj.progress != obj.progress)
	    {
		Object[] mapvalue = new Object[3];
		mapvalue[0] = obj.progress;
		mapvalue[1] = oldobj.progress;
		mapvalue[2] = "progress";
		taskmap.put("progress", mapvalue);
	    }
	    if (oldobj.subject != null && obj.subject != null)
		if (!oldobj.subject.equalsIgnoreCase(obj.subject))
		{
		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.subject;
		    mapvalue[1] = oldobj.subject;
		    mapvalue[2] = "subject";
		    taskmap.put("subject", mapvalue);

		}

	    if (oldobj.type != null && obj.type != null)
		if (!oldobj.type.toString().equalsIgnoreCase(obj.type.toString()))
		{
		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = obj.type;
		    mapvalue[1] = oldobj.type;
		    mapvalue[2] = "task_type";
		    taskmap.put("task_type", mapvalue);

		}

	    if (obj.owner_id != null)
		if (!oldobj.getTaskOwner().id.toString().equalsIgnoreCase(obj.owner_id))
		{

		    Object[] mapvalue = new Object[3];
		    mapvalue[0] = DomainUserUtil.getDomainUser(Long.parseLong(obj.owner_id)).name;
		    mapvalue[1] = DomainUserUtil.getDomainUser(oldobj.getTaskOwner().id).name;
		    mapvalue[2] = "Task_owner";
		    taskmap.put("Task_owner", mapvalue);

		}
	    JSONObject js = new JSONObject(new Gson().toJson(obj));
	    JSONArray jsn = js.getJSONArray("contacts");
	    jsn = ActivitySave.getExistingContactsJsonArray(jsn);

	    List<Contact> contacts = oldobj.getContacts();
	    List<String> old_cont_ids = getContactIds(contacts);
	    if (jsn != null && (jsn.length() != contacts.size()))
		getTaskRelatedContacts(contacts, jsn, obj);
	}
	catch (Exception e)
	{
	    System.out.println("in catech block in Activity Util " + e.getMessage());
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return taskmap;

    }

    /**
     * method used to get the removed contacts ids when updating deal or task or
     * event
     * 
     * @param oldcont
     *            list of old contacts
     * @param ar
     *            new contacts given in updation
     * @return
     * @throws JSONException
     */
    public static List<Object> removedContacts(List oldcont, JSONArray ar) throws JSONException
    {
	for (int i = 0; i <= ar.length() - 1; i++)
	{
	    if (oldcont.contains(ar.get(i)))
	    {
		oldcont.remove(ar.get(i));

	    }

	}
	return oldcont;

    }

    /**
     * methood fetches the newly added and removed contacts in
     * contacts_related_to field in task ,event,deal updations
     * 
     * @param jsncontacts
     * @param oldcont_ids
     * @return
     * @throws JSONException
     */
    public static Object[] getChangedContactNames(JSONArray jsncontacts, List<String> oldcont_ids) throws JSONException
    {

	List<Object> added_cont = new ArrayList<>();
	List<Object> new_contacts = new ArrayList<>();
	List<Object> removed_cont = new ArrayList<>();

	Object[] related_to = new Object[3];

	if (jsncontacts.length() >= oldcont_ids.size())
	{
	    for (int i = 0; i <= jsncontacts.length() - 1; i++)
	    {
		if (!oldcont_ids.contains(jsncontacts.get(i)))
		    new_contacts.add(jsncontacts.get(i));

	    }
	    removed_cont = removedContacts(oldcont_ids, jsncontacts);
	    related_to[0] = getContactNamesFromIds(new_contacts);
	    related_to[1] = getContactNamesFromIds(removed_cont);
	    related_to[2] = "new_contacts_added";
	}

	else
	{

	    for (int i = 0; i <= jsncontacts.length() - 1; i++)
	    {
		if (!oldcont_ids.contains(jsncontacts.get(i)))
		    added_cont.add(jsncontacts.get(i));

	    }
	    removed_cont = removedContacts(oldcont_ids, jsncontacts);
	    related_to[0] = getContactNamesFromIds(added_cont);
	    related_to[1] = getContactNamesFromIds(removed_cont);
	    related_to[2] = "contacts_changed";

	}

	System.out.println(new_contacts + " " + oldcont_ids);
	System.out.println("dassdakjsdahsdakhsahjsalksdklsakljsad");
	System.out.println(added_cont + " " + removed_cont);
	return related_to;
    }

    /**
     * gets the contact ids by giving list of contact objects
     * 
     * @param contacts
     * @return list of contact ids
     */
    public static List<String> getContactIds(List<Contact> contacts)
    {

	List<String> contids = new ArrayList<>();
	for (Contact con : contacts)
	{
	    contids.add(con.id.toString());
	}
	return contids;

    }

    /**
     * gets thejsonarray of contact ids by giving list of contact objects
     * 
     * @param contacts
     * @return list of contact ids
     */
    public static JSONArray getContactIdsJson(List<Contact> contacts)
    {
	System.out.println(contacts.size());
	JSONArray jsn = new JSONArray();
	for (Contact con : contacts)
	{
	    jsn.put(con.id);
	}
	System.out.println(jsn);
	return jsn;

    }

    /**
     * 
     * gets contact names by giving contactids
     * 
     * @param contactids
     * @return list of contacts names
     * @throws JSONException
     */
    public static List<String> getContactNamesFromIds(List<Object> contactids) throws JSONException
    {
	List<String> list = new ArrayList<>();
	String contact_name = "";
	for (int i = 0; i <= contactids.size() - 1; i++)
	{

	    if (contactids.get(i) != null)
	    {
		Contact contact = ContactUtil.getContact(Long.parseLong(contactids.get(i).toString()));
		if (contact != null)
		{
		    ContactField firstname = contact.getContactFieldByName("first_name");
		    ContactField lastname = contact.getContactFieldByName("last_name");
		    if (firstname != null)
		    {
			contact_name += firstname.value;
		    }
		    if (lastname != null)
		    {
			contact_name += "";
			contact_name += lastname.value;
		    }

		    list.add(contact_name.trim());
		    contact_name = "";
		}
	    }

	}
	return list;
    }

    /**
     * method used to get the deal names by giving array of deal ids.
     * 
     * @param js
     * @return list of deal names
     * 
     * @throws JSONException
     */
    public static List<String> getDealNames(JSONArray js) throws JSONException
    {
	List<String> list = new ArrayList<>();

	for (int i = 0; i <= js.length() - 1; i++)
	{

	    if (js.get(i) != null)
	    {
		Opportunity opertunity = OpportunityUtil.getOpportunity(js.getLong(i));
		if (opertunity != null)
		{
		    list.add(opertunity.name);

		}
	    }

	}
	return list;
    }

    /**
     * gets the list of task names by giving array of task ids
     * 
     * @param js
     * @return
     * @throws JSONException
     */
    public static List<String> getTaskNames(JSONArray js) throws JSONException
    {
	List<String> list = new ArrayList<>();

	for (int i = 0; i <= js.length() - 1; i++)
	{

	    if (js.get(i) != null)
	    {
		Task task = TaskUtil.getTask(js.getLong(i));
		if (task != null)
		{
		    list.add(task.subject);

		}
	    }

	}
	return list;
    }

    /**
     * gets the list of task names by giving array of event ids
     * 
     * @param js
     * @return
     * @throws JSONException
     */
    public static List<String> getEventNames(JSONArray js) throws JSONException
    {
	List<String> list = new ArrayList<>();

	for (int i = 0; i <= js.length() - 1; i++)
	{

	    if (js.get(i) != null)
	    {
		Event event = EventUtil.getEvent(js.getLong(i));
		if (event != null)
		{
		    list.add(event.title);

		}
	    }

	}
	return list;
    }

    /**
     * gets list of document names
     * 
     * @param js
     * @return
     * @throws JSONException
     */
    public static List<String> getDocumentNames(JSONArray js) throws JSONException
    {
	List<String> list = new ArrayList<>();
	String contact_name = "";
	for (int i = 0; i <= js.length() - 1; i++)
	{

	    if (js.get(i) != null)
	    {
		Document document = DocumentUtil.getDocument(js.getLong(i));
		if (document != null)
		{
		    list.add(document.name);

		}
	    }

	}
	return list;
    }

    /**
     * gets the list of task names by giving array of workflow ids
     * 
     * @param js
     * @return
     * @throws JSONException
     */
    public static List<String> getWorkFlowNames(JSONArray js) throws JSONException
    {
	List<String> list = new ArrayList<>();

	for (int i = 0; i <= js.length() - 1; i++)
	{

	    if (js.get(i) != null)
	    {
		Workflow workflow = WorkflowUtil.getWorkflow(js.getLong(i));
		if (workflow != null)
		{
		    list.add(workflow.name);

		}
	    }

	}
	return list;
    }

    /**
     * creates log for each call activity i.e twillio or sip
     * @param serviceType {out going or incoming}
     * @param toOrFromNumber 
     * @param callType {tw}
     * @param callStatus
     * @param callDuration
     */
    public static void createLogForCalls(String serviceType, String toOrFromNumber, String callType, String callStatus,
	    String callDuration)
    {

	// Search contact
	if (toOrFromNumber != null)
	{
	    Contact contact = QueryDocumentUtil.getContactsByPhoneNumber(toOrFromNumber);
	    System.out.println("contact: " + contact);
	    if (contact != null)
	    {
		String calledToName = "";
		List<ContactField> properties = contact.properties;
		for (ContactField f : properties)
		{
		    System.out.println("\t" + f.name + " - " + f.value);
		    if (f.name.equals(contact.FIRST_NAME))
		    {
			calledToName += f.value;
		    }
		    if (f.name.equals(contact.LAST_NAME))
		    {
			calledToName += " " + f.value;
		    }
		}

		Activity activity = new Activity();
		activity.activity_type = ActivityType.CALL;
		activity.custom1 = serviceType;
		activity.custom2 = callType;
		activity.custom3 = callStatus;
		activity.custom4 = callDuration;
		activity.label = calledToName;
		activity.entity_type = EntityType.CONTACT;
		activity.entity_id = contact.id;
		activity.save();
	    }
	    else
	    {
		Activity activity = new Activity();
		activity.activity_type = ActivityType.CALL;
		activity.custom1 = serviceType;
		activity.custom2 = callType;
		activity.custom3 = callStatus;
		activity.custom4 = callDuration;
		activity.label = toOrFromNumber;
		activity.entity_type = null;
		activity.entity_id = null;
		activity.save();
	    }
	}
    }

    /**
     * Gets list of activities based on entity id and min time and max time.
     * 
     * @param entityId
     *            - Given entity id.
     * @param minTime
     *            - Given min time.
     * @param maxTime
     *            - Given max time.
     * @return list of activities based on entity id and min time and max time.
     */
    public static List<Activity> getActivitiesByEntityId(Long entityId, long minTime, long maxTime)
    {
	return dao.ofy().query(Activity.class).filter("entity_id", entityId).filter("time >= ", minTime)

	.filter("time <= ", maxTime).order("-time").list();
    }

    /**
     * Gets list of activities based on activity type.
     * 
     * @param activityType
     *            - Given activity type.
     * 
     * @return list of activities based on activity type.
     */
    public static List<Activity> getActivitiesByActivityType(String activityType, Long ownerId, long minTime,
	    long maxTime)
    {
	return dao.ofy().query(Activity.class).filter("activity_type", activityType)
	        .filter("user", new Key<DomainUser>(DomainUser.class, ownerId)).filter("time >= ", minTime)
	        .filter("time <= ", maxTime).list();
    }

    /**
     * 
     * @author Purushotham
     * @created 28-Nov-2014
     *
     */
    public static void createLogForCalls(String serviceType, String toOrFromNumber, String callType, String callStatus,
	    String callDuration, Contact contact)
    {

	// Search contact
	if (toOrFromNumber != null)
	{
	    String twilioStatus = getEnumValueOfTwilioStatus(callStatus);
	    if (twilioStatus != null)
	    {

		System.out.println("contact: " + contact);
		if (contact != null)
		{
		    String calledToName = "";
		    ContactField firstname = contact.getContactFieldByName("first_name");
		    ContactField lastname = contact.getContactFieldByName("last_name");

		    if (firstname != null)
			calledToName += firstname.value;

		    if (lastname != null)
		    {
			calledToName += " ";
			calledToName += lastname.value;
		    }

		    Activity activity = new Activity();
		    activity.activity_type = ActivityType.CALL;
		    activity.custom1 = serviceType;
		    activity.custom2 = callType;
		    activity.custom3 = twilioStatus;
		    activity.custom4 = callDuration;
		    activity.label = calledToName;
		    activity.entity_type = EntityType.CONTACT;
		    activity.entity_id = contact.id;
		    activity.save();
		}
		else
		{
		    Activity activity = new Activity();
		    activity.activity_type = ActivityType.CALL;
		    activity.custom1 = serviceType;
		    activity.custom2 = callType;
		    activity.custom3 = twilioStatus;
		    activity.custom4 = callDuration;
		    activity.label = toOrFromNumber;
		    activity.entity_type = null;
		    activity.entity_id = null;
		    activity.save();
		}
	    }
	}

    }

    /**
     * Fetch list of activities based on the given filters sorted on the time of
     * activity.
     * 
     * @param user_id
     *            the id of the user who performed the activity.
     * @param entity_type
     *            the type of the entity.
     * @param activity_type
     *            activity type.
     * @param entity_id
     *            the id of the entity on which the activity is performed.
     * @param max
     *            maximum number of the activities to retrieve.
     * @param cursor
     *            starting cursor for paging.
     * @return the list of activities based on the given filter.
     */
    public static List<Activity> getActivitiesByFilter(Long user_id, String entity_type, String activity_type,
	    Long entity_id, Long startTime, Long endTime, Integer max, String cursor)
    {
	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    Query<Activity> query = dao.ofy().query(Activity.class);
	    if (!StringUtils.isEmpty(entity_type))
		searchMap.put("entity_type", entity_type);
	    if (!StringUtils.isEmpty(activity_type))
		searchMap.put("activity_type", activity_type);
	    if (user_id != null)
		searchMap.put("user", new Key<DomainUser>(DomainUser.class, user_id));

	    if (entity_id != null)
		searchMap.put("entity_id", entity_id);

	    if (startTime != null)
		searchMap.put("time >", startTime);

	    if (endTime != null)
		searchMap.put("time <", endTime);

	    System.out.println("Search query --------" + searchMap);

	    if (max != null && max > 0)
		dao.fetchAllByOrder(max, cursor, searchMap, true, false, "time");

	    return dao.listByProperty(searchMap);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * gets the  status of calls
     * @param status
     * @return
     */
    public static String getEnumValueOfTwilioStatus(String status)
    {
	if (status.equalsIgnoreCase("completed"))
	{
	    return Call.ANSWERED;
	}
	else if (status.equalsIgnoreCase("busy"))
	{
	    return Call.BUSY;
	}
	else if (status.equalsIgnoreCase("failed"))
	{
	    return Call.FAILED;
	}
	else if (status.equalsIgnoreCase("no-answer"))
	{
	    return Call.BUSY;
	}
	else if (status.equalsIgnoreCase("voicemail"))
	{
	    return Call.VOICEMAIL;
	}
	else
	{
	    return null;
	}
    }

    /**
     * gets list of activities based on entity type and entity id
     * 
     * @param entity_type
     * @param entity_id
     * @param max
     * @param cursor
     * @return
     */
    public static List<Activity> getActivitiesByEntityId(String entity_type, Long entity_id, Integer max, String cursor)
    {
	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    searchMap.put("entity_type", entity_type);
	    searchMap.put("entity_id", entity_id);

	    if (max != 0)
		return dao.fetchAllByOrder(max, cursor, searchMap, true, false, "-time");

	    return dao.listByProperty(searchMap);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets list of activities based on entity id and min time and max time.
     * 
     * @param entityId
     *            - Given entity id.
     * @param minTime
     *            - Given min time.
     * @param maxTime
     *            - Given max time.
     * @return list of activities based on entity id and min time and max time.
     */
    public static List<Activity> getWonDealsActivityList(long minTime, long maxTime)
    {
	List<String> activityTypeList = new ArrayList<String>();
	activityTypeList.add("DEAL_CLOSE");
	activityTypeList.add("DEAL_ADD");
	try
	{
	    if (minTime != 0)
		return dao.ofy().query(Activity.class).filter("entity_type", "DEAL")
		        .filter("activity_type in", activityTypeList).filter("time >= ", minTime)
		        .filter("time <= ", maxTime).order("-time").list();
	    else
		return dao.ofy().query(Activity.class).filter("entity_type", "DEAL")
		        .filter("activity_type in", activityTypeList).filter("time <= ", maxTime).order("-time").list();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * 
     * @param entitytype
     *            DEAL or TASK or Contact or etc
     * @param userid
     * @param max
     * @param cursor
     * @param starttime
     *            time range
     * @param endtime
     * @return
     */
    public static List<Activity> getActivititesBasedOnSelectedConditon(String entitytype, Long userid, int max,
	    String cursor, Long starttime, Long endtime)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	if (!entitytype.equalsIgnoreCase("ALL") && !entitytype.equalsIgnoreCase("CALL"))
	    searchMap.put("entity_type", entitytype);
	if (entitytype.equalsIgnoreCase("CALL"))
	    searchMap.put("activity_type", entitytype);
	if (starttime != null)
	    searchMap.put("time >=", starttime);
	if (endtime != null)
	    searchMap.put("time <=", endtime);

	if (userid != null)
	    searchMap.put("user", new Key<DomainUser>(DomainUser.class, userid));

	if (max != 0)
	    return dao.fetchAllByOrder(max, cursor, searchMap, true, false, "-time");

	return dao.listByProperty(searchMap);
    }

    /**
     * 
     * @param activity_type
     *            CONTACTS_IMPORT,CONTACT_EXPORT,COMPANY_IMPORT,COMPANY_EXPORT,
     *            DEALS_IMPORT
     * @param data
     *            saved contacts,merged ,failed status
     * @param entity_type
     *            CONTACTS,COMAPANY,DEAL
     * 
     * @param label
     *            contacts,company,deal etc.
     */
    public static void createLogForExportImport(ActivityType activity_type, EntityType entity_type,
	    Map<Object, Object> status_map, int total)
    {
	HashMap<Object, Object> temp_map = new HashMap<>();
	try
	{
	    if (status_map != null)
	    {
		for (Map.Entry<Object, Object> entry : status_map.entrySet())
		{
		    temp_map.put(returnNormalName(entry.getKey().toString()), entry.getValue());
		}
		temp_map.remove("type");
	    }
	    Activity activity = new Activity();
	    activity.activity_type = activity_type;
	    activity.entity_type = entity_type;

	    if (!temp_map.isEmpty())
	    {
		activity.custom1 = temp_map.toString().trim().substring(1, temp_map.toString().trim().length() - 1);
	    }
	    if (total != 0)
		activity.custom2 = String.valueOf(total);
	    activity.save();
	}
	catch (Exception e)
	{
	    System.out.println("Exception occured in export import log " + e.getMessage());
	}
    }

    /**
     * creates log for import
     * 
     * @param activity_type
     * @param entityType
     * @param saved_contacts
     * @param merged_contacts
     */
    public static void createLogForImport(ActivityType activity_type, EntityType entityType, int saved_contacts,
	    int merged_contacts)
    {

	try
	{

	    Activity activity = new Activity();
	    activity.activity_type = activity_type;
	    activity.entity_type = entityType;

	    activity.custom1 = String.valueOf(saved_contacts);
	    if (merged_contacts != 0)
		activity.custom2 = String.valueOf(merged_contacts);
	    activity.save();
	}
	catch (Exception e)
	{
	    System.out.println("Exception occured in  import log " + e.getMessage());
	}
    }

    public static String returnNormalName(String str)
    {
	if (str.contains("_"))
	{
	    return str.replace("_", " ").toLowerCase();
	}
	return str.toLowerCase();
    }
    
    /**
     * Gets the count of answered calls.
     * 
     * @param activityType
     *            - Given activity type.
     * 
     * @return list of activities based on activity type.
     */
    public static int getCompletedCallsCountOfUser(Long ownerId, long minTime,
	    long maxTime)
    {
    	try
    	{
    		return dao.ofy().query(Activity.class).filter("activity_type", ActivityType.CALL)
    		        .filter("user", new Key<DomainUser>(DomainUser.class, ownerId)).filter("time >= ", minTime)
    		        .filter("time <= ", maxTime).filter("custom3", Call.ANSWERED).count();
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		return 0;
    	}
    }

}
