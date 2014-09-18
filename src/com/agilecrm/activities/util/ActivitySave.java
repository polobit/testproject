package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.document.Document;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.gson.Gson;

public class ActivitySave
{

    /**
     * creates DEAL_EDIT activity by passing
     * 
     * @param opportunity
     * @throws JSONException
     */

    public static void createDealEditActivity(Opportunity opportunity) throws JSONException
    {

	Map<String, Object[]> deals = ActivityUtil.dealChangedFields(opportunity);
	System.out.println(deals.size());
	System.out.println("in deals api");
	Object close_date[] = deals.get("close_date");
	Object name[] = deals.get("name");
	Object ownername[] = deals.get("owner_name");
	Object expectedvalue[] = deals.get("expected_value");
	Object probablity[] = deals.get("probability");
	Object milestone[] = deals.get("milestone");
	Object Contacts_related_to[] = deals.get("Contacts_related_to");

	if (deals.size() > 0)
	{
	    if (ownername != null)
	    {
		ActivityUtil.createDealActivity(ActivityType.DEAL_OWNER_CHANGE, opportunity, ownername[0].toString(),
		        ownername[1].toString(), ownername[2].toString());

	    }
	    if (milestone != null)
	    {
		if (milestone[0].toString().equalsIgnoreCase("Won"))
		    ActivityUtil.createDealActivity(ActivityType.DEAL_CLOSE, opportunity, milestone[0].toString(),
			    milestone[4].toString(), milestone[3].toString());
		else if (milestone[0].toString().equalsIgnoreCase("Lost"))
		    ActivityUtil.createDealActivity(ActivityType.DEAL_LOST, opportunity, milestone[0].toString(),
			    milestone[4].toString(), milestone[3].toString());
		else
		    ActivityUtil.createDealActivity(ActivityType.DEAL_MILESTONE_CHANGE, opportunity,
			    milestone[0].toString(), milestone[1].toString(), milestone[2].toString());
	    }

	    if (name == null && expectedvalue == null && probablity == null && close_date == null && milestone == null
		    && ownername == null)
	    {
		if (Contacts_related_to != null)
		{
		    if (!Contacts_related_to[0].toString().equalsIgnoreCase("[]")
			    && !Contacts_related_to[1].toString().equalsIgnoreCase("[]"))
			ActivityUtil.createDealActivity(ActivityType.DEAL_RELATED_CONTACTS, opportunity,
			        Contacts_related_to[0].toString(), Contacts_related_to[1].toString(),
			        Contacts_related_to[2].toString());
		    else if (Contacts_related_to[0].toString().equalsIgnoreCase("[]")
			    && Contacts_related_to[1].toString().equalsIgnoreCase("[]"))
		    {

		    }
		    else if (!Contacts_related_to[0].toString().equalsIgnoreCase("[]"))
		    {
			ActivityUtil.createDealActivity(ActivityType.DEAL_RELATED_CONTACTS, opportunity,
			        Contacts_related_to[0].toString(), "[]", Contacts_related_to[2].toString());
		    }
		    else if (!Contacts_related_to[1].toString().equalsIgnoreCase("[]"))
		    {
			ActivityUtil.createDealActivity(ActivityType.DEAL_RELATED_CONTACTS, opportunity, "[]",
			        Contacts_related_to[1].toString(), Contacts_related_to[2].toString());
		    }

		}
	    }

	    if (name != null || expectedvalue != null || probablity != null || close_date != null)
	    {
		List changed_data = getChangedData(name, expectedvalue, probablity, close_date);

		ActivityUtil.createDealActivity(ActivityType.DEAL_EDIT, opportunity, changed_data.get(1).toString(),
		        changed_data.get(0).toString(), changed_data.get(2).toString());
	    }
	}

    }

