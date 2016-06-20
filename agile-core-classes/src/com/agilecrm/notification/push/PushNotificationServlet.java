package com.agilecrm.notification.push;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.datanucleus.util.StringUtils;

import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.agile.PushNotification;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;

public class PushNotificationServlet extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
	    {
		    String browser_id=request.getParameter("id");
		    
		    if(StringUtils.isEmpty(browser_id))
		    	return;
		    
		    PushNotificationMessage pushNotificationMessage = PushNotificationMessageUtil.getPushNotificationMessage(browser_id);
		    
		    if(pushNotificationMessage == null)
		    	return;
		    
		    String message = pushNotificationMessage.notification_message;
		    String campaign_id = pushNotificationMessage.campaign_id;
		    String subscriber_id = pushNotificationMessage.subscriber_id;
		    
		    //delete the message after sending push notification
		    pushNotificationMessage.delete();
		    
		    //Adding push notification shown log in campaign
		    LogUtil.addLogToSQL(campaign_id, subscriber_id, "Push notification showm to subscriber",LogType.PUSH_NOTIFICATION_FAILED.toString());
		    
		    response.setContentType("application/json");
		    response.getWriter().print(message);
		
		
	    }

}
