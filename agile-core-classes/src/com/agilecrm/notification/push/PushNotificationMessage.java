package com.agilecrm.notification.push;
import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Indexed;
/**
 * <code>PushNotificationMessage</code> class stores the details of a push notification message 
 * 
 * @author Prashannjeet
 * 
 */

public class PushNotificationMessage {

	/**
     *  push notification message  Id
     */
    @Id
    public Long id;

    /**
     * Created Time
     */
    @Indexed
    public long created_time = 0L;

    /**
     * Browser id of Push notification message
     */
    @Indexed
    public String browser_id="";
    
    /**
     * Store properties of push notification ex:- Message, Title, Link and Icon
     */
    @Indexed
    public String notification_message="";
    
    /**
     * Campaign Id 
     */
    @Indexed
    public String campaign_id="";
    
    /**
     * Subscriber id of push notification contact
     */
    
    @Indexed
    public String subscriber_id="";
    
    public static final String BROWSER_ID = "browser_id";
    public static final String NOTIFICATION_MESSAGE = "notification_message";
    /**
     * ObjctifyDAO for PushNotificationMessage
     */
	public static ObjectifyGenericDao<PushNotificationMessage> dao = new ObjectifyGenericDao<PushNotificationMessage>(PushNotificationMessage.class);

    public PushNotificationMessage()
    {
    }

    public PushNotificationMessage(long created_time, String browser_id, String notification_message, String campaign_id, String subscriber_id)
    {
		this.created_time = created_time;
		this.browser_id = browser_id;
		this.notification_message = notification_message;
		this.subscriber_id = subscriber_id;
		this.campaign_id = campaign_id;
    }

    /**
     * Saves a Push notification message in the datastore
     */
    public void save()
    {
		try
		{	
		       dao.put(this);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
    }
    
    /**
     * Delete a Push notification message from the datastore
     */
    public void delete()
    {
    	try
		{	
		       dao.delete(this);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
    }

    @Override
    public String toString()
    {
	return "PushNotificationMessage [id=" + id + ", created_time=" + created_time + ", browser_id=" + browser_id + ", notification_message=" + notification_message+"]";
    }

}