    /**
     * common method to get the changed fields when updating deal,task,event
     * 
     * @param name
     * @param expectedvalue
     * @param probablity
     * @param title
     * @return list of old data and list new data
     */
    public static List getChangedData(Object[] name, Object[] expectedvalue, Object[] probablity, Object[] title)
    {

	List<Object> olddata = new ArrayList<Object>();

	List<Object> list = new ArrayList<>();
	List<Object> newdata = new ArrayList<Object>();
	List<Object> changedfields = new ArrayList<Object>();
	if (name != null)
	    if (name[0] != null)
	    {
		olddata.add(name[1]);
		newdata.add(name[0]);
		changedfields.add(name[2]);
	    }

	if (expectedvalue != null)
	    if (expectedvalue[0] != null)
	    {
		olddata.add(expectedvalue[1]);
		newdata.add(expectedvalue[0]);
		changedfields.add(expectedvalue[2]);
	    }
	if (probablity != null)
	    if (probablity[0] != null)
	    {
		olddata.add(probablity[1]);
		newdata.add(probablity[0]);
		changedfields.add(probablity[2]);
	    }

	if (title != null)
	    if (title[0] != null)
	    {
		olddata.add(title[1]);
		newdata.add(title[0]);
		changedfields.add(title[2]);
	    }

	list.add(olddata);
	list.add(newdata);
	list.add(changedfields);
	return list;
    }

    /**
     * method used create EVENT_EDIT activity
     * 
     * @param event
     */

    public static void createEventEditActivity(Event event)
    {

	Map<String, Object[]> events = ActivityUtil.eventchangedfields(event);
	System.out.println(events.size());
	System.out.println("in events api");
	Object start_date[] = events.get("start_date");
	Object end_date[] = events.get("end_date");
	Object title[] = events.get("title");
	Object priority[] = events.get("priority");
	Object Contacts_related_to[] = events.get("Contacts_related_to");

	if (events.size() > 0)
	{
	    if (start_date == null && end_date == null && title == null && priority == null)
	    {
		if (Contacts_related_to != null)
		{
		    if (!Contacts_related_to[0].toString().equalsIgnoreCase("[]")
			    && !Contacts_related_to[1].toString().equalsIgnoreCase("[]"))
			ActivityUtil.createEventActivity(ActivityType.EVENT_RELATED_CONTACTS, event,
			        Contacts_related_to[0].toString(), Contacts_related_to[1].toString(),
			        Contacts_related_to[2].toString());
		    else if (Contacts_related_to[0].toString().equalsIgnoreCase("[]")
			    && Contacts_related_to[1].toString().equalsIgnoreCase("[]"))
		    {

		    }
		    else if (!Contacts_related_to[0].toString().equalsIgnoreCase("[]"))
		    {
			ActivityUtil.createEventActivity(ActivityType.EVENT_RELATED_CONTACTS, event,
			        Contacts_related_to[0].toString(), "[]", Contacts_related_to[2].toString());
		    }
		    else if (!Contacts_related_to[1].toString().equalsIgnoreCase("[]"))
		    {
			ActivityUtil.createEventActivity(ActivityType.EVENT_RELATED_CONTACTS, event, "[]",
			        Contacts_related_to[1].toString(), Contacts_related_to[2].toString());
		    }

		}
	    }

	    if (start_date != null || end_date != null || title != null || priority != null)
	    {
		List changed_data = getChangedData(start_date, end_date, priority, title);

		ActivityUtil.createEventActivity(ActivityType.EVENT_EDIT, event, changed_data.get(1).toString(),
		        changed_data.get(0).toString(), changed_data.get(2).toString());
	    }
	}

    }

