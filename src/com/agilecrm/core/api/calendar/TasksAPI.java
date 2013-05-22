package com.agilecrm.core.api.calendar;

import java.io.IOException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.Task.Type;
import com.agilecrm.activities.TaskReminder;
import com.agilecrm.activities.util.TaskUtil;

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
	try
	{
	    Task task = TaskUtil.getTask(id);
	    if (task != null)
		task.delete();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
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
	task.save();
	return task;
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
	task.save();
	return task;
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
    public void deleteContacts(@FormParam("ids") String model_ids)
	    throws JSONException
    {
	JSONArray tasksJSONArray = new JSONArray(model_ids);

	Task.dao.deleteBulkByIds(tasksJSONArray);
    }

    @Path("remainder")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void taskRemaider()
    {
	try
	{
	    TaskReminder.dailyTaskReminder();
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	}
    }

    @Path("/my/tasks")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getDealsRelatedToCurrentUser()
    {
	return TaskUtil.getTasksRelatedToCurrentUser();
    }

    /**
     * Gets all task based on type
     * 
     * @param type
     * @return {@link Task}
     */
    @Path("{type}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getCategoryBasedTask(@PathParam("type") Type type)
    {
	return TaskUtil.getCategoryTask(type);
    }
}