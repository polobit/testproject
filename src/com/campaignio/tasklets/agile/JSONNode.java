package com.campaignio.tasklets.agile;

import java.net.URLEncoder;
import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.Util;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>JSONNode</code> represents JSONIO node in the workflow.‘JSON IO’ node
 * is used to integrate workflow with web infrastructure using JSON. It consists
 * of two branches-success and failure. When url is accessed successfully
 * without any errors, then that node proceeds to success, otherwise failure.
 * 
 * @author Manohar
 * 
 */
public class JSONNode extends TaskletAdapter
{
    // Fields
    /**
     * Rest url
     */
    public static String URL = "rest_url";


    /**
     * Method Type
     */
    public static String METHOD_TYPE = "method_type";
    /**
     * Get method
     */
    public static String METHOD_TYPE_GET = "get";
    /**
     * Post method
     */
    public static String METHOD_TYPE_POST = "post";

    // Parameters
    /**
     * Parameters given in grid as key-value pairs
     */
    public static String PARAMETERS = "rest_key_grid";

    // Branches - Success/failure
    /**
     * Branch success
     */
    public static String BRANCH_SUCCESS = "success";
    /**
     * Branch failure
     */
    public static String BRANCH_FAILURE = "failure";

    // Run
    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    @SuppressWarnings({ "deprecation", "rawtypes" })
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get URL, Method Type
	String url = getStringValue(nodeJSON, subscriberJSON, data, URL);
	String methodType = getStringValue(nodeJSON, subscriberJSON, data,
		METHOD_TYPE);

	// Parameters
	String paramsJSONArrayString = getStringValue(nodeJSON, subscriberJSON,
		data, PARAMETERS);

	JSONArray paramsJSONArray = new JSONArray(paramsJSONArrayString);

	String httpParams = "";

	try
	{
	    // Iterate through json array having key-value pairs
	    for (int i = 0; i < paramsJSONArray.length(); i++)
	    {
		JSONObject paramJSON = paramsJSONArray.getJSONObject(i);

		String key = paramJSON.getString("rest_key");
		String value = paramJSON.getString("rest_value");

		value = replaceTokens(value, subscriberJSON, data);

		// Construct data
		if (i == 0)
		    httpParams += URLEncoder.encode(key) + "="
			    + URLEncoder.encode(value);
		else
		    httpParams += "&" + URLEncoder.encode(key) + "="
			    + URLEncoder.encode(value);
	    }

	    System.out.println(httpParams);

	    String output;

	    if (methodType.equalsIgnoreCase(METHOD_TYPE_GET))
	    {
		if (url.contains("?"))
		    url = url + "&" + httpParams;
		else
		    url = url + "?" + httpParams;

		// Creates log for JSONNode for method Get type
		log(campaignJSON, subscriberJSON, "Accessing Get " + url);

		output = Util.accessURL(url);

	    }
	    else
	    {
		// Creates log for JSONNode for method Post type
		log(campaignJSON, subscriberJSON, "Accessing Post " + url + " "
			+ httpParams);
		output = Util.accessURLUsingPost(url, httpParams);
	    }

	    // Creates log for JSONNode for output
	    log(campaignJSON, subscriberJSON, "Output " + output);

	    JSONObject returnJSON = new JSONObject(output);

	    // Iterate through all keys and add to data
	    Iterator it = returnJSON.keys();
	    while (it.hasNext())
	    {
		String key = (String) it.next();
		data.put("$" + key, returnJSON.get(key));
	    }

	    System.out.println(returnJSON + " " + data);

	    // Execute Next One in Loop
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, BRANCH_SUCCESS);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    data.put("error", e.getMessage());

	    // Creates log for JSONNode for error
	    log(campaignJSON, subscriberJSON,
		    "Error Occurred " + e.getMessage());

	    // Execute Next One in Loop
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, BRANCH_FAILURE);
	}
    }
}