    /**
     * method used to create TASK_EDIT activity
     * 
     * @param task
     */
    public static void createTaskEditActivity(Task task)
    {
	Map<String, Object[]> tasks = ActivityUtil.taskChangedFields(task);
	System.out.println(tasks.size());
	System.out.println("in tasks api");
	Object due[] = tasks.get("due");
	Object priority[] = tasks.get("priority");
	Object status[] = tasks.get("status");
	Object progress[] = tasks.get("progress");
	Object subject[] = tasks.get("subject");
	Object task_type[] = tasks.get("task_type");
	Object owner_name[] = tasks.get("Task_owner");
	Object Contacts_related_to[] = tasks.get("Contacts_related_to");
	System.out.println(due + "  " + priority + "  " + status + "  " + progress + "  " + subject + " " + task_type
	        + "  " + owner_name + "  " + Contacts_related_to);
	if (tasks.size() > 0)
	{

	    if (progress != null && status == null)
	    {

		ActivityUtil.createTaskActivity(ActivityType.TASK_PROGRESS_CHANGE, task, progress[0].toString(),
		        progress[1].toString(), progress[2].toString());

	    }

	    else if (status != null || progress != null)
	    {

		if (status[0].toString().equalsIgnoreCase("IN_PROGRESS"))
		{

		    ActivityUtil.createTaskActivity(ActivityType.TASK_PROGRESS_CHANGE, task, progress[0].toString(),
			    progress[1].toString(), progress[2].toString());
		}
		else if (status[0].toString().equalsIgnoreCase("COMPLETED"))
		{
		    ActivityUtil.createTaskActivity(ActivityType.TASK_COMPLETED, task, status[0].toString(),
			    status[1].toString(), status[2].toString());
		}
		else

		    ActivityUtil.createTaskActivity(ActivityType.TASK_STATUS_CHANGE, task, status[0].toString(),
			    status[1].toString(), status[2].toString());
	    }

	    if (owner_name != null)
	    {
		ActivityUtil.createTaskActivity(ActivityType.TASK_OWNER_CHANGE, task, owner_name[0].toString(),
		        owner_name[1].toString(), owner_name[2].toString());
	    }

	    if (due == null && priority == null && subject == null && task_type == null && progress == null
		    && owner_name == null)
	    {
		if (Contacts_related_to != null)
		{
		    if (!Contacts_related_to[0].toString().equalsIgnoreCase("[]")
			    && !Contacts_related_to[1].toString().equalsIgnoreCase("[]"))
			ActivityUtil.createTaskActivity(ActivityType.TASK_RELATED_CONTACTS, task,
			        Contacts_related_to[0].toString(), Contacts_related_to[1].toString(),
			        Contacts_related_to[2].toString());
		    else if (Contacts_related_to[0].toString().equalsIgnoreCase("[]")
			    && Contacts_related_to[1].toString().equalsIgnoreCase("[null]"))
		    {

		    }
		    else if (!Contacts_related_to[0].toString().equalsIgnoreCase("[]"))
		    {
			ActivityUtil.createTaskActivity(ActivityType.TASK_RELATED_CONTACTS, task,
			        Contacts_related_to[0].toString(), "[]", Contacts_related_to[2].toString());
		    }
		    else if (!Contacts_related_to[1].toString().equalsIgnoreCase("[]"))
		    {
			ActivityUtil.createTaskActivity(ActivityType.TASK_RELATED_CONTACTS, task, "[]",
			        Contacts_related_to[1].toString(), Contacts_related_to[2].toString());
		    }

		}
	    }
	    if (due != null || priority != null || subject != null || task_type != null)
	    {
		List changed_data = getChangedData(due, priority, subject, task_type);

		ActivityUtil.createTaskActivity(ActivityType.TASK_EDIT, task, changed_data.get(1).toString(),
		        changed_data.get(0).toString(), changed_data.get(2).toString());
	    }

	}
    }

    /**
     * method used to create DEAL_ADD activity
     * 
     * @param opportunity
     * @throws JSONException
     */
    public static void createDealAddActivity(Opportunity opportunity) throws JSONException
    {

	String owner_name = DomainUserUtil.getDomainUser(Long.parseLong(opportunity.owner_id)).name;

	List<Note> notes = opportunity.getNotes();

	if (notes.size() == 1)
	{
	    Note note = notes.get(0);
	    String note_subject = note.subject;
	    String note_description = note.description;
	    ActivityUtil.createDealActivity(ActivityType.NOTE_ADD, opportunity, note_subject, note_description,
		    note.id.toString());
	}

	ActivityUtil.createDealActivity(ActivityType.DEAL_ADD, opportunity, owner_name, "", "Deal_owner_name");

    }

