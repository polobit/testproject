package com.campaignio.tasklets;

import java.util.Iterator;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.util.email.MustacheUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.reports.DateUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;

/**
 * <code>TaskletAdapter</code> is an adapter class which implements Tasklet
 * interface. So, the tasklet class can define it's own implementation on any
 * number of methods but not worry to define all the Tasklet interface methods.
 * Every tasklet in the workflow inherits TaskletAdapter.
 * <p>
 * Moreover, taskletadapter class provides Cron functionality for scheduled
 * tasks. TaskletAdapter class is used to get field values that are entered in a
 * node. It replaces the template by subscriber data. It merges subscriberJSON
 * and dataJSON into single JSONObject.
 * </p>
 * 
 * @author Manohar
 */
public class TaskletAdapter implements Tasklet
{
    /**
     * Json values is a json array that stores the field values entered in
     * client side.
     */
    public static final String JSON_VALUES = "JsonValues";

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.Tasklet#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    @Override
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	System.out.println("Dummy run");
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.Tasklet#interrupted(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject,
     * org.json.JSONObject)
     */
    @Override
    public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON, JSONObject interruptCustomData)
	    throws Exception
    {
	System.out.println("Dummy Interrupted");
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.Tasklet#timeOutComplete(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    @Override
    public void timeOutComplete(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	System.out.println("Dummy Timeout");

    }

    /**
     * Adds tasks to cron inorder to run tasks at scheduled time using timeout
     * period.
     * 
     * @param campaignJSON
     *            campaign that runs at that instance.
     * @param subscriberJSON
     *            contact with which campaign subscribes.
     * @param data
     *            data that is used within the workflow.
     * @param nodeJSON
     *            node at that instance in a workflow.
     * @param timeout
     *            timeout period for a task, how much time the task should stay
     *            in cron.
     * @param custom1
     *            custom value.
     * @param custom2
     *            custom value.
     * @param custom3
     *            custom value.
     * @throws Exception
     *             if any exception occurs in Cron.
     */
    public void addToCron(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON, long timeout, String custom1,
	    String custom2, String custom3) throws Exception
    {
	// Add Log
	LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Sleeping till " + timeout,
		LogType.EMAIL_SLEEP.toString());

	// Enqueue Task
	CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout, custom1, custom2, custom3);
    }

    /**
     * Removes task from Cron using CampaignId and SubscriberId.
     * 
     * @param campaignID
     *            Id of a campaign at that instance.
     * @param subscriberID
     *            Id of a contact at that instance.
     * @throws Exception
     *             if any exception occurs in Cron.
     */
    public void removeFromCron(String campaignID, String subscriberID) throws Exception
    {
	// Remove from Cron Task
	CronUtil.removeTask(campaignID, subscriberID);
    }

    /**
     * Gets value as a String and return replaced content if any mustache
     * template exists within the value.
     * 
     * @param nodeJSON
     *            node at that instance in a workflow.
     * @param subscriberJSON
     *            contact with which campaign subscribes.
     * @param data
     *            data that is used within the workflow.
     * @param keyName
     *            field value in the node.
     * @return replaced string (where-ever mustaches occurs, there the template
     *         is replaced with subscriber and data json).
     * @throws Exception
     */
    public static String getStringValue(JSONObject nodeJSON, JSONObject subscriberJSON, JSONObject data, String keyName) throws Exception
    {
      //adding current date merge field
    	addCurrentDate(subscriberJSON);
           	
	Object returnValue = getValue(nodeJSON, subscriberJSON, data, keyName);
	if (returnValue == null)
	    return null;

	return replaceTokens((String) returnValue, subscriberJSON, data);
    }

    /**
     * Gets value entered by the user at client side.
     * 
     * @param nodeJSON
     *            Current node at that instance in a workflow.
     * @param subscriberJSON
     *            Contact with which campaign subscribes.
     * @param data
     *            Data that is used within the workflow.
     * @param keyName
     *            Field value in the node.
     * @return Value given at client side from UI JSON Values.
     * @throws Exception
     */
    public static Object getValue(JSONObject nodeJSON, JSONObject subscriberJSON, JSONObject data, String keyName) throws Exception
    {
	// Check if JSON Value is present
	if (!nodeJSON.has(JSON_VALUES))
	    return null;

	JSONArray jsonArray = nodeJSON.getJSONArray(JSON_VALUES);

	// Iterate through name/value pairs
	for (int i = 0; i < jsonArray.length(); i++)
	{
	    // Get the each JSON data
	    JSONObject json = jsonArray.getJSONObject(i);

	    if (json.has(keyName))
		return json.getString(keyName);

	    // For Serialized data from ui - you will get name, value
	    // pairs
	    if (json.has("name"))
	    {
		String name = (String) json.get("name");
		if (name.equalsIgnoreCase(keyName))
		{
		    return json.get("value");
		}
	    }
	}
	return null;
    }

    /**
     * Replaces template if any. Value is the template and subscriberJSON and
     * data are merged to replace template.
     * 
     * @param value
     *            value entered at client side.
     * @param subscriberJSON
     *            contact with which campaign subscribes.
     * @param data
     *            data that is used within the workflow.
     * @return replaced content.
     * @throws Exception
     */
    public static String replaceTokens(String value, JSONObject subscriberJSON, JSONObject data)
    {
	JSONObject mergedJson = null;
	try
	{
	    mergedJson = mergeJSONObjects(subscriberJSON, data);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	if (mergedJson == null)
	    return " ";

	// Compile the template using Mustache
	return MustacheUtil.compile(value, mergedJson);
    }

    /**
     * Merges subscriberJSON and data json
     * 
     * @param subscriberJSON
     *            Contact data that subscribes to campaign.
     * @param data
     *            Data within the workflow.
     * @return merged json object.
     * @throws Exception
     */
    @SuppressWarnings("rawtypes")
    private static JSONObject mergeJSONObjects(JSONObject subscriberJSON, JSONObject data) throws Exception
    {
	// Temporary json object to merge subscriber and data json objects.
	JSONObject mergedJson = new JSONObject();

	// Merge two jsons, data object from subscriber json and data json
	JSONObject[] dataJSONObjects = new JSONObject[] { subscriberJSON.getJSONObject("data"), data };
	try
	{
	    for (JSONObject obj : dataJSONObjects)
	    {
		Iterator it = obj.keys();
		while (it.hasNext())
		{
		    String key = (String) it.next();
		    mergedJson.put(key, obj.get(key));
		}
	    }
	    return mergedJson;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Creates log for the nodes using {@link Log}. Logs are useful to know the
     * information after execution. For e.g.for send-email node, logs are useful
     * whether emails are sent successfully or not.
     * 
     * @param campaignJSON
     *            Nodes that are connected in a workflow.
     * @param subscriberJSON
     *            Contact details.
     * @param message
     *            Message set in the node class.
     * @throws Exception
     */
    public void log(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject nodeJSON, String message) throws Exception
    {
	System.out.println("Log: " + message.replaceAll("\n", " ").replaceAll("\r", " ") + " " + subscriberJSON + " " + campaignJSON + " " + nodeJSON);

	// Node name as log type.
	String logType = nodeJSON.getJSONObject("NodeDefinition").getString("name");

	String campaignId = AgileTaskletUtil.getId(campaignJSON);
	String subscriberId = AgileTaskletUtil.getId(subscriberJSON);

	// Add Log
	LogUtil.addLogToSQL(campaignId, subscriberId, message, logType);
    }
    
    /**
     * Add a current date (dd MMM yyyy) as a merge field in subscriberJSON
     * 
     * @
     * @param subscriberJSON
     *            Contact details.
     * @throws Exception
     */
    private static void addCurrentDate(JSONObject subscriberJSON) throws JSONException{
    	try
    	{
	    	// Adding Current date as a merge field
	    	String timezone=null;
	    	JSONObject json=null;
	    	
	    	if(subscriberJSON.has("data"))
	    		json=(JSONObject)subscriberJSON.get("data");
	    
	    	if(json.has("timezone"))
	    	     timezone=json.getString("timezone");
	    
	    	//Getting timezone from database
	    	if(StringUtils.isBlank(timezone))
	    		  timezone=AccountPrefsUtil.getTimeZone();
	    	
	    	//adding current date in subscriberJSON
	        json.put("current_date", DateUtil.getDateInGivenFormat(System.currentTimeMillis(),"dd MMM yyyy", timezone));
    	}
    	catch(Exception e)
    	{
    		System.err.println(e);
    	}
    }
}