package com.agilecrm.notification.push;

import java.util.HashMap;
import java.util.Map;

import com.agilecrm.db.ObjectifyGenericDao;

/**
 * <code>AllDomainStatsUtil</code> is a utility class to process the data of PushNotificationMessage
 * class, it processes when fetching the data and saving the data.
 * <p>
 * This utility class includes methods needs to return message of push notification
 * on created time and etc.. 
 *  * </p>
 * 
 * @author Prashannjeet
 * 
 */

public class PushNotificationMessageUtil {

	
	/**
     * ObjctifyDAO for AllDomainStats
     */
    public static ObjectifyGenericDao<PushNotificationMessage> dao = new ObjectifyGenericDao<PushNotificationMessage>(PushNotificationMessage.class);
    
    /**
     * Get the Message for Push Notification based on browserr id and domain name present in Database..
     * @param browser_id
     * @param domain name
     * @return PushNotificationMessage
     */
    
    public static PushNotificationMessage getPushNotificationMessage(String browser_id)
    {
    	    	
    	PushNotificationMessage notificationMessage=null;
    	try
    	{	
    		Map<String, Object> map=new HashMap<String, Object>();
    		map.put(PushNotificationMessage.BROWSER_ID, browser_id);
    		
    	    notificationMessage=dao.fetchAllByOrder("created_time", map).get(0);
    	}
    	catch (Exception e)
    	{
    		e.printStackTrace();
    		return null;
    	}
    	
    	return notificationMessage;
    }
    

}
