package com.agilecrm.account.util;


import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang.exception.ExceptionUtils;
import com.agilecrm.AgileQueues;
import com.agilecrm.Globals;
import com.agilecrm.call.util.deferred.CallDeferredTask;
import com.agilecrm.queues.backend.ModuleUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.twilio.TwilioSMSUtil;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestResponse;

/**
 * <code>VoiceCallUtil</code> it is for call node campaign.here call node is added into pull queue .
 * And making the voice call through rest api(twilio).
 * 
 * @author Sonali
 * 
 */

public class VoiceCallUtil
{ 
		
	/**
	 * Twilio Automate Voice Call
	 */
	public static final String TWILIO_CALLS = "Calls";
	
	public static final String callGateWay = "TWILIO";
    
        public static String sendVoiceall(String account_id,String auth_token,String from,String firstCall,String secondCall,String msg){
        	
        	 try {
        	     String response = null;
        	     TwilioRestClient client = new TwilioRestClient(account_id, auth_token,"");
        	     Map<String, String> params = new HashMap<>();
        	     
        	     String namespace = NamespaceManager.get();
        	     String path ="https://"+namespace+"-dot-sandbox-dot-agilecrmbeta.appspot.com/twiliovoicecall?message="+URLEncoder.encode(msg, "UTF-8")+"&number2="+secondCall;
            	     params.put("From", from);
        	     params.put("To", firstCall);
        	     params.put("Url", path);
        	     TwilioRestResponse twilioResponse = client.request("/" + TwilioSMSUtil.TWILIO_VERSION + "/" + TwilioSMSUtil.TWILIO_ACCOUNTS + "/" + account_id
        			+ "/" + TWILIO_CALLS, "POST", params);
        	     
        	      response = twilioResponse.getResponseText();     
        	      System.out.println("Twilio verify: " + response);
        
        		return response;
        	
        	 } catch (Exception e) {
        	         e.getMessage();
        	         System.out.println(ExceptionUtils.getFullStackTrace(e));
        	         return null;
        	    }
            } 
	
	
	public  static void makeVoiceCall(String account_id,String auth_token,String from,String firstCall,String secondCall,String msg)
	{
	    try
		{
			// Add to Pull Queue
			addToQueue(account_id, auth_token, from, firstCall,secondCall,msg);
			return;

		}
		catch (Exception e)
		{
			System.err.println("Exception occured while adding to queue..." + e.getMessage());
		}

	}
	
	
	private static void addToQueue(String account_id, String auth_token,String from, String firstCall,String secondCall,String message)
	{
	    CallDeferredTask callDeferredTask = new CallDeferredTask(callGateWay,account_id, auth_token,from ,firstCall,secondCall,message);

            PullQueueUtil.addToPullQueue(
        			Globals.BULK_BACKENDS.equals(ModuleUtil.getCurrentModuleName()) ? AgileQueues.BULK_CALL_PULL_QUEUE
        					: AgileQueues.BULK_CALL_PULL_QUEUE, callDeferredTask, from);

	}
   
}