    public static List<String> getContactNames(JSONArray js) throws JSONException
    {
	List<String> list = new ArrayList<>();
	String contact_name = "";
	for (int i = 0; i <= js.length() - 1; i++)
	{

	    if (js.get(i) != null)
	    {
		Contact contact = ContactUtil.getContact(Long.parseLong(js.get(i).toString()));
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
     * creates TASK_ADD activity
     * 
     * @param task
     * @throws JSONException
     */

    public static void createTaskAddActivity(Task task) throws JSONException
    {

	String owner_name = DomainUserUtil.getDomainUser(Long.parseLong(task.owner_id)).name;

	ActivityUtil.createTaskActivity(ActivityType.TASK_ADD, task, owner_name, "", "Task_owner_name");

    }

    /**
     * method creates EVENT_ADD activity
     * 
     * @param event
     * @throws JSONException
     */
    public static void createEventAddActivity(Event event) throws JSONException
    {

	ActivityUtil.createEventActivity(ActivityType.EVENT_ADD, event, event.title, "", "event title");

    }

    /**
     * creates EVENT_DELETE activity
     * 
     * @param event
     */
    public static void createEventDeleteActivity(Event event)
    {

	ActivityUtil.createEventActivity(ActivityType.EVENT_DELETE, event, "", "", "");

    }

    /**
     * creates TASK_DELETE activity
     * 
     * @param task
     */
    public static void createTaskDeleteActivity(Task task)
    {

	ActivityUtil.createTaskActivity(ActivityType.TASK_DELETE, task, "", "", "");

    }

    /**
     * creates DEAL_DELETE activity
     * 
     * @param opr
     */
    public static void createDealDeleteActivity(Opportunity opr)
    {

	ActivityUtil.createDealActivity(ActivityType.DEAL_DELETE, opr, "", "", "");

    }

    /**
     * method creates EMAIL_SENT activity to a particular conatact
     * 
     * @param to
     * @param subject
     * @param body
     */
    public static void createEmailSentActivityToContact(String to, String subject, String body)
    {
	String emailbody = body.replaceAll("\\<.*?>", "");
	System.out.println(emailbody);
	Contact contact = ContactUtil.searchContactByEmail(to);
	if (contact != null)

	    ActivityUtil.createContactActivity(ActivityType.EMAIL_SENT, contact, to, subject, emailbody);

    }

   /**
     * creates DOCUMENT_ADD activity
     * 
     * @param document
     * @throws JSONException
     */

    public static void createDocumentAddActivity(Document document) throws JSONException
    {

	JSONObject js = new JSONObject(new Gson().toJson(document));
	System.out.println(js);

	JSONArray jsn = js.getJSONArray("contact_ids");
	if (jsn != null && jsn.length() > 0)
	{

	    ActivityUtil.createDocumentActivity(ActivityType.DOCUMENT_ADD, document, document.url,
		    String.valueOf(jsn.length()), "Related contact to this Document");
	}

    }

    /**
     * creates NOTE_ADD activity w.r.t a contact
     * 
     * @param note
     * @throws JSONException
     */

    public static void createNoteAddActivityToContact(Note note) throws JSONException
    {

	JSONObject js = new JSONObject(new Gson().toJson(note));
	System.out.println(js);

	JSONArray jsn = js.getJSONArray("contact_ids");

	if (jsn != null && jsn.length() > 0)
	{

	    for (int i = 0; i <= jsn.length() - 1; i++)
	    {

		Contact contact = ContactUtil.getContact(jsn.getLong(i));
		ActivityUtil.createContactActivity(ActivityType.NOTE_ADD, contact, note.subject, note.description,
		        note.id.toString());
	    }

	}

    }

    /**
     * create TAG_ADD activity
     * 
     * @param contact
     * @throws JSONException
     */

    public static void createTagAddActivity(Contact contact) throws JSONException
    {

	JSONObject js = new JSONObject(new Gson().toJson(contact));
	JSONArray jsn = js.getJSONArray("tagsWithTime");
	ArrayList<String> tag = new ArrayList<String>();
	if (jsn != null && jsn.length() != 0)
	{
	    for (int i = 0; i <= jsn.length() - 1; i++)
	    {
		JSONObject tagobj = jsn.getJSONObject(i);
		tag.add(tagobj.getString("tag"));
	    }

	    ActivityUtil.createContactActivity(ActivityType.TAG_ADD, contact, tag.toString(), "", "tag Added");

	}
	System.out.println(tag);

    }

    /**
     * method used to create bulk delete activity takes place in task and deal
     * 
     * @param entitytype
     *            dynamically stores either task or deal
     * @param new_data
     * @param old_data
     * @param changed_field
     */
    public static void createLogForBulkDeletes(EntityType entitytype, String delete_entity_ids,
	    String delete_entity_names, String changed_field)
    {

	ActivityUtil.createBulkDeleteActivity(entitytype, delete_entity_ids,
	        delete_entity_names.replaceAll("[^\\w\\s\\-,]", ""), changed_field);

    }

    /**
     * creates BULK_ACTION actiivity to a bulk contacts
     * 
     * @param contactids
     *            list of contact ids from bulkaction.js
     * @param actiontype
     *            action_type might be TAG_ADD,TAG_REMOVE,ADD_TO_CAMPAIGn etc..
     * 
     * @param data
     * @throws JSONException
     */
    public static void createBulkActionActivity(JSONArray contactids, String actiontype, String data)
	    throws JSONException
    {

	

	ActivityUtil.createBulkActionActivity(actiontype, data, String.valueOf(contactids.length()));

    }

}
