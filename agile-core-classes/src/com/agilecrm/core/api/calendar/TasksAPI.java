package com.agilecrm.core.api.calendar;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.simple.JSONObject;

import com.agilecrm.UpdateRelatedEntitiesUtil;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.projectedpojos.ContactPartial;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * <code>TaskAPI</code> includes REST calls to interact with {@link Task} class
 * to initiate Task CRUD operations
 * <p>
 * It is called from client side to create, update, fetch and delete the tasks.
 * It also interacts with {@link TaskUtil} class to fetch the data of Task class
 * from database.
 * </p>
 * 
 * @author Rammohan
 * 
 */
@Path("/api/tasks")
public class TasksAPI
{

    /**
     * Gets all pending tasks
     * 
     * @return List of pending tasks
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getOverdueTasks()
    {
	try
	{
	    return TaskUtil.getAllPendingTasks();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all tasks of ANY priority, category, related to and status.
     * 
     * @return List of all tasks
     */
    @Path("/all")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getAllTasks()
    {
	try
	{
	    return TaskUtil.getAllTasks();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all tasks of ANY priority, category, related to and status.
     * 
     * @return List of all tasks
     */
    @Path("/allpending")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getAllPendingTasks()
    {
	try
	{
	    return TaskUtil.getPendingTasksForAllUser();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets the tasks which have been pending for particular no.of days
     * 
     * @param numdays
     *            Days of pending
     * @return List of pending tasks have been pending for particular no.of days
     */
    @Path("pending/{num-days}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getPendingTasks(@PathParam("num-days") String numdays)
    {
	try
	{
	    return TaskUtil.getPendingTasks(Integer.parseInt(numdays));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets a task based on id
     * 
     * @param id
     *            unique id of task
     * @return {@link Task}
     */
    @Path("{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Task getTask(@PathParam("id") Long id)
    {
	Task task = TaskUtil.getTask(id);
	System.out.println("task id " + task);
	return task;
    }

    /**
     * Gets a task based on id
     * 
     * @param id
     *            unique id of task
     * @return {@link Task}
     */
    @Path("/getTaskObject/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public Task getTaskForActivity(@PathParam("id") Long id)
    {
	Task task = TaskUtil.getTask(id);
	System.out.println("task id " + task);
	return task;
    }

    /**
     * Deletes a task based on id
     * 
     * @param id
     *            unique id of task
     */
    @Path("{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteTask(@PathParam("id") Long id)
    {
	Task task = TaskUtil.getTask(id);
    if (task != null)
    {
    List<ContactPartial> contList = task.getContacts();
	List<String> conIds = new ArrayList<String>();
	for(ContactPartial con : contList)
	{
		conIds.add(String.valueOf(con.id));
	}
	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
	{
		throw new AccessDeniedException("Task cannot be deleted because you do not have permission to update associated contact.");
	}
	
	List<String> dealIds = task.getDeal_ids();
	List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
	if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
	{
		throw new AccessDeniedException("Task cannot be deleted because you do not have permission to update associated deal.");
	}
	
	try
	{
		ActivitySave.createTaskDeleteActivity(task);
		if (!task.getNotes(id).isEmpty())
		    NoteUtil.deleteBulkNotes(task.getNotes(id));
		
		List<Contact> relatedContactsList = task.relatedContacts();
		List<Opportunity> relatedDealsList = task.relatedDeals();
		
		UpdateRelatedEntitiesUtil.updateRelatedContacts(relatedContactsList, conIds);
		
		UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIds);
		
		task.delete();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
    }

    /**
     * Saves new task
     * 
     * @param task
     *            {@link Task}
     * @return {@link Task}
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Task createTask(Task task)
    {
	List<String> conIds = task.contacts;
    List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    {
    	throw new AccessDeniedException("Task cannot be created because you do not have permission to update associated contact(s).");
    }
    
    List<String> dealIds = task.getDeal_ids();
    List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
    if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
    {
    	throw new AccessDeniedException("Task cannot be created because you do not have permission to update associated deal(s).");
    }
    
	task.save();
	try
	{
	    ActivitySave.createTaskAddActivity(task);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	
	List<Contact> relatedContactsList = task.relatedContacts();
	List<Opportunity> relatedDealsList = task.relatedDeals();
	
	UpdateRelatedEntitiesUtil.updateRelatedContacts(relatedContactsList, conIds);
	
	UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIds);
	
	return TaskUtil.getTask(task.id);
    }

    /**
     * Updates the existing task
     * 
     * @param task
     *            {@link Task}
     * @return {@link Task}
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Task updateTask(Task task)
    {
    	Task oldTask = TaskUtil.getTask(task.id);
    	List<String> oldConIds = new ArrayList<String>();
    	List<String> oldDealIds = new ArrayList<String>();
        if(oldTask != null)
        {
        	List<ContactPartial> contList = oldTask.getContacts();
        	List<String> conIds = new ArrayList<String>();
        	for(ContactPartial con : contList)
        	{
        		conIds.add(String.valueOf(con.id));
        	}
        	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
        	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
        	{
        		throw new AccessDeniedException("Task cannot be updated because you do not have permission to update associated contact(s).");
        	}
        	
        	List<String> dealIds = oldTask.getDeal_ids();
        	List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
        	if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
        	{
        		throw new AccessDeniedException("Task cannot be updated because you do not have permission to update associated deal(s).");
        	}
        	oldConIds.addAll(conIds);
        	oldDealIds.addAll(dealIds);
        }
    	List<String> conIds = task.contacts;
    	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    	{
    		throw new AccessDeniedException("Task cannot be updated because you do not have permission to update associated contact(s).");
    	}
    	
    	List<String> dealIds = task.getDeal_ids();
    	List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
    	if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
    	{
    		throw new AccessDeniedException("Task cannot be updated because you do not have permission to update associated deal(s).");
    	}
    	
	  try
		{
		    ActivitySave.createTaskEditActivity(task);
		}
		catch (JSONException e)
		{
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		}
    task.save();
    
    List<Contact> relatedContactsList = new ArrayList<Contact>();
	List<Opportunity> relatedDealsList = new ArrayList<Opportunity>();
    if(oldTask != null){
    	relatedContactsList = oldTask.relatedContacts();
    	relatedDealsList = oldTask.relatedDeals();
    }    
    List<Contact> relatedConList = task.relatedContacts();
	List<Opportunity> relatedDeList = task.relatedDeals();
	
	if(relatedConList != null && relatedConList.size() > 0)
	{
		relatedContactsList.addAll(relatedConList);
	}
	if(relatedDeList != null && relatedDeList.size() > 0)
	{
		relatedDealsList.addAll(relatedDeList);
	}
	
	conIds.addAll(oldConIds);
	dealIds.addAll(oldDealIds);
	
	UpdateRelatedEntitiesUtil.updateRelatedContacts(relatedContactsList, conIds);
	
	UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIds);
    
	return TaskUtil.getTask(task.id);
    }

    /**
     * Deletes tasks bulk
     * 
     * @param model_ids
     *            task ids, read as form parameter from request url
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_JSON })
    public List<String> deleteContacts(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray tasksJSONArray = new JSONArray(model_ids);
	JSONArray tasksArray = new JSONArray();
	List<String> contactIdsList = new ArrayList<String>();
	 if(tasksJSONArray!=null && tasksJSONArray.length()>0){		 
		 try {
			for (int i = 0; i < tasksJSONArray.length(); i++) {
				 String taskId = tasksJSONArray.getString(i);
				 Task task = TaskUtil.getTask(Long.parseLong(taskId));
				 List<ContactPartial> contactsList = task.getContacts();
				 List<String> conIds = new ArrayList<String>();
				 for(ContactPartial cont : contactsList)
				 {
					 conIds.add(String.valueOf(cont.id));
				 }
		    	 List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
		    	 
		    	 if(conIds == null || modifiedConIds == null || conIds.size() == modifiedConIds.size())
		    	 {
		    		 tasksArray.put(tasksJSONArray.getString(i));
		    		 contactIdsList.addAll(modifiedConIds);
		    	 }
				
		    	List<String> dealIds = task.getDeal_ids();
		    	
		    	List<Contact> relatedContactsList = task.relatedContacts();
	    		List<Opportunity> relatedDealsList = task.relatedDeals();
	    		
	    		UpdateRelatedEntitiesUtil.updateRelatedContacts(relatedContactsList, conIds);
	    		
	    		UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIds);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
     }
	ActivitySave.createLogForBulkDeletes(EntityType.TASK, tasksArray, String.valueOf(tasksArray.length()),
		"");
	Task.dao.deleteBulkByIds(tasksArray);
	return contactIdsList;
    }

    /**
     * To represent Tasks on DashBoard
     * 
     * @return Task list
     */
    @Path("/my/dashboardtasks")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getDashboardTasksToCurrentUser()
    {
	System.out.println("current user pending tasks api called");
	// return TaskUtil.getAllPendingTasks();
	return TaskUtil.getAllPendingTasksForCurrentUser();
    }

    /**
     * To list pending Tasks on task list
     * 
     * @return Task list
     */
    @Path("/my/pendingtasks")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getPendingTasksForCurrentUser()
    {
	System.out.println("current user pending tasks api called");
	return TaskUtil.getPendingTasksForCurrentUser();
    }

    /**
     * All tasks related to current user
     * 
     * @return tasks list
     */
    @Path("/my/tasks")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getTasksRelatedToCurrentUser()
    {
	return TaskUtil.getTasksRelatedToCurrentUser();
    }

    /**
     * Completes tasks bulk
     * 
     * @param model_ids
     *            task ids, read as form parameter from request url
     * @throws JSONException
     */
    @Path("bulk/complete")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void completeBulkTask(List<Task> tasks) throws JSONException
    {
	TaskUtil.completeBulkTasks(tasks);
    }

    /**
     * Gets all task based on owner and type
     * 
     * @param type
     * @return {@link Task}
     */
    @Path("/based")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Task> getTasksBasedOnOwnerOfType(@QueryParam("criteria") String criteria,
	    @QueryParam("type") String type, @QueryParam("owner") String owner, @QueryParam("pending") boolean pending,
	    @QueryParam("cursor") String cursor, @QueryParam("page_size") String count) throws Exception
    {
	if (count != null)
	{
		
	    return TaskUtil.getTasksRelatedToOwnerOfType(criteria, type, owner, pending, Integer.parseInt(count),
		    cursor);
	}

	return TaskUtil.getTasksRelatedToOwnerOfType(criteria, type, owner, pending, null, null);
    }

    @Path("/stats")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getTaskStatOfOwner(@QueryParam("owner") String owner)
    {
	return TaskUtil.getStats(owner).toString();
    }

    /**
     * Saves new task using the Contacts Email.
     * 
     * @param task
     *            {@link Task}
     * @param email
     *            email of contact to be added to Task.
     * @return {@link Task}
     */
    @Path("/email/{email}")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Task createTaskByEmail(Task task, @PathParam("email") String email)
    {
	// Get the Contact based on the Email and assign the task to it.
	Contact contact = ContactUtil.searchContactByEmail(email);
	if (contact != null)
	{
	    task.contacts = new ArrayList<String>();
	    task.contacts.add(contact.id.toString());
	}

	task.save();
	return task;
    }

    /************************ New task view methods ******************************/
    /**
     * Gets count of task based on type of category
     * 
     * @param type
     * @return JSON object of count and type
     */
    @Path("/countoftype")
    @GET
    @Produces({ MediaType.APPLICATION_JSON + ";charset=UTF-8;", MediaType.APPLICATION_XML })
    public String getCountOfTasksCategoryType(@QueryParam("criteria") String criteria, @QueryParam("type") String type,
	    @QueryParam("owner") String owner, @QueryParam("pending") boolean pending) throws Exception
    {
	return TaskUtil.getCountOfTasksCategoryType(criteria, type, owner, pending);
    }

    /**
     * Gets all task based on due and type
     * 
     * @param type
     * @return {@link Task}
     */
    @Path("/fordue")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Task> getTasksBasedOnOwnerOfTypeAndDue(@QueryParam("criteria") String criteria,
	    @QueryParam("type") String type, @QueryParam("owner") String owner, @QueryParam("pending") boolean pending,
	    @QueryParam("cursor") String cursor, @QueryParam("page_size") String count,
	    @QueryParam("start_time") Long startTime, @QueryParam("end_time") Long endTime) throws Exception
    {
	if (count != null)
	{
	    return TaskUtil.getTasksRelatedToOwnerOfTypeAndDue(criteria, type, owner, pending, Integer.parseInt(count),
		    cursor, startTime, endTime);
	}

	return TaskUtil.getTasksRelatedToOwnerOfTypeAndDue(criteria, type, owner, pending, null, null, startTime,
		endTime);
    }

    /**
     * Gets all task based on owner and type
     * 
     * @param type
     * @return {@link Task}
     */
    @Path("/forcategory")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Task> getTasksBasedOnOwnerOfTypeAndCategory(@QueryParam("criteria") String criteria,
	    @QueryParam("type") String type, @QueryParam("owner") String owner, @QueryParam("pending") boolean pending,
	    @QueryParam("cursor") String cursor, @QueryParam("page_size") String count) throws Exception
    {
	if (count != null)
	{
	    return TaskUtil.getTasksRelatedToOwnerOfTypeAndCategory(criteria, type, owner, pending,
		    Integer.parseInt(count), cursor);
	}

	return TaskUtil.getTasksRelatedToOwnerOfTypeAndCategory(criteria, type, owner, pending, null, null);
    }

    @Path("/overdue/uptotoday")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public int getDueTaskCountUptoToday()
    {
	return TaskUtil.getOverDueTasksUptoTodayForCurrentUser();
    }

    /**
     * get all task related notes
     */
    @Path("/{task-id}/notes")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Note> getNotes(@PathParam("task-id") Long id)
    {
	try
	{
	    Task task = TaskUtil.getTask(id);
	    return task.getNotes();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * get all contacts related to task
     */
    @Path("/{task-id}/contacts")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getRelatedContacts(@PathParam("task-id") Long id)
    {
	try
	{
	    Task task = TaskUtil.getTask(id);
	    return task.relatedContacts();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
    
    
    /**
     * change task owner assign new owner to task
     */

    @Path("/change-owner/{new_owner}/{taskId}")
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Task changeTaskOwner(@PathParam("new_owner") String new_owner, @PathParam("taskId") Long taskId)
	    throws JSONException
    {

	Task task = TaskUtil.getTask(taskId);
	try
	{
	    String prevOwner = task.getTaskOwner().name;
	    String new_owner_name = DomainUserUtil.getDomainUser(Long.parseLong(new_owner)).name;
	    List<ContactPartial> contacts = task.getContacts();
	    JSONArray jsn = null;
	    if (contacts != null && contacts.size() > 0)
	    {
		jsn = ActivityUtil.getContactIdsJson(contacts);
	    }
	    ActivityUtil.createTaskActivity(ActivityType.TASK_OWNER_CHANGE, task, new_owner_name, prevOwner,
		    "owner_name", jsn);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	task.owner_id = new_owner;
	task.save();

	return task;
    }

    /**
     * get all deals related to task
     */
    @Path("/{task-id}/deals")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Opportunity> getRelatedDeals(@PathParam("task-id") Long id)
    {
	try
	{
	    Task task = TaskUtil.getTask(id);
	    return task.relatedDeals();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * All tasks by created time
     * 
     * @return tasks list
     */
    @Path("/new/tasks")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getNewTasks(@QueryParam("page_size") String count, @QueryParam("cursor") String cursor)
    {
	if (count != null)
	{
	    return TaskUtil.getNewTasks(Integer.parseInt(count), cursor);
	}

	return TaskUtil.getNewTasks(null, null);
    }

    /**
     * Updates Task.
     * 
     * @param TaskJson
     *            - Task object that is updated.
     * @return - updated Task.
     * @throws JSONException
     * @throws IOException
     * @throws JsonMappingException
     * @throws JsonParseException
     */

    @Path("/partial-update")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Task updateTaskForDeveloper(String taskJson) throws JSONException
    {

	// Get data and check if id is present
	org.json.JSONObject obj = new org.json.JSONObject(taskJson);
	List<String> contact_idList = new ArrayList<String>();
	ObjectMapper mapper = new ObjectMapper();

	if (!obj.has("id"))
	    return null;

	Task task = TaskUtil.getTask(obj.getLong("id"));

	if (task == null)
	    return null;

	Iterator<?> keys = obj.keys();

	while (keys.hasNext())
	{
	    String key = (String) keys.next();

	    if (key.equals("subject"))
		task.subject = obj.getString(key);

	    if (key.equals("type"))
		task.type = obj.getString(key);

	    if (key.equals("due"))
		task.due = obj.getLong(key);

	    if (key.equals("progress"))
		task.progress = obj.getInt(key);
	    
	    if (key.equals("status")){
		try {
		    task.status = Task.Status.valueOf(obj.getString("status"));
		} catch (Exception e) {
		    System.out.println("Status type not found");
		}
	    }
	    
	    if (key.equals("priority_type")){
		try {
		    task.priority_type = Task.PriorityType.valueOf(obj.getString("priority_type"));
		} catch (Exception e) {
		    System.out.println("PriorityType type not found");
		}
	    }
	    
	    if (key.equals("is_complete"))
		task.is_complete = obj.getBoolean(key);

	    if (key.equals("contacts"))
	    {

		// contact_ids = contact_idString.split(",");
		JSONArray contact_idJSONArray = new JSONArray(obj.getString(key));
		for (int i = 0; i < contact_idJSONArray.length(); i++)
		{
		    contact_idList.add(contact_idJSONArray.getString(i));

		}
	    }
	}

	if (contact_idList.size() > 0)
	{
	    try
	    {
		task.addContactIdsToTask(contact_idList);
	    }
	    catch (WebApplicationException e)
	    {
		return null;
	    }
	}
	else
	    task.save();

	return task;
    }
    
    /**
     * Gets all task based on due and type
     * 
     * @param type
     * @return {@link Task}
     */
    @Path("/calendar")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Task> getTasksBasedOnOwnerOfType(@QueryParam("criteria") String criteria,
	    @QueryParam("type") String type, @QueryParam("owner") String owner, @QueryParam("pending") boolean pending,
	    @QueryParam("cursor") String cursor, @QueryParam("page_size") String count,
	    @QueryParam("start_time") Long startTime, @QueryParam("end_time") Long endTime) throws Exception
    {
	if (count != null)
	{
	    return TaskUtil.getTasksRelatedToOwnerOfTypeAndDue(criteria, type, owner, pending, Integer.parseInt(count), cursor, startTime, endTime);
	}

	return TaskUtil.getTasksRelatedToOwnerOfTypeAndDue(criteria, type, owner, pending, null, null, startTime, endTime);
    }
    /***************************************************************************/
    
    /**
     * Deletes tasks bulk
     * 
     * @param model_ids
     *            task ids, read as form parameter from request url
     * @throws JSONException
     */
    @Path("delete")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_JSON })
    public void deleteTask(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray tasksJSONArray = new JSONArray(model_ids);
	if(tasksJSONArray != null)
	{
		Long id = tasksJSONArray.getLong(0);
		Task task = TaskUtil.getTask(id);
	    if (task != null)
	    {
	    List<ContactPartial> contList = task.getContacts();
		List<String> conIds = new ArrayList<String>();
		for(ContactPartial con : contList)
		{
			conIds.add(String.valueOf(con.id));
		}
		List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
		if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
		{
			throw new AccessDeniedException("Task cannot be deleted because you do not have permission to update associated contact.");
		}
		
		List<String> dealIds = task.getDeal_ids();
		List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
		if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
		{
			throw new AccessDeniedException("Task cannot be deleted because you do not have permission to update associated deal.");
		}
		
		try
		{
			ActivitySave.createTaskDeleteActivity(task);
			if (!task.getNotes(id).isEmpty())
			    NoteUtil.deleteBulkNotes(task.getNotes(id));
			
			List<Contact> relatedContactsList = task.relatedContacts();
			List<Opportunity> relatedDealsList = task.relatedDeals();
			
			UpdateRelatedEntitiesUtil.updateRelatedContacts(relatedContactsList, conIds);
			
			UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIds);
			
			task.delete();
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
	    }
	}
    }
    /**
     * Getting related contacts based on the taskid
     * @param id
     * @return
     */
    @Path("/getContactsList")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContactsObjects(String id)
    {
		try
		{
			List<Contact> list = new ArrayList<Contact>();
			JSONArray jsonArray = new JSONArray(id);
			for(int i=0;i<jsonArray.length();i++){
				Task task = TaskUtil.getTask(Long.parseLong(jsonArray.getString(i))); 
				List<Contact> listObject = task.relatedContacts(); 
				if(!listObject.isEmpty() && listObject != null && listObject.size() > 0 && !list.equals(listObject)){
						list.addAll(listObject);
				}
			}
		    return list;
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    return null;
		}
    }
    @Path("/changeBulkTasks")
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Task> changeBulkTasksAction(String data) {
        try {
        	com.google.appengine.labs.repackaged.org.json.JSONObject priority = new com.google.appengine.labs.repackaged.org.json.JSONObject();
        	com.google.appengine.labs.repackaged.org.json.JSONArray taskIdArray = new com.google.appengine.labs.repackaged.org.json.JSONArray();
        	com.google.appengine.labs.repackaged.org.json.JSONObject json = new com.google.appengine.labs.repackaged.org.json.JSONObject(data);
            System.out.println(json.toString());
            String formId =  json.getString("form_id");
            taskIdArray = json.getJSONArray("IdJson");            
            if(json.has("priority")&& !json.get("priority").equals(null))
            	priority = json.getJSONObject("priority");
            ArrayList<String> taskIdList = new ArrayList<String>();
            if (taskIdArray != null) { 
               int len = taskIdArray.length();
               for (int i=0;i<len;i++){ 
                   taskIdList.add(taskIdArray.get(i).toString());
               } 
            }
            if(taskIdList.size() > 0 && priority != null){
                List<Task> taskList= TaskUtil.changePropertyBulkTasks(taskIdList , priority , formId);
                return taskList;
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } 
        
        return null;

    }
    @Path("/bulk/changeBulkTasksProperties")
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<Task> changeBulkTasksProperties(String data) {
        try
        {
            String uri = "/core/api/bulkTask" ;
            com.google.appengine.labs.repackaged.org.json.JSONObject json = new com.google.appengine.labs.repackaged.org.json.JSONObject(data);
            String formId = json.getString("form_id");
            if(formId.equalsIgnoreCase("bulkTaskStatusForm")){
                uri = uri + "/ChangeStatus" ;
            }
            else if(formId.equalsIgnoreCase("bulkTaskPriorityForm")){
                uri = uri + "/ChangePriority" ;
            }
            else if(formId.equalsIgnoreCase("bulkTaskOwnerForm")){
                uri = uri + "/ChangeOwner" ;
            }
            else if(formId.equalsIgnoreCase("bulkTaskDeleteForm")){
                uri = uri + "/Delete" ;
            }
            else {
            	uri = uri + "/ChangeDuedate" ;
            }
            TaskUtil.postDataToTaskBackend(uri,data);
        }
        catch (Exception je)
        {
            je.printStackTrace();
        }
        
        return null;
    }
}