package com.campaignio.tasklets.agile;

import java.net.URLEncoder;
import java.util.Iterator;

import org.apache.commons.lang.StringEscapeUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>JSONNode</code> represents JSONIO node in the workflow. �JSON IO�
 * node is used to integrate workflow with web infrastructure using JSON. It
 * consists of two branches-success and failure. When url is accessed
 * successfully without any errors, then that node proceeds to success,
 * otherwise failure.
 * 
 * @author Manohar
 * 
 */
public class JSONNode extends TaskletAdapter
{
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

    /**
     * Parameters given in grid as key-value pairs
     */
    public static String PARAMETERS = "rest_key_grid";

    /**
     * Branch success
     */
    public static String BRANCH_SUCCESS = "success";

    /**
     * Branch failure
     */
    public static String BRANCH_FAILURE = "failure";

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    @SuppressWarnings({ "deprecation", "rawtypes" })
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get URL, Method Type
	String url = getStringValue(nodeJSON, subscriberJSON, data, URL);
	String methodType = getStringValue(nodeJSON, subscriberJSON, data, METHOD_TYPE);

	// Parameters
	String paramsJSONArrayString = getStringValue(nodeJSON, subscriberJSON, data, PARAMETERS);

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
		    httpParams += URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(StringEscapeUtils.unescapeJava(value), "UTF-8");
		else
		    httpParams += "&" + URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(StringEscapeUtils.unescapeJava(value), "UTF-8");
	    }

	    System.out.println(httpParams);

	    String output;

	    String logMessage = "";

	    if (methodType.equalsIgnoreCase(METHOD_TYPE_GET))
	    {
		if (url.contains("?"))
		    url = url + "&" + httpParams;
		else
		    url = url + "?" + httpParams;

		output = HTTPUtil.accessURL(url);

		logMessage = "GET: " + url + "<br>Status: SUCCESS";

	    }
	    else
	    {
		output = HTTPUtil.accessURLUsingPost(url, httpParams);
		logMessage = "POST: " + url + " " + httpParams + "<br>Status: SUCCESS";
	    }

	    JSONObject returnJSON = new JSONObject(output);

	    // Iterate through all keys and add to data
	    Iterator it = returnJSON.keys();
	    while (it.hasNext())
	    {
		String key = (String) it.next();
		data.put(key, returnJSON.get(key));
	    }

	    System.out.println(returnJSON + " " + data);

	    // Creates log for JSONNode for method Post type
	    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), logMessage, LogType.JSONIO.toString());

	    // Execute Next One in Loop
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_SUCCESS);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    data.put("error", e.getMessage());

	    // Creates log for JSONNode for error
	    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Error Occurred " + e.getMessage(),
		    LogType.JSONIO.toString());

	    // Execute Next One in Loop
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_FAILURE);
	}
    }
}