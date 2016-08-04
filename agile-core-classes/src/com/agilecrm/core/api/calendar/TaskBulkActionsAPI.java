package com.agilecrm.core.api.calendar;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

@Path("/api/bulkTask")
public class TaskBulkActionsAPI {
	@Path("/ChangeStatus")
	@POST
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED,
			MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Task> changeBulkTaskStatusProperty(
			@FormParam("data") String data) {
		try {
			String ownerId = null;
			JSONObject json = new JSONObject(data);
			JSONObject priority = json.getJSONObject("priority");
			String newProperty = priority.getString("status");
			ArrayList<String> taskIdList = new ArrayList<String>();
			List<Task> subList = new ArrayList<Task>();
			com.google.appengine.labs.repackaged.org.json.JSONArray taskIdArray = null;
			if(json.has("IdJson")&& !json.get("IdJson").equals(null) && !json.get("IdJson").equals("null") && json.get("IdJson") != "")		
				taskIdArray = json.getJSONArray("IdJson");
			if (taskIdArray != null) {
				for (int i = 0; i < taskIdArray.length(); i++) {
					try {
						Task task = null;
						Long id = taskIdArray.getLong(i);
						task = TaskUtil.getTask(id);
						task.status = Task.Status.valueOf(newProperty);
						task.is_complete = false ;
						if(task.status.equals(Task.Status.COMPLETED))
							task.is_complete = true ; 
						else if(task.status.equals(Task.Status.IN_PROGRESS)){
							if(priority.has("progress") && priority.get("progress")!= null)
								task.progress = priority.getInt("progress") ;
						}
						subList.add(task);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					if (subList.size() >= 100) {
						Task.dao.putAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.putAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(taskIdArray.length(), "BULK_TASK_CHANGE_STATUS", newProperty, "tasks", "");

			} else {
				boolean pending = json.getBoolean("pending");String criteria = null ;String type = null;
				if (json.has("ownerId") && !json.get("ownerId").equals(null) && !json.get("ownerId").equals("null") && json.get("ownerId") != "")
					ownerId = json.getString("ownerId");
				if (json.has("criteria") && !json.get("criteria").equals(null) && !json.get("criteria").equals("null"))
					criteria = json.getString("criteria");
				if (json.has("type") && !json.get("type").equals(null) && !json.get("type").equals("null"))
					type = json.getString("type");
				List<Task> tasks = TaskUtil.getTasksRelatedToOwnerOfType(
						criteria, type, ownerId, pending, null, null);
				for (Task task : tasks) {
					task.status = Task.Status.valueOf(newProperty);
					task.is_complete = false ;
					if(task.status.equals(Task.Status.COMPLETED))
						task.is_complete = true ; 
					else if(task.status.equals(Task.Status.IN_PROGRESS)){
						if(priority.has("progress") && priority.get("progress")!= null)
							task.progress = priority.getInt("progress") ;
					}
					subList.add(task);
					if (subList.size() >= 100) {
						Task.dao.putAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.putAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(tasks.size(), "BULK_TASK_CHANGE_STATUS", newProperty, "tasks", "");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Path("/ChangePriority")
	@POST
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED,
			MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Task> changeBulkTaskPriorityProperty(
			@FormParam("data") String data) {
		try {
			String ownerId = null;
			JSONObject json = new JSONObject(data);
			JSONObject priority = json.getJSONObject("priority");
			String newProperty = priority.getString("priority_type");
			ArrayList<String> taskIdList = new ArrayList<String>();
			List<Task> subList = new ArrayList<Task>();
			com.google.appengine.labs.repackaged.org.json.JSONArray taskIdArray = null;
			if(json.has("IdJson")&& !json.get("IdJson").equals(null) && !json.get("IdJson").equals("null") && json.get("IdJson") != "")		
				taskIdArray = json.getJSONArray("IdJson");
			if (taskIdArray != null) {
				for (int i = 0; i < taskIdArray.length(); i++) {
					try {
						Task task = null;
						Long id = taskIdArray.getLong(i);
						task = TaskUtil.getTask(id);
						task.priority_type = Task.PriorityType
								.valueOf(newProperty);
						subList.add(task);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					if (subList.size() >= 100) {
						Task.dao.putAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.putAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(taskIdArray.length(), "BULK_TASK_CHANGE_PRIORITY", newProperty, "tasks", "");
			} else {
				boolean pending = json.getBoolean("pending");String criteria = null ;String type = null;
				if (json.has("ownerId") && !json.get("ownerId").equals(null) && !json.get("ownerId").equals("null") && json.get("ownerId") != "")
					ownerId = json.getString("ownerId");
				if (json.has("criteria") && !json.get("criteria").equals(null) && !json.get("criteria").equals("null"))
					criteria = json.getString("criteria");
				if (json.has("type") && !json.get("type").equals(null) && !json.get("type").equals("null"))
					type = json.getString("type");
				List<Task> tasks = TaskUtil.getTasksRelatedToOwnerOfType(
						criteria, type, ownerId, pending, null, null);
				for (Task task : tasks) {
					task.priority_type = Task.PriorityType.valueOf(newProperty);
					subList.add(task);
					if (subList.size() >= 100) {
						Task.dao.putAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.putAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(tasks.size(), "BULK_TASK_CHANGE_PRIORITY", newProperty, "tasks", "");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Path("/ChangeOwner")
	@POST
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED,
			MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Task> changeBulkTaskOwnerProperty(@FormParam("data") String data) {
		try {
			String ownerId = null;
			JSONObject json = new JSONObject(data);
			JSONObject priority = json.getJSONObject("priority");
			String newOwnerId = priority.getString("owner_id");
			String owner_name = DomainUserUtil.getDomainUser(Long.parseLong(newOwnerId)).name;
			ArrayList<String> taskIdList = new ArrayList<String>();
			List<Task> subList = new ArrayList<Task>();
			com.google.appengine.labs.repackaged.org.json.JSONArray taskIdArray = null;
			if(json.has("IdJson")&& !json.get("IdJson").equals(null) && !json.get("IdJson").equals("null") && json.get("IdJson") != "")		
				taskIdArray = json.getJSONArray("IdJson");
			if (taskIdArray != null) {
				for (int i = 0; i < taskIdArray.length(); i++) {

					try {
						Task task = null;
						Long id = taskIdArray.getLong(i);
						task = TaskUtil.getTask(id);
						task.owner_id = newOwnerId;
						subList.add(task);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					if (subList.size() >= 100) {
						Task.dao.putAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.putAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(taskIdArray.length(), "BULK_TASK_CHANGE_OWNER", owner_name, "tasks", "");
			} else {
				boolean pending = json.getBoolean("pending");String criteria = null ;String type = null;
				if (json.has("ownerId") && !json.get("ownerId").equals(null) && !json.get("ownerId").equals("null") && json.get("ownerId") != "")
					ownerId = json.getString("ownerId");
				if (json.has("criteria") && !json.get("criteria").equals(null) && !json.get("criteria").equals("null"))
					criteria = json.getString("criteria");
				if (json.has("type") && !json.get("type").equals(null) && !json.get("type").equals("null"))
					type = json.getString("type");
				List<Task> tasks = TaskUtil.getTasksRelatedToOwnerOfType(
						criteria, type, ownerId, pending, null, null);
				for (Task task : tasks) {

					task.owner_id = newOwnerId;
					subList.add(task);
					if (subList.size() >= 100) {
						Task.dao.putAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.putAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(tasks.size(), "BULK_TASK_CHANGE_OWNER", owner_name, "tasks", "");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Path("/ChangeDuedate")
	@POST
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED,
			MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Task> changeBulkTaskDuedateProperty(
			@FormParam("data") String data) {
		try {
			String ownerId = null;
			JSONObject json = new JSONObject(data);
			JSONObject priority = json.getJSONObject("priority");
			Long newDue = priority.getLong("due");
			ArrayList<String> taskIdList = new ArrayList<String>();
			List<Task> subList = new ArrayList<Task>();
			com.google.appengine.labs.repackaged.org.json.JSONArray taskIdArray = null;
			if(json.has("IdJson")&& !json.get("IdJson").equals(null) && !json.get("IdJson").equals("null") && json.get("IdJson") != "")		
				taskIdArray = json.getJSONArray("IdJson");
			if (taskIdArray != null) {
				for (int i = 0; i < taskIdArray.length(); i++) {
					try {
						Task task = null;
						Long id = taskIdArray.getLong(i);
						task = TaskUtil.getTask(id);
						task.due = newDue;
						subList.add(task);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					if (subList.size() >= 100) {
						Task.dao.putAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.putAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(taskIdArray.length(), "BULK_TASK_CHANGE_DUEDATE", "", "tasks", "");

			} else {
				boolean pending = json.getBoolean("pending");String criteria = null ;String type = null;
				if (json.has("ownerId") && !json.get("ownerId").equals(null) && !json.get("ownerId").equals("null") && json.get("ownerId") != "")
					ownerId = json.getString("ownerId");
				if (json.has("criteria") && !json.get("criteria").equals(null) && !json.get("criteria").equals("null"))
					criteria = json.getString("criteria");
				if (json.has("type") && !json.get("type").equals(null) && !json.get("type").equals("null"))
					type = json.getString("type");
				List<Task> tasks = TaskUtil.getTasksRelatedToOwnerOfType(
						criteria, type, ownerId, pending, null, null);
				for (Task task : tasks) {

					task.due = newDue;
					subList.add(task);
					if (subList.size() >= 100) {
						Task.dao.putAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.putAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(tasks.size(), "BULK_TASK_CHANGE_DUEDATE", "", "tasks", "");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	@Path("/Delete")
	@POST
	@Consumes({ MediaType.APPLICATION_FORM_URLENCODED,
			MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Task> bulkTaskDelete(
			@FormParam("data") String data) {
		try {
			String ownerId = null;
			JSONObject json = new JSONObject(data);
			ArrayList<String> taskIdList = new ArrayList<String>();
			List<Task> subList = new ArrayList<Task>();
			com.google.appengine.labs.repackaged.org.json.JSONArray taskIdArray = null;
			if(json.has("IdJson")&& !json.get("IdJson").equals(null) && !json.get("IdJson").equals("null") && json.get("IdJson") != "")		
				taskIdArray = json.getJSONArray("IdJson");
			if (taskIdArray != null) {
				for (int i = 0; i < taskIdArray.length(); i++) {
					try {
						Task task = null;
						Long id = taskIdArray.getLong(i);
						task = TaskUtil.getTask(id);
						subList.add(task);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					if (subList.size() >= 100) {
						Task.dao.deleteAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.deleteAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(taskIdArray.length(), "BULK_TASK_DELETE", "", "tasks", "");
			} else {
				boolean pending = json.getBoolean("pending");String criteria = null ;String type = null;
				if (json.has("ownerId") && !json.get("ownerId").equals(null) && !json.get("ownerId").equals("null") && json.get("ownerId") != "")
					ownerId = json.getString("ownerId");
				if (json.has("criteria") && !json.get("criteria").equals(null) && !json.get("criteria").equals("null"))
					criteria = json.getString("criteria");
				if (json.has("type") && !json.get("type").equals(null) && !json.get("type").equals("null"))
					type = json.getString("type");
				List<Task> tasks = TaskUtil.getTasksRelatedToOwnerOfType(
						criteria, type, ownerId, pending, null, null);
				for (Task task : tasks) {
					subList.add(task);
					if (subList.size() >= 100) {
						Task.dao.deleteAll(subList);
						subList.clear();
					}
				}
				if (!subList.isEmpty()) {
					Task.dao.deleteAll(subList);
				}
				ActivitySave.createBulkActionActivityForTasks(tasks.size(), "BULK_TASK_DELETE", "", "tasks", "");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
