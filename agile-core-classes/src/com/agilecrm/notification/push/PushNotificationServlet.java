package com.agilecrm.notification.push;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.datanucleus.util.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.agile.PushNotification;
import com.google.appengine.api.NamespaceManager;

public class PushNotificationServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1587951517703088575L;

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
	    {
		 response.setHeader("Access-Control-Allow-Origin", "*");
		
			String browser_id=request.getParameter("id");
		    System.out.println("Browser id :"+browser_id);
		    
		    String domainName=NamespaceManager.get();
		    System.out.println("Domain name :"+domainName);
		    
		    if(StringUtils.isEmpty(browser_id))
		    	return;
		    PushNotificationMessage pushNotificationMessage =null;
		    try
		    {
		    	pushNotificationMessage = PushNotificationMessageUtil.getPushNotificationMessage(browser_id);
		    	System.out.println("Message Created Time :" + pushNotificationMessage.toString());
		    } catch (Exception e) 
			{
		    	System.out.println(ExceptionUtils.getFullStackTrace(e));
				System.out.println("Exception occured while gitting push message data from datastore : "+e.getMessage());
			}
		    
		    if(pushNotificationMessage == null)
		    	return;
		    
		    String message = pushNotificationMessage.notification_message;
		    String campaign_id = pushNotificationMessage.campaign_id;
		    String subscriber_id = pushNotificationMessage.subscriber_id;
		    
		    //delete the message after sending push notification
		    pushNotificationMessage.delete();
		    
		    //Adding push notification shown log in campaign
		    try
		    {
				JSONObject data= new JSONObject(message);
				if(data.has(PushNotification.NOTIFICATION_TITLE_VALUE) && org.apache.commons.lang.StringUtils.isNotBlank(campaign_id))
				     LogUtil.addLogToSQL(campaign_id, subscriber_id, "Title : "+data.getString(PushNotification.NOTIFICATION_TITLE_VALUE),LogType.PUSH_NOTIFICATION_SHOWN.toString());
			} catch (JSONException e) 
			{
				System.out.println("Exception occured while gitting push message title for log : "+e.getMessage());
			}
		    
		    //sending the push notification mesage to the browser
		    response.setContentType("application/json; charset=UTF-8");
		    response.getWriter().print(message);
		
		
	    }

}