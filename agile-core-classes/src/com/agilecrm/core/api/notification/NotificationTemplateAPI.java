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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.forms.Form;
import com.agilecrm.notification.NotificationTemplate;
import com.agilecrm.notification.push.PushNotificationMessage;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.agile.PushNotification;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.google.gson.JsonObject;
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

    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public NotificationTemplate saveNotificationTemplate(@Context HttpServletResponse response, NotificationTemplate notificationTemplate) throws IOException
    {
	try
	{
	    notificationTemplate.save();
	   return notificationTemplate;
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	    response.sendError(HttpServletResponse.SC_BAD_REQUEST);
	    return null;
	}
    }

    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public NotificationTemplate updateNotificationTemplate(@Context HttpServletResponse response, NotificationTemplate notificationTemplate) throws IOException
    {
	try
	{
		NotificationTemplate.dao.put(notificationTemplate);
		System.out.println("notification update method is calling");
	   
	   return notificationTemplate;
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	    response.sendError(HttpServletResponse.SC_BAD_REQUEST);
	    return null;
	}
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
    
    @Path("/preview")
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void previewNotificationTemplate(String notification ) throws IOException
    {
	try
	{
	    System.out.println("Notification Titleee "+notification);
	    JSONObject json = new JSONObject(notification);
	    
	    String browser_id = json.getString("browserId");
	    
	    if(StringUtils.isBlank(browser_id))
	    	return;
	    
	  //Creating a push notification message object for store in datastore
    	
    	JSONObject notification_message = new JSONObject();
    	notification_message.put(PushNotification.NOTIFICATION_TITLE_VALUE, json.getString("notificationTitle"));
    	notification_message.put(PushNotification.NOTIFICATION_MESSAGE_VALUE, json.getString("notificationMessage"));
    	notification_message.put(PushNotification.NOTIFICATION_LINK_URL_VALUE, json.getString("notificationLink"));
    	notification_message.put(PushNotification.NOTIFICATION_ICON_URL_VALUE, json.getString("notificationIcon"));
    	long created_time = System.currentTimeMillis()/1000l;
    	
    	
    	//Sending to chrome browser push notification
    	if(browser_id.contains(PushNotification.CHROME_BROWSER))
    	{
    		//Subtracting actual browser id of Chrome browser
    		browser_id = StringUtils.substringAfter(browser_id, PushNotification.CHROME_BROWSER);
    		PushNotificationMessage pushNotificationMessage = new PushNotificationMessage(created_time, browser_id, notification_message.toString(),null, null );
			pushNotificationMessage.save();
    		
    		if(PushNotification.sendPushNotificationToChrome(browser_id))
    		{
    			System.out.println("Preview Push Notifiacation sent to Chrome successfully : " + browser_id);
    			
    			
    		}
    			
    	}
    	else
    	{
    		///Subtracting actual browser id of Mozilla browser
    		browser_id = StringUtils.substringAfter(browser_id, PushNotification.MOZILLA_BROWSER);
    		PushNotificationMessage pushNotificationMessage = new PushNotificationMessage(created_time, browser_id, notification_message.toString(), null,null);
			pushNotificationMessage.save();
    		
    		if(PushNotification.sendPushNotificationToMozilla(browser_id))
    		{
    			System.out.println("Preview Push Notifiacation sent to Mozilla successfully : " + browser_id);
    		}
    		}
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	}
    }


}
