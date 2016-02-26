package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.gson.Gson;
import com.agilecrm.contact.DocumentNote;
/**
 * <code>ActivitySave</code> class is interacts with ActivityUtil to create activities.
 * ActivitySave interacts all other classes to create log for action performed
 */
public class ActivitySave
{

    /**
     * method used to create DEAL_ADD activity
     * 
     * @param opportunity
     * @throws JSONException
     */
    public static void createDealAddActivity(Opportunity opportunity) throws JSONException
    {

	List<Contact> contacts = opportunity.getContacts();
	JSONArray jsn = null;
	if (contacts != null && contacts.size() > 0)
	{
	    jsn = ActivityUtil.getContactIdsJson(contacts);
	}

	String owner_name = DomainUserUtil.getDomainUser(Long.parseLong(opportunity.owner_id)).name;

	ActivityUtil.createDealActivity(ActivityType.DEAL_ADD, opportunity, owner_name,
	        opportunity.expected_value.toString(), String.valueOf(opportunity.probability), jsn);

    }

    /**
     * 
     */
    public static void createNoteAddForDeal(Note note, Opportunity opportunity)
    {

	ActivityUtil.createDealActivity(ActivityType.NOTE_ADD, opportunity, note.subject, note.description,
	        note.id.toString(), null);

    }

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
	JSONObject js = new JSONObject(new Gson().toJson(opportunity));
	JSONArray jsn = getExistingContactsJsonArray(js.getJSONArray("contact_ids"));

