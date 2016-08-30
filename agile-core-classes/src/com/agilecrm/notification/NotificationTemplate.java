package com.agilecrm.notification;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>NotificationTemplate</code> is the base class for all the Notification Template created at
 * client-side. Each Notification Template object consists of Notification Template-id(generated),
 * Notification Template name, updated time, title, mesage, icon link and click link url of creator.
 * <p>
 * The <code>NotificationTemplate</code> class provides methods to create, update, delete
 * and get the NotificationTemplate.
 * 
 * @author Prashannjeet
 *
 */
@XmlRootElement
public class NotificationTemplate
{
    @Id
    public Long id;

    /**
     * Updated Time of Push Notification Template
     */
    @Indexed
    @NotSaved(IfDefault.class)
    public Long updated_time = System.currentTimeMillis() / 1000;


    /**
     * Name of Push Notification Template
     */
    @NotSaved(IfDefault.class)
    public String notificationName = null;


    /**
     * Title of Push Notification Template
     */
    @NotSaved(IfDefault.class)
    public String notificationTitle = null;
    

    /**
     * Message content of Push Notification 
     */
    @NotSaved(IfDefault.class)
    public String notificationMessage = null;
    

    /**
     * Link of Push Notification which is open on click event
     */
    @NotSaved(IfDefault.class)
    public String notificationLink = null;
    

    /**
     * Image icon link url of Push Notification 
     */
    @NotSaved(IfDefault.class)
    public String notificationIcon = null;
    
    /**
     * Image icon link url of Push Notification 
     */
    @NotSaved(IfDefault.class)
    public String push_param = null;

    public static ObjectifyGenericDao<NotificationTemplate> dao = new ObjectifyGenericDao<NotificationTemplate>(NotificationTemplate.class);

    public NotificationTemplate()
    {

    }

    public NotificationTemplate(String notificationName, String notificationTitle, String notificationMessage, String notificationLink, String notificationIcon, String push_param)
    {
		this.notificationName = notificationName;
		this.notificationTitle = notificationTitle;
		this.notificationMessage = notificationMessage;
		this.notificationLink = notificationLink;
		this.notificationIcon = notificationIcon;
		this.push_param = push_param;
    }


    public void save()
    {
    	this.updated_time = System.currentTimeMillis() / 1000;
    	dao.put(this);
    }
    
}
