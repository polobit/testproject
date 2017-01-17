package com.campaignio.tasklets.agile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
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
    	task.setUrl(url);
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
		// This is indicate that we are calling the method for Campaign
		Boolean isCampaignCall = true;
		executeRequestJSON(campaignJSON, subscriberJSON, data, nodeJSON, url, methodType, paramsJSONArrayString,
				headersJSONArrayString,isCampaignCall);
	}
	
	/**
	 * This method will execute with JSONIO Node data and give response based on server response
	 * isCampaignCall indicates that it is calling from Campaign or other.
	 * if isCampaignCall is true then it is calling from Campaign. 
	 * 
	 * @param campaignJSON
	 * @param subscriberJSON
	 * @param data
	 * @param nodeJSON
	 * @param url
	 * @param methodType
	 * @param paramsJSONArrayString
	 * @param headersJSONArrayString
	 * @param isCampaignCall
	 * @return response of the request
	 * @throws JSONException
	 * @throws Exception
	 */
	public static String executeRequestJSON(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data,
			JSONObject nodeJSON, String url, String methodType, String paramsJSONArrayString,
			String headersJSONArrayString, Boolean isCampaignCall) throws JSONException, Exception
	{
		JSONArray paramsJSONArray = new JSONArray(paramsJSONArrayString);
		
		JSONArray headersJSONArray = new JSONArray();

	    String logMessage = "";
		
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
				
				if(isCampaignCall)
					value = replaceTokens(value, subscriberJSON, data);
	
				// Construct data
				if (i == 0)
				    httpParams += URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(StringEscapeUtils.unescapeJava(value), "UTF-8");
				else
				    httpParams += "&" + URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(StringEscapeUtils.unescapeJava(value), "UTF-8");
		    }

		    System.out.println(httpParams);
		    
		    Map<String, Object> output = null;
		    
		    HashMap<String,String> hashmapKeyValues = new HashMap<String,String>();
		    
		    for (int i = 0; i < headersJSONArray.length(); i++)
		    {
				JSONObject headerJSON = headersJSONArray.getJSONObject(i);
	
				String key = headerJSON.getString("rest_header_key");
				String value = headerJSON.getString("rest_header_value");
	
				// Construct headers
				hashmapKeyValues.put(key, value);
		    }
		    
		    if (methodType.equalsIgnoreCase(METHOD_TYPE_GET))
		    {
				if (url.contains("?"))
				    url = url + "&" + httpParams;
				else
				    url = url + "?" + httpParams;
	
				output = accessURLWithHeaders(url,hashmapKeyValues);
				logMessage = "GET: " + url + "<br>Status: SUCCESS";

		    }
		    else
		    {
				output = accessURLWithHeaderUsingPost(url, httpParams,hashmapKeyValues);			
				logMessage = "POST: " + url + " " + httpParams + "<br>Status: SUCCESS";
		    }
		    
		    String finalOutput = "";
		    
			if (output != null) {
				Response response = (Response) output.get("response");
				System.out.println("Response : " + response);
				if (response.getCode() >= 400) {
					String exceptionMessage = "while processing request </br>Response Code: "
							+ response.getCode()
							+ "</br>Response Message: "
							+ response.getMessage();
					throw new Exception(exceptionMessage);
				} else {
					finalOutput = response.getMessage();
				}
			}

		    JSONObject returnJSON = new JSONObject(finalOutput);

		    if(isCampaignCall){
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
		    
		    return logMessage;

		}
		catch (Exception e)
		{
		    e.printStackTrace();		    		    
		    if(isCampaignCall){
		    	data.put("error", e.getMessage());
		    	
		    	// Creates log for JSONNode for error
			    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Error Occurred " + e.getMessage(),
				    LogType.JSONIO.toString());

			    // Execute Next One in Loop
			    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_FAILURE);
		    }		    
		    logMessage = "Error Occurred " + e.getMessage();
		}
		return logMessage;
	}

	
	 /**
    * Connects to the remote object to write (post) the given data and reads
    * the response of it to return
    * 
    * @param postURL
    * @param data
    * @param hashmapKeyValues
    * @return response of the remote object
    * @throws Exception
    */
   private static Map<String, Object> accessURLWithHeaderUsingPost(String postURL, String data,HashMap<String,String> hashmapKeyValues) throws Exception
   {
	// Send data
	URL url = new URL(postURL);
	HttpURLConnection conn = (HttpURLConnection) url.openConnection();	
		
	conn.setDoOutput(true);

	// Set Connection Timeout as Google AppEngine has 5 secs timeout
	conn.setConnectTimeout(600000);
	conn.setReadTimeout(600000);
	
	Set<String> keys = hashmapKeyValues.keySet();
	if(keys.size()>0){
	    Iterator<String> iterator = keys.iterator();
	    
	    while(iterator.hasNext())
	    {
		// Construct headers
	    String key = iterator.next();
		conn.addRequestProperty(key,hashmapKeyValues.get(key));
	    }
	}
	
	OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
	if (data != null)
	{
	    wr.write(data);
	    wr.flush();
	}

	InputStream is = null;
	
   try
   {
   	is = conn.getInputStream();
	
   }
   catch(IOException ie)
   {
   	System.err.println("IOException occured, getting error stream.");
   	is = conn.getErrorStream();
   }
	
	// Get the response
	BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
	
	String output = "";
	String inputLine;
	while ((inputLine = reader.readLine()) != null)
	{
	    output += inputLine;
	}

	wr.close();
	reader.close();	
	return responseMap(((HttpURLConnection)conn).getResponseCode(), output);
   }
   
   /**
    * Connects to the remote object to write (get) the given data and reads
    * the response of it to return
    * 
    * @param url
    * @param hashmapKeyValues
    * @return response of the remote object
    */
   public static Map<String, Object> accessURLWithHeaders(String url,HashMap<String,String> hashmapKeyValues)
   {
	try
	{
	    URL yahoo = new URL(url);
	    URLConnection conn = yahoo.openConnection();

	    // Set Connection Timeout as Google AppEngine has 5 secs timeout
	    conn.setConnectTimeout(600000);
	    conn.setReadTimeout(600000);
	    
	    Set<String> keys = hashmapKeyValues.keySet();
	    if(keys.size()>0){
		    Iterator<String> iterator = keys.iterator();
		    
		    while(iterator.hasNext())
		    {
			// Construct headers
		    String key = iterator.next();
			conn.addRequestProperty(key,hashmapKeyValues.get(key));
		    }
	    }

	    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
	   		
	    String output = "";
	    String inputLine;
	    while ((inputLine = reader.readLine()) != null)
	    {
		output += inputLine;
	    }
	    reader.close();	
	    return responseMap(((HttpURLConnection)conn).getResponseCode(), output);	    
	    
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println(e.getMessage());
	}
	return null;
   }
   
   private static Map<String, Object> responseMap(int responseCode, String responseMessage)
   {
	   Map<String, Object> response = new HashMap<String, Object>();   
	   
	   Response responseInner = new Response();
	   responseInner.setCode(responseCode);
	   
	   try{
		   JSONObject jsonObject = new JSONObject(responseMessage);
		   
		   if(responseCode >= 400 && jsonObject.has("message"))
			   responseInner.setMessage(jsonObject.getString("message"));   
		   else
			   responseInner.setMessage(responseMessage);
		   
	   }catch (Exception e) {
		   e.printStackTrace();
		   System.err.println(e.getMessage());
		   responseInner.setMessage(responseMessage);
	   }
	   
	   response.put("response", responseInner);
	   
	   return response;
   }
}

class Response
{
	int code;
	String message;

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return "Response [code=" + code + ", message=" + message + "]";
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
	
	private String campaignId, dataString, subscriberJSONString, nodeJSONString;
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