	if (deals.size() > 0)
	{
	    if (ownername != null)
	    {
		ActivityUtil.createDealActivity(ActivityType.DEAL_OWNER_CHANGE, opportunity, ownername[0].toString(),
		        ownername[1].toString(), ownername[2].toString(), jsn);

	    }
	    if (milestone != null)
	    {
		if (milestone[0].toString().equalsIgnoreCase("Won"))
		    ActivityUtil.createDealActivity(ActivityType.DEAL_CLOSE, opportunity, milestone[0].toString(),
			    milestone[1].toString(), milestone[2].toString(), jsn);
		else if (milestone[0].toString().equalsIgnoreCase("Lost"))
		    ActivityUtil.createDealActivity(ActivityType.DEAL_LOST, opportunity, milestone[0].toString(),
			    milestone[1].toString(), milestone[2].toString(), jsn);
		else
		    ActivityUtil.createDealActivity(ActivityType.DEAL_MILESTONE_CHANGE, opportunity,
			    milestone[0].toString(), milestone[1].toString(), milestone[2].toString(), jsn);
	    }

	    if (name != null || expectedvalue != null || probablity != null || close_date != null)
	    {
		List changed_data = getChangedData(name, expectedvalue, probablity, close_date);

		ActivityUtil.createDealActivity(ActivityType.DEAL_EDIT, opportunity, changed_data.get(1).toString(),
		        changed_data.get(0).toString(), changed_data.get(2).toString(), jsn);
	    }
	}

    }

    /**
     * creates DEAL_DELETE activity
     * 
     * @param opr
     * @throws JSONException
     */
    public static void createDealDeleteActivity(Opportunity opr) throws JSONException
    {
	List<Contact> contacts = opr.getContacts();
	JSONArray jsn = null;
	if (contacts != null && contacts.size() > 0)
	{
	    jsn = getExistingContactsJsonArray(ActivityUtil.getContactIdsJson(contacts));
	}

	ActivityUtil.createDealActivity(ActivityType.DEAL_DELETE, opr, "", "", "", jsn);

    }

    /**
     * method creates EVENT_ADD activity
     * 
     * @param event
     * @throws JSONException
     */
    public static void createEventAddActivity(Event event) throws JSONException
    {

	List<Contact> contacts = event.getContacts();
	JSONArray jsn = null;
	if (contacts != null && contacts.size() > 0)
	{
	    jsn = ActivityUtil.getContactIdsJson(contacts);
	}

	ActivityUtil.createEventActivity(ActivityType.EVENT_ADD, event, event.title, event.start.toString(),
	        "event title", jsn);

    }

    /**
     * method used create EVENT_EDIT activity
     * 
     * @param event
     * @throws JSONException
     */

    public static void createEventEditActivity(Event event) throws JSONException
    {

	Map<String, Object[]> events = ActivityUtil.eventchangedfields(event);
	System.out.println(events.size());
	System.out.println("in events api");
	Object start_date[] = events.get("start_date");
	Object end_date[] = events.get("end_date");
	Object title[] = events.get("title");
	Object priority[] = events.get("priority");

	JSONObject js = new JSONObject(new Gson().toJson(event));
	JSONArray jsn = getExistingContactsJsonArray(js.getJSONArray("contacts"));

	if (events.size() > 0)
	{

	    if (start_date != null || end_date != null || title != null || priority != null)
	    {
		List changed_data = getChangedData(start_date, end_date, priority, title);

		ActivityUtil.createEventActivity(ActivityType.EVENT_EDIT, event, changed_data.get(1).toString(),
		        changed_data.get(0).toString(), changed_data.get(2).toString(), jsn);
	    }
	}

    }

    /**
     * creates EVENT_DELETE activity
     * 
     * @param event
     * @throws JSONException
     */
    public static void createEventDeleteActivity(Event event) throws JSONException
    {
	List<Contact> contacts = event.getContacts();
	JSONArray jsn = null;
	if (contacts != null && contacts.size() > 0)
	{
	    jsn = getExistingContactsJsonArray(ActivityUtil.getContactIdsJson(contacts));
	}
	ActivityUtil.createEventActivity(ActivityType.EVENT_DELETE, event, "", "", "", jsn);

    }

    /**
     * creates TASK_ADD activity
     * 
     * @param task
     * @throws JSONException
     */

    public static void createTaskAddActivity(Task task) throws JSONException
    {
	List<Contact> contacts = task.getContacts();
	JSONArray jsn = null;
	if (contacts != null && contacts.size() > 0)
	{
	    jsn = ActivityUtil.getContactIdsJson(contacts);
	}

	String owner_name = DomainUserUtil.getDomainUser(Long.parseLong(task.owner_id)).name;

	ActivityUtil.createTaskActivity(ActivityType.TASK_ADD, task, owner_name, task.due.toString(),
	        "Task_owner_name", jsn);

    }

    /**
     * method used to create TASK_EDIT activity
     * 
     * @param task
     * @throws JSONException
     */
    public static void createTaskEditActivity(Task task) throws JSONException
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

	JSONObject js = new JSONObject(new Gson().toJson(task));
	JSONArray jsn = getExistingContactsJsonArray(js.getJSONArray("contacts"));
	System.out.println(due + "  " + priority + "  " + status + "  " + progress + "  " + subject + " " + task_type
	        + "  " + owner_name);
	if (tasks.size() > 0)
	{

	    if (progress != null && status == null)
	    {

		ActivityUtil.createTaskActivity(ActivityType.TASK_PROGRESS_CHANGE, task, progress[0].toString(),
		        progress[1].toString(), progress[2].toString(), jsn);

	    }

	    else if (status != null || progress != null)
	    {

		if (status[0].toString().equalsIgnoreCase("IN_PROGRESS"))
		{

		    ActivityUtil.createTaskActivity(ActivityType.TASK_PROGRESS_CHANGE, task, progress[0].toString(),
			    progress[1].toString(), progress[2].toString(), jsn);
		}
		else if (status[0].toString().equalsIgnoreCase("COMPLETED"))
		{
		    ActivityUtil.createTaskActivity(ActivityType.TASK_COMPLETED, task, status[0].toString(),
			    status[1].toString(), status[2].toString(), jsn);
		}
		else

		    ActivityUtil.createTaskActivity(ActivityType.TASK_STATUS_CHANGE, task, status[0].toString(),
			    status[1].toString(), status[2].toString(), jsn);
	    }

	    if (owner_name != null)
	    {
		ActivityUtil.createTaskActivity(ActivityType.TASK_OWNER_CHANGE, task, owner_name[0].toString(),
		        owner_name[1].toString(), owner_name[2].toString(), jsn);
	    }

	    if (due != null || priority != null || subject != null || task_type != null)
	    {
		List changed_data = getChangedData(due, priority, subject, task_type);

		ActivityUtil.createTaskActivity(ActivityType.TASK_EDIT, task, changed_data.get(1).toString(),
		        changed_data.get(0).toString(), changed_data.get(2).toString(), jsn);
	    }

	}
    }

    /**
     * creates TASK_DELETE activity
     * 
     * @param task
     * @throws JSONException
     */
    public static void createTaskDeleteActivity(Task task) throws JSONException
    {

	List<Contact> contacts = task.getContacts();
	JSONArray jsn = null;
	if (contacts != null && contacts.size() > 0)
	{
	    jsn = getExistingContactsJsonArray(ActivityUtil.getContactIdsJson(contacts));
	}
	ActivityUtil.createTaskActivity(ActivityType.TASK_DELETE, task, "", "", "", jsn);

    }

    /**
     * method creates EMAIL_SENT activity to a particular conatact
     * 
     * @param to
     * @param subject
     * @param body
     */
    public static void createEmailSentActivityToContact(String to, String subject, String body, Contact contact)
    {
	String emailbody = html2text(body);
	System.out.println(emailbody);
	
	if(contact == null)
		contact = ContactUtil.searchContactByEmail(to);
	
	if (contact != null)
	    ActivityUtil.createContactActivity(ActivityType.EMAIL_SENT, contact, to, emailbody, subject);

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
		    String.valueOf(jsn.length()), "Related contact to this Document", jsn);
	}
	else
	{
	    ActivityUtil.createDocumentActivity(ActivityType.DOCUMENT_ADD, document, document.url, null,
		    "no related contacts", jsn);
	}

    }

    /**
     * creates document updated activity
     * 
     * @param document
     * @throws JSONException
     */
    public static void createDocumentUpdateActivity(Document document) throws JSONException
    {

	Document olddoc = DocumentUtil.getDocument(document.id);

	List<String> old_contactids = olddoc.getContact_ids();
	List<String> contactids = new ArrayList<>();
	for (int i = 0; i <= old_contactids.size() - 1; i++)
	{
	    Contact con = ContactUtil.getContact(Long.parseLong(old_contactids.get(i)));
	    if (con != null)
	    {
		contactids.add(old_contactids.get(i));
	    }

	}

	JSONObject js = new JSONObject(new Gson().toJson(document));

	JSONArray jsncontacts = js.getJSONArray("contact_ids");
	JSONArray jsn = new JSONArray();

	for (int i = 0; i <= jsncontacts.length() - 1; i++)
	{
	    Contact con = ContactUtil.getContact(Long.parseLong(jsncontacts.get(i).toString()));
	    if (con != null)
		jsn.put(jsncontacts.get(i));
	}

	System.out.println(jsn + "  new contacts left side and old contacts right side  " + contactids);
	if (jsn != null && jsn.length() > 0)
	{
	    System.out.println("inside  contacts  ");
	    if (contactids != null && contactids.size() > 0)
	    {
		if (contactids.size() > jsn.length())
		{
		    int numberofcontacts = contactids.size() - jsn.length();
		    JSONArray jsonconatcs = removedContacts(contactids, jsn);

		    ActivityUtil.createDocumentActivity(ActivityType.DOCUMENT_REMOVE, document, document.url,
			    String.valueOf(numberofcontacts), "Related contact to this Document", jsonconatcs);
		}
		else
		{
		    ActivityUtil.createDocumentActivity(ActivityType.DOCUMENT_ADD, document, document.url,
			    String.valueOf(jsn.length()), "Related contact to this Document", jsn);
		}
	    }
	    else
	    {
		ActivityUtil.createDocumentActivity(ActivityType.DOCUMENT_ADD, document, document.url,
		        String.valueOf(jsn.length()), "Related contact to this Document", jsn);
	    }
	}

	else
	{
	    System.out.println("contacts size in else condition " + contactids.size());
	    if (contactids.size() > 0)
	    {
		JSONArray removedcontacts = getJsonArrayOfIdFromListForDocument(contactids);
		System.out.println("------------------------ " + removedcontacts.length());
		for (int i = 0; i <= removedcontacts.length() - 1; i++)
		{

		    System.out.println("---------------" + removedcontacts.get(i));
		}
		ActivityUtil.createDocumentActivity(ActivityType.DOCUMENT_REMOVE, document, document.url,
		        String.valueOf(contactids.size()), "Related contact to this Document", removedcontacts);
	    }
	}

    }

    /**
     * creates NOTE_ADD activity w.r.t a contact
     * 
     * @param note
     * @throws JSONException
     */

    public static void createNoteAddActivity(Note note) throws JSONException
    {

	JSONObject js = new JSONObject(new Gson().toJson(note));
	System.out.println(js);

	JSONArray jsn = getExistingContactsJsonArray(js.getJSONArray("contact_ids"));
	
	String custom4 = "";
	if(null != note.callType && null != note.phone && null != note.status){
		if(note.callType .equals("outbound-dial")){
			custom4 +=  "Outgoing call to " + note.phone + ", Status is "+ note.status;
		}else{
			custom4 +=  "Incoming call from " + note.phone + ", Status is "+ note.status;
		}
		System.out.println(custom4);
	}
	if (jsn != null && jsn.length() > 0)
	{

	    for (int i = 0; i <= jsn.length() - 1; i++)
	    {

		Contact contact = ContactUtil.getContact(jsn.getLong(i));
		if(null != note.callType){
			ActivityUtil.createContactActivity(ActivityType.NOTE_ADD, contact, note.subject, note.description,
			        note.id.toString(),custom4);
		}else{
			ActivityUtil.createContactActivity(ActivityType.NOTE_ADD, contact, note.subject, note.description,
			        note.id.toString());
		}
	    }

	}
	else
	{

	    JSONArray jsndealids = js.getJSONArray("deal_ids");

	    if (jsndealids != null && jsndealids.length() > 0)
	    {

		for (int k = 0; k <= jsndealids.length() - 1; k++)
		{

		    Opportunity opportunity = OpportunityUtil.getOpportunity(jsndealids.getLong(k));
		    ActivityUtil.createDealActivity(ActivityType.NOTE_ADD, opportunity, note.subject, note.description,
			    note.id.toString(), null);
		}

	    }
	}

    }

    
    public static void createDocumentNoteAddActivity(DocumentNote note) throws JSONException
    {

	JSONObject js = new JSONObject(new Gson().toJson(note));
	System.out.println(js);

	JSONArray jsn = getExistingContactsJsonArray(js.getJSONArray("contact_ids"));
	
	String custom4 = "";
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
	String owner_name = contact.getOwner().name;
	if (contact.type.toString().equalsIgnoreCase("PERSON"))
	    ActivityUtil.createContactActivity(ActivityType.CONTACT_CREATE, contact, owner_name, "", "Contact Created");

	if (contact.type.toString().equalsIgnoreCase("COMPANY"))
	    ActivityUtil.createContactActivity(ActivityType.COMPANY_CREATE, contact, owner_name, "", "Company Created");
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
     * creates activity when adding tag from contact details page
     * 
     * @param contact
     * @throws JSONException
     */
    public static void createTagAddActivityWhenContactUpdated(Contact contact) throws JSONException
    {

	JSONObject js = new JSONObject(new Gson().toJson(contact));
	JSONArray jsn = js.getJSONArray("tagsWithTime");
	ArrayList<String> tag = new ArrayList<String>();
	if (contact.id != null)
	{
	    Contact old_contact = ContactUtil.getContact(contact.id);
	    ArrayList<Tag> old_tags = new ArrayList<>();
	    if (old_contact != null)
	    {
		old_tags = old_contact.getTagsList();
	    }
	    else if (old_contact == null)
	    {
		return;
	    }
	    JSONArray jsarray = new JSONArray();
	    List<String> old_tag_list = new ArrayList<>();
	    if (old_tags.size() > 0)
	    {
		for (int i = 0; i <= old_tags.size() - 1; i++)
		{
		    old_tag_list.add(old_tags.get(i).tag);
		}

	    }
	    if (jsn != null && jsn.length() > 0)
	    {
		for (int i = 0; i <= jsn.length() - 1; i++)
		{
		    JSONObject tagobj = jsn.getJSONObject(i);
		    jsarray.put(tagobj.getString("tag"));
		}

	    }
	    JSONArray _tags_difference = getDifferedStrings(old_tag_list, jsarray);

	    if (_tags_difference != null && _tags_difference.length() > 0)
	    {
		if (old_tags.size() < jsn.length())
		    ActivityUtil.createContactActivity(ActivityType.TAG_ADD, contact, _tags_difference.toString(), "",
			    "tag Added");
		if (old_tags.size() > jsn.length())
		    ActivityUtil.createContactActivity(ActivityType.TAG_REMOVE, contact, _tags_difference.toString(),
			    "", "tag Removed");
	    }
	}
    }

    /**
     * creates activity log when contact owner changed from contact details
     * page.
     * 
     * @param contact
     * @param new_owner_id
     */
    public static void contactOwnerChangeActivity(Contact updatedcontact, String old_owner_name)
    {
	String contact_owner_name = updatedcontact.getOwner().name;

	ActivityUtil.createContactActivity(ActivityType.CONTACT_OWNER_CHANGE, updatedcontact, contact_owner_name,
	        old_owner_name, "Contact Owner Change");
    }

    /**
     * method used to create bulk delete activity takes place in task and deal
     * 
     * @param entitytype
     *            dynamically stores either task or deal
     * @param new_data
     * @param old_data
     * @param changed_field
     * @throws JSONException
     */
    public static void createLogForBulkDeletes(EntityType entitytype, JSONArray delete_entity_ids, String no,
	    String changed_field) throws JSONException
    {
	List<String> delete_entity_names = new ArrayList<>();

	String deleteed_names = "";
	if (delete_entity_ids.length() > 100)
	{
	    ActivityUtil.createBulkDeleteActivity(entitytype, no, "", changed_field);
	}
	else
	{

	    if (entitytype == EntityType.TASK)
	    {
		delete_entity_names = ActivityUtil.getTaskNames(delete_entity_ids);
		deleteed_names = delete_entity_names.toString();
	    }
	    else if (entitytype == EntityType.EVENT)
	    {
		delete_entity_names = ActivityUtil.getEventNames(delete_entity_ids);
		deleteed_names = delete_entity_names.toString();
	    }
	    else if (entitytype == EntityType.DOCUMENT)
	    {
		delete_entity_names = ActivityUtil.getDocumentNames(delete_entity_ids);
		deleteed_names = delete_entity_names.toString();
	    }
	    else if (entitytype == EntityType.DEAL)
	    {
		delete_entity_names = ActivityUtil.getDealNames(delete_entity_ids);
		deleteed_names = delete_entity_names.toString();
	    }
	    else if (entitytype == EntityType.CAMPAIGN)
	    {
		delete_entity_names = ActivityUtil.getWorkFlowNames(delete_entity_ids);
		deleteed_names = delete_entity_names.toString();
	    }
	    ActivityUtil.createBulkDeleteActivity(entitytype, no,
		    deleteed_names.substring(1, deleteed_names.length() - 1), changed_field);
	}
    }

    /**
     * creates BULK_ACTION actiivity to a bulk contacts
     * 
     * @param contactids
     *            list of contact ids from bulkaction.js
     * @param actiontype
     *            action_type might be TAG_ADD,TAG_REMOVE,ADD_TO_CAMPAIGn etc..
     * 
     * 
     * @param data
     * @throws JSONException
     * 
     */
    public static void createBulkActionActivity(int contactidscount, String actiontype, String data, String label,
	    String bulk_email_subject) throws JSONException
    {

	ActivityUtil.createBulkActionActivity(actiontype, data, String.valueOf(contactidscount), label,
	        bulk_email_subject, EntityType.CONTACT);

    }

    /**
     * creates bulk action activity for deals
     * 
     * @param dealidscount
     * @param actiontype
     * @param data
     * @param label
     * @param bulk_email_subject
     * @throws JSONException
     */

    public static void createBulkActionActivityForDeals(int dealidscount, String actiontype, String data, String label,
	    String bulk_email_subject) throws JSONException
    {

	ActivityUtil.createBulkActionActivity(actiontype, data, String.valueOf(dealidscount), label,
	        bulk_email_subject, EntityType.DEAL);

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
     * used to fetch the the contacts which are removed from related to field.
     * 
     * @param oldcont
     *            contactids which were saved in db
     * @param ar
     *            latest contacts which comes along with new document object for
     *            saving
     * @return
     * @throws JSONException
     */
    public static JSONArray removedContacts(List<String> oldcont, JSONArray ar) throws JSONException
    {
	JSONArray jsn = new JSONArray();
	for (int i = 0; i <= ar.length() - 1; i++)
	{
	    if (oldcont.contains(ar.get(i)))
	    {
		oldcont.remove(ar.get(i));

	    }

	}

	List<String> removedcontacts = oldcont;

	if (removedcontacts != null && removedcontacts.size() > 0)
	{

	    for (int k = 0; k < removedcontacts.size(); k++)
	    {
		jsn.put(removedcontacts.get(k));

	    }
	}

	return jsn;

    }

    /**
     * used to fetch the the contacts which are removed from related to field.
     * 
     * @param oldcont
     *            contactids which were saved in db
     * @param ar
     *            latest contacts which comes along with new document object for
     *            saving
     * @return
     * @throws JSONException
     */
    public static JSONArray removedContactsFromDocument(List<String> oldcont, JSONArray ar) throws JSONException
    {
	JSONArray jsn = new JSONArray();
	for (int i = 0; i <= ar.length() - 1; i++)
	{
	    if (oldcont.contains(ar.get(i)))
	    {
		oldcont.remove(ar.get(i));

	    }

	}

	List<String> removedcontacts = oldcont;

	if (removedcontacts != null && removedcontacts.size() > 0)
	{

	    for (int k = 0; k < removedcontacts.size(); k++)
	    {
		Contact con = ContactUtil.getContact(Long.parseLong(removedcontacts.get(k)));
		if (con != null)
		{
		    jsn.put(removedcontacts.get(k));

		}

	    }
	}
	return jsn;
    }

    /**
     * used to fetch the the contacts which are added to related to field.
     * 
     * @param oldcont
     *            contactids which were saved in db
     * @param ar
     *            latest contacts which comes along with new document object for
     *            saving
     * @return
     * @throws JSONException
     */
    public static JSONArray addedContacts(List<String> oldcont, JSONArray ar) throws JSONException
    {
	JSONArray jsn = new JSONArray();
	for (int i = 0; i <= ar.length() - 1; i++)
	{
	    if (!oldcont.contains(ar.get(i)))
		jsn.put(ar.get(i));

	}

	return jsn;

    }

    /**
     * returns the JSONArray from List
     * 
     * @param ids
     * @return
     * @throws JSONException
     */
    public static JSONArray getJsonArrayOfIdFromList(List<String> ids) throws JSONException
    {
	JSONArray jsn1 = new JSONArray();
	for (int i = 0; i <= ids.size() - 1; i++)
	{
	    String s1 = ids.get(i);
	    jsn1.put(s1);

	}

	return jsn1;

    }

    /**
     * returns the JSONArray from List
     * 
     * @param ids
     * @return
     * @throws JSONException
     */
    public static JSONArray getJsonArrayOfIdFromListForDocument(List<String> ids) throws JSONException
    {
	JSONArray jsn1 = new JSONArray();
	for (int i = 0; i <= ids.size() - 1; i++)
	{
	    String s1 = ids.get(i);
	    Contact con = ContactUtil.getContact(Long.parseLong(s1));
	    if (con != null)
		jsn1.put(s1);

	}

	return jsn1;

    }

    /**
     * common method converts json array into list
     * 
     * @param js
     *            json array of contact ids
     * @return
     * @throws JSONException
     */
    public static List<String> getContactids(JSONArray js) throws JSONException
    {
	List<String> list = new ArrayList<>();
	for (int i = 0; i <= js.length() - 1; i++)
	{
	    list.add(js.getString(i));
	}
	return list;
    }

    /**
     * returns jsonarray of contactnames
     * 
     * @param js
     *            array of contactids
     * @return
     * @throws JSONException
     */
    public static List<String> getContactNames(JSONArray js) throws JSONException
    {
	List<String> list = new ArrayList<>();
	String contact_name = "";
	for (int i = 0; i <= js.length() - 1; i++)
	{

	    if (js.get(i) != null)
	    {
		Contact contact = ContactUtil.getContact(Long.parseLong(js.get(i).toString()));
		if (contact != null && contact.type == contact.type.PERSON)
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
		    if (firstname == null && lastname == null)
		    {
			ContactField email = contact.getContactFieldByName("email");
			if (email != null)
			{
			    contact_name = email.value;
			}
			else
			{
			    List<ContactField> confield = contact.properties;
			    for (int k = 0; k <= confield.size() - 1; k++)
			    {
				ContactField field = confield.get(k);
				if (field != null)
				{
				    if (field.value != null)
				    {
					contact_name = field.value;
					break;
				    }
				}

			    }

			}

		    }

		    list.add(contact_name.trim());
		    contact_name = "";
		}
		else if (contact != null && contact.type == contact.type.COMPANY)
		{
		    ContactField name = contact.getContactFieldByName("name");

		    contact_name = name.value;
		    list.add(contact_name.trim());
		    contact_name = "";
		}
	    }

	}
	return list;
    }

    /**
     * checks either contact exists or not
     * 
     * returns json array
     * 
     * @param jsn
     *            all conatct ids
     * @return
     * @throws JSONException
     */
    public static JSONArray getExistingContactsJsonArray(JSONArray jsn) throws JSONException
    {

	JSONArray jsnarray = new JSONArray();
	if (jsn == null && jsn.length() > 0)
	{
	    return null;
	}
	for (int i = 0; i <= jsn.length() - 1; i++)
	{
	    Contact contact = ContactUtil.getContact(jsn.getLong(i));
	    if (contact != null)
	    {
		jsnarray.put(jsn.getLong(i));
	    }
	}
	return jsnarray;

    }

    /**
     * compares the list and json array common elements will be removed
     * 
     * @param old
     *            list of old contact ids
     * @param newone
     *            list new contacts from new json
     * @return deferred strings as a json array
     * @throws JSONException
     */
    public static JSONArray getDifferedStrings(List<String> old, JSONArray newone) throws JSONException
    {
	JSONArray jsadd = new JSONArray();
	List<String> newone_list = getContactids(newone);
	if (newone != null)
	{
	    if (old.size() < newone.length())
	    {
		for (int i = 0; i <= newone.length() - 1; i++)
		{
		    if (!old.contains(newone.get(i)))
		    {
			jsadd.put(newone.get(i));
		    }

		}
	    }
	    else if (old.size() > newone.length())
	    {
		for (int i = 0; i <= old.size() - 1; i++)
		{
		    if (!newone_list.contains(old.get(i)))
		    {
			jsadd.put(old.get(i));
		    }

		}
	    }
	}
	return jsadd;
    }

    /**
     * return the string with out html tags
     * 
     * @param html
     * @return
     */
    public static String html2text(String html)
    {
	return Jsoup.parse(html).text();
    }

}