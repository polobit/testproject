package com.campaignio.tasklets.agile;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Iterator;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

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
     * Headers given in grid as key-value pairs
     */
    public static String HEADERS = "rest_headers_grid";

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
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
		// Get URL, Method Type
		String url = getStringValue(nodeJSON, subscriberJSON, data, URL);
		String methodType = getStringValue(nodeJSON, subscriberJSON, data, METHOD_TYPE);
	
		// Parameters
		String paramsJSONArrayString = getStringValue(nodeJSON, subscriberJSON, data, PARAMETERS);
		String headersJSONArrayString = getStringValue(nodeJSON, subscriberJSON, data, HEADERS);
	
		// Enqueue JSON task to run this node async
		enqueueJSONTask(AgileTaskletUtil.getId(campaignJSON), subscriberJSON, data, nodeJSON, url, methodType, paramsJSONArrayString, headersJSONArrayString);
    }

    /**
     * Creates deferred task and adds to Queue
     * 
     * @param campaignJSON - Campaign JSON
     * @param subscriberJSON - contact json
     * @param data - data json
     * @param nodeJSON
     * @param url
     * @param methodType
     * @param paramsJSONArrayString
     * @param headersJSONArrayString
     */
    private void enqueueJSONTask(String campaignId, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON,String url, String methodType, String paramsJSONArrayString, String headersJSONArrayString)
    {
    	JSONIODeferredTask task = new JSONIODeferredTask(campaignId, subscriberJSON.toString(), data.toString(), nodeJSON.toString());
    	task.setUrl(url);;
    	task.setMethodType(methodType);
    	task.setParams(paramsJSONArrayString);
    	task.setHeaders(headersJSONArrayString);
    	
    	// Add to queue
    	Queue queue = QueueFactory.getQueue(AgileQueues.JSONIO_NODE_QUEUE);
    	queue.addAsync(TaskOptions.Builder.withPayload(task));
    }
    
	/**
	 * @param campaignJSON
	 * @param subscriberJSON
	 * @param data
	 * @param nodeJSON
	 * @param url
	 * @param methodType
	 * @param paramsJSONArrayString
	 * @param headersJSONArrayString
	 * @throws JSONException
	 * @throws Exception
	 */
	public void executeRequest(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data,
			JSONObject nodeJSON, String url, String methodType, String paramsJSONArrayString,
			String headersJSONArrayString) throws JSONException, Exception
	{
		JSONArray paramsJSONArray = new JSONArray(paramsJSONArrayString);
		
		JSONArray headersJSONArray = new JSONArray();
		
		try{
		 headersJSONArray = new JSONArray(headersJSONArrayString);
		}catch(Exception e){
			//To make compatible with old json io nodes
			headersJSONArray = new JSONArray();
		}

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
		    
		    HashMap<String,String> hashmapKeyValues = new HashMap<String,String>();
		    
		    for (int i = 0; i < headersJSONArray.length(); i++)
		    {
			JSONObject headerJSON = headersJSONArray.getJSONObject(i);

			String key = headerJSON.getString("rest_header_key");
			String value = headerJSON.getString("rest_header_value");

			// Construct headers
			hashmapKeyValues.put(key, value);
		    }

		    String logMessage = "";
		    
		    if (methodType.equalsIgnoreCase(METHOD_TYPE_GET))
		    {
			if (url.contains("?"))
			    url = url + "&" + httpParams;
			else
			    url = url + "?" + httpParams;

			output = HTTPUtil.accessURLWithHeaders(url,hashmapKeyValues);

			logMessage = "GET: " + url + "<br>Status: SUCCESS";

		    }
		    else
		    {
			output = HTTPUtil.accessURLWithHeaderUsingPost(url, httpParams,hashmapKeyValues);
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


/**
 * <code>JSONIODeferredTask</code> is the deferred class that executes actual JSONIO node
 *  
 * @author naresh
 *
 */
class JSONIODeferredTask implements DeferredTask
{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -7873554548997239668L;
	
	public String campaignId, dataString, subscriberJSONString, nodeJSONString;
	private String url, methodType, params, headers;

	public JSONIODeferredTask(String campaignId, String subscriberJSONString, String dataString,
			String nodeJSONString)
	{
		this.campaignId = campaignId;
		this.dataString = dataString;
		this.subscriberJSONString = subscriberJSONString;
		this.nodeJSONString = nodeJSONString;
	}
	
	public String getUrl()
	{
		return url;
	}

	public void setUrl(String url)
	{
		this.url = url;
	}

	public String getMethodType()
	{
		return methodType;
	}

	public void setMethodType(String methodType)
	{
		this.methodType = methodType;
	}

	public String getParams()
	{
		return params;
	}

	public void setParams(String params)
	{
		this.params = params;
	}

	public String getHeaders()
	{
		return headers;
	}

	public void setHeaders(String headers)
	{
		this.headers = headers;
	}

	public void run()
	{
		try
		{
			JSONObject campaignJSON = WorkflowUtil.getWorkflowJSON(Long.parseLong(campaignId));
			
			if(campaignJSON == null)
				return;
			
			JSONObject subscriberJSON = new JSONObject(subscriberJSONString);
			JSONObject data = new JSONObject(dataString);
			JSONObject nodeJSON = new JSONObject(nodeJSONString);
			
			JSONNode node = new JSONNode();
			node.executeRequest(campaignJSON, subscriberJSON, data, nodeJSON, url, methodType, params, headers);
		}
		catch (JSONException e)
		{
			e.printStackTrace();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
	
}