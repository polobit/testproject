package com.campaignio.logger;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.ws.rs.Produces;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonAutoDetect;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.DBUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;

@XmlRootElement
@JsonAutoDetect
public class Log
{
    // Key
    @Id
    public Long id;

    // Campaign Data/ID
    public String campaign_id;

    // Subscriber
    public String subscriber_id;

    // Subscriber
    @NotSaved
    private JSONArray logs = new JSONArray();

    // We make it private so that Jersey does not send this to the client
    private String logs_json_array_string = null;

    // Object Key in logs - time, message
    public final static String LOG_TIME = "t";
    public final static String LOG_MESSAGE = "m";

    // Dao
    private static ObjectifyGenericDao<Log> dao = new ObjectifyGenericDao<Log>(
	    Log.class);

    @NotSaved
    public String entity_type = "log";

    Log()
    {

    }

    Log(String campaignId, String subscriberId)
    {
	this.subscriber_id = subscriberId;
	this.campaign_id = campaignId;
    }

    @PrePersist
    void PrePersist()
    {
	logs_json_array_string = logs.toString();
    }

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

    // Log
    public static void addLogFromID(String campaignId, String subscriberId,
	    String message)
    {
	// System.out.println("Adding log " + campaignId + " " + subscriberId +
	// " " + message);

	// Get existing Log
	Log log = getCampaignSubscriberLog(campaignId, subscriberId);
	if (log == null)
	{
	    System.out.println("Creating fresh log");
	    log = new Log(campaignId, subscriberId);
	}

	try
	{
	    JSONObject messageJSON = new JSONObject().put(LOG_TIME,
		    Calendar.getInstance().getTimeInMillis()).put(LOG_MESSAGE,
		    message);
	    log.logs.put(messageJSON);
	    log.save();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    // Enqueue Task
    public static void addLog(JSONObject campaignJSON,
	    JSONObject subscriberJSON, String message) throws Exception
    {
	// Campaign and SubscriberId
	String campaignId = DBUtil.getId(campaignJSON);
	String subscriberId = DBUtil.getId(subscriberJSON);

	addLogFromID(campaignId, subscriberId, message);
    }

    // Get Log
    public static Log getCampaignSubscriberLog(String campaignId,
	    String subscriberId)
    {

	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("subscriber_id", subscriberId);
	searchMap.put("campaign_id", campaignId);

	return dao.getByProperty(searchMap);
    }

    // Get Log
    public static List<Log> getSubscriberLog(String subscriberId)
    {
	return dao.listByProperty("subscriber_id", subscriberId);
    }

    // Get Log
    public static List<Log> getCampaignLog(String campaignId)
    {
	return dao.listByProperty("campaign_id", campaignId);
    }

    // Enqueue Task
    public static void removeLogs(String subscriberID)
    {
	List<Key<Log>> logs = dao.listKeysByProperty("subscriber_id",
		subscriberID);
	if (logs == null || logs.isEmpty())
	    return;

	// Read from database
	try
	{
	    dao.deleteKeys(logs);
	}
	catch (Exception e)
	{

	}

    }

    // Enqueue Task
    public static void removeCampaignLogs(String campaignID)
    {
	List<Key<Log>> logs = dao.listKeysByProperty("campaign_id", campaignID);
	if (logs == null || logs.isEmpty())
	    return;

	// Read from database
	try
	{
	    dao.deleteKeys(logs);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    public void save()
    {
	dao.put(this);
    }

    // Delete logs bulk
    public static void deleteLogsBulk(JSONArray logsJSONArray)
    {
	List<Key<Log>> logKeys = new ArrayList<Key<Log>>();
	for (int i = 0; i < logsJSONArray.length(); i++)
	{
	    try
	    {
		logKeys.add(new Key<Log>(Log.class, Long
			.parseLong(logsJSONArray.getString(i))));
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}

	dao.deleteKeys(logKeys);
    }

    @XmlElement
    @Produces("application/json")
    public String getLogs() throws Exception
    {
	// System.out.println(logs);
	return logs.toString();
    }

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

}
