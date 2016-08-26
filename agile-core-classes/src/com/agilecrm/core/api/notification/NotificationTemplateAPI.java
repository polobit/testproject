package com.agilecrm.core.api.notification;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.notification.NotificationTemplate;
import com.thirdparty.push.notification.NotificationTemplateUtil;

/**
 * This <code>NotificationTemplateAPI<code> class includes REST calls to interact with {@link NotificationTemplate}
 * class to initiate NotificationTemplate CRUD operations.
 * <p>
 * It is called from client side to create, fetch, update and delete NotificationTemplates.
 * It also interact with {@link NotificationTemplate} class to fetch the data of NotificationTemplate
 * class from database.
 * 
 * @author Prashannjeet
 *
 */
@Path("/api/push/notifications")
public class NotificationTemplateAPI
{
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<NotificationTemplate> getAllNotificationTemplates()
    {
	return NotificationTemplateUtil.getAllNotificationTemplates();
    }

    @Path("/notification")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public NotificationTemplate getNotificationTemplateById(@QueryParam("notificationTemplateId") Long notificationTemplateId)
    {
    	if(NotificationTemplateUtil.getNotificationTemplateCount()==0)
    	{
    		//Create webrues for showing push model
    	}
	return NotificationTemplateUtil.getNotificationTemplateById(notificationTemplateId);
    }

    @Path("/")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public NotificationTemplate saveNotificationTemplate( NotificationTemplate notificationTemplate) throws IOException
    {
		int isDuplicate = NotificationTemplateUtil.getNotificationTemplateCountByName(notificationTemplate.notificationName);
		if (isDuplicate > 0)
		{
		    System.out.println("Duplicate Push Notification Template found");
		    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, Notification Template with the same name already exist.").build());
		}
		
		notificationTemplate.save();
	   return notificationTemplate;
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public NotificationTemplate updateNotificationTemplate(@Context HttpServletResponse response, NotificationTemplate notificationTemplate) throws IOException
    {
    	
    	int isDuplicate = NotificationTemplateUtil.getNotificationTemplateCountByName(notificationTemplate.notificationName);
		if (isDuplicate > 1)
		{
		    System.out.println("Duplicate Push Notification Template found");
		    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, Notification Template with the same name already exist.").build());
		}
		NotificationTemplate.dao.put(notificationTemplate);	   
	   return notificationTemplate;
	
    }
    
    
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteNotificationTemplate(@FormParam("ids") String model_ids) throws JSONException
    {
	try
	{
		System.out.println("Push Notification delete method calling");
		JSONArray notificationJSONArray = new JSONArray(model_ids);
	    NotificationTemplate.dao.deleteBulkByIds(notificationJSONArray);
	}
	catch (Exception e)
	{
	}
    }
    
}
