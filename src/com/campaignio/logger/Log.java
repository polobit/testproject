package com.campaignio.logger;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.ws.rs.Produces;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonAutoDetect;
import org.json.JSONArray;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * 
 * <code>Log</code> class is the base class for logging details of various
 * actions in agilecrm.For example,email sending details such as delivery
 * reports can be known using logs.Log class can be used in any tasklets that
 * require logging.
 * 
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
@JsonAutoDetect
public class Log
{

    /**
     * Uniquely generated Id for each log created
     */
    @Id
    public Long id;

    // Campaign Data

    /**
     * Id of a campaign
     */
    public String campaign_id;

    // Subscriber

    /**
     * Contact id that subscribes to campaign
     */
    public String subscriber_id;

    /**
     * JSONArray logs
     */
    @NotSaved
    public JSONArray logs = new JSONArray();

    /**
     * We make it private so that Jersey does not send this to the client
     */
    private String logs_json_array_string = null;

    /**
     * Object Key in logs - time
     */
    public final static String LOG_TIME = "t";

    /**
     * Object Key in logs - message
     */
    public final static String LOG_MESSAGE = "m";

    /**
     * Sets entity type as log
     */
    @NotSaved
    public String entity_type = "log";

    /**
     * ObjectifyGenericDao for Log class
     */
    public static ObjectifyGenericDao<Log> dao = new ObjectifyGenericDao<Log>(
	    Log.class);

    /**
     * Default Log
     */
    Log()
    {

    }

    /**
     * Constructs new {@link Log} with campaign id and subscriber id
     * 
     * @param campaignId
     *            Id of a campaign
     * @param subscriberId
     *            Id of a contact that subscribes to campaign
     */
    public Log(String campaignId, String subscriberId)
    {
	this.subscriber_id = subscriberId;
	this.campaign_id = campaignId;
    }


    /**
     * Returns logs as an xmlelement
     * 
     * @return log object
     * @throws Exception
     */
    @XmlElement
    @Produces("application/json")
    public String getLogs() throws Exception
    {
	// System.out.println(logs);
	return logs.toString();
    }

    /**
     * Returns name of contact that subscribes to campaign as an xml element
     * 
     * @return Contact name
     * @throws Exception
     */
    @XmlElement
    public String getContactName() throws Exception
    {
	if (subscriber_id != null)
	{
	    Contact contact = Contact.getContact(Long.parseLong(subscriber_id));
	    if (contact != null)
		return contact.getContactFieldValue(Contact.FIRST_NAME) + " "
			+ contact.getContactFieldValue(Contact.LAST_NAME);
	}

	return "?";
    }

    /**
     * Saves Log in database
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Sets json array string before log object gets saved
     */
    @PrePersist
    void PrePersist()
    {
	logs_json_array_string = logs.toString();
    }

    /**
     * Sets JSONArray logs to json array string after logs has been retrieved
     */
    @PostLoad
    void PostLoad()
    {
	try
	{
	    if (logs_json_array_string != null)
		logs = new JSONArray(logs_json_array_string);
	}
	catch (Exception e)
	{

	}

	// System.out.println("Logs " + logs);
    }


}
