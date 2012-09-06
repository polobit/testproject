package com.agilecrm.core.api.calendar;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.activities.Task;

@Path("/api/tasks")
public class TasksAPI
{

    // Tasks
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getOverdueTasks()
    {
	try
	{
	    return Task.getAllPendingTasks();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Tasks
    @Path("pending/{num-days}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Task> getPendingTasks(@PathParam("num-days") String numdays)
    {

	try
	{
	    return Task.getPendingTasks(Integer.parseInt(numdays));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Get Task
    @Path("{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Task getTask(@PathParam("id") String id)
    {
	Task task = Task.getTask(Long.parseLong(id));
	return task;
    }

    // Delete Task
    @Path("{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteTask(@PathParam("id") String id)
    {
	try
	{
	    Task task = Task.getTask(Long.parseLong(id));
	    if (task != null)
		task.delete();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    // New Task
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Task createTask(Task task)
    {
	task.save();
	return task;
    }

    // Update Task
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Task updateTask(Task task)
    {
	task.save();
	return task;
    }
}